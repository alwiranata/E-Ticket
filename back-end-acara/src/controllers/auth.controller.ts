import {Request, Response} from "express"

type TRegister = {

	fullName: String
	username: String
	email: String
	password: String
	confirmPassword: String

}

export default {
	register(req: Request, res: Response) {

		const {
            fullName,
            username, 
            email,
            password,
            confirmPassword
        } = req.body as unknown as TRegister

        res.status(200).json({
            msg : "Data Created"
        })
	},
}
