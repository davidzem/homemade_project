import {Response, Request} from 'express'
import {collections} from "../server";
import {MongoDB_Collections} from "../config";
import Image from "../models/image";
import {ObjectID} from "mongodb";

export const [images, deployments] = MongoDB_Collections;


const getAllCombosOfArray = (arr: Image[], length: number) => {
    let data = new Array(length);
    let memoryArray: Image[][] = [];

    const combinationUtil = (arr: Image[], data: Image[], startInsideArr: number, endInsideArr: number, indexOfData: number, lengthOfData: number) => {

        if (indexOfData === lengthOfData) {
            let newData = [];
            for (let j = 0; j < lengthOfData; j++) {
                newData.push(data[j]);
            }
            memoryArray.push(newData)
        }

        for (let i = startInsideArr; i <= endInsideArr && endInsideArr - i + 1 >= lengthOfData - indexOfData; i++) {
            data[indexOfData] = arr[i];
            combinationUtil(arr, data, i + 1, endInsideArr, indexOfData + 1, lengthOfData)
        }
    };
    combinationUtil(arr, data, 0, arr.length - 1, 0, length);
    console.log(memoryArray);
    return memoryArray
};


export const getCombinations = async (req: Request, res: Response) => {
    const {length} = req.query;

    let memoryArray: Image[][] = [];

    try {
        let allImages = await collections[images].find({}).toArray() as unknown as Image[];

        if (Number(length) <= allImages.length) {
            memoryArray = getAllCombosOfArray(allImages, Number(length));
            res.status(201).send(memoryArray)
        } else res.status(400).send("Sorry amount of all images is less then the length of array you wanted")
    } catch (e) {
        res.status(400).send(e.message)
    }

};

type SortOptions = {
    viaCreatedDate?: boolean,
    viaUpdatedDate?: boolean,
    asc?: boolean
}
const sortImages = (images: Image[], {viaCreatedDate, viaUpdatedDate = false, asc = true}: SortOptions): Image[] => {
    let sorted: Image[] = [];
    console.log(viaCreatedDate);
    if (viaUpdatedDate && viaCreatedDate)
        return images;
    if (!viaCreatedDate && !viaUpdatedDate)
        return images;
    if (viaCreatedDate) {
        console.log("Now here");

        sorted = images.sort((imageA, imageB) => {
            console.log(asc);
            if (asc)
                return Number(imageA.createdAt) - Number(imageB.createdAt);
            else return Number(imageB.createdAt) - Number(imageA.createdAt)
        })
    }
    if (viaUpdatedDate) {
        sorted = images.sort((imageA, imageB) => {
            let updateDateA = imageA.updatedAt;
            let updateDateB = imageB.updatedAt;
            if (updateDateA !== null && updateDateB !== null) {
                if (asc) {
                    console.log("Ascending");
                    return (Number(updateDateA) - Number(updateDateB));
                } else return (Number(updateDateB) - Number(updateDateA))
            } else if (updateDateB === null) {
                return (Number(updateDateA))
            } else if (updateDateA === null) {
                return Number(updateDateB)
            } else return null
        })
    }

    return sorted
};

export const getAllImages = async (req: Request, res: Response) => {
    let {viaCreatedDate, viaUpdatedDate, asc} = req.query;
    const assignQuery = () => {

    };
    // @ts-ignore
    // const sorting = (images: Image[]) => {
    //     let sorted = images;
    //     if (viaCreatedDate) {
    //         sorted = images.sort((imageA, imageB) => Number(imageA.getCreationDate()) - Number(imageB.getCreationDate()))
    //     } else if (viaUpdatedDate) {
    //         sorted = images.sort((imageA, imageB) => {
    //             let updateDateA = imageA.getUpdatedDate();
    //             let updateDateB = imageB.getUpdatedDate();
    //             if (updateDateA !== null && updateDateB !== null) {
    //                 return (Number(updateDateA) - Number(updateDateB))
    //             } else if (updateDateB === null) {
    //                 return (Number(updateDateA))
    //             } else if (updateDateA === null) {
    //                 return Number(updateDateB)
    //             } else return null
    //         })
    //     }
    //
    //     return sorted
    // };
    try {
        const result = await collections[images].find({}).toArray().then(r => r) as unknown as Image[];
        let sorted: Image[] = result;
        if (viaCreatedDate) {
            sorted = sortImages(result, {
                viaCreatedDate: (viaCreatedDate === "true"),
                asc: (asc === "true")
            });

        }
        if (viaUpdatedDate) {
            sorted = sortImages(result, {viaUpdatedDate: (viaUpdatedDate === "true"), asc: (asc === "true")})
        }


        (sorted) ? res.status(200).send(sorted)
            : res.status(500).send("Sorry , server mistake")
    } catch (e) {
        res.status(400).send("Provided data appears to be  incorrect ")

    }
};

export const getImageViaID = async (req: Request, res: Response) => {
    const {id} = req.params;
    const query = {
        _id: new ObjectID(id)
    };
    try {
        const result = (await collections[images].findOne(query)) as unknown as Image;
        result ? res.status(201).send(result)
            : res.status(500).send("Sorry , server mistake")
    } catch (e) {
        res.status(400).send("Provided data appears to be  incorrect ")
    }
};


export const postImage = async (req: Request, res: Response) => {
    const image = req.body;
    try {
        if (!image.createdAt) {
            image.createdAt = new Date()
        }
        let existingImage = await collections[images].findOne({name: image.name});
        if (existingImage) {
            res.status(400).send(`Sorry an image with the same name is already exists under id ${existingImage._id}`);
            return
        }
        await collections[images].insertOne(image)
            .then(r => res.status(201).send({message: `Successfully created an image `, data: r})
            )
            .catch(() => res.status(500).send("Sorry something went wrong"))
    } catch (e) {
        res.status(400).send(`Mistake occured: ${e.message}`)
    }
};

export const updateImage = async (req: Request, res: Response) => {
    const {id} = req.params;
    const updatedParty = req.body;
    const query = {_id: new ObjectID(id)};
    let shouldUpdate: boolean = false;
    try {
        let previousData = await collections[images].findOne(query);
        console.log(previousData);
        Object.keys(previousData).map(key => {
            if (previousData[`${key}`] !== updatedParty[`${key}`]) {
                shouldUpdate = true;
                return
            }
        });
        console.log(shouldUpdate);
        if (shouldUpdate) {
            await collections[images].updateOne(query, {
                $set: {
                    ...updatedParty,
                    metadata: {...updatedParty.metadata, ...previousData.metadata},
                    updatedDate: new Date()
                }
            })
                .then(() => res.send("Updated successfully"))
                .catch(e => res.send(`Error has occured: ${e.message}`))

        } else res.send("No changes had been made")
    } catch (e) {
        res.status(400).send(e.message)

    }
};


export const deleteImage = async (req: Request, res: Response) => {
    const {id} = req.params;
    const query = {_id: new ObjectID(id)};
    try {
        const result = await collections[images].findOne(query);

        if (result) {
            await collections[images].deleteOne(query);
            res.status(200).send("Image was successfully deleted")
        }
    } catch (e) {
        res.status(400).send("Something went wrong")
    }
};

export const deleteAll = async (req: Request, res: Response) => {
    try {
        await collections[images].deleteMany({})
            .then(() => {
                res.status(201).send("Deleted all images")
            })
            .catch(e => {
                throw new Error(e.message)
            })
    } catch (e) {
        res.status(500).send(`Something went wrong , try again later. Error message: ${e.message}`)

    }
};


