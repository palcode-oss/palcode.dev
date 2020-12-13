#!/bin/bash

# Node.js container startup script
source /opt/common/common.sh

# Get the timeout passed as an argument from Node.js
TIMEOUT=$1

# Ensure we're using the correct working directory
cd /usr/src/app || exit
clear

MODULE_COMMAND=$(node /opt/runner/detect-modules.js 2>/dev/null) || syntax_err

if [ -n "$MODULE_COMMAND" ] ; then
  modules_info

  if [ ! -f "package.json" ] ; then
    npm init -y >/dev/null
  fi

  eval "$MODULE_COMMAND"
elif [ "$MODULE_COMMAND" != 'NO' ] ; then
  delete_env
fi

clear

NODE_VERSION=$(node --version)
printf "\033[0;30mPalCode 0.3.0 — Node %s\033[0m \n" "$NODE_VERSION"

timeout --foreground "$TIMEOUT" node index.js
