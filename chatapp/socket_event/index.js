import { mockChat } from "../data/mockChat";

// チャットの内容を辞書形式で保存
const chatDict = mockChat;

const getKey = (data) => `${data.studentName}-${data.subject}`;

const getNowTime = () =>{
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const time = `${hours} : ${formattedMinutes}`;

  return time;
}

const addChat = (io, key, name, content) => {
  if (!chatDict[key]) chatDict[key] = [];
  chatDict[key].push({
    name,
    content,
    time: getNowTime(),
  });
  io.to(key).emit("updateChatEvent", chatDict[key]);
};

export default (io, socket) => {
  socket.on("enterRoomEvent", (data) => {
    const key = getKey(data);
    socket.join(key);
    socket.emit("updateChatEvent", chatDict[key] ?? []);
  });

  socket.on("exitRoomEvent", (data) => {
    const key = getKey(data);
    socket.leave(key);
  });

  socket.on("sendChatEvent", (data) => {
    const key = getKey(data);
    addChat(io, key, data.userName, data.content);
  });
};
