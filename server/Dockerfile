FROM node:10

# For caching
COPY package.json package-lock.json /app/
WORKDIR /app
RUN npm install --no-progress; \
  npm install --no-progress -g nodemon

# Application
COPY . /app
EXPOSE 3000
ENV MONGO_HOST=cal-mongo
ENV MONGO_PORT=27017
CMD [ "npm", "start" ]
