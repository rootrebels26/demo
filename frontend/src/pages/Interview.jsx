// Main interview practice page with chat, voice input, and avatar speech.
import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import AvatarSpeaker from '../components/AvatarSpeaker';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
<<<<<<< HEAD
import { Activity, AlertTriangle, Camera, CameraOff, Eye, Lightbulb, Mic, MicOff, Send, ShieldCheck } from 'lucide-react';
=======
import { Mic, MicOff, Send } from 'lucide-react';
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff

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

<<<<<<< HEAD
const clampScore = (score) => Math.max(0, Math.min(100, Math.round(score)));

const scoreLabel = (score) => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Steady';
    if (score >= 40) return 'Needs focus';
    return 'Low';
};

const getConfidenceColor = (score) => {
    if (score >= 75) return 'bg-emerald-500';
    if (score >= 45) return 'bg-amber-500';
    return 'bg-rose-500';
};

=======
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
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
<<<<<<< HEAD
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [behaviorFeedback, setBehaviorFeedback] = useState([
        'Turn on video to receive live presence feedback.',
        'Your camera stays in your browser; only summary signals are sent to the coach.'
    ]);
    const [behaviorScores, setBehaviorScores] = useState({
        presence: 0,
        lighting: 0,
        eyeContact: 0,
        composure: 0,
    });
    const [behaviorSummary, setBehaviorSummary] = useState('Video feedback is off.');
    const [confidenceScore, setConfidenceScore] = useState(100);
    const [proctorWarnings, setProctorWarnings] = useState([]);
    const [interviewPaused, setInterviewPaused] = useState(false);
    const [pauseReason, setPauseReason] = useState('');
    const violationStreakRef = useRef(0);
=======
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff

    const {
        transcript,
        listening,
        resetTranscript,
    } = useSpeechRecognition();

    const chatEndRef = useRef(null);
<<<<<<< HEAD
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const previousFrameRef = useRef(null);
    const faceDetectorRef = useRef(null);
    const navigate = useNavigate();

    const triggerInterviewPause = (reason) => {
        if (interviewPaused) return;

        if (listening) {
            SpeechRecognition.stopListening();
        }

        setPauseReason(reason);
        setInterviewPaused(true);
    };

    const resumeInterview = () => {
        violationStreakRef.current = 0;
        setInterviewPaused(false);
        setPauseReason('');
        setProctorWarnings(['Interview resumed. Keep your face centered and stay alone in frame.']);
        setConfidenceScore((score) => Math.max(score, 65));
    };

    const stopFlaggedInterview = () => {
        stopCamera();
        setInterviewPaused(false);
        navigate('/subject-selection');
    };

    const stopCamera = (updateState = true) => {
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        if (updateState) {
            setCameraEnabled(false);
        }
    };

    const startCamera = async () => {
        try {
            setCameraError('');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
                audio: false,
            });
            mediaStreamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCameraEnabled(true);
        } catch (err) {
            console.error(err);
            setCameraError('Camera access was blocked or unavailable.');
            setCameraEnabled(false);
        }
    };

    const toggleCamera = () => {
        if (cameraEnabled) {
            stopCamera();
        } else {
            startCamera();
        }
    };

=======
    const navigate = useNavigate();

>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
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

