FROM node:latest

WORKDIR   /home/nodeApp

COPY      . /home/nodeApp

RUN       npm install

EXPOSE 5000

ENTRYPOINT ["npm", "start"]