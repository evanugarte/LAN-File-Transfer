#include "http_server.h"
#include "served/multiplexer.hpp"
#include "served/net/server.hpp"

int main() {
  served::multiplexer multiplexer;
  lft::HttpServer http_server(multiplexer);

  http_server.InitializeEndpoints();
  http_server.StartServer();

  return (EXIT_SUCCESS);
}
