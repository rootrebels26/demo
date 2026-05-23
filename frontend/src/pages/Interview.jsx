// Main interview practice page with chat, voice input, and avatar speech.
import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import AvatarSpeaker from '../components/AvatarSpeaker';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Send } from 'lucide-react';

const renderInlineFormatting = (text) => {
    const segments = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

    return segments.map((segment, index) => {
        if (!segment) return null;

        if (segment.startsWith('`') && segment.endsWith('`')) {
            return (
                <code key={index} className="rounded-md bg-slate-200 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-950 dark:bg-slate-800 dark:text-sky-100">
                    {segment.slice(1, -1)}
                </code>
            );
        }

        if (segment.startsWith('**') && segment.endsWith('**')) {
            return <strong key={index}>{segment.slice(2, -2)}</strong>;
        }

        return segment;
    });
};

const MessageContent = ({ content }) => {
    const parts = content.split(/```(\w+)?\n?([\s\S]*?)```/g);

    return (
        <div className="space-y-4">
            {parts.map((part, index) => {
                if (!part) return null;

                const isCode = index % 3 === 2;
                const language = parts[index - 1];

                if (isCode) {
                    return (
                        <div key={index} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-left shadow-inner">
                            {language && (
                                <div className="border-b border-slate-800 bg-slate-900 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-sky-300">
                                    {language}
                                </div>
                            )}
                            <pre className="max-w-full overflow-x-auto p-4 text-sm leading-6 text-slate-100">
                                <code>{part.trim()}</code>
                            </pre>
                        </div>
                    );
                }

                if (index % 3 === 1) return null;

                return part
                    .split(/\n{2,}/)
                    .filter(Boolean)
                    .map((paragraph, paragraphIndex) => (
                        <p key={`${index}-${paragraphIndex}`}>
                            {renderInlineFormatting(paragraph)}
                        </p>
                    ));
            })}
        </div>
    );
};