<<<<<<< HEAD
    useEffect(() => () => stopCamera(false), []);

    useEffect(() => {
        if (!('FaceDetector' in window)) return;

        try {
            faceDetectorRef.current = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 3 });
        } catch {
            faceDetectorRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!cameraEnabled) {
            previousFrameRef.current = null;
            return undefined;
        }

        const analyzeFrame = async () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (!video || !canvas || video.readyState < 2) return;

            const width = 160;
            const height = 120;
            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext('2d', { willReadFrequently: true });
            context.drawImage(video, 0, 0, width, height);
            const { data } = context.getImageData(0, 0, width, height);

            let brightness = 0;
            let motion = 0;
            const previousFrame = previousFrameRef.current;

            for (let i = 0; i < data.length; i += 16) {
                const luminance = (data[i] + data[i + 1] + data[i + 2]) / 3;
                brightness += luminance;

                if (previousFrame) {
                    const previousLuminance = (previousFrame[i] + previousFrame[i + 1] + previousFrame[i + 2]) / 3;
                    motion += Math.abs(luminance - previousLuminance);
                }
            }

            const sampleCount = data.length / 16;
            brightness /= sampleCount;
            motion = previousFrame ? motion / sampleCount : 0;
            previousFrameRef.current = new Uint8ClampedArray(data);

            let faceCenteredScore = 58;
            let presenceScore = 72;
            let faceCount = 0;
            let headLowered = false;
            let lookingAway = false;
            let multiplePeople = false;
            let noFaceDetected = false;

            if (faceDetectorRef.current) {
                try {
                    const faces = await faceDetectorRef.current.detect(video);
                    faceCount = faces.length;
                    multiplePeople = faceCount > 1;
                    noFaceDetected = faceCount === 0;

                    if (faces[0]) {
                        const box = faces[0].boundingBox;
                        const centerX = box.x + box.width / 2;
                        const centerY = box.y + box.height / 2;
                        const offsetX = Math.abs(centerX - video.videoWidth / 2) / (video.videoWidth / 2);
                        const offsetY = Math.abs(centerY - video.videoHeight / 2) / (video.videoHeight / 2);
                        headLowered = centerY > video.videoHeight * 0.68 || box.y > video.videoHeight * 0.42;
                        lookingAway = offsetX > 0.38 || offsetY > 0.42;
                        faceCenteredScore = clampScore(100 - ((offsetX + offsetY) / 2) * 90);
                        presenceScore = clampScore(70 + Math.min((box.width / video.videoWidth) * 60, 30));
                    } else {
                        presenceScore = 28;
                        faceCenteredScore = 25;
                    }
                } catch {
                    faceDetectorRef.current = null;
                }
            } else {
                presenceScore = clampScore(brightness > 25 ? 68 + Math.min(motion, 20) : 30);
                faceCenteredScore = clampScore(62 - Math.max(motion - 18, 0) * 1.4);
            }

            const lightingScore = clampScore(100 - Math.abs(brightness - 130) * 0.75);
            const composureScore = clampScore(92 - Math.max(motion - 8, 0) * 2.8);
            const nextScores = {
                presence: presenceScore,
                lighting: lightingScore,
                eyeContact: faceCenteredScore,
                composure: composureScore,
            };

            const nextFeedback = [];
            const warningMessages = [];

            if (multiplePeople) {
                warningMessages.push('Another person appears to be present. Please stay alone for the interview.');
            }

            if (noFaceDetected) {
                warningMessages.push('Your face is not visible. Return to the camera frame.');
            }

            if (lookingAway) {
                warningMessages.push('Your eyes or face are away from the screen. Look back at the interview window.');
            }

            if (headLowered) {
                warningMessages.push('Your head appears lowered. Raise your head and keep eye level with the camera.');
            }

            if (lightingScore < 58) {
                nextFeedback.push(brightness < 100 ? 'Add more light in front of you.' : 'Reduce glare behind or beside you.');
            } else {
                nextFeedback.push('Lighting looks interview-ready.');
            }

            if (presenceScore < 55) {
                nextFeedback.push('Center your face in the camera frame.');
            } else if (faceCenteredScore < 62) {
                nextFeedback.push('Look closer to the webcam when answering.');
            } else {
                nextFeedback.push('Camera presence is steady.');
            }

            if (composureScore < 60) {
                nextFeedback.push('Slow your movement and settle your posture.');
            } else {
                nextFeedback.push('Posture and movement look composed.');
            }

            if (warningMessages.length) {
                violationStreakRef.current += 1;
            } else {
                violationStreakRef.current = Math.max(0, violationStreakRef.current - 1);
            }

            const confidencePenalty = warningMessages.length * 9 + Math.max(violationStreakRef.current - 1, 0) * 6;
            setConfidenceScore((currentScore) => {
                const nextScore = warningMessages.length
                    ? clampScore(currentScore - confidencePenalty)
                    : clampScore(currentScore + 4);

                if (!interviewPaused && (nextScore <= 35 || violationStreakRef.current >= 3 || multiplePeople)) {
                    const reason = warningMessages[0] || 'Interview attention dropped below the allowed threshold.';
                    window.setTimeout(() => triggerInterviewPause(reason), 0);
                }

                return nextScore;
            });
            setProctorWarnings(warningMessages);

            const summary = [
                `presence ${scoreLabel(nextScores.presence)} (${nextScores.presence}/100)`,
                `lighting ${scoreLabel(nextScores.lighting)} (${nextScores.lighting}/100)`,
                `camera focus ${scoreLabel(nextScores.eyeContact)} (${nextScores.eyeContact}/100)`,
                `composure ${scoreLabel(nextScores.composure)} (${nextScores.composure}/100)`,
                `confidence ${confidenceScore}/100`,
                warningMessages.length ? `active warnings: ${warningMessages.join(' ')}` : 'active warnings: none',
                faceDetectorRef.current ? `detected faces: ${faceCount}` : 'face detection unavailable; using visual stability signals',
                `current tips: ${nextFeedback.join(' ')}`,
            ].join('; ');

            setBehaviorScores(nextScores);
            setBehaviorFeedback(nextFeedback);
            setBehaviorSummary(summary);
        };

        const interval = window.setInterval(analyzeFrame, 1800);
        analyzeFrame();

        return () => window.clearInterval(interval);
    }, [cameraEnabled, confidenceScore, interviewPaused, listening]);

