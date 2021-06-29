FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VUE_APP_API_URL=/api
ENV VUE_APP_STORED_URL=/stored
RUN chmod +x ./start.sh
CMD [ "./start.sh" ]
