#include "file_handler.h"
#include "http_server.h"
#include "served/multiplexer.hpp"
#include "served/net/server.hpp"

int main(int, char **) {
  served::multiplexer multiplexer;
  lft::FileHandler file_handler;
  lft::HttpServer http_server(multiplexer, file_handler);

  http_server.InitializeEndpoints();
  http_server.StartServer();

  return (EXIT_SUCCESS);
}
