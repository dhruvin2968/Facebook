import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { getAuth } from "firebase/auth";

const socket = io("https://facebook-backend-f4m6.onrender.com"); // your socket server

export const ChatDashboard=()=> {
  const auth = getAuth();
  const user = auth.currentUser;

  const [activeUsers, setActiveUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  // Join socket on login
  useEffect(() => {
    if (user) {
      socket.emit("new user", {
        uid: user.uid,
        name: user.displayName || "Anonymous",
      });
    }

    socket.on("usersList", (users) => setActiveUsers(users));

    socket.on("receiveMessage", ({ roomId, from, text }) => {
      if (roomId === getRoomId(user.uid, selectedUser?.uid)) {
        setMessages((prev) => [...prev, { from, text }]);
      }
    });

    return () => {
      socket.off("usersList");
      socket.off("receiveMessage");
    };
  }, [user, selectedUser]);

  // Generate consistent roomId
  const getRoomId = (uid1, uid2) => [uid1, uid2].sort().join("_");

  const sendMessage = () => {
    if (!newMsg.trim() || !selectedUser) return;
    const roomId = getRoomId(user.uid, selectedUser.uid);
    socket.emit("privateMessage", {
      roomId,
      from: user.displayName || "Me",
      to: selectedUser.uid,
      text: newMsg,
    });
    setMessages((prev) => [...prev, { from: "Me", text: newMsg }]);
    setNewMsg("");
  };

  return (
    <div className="grid grid-cols-4 h-[80vh] gap-4">
      {/* Sidebar */}
      <div className="col-span-1 bg-gray-100 rounded-2xl p-4 shadow">
        <h2 className="text-lg font-semibold mb-4">Active Users</h2>
        <ul className="space-y-2">
          {Object.entries(activeUsers).map(([uid, u]) => (
            uid !== user.uid && (
              <li
                key={uid}
                onClick={() => setSelectedUser({ uid, ...u })}
                className={`cursor-pointer p-2 rounded-lg ${
                  selectedUser?.uid === uid
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-blue-100"
                }`}
              >
                {u.name}
              </li>
            )
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="col-span-3 flex flex-col bg-white rounded-2xl shadow">
        {selectedUser ? (
          <>
            <div className="p-4 border-b font-semibold text-lg bg-blue-50 rounded-t-2xl">
              Chat with {selectedUser.name}
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.from === "Me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl max-w-[70%] ${
                      msg.from === "Me"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex gap-2">
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
