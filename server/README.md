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

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/d3e1b6c6ca6fef6b807a)

All requests should have `/api/v1` before the mentioned ath.

All requests return a `success` field that has `true` if the request succeeded and `false` if failed.
If failed, an `errorMessage` is also included.

```json
{ "success": false, "errorMessage": "description" }
```

### Auth



#### POST /login

**Body signature**

```json
{
	"email": "admin@yahoo.com",
	"password": "pwd"
}
```

**Return**

```json
// Success
{
    "success": true,
    "userId": "5cd7fa6849634f9eab062415",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /register

**Body signature**

```json
{
	"name": "Admin",
	"permissions": ["users_edit", "meals_all"],
	"email": "admin@yahoo.com",
	"password": "pwd"
}
```

**Return**

```json
// Success
{
    "success": true,
    "userId": "5cd7fa6849634f9eab062415",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Users

**User signature**

```json
{
    "success": true,
    "user": {
        "permissions": ["users_edit"],
        "dailyCalories": 2000,
        "name": "Manager",
        "email": "manager@yahoo.com",
        "id": "5cd7fa6849634f9eab062415"
    }
}
```

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

### Meals

#### GET /meals/list

List all meals if user has `MEALS_ALL`, otherwise list only user's meal.

Accept query filters:

| Filter | Description                      | Example                                    |
|--------|----------------------------------|--------------------------------------------|
| userId | User ID: string                  | /meals/list?userId=123512                  |
| from   | Start datetime: Date             | /meals/list?from=2019-05-12T06:25:21.920Z  |
| until  | Until datetime: Date             | /meals/list?until=2019-05-20T00:00:00.920Z |
| limit  | Pagination: number (default: 20) | /meals/list?limit=20                       |
| skip   | Pagination: number               | /meals/list?userId=30                      |

#### GET /meals/:mealId

Return meal. If user don't have `MEALS_All` permission, can only get his own meals.

#### POST /meals/new

Create new meal for user.

If user have `MEALS_All` permission, it can pass a `userId` property to create a meal for another user.

#### PUT /meals/:mealId

Update meal.

If user have `MEALS_All` permission, it can update other user's meals.

#### DELETE /meals/:mealId

Delete meal.

If user have `MEALS_All` permission, it can update other user's meals.

**Returns** 

```json
// Removed meal ID
{
    "success": true,
    "mealId": "5cd7ee0d548c6897d32a8909"
}
```

---

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
