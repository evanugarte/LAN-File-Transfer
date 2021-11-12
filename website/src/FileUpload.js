import React, { useState, useRef, useEffect } from 'react';
import { handleUpload } from './ApiFunctions/ApiHandler';

export default function FileUpload() {
  const [fileToUpload, setFileToUpload] = useState();
  const [fileInput, setFileInput] = useState();
  const [showUploadStatus, setShowUploadStatus] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("Uploading...");
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const intervalRef = useRef();

  useEffect(() => {
    if (countdown <= 0) {
      resetFileInfo();
    }
  }, [countdown]);

  function resetFileInfo() {
    clearInterval(intervalRef.current);
    setShowUploadStatus(false)
    setShowCountdown(false);
    setFileToUpload(null);
    setUploadStatus("Uploading...");
    setCountdown(10);
  }

  function handleChange(event) {
    resetFileInfo();
    if (event.target.files[0]) {
      setFileToUpload(event.target.files[0]);
    } else {
      setFileToUpload(null);
    }
  }

  async function uploadFile() {
    if (fileToUpload) {
      try {
        setShowUploadStatus(true);
        await handleUpload(fileToUpload);
        if (fileInput) {
          fileInput.value = '';
        }
        setUploadStatus("Done!");
      } catch (error) {
        setUploadStatus("Failed!");
      } finally {
        setShowCountdown(true);
        intervalRef.current = setInterval(() => setCountdown((countdown) => countdown - 1), 1000);
      }
    }
  }

  return (
    <div>
      <h1>file upload</h1>
      <div style={{ display: 'inline-block' }}>
        <input onChange={handleChange} ref={el => setFileInput(el)} type='file' />
        <button disabled={!fileToUpload} onClick={uploadFile}>upload</button>
      </div>
      {
        showUploadStatus && <React.Fragment>
          <p>
            {fileToUpload.name}: <span id="status">
              {uploadStatus}
            </span>
          </p>
        </React.Fragment>
      }
      {
        showCountdown && <p>Closing dialog in {countdown} seconds...</p>
      }
    </div>
  );
}
