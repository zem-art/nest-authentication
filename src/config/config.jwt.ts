export default () => ({
    jwt : {
        secret : process.env.JWT_SECRET_KEY || '6ae23fa5f92d1e22ebe6f198fdbbfa09755ed400',
        expiresIn: process.env.JWT_EXPIRES_IN || '10m',
        issuer: process.env.JWT_ISSUER || 'boba.com',
    }
})