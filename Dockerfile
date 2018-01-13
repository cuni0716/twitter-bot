FROM mhart/alpine-node:latest

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN yarn install
RUN node -v

COPY . /app
EXPOSE 3000

CMD ["npm", "start"]
