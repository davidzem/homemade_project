import * as  dotenv from "dotenv"
import * as  mongoDB from "mongodb"
import {MONGO_CONN_STRING,  MONGODB_NAME, MongoDB_Collections, PORT} from "./config";
import {MongoClientOptions, ServerApiVersion} from "mongodb";
import app from "./app";

const MongoConfig: MongoClientOptions = {
    serverApi: ServerApiVersion.v1
};

type CollectionType = { [key: string]: mongoDB.Collection }

let server;

export const collections: CollectionType = {};
const connectToDatabase = async () => {
    dotenv.config();
    console.log(MONGO_CONN_STRING);
    try {
        const client = new mongoDB.MongoClient(MONGO_CONN_STRING, MongoConfig);

        await client.connect();

        const db: mongoDB.Db = client.db(MONGODB_NAME);

        MongoDB_Collections.map((collectionName) => {
            collections[`${collectionName}`] = db.collection(collectionName)
        });

        console.log(`Successfully connected to database:${db.databaseName} and collections: ${collections[`${MongoDB_Collections[0]}`].collectionName}`)
    } catch (e) {
        throw  new Error(e)
    }
};


connectToDatabase()
    .then(() => {
        console.log("MongoDB connected");
        server = app.listen(PORT, () => {
            console.log(`Server is listening on ${PORT}`)
        });
    })
    .catch(err => {
        console.error(err.message, "Exiting the programm");
        process.exit()
    });
