# Calories Control - Server

## API

[View API documentation](https://documenter.getpostman.com/view/3022591/S1LyT7Bh)

Download the Postman collection to test the API locally:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/41121d414516aa4ef09d)

## Get started

1. Setup the project:

```js
npm install
```

2. Set environment variables: copy `.env.example` renaming to `.env` and set the values accordingly.

> Mongoose will create the database on the fly, just make sure to establish a connection to a MongoDB database.

### Run

Run for development

```js
npm start
```

Build for production

```js
npm run build
```

### Using Docker

You can start this server for development using docker.

This will be the standalone backend server with no frontend support.
To serve the frontend, follow the steps in the `web` folder.

> Prefer the `docker-compose` approach explained in the root folder.
> It will start everything moreeasily.

1. Build the image (it will be called `cal-server`).

```bash
docker build -t cal-server .
```

2. The server needs a MongoDB database to connect to. If you have one, set it up in the `.env` file,
   else you can install from a Docker image.

   To start a MongoDB container run the following in the terminal:

   > It will connect to the network `cal-net`, so the server can have easy access to it.

```bash
docker run -d \
--network cal-net \
-p 53400:27017 \
--name cal-mongo \
-e MONGO_INITDB_ROOT_USERNAME=root  \
-e MONGO_INITDB_ROOT_PASSWORD=pwd123 \
mongo
```

1. Start server container for development (it will be named `cal-server` and will join the `cal-net` network created above).

   > Change the `ABSOLUTE_PATH_TO_SERVER` field to your absolute path to this folder).

   The server will be available on port `3000`.

```bash
docker run -p 3000:3000 --name cal-server --net cal-net -v <ABSOLUTE_PATH_TO_SERVER>:/app cal-server
```

## Trade-offs

Since there was no iteration with the "client" to discuss this project, I took some decisions on my own.

1. Roles are a set of permissions (check the API documentation on Postman). More flexibility, maybe unnecessary. Admins can do everything with the users meals and other accounts (except change their password). Managers can do everything with other users (except change their passwords). Users can only handle themselves.

2. Authentication is done using JWT tokens, which are not revokable, blacklisted or refreshed, and lasts for 7 days. This means the user has to login again after 7 days and if the token is compromised, there is nothing the user can do.
