#include <iostream>

#include "http_server.h"

int main() {
  utility::string_t address = U("http://127.0.0.1:3000");
  web::uri_builder uri(address);
  auto uri_to_listen = uri.to_uri().to_string();
  auto http_server = std::unique_ptr<lft::HttpServer>(
      new lft::HttpServer(uri_to_listen));
  http_server->open().wait();

  std::cout << "Listening for requests at " << address << std::endl;
  std::cout << "Press ENTER to exit." << std::endl;

  std::string line;
  std::getline(std::cin, line);
  http_server->close().wait();
}
