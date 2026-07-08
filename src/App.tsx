import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Loader2, Copy, Check, History, X, ArrowLeftRight, Settings2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';

// Character Components
const Daisy = () => (
  <motion.svg width="100" height="100" viewBox="0 0 100 100"
    animate={{ rotate: [0, 5, -5, 0], scale: [0.98, 1.02, 0.98] }}
    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
    <path d="M 50 15 C 65 15, 65 40, 50 50 C 35 40, 35 15, 50 15 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 50 85 C 65 85, 65 60, 50 50 C 35 60, 35 85, 50 85 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 15 50 C 15 35, 40 35, 50 50 C 40 65, 15 65, 15 50 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 85 50 C 85 35, 60 35, 50 50 C 60 65, 85 65, 85 50 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round" />
    
    <path d="M 25 25 C 40 15, 50 40, 50 50 C 40 60, 15 40, 25 25 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 75 75 C 60 85, 50 60, 50 50 C 60 40, 85 60, 75 75 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 75 25 C 85 40, 60 50, 50 50 C 40 50, 60 15, 75 25 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round" />
    <path d="M 25 75 C 15 60, 40 50, 50 50 C 60 50, 40 85, 25 75 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round" />
    
    <circle cx="50" cy="50" r="12" fill="#1A1A1A" />
    <circle cx="46" cy="46" r="3" fill="#FFF" />
  </motion.svg>
);

const Butterfly = () => (
  <motion.svg width="90" height="90" viewBox="0 0 100 100" 
    animate={{ y: [0, -8, 0], rotate: [-2, 4, -2] }}
    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
    <path d="M 50 50 C 20 20, 10 50, 45 55 C 10 70, 30 90, 50 60 C 70 90, 90 70, 55 55 C 90 50, 80 20, 50 50 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="5" strokeLinejoin="round" />
    <circle cx="35" cy="40" r="4" fill="#1A1A1A" />
    <circle cx="65" cy="40" r="4" fill="#1A1A1A" />
    <circle cx="40" cy="70" r="3" fill="#1A1A1A" />
    <circle cx="60" cy="70" r="3" fill="#1A1A1A" />
    <rect x="47" y="35" width="6" height="40" rx="3" fill="#1A1A1A" />
    <path d="M 48 35 Q 40 20 35 25 M 52 35 Q 60 20 65 25" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
  </motion.svg>
);

const Sparkle = () => (
  <motion.svg width="60" height="60" viewBox="0 0 100 100"
    animate={{ rotate: [0, 90, 180], scale: [0.8, 1.1, 0.8] }}
    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
    <path d="M 50 10 C 50 40, 60 50, 90 50 C 60 50, 50 60, 50 90 C 50 60, 40 50, 10 50 C 40 50, 50 40, 50 10 Z" fill="#FFF" stroke="#1A1A1A" strokeWidth="5" strokeLinejoin="round" />
  </motion.svg>
);

const UKFlag = ({ className = "" }: { className?: string }) => (
  <svg width="32" height="24" viewBox="0 0 28 20" className={`inline-block rounded-[3px] shadow-[2px_2px_0px_0px_#1A1A1A] bg-[#1e3a8a] ${className}`}>
    <path d="M-2 -2L30 22M-2 22L30 -2" stroke="white" strokeWidth="4" />
    <path d="M-2 -2L30 22M-2 22L30 -2" stroke="#ef4444" strokeWidth="2" />
    <path d="M14 0V20M0 10H28" stroke="white" strokeWidth="6" />
    <path d="M14 0V20M0 10H28" stroke="#ef4444" strokeWidth="4" />
    <rect width="28" height="20" fill="none" stroke="#1A1A1A" strokeWidth="4" />
  </svg>
);

const PHFlag = ({ className = "" }: { className?: string }) => (
  <svg width="32" height="24" viewBox="0 0 28 20" className={`inline-block rounded-[3px] shadow-[2px_2px_0px_0px_#1A1A1A] bg-white ${className}`}>
    <rect width="28" height="10" fill="#3b82f6" />
    <rect y="10" width="28" height="10" fill="#ef4444" />
    <polygon points="-2,-2 14,10 -2,22" fill="white" stroke="#1A1A1A" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="4.5" cy="10" r="2.5" fill="#eab308" stroke="#1A1A1A" strokeWidth="1" />
    <rect width="28" height="20" fill="none" stroke="#1A1A1A" strokeWidth="4" />
  </svg>
);

