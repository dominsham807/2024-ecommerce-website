import { NextFunction, Request, Response } from "express"
import { User } from "../models/user.js"
import { NewUserRequestBody } from "../types/types.js"
import { TryCatch } from "../middlewares/error.js"
import ErrorHandler from "../utils/utility-class.js"

export const newUser = TryCatch(async(
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
) => {
    const { _id, name, email, photo, gender, dob } = req.body

    let user = await User.findById(_id)
    if(user){
        return res.status(200).json({
            success: true,
            message: `Login success! Welcome ${user.name}!`,
            user
        })
    }

    if (!_id || !name || !email || !gender || !dob)
        return next(new ErrorHandler("Please add all fields", 400));

    // let existingUser = await User.findById(_id)
    // if(existingUser){
    //     return next(new ErrorHandler("User already exists", 500));
    // }

    user = await User.create({
        name, email, photo, gender, _id, 
        dob: new Date(dob) 
    })

    res.status(200).json({
        success: true,
        message: `Register success`,
        user
    })
})

export const loginUser = TryCatch(async(
    req,
    res,
    next
) => {
    const { _id } = req.body

    let user = await User.findById(_id)
    if(user){
        return res.status(200).json({
            success: true,
            message: `Welcome! ${user.name}`,
        });
    } else{
        return next(new ErrorHandler("Invalid credentials", 500));
    }
})

export const getAllUsers = TryCatch(async(req, res, next) => {
    const users = await User.find({})

    return res.status(200).json({
        success: true,
        users
    })
})

export const getUser = TryCatch(async(req, res, next) => {
    const id = req.params.id
    const user = await User.findById(id)

    if(!user) return next(new ErrorHandler("Invalid ID", 400))

    return res.status(200).json({
        success: true,
        user
    })
})

export const deleteUser = TryCatch(async(req, res, next) => {
    const id = req.params.id
    const user = await User.findById(id)

    if(!user) return next(new ErrorHandler("Invalid ID", 400))

    await user.deleteOne()

    return res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})