# About

This is a school project that aims to learn how to test a full-stack application.

> The minimum coverage required to reach is set to 80%.

This project covers various types of tests, including **unit tests**, **integration tests**, and **end-to-end tests**. These tests have been implemented using [Jest](https://jestjs.io/fr/) and [JUnit](https://junit.org/junit5/docs/current/api/) for unit and integration testing, and [Cypress](https://www.cypress.io/) for end-to-end testing.

# Prerequisites

To run this app, you need the following:

- Java 11
- Node.js version 16 or higher
- MySQL
- Angular CLI version 14

# Install database

1. Open your MySQL adminer.
2. Create a new table
3. Copy the content of `/ressources/sql/script.sql`

## In the backend

In `applications.properties`, set your database credentials and URL :

4. `spring.datasource.url` (jdbc:mysql://[your URL])
5. `spring.datasource.username` (your SQL username)
6. `spring.datasource.password` (your SQL password)

# Install the project

1. `git clone` the project
2. `cd backend`
3. Run `mvn package / mvn install` to build the jar for the project.

> Type `mvn spring-boot:run` to run the API

4. `cd ../frontend`
5. Run `npm install` to install the node_modules

> Type `ng serve` to run the frontend locally (`http://localhost:4200`)

# Run tests suites

## Front end

- `jest --coverage` to run all units and integration tests and generate coverage
- `npm run e2e:coverage` to run all end-to-end tests and generate coverage

## Back-end

Run `mvn clean test` to run all tests and generate coverage
