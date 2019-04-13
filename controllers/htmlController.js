"use strict";

var bodyParser = require("body-parser");
var mysql = require("mysql");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app) {
//   app.get("/", function(req, res) {
//     res.render("index");
//   });

//   //-- THE CODE BELOW MAY NOT WORK
//   app.get("/register/:id", function(req, res) {
//     res.send("register", { ID: req.params.id, Qstr: req.query.qstr }); // THIS MAY NOT WORK
//   });
  // 	//--  THE ABOVE CODE MAY NOT WORK
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  app.post("/register", (req, res) => {
    // res.send('Thank you!');

    console.log(req.body);
  });
  // 		var con = mysql.createConnection({
  // 					host: "localhost",
  // 					user: "website",
  // 					password: "abc123",
  // 					database: "geekbook"
  // 				});
  // 				console.log('Hey there right after the creation of connection')
  // 	        let peopleID, addressID;
  // 	        con.connection(function(err)
  // 			{
  // 				if(err) throw err;
  // 				console.log("Connected!");

  // 			 var sqlAccount = "INSERT INTO Accounts(userName, email, pass)  VALUES (' " +last_insert_id() +","+ req.body.userName + "',' "+ req.body.email   + "," +req.body.pw+"')";

  // 			 var sqlcustomer = "INSERT INTO Customer( CustId,userName, email, pass) VALUES (  ' " +last_insert_id() +"','"+ req.body.firstName  + "','"+ req.body.lastName   + "','" +req.body.nickName + "')";

  // 			 var  sqlAddressBillinig = "INSERT INTO BillingAddress (billingId, address, city, zip, state)   VALUES (' " +last_insert_id() +"','"+ req.body.address + "','"+ req.body.city+ "','" + req.body.zip+ "','"+ req.body.state+ "')";

  // 			 var  sqlCreditCard =   "INSERT INTO Card(      cardId,   cardCustomerName,    cardNum,  securityNum , expMonth,  expYear)  VALUES(' " +last_insert_id() +"','" +  req.body.cardHolderfullName + "',' "  + req.body.cardNumber + "','"+ req.body.cvCode +  "','"   + req.body.expityMonth + "','" + req.body.expityYear + "','" + req.body.expityYear + "')";

  // /*  ---- ORIGINAL FORMAT TO INSERT INFORMATION INTO DATABASE
  // 				var sql ="INSERT INTO Registration( firstName ......)";

  // 				var addresssesSQL = "Insert into Addresses (address) VALUES ('"+ req.body.address+ "')";

  // */

  // 				console.log(sql);
  // 							con.query(sql, function(err, result)
  // 							{
  // 								console.log(result.insertedId);
  // 								peopleID = result.inserted; // PEOPLEID IS USED TO ESTABLISH A CONNECTION TO THE NEXT QUERY

  // 								if(err) throw err;
  // 								con.query(addressSQL, function (err, result)
  // 									{
  // 										console.log(result1);
  // 											console.log(result1.insertedID);
  // 										//	addressID = result1.insertedId;

  // 										if (err) throw err;

  // 										//THIS WILL BE USED FOR THE MAPPING TABLE
  // 										var peopleAddressMappingSQL = "insert into personAddress (personID, AddressID) values ('" + peopleID+ "', '"+addressID + "')";

  // 										console.log(peopleAddressMappingSQL);
  // 										con.query(peopleAddressMappingSQL, function( err, result2)
  // 										{
  // 											console.log(result2);
  // 											if(err) throw err;
  // 										});
  // 									});
  // 							});
  // 			});
  // 		//	console.log(con);
  // 		});
};