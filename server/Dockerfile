# Using image from base
FROM node:alpine

# Working directory

WORKDIR '/app'

COPY ./package*.json ./

RUN npm install

COPY ./ ./

CMD [ "npm", "run", "start"]