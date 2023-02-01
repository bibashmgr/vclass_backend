const welcomeScreen = (req, res) => {
  res.status(200).json({
    data: null,
    success: true,
    message: 'Hello',
  });
};

module.exports = { welcomeScreen };
