import {Request, Response} from "express"
import {collections} from "../server";
import {deployments} from "./imageController";
import Deployments from "../models/deployments";
import * as fs from "fs";

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


export const createDeployment = async (req: Request, res: Response) => {
    const {id} = req.params;
    let count;
    try {
        const newDeployment: Deployments = new Deployments(id);
        newDeployment.setCreationDate();
        const result = await collections[deployments].insertOne(newDeployment)
            .then(async r => {
                await addToCount();
                return r
            });
        res.status(200).send(result)
    } catch (e) {

    }
};

export const getAllDeployments = async (req: Request, res: Response) => {
    try {
        let allDeploys = await collections[deployments].find({}).toArray() as unknown as Deployments[];
        res.status(200).send(allDeploys)
    } catch (e) {
        res.status(500).send("Problem occurred")
    }
};

export const deleteAllDeployments = async (req: Request, res: Response) => {
    try {
        let result = await collections[deployments].deleteMany({});
        res.status(200).send(result)
    } catch (e) {
        res.status(500).send("Problem occurred")
    }
};

export const getCount = async (req: Request, res: Response) => {
    try {
        await fs.readFile(path, 'utf8', async (err, data) => {
            console.log(data);
            res.status(200).send(`${data} images have been deployed`)
        });

    } catch (e) {
        res.status(500).send("Sorry , something went wrong")
    }
};


