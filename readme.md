# Documentación de la API

A brief description of what this project does and who it's for

## Prerequisites
* You have installed the latest version of Node.js
* You have a basic understanding of TypeScript
* You have a basic understanding of Express.js

## Installation
1. To install the project, follow these steps:

2. Clone the repo
Install the required dependencies:
```bash #copy code
   npm install
```


3. Set the following environment variables:
```python
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
SALT_ROUNDS=
JWT_SECRET=
EXPIRED_TOKEN=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=
PROJECT_NAME=
```
4. Start the server:

```copy code
 npm run dev
```

# END POINTS

# User

## User registration

### Endpoint: /user/register

Description: Creates a new user in the database.

Method: POST

Input data:
```json copy data
{
  "email": "string (format: email)",
  "password": "string (minimum length: 8, minimum one uppercase, minuscule and number
, pattern: (?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)"
}
```

## User login
### Endpoint: /user/login

Description: Authenticates the user in the database and returns an access token.

Method: POST

Input data:

```json
{
  "email": "string (format: email)",
 "password": "string (minimum length: 8, minimum one uppercase, minuscule and number
, pattern: (?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)"
}
```
## Get user information
### Endpoint: /user/auth

Description: Returns information about the authenticated user.

Method: GET

### Bearer token is required.

## List all users (for development only)
### Endpoint: /user/

Description: Returns a list of all users in the database.

Method: GET

## Delete a user (for development only)
### Endpoint: /user/:id

Description: Deletes a user from the database.

Method: DELETE

Input data: User ID to be deleted is required.


# Events

## Create an event
### Endpoint: /event/create
Description: Creates a new event in the database.
###  Bearer token is required.

Method: POST

Input data:

``` json
{
  "address": "string (correct format required)",
  "date": "string (format: dd/mm/yyyy)",
  "start_event": "string (format: hh:mm)",
  "end_event": "string (format: hh:mm, must be equal or greater than start_event)"
}

```

## List all events
### Endpoint: /events/list
Description: Returns a paginated list of events that belong to the authenticated user.

Method: GET

### Input data: Bearer token is required.

Query parameters:

- page: number of the page to show, default is 1.
- limit: number of events per page, default is 5.

## List all events (for development only)
### Endpoint: /events/list-all
Description: Returns a paginated list of all events in the database.

Method: GET

Query parameters:

- page: number of the page to show, default is 1.
- limit: number of events per page, default is 5.
#
Note: Environment variables must be set before running the API. Please refer to the .env.example file for required variables.

