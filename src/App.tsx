import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Loader2, Copy, Check, History, X, ArrowLeftRight, Download, Lightbulb, Camera } from 'lucide-react'; // Added Camera
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import SupremeLens from './SupremeLens'; // Added SupremeLens component

// Character Components
const Sampaguita = () => (
  <motion.svg width="120" height="120" viewBox="0 0 100 100"
    animate={{ rotate: [0, 5, -5, 0], scale: [0.98, 1.05, 0.98] }}
    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    className="overflow-visible"
  >
    {/* Petals */}
    <g fill="#FFF" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round">
      {[0, 72, 144, 216, 288].map(angle => (
        <path key={angle} d="M 50 50 C 15 -15, 85 -15, 50 50" style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }} />
      ))}
    </g>
    
    {/* Spikes / Stamen */}
    <g stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round">
      {[36, 108, 180, 252, 324].map(angle => (
        <line key={angle} x1="50" y1="50" x2="50" y2="20" style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }} />
      ))}
    </g>

    {/* Center Face */}
    <circle cx="50" cy="50" r="18" fill="#FFF" stroke="#1A1A1A" strokeWidth="4" />
    
    {/* Blushes */}
    <circle cx="38" cy="53" r="3" fill="#FFB6C1" />
    <circle cx="62" cy="53" r="3" fill="#FFB6C1" />
    
    {/* Eyes */}
    <ellipse cx="43" cy="47" rx="3.5" ry="5.5" fill="#1A1A1A" />
    <ellipse cx="57" cy="47" rx="3.5" ry="5.5" fill="#1A1A1A" />
    
    {/* Eye Highlights */}
    <circle cx="42" cy="45" r="1.5" fill="#FFF" />
    <circle cx="56" cy="45" r="1.5" fill="#FFF" />
    
    {/* Smile */}
    <path d="M 41 55 Q 50 63 59 55" fill="none" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" />
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
    <path d="M 48 35 Q 40 20 35 25 M 52 35 Q 60 20 65 25" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </motion.svg>
);

const CartoonCamera = () => (
  <motion.svg width="90" height="90" viewBox="0 0 100 100"
    whileHover={{ scale: 1.05, rotate: 3 }}
    whileTap={{ scale: 0.95, rotate: -5 }}
    className="overflow-visible"
  >
    {/* Red Shutter Button */}
    <path d="M 22 42 L 34 38 L 32 33 L 20 37 Z" fill="#EF4444" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round" />
    
    {/* Camera Body */}
    <path d="M 16 46 C 16 42, 28 38, 38 34 C 44 28, 52 28, 58 34 C 68 38, 84 42, 84 46 C 88 60, 86 74, 80 78 C 70 84, 30 84, 20 78 C 12 74, 12 60, 16 46 Z" fill="#2C2825" stroke="#1A1A1A" strokeWidth="5" strokeLinejoin="round" />
    
    {/* Yellow Flash */}
    <rect x="68" y="48" width="6" height="4" rx="2" fill="#EAB308" />
    
    {/* Lens Outer Grey Ring */}
    <circle cx="48" cy="58" r="20" fill="#6B7280" stroke="#1A1A1A" strokeWidth="4" />
    
    {/* Lens Inner Blue Glass */}
    <circle cx="48" cy="58" r="14" fill="#38BDF8" stroke="#1A1A1A" strokeWidth="3" />
    
    {/* Glass Glare / Scribbles */}
    <path d="M 40 52 C 45 49, 52 52, 54 54" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    <path d="M 38 58 C 42 56, 48 59, 48 59" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
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
  <svg width="100" height="150" viewBox="0 0 100 150" className="text-[#2C2825] opacity-15">
    {/* Wave & Sun Motif */}
    <path d="M 20 40 L 35 55 L 50 40 L 65 55 L 80 40 M 20 55 L 35 70 L 50 55 L 65 70 L 80 55" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="50" cy="100" r="12" fill="none" stroke="currentColor" strokeWidth="4" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
      <line key={angle} x1="50" y1="80" x2="50" y2="72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ transformOrigin: '50px 100px', transform: `rotate(${angle}deg)` }} />
    ))}
    <path d="M 40 10 L 50 20 L 60 10 M 50 20 L 50 30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TribalPetroglyph2 = () => (
  <svg width="80" height="180" viewBox="0 0 80 180" className="text-[#2C2825] opacity-15">
    {/* Centipede (Alupihan) & Diamond Motif */}
    <path d="M 40 20 L 25 35 M 40 20 L 55 35 M 40 35 L 25 50 M 40 35 L 55 50 M 40 50 L 25 65 M 40 50 L 55 65 M 40 20 L 40 65" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 40 90 L 55 105 L 40 120 L 25 105 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    <circle cx="40" cy="105" r="4" fill="currentColor" />
    <path d="M 30 140 L 40 130 L 50 140 M 30 155 L 40 145 L 50 155 M 30 170 L 40 160 L 50 170 M 40 130 L 40 170" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- Baybayin Converter Logic ---
