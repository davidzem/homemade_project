import morgan from "morgan"
import helmet from "helmet";
import express from 'express'
import cors from 'cors'
import api from "./routes";
import passport from "passport"
import {jwtStrategy} from "./config/passport";
import {errorConverter, errorHandler} from "./middleware/error";
import ApiError from "./utils/ApiError";
import httpStatus = require("http-status");


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
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

//static file folder
app.use("/static", express.static("public"));

//API
app.use("/api", api);

//Send for 404
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
});

//convert error to custom ApiError class, if needed
app.use(errorConverter);

//handle errors
app.use(errorHandler);

export default app

