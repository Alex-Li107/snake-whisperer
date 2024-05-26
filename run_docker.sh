#!/bin/bash

if [[ -z "${HOME}" ]]; then
  echo "Setting \$HOME to: $2"
  export HOME=$2
else
  echo "Running NeMo container"
  docker run --net=host --gpus all --ipc=host --ulimit memlock=-1 --ulimit stack=67108864 --shm-size=8g -it --rm -v $HOME/Documents/git-repos:/Documents nvcr.io/nvidia/nemo:23.08
fi