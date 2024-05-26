#!/bin/bash

export PYTHONPATH=$PYTHONPATH:/home/alex/Documents/git-repos/snake-whisperer

# args
RUNSERVER=false
MAKE_MIGRATIONS=false
MIGRATE=false
FLUSH=false

# parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -r|--runserver)
      RUNSERVER=true
      shift # past argument
      ;;
    -k|--make-migration)
      MAKE_MIGRATIONS=true
      shift # past argument
      ;;
    -m|--migrate)
      MIGRATE=true
      shift # past argument
      ;;
    -f|--flush)
      FLUSH=true
      shift # past argument
      ;;
    -*|--*)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

if [[ "$FLUSH" == true ]]; then
  python ./backend/manage.py flush
fi
if [[ "$MAKE_MIGRATIONS" == true ]]; then
  python ./backend/manage.py makemigrations
elif [[ "$MIGRATE" == true ]]; then
  python ./backend/manage.py migrate
elif [[ "$RUNSERVER" == true ]]; then
  python ./backend/manage.py runserver --noreload
fi