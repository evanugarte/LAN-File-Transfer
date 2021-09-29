FROM frolvlad/alpine-gxx as build_stage

RUN apk add curl boost-dev git bash make

WORKDIR /cpp_server

COPY include include/

COPY src src/

COPY setup setup

COPY Makefile Makefile

RUN mkdir /cpp_server/lib ; exit 0

RUN mkdir /cpp_server/uploads ; exit 0

RUN mkdir /cpp_server/bin; exit 0

ENV PLATFORM="docker"

RUN chmod +x ./setup

RUN ./setup

RUN make all

FROM frolvlad/alpine-gxx 

WORKDIR /cpp_server

COPY --from=build_stage /cpp_server/bin/main /cpp_server/main

EXPOSE 5001

CMD ["./main"]
