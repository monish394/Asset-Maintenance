import { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane, FaTimes, FaCommentDots, FaMagic, FaCopy } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../../config/api";
import { toast } from "sonner";

export default function AiTechBot({ onApplyDescription, autoOpen = false }) {
    const [isOpen, setIsOpen] = useState(autoOpen);
    const [messages, setMessages] = useState([
        { role: "bot", text: "Hello! I'm your AI Maintenance Assistant. Describe your issue, and I'll help you write a professional report." }
    ]);

    useEffect(() => {
        if (autoOpen) setIsOpen(true);
    }, [autoOpen]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (textOverride) => {
        const messageText = textOverride || input;
        if (!messageText.trim()) return;

        const userMessage = { role: "user", text: messageText };
        setMessages(prev => [...prev, userMessage]);
        if (!textOverride) setInput("");
        setIsLoading(true);

        try {
            const res = await axios.post("/generate-description",
                { problem: messageText }
            );

            const botMessage = {
                role: "bot",
                text: res.data.description,
                isGenerated: true
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            const errMsg = err.response?.data?.err
                || (err.code === "ECONNABORTED" ? "Request timed out. Please try again." : null)
                || "AI service is temporarily unavailable. Please try again in a moment.";
            toast.error(errMsg);
            setMessages(prev => [...prev, {
                role: "bot",
                text: `⚠️ ${errMsg}`,
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[9999]">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 45 }}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all group relative border-4 border-white"
                    >
                        <FaRobot size={28} />
                        <span className="absolute -top-12 right-0 bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-indigo-50">
                            Need help describing an issue?
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="bg-white w-[380px] h-[550px] rounded-[2.5rem] shadow-3xl flex flex-col overflow-hidden border border-slate-100"
                    >

                        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                                <FaRobot size={150} className="absolute -bottom-10 -right-10 rotate-12" />
                            </div>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                    <FaMagic size={18} />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-sm tracking-tight">AI TechAssistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Active Intelligence</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-xl transition-colors relative z-10"
                            >
                                <FaTimes />
                            </button>
                        </div>


                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50"
                        >
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white shadow-sm border border-slate-100 text-slate-700 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                        {msg.isGenerated && (
                                            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        onApplyDescription(msg.text);
                                                        toast.success("Applied to request form!");
                                                    }}
                                                    className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                                >
                                                    <FaCopy size={10} />
                                                    Use This Description
                                                </button>
                                            </div>
                                        )}
                                        {msg.isError && (
                                            <div className="mt-3 pt-3 border-t border-red-100">
                                                <button
                                                    onClick={() => handleSend(messages[messages.length - 2]?.text)}
                                                    className="w-full py-2 bg-red-50 text-red-500 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-red-100 transition-all"
                                                >
                                                    🔄 Retry
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white shadow-sm border border-slate-100 p-4 rounded-2xl rounded-tl-none">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>


                        <div className="p-6 bg-white border-t border-slate-100 uppercase">
                            <div className="relative">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                                    placeholder="Tell me about the problem..."
                                    className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
                                >
                                    <FaPaperPlane size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
