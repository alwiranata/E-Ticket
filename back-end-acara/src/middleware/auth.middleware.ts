import {Request, Response, NextFunction} from "express"
import {getUserdata} from "../utils/jwt"
import {IUserToken} from "../utils/jwt"

export interface IReqUser extends Request {
	user: IUserToken
}

export default(req: Request, res: Response, next: NextFunction) => {
	const authorization = req.headers?.authorization

	if (!authorization) {
		return res.status(403).json({
			message: "Unautorized",
			data: null,
		})
	}

	const [prefix, token] = authorization.split(" ")

	if (!(prefix === "Bearer" && token)) {
		return res.status(403).json({
			message: "Unautorized",
			data: null,
		})
	}

	const user = getUserdata(token)

	if (!user) {
		return res.status(403).json({
			message: "Unautorirized",
			data: "null",
		})
	}

    (req as IReqUser).user = user

    next()
}
