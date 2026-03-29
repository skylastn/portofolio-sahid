#!/bin/bash
envPath='env' # Path to the folder where all our .env files live
env=$1

# if [ -z "$1" ]; then
#     echo "No environment supplied, allowed: [dev, uat, prod]"
#     exit 1
# fi

case "$1" in
"local") INPUT=".env.local"
;;
"dev") INPUT=".env.development"
;;
"prod") INPUT=".env.production"
;;
*)
  echo "Missing arguments [dev|ujicoba|prod]"
  exit 1
;;
esac

cp "$INPUT" ".env" 
echo "Copied '$INPUT' to '.env'"
make migrate
make startSeeder