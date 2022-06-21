# See latest Node tags here: https://hub.docker.com/_/node?tab=tags&page=1&ordering=last_updated
FROM node:14.18.0

ENV SERVER_PORT=8080 \
  SERVER_NAME=graphqlapi \
  SERVER_LOG_LEVEL=debug \
  DB_HOST=somedbhost \
  DB_USER=reports \
  DB_PASSWORD=somedbpassword/ \
  DB_PORT=3306 \
  DB_NAME=somedbname \
  OKTA_DISABLED=true \
  OKTA_ISSUER=someoktaissuer \
  OKTA_AUDIENCE=someoktaaudience \
  OKTA_CLIENT_ID=someoktaclientid

RUN mkdir -p /opt/graphqlapi
WORKDIR /opt/graphqlapi

COPY package.json /opt/graphqlapi
COPY package-lock.json /opt/graphqlapi
RUN npm ci

COPY . /opt/graphqlapi

EXPOSE 8080

CMD ["npm", "run", "start:prod"]