=======
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
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
<<<<<<< HEAD
        if (interviewPaused) {
            setError('Interview is paused. Confirm the warning before continuing.');
            return;
        }
=======
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
        if (!input.trim()) return;

        if (listening) {
            SpeechRecognition.stopListening();
        }

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        resetTranscript();

        try {
<<<<<<< HEAD
            const res = await chatAPI.interact(newMessages, selectedSubject, selectedCompany, behaviorSummary);
=======
            const res = await chatAPI.interact(newMessages, selectedSubject, selectedCompany);
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
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
<<<<<<< HEAD
            <div className={`flex-1 container mx-auto flex flex-col lg:flex-row gap-10 py-10 px-6 transition-all duration-500 ${interviewPaused ? 'blur-md pointer-events-none select-none' : ''}`}>
=======
            <div className="flex-1 container mx-auto flex flex-col lg:flex-row gap-10 py-10 px-6">
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
                
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
<<<<<<< HEAD
                    </div>

                    <div className="glass-panel rounded-[3rem] p-6 space-y-5 hover-glow border-slate-200 dark:border-white/5">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h3 className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em]">Live Video Coach</h3>
                                <p className="mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Behavior feedback</p>
                            </div>
                            <button
                                type="button"
                                onClick={toggleCamera}
                                className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                    cameraEnabled
                                        ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                                        : 'bg-slate-100 text-slate-600 hover:text-slate-950 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white'
                                }`}
                                aria-label={cameraEnabled ? 'Turn camera off' : 'Turn camera on'}
                                title={cameraEnabled ? 'Turn camera off' : 'Turn camera on'}
                            >
                                {cameraEnabled ? <CameraOff size={20} /> : <Camera size={20} />}
                            </button>
                        </div>

                        <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 dark:border-white/10">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className={`h-full w-full object-cover transition-opacity duration-500 ${cameraEnabled ? 'opacity-100' : 'opacity-20'}`}
                            />
                            <canvas ref={canvasRef} className="hidden" />
                            {!cameraEnabled && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-300">
                                    <Camera size={34} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Video Paused</span>
                                </div>
                            )}
                            {cameraEnabled && (
                                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                                    <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                                    Live
                                </div>
                            )}
                        </div>

                        {cameraError && (
                            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-[10px] font-black uppercase tracking-widest text-rose-500">
                                {cameraError}
                            </div>
                        )}

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={16} className={confidenceScore < 45 ? 'text-rose-500' : 'text-amber-500'} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Confidence Score</span>
                                </div>
                                <span className="text-lg font-black text-slate-950 dark:text-white">{confidenceScore}</span>
                            </div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${getConfidenceColor(confidenceScore)}`}
                                    style={{ width: `${confidenceScore}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {[
                                ['Presence', behaviorScores.presence, ShieldCheck],
                                ['Lighting', behaviorScores.lighting, Lightbulb],
                                ['Focus', behaviorScores.eyeContact, Eye],
                                ['Composure', behaviorScores.composure, Activity],
                            ].map(([label, score, Icon]) => (
                                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
                                    <div className="flex items-center justify-between gap-2">
                                        <Icon size={16} className="text-sky-500" />
                                        <span className="text-sm font-black text-slate-950 dark:text-white">{score}</span>
                                    </div>
                                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                                        <div className="h-full rounded-full bg-sky-500 transition-all duration-500" style={{ width: `${score}%` }}></div>
                                    </div>
                                    <p className="mt-2 text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            {proctorWarnings.map((item) => (
                                <div key={item} className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-[11px] font-black leading-relaxed text-rose-500">
                                    {item}
                                </div>
                            ))}
                            {behaviorFeedback.map((item) => (
                                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-[11px] font-bold leading-relaxed text-slate-600 dark:bg-white/5 dark:text-slate-300">
                                    {item}
                                </div>
                            ))}
                        </div>

=======
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
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
<<<<<<< HEAD
                                disabled={interviewPaused}
                                className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                    listening ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'glass-panel text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                                } disabled:opacity-40`}
=======
                                className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                    listening ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'glass-panel text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                                }`}
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
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
<<<<<<< HEAD
                                disabled={!input.trim() || interviewPaused}
                                className="h-16 px-10 rounded-2xl bg-sky-500 text-white font-black uppercase tracking-widest text-xs hover:bg-sky-600 disabled:opacity-50 disabled:grayscale transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] inline-flex items-center gap-3"
                            >
                                <Send size={18} />
=======
                                disabled={!input.trim()}
                                className="h-16 px-10 rounded-2xl bg-sky-500 text-white font-black uppercase tracking-widest text-xs hover:bg-sky-600 disabled:opacity-50 disabled:grayscale transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                            >
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
                                Send Signal
                            </button>
                        </form>
                    </div>
                </div>
            </div>
<<<<<<< HEAD
            {interviewPaused && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-6 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-[2rem] border border-rose-500/30 bg-white p-8 shadow-[0_40px_120px_rgba(0,0,0,0.35)] dark:bg-slate-950">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                            <AlertTriangle size={30} />
                        </div>
                        <div className="mt-6 space-y-3 text-center">
                            <h2 className="text-2xl font-black uppercase tracking-widest text-slate-950 dark:text-white">Interview Paused</h2>
                            <p className="text-sm font-bold leading-6 text-slate-600 dark:text-slate-300">
                                {pauseReason || 'The video coach detected an interview behavior warning.'}
                            </p>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                Do you want to continue the interview now?
                            </p>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={stopFlaggedInterview}
                                className="h-14 rounded-2xl border border-slate-200 bg-slate-100 text-xs font-black uppercase tracking-widest text-slate-700 transition-all hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                            >
                                No
                            </button>
                            <button
                                type="button"
                                onClick={resumeInterview}
                                className="h-14 rounded-2xl bg-sky-500 text-xs font-black uppercase tracking-widest text-white shadow-[0_0_24px_rgba(56,189,248,0.35)] transition-all hover:bg-sky-600"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
=======
>>>>>>> d417c960dd5719642e7328a49bba71d30ef531ff
        </div>
    );
};

export default Interview;
