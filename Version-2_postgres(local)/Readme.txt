Inventory Tracking System - Version 2

Overview
Version 2 of the Inventory Tracking System is designed support 500+ stores with a central product catalog and store-specific stock.

Design Decisions:

Database: PostgreSQL is used for data storage, allowing scalability and easy management of multiple stores and products.

schema : 

tables :
Product -> ( id, name, description, create_At)

Store -> ( id, name, address)
        
Users -> ( id, username, password_hash, store_id, role, is_active,  last_login, created_at );

Stock_movement -> ( id, product_id, store_id, quantity, type, timestamp)  

Inventory -> ( product_id, store_id, quantity, last_updated)


APIs :

1. User Management:

POST /auth/register: Registers a new user with a hashed password.
POST /auth/login: Logs in a user and provides a JWT token.
POST /auth/logout: Logs out a user by clearing the JWT token.

2. Store Management:

POST /stores/add: Adds a new store to the system.
GET /stores: Lists all stores.

2. Product Management:

GET /products: Returns all products.
POST /products/additem: Adds a new product with its initial stock.

4. Stock_movement:

GET /operations: Returns all stock movements.
POST /perform_operation: Adds a stock movement (stock-in, sold, or removed) and updates the product stock accordingly.


Assumptions:
3 operations will be performed in stock Movements  (stock-in, sold, or removed).
3 roles are present (admin, store_manager, viewer)

Additional : 
swagger is implemented for API documentation
RoleCheckMiddleware ensures that certain operations are only allowed for specific roles
Rate limiting is applied to all requests using express-rate-limit