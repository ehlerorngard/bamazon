# bamazon

This is a very basic inventory management app written via Node.js using small bits of SQL for database access using the mysql node module.  

## Getting Started

This app is available from my GitHub account at https://github.com/ehlerorngard/bamazon.  


### Prerequisites

You'll need node package manager. 


### Installing

To run this app you'll need these packages installed:  mysql and inquirer.  

At the directory's root after cloning down the repository, enter in the terminal:

```
npm install mysql
npm install inquirer
```

You'll need to run the file bamazon.sql in order to create the database necessary to use the app.  

The table can be populated with data by running the bamazonManager.js file and selecting Add New Product.

You'll also need to change the mysql localhost connection credentials to match your own.  


## Running the Customer Console

Simply open the file 'bamazonCustomer.js' in the terminal using node or nodemon:

```
nodemon bamazonCustomer.js
```
You'll then be able to make purchases as a user;  these will affect the inventory in the database.  

![screenshot of working app](/images/1.png)

![screenshot of working app](/images/2.png)

## Running the Manager Console

Simply open the file 'bamazonManager.js' in the terminal, similarly to as show above. 

Here, you'll be able to view total current and low inventory, add more inventory, and add entirely new products.  

![screenshot of working app](/images/3.png)
