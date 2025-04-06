import { readPool, writePool } from '../db.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { publishAuditEvent } from '../Utilities/auditPublisher.js';
import redisClient from '../Utilities/redisClient.js';


export const registerUser = async (req, res) => {
    let { username, password, role, store_id } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if ((role == "store_manager" || role == "admin") && req.user.role != "admin") {
        return res.status(403).json({ message: "Forbidden - Only admin can assign store_manager or add another admin" });
    }

    const client = await writePool.connect();
    
    if(!store_id) store_id = null;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        client.query("BEGIN");
        const result = await client.query(
            `INSERT INTO users (username, password_hash, role, store_id, is_active) 
             VALUES ($1, $2, $3, $4, TRUE) RETURNING id, username, role, is_active`,
            [username, hashedPassword, role, store_id]
        );

        const newUser = result.rows[0];

        console.log(newUser)

        const auditEvent = {
            service: "user_management",
            operation: "INSERT",
            userId: req.user.id, 
            tableName: "users",
            recordId: newUser.id,
            newData: newUser,
            timestamp: new Date().toISOString()
        };
        await publishAuditEvent(auditEvent);

        client.query("COMMIT");

        await redisClient.del("users:all");

        res.status(201).json({ message: "User created successfully", user: result.rows[0] });
    } catch (err) {
        client.query("ROLLBACK");
        res.status(500).json({ error: err.message });
    }finally {
        client.release();
    }
};

export const loginUser = async (req, res) => {
    const {username, password} = req.body;

    try {
        const userRes = await readPool.query("SELECT * FROM users WHERE username = $1 AND is_active = TRUE", [username]);
        
        if (userRes.rows.length <= 0) return res.status(401).json({ message: "Invalid credentials" });

        const user = userRes.rows[0];

        const matchPassword = await bcrypt.compare(password, user.password_hash)

        if(!matchPassword) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, role: user.role, store_id : user.store_id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.cookie("token", token, { httpOnly: true, secure: false });
        await writePool.query("UPDATE users SET last_login = NOW() WHERE id = $1", [user.id]);

        res.json({ message: "Login successful", user: { id: user.id, username: user.username, role: user.role } });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
};

export const disableUser = async (req, res) => {
    const { id, username } = req.body;
    const adminId = req.user.id;

    const query = id ? "SELECT * FROM users WHERE id = $1" : "SELECT * FROM users WHERE username = $1";
    const updateQuery = id ? "UPDATE users SET is_active = FALSE WHERE id = $1" : "UPDATE users SET is_active = FALSE WHERE username = $1";
    const queryParams = id ? [id] : [username];
    const client = await writePool.connect();

    try {
        const { rows } = await readPool.query(query, queryParams);
        if (rows.length === 0) {
            return res.status(404).json({ error: "User Not Found" });
        }
        const previousData = {
            id : rows[0].id,
            role : rows[0].role,
            store_id : rows[0].store_id,
            username : rows[0].username
        };


        client.query("BEGIN");
        await client.query(updateQuery, queryParams);

        const newData = { ...previousData, is_active: false };

        const auditEvent = {
            service: "user_management",
            operation: "DISABLE",
            userId: adminId,
            tableName: "users",
            recordId: previousData.id,
            previousData,
            newData,
            timestamp: new Date().toISOString()
        };
        await publishAuditEvent(auditEvent);

        client.query("COMMIT");
        await redisClient.del("users:all");

        res.json({ message: "User disabled successfully" });
    } catch (err) {
        client.query("ROLLBACK");
        res.status(500).json({ error: err.message });
    }finally {
        client.release();
    }
};

export const enableUser = async (req, res) => {
    const { id, username } = req.body;
    const adminId = req.user.id;

    const query = id ? "SELECT * FROM users WHERE id = $1" : "SELECT * FROM users WHERE username = $1";
    const updateQuery = id ? "UPDATE users SET is_active = TRUE WHERE id = $1" : "UPDATE users SET is_active = TRUE WHERE username = $1";
    const queryParams = id ? [id] : [username];
    const client = await writePool.connect();

    try {
        
        const { rows } = await readPool.query(query, queryParams);
        if (rows.length === 0) {
            return res.status(404).json({ error: "User Not Found" });
        }
        
        const previousData = {
            id : rows[0].id,
            role : rows[0].role,
            store_id : rows[0].store_id,
            username : rows[0].username
        };

        await client.query("BEGIN");
        await client.query(updateQuery, queryParams);

        const newData = { ...previousData, is_active: true };

        const auditEvent = {
            service: "user_management",
            operation: "ENABLE",
            userId: adminId,
            tableName: "users",
            recordId: previousData.id,
            previousData,
            newData,
            timestamp: new Date().toISOString()
        };
        await publishAuditEvent(auditEvent);
        

        await client.query("COMMIT");

        await redisClient.del("users:all");

        res.json({ message: "User enabled successfully" });
    } catch (err) {
        await client.query("ROLLBACK");

        res.status(500).json({ error: err.message });
    }finally {
        client.release();
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const cacheKey = "users:all";
        const cachedUsers = await redisClient.get(cacheKey);
        if (cachedUsers) {
            console.log('returning cached users');
            return res.json(JSON.parse(cachedUsers));
        }
        const result = await readPool.query("SELECT * FROM users");
        await redisClient.set(cacheKey, JSON.stringify(result.rows), { EX: 60 });

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};