var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
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
    console.log(res);
    for (var i = 0; i < res.length; i++) {
      console.log("ID# " + res[i].item_id + " " + res[i].product_name + " ––– $" + res[i].price);
    }
    // runSearch();
    buyItem();

  });
}

function buyItem() {
  inquirer.prompt({
      type: "input",
      message: "Please input the id # of the item you'd like to buy: ",
      name: "item"
    },
    {
      type: "input",
      message: "How many units would you like to purchase?",
      name: "quant"
    })
    .then(function(answer) {
      console.log("this is what the user input(??):  " + answer.item);
      console.log(typeof answer.item);
      var totalCost = (answer.item * answer.quant);
      var item = parseInt(answer.item);
      console.log(item);
      console.log(typeof item);
      console.log(answer.quant);
      var quant = parseInt(answer.quant);
      console.log(quant);

      // if (Number.isInteger(answer.item) === false) {
        // console.log("The item id # you entered is invalid, please try again.");
        // buyItem();
      // }
      // else if (Number.isInteger(answer.item) === true) {
        var totalCost = (item * quant);
        var query = "SELECT price, stock_quantity FROM products WHERE ?;";
        connection.query(query, { item_id: item }, function(err, res) {
          console.log(res);
          console.log(res.stock_quantity);
          if (res.stock_quantity >= answer.quant) {
            updateQuats(answer.item, answer.quant);
            console.log("Sure thing!  Your total comes to $" + totalCost);
          }
          else if (res.stock_quantity > 0) {
            updateQuants(answer.item, res.stock_quantity);
            console.log("Sorry, we don't have enough to sell you that many, but we'll sell you " + res.stock_quantity + " today and notify you when more come in.");
          }
          else {
            console.log("Sorry, we are totally out of stock on that...  there'll be more arriving soon, I promise..");
          }
        })
      // }
    });
}

function updateQuants(id, quant) {
  var query = "UPDATE products SET stock_quantity = quant WHERE item_id = id";
  connection.query(query, function(err, res){
    console.log("The results are in:  " + res);
  });
}








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