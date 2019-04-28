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
// function to display products and ask the user if they want to buy a product or if they want to exit
function displayItems() {
  // selects the products from a table
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    // sets an array for the products to be put into
    var choiceArray = [];
    // for loop to go through the products and push them to the array
    for (var i = 0; i < results.length; i++) {
      // pushes the id, name, and price of the product
      choiceArray.push("ID: " + results[i].id + " Product: " + results[i].product_name + " Price: $" + results[i].price);
    }
    // shows the array to the user
    console.log(choiceArray)
    // asks the user if they want to buy or exit
    inquirer
      .prompt([{
        name: "buyOrExit",
        type: "list",
        choices: ["Buy", "Exit"]
      }]).then(function (answer) {
        // if the user wants to buy it then runs the buyAnItem function
        if (answer.buyOrExit === "Buy") {
          buyAnItem()
        }
        // if the user picks exit its exits them out
        else {
          connection.end();
        }
      })
  });
}

function buyAnItem() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    // has the user choose which item they want to buy by id
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
          message: "Which procuct would you like to purchase? (by ID)"
        },
        // asks the user how many they want to buy
        {
          name: "quantityWanted",
          type: "input",
          message: "How many would you like to purchase?"
        }
      ]).then(function (answer) {
        var chosenProduct;
        // get the information of the chosen item
        for (var i = 0; i < results.length; i++) {
          if (results[i].id === answer.choice) {
            chosenProduct = results[i];
          }
        }
        // determines if there is enough product to be sold
        if (chosenProduct.stock_quantity > parseInt(answer.quantityWanted)) {
          var newQuantity = chosenProduct.stock_quantity - answer.quantityWanted;
          var totalPurchase = answer.quantityWanted * chosenProduct.price;
          // sets the new quantity to the database
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
              // tells the user how much the total is
              console.log("Your total is $" + totalPurchase)
              // takes user back to the buy or exit screen
              displayItems();
            }
          );
        }
        // if there isn't enough product to complete purchase
        else {
          console.log("insufficient Quantity")
          buyAnItem()
        }
      });
  });
}