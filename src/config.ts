import * as dotenv from "dotenv"

dotenv.config();

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;


//Mongo db config
export const MONGO_CONN_STRING = process.env.MONGO_CONN_STRING;
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
export const MONGO_DB_IMAGES_COLLECTION = "images";
export const MONGO_DB_DEPLOYMENTS_COLLECTION = "deployments";
export const MongoDB_Collections = [MONGO_DB_IMAGES_COLLECTION, MONGO_DB_DEPLOYMENTS_COLLECTION];

//jwt config
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_ACCESS_EXPIRATION_MINUTES = process.env.JWT_ACCESS_EXPIRATION_MINUTES;
export const JWT_REFRESH_EXPIRATION_DAYS = process.env.JWT_REFRESH_EXPIRATION_DAYS;
export const JWT_RESET_PASSWORD_EXPIRATION_MINUTES = process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES;
export const JWT_VERIFY_EMAIL_EXPIRATION_MINUTES = process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES;

