# yc2-upload API

File Upload Microservice for youCodia 2.0

## Before you begin

- Make sure you have set up the yarn workspace for the monorepo and run `yarn` at the root of the project
- Have a local MySQL Server running

## Initial Setup

1. Set up a local MySQL Database Server (i.e. via docker, etc)
2. Setup env variables:
   ```bash
   yarn setup
   ```
   and fill in the blanks in `.env`, making sure that the database url matches that of your local MySQL DB
3. Initialize MySQL tables based on `schema.prisma`:
   ```bash
   # this generates the prisma client as well
   yarn migrate:dev
   ```
4. Generate graphql schema:
   ```bash
   yarn generate:nexus
   # or, if you want to re-generate the prisma client:
   yarn generate
   ```

## Development

To start the dev server:

```bash
# this script will listen to changes in your server code and rebuild/rerun
yarn dev
```

## Build

- `yarn build`
