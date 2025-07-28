import { Response } from "express";

interface authTokens {
    accessToken?: string,
    refreshToken?: string
}

export const setAuthCookie = async (res: Response,tokenInfo: authTokens) =>{

    if(tokenInfo.accessToken){
    res.cookie("accessToken", tokenInfo.accessToken, {
        httpOnly: true,
        secure: false
    })
    }
    if(tokenInfo.refreshToken){
    res.cookie("refreshToken", tokenInfo.refreshToken, {
        httpOnly: true,
        secure: false
    })
    }
}