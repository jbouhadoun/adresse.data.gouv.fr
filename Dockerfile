FROM node:18.19-alpine3.18 as builder

WORKDIR /app
ENV YARN_CACHE_FOLDER=/cache/next

COPY package.json yarn.lock .
RUN mkdir public
RUN yarn --cache-folder $YARN_CACHE_FOLDER

COPY . .
RUN yarn build --cache-folder $YARN_CACHE_FOLDER

FROM node:18.19-alpine3.18

WORKDIR /app

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
ENV YARN_CACHE_FOLDER=/cache/next

EXPOSE 3000

CMD ["sh", "-c", "yarn --cache-folder $YARN_CACHE_FOLDER build-available-flags && yarn  --cache-folder $YARN_CACHE_FOLDER start"]