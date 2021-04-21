#!/bin/bash
context="acp-notprod_COP"
namespace="cop-ops-dev"

rm .env

while read secret
do
  varname=`echo $secret | cut -f1 -d ":"`
  varvalue=`echo $secret | cut -f2 -d ":" | base64 -d`

  if [[ $varname != "CYPRESS_CACHE_FOLDER" ]]; then
      echo "export $varname=$varvalue" >> .env
  fi

done < <(kubectl --context=$context --namespace=$namespace get secret cerberus -o yaml | awk 'BEGIN {FS=": ";output=0} {  if ($0 ~ /^kind*/) { output=0 }; if (output) { varname=toupper($1); gsub(/\./, "_", varname); printf " %s:%s\n", varname, $2  }; if ($0 == "data:") { output=1} ;  }')

pip3 install -r requirements.txt
mkdir -p cypress/fixtures/users
source .env
python3 get_secrets.py