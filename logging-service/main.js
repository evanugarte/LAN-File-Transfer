const { LoggingServer } = require('./src/LoggingServer');

function main() {
  const loggingServer = new LoggingServer();
  loggingServer.startServer();
}

main();
