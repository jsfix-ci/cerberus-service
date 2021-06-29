#!/bin/bash
context=$1
namespace=$2
secretName=$3

rm .env

while read secret
do
  varName=`echo "$secret" | cut -f1 -d ":"`
  varValue=`echo "$secret" | cut -f2 -d ":" | base64 -d`

  if [[ $varName != "CYPRESS_CACHE_FOLDER" ]]; then
      echo "export $varName=$varValue" >> .env
  fi

done < <(kubectl --context=$context --namespace=$namespace get secret $secretName -o yaml | awk 'BEGIN {FS=": ";output=0} {  if ($0 ~ /^kind*/) { output=0 }; if (output) { varName=toupper($1); gsub(/\./, "_", varName); printf " %s:%s\n", varName, $2  }; if ($0 == "data:") { output=1} ;  }')

mkdir -p cypress/fixtures/users
source .env
echo ${TEST_ENV}
node get_secrets.js ${TEST_ENV}