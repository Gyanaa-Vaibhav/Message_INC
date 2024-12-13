import jwt, {decode} from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
const accessKey = process.env.ACCESS_SECRET;
const refreshKey = process.env.REFRESH_SECRET;

// Generate access token (short-lived)
export function generateAccessToken(payload) {
    return jwt.sign(payload, accessKey, { expiresIn: '6h' });
}

// Generate refresh token (long-lived)
export function generateRefreshToken(payload) {
    return jwt.sign(payload, refreshKey, { expiresIn: '7d' });
}

// Verify access token
export function jwtTokenValidator(req,res,next){
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Authorization token missing or malformed'
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessKey, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token has expired'
                });
            }
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Attach decoded payload to request object
        req.user = decoded;

        next();
    });
}

// Refresh token
export function refreshToken(req,res,next){
    try {
        console.log('Refreshing token...');
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({ success: false, error: 'Refresh token is missing' });
        }

        const user = jwt.verify(token, refreshKey);

        const newAccessToken = jwt.sign(
            {
                username:user.username,
                email: user.email
            },
            accessKey,
            { expiresIn: '6h' }
        );
        req.user = user;

        return res.status(200).json({ success: true, accessToken: newAccessToken });

    } catch (error) {
        next(error);
    }
}
