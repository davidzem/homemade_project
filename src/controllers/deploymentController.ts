import {Request, Response} from "express"
import {collections} from "../server";
import Deployments from "../models/deployments";
import * as fs from "fs";
import {catchAsync} from "../utils/catchAsync";
import {deployments} from "../config";
import {getPaginatedObjects, PaginationOptions, sortObjects} from "./imageController";

const path = "C:\\Users\\david\\Desktop\\Coding_stuff\\TSReact\\jobtest\\backend-enso\\count.txt";

const addToCount = async () => {
    let count: number;

    await fs.readFile(path, "utf8", async (err, data) => {
            count = Number(data) + 1;

            await fs.writeFile(path, String(count), 'utf8', (err) => {
                console.log(err)
            })
        }
    );

};


export const createDeployment = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const newDeployment: Deployments = new Deployments(id);

    newDeployment.setCreationDate();

    const result = await collections[deployments]
        .insertOne(newDeployment)
        .then(async r => {
            await addToCount();
            return r
        });
    res.status(200).send(result)

});


export const getAllDeployments = catchAsync(async (req: Request, res: Response) => {
    let {viaCreatedDate, viaUpdatedDate, asc, shouldPaginate, pageSize, pageNumber} = req.query;
    let paginationOptions: PaginationOptions = {
        shouldPaginate: shouldPaginate === "true",
        pageSize: (pageSize) ? Number(pageSize) : undefined,
        pageNumber: (pageNumber) ? Number(pageNumber) : undefined
    };
    let allDeploys = await getPaginatedObjects<Deployments>(deployments, paginationOptions);

    const sorted = sortObjects<Deployments>(allDeploys, {
        viaCreatedDate: (viaCreatedDate === 'true'),
        viaUpdatedDate: (viaUpdatedDate === 'true'),
        asc: (asc === "true")
    });

    return res.status(200).send(sorted)
});

export const deleteAllDeployments = catchAsync(async (req: Request, res: Response) => {
    let result = await collections[deployments].deleteMany({});

    return res.status(200).send(result)
});

export const getCount = catchAsync(async (req: Request, res: Response) => {
    await fs.readFile(path, 'utf8', async (err, data) => {
        console.log(data);
        return res.status(200).send(`${data} images have been deployed`)
    });
});


