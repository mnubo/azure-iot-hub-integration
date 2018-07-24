FROM node:10-jessie

RUN apt update && apt install -y zip

COPY create_azure_package.sh /

ENTRYPOINT ["/bin/bash", "/create_azure_package.sh"]
