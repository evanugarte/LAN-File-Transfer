#pragma once

#include <sys/time.h>

#include <string>

#include "cpprest/http_listener.h"
#include "cpprest/uri.h"

namespace lft {
class HttpServer {
 public:
  static constexpr char kFindFileUri[] = "/find";
  static constexpr char kUploadFileUri[] = "/upload";
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
    if (uri == kFindFileUri) {
      // handle find file
    } else if (uri == kUploadFileUri) {
      // handle upload
    }
    message.reply(web::http::status_codes::OK, "nama jeff 2");
    return;
  }
  web::http::experimental::listener::http_listener message_listener;
};
} // namespace lft
