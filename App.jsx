import React, { useState, useEffect } from 'react';
import { 
  Search, Shield, Phone, Mail, User, Image as ImageIcon, 
  Camera, Cpu, Database, Terminal, Activity, Globe, 
  Lock, Zap, Eye 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURATION & API ---
// Mengambil API Key dari Environment Variable (Aman)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

const App = () => {
  const [activeTab, setActiveTab] = useState('phone');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState(["System Initialized...", "Awaiting Intelligence Directive..."]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 5)]);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query && !uploadedImage) return;

    // Cek apakah API Key sudah terpasang
    if (!apiKey) {
        addLog("ERROR: API Key tidak ditemukan di sistem!");
        setResult("Silakan konfigurasi VITE_GEMINI_API_KEY di environment variables.");
        return;
    }

    setIsSearching(true);
    setResult(null);
    addLog(`Initiating OSINT scan for: ${query || 'Visual Data'}...`);

    const systemPrompt = `Anda adalah Vigi AI, asisten intelijen tingkat tinggi untuk Indrayaza Z. 
    Tugas Anda adalah mensimulasikan pencarian OSINT yang komprehensif. 
    Analisis data ${activeTab} berikut: "${query}".
    Berikan "Dossier Intelijen" mendalam dalam Bahasa Indonesia. 
    Sertakan: Potensi Kebocoran Data, Jejak Media Sosial, Jaringan Terkait, dan Penilaian Risiko.
    Gunakan nada profesional seperti laporan agen rahasia.`;

    try {
      let payload;
      if (activeTab === 'image' && uploadedImage) {
        payload = {
          contents: [{
            parts: [
              { text: "Analisis gambar ini untuk tujuan intelijen. Identifikasi lokasi atau objek potensial." },
              { inlineData: { mimeType: "image/png", data: uploadedImage } }
            ]
          }]
        };
      } else {
        payload = {
          contents: [{ parts: [{ text: systemPrompt + "\nInput: " + query }] }]
        };
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      setResult(textResult || "Tidak ada data yang ditemukan.");
      addLog("Search protocols completed successfully.");
    } catch (error) {
      addLog("Error: Terjadi gangguan sinyal satelit.");
    } finally {
      setIsSearching(false);
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
    { id: 'phone', label: 'Phone', icon: Phone },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'username', label: 'Socials', icon: User },
    { id: 'image', label: 'Vision', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-cyan-400 font-mono p-4 md:p-8">
      {/* Container Utama HUD */}
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-cyan-900 pb-6">
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10 text-cyan-400 animate-pulse" />
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tighter italic">The Silentium Shield</h1>
              <p className="text-[10px] opacity-60">OPERATOR: INDRAYAZA Z. | CORE: VIGI AI v4.2</p>
            </div>
          </div>
          <Activity className="hidden md:block w-8 h-8 opacity-40" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Panel Kontrol */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase mb-4 flex items-center gap-2"><Terminal className="w-4 h-4"/> Modules</h3>
              <div className="space-y-2">
                {tabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setQuery(''); setResult(null); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${activeTab === tab.id ? 'bg-cyan-500/20 border-cyan-500 text-white' : 'border-transparent text-cyan-700 hover:bg-white/5'}`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Log Panel */}
            <div className="bg-black/40 border border-cyan-900/30 rounded-xl p-4 h-48 overflow-hidden">
                <p className="text-[10px] uppercase opacity-40 mb-2">Live Telemetry</p>
                <div className="space-y-1">
                    {logs.map((log, i) => (
                        <div key={i} className="text-[10px] text-cyan-800 italic">{log}</div>
                    ))}
                </div>
            </div>
          </aside>

          {/* Panel Utama */}
          <main className="lg:col-span-8 space-y-6">
            <form onSubmit={handleSearch} className="bg-black/60 border border-cyan-500/30 rounded-2xl p-6 space-y-4">
                <label className="text-[10px] uppercase font-bold text-cyan-600">Input Target Data</label>
                {activeTab === 'image' ? (
                    <div className="flex gap-4">
                        <label className="flex-1 border-2 border-dashed border-cyan-900 rounded-xl p-8 flex flex-col items-center cursor-pointer hover:bg-cyan-500/5">
                            <input type="file" className="hidden" onChange={handleImageUpload} />
                            <Camera className="opacity-40 mb-2" />
                            <span className="text-xs opacity-40">Upload Image Asset</span>
                        </label>
                        {imagePreview && <img src={imagePreview} className="w-24 h-24 object-cover rounded-lg border border-cyan-500" />}
                    </div>
                ) : (
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-800" />
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-cyan-950/20 border border-cyan-900 focus:border-cyan-500 rounded-xl py-4 pl-12 text-white outline-none"
                            placeholder={`Masukkan data ${activeTab}...`}
                        />
                    </div>
                )}
                <button 
                    disabled={isSearching}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-900 text-black font-bold py-4 rounded-xl uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                >
                    {isSearching ? "Processing..." : "Execute Intelligence Scan"}
                </button>
            </form>

            {/* Hasil */}
            <AnimatePresence>
                {result && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-cyan-950/10 border border-cyan-500/30 rounded-xl overflow-hidden">
                        <div className="bg-cyan-500/10 p-4 border-b border-cyan-500/20 text-xs font-bold uppercase flex items-center gap-2"><Eye className="w-4 h-4"/> Intelligence Dossier</div>
                        <div className="p-6 text-sm leading-relaxed whitespace-pre-wrap">{result}</div>
                    </motion.div>
                )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
