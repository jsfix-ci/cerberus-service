#!/bin/bash
context="acp-notprod_COP"
namespace="cop-ops-dev"

rm .env

while read secret
do
  varName=`echo "$secret" | cut -f1 -d ":"`
  varValue=`echo "$secret" | cut -f2 -d ":" | base64 -d`

  if [[ $varName != "CYPRESS_CACHE_FOLDER" ]]; then
      echo "export $varName=$varValue" >> .env
  fi

done < <(kubectl --context=$context --namespace=$namespace get secret formio-integration-test -o yaml | awk 'BEGIN {FS=": ";output=0} {  if ($0 ~ /^kind*/) { output=0 }; if (output) { varName=toupper($1); gsub(/\./, "_", varName); printf " %s:%s\n", varName, $2  }; if ($0 == "data:") { output=1} ;  }')

mkdir -p cypress/fixtures/users
source .env
node get_secrets.js