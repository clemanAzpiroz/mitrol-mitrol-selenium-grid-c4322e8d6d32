#!/bin/sh

kubectl delete -f playwright-grid-deployment.yaml > /dev/null
echo -e "\nEspere, esto puede tardar un poco.\nReiniciando...\n"
sleep 40s
kubectl apply -f playwright-grid-deployment.yaml > /dev/null
echo -e "\nDeployment reiniciado con exito!\n"
exit 1
