import {Request, Response} from "express"
import * as Yup from "yup"
import userModel from "../models/user.model"
import { encrypt } from "../utils/encryption"

type TRegister = {
	fullName: string
	username: string
	email: string
	password: string
	confirmPassword: string
}

type TLogin = {
	identifier: string
	password: string
}

const registerValidationSchema = Yup.object({
	fullName: Yup.string().required(),
	username: Yup.string().required(),
	email: Yup.string().email().required(),
	password: Yup.string().required(),
	confirmPassword: Yup.string()
		.required()
		.oneOf([Yup.ref("password")], "Password must be matched"),
})

export default {
	async register(req: Request, res: Response) {
		const {fullName, username, email, password, confirmPassword} =
			req.body as unknown as TRegister

		try {
			await registerValidationSchema.validate({
				fullName,
				username,
				email,
				password,
				confirmPassword,
			})

			const result = await userModel.create({
				fullName,
				username,
				email,
				password,
			})

			res.status(200).json({
				message: "Success Registrasion!",
				data: result,
			})
		} catch (error) {
			const err = error as unknown as Error
			res.status(400).json({
				message: err.message,
				data: null,
			})
		}
	},
	async login(req: Request, res: Response) {
		const {identifier, password} = req.body as unknown as TLogin

		try {
			// ambil data user berdasarkan "identifier" -> email atau username
			const  userByIdentifier = await userModel.findOne({
				$or :[
					{
						email : identifier
					},
					{
						username : identifier
					}
				]
			})

			if(!userByIdentifier){
				return res.status(403).json({
					message : "User Not Found",
					data : null
				})
			}

			// validasi password
			const validatePassword : boolean  =  encrypt(password) === userByIdentifier.password
			if(!validatePassword){
				return res.status(403).json({
					message : "User Not Found",
					data : null
				})
			}

			res.status(200).json({
				message : "Login Success",
				data : userByIdentifier
			})

		} catch (error) {
			const err = error as unknown as Error
			res.status(400).json({
				message : err.message,
				data: null,
			})
		}
	},
}
