FROM node:18.19-alpine3.18 as builder

WORKDIR /app
ENV YARN_CACHE_FOLDER=/cache/next

# Create the cache directory and set permissions
RUN mkdir -p $YARN_CACHE_FOLDER && chown -R node:node $YARN_CACHE_FOLDER

COPY package.json yarn.lock .
RUN mkdir public
RUN yarn --cache-folder $YARN_CACHE_FOLDER

COPY . .
RUN yarn build

FROM node:18.19-alpine3.18
ENV YARN_CACHE_FOLDER=/cache/next

WORKDIR /app

# Create the cache directory and set permissions
RUN mkdir -p $YARN_CACHE_FOLDER && chown -R node:node $YARN_CACHE_FOLDER

COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.env.default ./

COPY --from=builder /app/public ./public
COPY --from=builder /app/lib/util ./lib/util
COPY --from=builder /app/server ./server
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/scripts/ ./scripts

RUN chown -R node:node /app 

USER node

EXPOSE 3000

CMD ["sh", "-c", "yarn build-available-flags && yarn start"]