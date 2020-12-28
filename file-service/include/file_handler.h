#pragma once

#include <filesystem>
#include <fstream>
#include <sstream>
#include <string>

#include <boost/uuid/random_generator.hpp>
#include <boost/uuid/uuid_io.hpp>
#include <SimpleJSON/json.hpp>

namespace lft {
constexpr char kUploadDirectrory[] = "uploads/";
class FileHandler {
 public:
  json::JSON ParseAndWriteHttpRequestBody(const std::string &request_body) {
    json::JSON json_response;
    boost::uuids::random_generator generate_uuid;
    const std::string &uuid_string = boost::uuids::to_string(generate_uuid());
    const bool &write_result = WriteBufferToFile(
        request_body.c_str(), request_body.size(), uuid_string);
    json_response["upload_successful"] = write_result;
    json_response["uuid_string"] = uuid_string;
    return json_response;
  }

  bool WriteBufferToFile(const char *buffer, long size,
                         const std::string &file_name) {
    std::ofstream file_to_create(GenerateFilePath(file_name), std::ios::out);
    if (file_to_create.fail()) {
      return false;
    } else {
      file_to_create.write(buffer, size);
      file_to_create.close();
      return true;
    }
  }

  bool WriteFileToBuffer(std::ostringstream& buffer,
                         const std::string &file_name) {
    std::ifstream file_to_read(GenerateFilePath(file_name));
    if (file_to_read.fail()) {
      return false;
    } else {
      buffer << file_to_read.rdbuf();
      return true;
    }
  }

  bool DeleteFile(const std::string &file_to_delete) {
    bool delete_successful = false;
    if (std::filesystem::exists(GenerateFilePath(file_to_delete))) {
      delete_successful =
          std::filesystem::remove(GenerateFilePath(file_to_delete));
    }
    return delete_successful;
  }

 private:
  static inline std::string GenerateFilePath(const std::string & file_name) {
    return kUploadDirectrory + file_name;
  }
};
}  // namespace lft
