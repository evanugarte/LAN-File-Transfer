FROM repo.treescale.com/kafumji/lft-mongocxx-base

WORKDIR /cpp_server

RUN apt-get update \
  && apt-get install -y wget cmake git make g++ curl python3 \
  && apt-get install sudo -y

COPY include include/

COPY src src/

COPY setup setup

COPY Makefile Makefile

RUN mkdir /cpp_server/lib

RUN mkdir /cpp_server/uploads

RUN mkdir /cpp_server/bin

RUN chmod +x ./setup

RUN ["./setup", "--type", "docker"]

EXPOSE 5002

RUN rm -rf mongo-c-driver-1.17.0*

RUN make all

ENV MONGODB_URL "mongodb://172.16.0.1:27017"

CMD ["./bin/main"]
