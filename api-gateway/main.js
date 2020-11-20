const { ApiGatewayServer } = require('./src/ApiGatewayServer');

function main() {
  let apiGatewayServer = new ApiGatewayServer();
  apiGatewayServer.startServer();
}

main();
