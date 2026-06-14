import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Sparkles, Check, RotateCcw, Upload, Image, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['Water', 'Electricity', 'Cleaning', 'Security', 'Internet', 'Lift Issue'];

// Keyword mapping for smart parsing
const keywordCategoryMap = {
  Water: ['water', 'leak', 'pipe', 'plumb', 'tap', 'overflow', 'drain', 'toilet', 'flush', 'basin', 'dripping', 'sewage'],
  Electricity: ['electricity', 'power', 'light', 'bulb', 'spark', 'fuse', 'shock', 'fan', 'wire', 'short', 'current', 'blackout', 'switch', 'socket'],
  Cleaning: ['clean', 'sweep', 'dirty', 'garbage', 'trash', 'litter', 'dump', 'stink', 'smell', 'corridor', 'lobby', 'dustbin', 'sweep', 'broom'],
  Security: ['guard', 'gate', 'watchman', 'security', 'camera', 'lock', 'trespass', 'thief', 'intruder', 'fight', 'parking', 'stranger', 'patrol'],
  Internet: ['internet', 'wifi', 'router', 'network', 'fiber', 'slow', 'disconnected', 'broadband', 'cable', 'modem'],
  'Lift Issue': ['lift', 'elevator', 'escalator', 'stuck', 'button', 'floor', 'gate lock', 'liftman', 'basement']
};

