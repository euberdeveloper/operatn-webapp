FROM node:lts-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
ENV VUE_APP_API_URL=/api
ENV VUE_APP_STORED_URL=/stored
RUN npm run build && \
    rm -r node_modules src public
RUN npm install -D http-server
CMD [ "sh", "deploy.sh" ]