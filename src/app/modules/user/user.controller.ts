import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";



// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = await UserServices.createUser(req.body);

//         res.status(httpStatus.CREATED).json({
//             message: `User Created Successfully`,
//             user
//         })
//     } catch (error: any) {
//         next(error)
//     }
// }
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res,{
        statusCode: httpStatus.CREATED,
        message: `User Created Successfully`,
        success: true,
        data: user
    })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken =  req.user;
    const payload = req.body

    const user = await UserServices.updateUser(userId,payload,verifiedToken);

    sendResponse(res,{
        statusCode: httpStatus.CREATED,
        message: `User updated Successfully`,
        success: true,
        data: user
    })
})


const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await UserServices.getAllUsers();

    sendResponse(res,{
        statusCode: httpStatus.OK,
        message: `All User Retrived Successfully`,
        success: true,
        data: result.data,
        meta: result.meta
    })
})

export const UserControllers = {
    createUser,
    updateUser,
    getAllUsers
}