export default function VoiceRecorder({ isOpen, onClose, onSubmit }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [step, setStep] = useState('listening'); // 'listening' | 'review'
  const [errorMsg, setErrorMsg] = useState('');

  // Form states for review step
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Water');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg('Web Speech API is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      setErrorMsg('');
    };

    rec.onerror = (e) => {
      console.error(e);
      if (e.error === 'not-allowed') {
        setErrorMsg('Microphone access is blocked. Please enable it in browser settings.');
      } else {
        setErrorMsg('An error occurred during speech recognition.');
      }
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setInterimTranscript(interim);
      if (final) {
        setTranscript((prev) => (prev + ' ' + final).trim());
      }
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Handle start/stop
  const toggleListening = () => {
    if (errorMsg && errorMsg.includes('not supported')) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      setInterimTranscript('');
      setErrorMsg('');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Run smart parsing when user stops listening and decides to review
  const handleProcessTranscript = () => {
    const fullText = (transcript + ' ' + interimTranscript).trim();
    if (!fullText) {
      toast.error('No speech detected. Please try speaking again.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    }

    // 1. Detect Category based on keywords
    let detectedCategory = 'Water'; // default
    let maxMatches = 0;
    const lowerText = fullText.toLowerCase();

    Object.entries(keywordCategoryMap).forEach(([cat, keywords]) => {
      const matches = keywords.filter((kw) => lowerText.includes(kw)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedCategory = cat;
      }
    });

    // 2. Generate a clean Title
    // Clean filler prefixes
    let cleanText = fullText
      .replace(/^(please|there is|i want to|can you|we have|our|my|issue with|problem with|reporting|report)\s+/gi, '')
      .replace(/^(a|an|the)\s+/gi, '');

    // Capitalize first letter
    cleanText = cleanText.charAt(0).toUpperCase() + cleanText.slice(1);

    // Grab first few words for the title
    const words = cleanText.split(' ');
    let generatedTitle = words.slice(0, 4).join(' ');
    if (words.length > 4) {
      generatedTitle += '...';
    }

    if (generatedTitle.length < 5) {
      generatedTitle = `${detectedCategory} Issue`;
    }

    // Set form fields
    setTitle(generatedTitle);
    setCategory(detectedCategory);
    setDescription(fullText);
    setStep('review');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAll = () => {
    setStep('listening');
    setTranscript('');
    setInterimTranscript('');
    setTitle('');
    setCategory('Water');
    setDescription('');
    setImageFile(null);
    setImagePreview(null);
    setErrorMsg('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();
    fd.append('title', title.trim());
    fd.append('category', category);
    fd.append('description', description.trim());
    if (imageFile) {
      fd.append('image', imageFile);
    }

    try {
      await onSubmit(fd);
      resetAll();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => {
              if (isListening) recognitionRef.current.stop();
              resetAll();
              onClose();
            }}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/90 md:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Sparkles size={18} className="animate-pulse" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  {step === 'listening' ? 'Voice Assistant' : 'Review & Submit'}
                </h2>
              </div>
              <button
                onClick={() => {
                  if (isListening) recognitionRef.current.stop();
                  resetAll();
                  onClose();
                }}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-4 flex gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400">
                <AlertCircle size={18} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Listening Step */}
            {step === 'listening' && (
              <div className="mt-6 flex flex-col items-center">
                {/* Voice Visualizer Indicator */}
                <div className="relative flex h-36 w-36 items-center justify-center">
                  <AnimatePresence>
                    {isListening && (
                      <>
                        <span className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 animate-pulse-ring" />
                        <span className="absolute inset-4 rounded-full bg-indigo-500/20 dark:bg-indigo-500/10 animate-pulse-ring [animation-delay:0.5s]" />
                      </>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={toggleListening}
                    disabled={!!errorMsg && errorMsg.includes('not supported')}
                    className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
                      isListening
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105 shadow-indigo-600/30'
                    } disabled:opacity-50 disabled:pointer-events-none`}
                  >
                    {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                  </button>
                </div>

                {/* Animated Waveform Visualizer */}
                <div className="mt-4 flex h-8 items-center justify-center gap-1.5">
                  {isListening ? (
                    <>
                      <div className="h-6 w-1 rounded bg-indigo-500 dark:bg-indigo-400 origin-center animate-voice-bar-1" />
                      <div className="h-6 w-1 rounded bg-indigo-500 dark:bg-indigo-400 origin-center animate-voice-bar-2" />
                      <div className="h-6 w-1 rounded bg-indigo-500 dark:bg-indigo-400 origin-center animate-voice-bar-3" />
                      <div className="h-6 w-1 rounded bg-indigo-500 dark:bg-indigo-400 origin-center animate-voice-bar-4" />
                      <div className="h-6 w-1 rounded bg-indigo-500 dark:bg-indigo-400 origin-center animate-voice-bar-5" />
                    </>
                  ) : (
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                      Tap the microphone to start recording
                    </span>
                  )}
                </div>

                {/* Audio Status Text */}
                <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                  {isListening ? 'Listening... Speak now.' : 'Describe the issue you are facing.'}
                </p>

                {/* Live Transcription Box */}
                <div className="mt-6 min-h-[120px] w-full rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-950/30">
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {transcript || interimTranscript ? (
                      <>
                        <span>{transcript}</span>
                        <span className="text-slate-400 dark:text-slate-500 italic"> {interimTranscript}</span>
                      </>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 italic">
                        "For example: Water is leaking from the pipe under the washbasin in Flat 301, the bathroom floor is completely wet."
                      </span>
                    )}
                  </div>
                </div>

                {/* Next Step Controls */}
                <div className="mt-6 flex w-full gap-3">
                  <button
                    onClick={handleProcessTranscript}
                    disabled={!transcript && !interimTranscript}
                    className="flex-1 btn-primary py-3 rounded-2xl text-base disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Check size={18} /> Review Complaint
                  </button>
                </div>
              </div>
            )}

            {/* Review and Edit Step */}
            {step === 'review' && (
              <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Generated Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field py-3 rounded-xl border border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="Enter short title"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Category (Auto-Detected)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold border transition ${
                          category === cat
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Full Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field py-3 rounded-xl border border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="Provide details about the issue..."
                  />
                </div>

                {/* Photo Upload Area */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Attach Image (Optional)
                  </label>
                  <div className="relative flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-4 transition hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-900/30">
                    <input
                      type="file"
                      accept="image/*"
                      id="voice-image-upload"
                      onChange={handleImageChange}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    {imagePreview ? (
                      <div className="relative flex w-full items-center gap-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-16 w-16 rounded-xl object-cover shadow border border-slate-100 dark:border-slate-800"
                        />
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-semibold truncate text-slate-700 dark:text-slate-200">
                            {imageFile?.name}
                          </p>
                          <p className="text-xs text-slate-400">{(imageFile?.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="rounded-full bg-slate-100 p-1 text-slate-500 hover:bg-rose-50 hover:text-rose-500 dark:bg-slate-800 dark:hover:bg-rose-950/50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <div className="rounded-xl bg-slate-50 p-2 text-slate-400 dark:bg-slate-800">
                          <Image size={20} />
                        </div>
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          Upload a photo
                        </p>
                        <p className="text-[10px] text-slate-400">Drag & drop or click to upload</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetAll}
                    className="btn-secondary rounded-2xl flex items-center justify-center gap-1.5 px-4"
                  >
                    <RotateCcw size={16} /> Start Over
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn-primary rounded-2xl flex items-center justify-center gap-1.5 py-3 text-base shadow-lg shadow-indigo-600/10 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Register Complaint'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
