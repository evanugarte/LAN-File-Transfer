import axios from 'axios';


export async function handleUpload(fileData) {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append('fileToUpload', fileData);
    axios.post('/api/upload', formData, {
      onUploadProgress: (ProgressEvent) => {
        // todo refine progress bar for cool upload
        // const progress = Math.round(
        //   ProgressEvent.loaded / ProgressEvent.total * 100) + '%';
        }
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
    });
  }

export async function handleDownload(fileId, fileName) {
  fetch(`/api/download?fileId=${fileId}`)
    .then(res => res.blob())
    .then(blob => {
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a); 
      a.click();    
      a.remove();
    })
    .catch(); // todo add website error handling
}


export async function handleDelete(fileId) {
  return new Promise((resolve, reject) => {
    axios.delete('/api/delete', {
      data: {
        fileToDelete: fileId
      },
    })
      .then(res => resolve(res))
      .catch(err => reject(err));
    });
}

export async function getAllFiles() {
  return new Promise((resolve, reject)=> {
    fetch(`/api/files`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.files) {
          resolve(data.files);
        } else {
          resolve([]);
        }
      })
      .catch((err) => reject(err));
  });
}
