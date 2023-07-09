// utils
const logger = require('../utils/logger.js');

const socketManager = (io) => {
  io.on('connection', (socket) => {
    logger.info(`${socket.id} connected`);

    // portal
    socket.on('join-portal', async (data) => {
      const { subjectId, batchId } = data;

      socket.join(subjectId + batchId);
      logger.info(`${socket.id} joined ${subjectId + batchId}`);
    });

    socket.on('leave-portal', (data) => {
      const { subjectId, batchId } = data;

      socket.leave(subjectId + batchId);
      logger.info(`${socket.id} left ${subjectId + batchId}`);
    });

    // messages
    socket.on('send-message', (data) => {
      const { subjectId, batchId, messageInfo } = data;

      socket.broadcast
        .to(subjectId + batchId)
        .emit('receive-message', { messageInfo });
      logger.info(`${socket.id} sent message to ${subjectId + batchId}`);
    });

    socket.on('disconnect', () => {
      logger.warn(`${socket.id} disconnected`);
    });
  });
};

module.exports = socketManager;
