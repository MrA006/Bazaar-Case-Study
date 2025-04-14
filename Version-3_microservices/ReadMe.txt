Inventory Tracking System - Version 3

Overview:
This project sets up a microservices architecture with several services.


Services:

Main Service: Handles authentication APIs and store APIs.

Product Service: Manages product APIs.

Stock Movement Service: Handles stock movements in inventory.

Audit Log Service: Captures and sends audit events to RabbitMQ.

Redis: Provides caching for enhanced performance.

RabbitMQ: Message queue for asynchronous audit logging.

PostgreSQL: Main database for storing inventory data.

PostgreSQL Replica: Hot standby replica for high availability for Read operations.


API end-points:
same as version-2

additional:
swagger is implemented for API documentation
RoleCheckMiddleware ensures that certain operations are only allowed for specific roles
Rate limiting is applied to all requests using express-rate-limit
A script (wait-for-it.sh) is included to check if the required services     are available before starting any service.
