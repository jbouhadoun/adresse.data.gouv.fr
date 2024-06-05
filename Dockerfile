FROM node:16.19.0-alpine

WORKDIR /app

# installing dependencies
COPY package.json yarn.lock ./
RUN mkdir public
RUN yarn install

# copying the root folder into the workdir
COPY . .

RUN chown -R node:node /
USER node

CMD ["sh", "start.sh"]