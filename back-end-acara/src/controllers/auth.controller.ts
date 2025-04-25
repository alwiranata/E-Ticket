import {Request, Response} from "express"
import * as Yup from "yup"
import userModel from "../models/user.model"


type TRegister = {
	fullName: String
	username: String
	email: String
	password: String
	confirmPassword: String
}

const registerValidationSchema = Yup.object({
	fullName: Yup.string().required(),
	username: Yup.string().required(),
	email: Yup.string().email().required(),
	password: Yup.string().required(),
	confirmPassword: Yup.string().required().oneOf([Yup.ref("password")], "Password must be matched"),
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
				password
			})

			res.status(200).json({
				message: "Success Registrasion!",
				data: result
			})

		} catch (error) {
			const err = error as unknown as Error
			res.status(400).json({
				message: err.message,
				data: null,
			})
		}
	},
}
