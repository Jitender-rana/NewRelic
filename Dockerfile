FROM node:20
WORKDIR /app/src
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install
COPY . .
ENV NEW_RELIC_NO_CONFIG_FILE=true
CMD ["node", "index.js"]