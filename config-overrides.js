const {
    override,
    setWebpackTarget
  } = require("customize-cra");
  const path = require("path");
  
  module.exports = override(
    setWebpackTarget('node')
  );