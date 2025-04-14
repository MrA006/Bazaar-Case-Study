Inventory Tracking System - Version 1

Overview
Version 1 of the Inventory Tracking System is designed for a single store using SQLite for local data storage.

Design Decisions

Database: SQLite is used for local storage to keep the setup simple and lightweight for the initial version

schema : 

tables :
Product -> (id, name, current_quantity)


APIs :
GET /products: Returns all products.

GET /operations: Returns all stock movements.

POST /products/additem: Adds a new product with its initial stock.

POST /perform_operation: Adds a stock movement (stock-in, sold, or removed) and updates the product stock accordingly.


Assumptions:
The system is designed to handle stock movements for a single store only.
All products and stock movements are stored in a local SQLite database.
We assume the initial inventory stock is 0 unless specified in the request to add a product.