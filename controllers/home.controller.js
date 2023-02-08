const welcomeScreen = (req, res) => {
  try {
    res.status(200).json({
      data: null,
      success: true,
      message: 'Hello',
    });
    console.log('method: GET, endpoint: /');
  } catch (error) {
    res.status(200).json({
      data: null,
      success: false,
      message: error.message,
    });
  }
};

module.exports = { welcomeScreen };
