FROM frolvlad/alpine-gxx

RUN apk add curl boost-dev git bash make

WORKDIR /cpp_server

COPY include include/

COPY src src/

COPY setup setup

COPY Makefile Makefile

RUN mkdir /cpp_server/lib

RUN mkdir /cpp_server/uploads

RUN mkdir /cpp_server/bin

RUN chmod +x ./setup

RUN ./setup

EXPOSE 5001

CMD ["make", "run"]
