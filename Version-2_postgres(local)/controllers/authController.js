import pool from '../db.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    const { username, password, role, store_id } = req.body;
    
    if (!username || !password || !role) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if( (role == "store_manager" || role == "admin") && req.user.role != "admin"){
        return res.status(403).json({ message: 'Forbidden - Permission denied - only admin can change store Manager or add another admin' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
            `INSERT INTO users (username, password_hash, role, store_id) 
             VALUES ($1, $2, $3, $4) RETURNING id, username, role`,
            [username, hashedPassword, role, store_id]
        );

        res.status(201).json({ message: "User created successfully", user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const loginUser = async (req, res) => {
    const {username, password} = req.body;

    try {
        const userRes = await pool.query("SELECT * FROM users WHERE username = $1 AND is_active = TRUE", [username]);
        
        if (userRes.rows.length <= 0) return res.status(401).json({ message: "Invalid credentials" });

        const user = userRes.rows[0];

        const matchPassword = await bcrypt.compare(password, user.password_hash)

        if(!matchPassword) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.cookie("token", token, { httpOnly: true, secure: false });
        await pool.query("UPDATE users SET last_login = NOW() WHERE id = $1", [user.id]);

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
    const { id, username } = req.params;
    
    const query = id?"UPDATE users SET is_active = FALSE WHERE id = $1":"UPDATE users SET is_active = FALSE WHERE username = $1 ";
    const queryParams = id?[id]:[username];

    try {
        await pool.query(query , queryParams);
        res.json({ message: "User disabled successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const enableUser = async (req, res) => {
    const { id, username } = req.params;
    
    const query = id?"UPDATE users SET is_active = TRUE WHERE id = $1":"UPDATE users SET is_active = TRUE WHERE username = $1 ";
    const queryParams = id?[id]:[username];

    try {
        await pool.query(query , queryParams);
        res.json({ message: "User enabled successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getAllUsers = async (req, res) => {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);

}