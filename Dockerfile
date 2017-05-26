FROM node:7.5

ENV PUBLIC_PORT $PUBLIC_PORT
ENV PUBLIC_PORT $PUBLIC_PORT

WORKDIR "/usr/src/app"

ADD src src
ADD public public
ADD *.json ./
RUN npm install -g pushstate-server
RUN npm install
RUN npm run build

EXPOSE 8000

CMD pushstate-server build 8000
