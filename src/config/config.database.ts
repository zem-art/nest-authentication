import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    url : process.env.DATABASE_URL,
    port : process.env.DATABASE_PORT,
    user : process.env.DATABASE_USER,
    pass : process.env.DATABASE_PASSWORD,
    name : process.env.DATABASE_NAME || 'db-nest-js',
    direct : process.env.DATABASE_DIRECT,
    auth : process.env.DATABASE_AUTH,
}))