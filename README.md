# Handle MySQL Error 
if you find `Cannot GET /api/calendar` or `error:  Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client` when server is running, do this through mysql command:
mysql>   ALTER USER 'your_username'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'your_password';
mysql>   FLUSH PRIVILEGES;

then, restart your node server