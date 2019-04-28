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
  startOptions()
});

function startOptions() {
  inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "Choice what you need to do",
      choices: ["View Products", "View Low Inventory", "Add Inventory", "Add New Product", "Exit"]
    }).then(function (answer) {
      switch (answer.menu) {
        case "View Products":
          viewProducts()
          break;
        case "View Low Inventory":
          viewLowInventory()
          break;
        case "Add Inventory":
          addInventory()
          break;
        case "Add New Product":
          addNewProduct()
          break;
        default:
          connection.end();
      }
    });
}

function viewProducts() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    // sets an array for the products to be put into
    var choiceArray = [];
    // for loop to go through the products and push them to the array
    for (var i = 0; i < results.length; i++) {
      // pushes the id, name, and price of the product
      choiceArray.push("ID: " + results[i].id + " Product: " + results[i].product_name + " Price: $" + results[i].price + " Quantity:" + results[i].stock_quantity);
    }
    console.log(choiceArray)

    inquirer
      .prompt({
        name: "exit",
        type: "list",
        choices: ["EXIT to menu"]
      }).then(function (answer) {
        startOptions()
      });
  });
}

function viewLowInventory() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    // sets an array for the products to be put into
    var choiceArray = [];
    // for loop to go through the products and push them to the array
    for (var i = 0; i < results.length; i++) {
      if (results[i].stock_quantity < 6) {
        choiceArray.push("ID: " + results[i].id + " Product: " + results[i].product_name + " Price: $" + results[i].price + " Quantity:" + results[i].stock_quantity);
      }
    }
    console.log(choiceArray)

    inquirer
      .prompt({
        name: "exit",
        type: "list",
        choices: ["EXIT to menu"]
      }).then(function (answer) {
        startOptions()
      });
  });
}

function addInventory() {

}

function addNewProduct() {

}