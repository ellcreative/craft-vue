#`REPONAME`
In order to spin up this repo, you need to spin up both the back end and the front end.

## On First Clone
1. Clone the repo
1. Make sure to `git checkout develop` or TODO: replace this with info about our git standard stuff.
### BACKEND Setup
1. cd to `backend`
2. `nitro add`
   Enter the hostname [backend.nitro]: api-craftvue.nitro
   Enter the web root for the site [web]:
   Choose a PHP version:
3. 8.0
4. 7.4
5. 7.3
6. 7.2
7. 7.1
8. 7.0
   Enter your selection: 3
   Add a database for the site [Y/n] n
   Should we update the env file? [y/N] n
   Apply changes now [Y/n]? y
9. cd to `storage/backups` and use `nitro db import (your-backup-file.sql or .zip)` https://craftcms.com/docs/nitro/2.x/importing.html#complete-example TODO: add the prompts here
10. `nitro composer install`
11. your site can be found at api-craftvue.nitro
12. TODO: add pw/username info somehow
## FRONTEND Setup
1. cd to `frontend`
1. copy the contents of `.env.example` to a new file, `.env`
1. update or double-check the following lines:
    ```
    GRAPHQL_URL=http://api-craftvue.nitro
    BACKEND_URL=http://api-craftvue.nitro
    ```
1. Login to `http://api-craftvue.nitro/admin` with the login from onepass.
1. copy the contents of `.graphqlconfig.example` to a new file, `.graphqlconfig`
1. Get graphql token (You don't need "Authorization: Bearer", just the alphanumeric code)\
1. Add to:
   `.env` and
   `.graphqlconfig`
1. `yarn`

# On Pull
When you pull, if anything has changed (new packages added, etc) remember to run `nitro composer install` and `yarn` to grab any new or updated packages. This will happen automatically if you are using PHPStorm and it is properly configured.
Yarn is for frontend, composer is for backend.

## Backup DB
1. Navigate to Utilities/Database Backup.
2. Click Backup Button.
3. Add the new file (in backend/storage/backups) to git.
9. https://craftcms.com/docs/nitro/2.x/backups.html#complete-example
## Restore DB
https://craftcms.com/docs/nitro/2.x/importing.html

## Local Dev
While developing locally run:
1. `yarn dev`

## Building
You can build the files for dist with:
1. `yarn build`