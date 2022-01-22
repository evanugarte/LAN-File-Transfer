#pragma once

#include <iostream>
#include <string>

#include "file_handler.h"
#include "served/multiplexer.hpp"
#include "served/net/server.hpp"
#include "SimpleJSON/json.hpp"

namespace lft {
constexpr char kUploadEndpoint[] = "/upload";
constexpr char kDownloadEndpoint[] = "/download/{file_name}";
constexpr char kDeleteEndpoint[] = "/delete/{file_to_delete}";
constexpr char kIpAddress[] = "0.0.0.0";
constexpr char kPort[] = "5001";
class HttpServer {
 public:
  HttpServer(served::multiplexer multiplexer, lft::FileHandler file_handler)
      : multiplexer(multiplexer), file_handler(file_handler) {}

  auto UploadHandler() {
    return [&](served::response &response, const served::request &request) {
      const json::JSON &file_handler_response =
          file_handler.ParseAndWriteHttpRequestBody(request.body());
      std::ostringstream stream;
      stream << file_handler_response;
      response << stream.str();
    };
  }

  auto DownloadHandler() {
    // we need something like below
    // https://stackoverflow.com/a/16155040
    // maybe not use served?
    return [&](served::response &response, const served::request &request) {
      const std::string &file_name = request.params["file_name"];
      std::ostringstream buffer;
      const bool &read_result =
          file_handler.WriteFileToBuffer(buffer, file_name);
      if (read_result) {
        // set content type to applicaiton/pdf hardcoded
        // if this works this is huge
        // no need for middleman anymore
        // response.set_header("Content-type", "application/pdf");
        response << buffer.str();
      } else {
        served::response::stock_reply(404, response);
      }
    };
  }

  auto DeleteHandler() {
    return [&](served::response &response, const served::request &request) {
      const std::string &file_to_delete = request.params["file_to_delete"];
      const bool &read_result = file_handler.DeleteFile(file_to_delete);
      if (read_result) {
        served::response::stock_reply(200, response);
      } else {
        served::response::stock_reply(404, response);
      }
    };
  }

  void InitializeEndpoints() {
    multiplexer.handle(kUploadEndpoint).post(UploadHandler());
    multiplexer.handle(kDownloadEndpoint).get(DownloadHandler());
    multiplexer.handle(kDeleteEndpoint).del(DeleteHandler());
  }

  void StartServer() {
    served::net::server server(kIpAddress, kPort, multiplexer);
    std::cout << "Starting server to listen on port 5001..." << std::endl;
    server.run(10);
  }

 private:
  served::multiplexer multiplexer;
  lft::FileHandler file_handler;
};
} // namespace lft
