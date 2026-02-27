import { useState, useEffect, useRef } from "react";
import { socket } from "../socket";
import axios from "../config/api";
import { FaPaperPlane, FaTimes, FaCheck, FaCheckDouble, FaTrashAlt, FaSmile, FaEdit } from "react-icons/fa";

export default function Chat({ requestId, requestModel, senderId, receiverId, onClose, receiverName }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const messagesEndRef = useRef(null);

    const emojis = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

    const sId = String(senderId);
    const rId = String(receiverId);

    useEffect(() => {
        const currentSocket = socket;
        if (!currentSocket.connected) currentSocket.connect();

        const joinRoom = () => {
            currentSocket.emit("join", sId);
        };

        joinRoom();
        currentSocket.on("connect", joinRoom);

        axios.get(`/chat/${requestId}`)
            .then(res => {
                setMessages(res.data);
                currentSocket.emit("markAsRead", { requestId, userId: sId });
            })
            .catch(err => console.error("Chat history error:", err));

        const handleReceiveMessage = (newMessage) => {
            if (String(newMessage.requestId) === String(requestId)) {
                setMessages(prev => {
                    if (prev.some(m => m._id === newMessage._id)) return prev;
                    return [...prev, newMessage];
                });
                currentSocket.emit("markAsRead", { requestId, userId: sId });
            }
        };

        const handleMessagesRead = ({ requestId: reqId }) => {
            if (reqId === requestId) {
                setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
            }
        };

        const handleMessageDeleted = ({ messageId }) => {
            setMessages(prev => prev.map(m =>
                m._id === messageId ? { ...m, isDeleted: true, message: "This message was deleted" } : m
            ));
        };

        const handleReactionUpdated = ({ messageId, reactions }) => {
            setMessages(prev => prev.map(m =>
                m._id === messageId ? { ...m, reactions } : m
            ));
        };

        const handleMessageEdited = ({ messageId, newMessage, isEdited }) => {
            setMessages(prev => prev.map(m =>
                m._id === messageId ? { ...m, message: newMessage, isEdited } : m
            ));
        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("messagesRead", handleMessagesRead);
        socket.on("messageDeleted", handleMessageDeleted);
        socket.on("reactionUpdated", handleReactionUpdated);
        socket.on("messageEdited", handleMessageEdited);

        return () => {
            currentSocket.off("connect", joinRoom);
            currentSocket.off("receiveMessage", handleReceiveMessage);
            currentSocket.off("messagesRead", handleMessagesRead);
            currentSocket.off("messageDeleted", handleMessageDeleted);
            currentSocket.off("reactionUpdated", handleReactionUpdated);
            currentSocket.off("messageEdited", handleMessageEdited);
        };
    }, [requestId, sId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        if (editingMessage) {
            socket.emit("editMessage", {
                messageId: editingMessage._id,
                userId: sId,
                newMessage: message
            });
            setEditingMessage(null);
        } else {
            socket.emit("sendMessage", {
                sender: sId,
                receiver: rId,
                requestId,
                requestModel,
                message
            });
        }
        setMessage("");
    };

    const handleStartEdit = (msg) => {
        setEditingMessage(msg);
        setMessage(msg.message);
    };

    const handleDeleteMessage = (messageId) => {
        if (window.confirm("Undo this message?")) {
            socket.emit("deleteMessage", { messageId, userId: sId });
        }
    };

    const handleAddReaction = (messageId, emoji) => {
        socket.emit("addReaction", { messageId, userId: sId, emoji });
        setShowEmojiPicker(null);
    };

    return (
        <div className="fixed bottom-6 right-6 w-[360px] h-[520px] bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-100 z-[9999] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">

            <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs">
                        {receiverName?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm leading-tight">{receiverName}</h3>
                        <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Online</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 transition"
                >
                    <FaTimes size={14} className="text-slate-400" />
                </button>
            </div>


            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                        <div className="p-3 bg-white rounded-2xl shadow-sm italic text-[11px]">
                            No messages yet. Start a conversation!
                        </div>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = String(msg.sender?._id || msg.sender) === sId;
                        return (
                            <div key={msg._id || i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                <div className="group relative flex items-center gap-2 max-w-[85%]">
                                    {isMe && !msg.isDeleted && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => handleStartEdit(msg)}
                                                className="p-1.5 text-slate-300 hover:text-indigo-500 transition-all rounded-lg"
                                                title="Edit Message"
                                            >
                                                <FaEdit size={11} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMessage(msg._id)}
                                                className="p-1.5 text-slate-300 hover:text-red-500 transition-all rounded-lg"
                                                title="Undo Message"
                                            >
                                                <FaTrashAlt size={11} />
                                            </button>
                                        </div>
                                    )}

                                    <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm relative whitespace-pre-wrap ${isMe
                                        ? "bg-indigo-600 text-white rounded-tr-none"
                                        : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                                        } ${msg.isDeleted ? "italic opacity-50 bg-slate-100 text-slate-400" : ""}`}>

                                        {msg.message}

                                        {msg.isEdited && !msg.isDeleted && (
                                            <span className={`text-[9px] mt-1 block opacity-50 ${isMe ? "text-white" : "text-slate-500"}`}>
                                                (edited)
                                            </span>
                                        )}


                                        {msg.reactions?.length > 0 && (
                                            <div className={`absolute -bottom-2 ${isMe ? "right-0" : "left-0"} flex -space-x-1`}>
                                                {Array.from(new Set(msg.reactions.map(r => r.emoji))).slice(0, 3).map((emoji, idx) => (
                                                    <div key={idx} className="bg-white rounded-full px-1 py-0.5 shadow-sm border border-slate-50 scale-90">
                                                        <span className="text-[10px]">{emoji}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {!msg.isDeleted && (
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowEmojiPicker(showEmojiPicker === msg._id ? null : msg._id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-indigo-500 transition-all rounded-lg"
                                            >
                                                <FaSmile size={13} />
                                            </button>
                                            {showEmojiPicker === msg._id && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white border border-slate-100 rounded-full shadow-2xl p-1.5 flex gap-1 z-20 animate-in zoom-in duration-200">
                                                    {emojis.map(e => (
                                                        <button
                                                            key={e}
                                                            onClick={() => handleAddReaction(msg._id, e)}
                                                            className="hover:scale-125 transition-transform p-1.5 rounded-full text-lg"
                                                        >
                                                            {e}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className={`flex items-center gap-1.5 mt-1.5 ${isMe ? "pr-1" : "pl-1"}`}>
                                    <span className="text-[9px] text-slate-400 font-medium">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {isMe && !msg.isDeleted && (
                                        <span className={msg.isRead ? "text-indigo-500" : "text-slate-300"}>
                                            {msg.isRead ? <FaCheckDouble size={9} /> : <FaCheck size={9} />}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>


            <form onSubmit={handleSendMessage} className="p-5 bg-white border-t border-slate-100">
                {editingMessage && (
                    <div className="flex items-center justify-between mb-3 bg-indigo-50 px-3 py-2 rounded-xl">
                        <div className="flex items-center gap-2">
                            <FaEdit size={10} className="text-indigo-500" />
                            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Editing Message</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setEditingMessage(null);
                                setMessage("");
                            }}
                            className="bg-indigo-100 hover:bg-indigo-200 p-1 rounded-full transition"
                        >
                            <FaTimes size={10} className="text-indigo-500" />
                        </button>
                    </div>
                )}
                <div className="relative flex items-end gap-2">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Write a message..."
                        rows="1"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 pr-12 text-[13px] outline-none transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none min-h-[46px] max-h-[120px] overflow-y-auto"
                    />
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-90 disabled:opacity-30 disabled:grayscale"
                    >
                        <FaPaperPlane size={12} />
                    </button>
                </div>
            </form>
        </div>
    );
}
