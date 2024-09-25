/* eslint-env node */
const path = require("path");
const formatCommand = "prettier . --check";

module.exports = {
  "*": formatCommand,
};
