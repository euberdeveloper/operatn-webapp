FROM node:lts-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ENV VUE_APP_API_URL=/api
ENV VUE_APP_STORED_URL=/stored
RUN rm -rf dist && \
    npm run build && \
    rm -r node_modules src
RUN npm install -g http-server
CMD [ "http-server", "dist" ]
