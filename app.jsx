```react
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Shield, 
  Phone, 
  Mail, 
  User, 
  Image as ImageIcon, 
  Camera, 
  Cpu, 
  Database, 
  Terminal,
  Activity,
  Globe,
  Lock,
  ChevronRight,
  AlertTriangle,
  Zap,
  Eye,
  Settings,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURATION & API ---
const apiKey = ""; // Managed by environment
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

const App = () => {
  const [activeTab, setActiveTab] = useState('phone');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState(["System Initialized...", "Awaiting Intelligence Directive..."]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Futuristic Background Animation Elements
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const p = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      size: Math.random() * 3 + 1 + 'px',
      duration: Math.random() * 5 + 3 + 's'
    }));
    setParticles(p);
  }, []);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev.slice(0, 5)]);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query && !uploadedImage) return;

    setIsSearching(true);
    setResult(null);
    addLog(`Initiating OSINT scan for: ${query || 'Visual Data'}...`);

    const systemPrompt = `You are Vigi AI, a high-level intelligence assistant for Indrayaza Z (Indra). 
    Your task is to simulate a comprehensive OSINT (Open Source Intelligence) search. 
    Analyze the provided ${activeTab} data: "${query}".
    Provide a detailed "Intelligence Dossier" in Indonesian. 
    Include: Potential Data Leaks, Social Media Footprints, Associated Networks, and Risk Assessment.
    Keep the tone professional, like a secret agent's report. 
    Format the output with clear headers and bullet points.`;

    try {
      let payload;
      if (activeTab === 'image' && uploadedImage) {
        payload = {
          contents: [{
            role: "user",
            parts: [
              { text: "Analyze this image for intelligence purposes. Identify location, objects, or potential digital fingerprints." },
              { inlineData: { mimeType: "image/png", data: uploadedImage } }
            ]
          }]
        };
      } else {
        payload = {
          contents: [{ parts: [{ text: systemPrompt + "\nInput: " + query }] }]
        };
      }

      const response = await fetchWithRetry(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      setResult(textResult);
      addLog("Search protocols completed successfully.");
    } catch (error) {
      addLog("Error: Signal interference detected.");
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchWithRetry = async (url, options, retries = 5, backoff = 1000) => {
    try {
      const res = await fetch(url, options);
      if (!res.ok && retries > 0) throw new Error("Retry needed");
      return res;
    } catch (err) {
      if (retries <= 0) throw err;
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setUploadedImage(base64String);
        setImagePreview(reader.result);
        addLog("Visual asset uploaded to buffer.");
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'phone', label: 'Phone', icon: Phone, placeholder: '+62...' },
    { id: 'email', label: 'Email', icon: Mail, placeholder: 'target@proton.me' },
    { id: 'username', label: 'Socials', icon: User, placeholder: '@instagram / fb / twt' },
    { id: 'image', label: 'Vision', icon: ImageIcon, placeholder: 'Upload Image' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-cyan-400 font-mono selection:bg-cyan-900 overflow-hidden relative">
      
      {/* Background Animated Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-500 opacity-20 pointer-events-none"
          style={{ width: p.size, height: p.size, left: p.left, top: p.top }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* Glassmorphic Overlay Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
        
        {/* Header HUD */}
        <header className="flex flex-col md:flex-row justify-between items-center border-b border-cyan-900/50 pb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-950/50 border border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Shield className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase italic">
                The Silentium Shield
              </h1>
              <div className="flex items-center gap-2 text-[10px] uppercase opacity-70">
                <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> System Stable</span>
                <span className="text-cyan-600">|</span>
                <span className="flex items-center gap-1"><Database className="w-3 h-3" /> Core: Vigi AI v4.0</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex gap-6 items-center text-xs">
            <div className="flex flex-col items-end">
              <span className="opacity-50 uppercase">Current Operator</span>
              <span className="text-white font-bold">INDRAYAZA Z.</span>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/50 p-1">
              <div className="w-full h-full rounded-full bg-cyan-900/50 flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel - Control Center */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-sm font-bold uppercase mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Command Modules
              </h3>
              <div className="flex flex-col gap-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setQuery(''); setUploadedImage(null); setImagePreview(null); }}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 border ${
                      activeTab === tab.id 
                      ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                      : 'border-transparent hover:bg-white/5 text-cyan-500/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon className="w-5 h-5" />
                      <span className="text-sm font-semibold uppercase">{tab.label}</span>
                    </div>
                    {activeTab === tab.id && <motion.div layoutId="indicator" className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-black/40 border border-cyan-900/30 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase mb-4 flex items-center gap-2 opacity-60">
                <Activity className="w-3 h-3" /> Live Telemetry
              </h3>
              <div className="space-y-2">
                {logs.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1 - i * 0.15, x: 0 }}
                    key={i} 
                    className="text-[10px] font-mono flex items-center gap-2"
                  >
                    <span className="text-cyan-700">[{new Date().toLocaleTimeString()}]</span>
                    <span className={i === 0 ? "text-cyan-300" : "text-cyan-800"}>{log}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Panel - Search & Results */}
          <main className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Search Console */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <form 
                onSubmit={handleSearch}
                className="relative bg-black/60 border border-cyan-500/30 rounded-2xl p-4 md:p-8 flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-cyan-500">Targeting {activeTab} Data</label>
                  {activeTab === 'image' ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-4 items-center">
                        <label className="flex-1 cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-cyan-800 rounded-xl p-8 hover:bg-cyan-950/20 transition-colors">
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                          <Camera className="w-10 h-10 mb-2 opacity-50" />
                          <span className="text-sm opacity-50 uppercase">Inject Visual Data</span>
                        </label>
                        {imagePreview && (
                          <div className="w-32 h-32 rounded-xl overflow-hidden border border-cyan-500/50">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={`Masukkan ${tabs.find(t => t.id === activeTab).label}...`}
                        className="w-full bg-cyan-950/20 border border-cyan-500/20 rounded-xl py-4 px-12 text-white placeholder:text-cyan-900 focus:outline-none focus:border-cyan-500 transition-all"
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-700" />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSearching || (activeTab !== 'image' && !query) || (activeTab === 'image' && !uploadedImage)}
                  className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-950 disabled:text-cyan-900 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Deciphering...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 fill-black" />
                      Execute Intelligence Scan
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results Display */}
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-cyan-950/10 border border-cyan-500/30 rounded-2xl overflow-hidden"
                >
                  <div className="bg-cyan-500/10 px-6 py-3 border-b border-cyan-500/20 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Intelligence Dossier
                    </span>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500/50" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                      <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    </div>
                  </div>
                  <div className="p-6 md:p-8 prose prose-invert prose-cyan max-w-none">
                    <div className="whitespace-pre-wrap text-cyan-50 leading-relaxed text-sm md:text-base">
                      {result}
                    </div>
                  </div>
                  <div className="bg-black/40 px-6 py-4 flex flex-wrap gap-4 border-t border-cyan-500/10 text-[10px] uppercase opacity-60">
                    <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Classified</span>
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Global Node Access</span>
                    <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> Neural Analysis Active</span>
                  </div>
                </motion.div>
              ) : !isSearching && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="h-64 flex flex-col items-center justify-center border border-dashed border-cyan-900/50 rounded-2xl text-cyan-900"
                >
                  <Database className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm uppercase tracking-widest font-bold">Awaiting Target Input</p>
                </motion.div>
              )}
            </AnimatePresence>

          </main>
        </div>

        {/* Footer HUD */}
        <footer className="mt-8 pt-8 border-t border-cyan-900/30 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-cyan-700">
          <div className="flex gap-6">
            <a href="#" className="hover:text-cyan-400 transition-colors">Security Protocol</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">API Status</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a>
          </div>
          <div className="text-center md:text-right">
            Property of The Silentium Shield &copy; 2026 | Designed for Indra
          </div>
        </footer>
      </div>

      {/* Decorative HUD Elements */}
      <div className="fixed top-1/2 -right-12 -translate-y-1/2 opacity-10 pointer-events-none hidden xl:block">
        <div className="flex flex-col gap-4">
          <div className="w-24 h-2 bg-cyan-500" />
          <div className="w-16 h-2 bg-cyan-700" />
          <div className="w-32 h-2 bg-cyan-900" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          from { background-position: 0 0; }
          to { background-position: 0 100%; }
        }
        .prose h2, .prose h3 { color: #22d3ee; text-transform: uppercase; letter-spacing: 0.1em; border-left: 4px solid #0891b2; padding-left: 1rem; margin-top: 2rem; }
        .prose ul { list-style-type: none; padding-left: 0; }
        .prose li { position: relative; padding-left: 1.5rem; margin-bottom: 0.5rem; }
        .prose li::before { content: '>'; position: absolute; left: 0; color: #0891b2; font-weight: bold; }
      `}} />
    </div>
  );
};

export default App;

```

