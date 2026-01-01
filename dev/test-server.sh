#!/usr/bin/env bash 

echo "Testing the service "

until curl -s -f http://localhost:5000/api/health; do 
    echo "Service is not ready yet please wait"
    sleep 5 

done 

echo "service is ready continue deploy"    
