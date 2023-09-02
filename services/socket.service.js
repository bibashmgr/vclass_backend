const crypto = require('crypto');

// utils
const logger = require('../utils/logger.js');

const socketProvider = (io) => {
  let callLinkMaps = new Map();
  let callParticipants = [];

  // helpers:

  // UPDATE CALL PARTICIPANT LIST
  const updateCallParticipant = (callLink, participantInfo, socketId) => {
    callParticipants.push({
      ...participantInfo,
      callLink: callLink,
      socketId: socketId,
    });
  };

  // GET CALL PARTICIPANT LIST BY CALL LINK
  const getCallParticipantsByCallLink = (callLink) => {
    let newCallParticipants = [];
    callParticipants.filter((callParticipant) => {
      if (callParticipant.callLink === callLink) {
        newCallParticipants.push({
          name: callParticipant.name,
          email: callParticipant.email,
          avatar: callParticipant.avatar,
          role: callParticipant.role,
          prefs: callParticipant.prefs,
        });
      }
    });

    return newCallParticipants;
  };

  // GET SINGLE CALL PARTICIPANTS BY SOCKETID
  const getCallParticipantBySocketId = (socketId) => {
    return callParticipants.find(
      (callParticipant) => callParticipant.socketId === socketId
    );
  };

  // REMOVE SINGLE CALL PARTICIPANT BY SOCKETID
  const removeCallParticipantBySocketId = (socketId) => {
    let updatedCallParticipants = callParticipants.filter(
      (callParticipant) => callParticipant.socketId !== socketId
    );
    callParticipants = updatedCallParticipants;
  };

  // GET SINGLE CALL PARTICIPANT BY CALLLINK AND EMAIL
  const getCallParticipant = (callLink, email) => {
    return callParticipants.find(
      (callParticipant) =>
        callParticipant.callLink === callLink && callParticipant.email === email
    );
  };

  // UPDATE CALL PARTICIPANT PREFS
  const updateCallParticipantPrefs = (callLink, email, type) => {
    const updatedCallParticipants = [];
    callParticipants.map((callParticipant) => {
      if (
        callParticipant.callLink === callLink &&
        callParticipant.email === email
      ) {
        if (type === 'audio') {
          callParticipant.prefs.audio = !callParticipant.prefs.audio;
        }
        if (type === 'video') {
          callParticipant.prefs.video = !callParticipant.prefs.video;
        }

        updatedCallParticipants.push(callParticipant);
      } else {
        updatedCallParticipants.push(callParticipant);
      }
    });

    callParticipants = updatedCallParticipants;
  };

  io.on('connection', (socket) => {
    logger.info(`${socket.id} connected`);

    // portal
    socket.on('join-portal', async (data) => {
      const { subjectId, batchId } = data;

      socket.join(subjectId + batchId);
      logger.info(`${socket.id} joined ${subjectId + batchId}`);

      let callLink = callLinkMaps.get(subjectId + batchId);

      if (callLink) {
        io.to(socket.id).emit('call-already-created', {
          isVideoLinkCreated: true,
        });
      }
    });

    socket.on('leave-portal', (data) => {
      const { subjectId, batchId } = data;

      socket.leave(subjectId + batchId);
      logger.warn(`${socket.id} left ${subjectId + batchId}`);
    });

    // messages
    socket.on('send-message', (data) => {
      const { subjectId, batchId, messageInfo } = data;

      socket.to(subjectId + batchId).emit('receive-message', { messageInfo });
      logger.info(`${socket.id} sent message to ${subjectId + batchId}`);
    });

    // video-call
    socket.on('join-call', async (data) => {
      const { subjectId, batchId, callParticipantInfo } = data;

      let oldCallLink = callLinkMaps.get(subjectId + batchId);

      if (oldCallLink) {
        let participantsOfSingleCall =
          getCallParticipantsByCallLink(oldCallLink);

        updateCallParticipant(oldCallLink, callParticipantInfo, socket.id);

        socket.join(oldCallLink);
        logger.info(`${callParticipantInfo.email} joined ${oldCallLink}`);

        io.to(socket.id).emit('user-joined', participantsOfSingleCall);
        socket.broadcast.to(oldCallLink).emit('new-user-joined', {
          ...callParticipantInfo,
        });
      } else {
        let newCallLink = crypto.randomBytes(16).toString('base64');
        callLinkMaps.set(subjectId + batchId, newCallLink);
        logger.info(`${callParticipantInfo.email} just created a call-link`);

        updateCallParticipant(newCallLink, callParticipantInfo, socket.id);

        socket.join(newCallLink);
        logger.info(`${callParticipantInfo.email} joined ${newCallLink}`);

        socket.broadcast.to(subjectId + batchId).emit('call-just-created', {
          isVideoLinkCreated: true,
        });
      }
    });

    socket.on('call-user', (data) => {
      const { subjectId, batchId, caller, callee, offer } = data;

      let callLink = callLinkMaps.get(subjectId + batchId);

      const isCallParticipantExist = getCallParticipant(callLink, callee);

      if (isCallParticipantExist) {
        io.to(isCallParticipantExist.socketId).emit('incoming-call', {
          caller: caller,
          callee: callee,
          offer: offer,
        });
      }
    });

    socket.on('answer-call', (data) => {
      const { subjectId, batchId, caller, callee, answer } = data;

      let callLink = callLinkMaps.get(subjectId + batchId);

      const isCallParticipantExist = getCallParticipant(callLink, caller);

      if (isCallParticipantExist) {
        io.to(isCallParticipantExist.socketId).emit('answer-received', {
          caller: caller,
          callee: callee,
          answer: answer,
        });
      }
    });

    socket.on('send-candidate', (data) => {
      const { subjectId, batchId, sender, receiver, candidate } = data;

      let callLink = callLinkMaps.get(subjectId + batchId);

      const isCallParticipantExist = getCallParticipant(callLink, receiver);

      io.to(isCallParticipantExist.socketId).emit('receive-candidate', {
        sender: sender,
        receiver: receiver,
        candidate: candidate,
      });
    });

    socket.on('update-prefs', (data) => {
      const { subjectId, batchId, email, type } = data;

      let callLink = callLinkMaps.get(subjectId + batchId);

      updateCallParticipantPrefs(callLink, email, type);

      socket.broadcast
        .to(callLink)
        .emit('new-prefs', { email: email, type: type });
    });

    socket.on('leave-call', (data) => {
      const { subjectId, batchId, email } = data;

      let callLink = callLinkMaps.get(subjectId + batchId);

      let isCallParticipantExist = getCallParticipant(callLink, email);
      removeCallParticipantBySocketId(isCallParticipantExist.socketId);
      logger.warn(`${email} left ${callLink}`);

      socket.broadcast.to(callLink).emit('user-left', { userId: email });
      socket.leave(callLink);
    });

    socket.on('disconnect', () => {
      logger.warn(`${socket.id} disconnected`);
      let isCallParticipantExist = getCallParticipantBySocketId(socket.id);

      if (isCallParticipantExist) {
        removeCallParticipantBySocketId(socket.id);
        logger.warn(
          `${isCallParticipantExist.email} left ${isCallParticipantExist.callLink}`
        );

        socket.broadcast
          .to(isCallParticipantExist.callLink)
          .emit('user-disconnected', { userId: isCallParticipantExist.email });
      }
    });
  });
};

module.exports = socketProvider;
