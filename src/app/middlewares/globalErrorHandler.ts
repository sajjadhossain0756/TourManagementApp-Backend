import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import mongoose from "mongoose";

const handleDuplicateError = (err: any) => {
    const matchArray = err.message.match(/"([^"]*)"/);

    return {
        statusCode: 400,
        message: `${matchArray[1]} is alredy exist`
    }
}
const handleCastError = (err: mongoose.Error.CastError) => {

    return {
        statusCode: 400,
        message: "Invalid mongodb ObjectId.Please provide a valid id"
    }
}
const handleValidationError = (err: mongoose.Error.ValidationError) => {

    const errorSources: any = [];
    const errors = Object.values(err.errors)

    return {
        statusCode: 400,
        message: "Invalid mongodb ObjectId.Please provide a valid id"
    }
}

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500;
    let message = "Something went wrong!!";
    const errorSources: any = [
        // {
        //     path:"isDeleted",
        //     message:"error is occured"
        // }
    ];

    // mongoose error handle manually;
    // 1.duplicate error
    // 2.CastError
    // 3.validation error

    // 1.duplicate error
    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // 2.CastError 
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    } 
    // 3.validation error
    else if (err.name === "ValidationError") {
        statusCode = 400;
        const errors = Object.values(err.errors)

        errors.forEach((errorObject: any) => errorSources.push({
            path: errorObject.path,
            message: errorObject.message
        }));
        message = "validation Error occured"

    }
    else if (err.name === "ZodError") {
        statusCode = 400,
            message = "Zod error occured"
        err.issues.forEach((issue: any) => {
            errorSources.push({
                path: issue.path[issue.path.length - 1],
                message: issue.message
            })
        })
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })
    next();
}