CXX		  := g++
CXX_FLAGS := -Wall -Wextra -std=c++11 -ggdb

BIN		:= bin
SRC		:= src/*.cpp served/*.cpp served/mux/*.cpp served/net/*.cpp
INCLUDE	:= -Iinclude -Iserved -Iserved/mux -Iserved/net
LIB		:= lib

LIBRARIES	:= -lboost_system -lpthread
EXECUTABLE	:= main


all: $(BIN)/$(EXECUTABLE)

run: clean all
	clear
	./$(BIN)/$(EXECUTABLE)

$(BIN)/$(EXECUTABLE): $(SRC)
	$(CXX) $(CXX_FLAGS) $(INCLUDE) -L$(LIB) $^ -o $@ $(LIBRARIES)

clean:
	-rm $(BIN)/*