// --- SVGs for Baybayin Mode ---
const TribalSun = () => (
  <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-80">
    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="4" />
    <circle cx="50" cy="50" r="8" fill="currentColor" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <path key={angle} d="M 50 30 L 50 10 M 45 15 L 50 10 L 55 15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }} />
    ))}
  </svg>
);

const TribalPetroglyph1 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100" className="text-[#2C2825] opacity-30">
    <path d="M 50 20 L 50 80 M 30 40 L 70 40 M 35 60 L 65 60 M 20 20 L 30 40 M 80 20 L 70 40" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TribalPetroglyph2 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100" className="text-[#2C2825] opacity-30">
    <path d="M 30 80 C 30 40, 70 40, 70 80 M 50 30 C 50 10, 80 10, 80 30 C 80 50, 50 50, 50 30 Z" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- Baybayin Converter Logic ---
const toBaybayin = (text: string) => {
  if(!text) return "";
  let str = text.toLowerCase();
  str = str.replace(/f/g, 'p').replace(/v/g, 'b').replace(/z/g, 's').replace(/j/g, 'dy').replace(/c/g, 'k').replace(/x/g, 'ks').replace(/q/g, 'k');
  const vowels: Record<string, string> = {'a':'\u1700', 'e':'\u1701', 'i':'\u1701', 'o':'\u1702', 'u':'\u1702'};
  const consonants: Record<string, string> = {'k':'\u1703', 'g':'\u1704', 'ng':'\u1705', 't':'\u1706', 'd':'\u1707', 'r':'\u1707','n':'\u1708', 'p':'\u1709', 'b':'\u170A', 'm':'\u170B', 'y':'\u170C', 'l':'\u170E','w':'\u170F', 's':'\u1710', 'h':'\u1711'};
  let result = ""; let i = 0;
  while (i < str.length) {
    let char = str[i]; let nextChar = str[i+1]; let twoChar = char + (nextChar || "");
    if (twoChar === 'ng' && consonants['ng']) {
       let third = str[i+2];
       if (vowels[third]) {
         if (third === 'a') result += consonants['ng'];
         else if (third === 'e' || third === 'i') result += consonants['ng'] + '\u1712';
         else if (third === 'o' || third === 'u') result += consonants['ng'] + '\u1713';
         i += 3;
       } else { result += consonants['ng'] + '\u1714'; i += 2; }
       continue;
    }
    if (consonants[char]) {
       if (vowels[nextChar]) {
          if (nextChar === 'a') result += consonants[char];
          else if (nextChar === 'e' || nextChar === 'i') result += consonants[char] + '\u1712';
          else if (nextChar === 'o' || nextChar === 'u') result += consonants[char] + '\u1713';
          i += 2;
       } else { result += consonants[char] + '\u1714'; i += 1; }
    } else if (vowels[char]) { result += vowels[char]; i += 1; } 
    else { result += char; i += 1; }
  }
  return result;
};

export default function App() {
  // App Mode State
  const [appMode, setAppMode] = useState<'translator' | 'baybayin'>('translator');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextMode, setNextMode] = useState<'translator' | 'baybayin'>('translator');

  // Translator States
  const [englishWord, setEnglishWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [example, setExample] = useState<{ tagalogSentence?: string; englishTranslation?: string } | null>(null);
  const [isLoadingExample, setIsLoadingExample] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [exampleAudioUrl, setExampleAudioUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isExampleCopied, setIsExampleCopied] = useState(false);
  const [history, setHistory] = useState<{english: string, tagalog: string, direction?: 'en-tl' | 'tl-en'}[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [direction, setDirection] = useState<'en-tl' | 'tl-en'>('en-tl');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Baybayin States
  const [baybayinInput, setBaybayinInput] = useState('');
  const [baybayinOutput, setBaybayinOutput] = useState('');
  const [isBaybayinCopied, setIsBaybayinCopied] = useState(false);
  const [baybayinHistory, setBaybayinHistory] = useState<{input: string, output: string}[]>([]);
  const [showBaybayinHistory, setShowBaybayinHistory] = useState(false);

  const englishSuggestions = ['hello', 'how are you?', 'thank you', 'good morning', 'I love you'];
  const tagalogSuggestions = ['kumusta', 'salamat', 'magandang umaga', 'mahal kita', 'paalam'];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentPlaceholder = direction === 'en-tl' 
    ? englishSuggestions[placeholderIndex % englishSuggestions.length] 
    : tagalogSuggestions[placeholderIndex % tagalogSuggestions.length];

  const handleModeSwitch = (mode: 'translator' | 'baybayin') => {
    if (mode === appMode) return;
    setNextMode(mode);
    setIsTransitioning(true);
    setTimeout(() => {
      setAppMode(mode);
      setIsTransitioning(false);
    }, 800);
  };

  const handleSwap = () => {
    setDirection(prev => prev === 'en-tl' ? 'tl-en' : 'en-tl');
    setTranslation('');
    setExample(null);
    setAudioUrl(null);
    setExampleAudioUrl(null);
    setErrorMsg(null);
  };

  const handleGenerateBaybayin = () => {
    if (!baybayinInput.trim()) return;
    const output = toBaybayin(baybayinInput);
    setBaybayinOutput(output);
    setBaybayinHistory(prev => [{ input: baybayinInput, output: output }, ...prev]);
  };

  const baybayinRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (!baybayinRef.current) return;
    try {
      const canvas = await html2canvas(baybayinRef.current, { backgroundColor: null });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'baybayin-script.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    }
  };

  const handleCopyBaybayin = async () => {
    if (!baybayinOutput) return;
    try {
      await navigator.clipboard.writeText(baybayinOutput);
      setIsBaybayinCopied(true);
      setTimeout(() => setIsBaybayinCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleCopy = async () => {
    if (!translation) return;
    try {
      await navigator.clipboard.writeText(translation);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleCopyExample = async () => {
    if (!example?.tagalogSentence) return;
    try {
      await navigator.clipboard.writeText(example.tagalogSentence);
      setIsExampleCopied(true);
      setTimeout(() => setIsExampleCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy example', err);
    }
  };

  const prefetchAudio = async (text: string, setter: React.Dispatch<React.SetStateAction<string | null>>, lang: string = 'fil-PH') => {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang })
      });
      if (res.ok) {
        const blob = await res.blob();
        setter(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error('Audio prefetch failed', err);
    }
  };

  const handleTranslate = async () => {
    if (!englishWord.trim()) return;
    
    setIsLoading(true);
    setTranslation('');
    setExample(null);
    setAudioUrl(null);
    setExampleAudioUrl(null);
    setErrorMsg(null);
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: englishWord, direction }),
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.translation) {
        setTranslation(data.translation);
        setHistory(prev => {
          const newEntry = { english: englishWord, tagalog: data.translation, direction };
          const filtered = prev.filter(item => item.english.toLowerCase() !== englishWord.toLowerCase());
          return [newEntry, ...filtered].slice(0, 10);
        });
        // Fire-and-forget prefetch
        prefetchAudio(data.translation, setAudioUrl, direction === 'en-tl' ? 'fil-PH' : 'en-US');
      }
    } catch (error: any) {
      console.error('Translation error:', error);
      setErrorMsg(error.message || 'Translation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (url: string | null) => {
    if (url) {
      const audio = new Audio(url);
      audio.play().catch(e => console.error("Audio play failed:", e));
    }
  };

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = direction === 'en-tl' ? 'en-US' : 'fil-PH';
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsRecording(true);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setEnglishWord(transcript);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };
    
    recognition.start();
  };

  const handleShowExample = async () => {
    if (!translation) return;
    
    setIsLoadingExample(true);
    
    try {
      const response = await fetch('/api/example', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          englishWord: direction === 'en-tl' ? englishWord : translation, 
          tagalogWord: direction === 'tl-en' ? englishWord : translation,
          direction 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const targetSentence = data.targetSentence || data.tagalogSentence;
      if (targetSentence) {
        setExample({
          tagalogSentence: targetSentence,
          englishTranslation: data.sourceTranslation || data.englishTranslation
        });
        prefetchAudio(targetSentence, setExampleAudioUrl, direction === 'en-tl' ? 'fil-PH' : 'en-US');
      }
    } catch (error) {
      console.error('Example generation error:', error);
    } finally {
      setIsLoadingExample(false);
    }
  };

  return (
    <>
      {/* Loading Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${nextMode === 'baybayin' ? 'bg-[#12100E]' : 'bg-[#f1f8e9]'}`}
          >
            {nextMode === 'baybayin' ? (
              <div className="flex flex-col items-center text-white">
                <motion.div 
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
                  transition={{ rotate: { duration: 3, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity } }}
                  className="mb-8"
                >
                  <TribalSun />
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="font-mono text-xl tracking-[0.3em] font-bold opacity-80"
                >
                  PAG-UKIT NG BAYBAYIN...
                </motion.p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-[#1A1A1A]">
                <motion.div 
                  animate={{ y: [0, -20, 0], scale: [1, 1.05, 1], rotate: [-2, 2, -2] }} 
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="mb-8 bg-white border-[6px] border-[#1A1A1A] p-6 rounded-[20px] shadow-[8px_8px_0px_0px_#1A1A1A]"
                >
                  <Sparkle />
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="font-black text-2xl uppercase tracking-widest text-center"
                >
                  RETURNING TO TAGALOG SUPREME TRANSLATOR...
                </motion.p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Container */}
      <div 
        className={`min-h-[100dvh] font-sans p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] flex flex-col items-center justify-start overflow-x-hidden relative ${appMode === 'translator' ? 'text-[#1A1A1A] selection:bg-[#a5d6a7]' : 'text-[#2C2825] selection:bg-[#D4C3A3]'}`} 
        style={appMode === 'translator' 
          ? { backgroundColor: '#f1f8e9', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0zM20 20h20v20H20z\' fill=\'%23dcedc8\' fill-opacity=\'0.6\'/%3E%3C/svg%3E")' }
          : { backgroundColor: '#F6F5F2', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'120\' height=\'120\' viewBox=\'0 0 120 120\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg stroke=\'%232C2825\' stroke-width=\'1.5\' stroke-opacity=\'0.05\' fill=\'none\'%3E%3Cpath d=\'M0 60 L60 0 L120 60 L60 120 Z\' /%3E%3Cpath d=\'M15 60 L60 15 L105 60 L60 105 Z\' /%3E%3Cpath d=\'M30 60 L60 30 L90 60 L60 90 Z\' /%3E%3Ccircle cx=\'60\' cy=\'60\' r=\'4\' fill=\'%232C2825\' fill-opacity=\'0.04\' /%3E%3Cpath d=\'M0 0 L120 120 M120 0 L0 120\' stroke-dasharray=\'4 4\' /%3E%3C/g%3E%3C/svg%3E"), url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")' }
        }
      >
        
        {/* Top Controls */}
        <div className="w-full max-w-4xl flex justify-between items-center z-40 mb-2 relative">
          <button 
            onClick={() => handleModeSwitch(appMode === 'translator' ? 'baybayin' : 'translator')}
            className={`flex items-center justify-center w-12 h-12 transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none rounded-[255px_15px_225px_15px/15px_225px_15px_255px] ${
              appMode === 'translator'
                ? 'bg-[#1A1A1A] border-[4px] border-[#1A1A1A] text-[#a5d6a7] shadow-[4px_4px_0px_0px_#a5d6a7] hover:bg-gray-800'
                : 'bg-[#F6F5F2] border-[4px] border-[#2C2825] text-[#2C2825] shadow-[4px_4px_0px_0px_#2C2825] hover:bg-[#EAE6DF]'
            }`}
            title={appMode === 'translator' ? 'Reveal the past...' : 'Return to translator'}
          >
            {appMode === 'translator' ? (
              <svg width="26" height="26" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
                {/* Hand-drawn tribal star/eye */}
                <path d="M 50 15 Q 60 35 85 50 Q 60 65 50 85 Q 40 65 15 50 Q 40 35 50 15 Z" />
                <circle cx="50" cy="50" r="8" fill="currentColor" />
                <path d="M 30 30 Q 35 35 40 40" />
                <path d="M 70 30 Q 65 35 60 40" />
                <path d="M 30 70 Q 35 65 40 60" />
                <path d="M 70 70 Q 65 65 60 60" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                {/* Hand-drawn daisy */}
                <path d="M 50 45 Q 60 10 70 20 Q 60 35 55 50" />
                <path d="M 55 50 Q 90 30 85 45 Q 65 55 50 55" />
                <path d="M 50 55 Q 80 85 65 90 Q 45 65 45 50" />
                <path d="M 45 50 Q 15 80 10 65 Q 35 45 50 45" />
                <path d="M 50 45 Q 15 15 30 10 Q 45 35 55 50" />
                <circle cx="50" cy="50" r="12" fill="currentColor" />
              </svg>
            )}
          </button>
          
          {appMode === 'translator' ? (
            <button 
              onClick={() => setShowHistory(true)}
              className="w-12 h-12 bg-white border-[4px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] flex items-center justify-center transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:bg-gray-50"
              title="History"
            >
              <History className="w-5 h-5 stroke-[4] text-[#1A1A1A]" />
            </button>
          ) : (
            <button 
              onClick={() => setShowBaybayinHistory(true)}
              className="w-12 h-12 bg-[#F6F5F2] border-[4px] border-[#2C2825] shadow-[4px_4px_0px_0px_#2C2825] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] flex items-center justify-center transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:bg-[#EAE6DF]"
              title="Baybayin History"
            >
              <History className="w-6 h-6 stroke-[3] text-[#2C2825]" />
            </button>
          )}
        </div>

        {/* History Modal (Translator) */}
        {showHistory && appMode === 'translator' && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[25px] p-6 w-full max-w-md relative max-h-[80vh] flex flex-col">
              <button 
                onClick={() => setShowHistory(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white border-[4px] border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] rounded-full flex items-center justify-center transition-all duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:bg-gray-50 z-10"
              >
                <X className="w-5 h-5 stroke-[4] text-[#1A1A1A]" />
              </button>
              <h2 className="text-3xl font-black text-[#1A1A1A] mb-6 uppercase tracking-tight pr-12">History</h2>
              <div className="overflow-y-auto flex-1 pr-2 space-y-4">
                {history.length === 0 ? (
                  <p className="text-gray-500 font-bold text-center italic py-8">No translation history yet.</p>
                ) : (
                  history.map((item, index) => (
                    <div key={index} className="bg-gray-50 border-[4px] border-[#1A1A1A] rounded-xl p-4 flex flex-col gap-1 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => {
                      setDirection(item.direction || 'en-tl');
                      setEnglishWord(item.english);
                      setTranslation(item.tagalog);
                      setShowHistory(false);
                      setExample(null);
                      setAudioUrl(null);
                      setExampleAudioUrl(null);
                    }}>
                      <span className="text-sm font-black text-gray-500 uppercase">{item.direction === 'tl-en' ? 'Tagalog' : 'English'}: {item.english}</span>
                      <span className="text-xl font-black text-[#1A1A1A] uppercase">{item.direction === 'tl-en' ? 'English' : 'Tagalog'}: {item.tagalog}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Modal (Baybayin) */}
        {showBaybayinHistory && appMode === 'baybayin' && (
          <div className="fixed inset-0 bg-[#F6F5F2]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-[#F6F5F2] border-[6px] border-[#2C2825] shadow-[12px_12px_0px_0px_#2C2825] rounded-[255px_25px_225px_25px/25px_225px_25px_255px] p-6 w-full max-w-md relative max-h-[80vh] flex flex-col">
              <button 
                onClick={() => setShowBaybayinHistory(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-[#F6F5F2] border-[4px] border-[#2C2825] shadow-[4px_4px_0px_0px_#2C2825] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] flex items-center justify-center transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:bg-[#EAE6DF] z-10"
              >
                <X className="w-6 h-6 stroke-[3] text-[#2C2825]" />
              </button>
              <h2 className="text-2xl font-bold text-[#2C2825] mb-6 uppercase tracking-widest pr-12">Script History</h2>
              <div className="overflow-y-auto flex-1 pr-2 space-y-4">
                {baybayinHistory.length === 0 ? (
                  <p className="text-[#2C2825]/60 font-bold text-center italic py-8 uppercase tracking-widest">No scripts carved yet.</p>
                ) : (
                  baybayinHistory.map((item, index) => (
                    <div key={index} className="bg-[#F6F5F2] border-[4px] border-[#2C2825] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-4 flex flex-col gap-2 cursor-pointer hover:bg-[#EAE6DF] transition-colors" onClick={() => {
                      setBaybayinInput(item.input);
                      setBaybayinOutput(item.output);
                      setShowBaybayinHistory(false);
                    }}>
                      <span className="text-sm font-bold text-[#2C2825]/60 uppercase tracking-widest">{item.input}</span>
                      <span className="text-4xl text-[#2C2825] text-left" style={{ fontFamily: "'Noto Sans Tagalog', sans-serif" }}>{item.output}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Translator Mode Layout */}
        {appMode === 'translator' && (
          <div className="w-full max-w-md z-10 flex flex-col items-center pt-4 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center relative z-10 w-full mb-12 mt-6">
              <motion.div className="absolute -top-10 -left-6 z-0" animate={{ rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 4 }}>
                 <Daisy />
              </motion.div>
              <h1 className="text-[3.5rem] md:text-[5rem] font-black text-white text-center leading-[0.85] tracking-tighter transform -rotate-3" style={{ textShadow: '1px 1px 0px #1A1A1A, 2px 2px 0px #1A1A1A, 3px 3px 0px #1A1A1A, 4px 4px 0px #1A1A1A, 5px 5px 0px #1A1A1A, 6px 6px 0px #1A1A1A, 7px 7px 0px #1A1A1A, 8px 8px 0px #1A1A1A', WebkitTextStroke: '3px #1A1A1A' }}>
                TAGALOG<br/>TRANSLATOR<br/><span className="text-[#FFE5B4]">SUPREME</span>
              </h1>
            </div>

            {/* Input Box */}
            <div className="w-full space-y-3 z-10 relative mb-8">
              <div className="flex items-center justify-between px-2 mb-2">
                <AnimatePresence mode="wait">
                  <motion.label 
                    key={direction}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    htmlFor="english-input" 
                    className="text-xl font-black text-white tracking-widest uppercase" 
                    style={{ textShadow: '3px 3px 0px #1A1A1A', WebkitTextStroke: '1.5px #1A1A1A' }}
                  >
                    {direction === 'en-tl' ? 'English Word' : 'Tagalog Word'}
                  </motion.label>
                </AnimatePresence>
                <button
                  onClick={handleSwap}
                  className="flex items-center justify-center gap-2 bg-[#FFE5B4] border-[3px] border-[#1A1A1A] rounded-[10px_20px_10px_20px/20px_10px_20px_10px] px-3 py-2 text-sm font-black uppercase hover:bg-[#FFDAB9] active:translate-y-[2px] active:translate-x-[2px] shadow-[3px_3px_0px_0px_#1A1A1A] active:shadow-none transition-all"
                  title="Swap Translation Direction"
                >
                  {direction === 'en-tl' ? (
                    <><UKFlag className="-rotate-3" /> EN <ArrowLeftRight className="w-4 h-4 stroke-[3]" /> <PHFlag className="rotate-3" /> TL</>
                  ) : (
                    <><PHFlag className="-rotate-3" /> TL <ArrowLeftRight className="w-4 h-4 stroke-[3]" /> <UKFlag className="rotate-3" /> EN</>
                  )}
                </button>
              </div>
              <div className="bg-white border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-6 flex items-center relative min-h-[100px]">
                <input
                  id="english-input"
                  type="text"
                  value={englishWord}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEnglishWord(val);
                    setErrorMsg(null);
                    if (val.trim() === '') {
                      setTranslation('');
                      setExample(null);
                      setAudioUrl(null);
                      setExampleAudioUrl(null);
                    }
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
                  className="flex-1 bg-transparent text-3xl font-black italic outline-none placeholder:text-gray-300 min-h-[3rem] text-[#1A1A1A] w-full"
                  placeholder={`e.g. ${currentPlaceholder}`}
                />
                <button 
                  onClick={handleMicClick}
                  className={`w-14 h-14 ml-3 rounded-[15px_225px_15px_255px/255px_15px_225px_15px] border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-shrink-0 items-center justify-center transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none ${isRecording ? 'bg-[#ffcdd2]' : 'bg-[#e8f5e9] hover:bg-[#c8e6c9]'}`}
                  title="Speak to translate"
                >
                  <Mic className="w-7 h-7 stroke-[4] text-[#1A1A1A]" />
                </button>
              </div>
              
              <motion.div className="absolute -bottom-16 -right-4 z-20 pointer-events-none" animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                 <Sparkle />
              </motion.div>
            </div>

            {/* Translate Button */}
            <div className="relative self-center z-10 w-full mb-12 mt-4">
              <button
                onClick={handleTranslate}
                disabled={isLoading || !englishWord.trim()}
                className="w-full bg-white hover:bg-gray-50 text-[#1A1A1A] text-3xl font-black py-5 border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[100px_25px_100px_25px/25px_100px_25px_100px] transition-all duration-150 active:translate-x-[8px] active:translate-y-[8px] active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed min-h-[64px] uppercase tracking-wider flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-10 h-10 animate-spin stroke-[4]" />
                ) : (
                  'Translate!'
                )}
              </button>
              
              {errorMsg && (
                <div className="mt-6 p-4 bg-red-100 border-[4px] border-[#1A1A1A] rounded-xl text-[#1A1A1A] font-black flex items-start gap-3 shadow-[4px_4px_0px_0px_#1A1A1A]">
                  <X className="w-6 h-6 shrink-0 mt-0.5 text-red-500" />
                  <span className="flex-1 uppercase">{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Output Box */}
            {(translation || isLoading) && (
              <div className="w-full space-y-3 z-10 relative mb-12 animate-in fade-in slide-in-from-bottom-6 duration-300">
                <div className="flex items-center justify-between px-2 mb-2">
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={direction}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-xl font-black text-white tracking-widest uppercase" 
                      style={{ textShadow: '3px 3px 0px #1A1A1A', WebkitTextStroke: '1.5px #1A1A1A' }}
                    >
                      {direction === 'en-tl' ? 'Tagalog Translation' : 'English Translation'}
                    </motion.span>
                  </AnimatePresence>
                </div>
                
                <div className="relative">
                  <motion.div className="absolute -left-12 top-10 -z-10" animate={{ rotate: [0, -8, 0], x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 3.5 }}>
                    <Butterfly />
                  </motion.div>
                  
                  <div className="bg-white border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[125px_25px_125px_25px/25px_125px_25px_125px] p-8 flex flex-col items-center justify-center relative min-h-[180px]">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center w-full animate-pulse">
                        <div className="h-12 bg-gray-300 border-[4px] border-[#1A1A1A] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] w-3/4 mb-6 opacity-50"></div>
                        <div className="h-12 bg-gray-300 border-[4px] border-[#1A1A1A] rounded-[15px_225px_15px_255px/255px_15px_225px_15px] w-32 opacity-50"></div>
                      </div>
                    ) : (
                      <>
                        <span className="text-5xl font-black mb-8 text-[#1A1A1A] text-center break-words w-full uppercase tracking-tight">
                          {translation}
                        </span>
                        <div className="flex items-center gap-4 flex-wrap justify-center">
                          <button 
                            onClick={() => handleSpeak(audioUrl)}
                            disabled={!audioUrl}
                            className="flex items-center gap-3 bg-white hover:bg-gray-50 text-[#1A1A1A] px-6 py-3 border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] text-lg font-black uppercase transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-wait min-h-[56px]"
                          >
                            <Volume2 className="w-6 h-6 stroke-[4]" />
                            SPEAK
                          </button>
                          <button
                            onClick={handleCopy}
                            className="flex items-center justify-center w-14 h-14 bg-white hover:bg-gray-50 text-[#1A1A1A] border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-[15px_225px_15px_255px/255px_15px_225px_15px] transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                            title="Copy to clipboard"
                          >
                            {isCopied ? <Check className="w-6 h-6 stroke-[4] text-green-500" /> : <Copy className="w-6 h-6 stroke-[4]" />}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Example Section */}
            {translation && !isLoading && (
              <div className="w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-300">
                {!example && (
                  <button
                    onClick={handleShowExample}
                    disabled={isLoadingExample}
                    className="w-full bg-white hover:bg-gray-50 text-[#1A1A1A] text-xl font-black py-5 px-6 border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[25px_125px_25px_125px/125px_25px_125px_25px] transition-all duration-150 active:translate-x-[8px] active:translate-y-[8px] active:shadow-none disabled:opacity-70 flex items-center justify-center mb-8 min-h-[64px] uppercase"
                  >
                    {isLoadingExample ? (
                      <Loader2 className="w-8 h-8 mr-3 animate-spin stroke-[4]" />
                    ) : null}
                    Example Sentence
                  </button>
                )}

                {example && (
                  <div className="w-full space-y-3 z-10 relative mb-8 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xl font-black text-white tracking-widest uppercase" style={{ textShadow: '3px 3px 0px #1A1A1A', WebkitTextStroke: '1.5px #1A1A1A' }}>
                        Context
                      </span>
                    </div>
                    <div className="bg-white border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[50px] p-8 flex flex-col items-center justify-center relative min-h-[160px]">
                      <p className="text-3xl font-black mb-6 break-words text-[#1A1A1A] text-center w-full leading-tight uppercase">
                        {example.tagalogSentence}
                      </p>
                      <p className="text-xl font-black mb-8 text-[#1A1A1A] text-center w-full bg-gray-50 px-4 py-2 border-[4px] border-[#1A1A1A] rounded-xl transform -rotate-2 shadow-[4px_4px_0px_0px_#1A1A1A]">
                        "{example.englishTranslation}"
                      </p>
                      <div className="flex items-center gap-4 flex-wrap justify-center">
                        <button 
                          onClick={() => handleSpeak(exampleAudioUrl)}
                          disabled={!exampleAudioUrl}
                          className="flex items-center gap-3 bg-white hover:bg-gray-50 text-[#1A1A1A] px-6 py-3 border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-[15px_225px_15px_255px/255px_15px_225px_15px] text-lg font-black uppercase transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-wait min-h-[56px]"
                        >
                          <Volume2 className="w-6 h-6 stroke-[4]" />
                          SPEAK
                        </button>
                        <button
                          onClick={handleCopyExample}
                          className="flex items-center justify-center w-14 h-14 bg-white hover:bg-gray-50 text-[#1A1A1A] border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                          title="Copy to clipboard"
                        >
                          {isExampleCopied ? <Check className="w-6 h-6 stroke-[4] text-green-500" /> : <Copy className="w-6 h-6 stroke-[4]" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Baybayin Mode Layout */}
        {appMode === 'baybayin' && (
          <div className="w-full max-w-md z-10 flex flex-col items-center pt-8 pb-12 animate-in fade-in duration-500 relative">
            
            {/* Background Petroglyphs */}
            <div className="absolute top-0 left-[-60px]"><TribalPetroglyph1 /></div>
            <div className="absolute top-[40%] right-[-70px]"><TribalPetroglyph2 /></div>

            {/* Header */}
            <div className="text-center relative z-10 w-full mb-12">
              <h1 className="text-5xl font-black text-[#2C2825] text-center leading-[0.9] tracking-widest uppercase">
                Baybayin<br/>Script
              </h1>
              <div className="w-24 h-2 bg-[#2C2825] mx-auto mt-6 rounded-full opacity-80"></div>
            </div>

            {/* Input Box */}
            <div className="w-full space-y-3 z-10 relative mb-10">
              <label htmlFor="baybayin-input" className="text-lg font-bold text-[#2C2825] uppercase tracking-[0.2em] px-2 block">
                Enter Word or Name
              </label>
              <div className="bg-transparent border-[8px] border-[#2C2825] p-6 relative">
                <input
                  id="baybayin-input"
                  type="text"
                  value={baybayinInput}
                  onChange={(e) => {
                    setBaybayinInput(e.target.value);
                    setBaybayinOutput('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateBaybayin()}
                  className="flex-1 bg-transparent text-2xl font-bold outline-none placeholder:text-[#2C2825]/40 w-full text-[#2C2825]"
                  placeholder="e.g. malaya"
                />
                {/* Rough corners overlay */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#F6F5F2] border-r-4 border-b-4 border-[#2C2825] transform rotate-45"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#F6F5F2] border-l-4 border-t-4 border-[#2C2825] transform rotate-45"></div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateBaybayin}
              disabled={!baybayinInput.trim()}
              className="w-full bg-[#2C2825] hover:bg-[#1A1815] text-[#F6F5F2] text-2xl font-bold py-6 border-4 border-transparent active:border-[#2C2825] active:bg-transparent active:text-[#2C2825] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mb-12 uppercase tracking-widest"
            >
              GENERATE CHARACTERS!
            </button>

            {/* Output Box */}
            {baybayinOutput && (
              <div className="w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-300">
                <div ref={baybayinRef} className="bg-[#F6F5F2] border-[8px] border-[#2C2825] p-10 flex flex-col items-center justify-center relative min-h-[200px]">
                  <span className="text-7xl mb-10 text-[#2C2825] text-center break-words w-full" style={{ fontFamily: "'Noto Sans Tagalog', sans-serif" }}>
                    {baybayinOutput}
                  </span>
                  
                  {/* Rough corners overlay */}
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#F6F5F2] border-l-8 border-b-8 border-[#2C2825] transform -rotate-12"></div>
                  <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#F6F5F2] border-r-8 border-t-8 border-[#2C2825] transform -rotate-12"></div>
                </div>
                
                <div className="flex flex-col gap-3 mt-6">
                  <button
                    onClick={handleCopyBaybayin}
                    className="flex items-center gap-3 bg-transparent hover:bg-[#2C2825] hover:text-[#F6F5F2] text-[#2C2825] px-6 py-4 border-4 border-[#2C2825] text-lg font-bold uppercase transition-colors duration-150 tracking-wider w-full justify-center"
                  >
                    {isBaybayinCopied ? <Check className="w-6 h-6 stroke-[3]" /> : <Copy className="w-6 h-6 stroke-[3]" />}
                    {isBaybayinCopied ? 'COPIED!' : 'COPY CHARACTERS'}
                  </button>
                  <button
                    onClick={handleDownloadImage}
                    className="flex items-center gap-3 bg-transparent hover:bg-[#2C2825] hover:text-[#F6F5F2] text-[#2C2825] px-6 py-4 border-4 border-[#2C2825] text-lg font-bold uppercase transition-colors duration-150 tracking-wider w-full justify-center"
                  >
                    <Download className="w-6 h-6 stroke-[3]" />
                    SAVE AS IMAGE
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
