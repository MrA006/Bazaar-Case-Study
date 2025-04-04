import pool from "../db.js";

async function logAudit(client, {
    service,
    operation,
    userId,
    tableName,
    recordId,
    previousData = null,
    newData = null
}) {
    await client.query(
        `INSERT INTO audit_log (service, operation, user_id, table_name, record_id, previous_data, new_data)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [service, operation, userId, tableName, recordId, previousData, newData]
    );
}

export default logAudit;
