# Calories Control - Server

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

## API

All requests should have `/api/v1` before the mentioned ath.

### Auth

#### POST /login

#### POST /register

### Users

#### GET /users/list

> Users list (`/api/v1/users` don't have pagination, this is not good with a few hundred users, but with the current requirements, I wouldn't say too many users are expected.

List the users of the application.

If the user don't have `USER_EDIT` permission (check *Roles and Permissions* below), only his user will be retrieved.

#### GET /users/me

Return requester info

#### GET /users/:id

Get user information for provided ID.

If the user don't have `USER_EDIT` permission (check *Roles and Permissions* below), only his user will can be retrieved.

#### PUT /users/:id

Update user.

If the user don't have `USER_EDIT` permission (check *Roles and Permissions* below), only his user can be edited.

## Roles and permissions

Roles are a set of permissions.

Permissions define actions that the user can take.

**Roles**

| Role    | Permissions           |
|---------|-----------------------|
| User    |                       |
| Manager | USERS_EDIT            |
| Admin   | USERS_EDIT, MEALS_ALL |

**Permissions**

| Permission | Description |
|------------|---------------------------------------------------------|
| USERS_EDIT | Can view and edit all users. Can also edit permissions. |
| MEALS_ALL  | Can view and edit meals of all users.                   |
