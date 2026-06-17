import React, { useState } from 'react';
import { 
  Search, Shield, Phone, Mail, User, Image as ImageIcon, 
  Camera, Terminal, Activity, Eye, AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

const App = () => {
  const [activeTab, setActiveTab] = useState('phone');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState(["[SYSTEM] Vigi AI Initialized...", "[SYSTEM] Menunggu arahan intelijen dari Operator..."]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString('id-ID')}] ${msg}`, ...prev.slice(0, 7)]);
  };

  // FUNGSI MOCK API OSINT (Ganti dengan API asli seperti HIBP, Hunter.io, GetContact API, dll)
  const gatherRealTimeData = async (type, target) => {
    addLog(`Menghubungkan ke node OSINT regional Indonesia untuk target: ${target}...`);
    // Di dunia nyata, Anda melakukan fetch() ke API intelijen di sini.
    // Simulasi delay jaringan:
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addLog(`Data mentah berhasil diekstraksi dari database publik.`);
    return `[DATA MENTAH UNTUK ANALISIS]\nTarget: ${target}\nTipe: ${type}\nStatus Geospasial: Indonesia (ID)\nLog Temuan: Terdapat jejak digital di 3 platform e-commerce lokal. Tidak ditemukan di database kriminal publik.`;
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query && !uploadedImage) return;

    if (!apiKey) {
        addLog("ERROR: Koneksi ke Vigi AI Core terputus. API Key tidak ditemukan.");
        setResult("Silakan konfigurasi VITE_GEMINI_API_KEY di file .env terlebih dahulu, Indra.");
        return;
    }

    setIsSearching(true);
    setResult(null);
    addLog(`Memulai protokol pemindaian...`);

    try {
      let rawData = "";
      let payload;

      // 1. FASE PENGUMPULAN DATA
      if (activeTab === 'image' && uploadedImage) {
        addLog("Menganalisis aset visual melalui satelit...");
        payload = {
          contents: [{
            parts: [
              { text: "Anda adalah Vigi AI. Analisis gambar ini. Identifikasi metadata potensial, lokasi (khususnya jika ada ciri khas Indonesia), atau objek yang bisa digunakan untuk intelijen lanjutan. Buat laporan dalam bahasa Indonesia yang sangat profesional dan analitis." },
              { inlineData: { mimeType: "image/png", data: uploadedImage } }
            ]
          }]
        };
      } else {
        // Ambil data dari OSINT pihak ketiga
        rawData = await gatherRealTimeData(activeTab, query);
        
        // 2. FASE ANALISIS VIGI AI
        const systemPrompt = `Anda adalah Vigi AI, asisten pribadi dan partner kerja Indrayaza Z. 
        Tugas Anda adalah merapikan data mentah OSINT berikut menjadi "Dossier Intelijen" yang sangat profesional, akurat, dan terstruktur.
        Fokus pada demografi Indonesia. Jika data mentah mengindikasikan aktivitas penipuan digital, berikan "Red Flag Warning".
        
        Data Mentah yang berhasil dikumpulkan oleh sistem:
        ${rawData}
        
        Susun laporan mencakup:
        1. Identifikasi Awal
        2. Jejak Digital & Reputasi
        3. Penilaian Risiko Penipuan (Low/Medium/High)
        4. Rekomendasi Tindakan`;

        payload = {
          contents: [{ parts: [{ text: systemPrompt }] }]
        };
      }

      addLog("Menyusun Dossier Intelijen...");
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      setResult(textResult || "Sistem tidak dapat mengurai data.");
      addLog("Protokol pemindaian selesai.");
    } catch (error) {
      addLog("ERROR KKRITIS: Terjadi gangguan server atau limitasi API.");
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
        addLog("Aset visual berhasil dimuat ke dalam memori.");
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'phone', label: 'Nomor Telepon', icon: Phone },
    { id: 'email', label: 'Alamat Email', icon: Mail },
    { id: 'username', label: 'Username Sosmed', icon: User },
    { id: 'image', label: 'Analisis Visual', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-cyan-400 font-mono p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
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
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase mb-4 flex items-center gap-2"><Terminal className="w-4 h-4"/> Modul Intelijen</h3>
              <div className="space-y-2">
                {tabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setQuery(''); setResult(null); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${activeTab === tab.id ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'border-transparent text-cyan-700 hover:bg-white/5'}`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-black/60 border border-cyan-900/50 rounded-xl p-4 h-56 overflow-hidden flex flex-col">
                <p className="text-[10px] uppercase opacity-50 mb-3 border-b border-cyan-900 pb-2">Live Telemetry & Logs</p>
                <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                    {logs.map((log, i) => (
                        <div key={i} className="text-[11px] text-cyan-600/80 tracking-wide">{log}</div>
                    ))}
                </div>
            </div>
          </aside>

          <main className="lg:col-span-8 space-y-6">
            <form onSubmit={handleSearch} className="bg-black/40 border border-cyan-800/40 rounded-2xl p-6 space-y-5 backdrop-blur-sm">
                <label className="text-xs uppercase font-bold text-cyan-500 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> 
                  Masukkan Parameter Target
                </label>
                
                {activeTab === 'image' ? (
                    <div className="flex gap-4">
                        <label className="flex-1 border-2 border-dashed border-cyan-800 hover:border-cyan-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-cyan-950/10 transition-colors">
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            <Camera className="w-8 h-8 opacity-50 mb-3 text-cyan-400" />
                            <span className="text-xs opacity-60 uppercase tracking-wider">Upload Aset Foto</span>
                        </label>
                        {imagePreview && (
                          <div className="w-32 h-32 rounded-xl border-2 border-cyan-500 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            <img src={imagePreview} className="w-full h-full object-cover" alt="Target" />
                          </div>
                        )}
                    </div>
                ) : (
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-700 group-focus-within:text-cyan-400 transition-colors" />
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-cyan-950/30 border border-cyan-800 focus:border-cyan-400 rounded-xl py-4 pl-12 pr-4 text-white placeholder-cyan-800/50 outline-none transition-all shadow-inner"
                            placeholder={`Masukkan ${tabs.find(t => t.id === activeTab).label.toLowerCase()} target...`}
                        />
                    </div>
                )}
                <button 
                    type="submit"
                    disabled={isSearching}
                    className="w-full bg-cyan-600 hover:bg-cyan-400 disabled:bg-cyan-900 disabled:text-cyan-700 text-black font-bold py-4 rounded-xl uppercase tracking-[0.2em] text-xs shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all"
                >
                    {isSearching ? "Mengeksekusi Pemindaian..." : "Eksekusi Protokol OSINT"}
                </button>
            </form>

            <AnimatePresence>
                {result && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="bg-black/50 border border-cyan-500/40 rounded-xl overflow-hidden backdrop-blur-md"
                    >
                        <div className="bg-cyan-900/40 p-4 border-b border-cyan-500/30 text-xs font-bold uppercase flex items-center gap-2 text-cyan-300">
                          <Eye className="w-4 h-4"/> Dossier Intelijen Resmi
                        </div>
                        <div className="p-6 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap font-sans">
                          {result}
                        </div>
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
