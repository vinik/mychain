module.exports =
    mysql:
        host: process.env.MYSQL_HOST or 'localhost'
        user: process.env.MYSQL_USER or 'root'
        password: process.env.MYSQL_PASSWORD or 'myPassword'
        domain: process.env.MYSQL_DATABASE or 'mychain'
        port: process.env.MYSQL_PORT or 3306
        poolSize: process.env.MYSQL_POOL_SIZE or 5
