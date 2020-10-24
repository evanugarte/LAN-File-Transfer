# LAN File Transfer
Using React.js, C++ and MongoDB, this application allows files to be hosted and
 transferred over local networks.

## Project Architecture
[![lft-architecture](https://user-images.githubusercontent.com/36345325/97093149-6e386c00-15fe-11eb-96c7-829542e2e1c2.png)](https://user-images.githubusercontent.com/36345325/97093149-6e386c00-15fe-11eb-96c7-829542e2e1c2.png)

### LAN File Transfer Website
Using React, this website will allow users visiting to upload, download
 and view stored files from within a local network.

### API Gateway
This will handle requests from the React client to fetch files and their
 metadata. The API Gateway will be written in Node and will split HTTP requests
 between the two backend services.

### File Logging Service
The File Logging Service will store any associated information about uploaded
 files such as size, upload date, name, etc. We can use the data stored
 here for analytics and looking up files.

### File Storing Service
Written in C++, this service will read and write bytestreams to storage. Using
 Microsoft's [`cpprestsdk`](https://github.com/microsoft/cpprestsdk) library,
 it will listen for incoming HTTP requests from the API Gateway.

## Coming Soon (Nov. 2020)
- Getting started guide
- An actual working application
- A CLI tool to get started?
