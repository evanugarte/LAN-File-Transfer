#pragma once

#include "bsoncxx/json.hpp"
#include "mongocxx/client.hpp"
#include "mongocxx/database.hpp"
#include "mongocxx/gridfs/bucket.hpp"
#include "mongocxx/instance.hpp"
#include "mongocxx/uri.hpp"

namespace lft {
class GridFsHandler {
 public:
  explicit GridFsHandler(const mongocxx::v_noabi::uri& uri) {
    client = mongocxx::v_noabi::client{uri};
    bucket = client["database"].gridfs_bucket();
  }

  void FindAllFiles() {
    bsoncxx::stdx::optional<mongocxx::v_noabi::cursor> maybe_result =
        bucket.find({});
    if (maybe_result &&
        maybe_result.value().begin() != maybe_result.value().end()) {
      std::cout << "we got something!" << std::endl;
      for (auto&& doc : maybe_result.value()) {
        auto json_doc = bsoncxx::to_json(doc);
        std::cout << json_doc << std::endl;
      }
    }
  }

  void UploadFile() {
    // add logic to upload if same name doesnt exist
    bool file_exists = false;
    if (file_exists) {
      // if file doesnt exist
      // upload something
      // use upload_from_stream
      // http://mongocxx.org/api/current/classmongocxx_1_1gridfs_1_1bucket.html#a7a678284a9c8cd6b5d2f2dd079dba446
      std::ifstream myfile("setup");
      bucket.upload_from_stream("setup.txt", &myfile);
    } else {
      // else try to download it to bytes?
      // std::ofstream outfile ("new.txt",std::ofstream::binary);
      // bsoncxx::v_noabi::types::bson_value::view hi;
      // bucket.download_to_stream(hi, outfile);
    }
  }

 private:
  mongocxx::v_noabi::client client;
  mongocxx::v_noabi::gridfs::bucket bucket;
  mongocxx::v_noabi::instance instance;
};
}  // namespace lft
