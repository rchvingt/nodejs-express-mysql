# CRUD Rest APIs with Node.js, Express JS & MySQL

A CRUD API created with Node.js, Express.js, and MySQL. The REST API will run on an Express.js server and the endpoints for performing CRUD operations on MySQL database. 

## Endpoints

| Method | URL                          | Description                        |
|--------|------------------------------|------------------------------------|
| GET    | `/api/calendars/`             | Retrieve all events calendars.      |
| GET    | `/api/calendars/:id`          | Retrieve a specific event calendar. |
| POST   | `/api/calendars`              | Create a new event.                |
| PUT    | `/api/calendars/:id`          | Update a specific event.           |
| DELETE | `/api/calendars/:id`          | Delete a specific event.           |

### Handle MySQL Error 
if you find `Cannot GET /api/calendar` or `error:  Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client` when server is running, do this through mysql command:
mysql>   ALTER USER 'your_username'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'your_password';
mysql>   FLUSH PRIVILEGES;

then, restart your node server