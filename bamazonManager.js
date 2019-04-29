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
      // switch statement to choose which function to run based on what option they pick
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
// shows the user the products
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
    // gives the user the option to go back to menu
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
// shows what inventory is low
function viewLowInventory() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    // sets an array for the products to be put into
    var choiceArray = [];
    // for loop to go through the products and push them to the array if their stock is less than 5
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
// lets the user add inventory
function addInventory() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    // has the user choose which item they want to add stock to by id
    inquirer
      .prompt([{
          name: "choice",
          type: "rawlist",
          choices: function () {
            var choicesArray = [];
            for (var i = 0; i < results.length; i++) {
              choicesArray.push(results[i].id);
            }
            return choicesArray;
          },
          message: "Which procuct would you like to stock? (by ID)"
        },
        // asks the user how many they want to stock
        {
          name: "addStock",
          type: "number",
          message: "How much are you adding?"
        }
      ]).then(function (answer) {
        var chosenProduct;
        // get the information of the chosen item
        for (var i = 0; i < results.length; i++) {
          if (results[i].id === answer.choice) {
            chosenProduct = results[i];
          }
        }
        // creates the new quanity by adding the current stock and the amount the user wants to add
        var newQuantity = chosenProduct.stock_quantity + answer.addStock;

        connection.query(
          "UPDATE products SET ? WHERE ?",
          [{
              stock_quantity: newQuantity
            },
            {
              id: chosenProduct.id
            }
          ],
          function (err) {
            if (err) throw err;
            //
            console.log("You successfully added " + answer.addStock + " to the inventory!")
            inquirer
              .prompt({
                name: "exit",
                type: "list",
                choices: ["EXIT to menu"]
              }).then(function (answer) {
                startOptions()
              });
          }
        );
      });
  });
}
// asks the user what the name, department, price, and quanity of the product they want to add
function addNewProduct() {
  inquirer
    .prompt([{
        name: "productName",
        type: "input",
        message: "What is the name of the product you are adding?"
      },
      {
        name: "department",
        type: "input",
        message: "What department does this item belong to?"
      },
      {
        name: "price",
        input: "number",
        message: "What price are we selling this item for?"
      },
      {
        name: "quanity",
        input: "number",
        message: "What is the starting amount we are stocking?"
      }
    ]).then(function (answer) {

      connection.query(
        // inserts the answer int the table
        "INSERT INTO products SET ?", {
          product_name: answer.productName,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.quanity
        },
        function (err) {
          if (err) throw err;
          console.log("You successfully added " + answer.productName + " to the product list")
          inquirer
            .prompt({
              name: "exit",
              type: "list",
              choices: ["EXIT to menu"]
            }).then(function (answer) {
              startOptions()
            });
        }
      );
    });
}