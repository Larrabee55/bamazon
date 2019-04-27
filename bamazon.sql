DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Computer", 'Electronics', 1000.00, 300);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Phone", 'Electronics', 600.00, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Monitor", 'Electronics', 249.00, 900);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Keyboard", 'Electronics', 89.99, 300);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mouse", 'Electronics', 39.99, 300);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mouse Pad", 'Electronics', 14.99, 300);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Gaming Headset", 'Electronics', 59.99, 300);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Phone Case", 'Accessories', 34.99, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Phone Charger", 'Accessories', 9.99, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Headphones", 'Accessories', 8.99, 1000);