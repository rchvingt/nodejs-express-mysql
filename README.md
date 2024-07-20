# CRUD with Node.js, Express.js & MySQL

A CRUD API created with Node.js, Express.js, and MySQL. The REST API will run on an Express.js server and the endpoints for performing CRUD operations on MySQL database. 

## General Info
This is a simple CRUD application built with Node.js, Express.js, and MySQL. It allows users to create, read, update, and delete records in a MySQL database. The application is designed to provide a straightforward a RESTful API for managing data calendar event using these stack

## Endpoints

| Method | URL                          | Description                        |
|--------|------------------------------|------------------------------------|
| GET    | `/api/calendars/`             | Retrieve all events calendars      |
| GET    | `/api/calendars/:id`          | Retrieve a specific event calendar |
| POST   | `/api/calendars`              | Create a new event                |
| PUT    | `/api/calendars/:id`          | Update a specific event           |
| DELETE | `/api/calendars/:id`          | Delete a specific event           |
| GET    | `/api/calendars?title=keyword`          | Retrieve all events calendars based on spesific keyword           |

## Technologies Used

- **Node.js:** JavaScript runtime used for building the server-side application.
- **Express.js:** Web framework for Node.js used to create API endpoints.
- **MySQL:** Relational database management system used for data storage.

## Installation

To set up and run this application, follow these steps:

### Prerequisites

- **Node.js:** Ensure Node.js is installed. You can download it from [nodejs.org](https://nodejs.org/).
- **MySQL:** Ensure MySQL is installed and running. You can download it from [mysql.com](https://www.mysql.com/).

### Steps

1. **Clone the repository:**
   ```sh
   git clone https://github.com/rchvingt/nodejs-express-mysql.git

2. **Set up the database:**
     The database configuration is managed in the `app/config/db.config.js` file. This file contains the necessary settings to connect to your MySQL database. 
    Open the `app/config/db.config.js` file and update the following settings according to your database setup:

    ```javascript
    module.exports = {
      HOST: "localhost",
      USER: "root",
      PASSWORD: "password",
      DB: "my_database"
    };
    ```


### Handle MySQL Error 
if you find `Cannot GET /api/calendar` or `error:  Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client` when server is running, do this through mysql command:
mysql>   ALTER USER 'your_username'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'your_password';
mysql>   FLUSH PRIVILEGES;

then, restart your node server