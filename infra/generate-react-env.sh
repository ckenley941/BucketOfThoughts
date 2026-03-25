#!/usr/bin/env bash

ENV_PREFIX=VITE_
secrets=auth0-domain,auth0-client-id,auth0-audience

for i in ${secrets//,/ }
do
    SECRET_NAME=${i//-/_}
    SECRET_NAME=$(echo $SECRET_NAME | awk '{print toupper($0)}')
    SECRET_VALUE=$(gcloud secrets versions access "latest" --secret=${i})
    echo "$ENV_PREFIX$SECRET_NAME=\"$SECRET_VALUE\"" >> .env
done

cp -rf .env ./frontend/
rm .env
