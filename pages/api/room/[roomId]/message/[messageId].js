import { checkToken } from "../../../../../backendLibs/checkToken";
import {
	readChatRoomsDB,
	writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
	//get ids from url
	if (req.method === "DELETE") {
		const roomId = req.query.roomId;
		const messageId = req.query.messageId;
		//check token
		const user = checkToken(req);
		if (!user)
			return res.status(401).json({
				ok: false,
				message: "Yon don't permission to access this api",
			});

		const rooms = readChatRoomsDB();

		//check if roomId exist
		const findRoom = rooms.find((room) => room.roomId === roomId);
		if (!findRoom) {
			return res.status(404).json({
				ok: false,
				message: "Invalid room id",
			});
		}
		//check if messageId exist
		const findMessage = findRoom.messages.find(
			(message) => message.messageId === messageId
		);
		if (!findMessage) {
			return res.status(404).json({
				ok: false,
				message: "Invalid message id",
			});
		}
		//check if token owner is admin, they can delete any message
		if (user.isAdmin) {
			//delete message
			findRoom.messages = findRoom.messages.filter((m) => {
				return m.messageId !== messageId;
			});
			rooms.messages = findRoom.messages;
			writeChatRoomsDB(rooms);
			return res.status(200).json({
				ok: true,
			});
		}
		//or if token owner is normal user, they can only delete their own message!
		if (!user.isAdmin) {
			console.log(user);
			console.log(findMessage);

			if (user.username === findMessage.username) {
				//delete message
				findRoom.messages = findRoom.messages.filter((m) => {
					return m.messageId !== messageId;
				});
				rooms.messages = findRoom.messages;
				writeChatRoomsDB(rooms);
				return res.status(200).json({
					ok: true,
				});
			}
			return res.status(401).json({
				ok: false,
				message: "Yon don't permission to access this data",
			});
		}
	}
}
