import {PORT} from "../config";

export const swaggerDef = {
    openapi: "3.0.0",
    info: {
        title: "Enso-Test Express API Swagger",
        version: '0.1.0',
        description:
            "CRUD API for the Docker Images",
        license: {
            name: "MIT",
            url: "https://spdx.org/licenses/MIT.html"
        },
        contact: {
            name: "David Zemlyanskiy",
            email: "davidzem@mail.ru",
            phone: "052-6209300"
        }
    },
    servers: [
        {
            url: `http://localhost:${PORT}/api`
        }
    ]
};