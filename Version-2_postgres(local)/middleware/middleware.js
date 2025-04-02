import jwt from 'jsonwebtoken';


export const authMiddleware = (req, res, next) =>{

    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    try {
        const check = jwt.verify(token, process.env.JWT_SECRET);
        req.user = check;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden - Invalid token' });
    }

}

export const RoleCheckMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden - Access denied' });
        }
        next();
    }
}

