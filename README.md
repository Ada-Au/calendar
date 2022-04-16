@# Calendar 1.0

## Pre-setup

- Set up MySQL
  1. Build MySQL image first
  ```
    docker build -t my-mysql .
  ```
  2. Launch MySQL
  ```
    docker-compose -f docker-compose.mysql.yml up -d
  ```

## Setup

- `yarn` in root directory
