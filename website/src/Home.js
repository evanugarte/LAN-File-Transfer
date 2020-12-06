import React, { useEffect, useState } from 'react';

import FileUpload from './FileUpload';
import {
  handleDownload,
  getAllFiles,
  handleDelete,
} from './ApiFunctions/ApiHandler';
import { humanizeFileSize } from './helpers/humanizeFileSize'

function File({fileName, fileSize, uploadDate, uuid}) {
  return (
    <tr>
      <td>{fileName}</td>
      <td>{humanizeFileSize(fileSize)}</td>
      <td>{uploadDate}</td>
      <td>
        <button
          onClick={() => {
            handleDownload(uuid, fileName)
          }}
          >
          download
        </button>
      </td>
      <td>
        <button
          style={{ backgroundColor: 'red', color: 'wheat' }}
          onClick={() => {
            handleDelete(uuid)
          }}
          >
          delete
        </button>
      </td>
    </tr>
  );
}

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    renderUploadedFiles();
  }, []);

  async function renderUploadedFiles() {
    const files = await getAllFiles();
    setUploadedFiles(files);
  }
  return (
    <div>
      <FileUpload />
      {uploadedFiles.length ? <h1>heres what you uploaded</h1> : <div />}
      <table>
        <tbody>
          <tr>
            <th>File Name</th>
            <th>File Size</th>
            <th>Upload Date</th>
          </tr>
          {uploadedFiles.map((file, index) => <File key={index} {...file} />)}
        </tbody>
      </table>
    </div>
  );
}
