FROM evanugarte/mongocxx-base

WORKDIR /cpp_server

RUN apt-get update --allow-releaseinfo-change \
  && apt-get install -y wget cmake git make g++ curl python3 \
  && apt-get install sudo -y

COPY include include/

COPY src src/

COPY setup setup

COPY Makefile Makefile

RUN mkdir /cpp_server/lib; exit 0

RUN mkdir /cpp_server/uploads; exit 0

RUN mkdir /cpp_server/bin; exit 0

ENV PLATFORM="docker"

RUN chmod +x ./setup

RUN ["./setup", "--type", "docker"]

EXPOSE 5002

RUN rm -rf mongo-c-driver-1.17.0*

RUN make all

ENV MONGODB_URL "mongodb://mongo-lft:27017"

CMD ["./bin/main"]
