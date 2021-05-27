#pragma once

#include <iostream>
#include <string>

#include "SimpleJSON/json.hpp"
#include "mongocxx/instance.hpp"
#include "mongodb_handler.h"
#include "served/multiplexer.hpp"
#include "served/net/server.hpp"

namespace lft {
constexpr char kUploadEndpoint[] = "/upload";
constexpr char kDownloadEndpoint[] = "/download";
constexpr char kDeleteEndpoint[] = "/delete";
constexpr char kAllFilesEndpoint[] = "/files";
constexpr char kIpAddress[] = "0.0.0.0";
constexpr char kPort[] = "5002";
constexpr int kThreads = 10;
class HttpServer {
 public:
  HttpServer(served::multiplexer multiplexer) : multiplexer(multiplexer) {}

  auto SaveFileToMongoDb() {
    return [&](served::response &response, const served::request &request) {
      json::JSON request_body = json::JSON::Load(request.body());
      MongoDbHandler mhandler;
      bool insert_successful = mhandler.StoreFileInformation(
          request_body["fileName"].ToString(), request_body["uuid"].ToString(),
          std::to_string(request_body["fileSize"].ToInt()));
      insert_successful ? served::response::stock_reply(200, response)
                        : served::response::stock_reply(400, response);
    };
  }

  auto LogDownload() {
    return [&](served::response &response, const served::request &request) {
      json::JSON request_body = json::JSON::Load(request.body());
      const std::string &file_id = request_body["fileId"].ToString();
      MongoDbHandler mhandler;
      bool update_successful = mhandler.LogDownload(file_id);
      if (update_successful) {
        const json::JSON &all_documents = mhandler.GetFileNameById(file_id);
        std::ostringstream stream;
        stream << all_documents;
        response << stream.str();
      } else {
        served::response::stock_reply(404, response);
      }
    };
  }

  auto DeleteHandler() {
    return [&](served::response &response, const served::request &request) {
      json::JSON request_body = json::JSON::Load(request.body());
      MongoDbHandler mhandler;
      bool delete_successful =
          mhandler.HandleDelete(request_body["fileId"].ToString());
      delete_successful ? served::response::stock_reply(200, response)
                        : served::response::stock_reply(404, response);
    };
  }

  auto GetAllFiles() {
    return [&](served::response &response, const served::request &request) {
      MongoDbHandler mhandler;
      const json::JSON &all_documents = mhandler.GetAllDocuments();
      std::ostringstream stream;
      stream << all_documents;
      response << stream.str();
    };
  }

  void InitializeEndpoints() {
    multiplexer.handle(kUploadEndpoint).post(SaveFileToMongoDb());
    multiplexer.handle(kDownloadEndpoint).post(LogDownload());
    multiplexer.handle(kDeleteEndpoint).post(DeleteHandler());
    multiplexer.handle(kAllFilesEndpoint).get(GetAllFiles());
  }

  void StartServer() {
    mongocxx::instance instance;
    served::net::server server(kIpAddress, kPort, multiplexer);
    std::cout << "Starting server to listen on port 5002..." << std::endl;
    server.run(kThreads);
  }

 private:
  served::multiplexer multiplexer;
};
} // namespace lft
