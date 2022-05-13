# LAN File Transfer
Using React.js, C++ and MongoDB, this application allows files to be hosted and
 transferred over local networks.

## How to Run
with docker-compose installed, simply do 
```
docker-compose up
```

the website will be accessible at `http://localhost:3000`.

## Project Architecture
[![lft-architecture](https://user-images.githubusercontent.com/36345325/104837278-49077280-5868-11eb-853a-614c12b05da8.png)](https://user-images.githubusercontent.com/36345325/104837278-49077280-5868-11eb-853a-614c12b05da8.png)

### LAN File Transfer Website
Using React, this website allows users to upload, download
 and view stored files from within a local network. See
 [`website/`](https://github.com/evanugarte/LAN-File-Transfer/tree/master/website)
 for all website code.

### API Gateway
This handles requests from the React client to fetch files and their
 metadata. The API Gateway is be written in Node and splits HTTP requests
 between the two backend services. See
 [`api-gateway/`](https://github.com/evanugarte/LAN-File-Transfer/tree/master/api-gateway)
 for API Gateway code.

### File Logging Service
The File Logging Service stores any associated information about uploaded
 files such as size, upload date, name, etc. We can use the data stored
 here for analytics and looking up files. See
 [`logging-service/`](https://github.com/evanugarte/LAN-File-Transfer/tree/master/logging-service)
 for File Logging Service code.

### File Storing Service
Written in C++, this service reads and writes bytestreams to storage. Using
 [@<b>meltwater](https://github.com/meltwater)'s
 [`served`](https://github.com/meltwater/served) library,
 listens for incoming HTTP requests from the API Gateway. See
 [`file-service/`](https://github.com/evanugarte/LAN-File-Transfer/tree/master/file-service)
 for File Storing Service code.
