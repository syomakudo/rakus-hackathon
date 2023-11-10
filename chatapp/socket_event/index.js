import { v4 as uuidv4 } from "uuid"; // uuidモジュールをインポート

export default (io, socket) => {
  // 入室メッセージをクライアントに送信する
  socket.on("enterEvent", (data) => {
    const messageId = uuidv4();
    const dataWithId = { ...data, id: messageId };
    socket.broadcast.emit("enterEvent", dataWithId);
  });

  // 退室メッセージをクライアントに送信する
  socket.on("exitEvent", (data) => {
    const messageId = uuidv4();
    const dataWithId = { ...data, id: messageId };
    socket.broadcast.emit("exitEvent", dataWithId);
  });

  // 投稿メッセージを送信する
  socket.on("publishEvent", (data) => {
    const messageId = uuidv4();
    const dataWithId = { ...data, id: messageId };
    io.sockets.emit("publishEvent", dataWithId);
  });

  // メッセージ取り消しリクエストを処理する
  socket.on("cancelMessageEvent", (messageId) => {
    // 取り消しを全クライアントにブロードキャストする
    io.sockets.emit("cancelMessageEvent", messageId);
  });
};
