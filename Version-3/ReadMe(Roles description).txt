Roles
1. Admin
The Admin role has the highest level of access. Admins can perform any operation on the system, 
including managing users (enabling, disabling, creating), stores, products, and stock movements.

Permissions:
View, create, disable, and enable users.
Add, view stores.
Add, view, and filter products.
Perform stock movements.

2. Store Manager
The Store Manager role has most of the permissions of the admin but is limited to operations 
within a single store.

Permissions:
View and filter products in their store.
Perform stock movements (stock-in, stock-out, transferred) in their store.
View stores and stock movements associated with their store.
create viewer user ONLY.

3. Viewer
The Viewer role has the least privileges. They are only allowed to view information and cannot 
make any modifications or changes.

Permissions:
View stores, products, and stock movements.
Cannot modify users, perform stock movements, or add any new entries.



Role Access Summary
Route	                                Admin	    Store Manager	    Viewer
/auth/login	                             ✅	            ✅	            ✅
/auth/logout	                         ✅	            ✅	            ✅
/auth/registeruser	                     ✅	            ✅	            ❌
/auth/disableuser	                     ✅	            ❌	            ❌
/auth/enableuser	                     ✅	            ❌	            ❌
/auth/allusers	                         ✅	            ❌	            ❌
/store/	                                 ✅	            ✅	            ✅
/store/addstore	                         ✅	            ❌	            ❌
/product/	                             ✅	            ✅	            ✅
/product/additem	                     ✅	            ✅	            ❌
/stockmovement/	                         ✅	            ✅	            ✅
/stockmovement/perform_operation	     ✅	            ✅	            ❌