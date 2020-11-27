import React, { useState } from 'react';
import { handleUpload } from './ApiFunctions/ApiHandler';

export default function FileUpload() {
  const [fileToUpload, setFileToUpload] = useState();
  function handleChange(event) {
    if (event.target.files[0]) {
      setFileToUpload(event.target.files[0]);
    } else {
      setFileToUpload(null);
    }
  }

  function uploadFile() {
    if (fileToUpload) {
      handleUpload(fileToUpload);
    }
  }
  return (
    <div>
      <h1>file upload</h1>
      <div style={{display: 'inline-block'}}>
        <input onChange={handleChange} type="file" />
        <button disabled={!fileToUpload} onClick={uploadFile}>upload</button>
      </div>
    </div>
  );
}
