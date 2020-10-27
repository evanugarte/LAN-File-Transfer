#include <fstream>
#include <string>

namespace lft {
class FileHander {
 public:
  long GetFileSize(std::ifstream* file) {
    file->seekg(0, file->end);
    long size = file->tellg();
    file->seekg(0);
    return size;
  }

  long GetFileSize(const std::string& file_name) {
    std::ifstream file(file_name, std::ifstream::binary);
    long size = GetFileSize(&file);
    file.close();
    return size;
  }

  void WriteBufferToFile(char* buffer, long size, const std::string& file_name) {
    std::ofstream file_to_create(file_name, std::ofstream::binary);
    file_to_create.write(buffer, size);
    file_to_create.close();
  }

  void WriteFileToBuffer(char* buffer, const std::string& file_name) {
    std::ifstream file_to_read(file_name, std::ifstream::binary);
    long size = GetFileSize(&file_to_read);
    file_to_read.read(buffer, size);
    file_to_read.close();
  }
};
}  // namespace lft
