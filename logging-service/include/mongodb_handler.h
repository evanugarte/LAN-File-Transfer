#pragma once

#include <cstdlib>
#include <iostream>
#include <numeric>
#include <string>

#include "SimpleJSON/json.hpp"
#include "bsoncxx/builder/stream/document.hpp"
#include "bsoncxx/v_noabi/bsoncxx/document/element.hpp"
#include "bsoncxx/json.hpp"
#include "mongocxx/client.hpp"
#include "mongocxx/database.hpp"
#include "mongocxx/uri.hpp"
#include "mongocxx/v_noabi/mongocxx/result/delete.hpp"

namespace lft {
const char *kMongoDbUri = std::getenv("MONGODB_URL")
                              ? std::getenv("MONGODB_URL")
                              : "mongodb://127.0.0.1:27017";
constexpr char kDatabaseName[] = "lft";
constexpr char kFileLogCollectionName[] = "FileLogs";

class MongoDbHandler {
 public:
  MongoDbHandler()
      : uri(mongocxx::uri(kMongoDbUri)),
        client(mongocxx::client(uri)),
        db(client[kDatabaseName]) {}

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

    bsoncxx::stdx::optional<mongocxx::result::insert_one> maybe_result =
        collection.insert_one(std::move(doc_value));
    return (maybe_result ?
            maybe_result->inserted_id().get_oid().value.to_string().size() != 0
          : false);
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
    bsoncxx::stdx::optional<mongocxx::result::update> maybe_result =
        collection.update_one(std::move(query_doc), std::move(update_doc));
    return (maybe_result ?
            maybe_result->modified_count() != 0
          : false);
  }

  bool HandleDelete(const std::string &file_id) {
    mongocxx::collection collection = db[kFileLogCollectionName];
    auto builder = bsoncxx::builder::stream::document{};
    bsoncxx::document::value doc =
        builder << "uuid" << file_id << bsoncxx::builder::stream::finalize;
    bsoncxx::stdx::optional<mongocxx::result::delete_result> maybe_result =
        collection.delete_one(doc.view());
    return (maybe_result ?
            maybe_result->deleted_count() != 0
          : false);
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

  json::JSON GetFileNameById(const std::string &file_id) {
    mongocxx::collection collection = db[kFileLogCollectionName];
    auto builder = bsoncxx::builder::stream::document{};

    bsoncxx::document::value doc =
        builder << "uuid" << file_id << bsoncxx::builder::stream::finalize;
    mongocxx::options::find options{};
    options.projection(bsoncxx::builder::basic::make_document(
        bsoncxx::builder::basic::kvp("fileName", 1)));
    bsoncxx::stdx::optional<bsoncxx::document::value> maybe_result =
        collection.find_one(doc.view(), options);

    json::JSON result;
    if (maybe_result) {
      result["fileName"] = json::Object();
      result["fileName"] =
          json::JSON::Load(bsoncxx::to_json(*maybe_result))["fileName"];
    }
    return result;
  }

 private:
  mongocxx::uri uri;
  mongocxx::client client;
  mongocxx::database db;
};
}  // namespace lft
