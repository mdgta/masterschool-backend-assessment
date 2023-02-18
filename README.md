# Udacity Backend Assessment for Masterschool

## Important!!!

> **IMPORTANT!** please see the [original repo](https://github.com/udacity/cd12642-masterschool-backend-assessment) from which this repo was forked for the full description

# Running

After cloning the repo, install dependencies:

```sh
npm i
```

For running the server:

```sh
npm run server
```

# Routes

> **Note!** Routes marked with a **\*** require a valid bearer token.

## Authentication (`/api/auth`)
Routes for user authentication.
### POST `/api/auth/register`
Registers the user. Requires the following fields:
- `email`- the account's email
- `username`- the account's username
- `password`- the account's password

If successful, returns an object with the `email` and `username`.

### POST `/api/auth/login`
Generates a JWT token. Requires the following fields:
- `email`- the account's email
- `password`- the account's password

If successful, returns an object with a `token`.
**Logging in will also trigger a cleanup for blacklisted tokens associated with the user that have already expired**.

### POST `/api/auth/logout`\*
Logs the user out by blacklisting their current token. **Requires a valid Bearer token**.

### GET `/api/auth/me`\*
Returns the user's data. **Requires a valid Bearer token**.

## Unsplash (`/api/photos`)
Routes for fetching data from [Unsplash's API](https://unsplash.com/documentation).
### GET `/api/photos`
Registers the user. Requires the following fields:
- `email`- the account's email
- `username`- the account's username
- `password`- the account's password

If successful, returns an object with the `email` and `username`.

### GET `/api/photos/:id`
Returns a single photo with the provided Photo ID.

### GET `/api/photos/user/:username`
Returns all photos by a single user.

## Favorites (`/api/favorites`)\*
Routes for users to personally keep their favoritre photos' data.

**All routes here require a valid Bearer token**.

### GET `/api/favorites`\*
Returns all favorite photos of the currently-logged-in user.

**Requires a valid Bearer token**.

### POST `/api/favorites`\*
Adds a new favorite entry for the current user.

Requires the following data:

- `url`- the provided image's URL
- `description`- the image's description
- `username`- the image uploader
- `explanation`- describing why the current user saved this image

If successful, will return the newly-created entry.

**Requires a valid Bearer token**.

### PATCH `/api/favorites/:id`\*
Updates the `explanation` field of an entry by its id.

Requires the following data:

- `explanation`- describing why the current user saved this image

If successful, will return the updated entry.

**Requires a valid Bearer token**.

### DELETE `/api/favorites/:id`\*
Deletes an entry by its id.

Requires no parameters.

If successful, will return the updated entry.

**Requires a valid Bearer token**.

# Other resources
- [`doc` to object](https://stackoverflow.com/a/7503523) by [jmar777](https://stackoverflow.com/users/376789/jmar777) (instead of using just `doc._doc`)