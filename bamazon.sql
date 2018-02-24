DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT(30) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(90) NOT NULL,
	department_name VARCHAR(30),
	price DECIMAL(10, 2),
	stock_quantity INT(6),
	PRIMARY KEY(item_id)
);

SELECT * FROM bamazon;
