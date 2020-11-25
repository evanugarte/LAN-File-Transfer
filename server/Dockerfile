FROM gcc:4.9

WORKDIR /cpp_server

COPY include .

COPY src .

COPY setup .

COPY Makefile .

RUN mkdir /cpp_server/lib

RUN ./setup

EXPOSE 5001

CMD ["make", "run"]
