import { readUsersDB } from "../../../backendLibs/dbLib";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default function login(req, res) {
	if (req.method === "POST") {
		const { username, password } = req.body;

		//validate body
		if (
			typeof username !== "string" ||
			username === "" ||
			typeof password !== "string" ||
			password === ""
		) {
			res
				.status(400)
				.json({ ok: false, message: "Username or password cannot be empty" });
			return;
		}

		const users = readUsersDB();

		//find users with username, password
		const findUser = users.find(
			(user) =>
				user.username === username &&
				bcrypt.compareSync(password, user.password)
		);
		if (!findUser) {
			res
				.status(400)
				.json({ ok: false, message: "Invalid Username or Password" });
		}

		const secret = process.env.JWT_SECRET;
		const token = jwt.sign(
			{ username: findUser.username, isAdmin: findUser.isAdmin },
			secret,
			{ expiresIn: "1d" }
		);

		return res.status(200).json({
			ok: true,
			username: findUser.username,
			isAdmin: findUser.isAdmin,
			token: token,
		});
		//sign token

		//return response
	}
}
