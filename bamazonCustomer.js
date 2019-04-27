var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "rootroot",
  database: "bamazonDB"
});

connection.connect(function (err) {
  if (err) throw err;
  displayItems();
});

function displayItems() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;

    var choiceArray = [];
    for (var i = 0; i < results.length; i++) {
      choiceArray.push("ID: " + results[i].id + " Product: " + results[i].product_name + " Price: $" + results[i].price);
    }
    console.log(choiceArray);
  })
}