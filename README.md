# Book Lending API Backend
An API backend for a book lending service using Node.js, Koa, and MySQL

This document contains information for installing, setting up, and configuring the backend API.
To start and update the documentation server, run ```npm run docs```
With the server running, you can go to:
- http://localhost:3030/ for JavaScript documentation
- http://localhost:3030/openapi for OpenAPI documentation
- http://localhost:3030/schemas to view jsonschemas

# Installing
Clone the repository:
```
$ git clone https://github.coventry.ac.uk/304CEM-2021SEPJAN/standringj-backend.git
```
Install the package:
```
$ cd standringj-backend
$ npm install
```
# Database configuration
This API uses ```promises-mysql``` package to interface with a MySQL database on the server.
## Creating tables
To start using this API, you will need to create a new MySQL database containing 3 tables with the following columns
To do this, you can use the included ```create-db.sh``` script:
```
$ sql-scripts/create-db.sh USERNAME PASSWORD
```
Where ```USERNAME``` is your MySQL username and ```PASSWORD``` is your MySQL password
### books
```
+-------------+---------------+------+-----+-------------------+----------------+
| Field       | Type          | Null | Key | Default           | Extra          |
+-------------+---------------+------+-----+-------------------+----------------+
| ID          | int(11)       | NO   | PRI | NULL              | auto_increment |
| ownerID     | int(11)       | NO   | MUL | NULL              |                |
| available   | tinyint(1)    | NO   |     | 1                 |                |
| isbn        | varchar(10)   | NO   |     | NULL              |                |
| title       | varchar(32)   | NO   |     | NULL              |                |
| summary     | text          | YES  |     | NULL              |                |
| imgLink     | varchar(2048) | YES  |     | NULL              |                |
| authorFirst | varchar(16)   | YES  |     | NULL              |                |
| authorLast  | varchar(16)   | NO   |     | NULL              |                |
| genre       | varchar(16)   | YES  |     | NULL              |                |
| publisher   | varchar(32)   | YES  |     | NULL              |                |
| publishYear | int(4)        | YES  |     | NULL              |                |
| dateAdded   | datetime      | NO   |     | CURRENT_TIMESTAMP |                |
+-------------+---------------+------+-----+-------------------+----------------+
```
### users
```
+--------------+-------------+------+-----+---------+----------------+
| Field        | Type        | Null | Key | Default | Extra          |
+--------------+-------------+------+-----+---------+----------------+
| ID           | int(11)     | NO   | PRI | NULL    | auto_increment |
| username     | varchar(32) | NO   | UNI | NULL    |                |
| email        | varchar(64) | NO   | UNI | NULL    |                |
| avatar       | varchar(64) | YES  |     | NULL    |                |
| password     | varchar(64) | NO   |     | NULL    |                |
| passwordSalt | varchar(16) | YES  |     | NULL    |                |
| firstName    | varchar(32) | NO   |     | NULL    |                |
| lastName     | varchar(32) | NO   |     | NULL    |                |
| address1     | varchar(64) | NO   |     | NULL    |                |
| address2     | varchar(64) | YES  |     | NULL    |                |
| address3     | varchar(64) | YES  |     | NULL    |                |
| city         | varchar(16) | NO   |     | NULL    |                |
| postcode     | varchar(8)  | NO   |     | NULL    |                |
+--------------+-------------+------+-----+---------+----------------+
```
### requests
```
+----------+--------------+------+-----+---------+----------------+
| Field    | Type         | Null | Key | Default | Extra          |
+----------+--------------+------+-----+---------+----------------+
| ID       | int(11)      | NO   | PRI | NULL    | auto_increment |
| bookID   | int(11)      | NO   | MUL | NULL    |                |
| userID   | int(11)      | NO   | MUL | NULL    |                |
| message  | varchar(256) | YES  |     | NULL    |                |
| accepted | tinyint(1)   | NO   |     | 0       |                |
+----------+--------------+------+-----+---------+----------------+
```
### roles
```
+-------------+-------------+------+-----+---------+-------+
| Field       | Type        | Null | Key | Default | Extra |
+-------------+-------------+------+-----+---------+-------+
| name        | varchar(16) | NO   | PRI | NULL    |       |
| description | text        | YES  |     | NULL    |       |
+-------------+-------------+------+-----+---------+-------+
```
## Configuration
For the API to use the database, it must be configured using a ```.config.js``` file.
To create a new ```config.js``` file, you can copy the existing template:
```
$ cp .config.template.js .config.js
```
and edit it to contain your MySQL database information:
```
exports.config = {
  host: process.env.DB_HOST || '<YOUR_HOSTNAME>',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || '<MYSQL_USERNAME>',
  password: process.env.DB_PASSWORD || '<MYSQL_USER_PASSWORD>',
  database: process.env.DB_DATABASE || '<MYSQL_DATABASE_NAME>',
  connection_limit: 100,
}
```

# Running the database
To run the database, you can use the ```start``` script to run ```index.js``` with ```nodemon```. This means that the server will update when any files are changed:
```
$ npm start
```
You can then access the API at http://localhost:3000/api/v1

# Testing
The Jest testing framework is used to test API requests. To run tests, run:
```
$ npm test
```
This will create a test database which is a clone from your production data and run the tests in ```__tests__/requests.js```

# Linting
Files in this project use the [Airbnb JavaScript Style](https://github.com/airbnb/javascript) to keep code consistent. This is enforced using the ```eslint``` rules in ```.eslint.rc```. 
Whenever you make any changes to files in this project, you should run the linter using:
```
$ npm run linter
```
and fix all errors/warnings before committing.

