import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import {Navbar} from "../components/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc
} from "firebase/firestore";
import { Headerr } from "./Header";

let socket = null;

export const ChatDashboard = () => {
  const auth = getAuth();
  const db = getFirestore();
  const [user, setUser] = useState(null);
  const [activeUsers, setActiveUsers] = useState({});
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState({});//eslint-disable-line
  const [newMsg, setNewMsg] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [messageListeners, setMessageListeners] = useState({});

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser?.uid || "No user");
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  // Load chat rooms from Firestore when user is authenticated
  useEffect(() => {
    if (!user) return;

    console.log("Loading chat rooms for user:", user.uid);
    
    const chatsRef = collection(db, "chats");
    const chatsQuery = query(chatsRef);
    
    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const userChatRooms = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        if (data.participants && data.participants.includes(user.uid)) {
          const otherParticipantUid = data.participants.find(uid => uid !== user.uid);
          const otherParticipantName = data.participantNames?.[otherParticipantUid] || "Unknown User";
          
          userChatRooms.push({
            roomId: doc.id,
            otherParticipantUid,
            otherParticipantName,
            lastMessage: data.lastMessage,
            updatedAt: data.updatedAt?.toDate() || new Date()
          });
        }
      });
      
      userChatRooms.sort((a, b) => b.updatedAt - a.updatedAt);
      
      console.log(`Loaded ${userChatRooms.length} chat rooms:`, userChatRooms);
      setChatRooms(userChatRooms);
    }, (error) => {
      console.error("Error loading chat rooms:", error);
    });

    return () => unsubscribe();
  }, [user, db]);

  // Initialize socket connection when user is authenticated
  useEffect(() => {
    if (!user) {
      console.log("No user, not connecting socket");
      return;
    }

    console.log("Initializing socket for user:", user.uid);

    socket = io("https://planorama-user-chat.onrender.com", {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
      
      socket.emit("new user", {
        uid: user.uid,
        name: user.displayName || user.email || "Anonymous",
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socket.on("usersList", (users) => {
      console.log("Received users list:", users);
      setActiveUsers(users);
    });

    socket.on("receiveMessage", ({ roomId, from, fromUid, text }) => {
      console.log("Received message via socket:", { roomId, from, fromUid, text, currentUser: user.uid });
      
      const roomParts = roomId.split("_");
      const isMyRoom = roomParts.includes(user.uid);
      
      if (isMyRoom) {
        console.log("Message is for current user's room - will be saved to Firestore by sender");
      } else {
        console.log("Message not for current user's room");
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      console.log("Cleaning up socket connection");
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      setIsConnected(false);
      setActiveUsers({});
      
      Object.values(messageListeners).forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
      setMessageListeners({});
    };//eslint-disable-next-line
  }, [user]);

  // Load messages for selected user from Firestore
  useEffect(() => {
    if (selectedUser && user) {
      const roomId = getRoomId(user.uid, selectedUser.uid);
      console.log("Setting up Firestore listener for room:", roomId);
      
      if (messageListeners[roomId]) {
        messageListeners[roomId]();
      }

      const messagesRef = collection(db, "chats", roomId, "messages");
      const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
      
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const roomMessages = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          roomMessages.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate() || new Date(),
            from: data.fromUid === user.uid ? "Me" : data.from
          });
        });
        
        console.log(`Loaded ${roomMessages.length} messages for room ${roomId}`, roomMessages);
        setMessages(roomMessages);
        
        setAllMessages(prev => ({
          ...prev,
          [roomId]: roomMessages
        }));
      }, (error) => {
        console.error("Error listening to messages:", error);
      });

      setMessageListeners(prev => ({
        ...prev,
        [roomId]: unsubscribe
      }));

    } else {
      setMessages([]);
    }//eslint-disable-next-line
  }, [selectedUser, user, db]);

  const startNewChat = (userToChat) => {
    console.log("Starting new chat with:", userToChat);
    setSelectedUser({
      uid: userToChat.uid || userToChat.otherParticipantUid,
      name: userToChat.name || userToChat.otherParticipantName
    });
  };

  const getRoomId = (uid1, uid2) => [uid1, uid2].sort().join("_");

  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedUser || !socket || !isConnected) {
      console.log("Cannot send message:", { newMsg: newMsg.trim(), selectedUser, socket: !!socket, isConnected });
      return;
    }

    const roomId = getRoomId(user.uid, selectedUser.uid);
    const messageData = {
      text: newMsg,
      from: user.displayName || user.email || "Me",
      fromUid: user.uid,
      timestamp: serverTimestamp(),
      read: false
    };

    try {
      console.log("Saving message to Firestore:", messageData);
      const messagesRef = collection(db, "chats", roomId, "messages");
      await addDoc(messagesRef, messageData);
      
      const chatRoomRef = doc(db, "chats", roomId);
      await setDoc(chatRoomRef, {
        participants: [user.uid, selectedUser.uid],
        participantNames: {
          [user.uid]: user.displayName || user.email || "Anonymous",
          [selectedUser.uid]: selectedUser.name
        },
        lastMessage: {
          text: newMsg,
          from: user.displayName || user.email || "Me",
          timestamp: serverTimestamp()
        },
        updatedAt: serverTimestamp()
      }, { merge: true });

      socket.emit("privateMessage", {
        roomId,
        from: user.displayName || user.email || "Me",
        fromUid: user.uid,
        to: selectedUser.uid,
        text: newMsg,
      });

      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
    }
    
    setNewMsg("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (!user) {
    return (
      <>
      
        <Headerr/>
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2A1.3 1.3 0 0 0 3.8 21.454l3.032-.892A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Messenger</h2>
            <p className="text-gray-600">Please log in to start chatting with friends</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
     
      <Navbar/>
      <div className="flex h-screen bg-white">
        {/* Facebook Messenger Style Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search Messenger" 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {/* Recent Chats */}
            {chatRooms.length > 0 && (
              <div className="py-2">
                {chatRooms.map((room) => {
                  const isOnline = activeUsers[room.otherParticipantUid];
                  const isSelected = selectedUser?.uid === room.otherParticipantUid;
                  
                  return (
                    <div
                      key={room.roomId}
                      onClick={() => startNewChat(room)}
                      className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {room.otherParticipantName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {room.otherParticipantName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {room.updatedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                        {room.lastMessage && (
                          <p className="text-sm text-gray-600 truncate">
                            {room.lastMessage.from === (user.displayName || user.email) ? "You: " : ""}
                            {room.lastMessage.text}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Active Users for New Chats */}
            {Object.entries(activeUsers).length > 0 && (
              <div className="py-2 border-t border-gray-200">
                <div className="px-4 py-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active Now</h3>
                </div>
                {Object.entries(activeUsers).map(([uid, u]) => {
                  const alreadyHaveChat = chatRooms.some(room => room.otherParticipantUid === uid);
                  
                  return uid !== user.uid && !alreadyHaveChat && (
                    <div
                      key={uid}
                      onClick={() => startNewChat({ uid, name: u.name })}
                      className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedUser?.uid === uid ? "bg-blue-50 border-r-2 border-blue-500" : ""
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {u.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                        <p className="text-sm text-green-600">Active now</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {chatRooms.length === 0 && Object.entries(activeUsers).length <= 1 && (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2A1.3 1.3 0 0 0 3.8 21.454l3.032-.892A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-gray-600 text-sm">Your conversations will appear here when you start chatting.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h2>
                    <p className="text-sm text-gray-500">
                      {activeUsers[selectedUser.uid] ? "Active now" : ""}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 2v-7l-4 2z"/>
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-2xl">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedUser.name}</h3>
                    <p className="text-gray-600 mb-4">You're now connected on Messenger.</p>
                    <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.from === "Me" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.from === "Me" ? "flex-row-reverse space-x-reverse" : ""}`}>
                          {msg.from !== "Me" && (
                            <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-semibold">
                                {selectedUser.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              msg.from === "Me"
                                ? "bg-blue-500 text-white rounded-br-md"
                                : "bg-gray-200 text-gray-900 rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm break-words">{msg.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="px-6 py-4 border-t border-gray-200 bg-white">
                <div className="flex items-end space-x-3">
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"/>
                    </svg>
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Aa"
                      className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none text-sm"
                      disabled={!isConnected}
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-500 hover:bg-blue-50 rounded-full">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1V3H9V1L3 7V9H21Z"/>
                      </svg>
                    </button>
                  </div>

                  <button 
                    onClick={sendMessage}
                    disabled={!isConnected || !newMsg.trim()}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full disabled:text-gray-400 disabled:hover:bg-transparent"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-white">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2A1.3 1.3 0 0 0 3.8 21.454l3.032-.892A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Messages</h2>
              <p className="text-gray-600 text-center max-w-md">
                Send private messages to a friend or group. Click on a person from the sidebar to start chatting.  
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
