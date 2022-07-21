import {Router} from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express'
import {swaggerDef} from "../docs/swaggerDef";

const docsRouter = Router();

const specs = swaggerJSDoc({
    definition: swaggerDef,
    apis: ['src/docs/*.yml', 'src/routes/*.js']
});

docsRouter.use('/',
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

export default docsRouter