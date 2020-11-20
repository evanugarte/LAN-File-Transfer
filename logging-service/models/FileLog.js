const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileLogSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true
    },
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    uploadDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    timesDownloaded: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { collection: 'FileLogs' }
);

module.exports = mongoose.model('FileLog', FileLogSchema);
