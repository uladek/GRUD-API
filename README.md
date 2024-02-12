# 🚀 Welcome to GRUD API project!

## Getting Started
To get started with this project, clone the repository and install the dependencies:

# Description
Your task is to implement simple CRUD API using in-memory database underneath

Copy code
 - git clone from github
 - git checkout develop
 - npm install

# Then, you can start the server in development mode with:
- npm run start:dev

# Or in production mode with:
- npm run start:prod

# You can also run the tests with:
- npm test

# And start multiple instances of the application with:
- npm run start:multi

### API Endpoints
The API has the following endpoints:

- GET /api/users: Returns all users.
- GET /api/users/{userId}: Returns a user with the specified userId.
- POST /api/users: Creates a new user.
- PUT /api/users/{userId}: Updates an existing user with the specified userId.
- DELETE /api/users/{userId}: Deletes an existing user with the specified userId.

## Endpoints api/users:

- GET api/users:
  - Used to get all persons
  - Server should answer with status code 200 and all users records

- GET api/users/{userId}:
  - Server should answer with status code 200 and record with id === userId if it exists
  - Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
  - Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist

- POST api/users:
  - Used to create record about new user and store it in database
  - Server should answer with status code 201 and newly created record
  - Server should answer with status code 400 and corresponding message if request body does not contain required fields

- PUT api/users/{userId}:
  - Used to update existing user
  - Server should answer with status code 200 and updated record
  - Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
  - Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist

- DELETE api/users/{userId}:
  - Used to delete existing user from database
  - Server should answer with status code 204 if the record is found and deleted
  - Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
  - Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist


  ## Users are stored as objects that have following properties:
  - id — unique identifier (string, uuid) generated on server side
  - username — user's name (string, required)
  - age — user's age (number, required)
  - hobbies — user's hobbies (array of strings or empty array, required)
