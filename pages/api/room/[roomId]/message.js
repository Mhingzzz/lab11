import {
	readChatRoomsDB,
	writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
	if (req.method === "GET") {
		//check token
		const user = checkToken(req);

		if (!user) {
			return res.status(401).json({
				ok: false,
				message: "Yon don't permission to access this api",
			});
		}
		//get roomId from url
		const roomId = req.query.roomId;

		const rooms = readChatRoomsDB();

		//check if roomId exist
		const findRoom = rooms.find((room) => room.roomId === roomId);
		if (!findRoom) {
			return res.status(404).json({
				ok: false,
				message: "Invalid room id",
			});
		}

		return res.status(200).json({
			ok: true,
			messages: findRoom.messages,
		});
		//find room and return
		//...
	} else if (req.method === "POST") {
		//check token
		const user = checkToken(req);
		//get roomId from url
		const roomId = req.query.roomId;
		const rooms = readChatRoomsDB();

		//check if roomId exist
		const findRoom = rooms.find((room) => room.roomId === roomId);
		if (!findRoom) {
			return res.status(404).json({
				ok: false,
				message: "Invalid room id",
			});
		}
		//validate body
		if (typeof req.body.text !== "string" || req.body.text.length === 0)
			return res.status(400).json({ ok: false, message: "Invalid text input" });

		//create message
		const newMessage = {
			messageId: uuidv4(),
			text: req.body.text,
			userId: user.userId,
			username: user.username,
		};

		findRoom.messages.push(newMessage);
		writeChatRoomsDB(rooms);

		return res.status(200).json({
			ok: true,
			message: newMessage,
		});
	}
}
