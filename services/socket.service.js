// utils
const logger = require('../utils/logger.js');

const socketManager = (io) => {
  io.on('connection', (socket) => {
    logger.info(`${socket.id} connected`);

    socket.on('disconnect', () => {
      logger.warn(`${socket.id} disconnected`);
    });
  });
};

module.exports = socketManager;
