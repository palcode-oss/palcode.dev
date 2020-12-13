#!/bin/bash

# Node.js container startup script

# Get the timeout passed as an argument from Node.js
TIMEOUT=$1

# Ensure we're using the correct working directory
cd /usr/src/app || exit
clear

NODE_VERSION=$(node --version)
printf "\033[0;30mPalCode 0.3.0 — Node %s\033[0m \n" "$NODE_VERSION"

timeout --foreground "$TIMEOUT" node index.js
