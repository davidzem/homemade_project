import {Request, Response} from "express"
import {collections} from "../server";
import {deployments} from "./imageController";
import Deployments from "../models/deployments";
import * as fs from "fs";
import {catchAsync} from "../utils/catchAsync";

const path = "C:\\Users\\david\\Desktop\\Coding_stuff\\TSReact\\jobtest\\backend-enso\\count.txt";

const addToCount = async () => {
    let count: number;
    await fs.readFile(path, "utf8", async (err, data) => {
            console.log(data);
            count = Number(data) + 1;
            await fs.writeFile(path, String(count), 'utf8', (err) => {
                console.log(err)
            })
        }
    );

};


export const createDeployment = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    let count;

    const newDeployment: Deployments = new Deployments(id);
    newDeployment.setCreationDate();
    const result = await collections[deployments].insertOne(newDeployment)
        .then(async r => {
            await addToCount();
            return r
        });
    res.status(200).send(result)

});

export const getAllDeployments = catchAsync(async (req: Request, res: Response) => {
    let allDeploys = await collections[deployments].find({}).toArray() as unknown as Deployments[];
    res.status(200).send(allDeploys)
});

export const deleteAllDeployments = catchAsync(async (req: Request, res: Response) => {
    let result = await collections[deployments].deleteMany({});
    res.status(200).send(result)
});

export const getCount = catchAsync(async (req: Request, res: Response) => {
    await fs.readFile(path, 'utf8', async (err, data) => {
        console.log(data);
        res.status(200).send(`${data} images have been deployed`)
    });
});


