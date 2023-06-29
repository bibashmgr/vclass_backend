const mongoose = require('mongoose');

// utils
const logger = require('../utils/logger.js');

class GfsBucket {
  static instance;

  constructor() {
    if (GfsBucket.instance) {
      return GfsBucket.instance;
    }

    logger.info('Bucket Created');

    return new mongoose.mongo.GridFSBucket(mongoose.connections[0].db, {
      bucketName: 'uploads',
    });
  }
}

module.exports = GfsBucket;
