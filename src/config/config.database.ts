import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    url : process.env.DATABASE_URL,
    port : process.env.DATABASE_PORT,
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
}))