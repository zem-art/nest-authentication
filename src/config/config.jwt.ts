export default () => ({
    jwt : {
        secret : process.env.JWT_SECRET_KEY,
        expiresIn: process.env.JWT_EXPIRES_IN || '1m',
        issuer: process.env.JWT_ISSUER || 'boba.com',
    }
})