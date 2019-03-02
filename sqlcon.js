var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "website",
    password: "abc123",
    database: "geekbook"
  });

  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to mySQL server.");
  });

  con.query(tablecreate, function(err, result, fields) {
    if (err) throw err;
    completeResult = result;
    console.log(result);
    globalResponse = response;
  });