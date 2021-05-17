FROM node:lts-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN rm -rf dist
CMD [ "npm", "run", "build ]