const toBaybayin = (text: string) => {
  if (!text) return "";
  let str = text.toLowerCase();
  str = str.replace(/f/g, 'p').replace(/v/g, 'b').replace(/z/g, 's').replace(/j/g, 'dy').replace(/c/g, 'k').replace(/x/g, 'ks').replace(/q/g, 'k');
  const vowels: Record<string, string> = { 'a': '\u1700', 'e': '\u1701', 'i': '\u1701', 'o': '\u1702', 'u': '\u1702' };
  const consonants: Record<string, string> = { 'k': '\u1703', 'g': '\u1704', 'ng': '\u1705', 't': '\u1706', 'd': '\u1707', 'r': '\u1707', 'n': '\u1708', 'p': '\u1709', 'b': '\u170A', 'm': '\u170B', 'y': '\u170C', 'l': '\u170E', 'w': '\u170F', 's': '\u1710', 'h': '\u1711' };
  let result = ""; let i = 0;
  while (i < str.length) {
    let char = str[i];
    let nextChar = str[i + 1]; let twoChar = char + (nextChar || "");

    if (twoChar === 'ng' && consonants['ng']) {
      let third = str[i + 2];
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
      } else { result += consonants[char] + '\u1714'; i += 1;
      }
    } else if (vowels[char]) { result += vowels[char]; i += 1;
    }
    else { result += char; i += 1; }
  }
  return result;
};