const Interview = () => {
    const requiredResponses = 6;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [lastReply, setLastReply] = useState('');
    const [error, setError] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [ceoImage, setCeoImage] = useState('');
    const [user, setUser] = useState({});

    const {
        transcript,
        listening,
        resetTranscript,
    } = useSpeechRecognition();

    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const subject = localStorage.getItem('selectedSubject');
        const company = localStorage.getItem('selectedCompany') || 'General';
        const img = localStorage.getItem('ceoImage');
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!subject) {
            navigate('/subject-selection');
            return;
        }
        setSelectedSubject(subject);
        setSelectedCompany(company);
        setCeoImage(img || '');
        setUser(userData);
    }, [navigate]);

    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    const toggleListening = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    useEffect(() => {
        const startInterview = async () => {
            if (!selectedSubject) return;

            const companyMode = selectedCompany && selectedCompany !== 'General'
                ? `${selectedCompany}-style interview based on public preparation patterns`
                : 'general interview';
            const welcomeMsg = `Hi ${user.username || 'there'}! Welcome to your ${companyMode}. I'm your AI coach, and I'll ask realistic questions one at a time. Are you ready to begin?`;
            setMessages([{ role: 'assistant', content: welcomeMsg }]);
            setLastReply(welcomeMsg);
        };
        startInterview();
    }, [selectedSubject, selectedCompany, user.username]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        if (listening) {
            SpeechRecognition.stopListening();
        }

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        resetTranscript();

        try {
            const res = await chatAPI.interact(newMessages, selectedSubject, selectedCompany);
            const aiReply = res.data.reply;
            setMessages([...newMessages, { role: 'assistant', content: aiReply }]);
            setLastReply(res.data.speech_text || aiReply);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to get response from AI coach.');
        }
    };

    const finishInterview = async () => {
        const userMessages = messages.filter(m => m.role === 'user');
        if (userMessages.length < requiredResponses) {
            setError(`Please complete at least ${requiredResponses} responses before finishing. You have completed ${userMessages.length} responses.`);
            return;
        }

        try {
            const res = await chatAPI.save(JSON.stringify(messages), selectedSubject);
            navigate(`/feedback/${res.data.id}`);
        } catch (err) {
            console.error(err);
            setError('Unable to save the interview.');
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] animate-fadeIn">
            <div className="flex-1 container mx-auto flex flex-col lg:flex-row gap-10 py-10 px-6">
                
                {/* AI Persona Side */}
                <div className="lg:w-1/3 flex flex-col gap-8">
                    <div className="glass-card rounded-[3rem] p-10 flex flex-col items-center justify-center relative overflow-hidden group shadow-[0_32px_64px_-12px_rgba(15,23,42,0.14)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] hover-glow">
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-transparent to-transparent -z-10 animate-pulse"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-50 animate-marquee"></div>
                        
                        <AvatarSpeaker isSpeaking={isSpeaking} onSpeakStateChange={setIsSpeaking} text={lastReply} image={ceoImage} />
                        
                        <div className="mt-8 text-center space-y-4">
                            <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white uppercase tracking-[0.3em] drop-shadow-sm dark:drop-shadow-2xl">AI Oracle</h2>
                            <div className="flex items-center justify-center gap-3 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 dark:bg-white/5 dark:border-white/10">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.3em]">Neural Link Stable</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel rounded-[3rem] p-10 space-y-6 hover-glow border-slate-200 dark:border-white/5">
                        <h3 className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em] mb-4">Mission Status</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/5">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol</span>
                                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedSubject.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/5">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Company</span>
                                <span className="text-xs font-black text-sky-600 dark:text-sky-300 uppercase tracking-tight">{selectedCompany}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/5">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progress</span>
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-20 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${Math.min((messages.filter(m => m.role === 'user').length / requiredResponses) * 100, 100)}%` }}></div>
                                    </div>
                                    <span className="text-xs font-black text-slate-900 dark:text-white">{messages.filter(m => m.role === 'user').length}/{requiredResponses}</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={finishInterview}
                            className="w-full mt-4 py-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black text-xs uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all duration-500 shadow-2xl"
                        >
                            Abort Mission
                        </button>
                    </div>
                </div>

                {/* Chat Console Side */}
                <div className="flex-1 flex flex-col glass-card rounded-[3rem] overflow-hidden shadow-[0_48px_100px_-24px_rgba(15,23,42,0.16)] dark:shadow-[0_48px_100px_-24px_rgba(0,0,0,0.5)]">
                    <div className="p-8 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-sky-500 flex items-center justify-center text-white">
                                <Mic size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-widest">Neural Console</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Real-time interview stream</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`} style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className={`flex gap-6 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`h-14 w-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-lg shadow-2xl transition-transform duration-500 hover:scale-110 ${
                                        m.role === 'user' 
                                            ? 'bg-sky-500 text-white' 
                                            : 'bg-slate-100 border border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-slate-400'
                                    }`}>
                                        {m.role === 'user' ? 'ME' : 'AI'}
                                    </div>
                                    <div className={`p-8 rounded-[2.5rem] text-base font-medium leading-relaxed shadow-2xl transition-all duration-500 ${
                                        m.role === 'user' 
                                            ? 'bg-white text-slate-900 rounded-tr-none hover:bg-slate-50' 
                                            : 'glass-panel text-slate-700 dark:text-slate-200 rounded-tl-none border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10'
                                    }`}>
                                        <MessageContent content={m.content} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {error && (
                            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold text-center uppercase tracking-widest">
                                {error}
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-8 bg-slate-50/80 border-t border-slate-200 dark:bg-white/5 dark:border-white/5">
                        <form onSubmit={handleSend} className="flex gap-4">
                            <button
                                type="button"
                                onClick={toggleListening}
                                className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                    listening ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'glass-panel text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                                }`}
                            >
                                {listening ? <MicOff size={24} /> : <Mic size={24} />}
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Communicate your response..."
                                className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-8 font-medium text-black dark:text-white placeholder:text-slate-500 outline-none focus:border-sky-500/50 transition-all shadow-inner"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="h-16 px-10 rounded-2xl bg-sky-500 text-white font-black uppercase tracking-widest text-xs hover:bg-sky-600 disabled:opacity-50 disabled:grayscale transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                            >
                                Send Signal
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Interview;
