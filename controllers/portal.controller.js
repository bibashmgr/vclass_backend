const httpStatus = require('http-status');

// utils
const logger = require('../utils/logger.js');

// models
const portalModel = require('../models/portal.model.js');

const getPortalsByBatch = async (req, res) => {
  try {
    portalModel
      .find({ batch: req.params.batchId, teacher: req.user._id })
      .populate(['subject'])
      .then((portals) => {
        logger.info('Fetch Portals');
        return res.status(httpStatus.OK).json({
          data: portals,
          success: true,
          message: 'Fetch Portals',
        });
      });
  } catch (error) {
    logger.error(error.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getPortalsByBatch };
