import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import { NextFunction, Request, Response } from "express";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "./setCookie";
import { createUserToken } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";




const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // const loginInfo = await AuthServices.credentialsLogin(req.body)

    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) {
            // ** we can not use it;
            // throw new AppError(401,"error is occured")
            // next(err)
            // return new AppError(401, err)

            // ** we can use it
            return next(new AppError(401, err))
            // return next(err)
        }
        if (!user) {
            return next(new AppError(401, info.message))
        }

        const userTokens = await createUserToken(user);

        // delete user.toObject().password

        const { password: pass, ...rest } = user.toObject()

        // set cookie in browser function;
        setAuthCookie(res, userTokens);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            message: `User loged in Successfully`,
            success: true,
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        })
    })(req, res, next)

    // if(tokenInfo.accessToken){
    // res.cookie("accessToken", tokenInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })
    // }
    // if(tokenInfo.refreshToken){
    // res.cookie("refreshToken", tokenInfo.refreshToken, {
    //     httpOnly: true,
    //     secure: false
    // })
    // }

})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Refresh Token received from cookies")
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

    // set cookie in browser function;
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: `New access token retrived Successfully`,
        success: true,
        data: tokenInfo,
    })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: `User logout`,
        success: true,
        data: null,
    })
})

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

    const newPass = await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)


    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: `Password change successfully`,
        success: true,
        data: null,
    })
})

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : ""
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }
    const user = req.user;
    console.log(user)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }

    const tokenInfo = createUserToken(user)

    setAuthCookie(res, tokenInfo)

    // sendResponse(res, {
    //     statusCode: httpStatus.OK,
    //     message: `Password change successfully`,
    //     success: true,
    //     data: null,
    // })
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})

export const AuthControllers = {
    credentialsLogin,
    googleCallbackController,
    getNewAccessToken,
    resetPassword,
    logout
}