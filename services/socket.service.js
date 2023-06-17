// utils
const logger = require('../utils/logger.js');

const socketManager = (io) => {
  io.on('connection', (socket) => {
    logger.info(`${socket.id} connected`);

    // portal
    socket.on('join-portal', async (data) => {
      const { subjectId, userInfo } = data;

      socket.join(subjectId + userInfo.batch);
      logger.info(`${socket.id} joined ${subjectId + userInfo.batch}`);
    });

    socket.on('leave-portal', (data) => {
      const { subjectId, userInfo } = data;

      socket.leave(subjectId + userInfo.batch);
      logger.info(`${socket.id} left ${subjectId + userInfo.batch}`);
    });

    // messages
    socket.on('send-message', (data) => {
      const { subjectId, userInfo, messageInfo } = data;

      socket.broadcast
        .to(subjectId + userInfo.batch)
        .emit('receive-message', { messageInfo });
      logger.info(`${socket.id} sent message to ${subjectId + userInfo.batch}`);
    });

    socket.on('disconnect', () => {
      logger.warn(`${socket.id} disconnected`);
    });
  });
};

module.exports = socketManager;
