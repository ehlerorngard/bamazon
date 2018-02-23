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
  var query = "SELECT item_id, product_name, price FROM bamazon ";
  connection.query(query, function(err, res) {
    console.log(res);
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " " + res[i].product_name);
    }
    // runSearch();
    buyItem();
    connection.end();
  });
}

function buyItem() {
  inquirer
    .prompt({
      name: "item",
      type: "input",
      message: "Please input the id # of the item you'd like to buy: "
    },
    {
      name: "quant",
      type: "input",
      message: "How many units would you like to purchase?"
    })
    .then(function(answer) {
      var totalCost = (answer.item * answer.quant);
      if (Number.isInteger(answer.item) === false) {
        console.log("The item id # you entered is invalid, please try again.");
        buyItem();
      }
      else if (Number.isInteger(answer.item) === true) {
        var totalCost = (answer.item * answer.quant);
        var query = "SELECT price, stock_quantity FROM bamazon WHERE item_id = answer.item";
        connection.query(query, function(err, res) {
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
      }
    });
}

function updateQuants(id, quant) {
  var query = "";
  connection.query(query, {}, function(err, res){

  });
}

function artistSearch() {
  inquirer
    .prompt({
      name: "artist",
      type: "input",
      message: "What artist would you like to search for?"
    })
    .then(function(answer) {
      var query = "SELECT position, song, year FROM top5000 WHERE ?";
      connection.query(query, { artist: answer.artist }, function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
        }
        runSearch();
      });
    });
}


function rangeSearch() {
  inquirer
    .prompt([{
        name: "start",
        type: "input",
        message: "Enter starting position: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "end",
        type: "input",
        message: "Enter ending position: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
      connection.query(query, [answer.start, answer.end], function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(
            "Position: " +
            res[i].position +
            " || Song: " +
            res[i].song +
            " || Artist: " +
            res[i].artist +
            " || Year: " +
            res[i].year
          );
        }
        runSearch();
      });
    });
}

function songSearch() {
  inquirer
    .prompt({
      name: "song",
      type: "input",
      message: "What song would you like to look for?"
    })
    .then(function(answer) {
      console.log(answer.song);
      connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
        console.log(
          "Position: " +
          res[0].position +
          " || Song: " +
          res[0].song +
          " || Artist: " +
          res[0].artist +
          " || Year: " +
          res[0].year
        );
        runSearch();
      });
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