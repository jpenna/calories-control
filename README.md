# Calories Application

## API Documentation

### [🌐 View API documentation](https://documenter.getpostman.com/view/3022591/S1LyT7Bh)

## Live Demo

Check the live demo deployed with Heroku, Docker and MongoDB Atlas.

### [🎊 Live Demo](https://pennaid-calories-control.herokuapp.com/)

### Accounts

admin@calories.com  
manager@calories.com  
user@calories.com  

Password: `pwd123`

## Structure

The frontend is in the `web` folder and the server is in the `server` folder.

I would develop each one on there own repository, but since I was gave only 1, I decided to separate them in the root folder. Idealy I would deploy the frontend to AWS S3 and the server to Heroku or EC2, keeping a separation of concerns, but in this case the frontend built files are copied to the backend server.

## Run local

### Standalone applications

Enter each project directory and follow the instructions there.

### Using Docker-compose - DEVELOPMENT ONLY

To build the server, database and frontend at once, run the following:

```sh
cd docker # From the docker folder...
sh refresh-deps.sh
docker-compose up
```

`refresh-deps.sh` creates 2 images, one for the frontend dependencies and another for the server dependencies. This approach greatly speeds up rebuilding the containers and decouples frontend and server side dependencies. In case a new dependency is added, the build will fail (thanks to webpack and typescript). In this case, just run the above commands again.

> **Why not include the `npm install` commands in the main Dockerfile?**
> 
> Because the frontend and server are built in the same Dockerfile, this is bad for caching, since one of them should install their dependencies first and, if the first `package.json` changes, the other will have to install everything again. By using 2 images for the dependencies, we are always using the cache.

Then `docker-compose` will build the frontend files and copy them inside the server, which will serve them.

The backend will refresh automatically on file changes. The frontend won't: you need to build the files inside the `web` folder and the container will update automatically.

> If the services are running, you have to stop them first (`docker-compose stop`) or else the server will lose the reference to the dist folder. In this case, do the following:

```sh
cd docker
docker-compose stop # stop services
cd ../web
npm run build -- --watch --mode production
cd ../docker
docker-compose up
```

### Add ADMIN permission to all users

All the users are created with `user` permission. You need to set the firsts `admin` users manually, for this you must:

1. Register a user from the web page

2. Run the following command:

> **WARNING!**
>
> This command will set all the users in the database to `admin`. You can change the permissions later from the web page.

```sh
cd docker # `cd docker` first if you are not inside the `docker` folder
docker-compose exec mongodb mongo --username root --password pwd123 /usr/docker/set-all-admin.js
```
