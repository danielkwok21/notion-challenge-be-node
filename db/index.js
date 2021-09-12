const mysql = require('mysql');
const { config } = require('../private')

const db = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
});

db.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

function query(queryString) {
    return new Promise((res, rej) => {
        return db.query(queryString, (err, result) => {
            if (err) {
                rej(err)
            } else {
                res(result)
            }
        })
    })
}

module.exports = {
    query
}