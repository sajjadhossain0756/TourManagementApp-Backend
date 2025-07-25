import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import { NextFunction, Request, Response } from "express";



const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthServices.credentialsLogin(req.body)

    sendResponse(res,{
        statusCode: httpStatus.OK,
        message: `User loged in Successfully`,
        success: true,
        data: loginInfo,
    })
})

export const AuthControllers = {
    credentialsLogin
}