export default function App() {
  // App Mode State
  const [appMode, setAppMode] = useState<'translator' | 'baybayin'>('translator');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextMode, setNextMode] = useState<'translator' | 'baybayin'>('translator');

  // Lens State (Added for Supreme Lens)
  const [isLensOpen, setIsLensOpen] = useState(false);

  // Translator States
  const [englishWord, setEnglishWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fun Fact States
  const [funFact, setFunFact] = useState<string | null>(null);
  const [isLoadingFunFact, setIsLoadingFunFact] = useState(false);

  const [example, setExample] = useState<{ tagalogSentence?: string; englishTranslation?: string } | null>(null);
  const [isLoadingExample, setIsLoadingExample] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [exampleAudioUrl, setExampleAudioUrl] = useState<string | null>(null);

  const [isCopied, setIsCopied] = useState(false);
  const [isExampleCopied, setIsExampleCopied] = useState(false);

  const [history, setHistory] = useState<{ english: string, tagalog: string, direction?: 'en-tl' | 'tl-en' }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [direction, setDirection] = useState<'en-tl' | 'tl-en'>('en-tl');
  const [inputMode, setInputMode] = useState<'word' | 'conversation'>('word');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [exampleCooldown, setExampleCooldown] = useState<number | null>(null);

  // Baybayin States
  const [baybayinMode, setBaybayinMode] = useState<'encode' | 'decode'>('encode');
  const [decodeTarget, setDecodeTarget] = useState<'TL' | 'EN'>('TL');
  const [decodedCache, setDecodedCache] = useState<{TL?: string, EN?: string}>({});
  const [isDecoding, setIsDecoding] = useState(false);

  const [baybayinInput, setBaybayinInput] = useState('');
  const [baybayinOutput, setBaybayinOutput] = useState('');
  const [isBaybayinCopied, setIsBaybayinCopied] = useState(false);

  const [baybayinHistory, setBaybayinHistory] = useState<{ input: string, output: string }[]>([]);
  const [showBaybayinHistory, setShowBaybayinHistory] = useState(false);

  const englishSuggestions = ['hello', 'how are you?', 'thank you', 'good morning', 'I love you'];
  const tagalogSuggestions = ['kumusta', 'salamat', 'magandang umaga', 'mahal kita', 'paalam'];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (exampleCooldown === null || exampleCooldown <= 0) return;
    const timer = setTimeout(() => setExampleCooldown(prev => (prev ?? 1) - 1), 1000);
    return () => clearTimeout(timer);
  }, [exampleCooldown]);

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
    setEnglishWord(''); // New strict clear
    setTranslation('');
    setExample(null);
    setFunFact(null);
    setAudioUrl(null);
    setExampleAudioUrl(null);
    setErrorMsg(null);
  };

  const handleInputModeChange = (mode: 'word' | 'conversation') => {
    if (mode === inputMode) return;
    setInputMode(mode);
    setEnglishWord('');
    setTranslation('');
    setExample(null);
    setFunFact(null);
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

  const handleDecodeBaybayin = async (targetOverride?: 'TL' | 'EN') => {
    if (!baybayinInput.trim()) return;

    const target = targetOverride || decodeTarget;
    if (targetOverride) setDecodeTarget(target);

    if (decodedCache[target]) {
      setBaybayinOutput(decodedCache[target]!);
      return;
    }

    setIsDecoding(true);
    setBaybayinOutput('');
    try {
      const direction = target === 'TL' ? 'bay-tl' : 'bay-en';
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: baybayinInput, direction })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.translation) {
        setDecodedCache(prev => ({ ...prev, [target]: data.translation }));
        setBaybayinOutput(data.translation);
        if (!targetOverride) {
          setBaybayinHistory(prev => [{ input: baybayinInput, output: data.translation }, ...prev]);
        }
      }
    } catch (error: any) {
      console.error('Decode error:', error);
      if (error.message === 'server_busy') {
         setBaybayinOutput("ORACLE OVERLOADED: GOOGLE SERVERS BUSY. PLEASE TRY AGAIN LATER.");
      } else if (error.message === 'rate_limited') {
         setBaybayinOutput("Error: Rate Limited");
      } else {
         setBaybayinOutput("Error communicating with the oracle.");
      }
    } finally {
      setIsDecoding(false);
    }
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
      console.error('Failed to copy text', err);
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

  const fetchFunFact = async (english: string, tagalog: string) => {
    setIsLoadingFunFact(true);
    setFunFact(null);
    try {
      const res = await fetch('/api/funfact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ englishWord: english, tagalogWord: tagalog })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.fact) setFunFact(data.fact);
      }
    } catch (err) {
      console.error('Fun fact fetch failed', err);
    } finally {
      setIsLoadingFunFact(false);
    }
  };

  const handleTranslate = async () => {
    if (!englishWord.trim()) return;

    setIsLoading(true);
    setTranslation('');
    setExample(null);
    setFunFact(null);
    setAudioUrl(null);
    setExampleAudioUrl(null);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: englishWord, direction, inputMode }),
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
        
        prefetchAudio(data.translation, setAudioUrl, direction === 'en-tl' ? 'fil-PH' : 'en-US');
        fetchFunFact(englishWord, data.translation); 
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

    recognition.onstart = () => { setIsRecording(true); };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setEnglishWord(transcript);
    };
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };
    recognition.onend = () => { setIsRecording(false); };

    recognition.start();
  };

  const handleShowExample = async () => {
    if (!translation || exampleCooldown) return;
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

      if (response.status === 429) {
        const data = await response.json();
        setExampleCooldown(data.retryAfter ?? 60);
        return;
      }

      if (!response.ok) throw new Error(`Server returned ${response.status}`);
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
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&family=Permanent+Marker&family=Knewave&family=Neucha&display=swap');
          .font-title { font-family: 'Permanent Marker', cursive; }
          .font-box { font-family: 'Gloria Hallelujah', cursive; }
          .font-tribal-title { font-family: 'Knewave', cursive; }
          .font-tribal-text { font-family: 'Neucha', cursive; }
        `}
      </style>
      
      {/* Loading Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${nextMode === 'baybayin' ? 'bg-[#12100E]' : 'bg-[#EEF2FF]'}`}
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
                  className="font-tribal-title text-2xl tracking-[0.2em] opacity-80"
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
        className={`min-h-[100dvh] font-sans p-6 pb-[calc(4.5rem+env(safe-area-inset-bottom))] flex flex-col items-center justify-start overflow-x-hidden relative ${appMode === 'translator' ? 'text-[#1A1A1A] selection:bg-[#93C5FD]' : 'text-[#2C2825] selection:bg-[#D4C3A3]'}`}
        style={appMode === 'translator'
          ? { backgroundColor: '#EEF2FF', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0zM20 20h20v20H20z\' fill=\'%23E0E7FF\' fill-opacity=\'0.6\'/%3E%3C/svg%3E")' }
          : { backgroundColor: '#F6F5F2', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'240\' height=\'240\' viewBox=\'0 0 240 240\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg stroke=\'%232C2825\' stroke-width=\'2\' fill=\'none\' stroke-linecap=\'round\' stroke-linejoin=\'round\' opacity=\'0.06\'%3E%3Ccircle cx=\'120\' cy=\'120\' r=\'12\'/%3E%3Cpath d=\'M 120 100 L 120 92 M 120 140 L 120 148 M 100 120 L 92 120 M 140 120 L 148 120\' stroke-width=\'3\'/%3E%3Cpath d=\'M 106 106 L 98 98 M 134 134 L 142 142 M 106 134 L 98 142 M 134 106 L 142 98\' stroke-width=\'2\'/%3E%3Cpath d=\'M 110 70 L 120 80 L 130 70 M 110 60 L 120 70 L 130 60 M 110 50 L 120 60 L 130 50\'/%3E%3Cpath d=\'M 110 170 L 120 160 L 130 170 M 110 180 L 120 170 L 130 180 M 110 190 L 120 180 L 130 190\'/%3E%3Cpath d=\'M 40 100 L 50 110 L 40 120 L 30 110 Z\'/%3E%3Cpath d=\'M 40 130 L 50 140 L 40 150 L 30 140 Z\'/%3E%3Cpath d=\'M 25 80 L 35 90 L 45 80 L 55 90 M 25 90 L 35 100 L 45 90 L 55 100\'/%3E%3Cpath d=\'M 200 100 L 210 110 L 200 120 L 190 110 Z\'/%3E%3Cpath d=\'M 200 130 L 210 140 L 200 150 L 190 140 Z\'/%3E%3Cpath d=\'M 185 80 L 195 90 L 205 80 L 215 90 M 185 90 L 195 100 L 205 90 L 215 100\'/%3E%3Ccircle cx=\'120\' cy=\'30\' r=\'1.5\' fill=\'%232C2825\'/%3E%3Ccircle cx=\'120\' cy=\'210\' r=\'1.5\' fill=\'%232C2825\'/%3E%3Ccircle cx=\'40\' cy=\'60\' r=\'1.5\' fill=\'%232C2825\'/%3E%3Ccircle cx=\'200\' cy=\'190\' r=\'1.5\' fill=\'%232C2825\'/%3E%3C/g%3E%3C/svg%3E"), url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")' }
        }
      >

        {/* Top Controls */}
        <div className="w-full max-w-4xl flex justify-between items-center z-40 mb-2 relative">
          <button
            onClick={() => handleModeSwitch(appMode === 'translator' ? 'baybayin' : 'translator')}
            className={`flex items-center justify-center w-12 h-12 transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none rounded-[255px_15px_225px_15px/15px_225px_15px_255px] ${appMode === 'translator'
              ? 'bg-[#1A1A1A] border-[4px] border-[#1A1A1A] text-[#FED141] shadow-[4px_4px_0px_0px_#0032A0] hover:bg-gray-800'
              : 'bg-[#F6F5F2] border-[4px] border-[#2C2825] text-[#2C2825] shadow-[4px_4px_0px_0px_#2C2825] hover:bg-[#EAE6DF]'
              }`}
            title={appMode === 'translator' ? 'Reveal the past...' : 'Return to translator'}
          >
            {appMode === 'translator' ? (
              <svg width="26" height="26" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 50 15 Q 60 35 85 50 Q 60 65 50 85 Q 40 65 15 50 Q 40 35 50 15 Z" />
                <circle cx="50" cy="50" r="8" fill="currentColor" />
                <path d="M 30 30 Q 35 35 40 40" />
                <path d="M 70 30 Q 65 35 60 40" />
                <path d="M 30 70 Q 35 65 40 60" />
                <path d="M 70 70 Q 65 65 60 60" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
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
                      setFunFact(null);
                      setAudioUrl(null);
                      setExampleAudioUrl(null);
                    }}>
                      <span className="text-sm font-black text-gray-500 uppercase">{item.direction === 'tl-en' ? 'Tagalog' : 'English'}: {item.english}</span>
                      <span className="text-xl font-box text-[#1A1A1A]">{item.tagalog}</span>
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
              <h2 className="text-2xl font-tribal-title text-[#2C2825] mb-6 uppercase tracking-wider pr-12">Script History</h2>
              <div className="overflow-y-auto flex-1 pr-2 space-y-4">
                {baybayinHistory.length === 0 ? (
                  <p className="text-[#2C2825]/60 font-tribal-text text-xl text-center italic py-8 uppercase tracking-widest">No scripts carved yet.</p>
                ) : (
                  baybayinHistory.map((item, index) => (
                    <div key={index} className="bg-[#F6F5F2] border-[4px] border-[#2C2825] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-4 flex flex-col gap-2 cursor-pointer hover:bg-[#EAE6DF] transition-colors" onClick={() => {
                      setBaybayinInput(item.input);
                      setBaybayinOutput(item.output);
                      setShowBaybayinHistory(false);
                    }}>
                      <span className="text-lg font-tribal-text text-[#2C2825]/60 uppercase tracking-widest">{item.input}</span>
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
            <div className="w-full flex flex-col items-center justify-center relative mb-12 mt-6 select-none">
              <div className="relative inline-block transform -rotate-3 text-center">
                <div className="absolute -top-14 -left-4 sm:-top-20 sm:-left-8 z-0 pointer-events-none">
                  <Sampaguita />
                </div>
                <h1 
                  className="text-[2.9rem] sm:text-[4rem] md:text-[5.5rem] font-title leading-[1.05] tracking-normal sm:tracking-wide relative z-10" 
                  style={{ 
                    filter: 'drop-shadow(6px 6px 0px #1A1A1A)',
                    WebkitTextStroke: '3px #1A1A1A'
                  }}
                >
                  <span className="text-[#0032A0]">TAGALOG</span><br />
                  <span className="text-[#BF0D3E]">TRANSLATOR</span><br />
                  <span className="text-[#FED141]">SUPREME</span>
                </h1>
              </div>
            </div>

            {/* Input Box */}
            <div className="w-full space-y-3 z-10 relative mb-8">
              <div className="flex bg-[#F6F5F2] border-[4px] border-[#1A1A1A] rounded-[15px_225px_15px_255px/255px_15px_225px_15px] p-1 mb-4 shadow-[4px_4px_0px_0px_#1A1A1A] self-start z-10 w-full sm:w-auto">
                <button onClick={() => handleInputModeChange('word')} className={`flex-1 px-4 py-2 text-sm font-black uppercase rounded-lg transition-colors ${inputMode === 'word' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A] hover:bg-gray-200'}`}>Word</button>
                <button onClick={() => handleInputModeChange('conversation')} className={`flex-1 px-4 py-2 text-sm font-black uppercase rounded-lg transition-colors ${inputMode === 'conversation' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A] hover:bg-gray-200'}`}>Conversation</button>
              </div>
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
                <textarea
                  id="english-input"
                  value={englishWord}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (inputMode === 'conversation' && val.length > 500) return;
                    setEnglishWord(val);
                    setErrorMsg(null);
                    if (val.trim() === '') {
                      setTranslation('');
                      setExample(null);
                      setFunFact(null);
                      setAudioUrl(null);
                      setExampleAudioUrl(null);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleTranslate();
                    }
                  }}
                  className={`flex-1 bg-transparent outline-none placeholder:text-gray-300 w-full text-[#1A1A1A] resize-none transition-all duration-300 ${inputMode === 'conversation' ? 'min-h-[120px] text-lg font-sans font-bold leading-relaxed' : 'min-h-[3rem] text-2xl font-box overflow-hidden'}`}
                  placeholder={inputMode === 'conversation' ? 'Type a full sentence or paragraph here...' : `e.g. ${currentPlaceholder}`}
                />
                {inputMode === 'conversation' && <span className="absolute bottom-2 right-24 text-xs font-black text-gray-400">{englishWord.length}/500</span>}
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
                        <div className="h-12 bg-gray-300 border-[4px] border-[#15px_225px_15px_255px/255px_15px_225px_15px] w-32 opacity-50"></div>
                      </div>
                    ) : (
                      <>
                        <div className={`w-full ${inputMode === 'conversation' ? 'max-h-[250px] overflow-y-auto pr-4 mb-6' : 'mb-8'}`}>
                          <span className={`${inputMode === 'conversation' ? 'text-lg md:text-xl font-sans font-bold normal-case text-left block' : 'text-3xl md:text-4xl font-box uppercase text-center'} text-[#1A1A1A] break-words w-full`}>
                            {translation}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap justify-center">
                          {inputMode === 'word' && (
                            <button
                              onClick={() => handleSpeak(audioUrl)}
                              disabled={!audioUrl}
                              className="flex items-center gap-3 bg-white hover:bg-gray-50 text-[#1A1A1A] px-6 py-3 border-[5px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] text-lg font-black uppercase transition-all duration-150 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-wait min-h-[56px]"
                            >
                              <Volume2 className="w-6 h-6 stroke-[4]" />
                              SPEAK
                            </button>
                          )}
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

            {/* Fun Fact Card */}
            {inputMode === 'word' && (funFact || isLoadingFunFact) && !isLoading && (
              <div className="w-full z-10 relative mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#FFE5B4] border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-6 pt-8 relative transform -rotate-1">
                  <span className="absolute -top-4 left-6 bg-[#1A1A1A] text-[#FFE5B4] text-sm font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-[2px_2px_0px_0px_#FFE5B4] flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 stroke-[3]" /> DID YOU KNOW?
                  </span>
                  {isLoadingFunFact ? (
                    <div className="animate-pulse space-y-2 mt-2">
                      <div className="h-3.5 bg-[#1A1A1A]/20 rounded-full w-full"></div>
                      <div className="h-3.5 bg-[#1A1A1A]/20 rounded-full w-5/6"></div>
                      <div className="h-3.5 bg-[#1A1A1A]/20 rounded-full w-3/4"></div>
                    </div>
                  ) : (
                    <p className="text-xl font-box text-[#1A1A1A] leading-snug">
                      {funFact}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Example Section */}
            {inputMode === 'word' && translation && !isLoading && (
              <div className="w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-300">

                {/* Cooldown UI or normal button */}
                {!example && (
                  exampleCooldown ? (
                    <div className="w-full bg-white border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[25px_125px_25px_125px/125px_25px_125px_25px] p-6 mb-8 flex flex-col items-center gap-2 text-center">
                      <span className="text-5xl font-black text-[#1A1A1A]">⏳ {exampleCooldown}s</span>
                      <p className="text-lg font-black text-[#1A1A1A] uppercase tracking-tight leading-tight">
                        Sentence examples on cooldown!
                      </p>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                        You can keep translating words in the meantime ✌️
                      </p>
                    </div>
                  ) : (
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
                  )
                )}

                {example && (
                  <div className="w-full space-y-3 z-10 relative mb-8 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xl font-black text-white tracking-widest uppercase" style={{ textShadow: '3px 3px 0px #1A1A1A', WebkitTextStroke: '1.5px #1A1A1A' }}>
                        Context
                      </span>
                    </div>
                    <div className="bg-white border-[6px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] rounded-[50px] p-8 flex flex-col items-center justify-center relative min-h-[160px]">
                      <p className="text-2xl font-box mb-6 break-words text-[#1A1A1A] text-center w-full leading-tight uppercase">
                        {example.tagalogSentence}
                      </p>
                      <p className="text-xl font-box mb-8 text-[#1A1A1A] text-center w-full bg-gray-50 px-4 py-2 border-[4px] border-[#1A1A1A] rounded-xl transform -rotate-2 shadow-[4px_4px_0px_0px_#1A1A1A]">
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
            <div className="text-center relative z-10 w-full mb-12 flex flex-col items-center">
              <div className="flex items-center gap-4 mb-2 opacity-90">
                <div className="w-6 h-1.5 bg-[#2C2825] rounded-sm"></div>
                <span className="font-tribal-text text-xl md:text-2xl tracking-[0.3em] uppercase text-[#2C2825] font-black">
                  Sinaunang
                </span>
                <div className="w-6 h-1.5 bg-[#2C2825] rounded-sm"></div>
              </div>

              <h1 className="text-[4rem] md:text-[5rem] font-tribal-title text-[#F6F5F2] text-center leading-[1] tracking-wider uppercase mb-1" 
                  style={{ 
                    WebkitTextStroke: '2px #2C2825', 
                    filter: 'drop-shadow(6px 6px 0px #2C2825)' 
                  }}>
                Baybayin
              </h1>

              <div className="flex items-center gap-4 mt-4 opacity-90">
                <div className="w-10 h-1 bg-[#2C2825] rounded-sm"></div>
                <span className="font-tribal-text text-lg md:text-xl tracking-[0.2em] uppercase text-[#2C2825] font-bold">
                  Script Generator
                </span>
                <div className="w-10 h-1 bg-[#2C2825] rounded-sm"></div>
              </div>

              {/* Mode Toggle */}
              <div className="flex mt-8 bg-transparent border-[4px] border-[#2C2825] p-1 rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
                <button 
                  onClick={() => { setBaybayinMode('encode'); setBaybayinOutput(''); setDecodedCache({}); }}
                  className={`px-4 py-2 font-tribal-text font-bold uppercase tracking-widest transition-colors rounded-xl ${baybayinMode === 'encode' ? 'bg-[#2C2825] text-[#F6F5F2]' : 'text-[#2C2825] hover:bg-[#2C2825]/10'}`}
                >
                  CARVE (To Baybayin)
                </button>
                <button 
                  onClick={() => { setBaybayinMode('decode'); setBaybayinOutput(''); setDecodedCache({}); }}
                  className={`px-4 py-2 font-tribal-text font-bold uppercase tracking-widest transition-colors rounded-xl ${baybayinMode === 'decode' ? 'bg-[#2C2825] text-[#F6F5F2]' : 'text-[#2C2825] hover:bg-[#2C2825]/10'}`}
                >
                  DECODE (From Baybayin)
                </button>
              </div>
            </div>

            {/* Input Box */}
            <div className="w-full space-y-3 z-10 relative mb-10">
              <label htmlFor="baybayin-input" className="text-2xl font-tribal-text text-[#2C2825] uppercase tracking-[0.1em] px-2 block font-bold">
                {baybayinMode === 'decode' ? 'Paste Baybayin Characters' : 'Enter Word or Name'}
              </label>
              <div className="bg-transparent border-[8px] border-[#2C2825] p-6 relative">
                <input
                  id="baybayin-input"
                  type="text"
                  value={baybayinInput}
                  onChange={(e) => {
                    setBaybayinInput(e.target.value);
                    setBaybayinOutput('');
                    setDecodedCache({});
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && (baybayinMode === 'decode' ? handleDecodeBaybayin() : handleGenerateBaybayin())}
                  className="flex-1 bg-transparent text-3xl font-tribal-text font-bold outline-none placeholder:text-[#2C2825]/40 w-full text-[#2C2825]"
                  placeholder={baybayinMode === 'decode' ? 'e.g. \u170E\u1700\u170C\u1700' : 'e.g. malaya'}
                />
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#F6F5F2] border-r-4 border-b-4 border-[#2C2825] transform rotate-45"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#F6F5F2] border-l-4 border-t-4 border-[#2C2825] transform rotate-45"></div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={() => baybayinMode === 'decode' ? handleDecodeBaybayin() : handleGenerateBaybayin()}
              disabled={!baybayinInput.trim() || isDecoding}
              className="w-full bg-[#2C2825] hover:bg-[#1A1815] text-[#F6F5F2] text-3xl font-tribal-text font-bold py-6 border-4 border-transparent active:border-[#2C2825] active:bg-transparent active:text-[#2C2825] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mb-12 uppercase tracking-widest flex items-center justify-center"
            >
              {isDecoding ? <Loader2 className="w-8 h-8 mr-3 animate-spin stroke-[4]" /> : null}
              {baybayinMode === 'decode' ? 'DECODE SCRIPT!' : 'Generate Characters!'}
            </button>

            {/* Output Box */}
            {baybayinOutput && (
              <div className="w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-300">
                <div ref={baybayinRef} className="bg-[#F6F5F2] border-[8px] border-[#2C2825] p-10 flex flex-col items-center justify-center relative min-h-[200px]">
                  
                  {baybayinMode === 'decode' && (
                    <div className="absolute top-4 border-[4px] border-[#2C2825] shadow-[4px_4px_0px_#2C2825] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] flex p-1 mb-6">
                      {['TL', 'EN'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => handleDecodeBaybayin(lang as 'TL' | 'EN')}
                          className={`px-4 py-1.5 rounded-xl font-tribal-text font-bold text-lg tracking-widest transition-all ${decodeTarget === lang
                            ? 'bg-[#2C2825] text-[#F6F5F2]'
                            : 'text-[#2C2825] hover:bg-[#2C2825]/10'
                            }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* DO NOT TOUCH: The actual Baybayin text MUST remain Noto Sans Tagalog */}
                  {baybayinMode === 'encode' ? (
                    <span className="text-7xl mb-10 text-[#2C2825] text-center break-words w-full" style={{ fontFamily: "'Noto Sans Tagalog', sans-serif" }}>
                      {baybayinOutput}
                    </span>
                  ) : (
                    <span className="text-4xl mt-12 mb-10 text-[#2C2825] text-center break-words w-full font-tribal-text tracking-widest uppercase font-bold">
                      {baybayinOutput}
                    </span>
                  )}

                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#F6F5F2] border-l-8 border-b-8 border-[#2C2825] transform -rotate-12"></div>
                  <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#F6F5F2] border-r-8 border-t-8 border-[#2C2825] transform -rotate-12"></div>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  <button
                    onClick={handleCopyBaybayin}
                    className="flex items-center gap-3 bg-transparent hover:bg-[#2C2825] hover:text-[#F6F5F2] text-[#2C2825] px-6 py-4 border-4 border-[#2C2825] text-xl font-tribal-text font-bold uppercase transition-colors duration-150 tracking-wider w-full justify-center"
                  >
                    {isBaybayinCopied ? <Check className="w-6 h-6 stroke-[3]" /> : <Copy className="w-6 h-6 stroke-[3]" />}
                    {isBaybayinCopied ? 'COPIED!' : 'COPY CHARACTERS'}
                  </button>
                  <button
                    onClick={handleDownloadImage}
                    className="flex items-center gap-3 bg-transparent hover:bg-[#2C2825] hover:text-[#F6F5F2] text-[#2C2825] px-6 py-4 border-4 border-[#2C2825] text-xl font-tribal-text font-bold uppercase transition-colors duration-150 tracking-wider w-full justify-center"
                  >
                    <Download className="w-6 h-6 stroke-[3]" />
                    SAVE AS IMAGE
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Action Button - Fixed bottom center (Standalone Cartoon Lens) */}
        <div className="absolute bottom-6 left-0 w-full flex justify-center z-40 pointer-events-none">
          <button 
            onClick={() => setIsLensOpen(true)}
            className="pointer-events-auto cursor-pointer drop-shadow-[4px_4px_0px_#1A1A1A] hover:drop-shadow-[6px_6px_0px_#1A1A1A] active:drop-shadow-[0px_0px_0px_#1A1A1A] transition-all duration-150 outline-none bg-transparent border-none p-0"
            title="Supreme Lens"
          >
            <CartoonCamera />
          </button>
        </div>

        {/* Mount Supreme Lens Overlay */}
        <AnimatePresence>
          {isLensOpen && <SupremeLens onClose={() => setIsLensOpen(false)} />}
        </AnimatePresence>

      </div>
    </>
  );
}