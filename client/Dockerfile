FROM node:12.9.1-alpine

WORKDIR '/app'

COPY ./package*.json ./

#RUN apk add python

RUN npm install

COPY ./ ./

RUN npm run build

FROM nginx
EXPOSE 4200
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/dist/client /usr/share/nginx/html

#CMD [ "npm", "run", "start" ]
