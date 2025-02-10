#!/bin/sh
pass=mitcall
x=6
while [ $x -gt -1 ]
do
  echo "Reset VM - 192.168.40.4$x"
  ssh mituser@192.168.40.4$x -p 2543 "sudo -k; echo $pass | sudo -v -S; sudo shutdown -r 0"
  x=$(( $x - 1 ))
  if [ $x == 0 ] 
  then
    echo "Espere un momento..."
    sleep 45s
  fi
done


