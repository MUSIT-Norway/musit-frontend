FROM node:5

ENV PUBLIC_PORT $PUBLIC_PORT
ENV PUBLIC_PORT $PUBLIC_PORT

WORKDIR "/usr/src/app"

ADD src src
ADD public public
ADD package.json package.json
ADD fake_security.json fake_security.json

RUN npm install -g pushstate-server
RUN npm install
RUN npm run build

EXPOSE 8000

CMD pushstate-server build 8000
