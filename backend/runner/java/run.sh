#!/bin/bash

# Java container startup script
source /opt/common/common.sh

# Get the timeout passed as an argument from Node.js
TIMEOUT=$1

# Ensure we're using the correct working directory
cd /usr/src/app || exit
clear

printf "\033[0;30mPalCode Runner\n"
java --version
printf "\033[0m\n"

timeout --foreground "$TIMEOUT" java Main.java
