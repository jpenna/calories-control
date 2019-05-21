# Calories Control - Web

Frontend of the Calories Control application.

It is a PWA that works offline for viewing only and can be installed on a mobile device.

There are no unit tests or e2e tests. The environment is prepared but, because of time constraints (and less priority on the requirements) I didn't work on it.

## Project setup

```sh
npm install
```

> If you need to set a local path for the API, copy `.env.production`, rename it to `.env`, and change the API URL.

### Compiles and hot-reloads for development

```sh
npm start
```

### Compiles and minifies for production

```sh
npm run build
```

### Lints and fixes files

```sh
npm run lint
```

## Trade-offs

Since there was no iteration with the "client" to discuss this project, I took some decisions on my own.

1. I decided to allow the user to select only one day (and not a range) to facilitate the implementation of caching and the Vuex store. All records for the day are fetched at once, the filter by time and user, as well as the separation by user and sorting by time, is done locally. With date ranges this would require more processing power.
   
2. Instead of making the background green/red depending on daily calories, I included a message at the top of the list, which tells the total amount of eaten calories and the daily goal. This message gets green or red accordingly. Also, nothing is shown if the list is not for a single user.

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
