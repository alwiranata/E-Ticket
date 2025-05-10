import {Request, Response} from "express"
import * as Yup from "yup"
import userModel from "../models/user.model"
import {encrypt} from "../utils/encryption"
import {generateToken} from "../utils/jwt"
import {IReqUser} from "../middleware/auth.middleware"

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
	password: Yup.string()
		.required()
		.min(6, "Password must be at least 6 characters")
		.test(
			"at-least-one-uppercase-letter",
			"Contains at least one uppercase letter",
			(value) => {
				if (!value) return false
				const regex = /^(?=.*[A-Z])/
				return regex.test(value)
			}
		)
		.test(
			"at-least-one-uppercase-letter",
			"Contains at least one uppercase letter",
			(value) => {
				if (!value) return false
				const regex = /^(?=.*\d)/
				return regex.test(value)
			}
		),
		
	confirmPassword: Yup.string()
		.required()
		.oneOf([Yup.ref("password")], "Password must be matched"),
})

export default {
	//register
	async register(req: Request, res: Response) {
		/**
		  #swagger.tags = ['Auth']
		 */

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

	//login
	async login(req: Request, res: Response) {
		/**
		  #swagger.tags = ['Auth']
		 */
		const {identifier, password} = req.body as unknown as TLogin
		try {
			// ambil data user berdasarkan "identifier" -> email atau username
			const userByIdentifier = await userModel.findOne({
				$or: [
					{
						email: identifier,
					},
					{
						username: identifier,
					},
				],
			})

			if (!userByIdentifier) {
				return res.status(403).json({
					message: "User Not Found",
					data: null,
				})
			}

			// validasi password
			const validatePassword: boolean =
				encrypt(password) === userByIdentifier.password
			if (!validatePassword) {
				return res.status(403).json({
					message: "User Not Found",
					data: null,
				})
			}

			if(!userByIdentifier.isActive){
				return res.status(403).json({
					message : "Akun belum diaktivasi. silahkan cek email anda untuk aktivasi ",
					data : null
				})
			}

			const token = generateToken({
				id: userByIdentifier._id,
				role: userByIdentifier.role,
			})

			res.status(200).json({
				message: "Login Success",
				data: token,
			})
		} catch (error) {
			const err = error as unknown as Error
			res.status(400).json({
				message: err.message,
				data: null,
			})
		}
	},

	//me
	async me(req: Request, res: Response) {
		/**
		  #swagger.tags = ['Auth']
		  #swagger.security = [{
		   "bearerAuth":[]
		  }]
		 */
		try {
			const user = (req as IReqUser).user
			const result = await userModel.findById(user?.id)
			res.status(200).json({
				message: "Success get user profile",
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

	async  activation(req : Request , res : Response){
		/**
		  #swagger.tags  = ['Auth']
		  #swagger.requestBody = {
		  required : true,
		  schema : {$ref : '#/components/schemas/ActivationRequest'}
		  }
		 */
		try {
			const { code }  = req.body as {code : string}

			const user = await userModel.findOneAndUpdate(
				{
					activationCode : code
				},
				{
					isActive : true
				},
				{
					new : true
				}
			)
			res.status(200).json({
				message : "User successfully activated",
				data : user
			})
		} catch (error) {
			const err = error as unknown as Error
			res.status(400).json({
				message : err.message,
				data : null
			})

		}
	}
}
