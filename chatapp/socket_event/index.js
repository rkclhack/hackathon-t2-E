// チャットの内容を辞書形式で保存
const chatDict = Object.create(null)

export default (io, socket) => {

  // 入室メッセージをクライアントに送信する
  socket.on("enterEvent", (data) => {
    socket.broadcast.emit("enterEvent", data)
  })

  // 退室メッセージをクライアントに送信する
  socket.on("exitEvent", (data) => {
    socket.broadcast.emit("exitEvent", data)
  })

  // 投稿メッセージを保存する
  socket.on("publishEvent_save", (data) => {
    const {name, stuName, subject, content} = data ?? {};
    const key = `${stuName}-${subject}`;

    if (!chatDict[key]) {
      chatDict[key] = []
    }
    chatDict[key].push({
      name:     name,
      content:  content,
      time:     Date.now(),
    });
  })
  
  // 投稿メッセージを送信する
  socket.on("publishEvent_send", (data) => {
    const key = `${data.stuName}-${data.subject}`;
    if (!chatDict[key]) {
      return
    }
    io.sockets.emit("publishEvent_send", chatDict[key])
  })
}