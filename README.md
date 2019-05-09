# Calories Application

## Structure

The frontend is in the `web` folder and the server is in the `server` folder.

I would develop each one on there own repository, but since I have only 1 to work with, I decided to separate then in the root folder (not the `web` inside the `server`). Idealy I would deploy the frontend to AWS S3 and the server to Heroku or EC2, keeping a separation of concerns, but in this case I am going to output the frontend built files inside the backend server and it will be served from there.
