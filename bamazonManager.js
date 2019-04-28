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