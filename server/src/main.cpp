#include <SimpleJSON/json.hpp>
#include <iostream>
#include <string>

#include "file_handler.h"
#include "served/multiplexer.hpp"
#include "served/net/server.hpp"

int main(int, char **) {
  served::multiplexer mux;
  lft::FileHandler fh;
  mux.handle("/upload").post(
      [&](served::response &response, const served::request &request) {
        const json::JSON &file_handler_response =
            fh.ParseAndWriteHttpRequestBody(request.body());
        std::ostringstream stream;
        stream << file_handler_response;
        response << stream.str();
      });

  served::net::server server("127.0.0.1", "5001", mux);
  server.run(10);

  return (EXIT_SUCCESS);
}
