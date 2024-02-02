FROM node:12.18 AS assets

WORKDIR /app/frontend

COPY app/package.json app/npm-shrinkwrap.json ./

RUN npm ci

ARG NODE_ENV="production"
ENV NODE_ENV="${NODE_ENV}" \
    PATH="${PATH}:/node_modules/.bin"

COPY app ./

RUN if [ "${NODE_ENV}" != "development" ]; then \
  npm run build; fi

####################################################

FROM node:12.18 AS app

WORKDIR /app/backend

COPY server/package.json server/npm-shrinkwrap.json ./

RUN npm ci

ARG NODE_ENV="production"
ENV NODE_ENV="${NODE_ENV}" \
    PATH="${PATH}:/node_modules/.bin"

COPY server/ ./
COPY --from=assets /app/frontend/build/ ./build/

RUN npm run prebuild
RUN npm run build

EXPOSE 7112

CMD ["bash"]
