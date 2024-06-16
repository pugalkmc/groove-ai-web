// load dotenv file
import dotenv from "dotenv";
dotenv.config()

const MONGODB_URL = process.env.MONGODB_URL
const PORT = process.env.PORT
const JWT_SECRET = process.env.JWT_SECRET
const CLIENT_URL = process.env.CLIENT_URL

export {
    MONGODB_URL,
    PORT,
    JWT_SECRET,
    CLIENT_URL
}