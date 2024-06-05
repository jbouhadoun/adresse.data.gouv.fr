FROM node:16.19.0-alpine

WORKDIR /app

# installing dependencies
COPY package.json yarn.lock ./
RUN mkdir public
RUN yarn install

# copying the root folder into the workdir
COPY . .

RUN addgroup -g 1001 -S node && \
    adduser -u 1001 -S node -G node && \
    chown -R node:node /app

USER node

CMD ["sh", "start.sh"]