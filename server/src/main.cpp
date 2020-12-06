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

  mux.handle("/download/{file_name}").get(
      [&](served::response &response, const served::request &request) {
        const std::string &file_name = request.params["file_name"];
        std::ostringstream buffer;
        const bool &read_result = fh.WriteFileToBuffer(buffer, file_name);
        if (read_result) {
          response << buffer.str();
        } else {
          served::response::stock_reply(404, response);
        }
      });

  mux.handle("/delete/{file_to_delete}").del(
      [&](served::response &response, const served::request &request) {
        const std::string &file_to_delete = request.params["file_to_delete"];
        const bool &read_result = fh.DeleteFile(file_to_delete);
        if (read_result) {
          served::response::stock_reply(200, response);
        } else {
          served::response::stock_reply(404, response);
        }
      });

  served::net::server server("0.0.0.0", "5001", mux);
  std::cout << "Starting server to listen on port 5001..." << std::endl;
  server.run(10);

  return (EXIT_SUCCESS);
}
