#!/bin/bash

# Python container startup script

# Get the timeout passed as an argument from Node.js
TIMEOUT=$1

# Ensure we're using the correct working directory
cd /usr/src/app || exit
clear

# we use two ways to check _if_ modules are being used (not which ones)
# if this regex returns any results, or if there's a requirements.txt file, we'll just assume that we need to install modules
# worst case scenario, pipreqs doesn't find anything to install
if grep -Eqri --include=\*.py --exclude-dir=env '(from)?.*(import)\s( ?\w+,?)*' . || [ -f "requirements.txt" ]; then
  # intro text if modules haven't been used in the package before
  if [ ! -f ".module_info_lock" ] ; then
    touch .module_info_lock
    echo "Hey PalCode user!"
    echo "It looks like you're trying to use PyPI modules."
    echo "This is either because you're importing an unknown module or you have a requirements.txt file."
    echo "I'll install any modules for you now — please be patient."
    echo "If you aren't actually using modules, don't worry — installation will fail silently."
    echo && echo
  fi

  # If the venv directory doesn't exist, create it
  if [ ! -d "env" ] ; then
    echo "Setting up environment..."
    python -m venv /usr/src/app/env 2>/dev/null
  fi

  # activate venv
  source env/bin/activate

  # if pipreqs isn't installed, install it
  if [ ! -f "env/bin/pipreqs" ] ; then
    echo "Looking for modules..."
    pip install pipreqs >/dev/null 2>/dev/null
  fi

  # assess what packages we need and add them to requirements.txt
  ./env/bin/pipreqs --force /usr/src/app >/dev/null 2>/dev/null

  # Only install requirements if they've changed
  if [ -z "$(diff requirements.txt requirements.old.txt 2>/dev/null)" ] && [ -f "requirements.old.txt" ] ; then
    echo -n ""
  else
    echo "Installing new modules. One moment..."
    pip install -r requirements.txt 2>/dev/null
    # save this version of requirements.txt so we can compare it on the next run
    cp requirements.txt requirements.old.txt >/dev/null 2>/dev/null || true

    clear
    echo "Module installation complete! Refresh PalCode to see the updated requirements.txt file."
    echo
  fi
else
  if [ -d "env" ] ; then
    echo "No modules found!"
    echo "It looks like your project no longer uses modules."
    echo "I'll delete your venv to minimise your storage footprint."
    echo
  fi

  # to keep storage space efficiently packed, remove the entire environment
  rm -rf env requirements.old.txt .module_info_lock 2>/dev/null
fi

timeout "$TIMEOUT" python index.py
