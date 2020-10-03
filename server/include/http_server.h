#pragma once

#include <sys/time.h>

#include <string>

#include "cpprest/http_listener.h"
#include "cpprest/uri.h"
#include "gridfs_handler.h"
#include "mongocxx/uri.hpp"

namespace lft {
class HttpServer {
 public:
  static constexpr char kFindFileUri[] = "/find";
  static constexpr char kUploadFileUri[] = "/upload";
  static constexpr char kFaviconUri[] = "/favicon.ico";
  explicit HttpServer(const utility::string_t& url) {
    message_listener = web::http::experimental::listener::http_listener(url);
    message_listener.support(
        web::http::methods::GET,
        std::bind(&HttpServer::HandleGet, this, std::placeholders::_1));
  }
  pplx::task<void> open() { return message_listener.open(); }
  pplx::task<void> close() { return message_listener.close(); }

 private:
  void HandleGet(const web::http::http_request& message) {
    const std::string& uri = message.absolute_uri().to_string();
    if (uri == kFaviconUri) {
      message.reply(web::http::status_codes::NotFound);
      return;
    }
    const mongocxx::v_noabi::uri mongo_uri = mongocxx::v_noabi::uri{};
    GridFsHandler gridfs_handler(mongo_uri);
    if (uri == kFindFileUri) {
      gridfs_handler.FindAllFiles();
    } else if (uri == kUploadFileUri) {
      gridfs_handler.UploadFile();
    }
    message.reply(web::http::status_codes::OK, "nama jeff 2");
    return;
  }
  web::http::experimental::listener::http_listener message_listener;
};
} // namespace lft
