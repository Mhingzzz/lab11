import { checkToken } from "../../backendLibs/checkToken";
import { readChatRoomsDB } from "../../backendLibs/dbLib";

export default function roomRoute(req, res) {
	const user = checkToken(req);

	if (!user) {
		return res.status(401).json({
			ok: false,
			message: "Yon don't permission to access this api",
		});
	}
	const chatrooms = readChatRoomsDB();
	const room = chatrooms.map((room) => {
		return { roomId: room.roomId, roomName: room.roomName };
	});
	if (req.method === "GET") {
		return res.status(200).json({
			ok: true,
			rooms: room,
		});
	}
	//create room data and return response
}
