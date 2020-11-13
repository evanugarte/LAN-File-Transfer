#include <fstream>
#include <sstream>
#include <string>

#include <boost/uuid/random_generator.hpp>
#include <boost/uuid/uuid_io.hpp>
#include <SimpleJSON/json.hpp>

namespace lft {
class FileHandler {
 public:
  long GetFileSize(std::ifstream *file) {
    file->seekg(0, file->end);
    long size = file->tellg();
    file->seekg(0);
    return size;
  }

  long GetFileSize(const std::string &file_name) {
    std::ifstream file(file_name, std::ifstream::binary);
    long size = GetFileSize(&file);
    file.close();
    return size;
  }

  json::JSON ParseAndWriteHttpRequestBody(const std::string &request_body) {
    json::JSON json_response;
    boost::uuids::random_generator generate_uuid;
    const std::string &uuid_string = boost::uuids::to_string(generate_uuid());
    WriteBufferToFile(request_body.c_str(), request_body.size(), uuid_string);
    json_response["upload_successful"] = true;
    json_response["uuid_string"] = uuid_string;
    return json_response;
  }

  void WriteBufferToFile(const char *buffer, long size,
                         const std::string &file_name) {
    std::ofstream file_to_create(file_name, std::ios::out);
    file_to_create.write(buffer, size);
    file_to_create.close();
  }

  void WriteFileToBuffer(std::ostringstream& buffer,
                         const std::string &file_name) {
    std::ifstream file_to_read(file_name);
    buffer << file_to_read.rdbuf();
  }
};
}  // namespace lft
