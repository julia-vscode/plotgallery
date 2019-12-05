const {
    override,
    setWebpackTarget
  } = require("customize-cra");
  
  module.exports = override(
    setWebpackTarget('electron-renderer')
  );