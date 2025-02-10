#!/bin/sh
REPO_PATH=$(pwd)

AUDIO_PATH=${REPO_PATH/webpad2-test/"webpad2-test/voice.wav"}
ENV_PATH=${REPO_PATH/webpad2-tests/"webpad2-test/.env"}

if [ -f "$ENV_PATH" ]
then
  sed -i "/^AUDIODIR=/{
      h;
      s!=.*!=${AUDIO_PATH}!
      };
      \${
      x;
      /^$/{
      s!!AUDIODIR=${AUDIO_PATH}!
      ;H
      }
      ;x
      }" ${ENV_PATH}
  echo ".env modificado con exito!"
  exit
else
  echo WEBPAD_URL=>$ENV_PATH
  echo AGENT_COUNT=1>>$ENV_PATH
  echo MAX=1>>$ENV_PATH
  echo AUDIODIR=$AUDIO_PATH>>$ENV_PATH
  echo ".env generado con exito!"
  exit
fi

