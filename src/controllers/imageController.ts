import {Response, Request} from 'express'
import {collections} from "../server";
import {MongoDB_Collections} from "../config";
import Image from "../models/image";
import {ObjectID} from "mongodb";
import {catchAsync} from "../utils/catchAsync";
import httpStatus = require("http-status");
import ApiError from "../utils/ApiError";

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


export const getCombinations = catchAsync(async (req: Request, res: Response) => {
    const {length} = req.query;
    let memoryArray: Image[][] = [];
    let allImages = await collections[images].find({}).toArray() as unknown as Image[];

    if (Number(length) <= allImages.length) {
        memoryArray = getAllCombosOfArray(allImages, Number(length));
        res.status(httpStatus.OK).send(memoryArray)
    } else throw new ApiError(httpStatus.BAD_REQUEST, "Sorry amount of all images is less then the length of array you wanted")
});

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

export const getAllImages = catchAsync(async (req: Request, res: Response) => {
    let {viaCreatedDate, viaUpdatedDate, asc} = req.query;

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
    if (sorted) {
        res.status(200).send(sorted)
    } else {
        throw  new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Sorry , server mistake")
    }

});

export const getImageViaID = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const query = {
        _id: new ObjectID(id)
    };
    const result = (await collections[images].findOne(query)) as unknown as Image;
    if (result) {
        res.status(201).send(result)
    } else {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Sorry , server mistake")
    }

});


export const postImage = catchAsync(async (req: Request, res: Response) => {
    const image = req.body;

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
        .catch(e => {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Sorry server mistake")
        })

});


export const updateImage = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const updatedParty: any = {
        name: req.body.name,
        repository: req.body.repository,
        version: req.body.version,
        metadata: req.body.metadata
    };
    const query = {_id: new ObjectID(id)};
    let shouldUpdate: boolean = false;
    let previousData = await collections[images].findOne(query);
    console.log(previousData);
    Object.keys(updatedParty).map(key => {
        if (typeof updatedParty[`${key}`] !== "object" && typeof previousData[`${key}`] !== "object") {
            if (previousData[`${key}`] !== updatedParty[`${key}`]) {
                console.error(updatedParty[`${key}`], previousData[`${key}`]);
                shouldUpdate = true;
                return
            }
        } else {
            shouldUpdate = !(JSON.stringify(previousData[`${key}`]) === JSON.stringify(updatedParty[`${key}`]))
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
            .catch(e => {
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e.message)
            })

    } else throw new ApiError(httpStatus.NOT_MODIFIED, "No changes had been made")
});


export const deleteImage = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const query = {_id: new ObjectID(id)};
    const result = await collections[images].findOne(query);

    if (result) {
        await collections[images].deleteOne(query);
        res.status(200).send("Image was successfully deleted")
    } else throw  new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Sorry something went wrong")

});

export const deleteAll = catchAsync(async (req: Request, res: Response) => {
    await collections[images].deleteMany({})
        .then(() => {
            res.status(201).send("Deleted all images")
        })
        .catch(e => {
            throw new ApiError(httpStatus.EXPECTATION_FAILED, e.message)
        })

});


