FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN rm -rf dist && \
    npm run build && \
    rm -r node_modules src
RUN npm install -d http-server
CMD [ "http-server", "dist" ]