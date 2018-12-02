FROM node:latest

RUN apt-get update

RUN apt-get -y install lame sox ffmpeg
RUN apt-get install libsox-fmt-mp3 -y

RUN mkdir /linguini

WORKDIR /linguini

ADD package.json /linguini/package.json
ADD package-lock.json /linguini/package-lock.json

RUN npm install

ADD app /linguini/app

EXPOSE 3000

ENTRYPOINT [ "node","app/server.js" ]
