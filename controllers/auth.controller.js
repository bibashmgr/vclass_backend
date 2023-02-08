const getUserInfo = async (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({
        data: req.user,
        success: true,
        message: 'Fetch userInfo',
      });
      console.log('Fetch userInfo');
    } else {
      res.status(404).json({
        data: null,
        success: false,
        message: 'Fail to fetch userInfo',
      });
      console.log('Fail to fetch userInfo');
    }
  } catch (error) {
    res.status(200).json({
      data: null,
      success: false,
      message: error.message,
    });
    console.log(error.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.logout;
    res.status(200).json({
      data: null,
      success: true,
      message: 'Logout user',
    });
    console.log('Logout user');
  } catch (error) {
    res.status(200).json({
      data: null,
      success: false,
      message: error.message,
    });
    console.log(error.message);
  }
};

module.exports = { getUserInfo, logoutUser };
