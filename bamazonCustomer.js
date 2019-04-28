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
    console.log(choiceArray)

    inquirer
      .prompt([{
        name: "buyOrExit",
        type: "list",
        choices: ["Buy", "Exit"]
      }]).then(function (answer) {
        if (answer.buyOrExit === "Buy") {
          buyAnItem()
        } else {
          connection.end();
        }
      })
  });
}

function buyAnItem() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;

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
        {
          name: "quantityWanted",
          type: "input",
          message: "How many would you like to purchase?"
        }
      ]).then(function (answer) {
        var chosenProduct;

        for (var i = 0; i < results.length; i++) {
          if (results[i].id === answer.choice) {
            chosenProduct = results[i];
          }
        }

        if (chosenProduct.stock_quantity > parseInt(answer.quantityWanted)) {
          var newQuantity = chosenProduct.stock_quantity - answer.quantityWanted;
          var totalPurchase = answer.quantityWanted * chosenProduct.price;
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
              console.log("Your total is $" + totalPurchase)
              displayItems();
            }
          );
        } else {

          console.log("insufficient Quantity")
          buyAnItem()
        }
      });
  });
}