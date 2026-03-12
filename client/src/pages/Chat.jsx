import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import api, { SOCKET_URL } from '../api';
import { Send, ArrowLeft, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const socket = io.connect(SOCKET_URL); 

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Data from previous page
  const { doctorName, doctorId, userId, userName } = location.state || {};
  
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const scrollRef = useRef(null); // Auto-scroll ke liye

  // Unique Room ID
  const room = userId && doctorId ? [userId, doctorId].sort().join("_") : null;

  useEffect(() => {
    if (!userId || !doctorId) {
        navigate('/dashboard'); 
        return;
    }

    // 1. Join Room
    socket.emit("join_room", room);

    // 2. FETCH OLD MESSAGES (History) 📜
    const fetchHistory = async () => {
        try {
            const res = await api.get(`/messages/${userId}/${doctorId}`);
            // Format messages for UI
            const formattedMessages = res.data.map(msg => ({
                room: room,
                senderId: msg.senderId,
                text: msg.text,
                time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }));
            setMessageList(formattedMessages);
        } catch (err) {
            console.error("Failed to load chat history", err);
        }
    };
    fetchHistory();

    // 3. Listen for New Messages
    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [room, userId, doctorId, navigate]);

  // Auto-scroll to bottom when message arrives
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        senderId: userId,
        receiverId: doctorId,
        text: currentMessage,
        author: userName,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const deleteChat = async () => {
    if (window.confirm("Are you sure you want to delete this chat history? This cannot be undone.")) {
      try {
        await api.delete(`/messages/${userId}/${doctorId}`);
        setMessageList([]);
        toast.success("Chat history cleared!");
      } catch (err) {
        toast.error("Failed to delete chat.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white p-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-[80vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-cyan-900/30 p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)}><ArrowLeft size={20}/></button>
                <div>
                    <h3 className="font-bold text-lg">{doctorName || "Chat"}</h3> 
                    <p className="text-xs text-green-400">Online</p>
                </div>
            </div>
            <button onClick={deleteChat} className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition">
                <Trash2 size={20} />
            </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messageList.map((msg, index) => (
                <div key={index} className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.senderId === userId ? "bg-cyan-600 rounded-br-none" : "bg-gray-700 rounded-bl-none"}`}>
                        <p>{msg.text}</p>
                        <span className="text-[10px] opacity-70 block text-right mt-1">{msg.time}</span>
                    </div>
                </div>
            ))}
            <div ref={scrollRef} /> {/* Scroll Target */}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/20 border-t border-white/10 flex gap-2">
            <input 
                type="text" 
                value={currentMessage}
                onChange={(event) => setCurrentMessage(event.target.value)}
                onKeyPress={(event) => event.key === "Enter" && sendMessage()}
                placeholder="Type a message..." 
                className="flex-1 bg-white/10 border border-white/10 rounded-full px-4 py-2 outline-none focus:border-cyan-500 transition"
            />
            <button onClick={sendMessage} className="p-2 bg-cyan-600 rounded-full hover:bg-cyan-500 transition">
                <Send size={20} />
            </button>
        </div>

      </div>
    </div>
  );
};

export default Chat;