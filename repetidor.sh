#!/bin/sh

x=1
count=1
time=2
workers=1

while test $# -gt 0; do
  case "$1" in
    -l)
      l=-l;
      shift
      ;;
    -c)
        shift
        count=$1
        shift
        ;;
    -f)
        shift
        time=$1
        shift
        ;;
    -w)  
      shift
      workers="--workers=$1"
      shift
        ;;  
    -t)  
      shift
      test=$1
      shift   
      ;; 
    *) 
      echo "$1 flag invalido"
      return 1;
      ;;  
  esac
done  

echo "Start:" $(date)
while [ $x -le $count ]
do
  echo -e "Run N°:\t" $x "Time: "$(date +%T)
  bash customexec.sh $l -w $workers -t $test >> ./logs/"$(date +%Y%m%d_%_H).log"
  sleep $time
  x=$(( $x + 1 ))
done
echo "Finish:" $(date)

# Ejemplo: 
# Repetir 20 veces cada 5 minutos el test load-test con 100 workers.
# yarn repeat -c 20 -f 5m 15s -t load-test.spec.ts -w 100 | tee ./logs/resultado.log

# Repetir 5 veces cada 10 segundos el test prueba de forma local.
#yarn repeat -l -c 5 -f 10s -t prueba.spec.ts | tee ./logs/resultado.log