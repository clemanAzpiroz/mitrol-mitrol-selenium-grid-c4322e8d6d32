#!/bin/sh

while test $# -gt 0; do
  case "$1" in
  -l)
    grid="SELENIUM_REMOTE_URL="
    local="LOCAL=true"
    shift
    ;;
  -d)
    debug="DEBUG=pw:browser*"
    shift
    ;;
  -u)
    shift
    url="URL=$1"
    shift
    ;;
  -w)
    shift
    max="MAX=$1"
    worker="--workers=$1"
    shift
    ;;
  -t)
    shift
    if [ -z $1 ]; then
      test="--project=e2e"

    else
      test="$1"
    fi
    shift
    ;;
  -o)
    shift
    if [ -z $1 ]; then
      test="--project=e2e-omnipad"

    else
      test="$1"
    fi
    shift
    ;;
  *)
    echo "$1 flag invalido"
    exit
    ;;
  esac
done

yarn cross-env $grid $local $url $max $debug npx playwright test $test $worker

# usar --ui para ver la version ui del runner
# Ejemplo:
# Ejecutar el test load-test con 100 workers.
# yarn custom -w 100 -t load-test.spec.ts | tee ./logs/resultado.log

# Ejecutar el test load-test con 1 worker de forma local
# yarn custom -l -t load-test.spec.ts | tee ./logs/resultado.log
