var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  showItems();
});


function showItems() {
  var query = "SELECT item_id, product_name, price FROM products";
  connection.query(query, function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("ID# " + res[i].item_id + " " + res[i].product_name + " ––– $" + res[i].price);
    }
    buyItem();
  });
}

function buyItem() {
  inquirer.prompt([
    {
      type: "input",
      message: "Please input the id # of the item you'd like to buy: ",
      name: "item"
    },{
      type: "input",
      message: "How many units would you like to purchase?",
      name: "quant"
    }]).then(function(answer) {
      var totalCost = (answer.item * answer.quant);
      var item = parseInt(answer.item);
      var quant = parseInt(answer.quant);
      if ((Number.isInteger(item) === false) || (Number.isInteger(quant) === false)) {
        console.log("The value you entered is invalid, please be sure to enter a number.");
        buyItem();
      }
      else {
        var query = "SELECT price, stock_quantity FROM products WHERE ?;";
        connection.query(query, { item_id: item }, function(err, res) {
          if (res[0].stock_quantity >= quant) {
            var totalCost = (res[0].price * quant);
            updateQuants(item, quant, res[0].stock_quantity);
            console.log("Sure thing!  Your total comes to $" + totalCost.toFixed(2));
          }
          else if (res[0].stock_quantity > 0) {
            var totalCost = (res[0].price * res[0].stock_quantity);
            updateQuants(item, res[0].stock_quantity, res[0].stock_quantity);
            console.log("So... we don't have enough to sell you that many, but we'll sell you " + res[0].stock_quantity + " today and notify you when we get more in stock.");
          }
          else {
            console.log("Sorry, we are totally out of stock on that...  there'll be more arriving soon, I promise..");
          }
        })
      }
    });
}

function updateQuants(id, quant, stockQuant) {
  var newQuant = stockQuant - quant;
  var query = "UPDATE products SET ? WHERE ?;";
  connection.query(query, [{ stock_quantity: newQuant }, { item_id: id }], function(err, res) {
    console.log("|__|============={^}=============|__|\n");
    showItems();
  });
}

// item_id = '2'




/// ... FROM bamazon GROUP BY artist HAVING count(*) > 1

// .then(function(answer) {
//       switch (answer.buy) {
//         case "Find songs by artist":
//           artistSearch();
//           break;

//         case "Find all artists who appear more than once":
//           multiSearch();
//           break;

//         case "Find data within a specific range":
//           rangeSearch();
//           break;

//         case "Search for a specific song":
//           songSearch();
//           break;
//       }
//     });