#pragma once

#include <iostream>
#include <numeric>
#include <string>

#include "SimpleJSON/json.hpp"
#include "bsoncxx/builder/stream/document.hpp"
#include "bsoncxx/json.hpp"
#include "mongocxx/client.hpp"
#include "mongocxx/database.hpp"
#include "mongocxx/uri.hpp"
#include "mongocxx/v_noabi/mongocxx/result/delete.hpp"

namespace lft {
constexpr char kMongoDbUri[] = "mongodb://172.16.0.1:27017";
constexpr char kDatabaseName[] = "lft";
constexpr char kFileLogCollectionName[] = "FileLogs";

class MongoDbHandler {
 public:
  MongoDbHandler()
      : uri(mongocxx::uri(kMongoDbUri)),
        client(mongocxx::client(uri)), db(client[kDatabaseName]) {}

  bool StoreFileInformation(const std::string &file_name,
                            const std::string &uuid,
                            const std::string &file_size) {
    mongocxx::collection collection = db[kFileLogCollectionName];
    auto builder = bsoncxx::builder::stream::document{};
    bsoncxx::v_noabi::document::value doc_value =
        builder << "fileName" << file_name << "uuid" << uuid << "fileSize"
                << file_size << "downloadCount" << 0 << "uploadDate"
                << bsoncxx::types::b_date(std::chrono::system_clock::now())
                << bsoncxx::builder::stream::finalize;

    bsoncxx::stdx::optional<mongocxx::result::insert_one> result =
        collection.insert_one(std::move(doc_value));
    return true;
  }

  bool LogDownload(const std::string &file_id) {
    mongocxx::collection collection = db[kFileLogCollectionName];
    auto builder = bsoncxx::builder::stream::document{};
    bsoncxx::document::value query_doc =
        builder << "uuid" << file_id << bsoncxx::builder::stream::finalize;
    bsoncxx::document::value update_doc =
        builder << "$inc" << bsoncxx::builder::stream::open_document
                << "downloadCount" << 1
                << bsoncxx::builder::stream::close_document
                << bsoncxx::builder::stream::finalize;
    collection.update_one(std::move(query_doc), std::move(update_doc));
    return true;
  }

  bool HandleDelete(const std::string& file_id) {
    mongocxx::collection collection = db[kFileLogCollectionName];
    auto builder = bsoncxx::builder::stream::document{};
    bsoncxx::document::value doc =
        builder << "uuid" << file_id << bsoncxx::builder::stream::finalize;
    bsoncxx::stdx::optional<mongocxx::result::delete_result> result =
        collection.delete_one(doc.view());
    return true;
  }

  json::JSON GetAllDocuments() {
    mongocxx::collection collection = db[kFileLogCollectionName];
    mongocxx::cursor cursor = collection.find({});
    json::JSON result;
    result["files"] = json::Array();
    if (cursor.begin() != cursor.end()) {
      for (auto doc : cursor) {
        result["files"].append(bsoncxx::to_json(doc));
      }
    }
    return result;
  }

 private:
  mongocxx::uri uri;
  mongocxx::client client;
  mongocxx::database db;
};
}  // namespace lft
