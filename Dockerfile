FROM node:lts-alpine

ADD . /app
WORKDIR /app
RUN npm install

EXPOSE 3001
CMD ["npm", "start"]