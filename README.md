# Calories Application

## Structure

The frontend is in the `web` folder and the server is in the `server` folder.

I would develop each one on there own repository, but since I have only 1 to work with, I decided to separate then in the root folder (not the `web` inside the `server`). Idealy I would deploy the frontend to AWS S3 and the server to Heroku or EC2, keeping a separation of concerns, but in this case I am going to output the frontend built files inside the backend server and it will be served from there.

## Run local

Enter each project directory and follow the instructions locally.

## Using Docker-compose - DEVELOPMENT ONLY

To build the server, database and frontend at once, run the following

```sh
cd docker
sh refrsh-deps.sh
docker-compose up
```

`refresh-deps.sh` creates 2 images, one for the frontend dependencies and another for the server dependencies.
This approach greatly speeds up rebuilding the containers and decouples front and server side dependencies.
In case a new dependency is added, the build will fail (thanks to webpack and typescript),
then run the above commands again.

> Why this? Because the web and server are built in the same Dockerfile, this is bad for caching,
> since one of them should install their dependencies first and, if one change, the other will have
> to install everything again. By using 2 images for the dependencies, we are always using the cache.

This will build the frontend files and copy them inside the server, which will serve them.

The backend will refresh automatically on file changes. The frontend needs to be setup separately.
You need to build the files inside the `web` folder and the container will update automatically. 

> If the services are running, stop them first, or else the server will lose the reference to the dist folder.

```sh
cd docker
docker-compose stop
cd ../web
npm run build -- --watch --mode production
cd ../docker
docker-compose up
```

### Add ADMIN permission to all users

All the users are created with `user` permission.
You need to set the first admin user manually, for this you must register a user from the web page,
then run the following command (`cd docker` first if you are not inside the `docker` folder):

> This will set all users in the database as admin, then you can change permissions in the web page as needed.

```sh
cd docker
docker-compose exec mongodb mongo --username root --password pwd123 /usr/docker/set-all-admin.js
```
