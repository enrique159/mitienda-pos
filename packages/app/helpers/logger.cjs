const fs = require("fs").promises;
const { getDatetime } = require("./datetime.cjs");

const FILES_LOGS_BY_TYPE = {
  info: "info.log",
  error: "error.log",
  warning: "warning.log",
};

async function writeLog(message, type) {
  const path = getLogPath(type);

  if (typeof message === "object") {
    message = JSON.stringify(message);
  }

  const logMessage = `${getDatetime()} | ${message}\n`;

  try {
    await fs.appendFile(path, logMessage, { encoding: "utf8", mode: 0o666 });
  } catch (error) {
    console.error(error);
  }
}

function getLogPath(type) {
  const dir = "logs";
  const file = FILES_LOGS_BY_TYPE[type] || FILES_LOGS_BY_TYPE.error;
  fs.mkdir(dir, { recursive: true }).catch(console.error);
  return `${dir}/${file}`;
}

const logger = {
  log: (message, type) => writeLog(message, type),
  error: (message) => writeLog(message, "error"),
  info: (message) => writeLog(message, "info"),
  warning: (message) => writeLog(message, "warning"),
};

module.exports = logger;
