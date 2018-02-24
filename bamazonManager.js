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
  initialPrompt();
});

function initialPrompt() {
  inquirer.prompt([
    {
      type: "list",
      message: "Please input the id # of the item you'd like to buy: ",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
      name: "dowhat"
    }]).then(function(answer) {
      switch (answer.dowhat) {
        case "View Products for Sale":
          viewProducts();
          break;
        case "View Low Inventory":
          viewLowInventory();
          break;
        case "Add to Inventory":
          addInventory();
          break;
        case "Add New Product":
          addProduct();
          break;
      }
    });
}


function viewProducts() {
  var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
  connection.query(query, function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("ID# " + res[i].item_id + " " + res[i].product_name + " ––– $" + res[i].price + " ––– STOCK: " + res[i].stock_quantity);
    }
    console.log("|__|============={^}=============|__|\n");
    initialPrompt();
  });
}

function viewLowInventory() {
  var query = "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5";
  connection.query(query, function(err, res) {
    if (err) throw err;
    if (res.length < 1) {
      console.log("There are no products currently with low inventory.");
      console.log("|__|============={^}=============|__|\n");
    }
    else {
      for (var i = 0; i < res.length; i++) {
        console.log("ID# " + res[i].item_id + " " + res[i].product_name + " ––– stock remaining: " + res[i].stock_quantity);
      }
      console.log("|__|============={^}=============|__|\n");
    }
    initialPrompt();
  });
}

function addInventory() {
  inquirer.prompt([
    {
      type: "input",
      message: "Please input the id # of the item you'd like increase the inventory of: ",
      name: "item"
    },{
      type: "input",
      message: "How many units would you like to acquire and stock?",
      name: "quant"
    }]).then(function(answer) {
      var item = parseInt(answer.item);
      var quant = parseInt(answer.quant);
      if ((Number.isInteger(item) === false) || (Number.isInteger(quant) === false)) {
        console.log("The value you entered is invalid, please be sure to enter a number.");
        buyItem();
      }
      else {
        var query = "SELECT stock_quantity FROM products WHERE ?;";
        connection.query(query, { item_id: item }, function(err, res) {
          var stockQuant = res[0].stock_quantity;
          var newQuant = stockQuant + quant;
          console.log("There are now " + newQuant + " units of product ID# " + item + " in stock.");
          var query = "UPDATE products SET ? WHERE ?;";
          connection.query(query, [{ stock_quantity: newQuant }, { item_id: item }], function(err, res) {
            console.log("|__|============={^}=============|__|");
            initialPrompt();
          });
        });
      }
    });
}

function addProduct() {
  inquirer.prompt([
    {
      type: "input",
      message: "What is the name of the new product you'd like to add to the inventory?",
      name: "itemName"
    },
    {
      type: "input",
      message: "What department is it in?",
      name: "department"
    },
    {
      type: "input",
      message: "How much will each unit cost?",
      name: "cost"
    },
    {
      type: "input",
      message: "How many units would you like to stock?",
      name: "units"
    }]).then(function(answer) {
      var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?;";
      connection.query(query, (answer.itemName, answer.department, answer.cost, answer.units), function(err, res) {
        
        console.log("Here's the new item you added: \n");
        console.log("|__|============={^}=============|__|");
        initialPrompt();
      });
    });
}