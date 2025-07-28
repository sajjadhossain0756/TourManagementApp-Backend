import z from "zod";
import { IsActive, Role } from "./user.interface";

// create user zod schema;
export const createUserZodSchema = z.object({
    name: z
        .string({
            message: "Name Must be a String and required"
        })
        .min(2, { message: "Name too short. Minimum  character should be 2." })
        .max(50, { message: "Name too long. Maximum character can be 50." }),
    email: z
        .string({
            message: "Email Must be a String and required"
        })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long" })
        .max(100, { message: "Email cannot exceed 100 characters" }),
    password: z
        .string({
            message: "Password Must be a String and required"
        })
        .min(8, { message: "Password must be at least 8 character long" })
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase character.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }),
    phone: z
        .string({ message: "Phone Number Must be String" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for bangladesh.Format +8801(012345678),"
        }).optional(),
    address: z
        .string({ message: "address Must be String" })
        .max(200, { message: "address can not exceed 200 characters." })
        .optional()
})

// update user zod schema;
export const updateUserZodSchema = z.object({
    name: z
        .string({
            message: "Name Must be a String",
        })
        .min(2, { message: "Name too short. Minimum  character should be 2." })
        .max(50, { message: "Name too long. Maximum character can be 50." }).optional(),
    password: z
        .string({
            message: "Password Must be a String"
        })
        .min(8, { message: "Password must be at least 8 character long" })
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase character.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }).optional(),
    phone: z
        .string({ message: "Phone Number Must be String" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for bangladesh.Format +8801(012345678),"
        }).optional(),
    role:z
        .enum(Object.values(Role) as [string])
        .optional(),    
    isActive: z
        .enum(Object.values(IsActive) as [string])
        .optional(),
    isDeleted: z
        .boolean({ message: "isDeleted Must be boolean" })
        .optional(),
    isVerified: z
        .boolean({ message: "isVerified Must be boolean" })
        .optional(),
    address: z
        .string({ message: "address Must be String" })
        .max(200, { message: "address can not exceed 200 characters." })
        .optional(),                
})