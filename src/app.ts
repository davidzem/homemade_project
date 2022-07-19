import morgan from "morgan"
import helmet from "helmet";
import express from 'express'
import cors from 'cors'
import api from "./routes";
import passport from "passport"


const app = express();

//logger
app.use(morgan("tiny"));

//Security
app.use(helmet());

//body-parser and middleware
app.use(express.json());

app.use(cors());
app.options("*", cors());

//authentication
// app.use(passport.initialize());
// passport.use('jwt' , )

//static file folder
app.use("/static", express.static("public"));

//API
app.use("/api", api);

export default app