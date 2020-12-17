#pragma once

#include <iostream>
#include <string>

#include "SimpleJSON/json.hpp"
#include "mongocxx/instance.hpp"
#include "mongodb_handler.h"
#include "served/multiplexer.hpp"
#include "served/net/server.hpp"

namespace lft {
constexpr char kUploadEndpoint[] = "/upload/{file_name}/{uuid}/{file_size}";
constexpr char kDownloadEndpoint[] = "/download/{file_id}";
constexpr char kDeleteEndpoint[] = "/delete/{file_id}";
constexpr char kAllFilesEndpoint[] = "/files";
constexpr char kIpAddress[] = "0.0.0.0";
constexpr char kPort[] = "5002";
class HttpServer {
 public:
  HttpServer(served::multiplexer multiplexer) : multiplexer(multiplexer) {}

  auto SaveFileToMongoDb() {
    return [&](served::response &response, const served::request &request) {
      const std::string &file_name = request.params["file_name"];
      const std::string &uuid= request.params["uuid"];
      const std::string &file_size = request.params["file_size"];
      MongoDbHandler mhandler;
      std::cout << uuid << file_name <<  file_size<< std::endl;
      bool insert_successful = true;
          mhandler.StoreFileInformation(file_name, uuid, file_size);
      insert_successful ? served::response::stock_reply(200, response)
                        : served::response::stock_reply(400, response);
    };
  }

  auto LogDownload() {
    return [&](served::response &response, const served::request &request) {
      const std::string &file_id = request.params["file_id"];
      MongoDbHandler mhandler;
      bool insert_successful = mhandler.LogDownload(file_id);
      // std::cout << "LogDownload called, " << file_id << std::endl;
      insert_successful ? served::response::stock_reply(200, response)
                     : served::response::stock_reply(400, response);
    };
  }

  auto DeleteHandler() {
    return [&](served::response &response, const served::request &request) {
      const std::string &file_id = request.params["file_id"];
      MongoDbHandler mhandler;
      mhandler.HandleDelete(file_id);
      bool delete_successful = true;
      served::response::stock_reply(200, response);
    };
  }

  auto GetAllFiles() {
    return [&](served::response &response, const served::request &request) {
      MongoDbHandler mhandler;
      response << mhandler.GetAllDocuments();
    };
  }

  void InitializeEndpoints() {
    multiplexer.handle(kUploadEndpoint).post(SaveFileToMongoDb());
    multiplexer.handle(kDownloadEndpoint).post(LogDownload());
    multiplexer.handle(kDeleteEndpoint).del(DeleteHandler());
    multiplexer.handle(kAllFilesEndpoint).get(GetAllFiles());
  }

  void StartServer() {
    mongocxx::instance instance;
    served::net::server server(kIpAddress, kPort, multiplexer);
    std::cout << "Starting server to listen on port 5001..." << std::endl;
    server.run(10);
  }

 private:
  served::multiplexer multiplexer;
};
} // namespace lft
