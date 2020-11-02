#include <iostream>
#include <string>

#include "multiplexer.hpp"
#include "net/server.hpp"

#include "file_handler.h"


int main(int, char**) {
	// Create a multiplexer for handling requests
	served::multiplexer mux;
	// GET /hello
  lft::FileHandler fh;
	mux.handle("/upload")
		.post([&](served::response & response, const served::request & request) {
			fh.ParseAndWriteHttpRequestBody(request.body());
			response << "hello world!";
		});	

	// Create the server and run with 10 handler threads.
	served::net::server server("127.0.0.1", "3000", mux);
	server.run(10);

	return (EXIT_SUCCESS);
}
