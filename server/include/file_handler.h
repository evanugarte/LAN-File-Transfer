#include <fstream>
#include <string>

namespace lft {
constexpr char kBeginningOfContentBorder[] = "\r\n\r\n";
constexpr char kEndOfContentBorder[] = "----------------------------";
constexpr uint8_t kBeginningOfContentOffset = 4;
constexpr uint8_t kEndOfContentOffset = 2;

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

  void ParseAndWriteHttpRequestBody(const std::string& request_body) {
      size_t position = request_body.find(kBeginningOfContentBorder);
      std::string parsed_body = request_body.substr(position + kBeginningOfContentOffset);
      position = parsed_body.rfind(kEndOfContentBorder);
      parsed_body.erase(position - kEndOfContentOffset);
      WriteBufferToFile(parsed_body.c_str(), parsed_body.size(), "output");
  }

  void WriteBufferToFile(const char *buffer, long size,
                         const std::string &file_name) {
    std::ofstream file_to_create(file_name, std::ios::out);
    file_to_create.write(buffer, size);
    file_to_create.close();
  }

  void WriteFileToBuffer(char *buffer, const std::string &file_name) {
    std::ifstream file_to_read(file_name, std::ifstream::binary);
    long size = GetFileSize(&file_to_read);
    file_to_read.read(buffer, size);
    file_to_read.close();
  }
};
}  // namespace lft
