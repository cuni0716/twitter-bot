FROM mhart/alpine-node:latest

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN node -v

COPY . /app
EXPOSE 3000

CMD ["npm", "start"]
