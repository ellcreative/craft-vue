#`craftvue`
In order to spin up this repo, you need to spin up both the back end (the craft graphql endpoint) and the front end(the vue/nuxt that makes gql calls).

## On First Clone
1. Clone the repo
1. Make sure to `git checkout develop` or TODO: replace this with info about our git standard stuff.
### BACKEND Setup
1. cd to `backend`
1. `valet link api-craftvue`
1. `composer install`

#### If the database does not exist:
1. create the database `craftvue_db`
1. copy the contents of `.env.example` to a new file, `.env`
1. Double check `DB_DSN="mysql:host=127.0.0.1;port=3306;dbname=api_craftvue_db_test;"`
1. Visit your mailtrap.io demo inbox to find your username and password for the SMTP, use in next step.
1. update the following lines:\
   `SECURITY_KEY` - Doesn't matter for now. Type anything.\
   `BACKEND_SITE_URL` - `BACKEND_SITE_URL="http://api-craftvue.test"`\
   `SMTP_USER` - Username from demo inbox.\
   `SMTP_PASS` - Password from demo inbox.\
   Also get S3 and Cloudfront info from someone.
1. restore existing database

### FRONTEND Setup
1. cd to `frontend`
1. copy the contents of `.env.example` to a new file, `.env`
1. update the following lines:
    ```
    GRAPHQL_URL=http://api-craftvue.test
    BACKEND_URL=http://api-craftvue.test
    ```
1. Login to `http://api-craftvue.test/admin` with the login from onepass.
1. copy the contents of `.graphqlconfig.example` to a new file, `.graphqlconfig`
1. Get graphql token (You don't need "Authorization: Bearer", just the alphanumeric code)\
1. Add to:
   `.env` and
   `.graphqlconfig`
1. `yarn`

## Backup DB
1. Navigate to Utilities/Database Backup.
2. Click Backup Button.
3. Add the new file (in backend/storage/backups) to git.

## On Pull
When you pull, if anything has changed (new packages added, etc) remember to run `composer install` and `yarn` to grab any new or updated packages. This will happen automatically if you are using PHPStorm and it is properly configured.
Yarn is for frontend, composer is for backend.

## Local Dev
While developing locally run:
1. `yarn dev`

## Building
You can build the files for dist with:
1. `yarn build`