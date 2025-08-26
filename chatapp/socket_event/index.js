// チャットの内容を辞書形式で保存
const chatDict = require("./DemoData_chat.json");

const getKey = (data) => `${data.studentName}-${data.subject}`;

const addChat = (io, key, name, content) => {
  if (!chatDict[key]) chatDict[key] = [];
  chatDict[key].push({
    name,
    content,
    time: Date.now(),
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
