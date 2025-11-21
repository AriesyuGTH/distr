import React, { useState, useEffect, useRef } from 'react';
import {
  Server,
  User,
  Database,
  FileText,
  Cloud,
  ShieldCheck,
  Layers,
  Box,
  Cpu,
  Share2,
  Play,
  Pause,
  Sparkles,
  MessageSquare,
  X,
  Send,
  Activity,
  GitBranch,
  Globe,
  ArrowRight,
  CheckCircle2,
  UploadCloud,
  Download,
  Laptop,
  ArrowUp
} from 'lucide-react';

const DistrComparison = () => {
  const [mode, setMode] = useState('asis'); // 'asis' or 'tobe'
  const [step, setStep] = useState(1); // Start from 1
  const [isPlaying, setIsPlaying] = useState(true);
  
  // AI State
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: 'system', text: '你好！我是 Distr 架構顧問。關於 Factory EAP 的 K8s 部署流程或是 Distr 的多級拓樸架構，有什麼我可以為您解釋的嗎？' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Gemini API Configuration
  const apiKey = "AIzaSyCy_N6UYvINqs34iO_yV8vGJT7slx9rtTc"; 
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const callGeminiAPI = async (prompt) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "抱歉，我現在無法回答。";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "連線發生錯誤，請稍後再試。";
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const newMessages = [...aiMessages, { role: 'user', text: userInput }];
    setAiMessages(newMessages);
    setUserInput('');
    setIsAiLoading(true);

    const contextPrompt = `
      You are an expert solution architect for "Distr".
      Context: Comparing "AS-IS" (Legacy Factory EAP on K8s) vs "TO-BE" (Recursive Distr Hub Topology).
      TO-BE Architecture:
      1. Vendor -> Tier 1 Factory (Agent).
      2. Internal Dev -> Tier 1 Factory (Internal Hub).
      3. Tier 1 Hub -> Tier 2 Line Managers (Internal Clients).
      
      User Question: ${userInput}
      Answer in Traditional Chinese (zh-TW).
    `;

    const reply = await callGeminiAPI(contextPrompt);
    setAiMessages([...newMessages, { role: 'system', text: reply }]);
    setIsAiLoading(false);
  };

  const generateSummary = async () => {
    setIsPlaying(false);
    setShowAIChat(true);
    setIsAiLoading(true);
    
    const prompt = `
      Generate a concise "Executive Summary" (3 bullet points) for the ${mode === 'asis' ? 'Legacy (AS-IS)' : 'Distr (TO-BE)'} architecture.
      If AS-IS: Focus on "Manual Config Handover", "K8s Platform Bottlenecks", "Siloed Operations".
      If TO-BE: Focus on "Recursive Topology", "Internal Asset Activation", "Unified Deployment Chain".
      Output in Traditional Chinese.
    `;

    const summary = await callGeminiAPI(prompt);
    setAiMessages(prev => [...prev, { role: 'system', text: `📊 **${mode === 'asis' ? '既有架構診斷' : 'Distr 架構優勢'}**

${summary}` }]);
    setIsAiLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, showAIChat]);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      const maxSteps = mode === 'asis' ? 4 : 4; 
      const interval = 4000; 

      timer = setInterval(() => {
        setStep((prev) => {
          if (prev >= maxSteps) return 1;
          return prev + 1;
        });
      }, interval);
    }
    return () => clearInterval(timer);
  }, [isPlaying, mode]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setStep(1);
    setIsPlaying(true);
  };

  return (
    <div className="w-full flex flex-col items-center bg-slate-100 p-4 font-sans text-slate-800 h-screen overflow-hidden">
      
      <div className="relative w-full max-w-6xl aspect-video bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        
        {/* Header */}
        <header className="h-16 bg-[#0f172a] text-white flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <h1 className="text-xl font-bold tracking-wide truncate">
              架構演進: {mode === 'asis' ? 'Factory EAP 現狀 (As-Is)' : 'Distr 遞迴生態系 (To-Be)'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex bg-slate-800 rounded-lg p-1 mr-4">
              <button 
                onClick={() => switchMode('asis')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'asis' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                AS-IS
              </button>
              <button 
                onClick={() => switchMode('tobe')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'tobe' ? 'bg-green-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                TO-BE
              </button>
            </div>
            <button onClick={generateSummary} className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs font-bold shadow-lg transition-all hover:scale-105 animate-pulse">
              <Sparkles size={14} /> 智能洞察
            </button>
          </div>
        </header>

        {/* Main Stage */}
        <div className="flex-1 relative bg-slate-50 p-6 overflow-hidden">
          
          {/* Scene Render */}
          {mode === 'asis' ? <AsIsScene step={step} /> : <ToBeScene step={step} />}

          {/* AI Chat Overlay */}
          {showAIChat && (
            <div className="absolute bottom-4 right-4 w-80 h-96 bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col z-50 animate-slide-up">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 text-white flex justify-between items-center rounded-t-xl">
                <div className="flex items-center gap-2"><Sparkles size={16} /><span className="font-bold text-sm">AI 架構顧問</span></div>
                <button onClick={() => setShowAIChat(false)} className="hover:bg-white/20 rounded p-1"><X size={16}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-sm">
                {aiMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-lg shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && <div className="flex justify-start"><div className="bg-white border p-3 rounded-lg flex gap-1"><span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span></div></div>}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 border-t border-slate-100 bg-white">
                <div className="flex gap-2">
                  <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="詢問..." className="flex-1 text-sm border rounded-full px-4 py-2 focus:outline-none focus:border-purple-500" />
                  <button onClick={handleSendMessage} disabled={isAiLoading} className="w-9 h-9 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700"><Send size={16} /></button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="h-24 bg-white border-t border-slate-200 p-4 flex items-center gap-6 z-20">
           <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 bg-white border border-slate-300 rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors shadow-sm flex-shrink-0">
             {isPlaying ? <Pause size={20} className="text-slate-600" /> : <Play size={20} className="text-blue-600 ml-1" />}
           </button>
           <div className="flex-1">
             <div className="flex items-center gap-2 mb-1">
               <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${mode === 'asis' ? 'bg-slate-200 text-slate-700' : 'bg-green-100 text-green-700'}`}>STEP {step}</span>
               <h3 className="font-bold text-slate-800 text-lg">{mode === 'asis' ? getAsIsTitle(step) : getToBeTitle(step)}</h3>
             </div>
             <p className="text-slate-600 text-sm">{mode === 'asis' ? getAsIsDesc(step) : getToBeDesc(step)}</p>
           </div>
           <button onClick={() => setShowAIChat(!showAIChat)} className={`p-3 rounded-full shadow-md transition-colors ${showAIChat ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 border border-purple-200'}`}><MessageSquare size={20} /></button>
        </div>
      </div>

      <style>{`
        @keyframes slide-right { from { left: 30%; opacity: 0; } to { left: 50%; opacity: 1; } }
        .animate-slide-right { animation: slide-right 1s ease-out forwards; }
      `}</style>
    </div>
  );
};

// --- As-Is Scene (Factory EAP) ---
const AsIsScene = ({ step }) => {
  return (
    <div className="w-full h-full relative">
      
      {/* Zone 1: CI/CD & Harbor (Left) - 15% */}
      <div className="absolute top-0 bottom-0 left-0 w-[20%] flex flex-col justify-center items-center gap-12">
         <div className={`flex flex-col items-center gap-2 transition-all ${step === 1 ? 'scale-110 opacity-100' : 'opacity-80'}`}>
            <div className="w-16 h-16 bg-white border-2 border-blue-200 rounded-lg flex items-center justify-center shadow-sm">
              <Server size={32} className="text-blue-600" />
            </div>
            <span className="text-xs font-bold text-slate-600">CI/CD Pipeline</span>
         </div>

         <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center shadow-sm">
               <Database size={28} className="text-blue-500" />
            </div>
            <span className="text-xs font-bold text-slate-500">Harbor</span>
         </div>
      </div>

      {/* Zone 2: SharePoint (Mid-Left) - 35% */}
      <div className="absolute top-0 bottom-0 left-[20%] w-[20%] flex flex-col justify-center items-center">
         <div className={`relative w-24 h-24 bg-white border-4 rounded-2xl shadow-xl flex flex-col items-center justify-center transition-all duration-500 z-10 ${step === 1 || step === 2 ? 'border-orange-500 scale-110' : 'border-slate-200'}`}>
            <Cloud size={40} className={step === 1 || step === 2 ? "text-orange-500" : "text-slate-400"} />
            <span className="text-xs font-bold text-slate-600 mt-1">SharePoint</span>
            {(step === 1 || step === 2) && <div className="absolute -top-6 px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full border border-red-200 animate-bounce whitespace-nowrap">Manual Gap</div>}
         </div>
      </div>

      {/* Zone 3: Ops (Mid-Right) - 55% */}
      <div className="absolute top-0 bottom-0 left-[40%] w-[15%] flex flex-col justify-center items-center">
         <div className={`w-16 h-16 bg-white border-2 rounded-full flex items-center justify-center shadow-sm transition-all z-10 ${step === 2 || step === 3 ? 'border-red-500 scale-110' : 'border-slate-300'}`}>
            <User size={24} className={step === 2 || step === 3 ? 'text-red-500' : 'text-slate-400'} />
         </div>
         <span className="text-xs font-bold text-slate-500 mt-2">Ops</span>
      </div>

      {/* Zone 4: Factory EAP (Right) - 60-100% */}
      <div className="absolute top-8 bottom-8 right-[5%] left-[60%] bg-slate-100/50 border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col justify-between">
         <div className="absolute -top-3 left-4 bg-slate-50 px-2 text-slate-500 font-bold text-sm">Factory EAP Environment</div>
         
         {/* K8s Platform Wrapper */}
         <div className={`bg-white border border-slate-300 rounded-xl p-4 shadow-md mt-4 flex flex-col items-center relative transition-all duration-500 z-10 ${step === 3 ? 'ring-4 ring-blue-100 border-blue-400' : ''}`}>
            <div className="absolute -top-3 bg-white px-2 text-xs font-bold text-slate-700 border border-slate-200 rounded">K8s Platform</div>
            <div className="w-full h-8 bg-slate-50 border border-slate-200 rounded mb-2 flex items-center px-2 gap-2">
               <div className="w-2 h-2 rounded-full bg-red-400"></div>
               <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
               <div className="w-2 h-2 rounded-full bg-green-400"></div>
               <div className="text-[8px] text-slate-400 ml-auto">EAP UI Service</div>
            </div>
            <Layers size={32} className="text-slate-600 my-2" />
            <span className="text-xs text-slate-500">Central Management</span>
         </div>

         {/* Line Managers */}
         <div className="flex justify-around items-end pb-2 relative">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center group z-10">
                 <div className={`w-12 h-12 bg-white border-2 rounded-lg flex items-center justify-center shadow-sm transition-colors ${step === 4 ? 'border-green-500 bg-green-50' : 'border-slate-300'}`}>
                    <Cpu size={20} className={step === 4 ? 'text-green-600' : 'text-slate-400'} />
                 </div>
                 <span className="text-[10px] font-bold text-slate-500 mt-1 group-hover:text-slate-700">Line {i}</span>
              </div>
            ))}
            
            {/* Deploy Animation (Step 4) - Tree Structure */}
            {step === 4 && (
               <div className="absolute top-[-60px] left-0 right-0 h-[60px] pointer-events-none">
                  {/* Main Trunk */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-[30px] bg-blue-400"></div>
                  {/* Horizontal Branch */}
                  <div className="absolute top-[30px] left-[16%] right-[16%] h-0.5 bg-blue-400"></div>
                  {/* Vertical Drops */}
                  <div className="absolute top-[30px] left-[16%] h-[30px] w-0.5 bg-blue-400"></div>
                  <div className="absolute top-[30px] left-1/2 -translate-x-1/2 h-[30px] w-0.5 bg-blue-400"></div>
                  <div className="absolute top-[30px] right-[16%] h-[30px] w-0.5 bg-blue-400"></div>
                  
                  <span className="absolute top-[10px] left-1/2 -translate-x-1/2 bg-white px-1 text-[9px] text-blue-600 border border-blue-200 rounded shadow-sm z-20">K8s Deploy</span>
               </div>
            )}
         </div>
      </div>

      {/* Animations & Connections */}
      
      {/* Step 1: CI/CD -> SharePoint */}
      {step === 1 && (
         <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <line x1="15%" y1="30%" x2="25%" y2="50%" stroke="#fb923c" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
            <circle cx="25%" cy="50%" r="3" fill="#fb923c" />
            <foreignObject x="18%" y="35%" width="30" height="30">
               <div className="animate-bounce"><FileText size={16} className="text-orange-500" /></div>
            </foreignObject>
         </svg>
      )}
      
      {/* Step 2: SharePoint -> Ops */}
      {step === 2 && (
         <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <line x1="35%" y1="50%" x2="43%" y2="50%" stroke="#f87171" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
            <foreignObject x="37%" y="42%" width="30" height="30">
               <div className="animate-bounce"><Download size={16} className="text-red-500" /></div>
            </foreignObject>
         </svg>
      )}

      {/* Step 3: Ops -> K8s Platform */}
      {step === 3 && (
         <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <line x1="52%" y1="50%" x2="65%" y2="35%" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
            <foreignObject x="57%" y="38%" width="40" height="20">
               <div className="text-[9px] bg-blue-100 text-blue-600 px-1 rounded animate-pulse">Upload</div>
            </foreignObject>
         </svg>
      )}

    </div>
  );
};

// --- To-Be Scene (Dynamic Layout) ---
const ToBeScene = ({ step }) => {
  
  // Layout Transition Classes
  const getLeftPanelClass = () => {
    if (step >= 3) return "w-[33%] border-r border-dashed border-slate-300";
    return "w-[50%] border-r border-dashed border-slate-300";
  };

  const getMidPanelClass = () => {
    if (step >= 3) return "w-[33%] left-[33%]";
    return "w-[50%] left-[50%]";
  };

  const getRightPanelClass = () => {
    if (step >= 3) return "w-[33%] left-[66%] opacity-100";
    return "w-0 left-[100%] opacity-0";
  };

  return (
    <div className="w-full h-full relative overflow-hidden transition-all duration-1000">
      
      {/* --- Panel 1: Vendor Ecosystem (Left) --- */}
      <div className={`absolute top-0 bottom-0 left-0 transition-all duration-1000 ${getLeftPanelClass()} flex flex-col items-center justify-center p-4`}>
         <div className="w-full max-w-md h-[70%] bg-blue-50/30 rounded-xl border border-blue-100 p-4 relative flex flex-col">
            <div className="text-[10px] font-bold text-blue-500 uppercase mb-4 flex items-center gap-2 bg-white w-max px-2 py-1 rounded border border-blue-100 self-start">
               <Globe size={12}/> Vendor Ecosystem
            </div>
            
            {/* Split 1:1 Layout */}
            <div className="flex-1 flex w-full">
               {/* Left Column: Vendor Dev */}
               <div className="w-1/2 flex items-center justify-center border-r border-blue-100/50">
                  <div className="flex flex-col items-center">
                     <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm"><User size={20} className="text-slate-600"/></div>
                     <span className="text-xs mt-2 text-slate-500 font-bold">Vendor Dev</span>
                  </div>
               </div>

               {/* Right Column: Vendor Hub (Top) & Registry (Bottom) */}
               <div className="w-1/2 flex flex-col justify-between items-center py-4">
                  
                  {/* Vendor Hub (Now Top) */}
                  <div className="flex flex-col items-center relative">
                     <div className={`w-28 p-2 bg-white border-2 border-blue-500 rounded-xl shadow-lg transition-all z-10 ${step === 1 ? 'ring-4 ring-blue-100 scale-105' : ''}`}>
                        <div className="flex items-center gap-2 justify-center">
                           <Box size={18} className="text-blue-600"/>
                           <div>
                              <span className="text-xs font-bold block">Vendor Hub</span>
                           </div>
                        </div>
                     </div>
                     
                     {/* Step 1 Animation: Deploy Packet (Originates from Top) */}
                     {step === 1 && (
                        <div className="absolute top-1/2 right-[-100px] z-20 animate-slide-right-deploy">
                           <div className="bg-blue-600 text-white text-[9px] px-2 py-1 rounded-full shadow flex items-center gap-1 whitespace-nowrap">
                              Deploy <ArrowRight size={10}/>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Registry (Now Bottom) */}
                  <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-white border border-blue-200 rounded flex items-center justify-center shadow-sm">
                         <Database size={16} className="text-blue-500" />
                      </div>
                      <span className="text-[10px] mt-1 text-blue-600 font-bold">Registry</span>
                  </div>
                  
               </div>
            </div>
         </div>
      </div>

      {/* --- Panel 2: Tier 1 Node (Center/Right) --- */}
      <div className={`absolute top-0 bottom-0 transition-all duration-1000 ${getMidPanelClass()} flex flex-col p-4`}>
         
         {/* Top: Tier 1 Factory Node */}
         <div className="flex-[2] flex flex-col justify-center items-center relative border-b border-dashed border-slate-200">
             <div className="w-full max-w-sm bg-slate-800 rounded-2xl border border-slate-700 p-5 shadow-2xl relative z-10">
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-3 py-0.5 rounded-full text-[10px] font-bold shadow-lg z-10 whitespace-nowrap">
                  Tier 1 Node (Factory)
               </div>

               {/* Agent Role */}
               <div className={`w-full bg-slate-700/50 rounded-lg p-2 mb-4 border border-slate-600 flex items-center justify-between transition-all ${step === 1 ? 'border-green-400 bg-slate-700' : ''}`}>
                  <div className="flex items-center gap-2">
                     <ShieldCheck size={14} className={step >= 1 ? "text-green-400" : "text-slate-500"} />
                     <span className="text-[10px] text-slate-300 font-bold">AGENT ROLE</span>
                  </div>
                  <div className="text-[8px] text-slate-400">From Vendor</div>
               </div>

               {/* Internal Hub Asset */}
               <div className={`w-full bg-white rounded-xl p-3 border-2 transition-all ${step >= 2 ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-slate-600 opacity-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                     <div className="bg-purple-100 p-2 rounded-lg"><Share2 size={20} className="text-purple-600"/></div>
                     <div>
                        <div className="text-sm font-bold text-slate-800">Internal Hub</div>
                        <div className="text-[10px] text-slate-500">Managed Asset</div>
                     </div>
                  </div>
                  
                  {/* Connectivity Visualization (Step 4) */}
                  {step === 4 && (
                     <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-[8px] font-mono text-slate-400">STATUS:</span>
                        <span className="text-[8px] font-bold text-green-600 flex items-center gap-1">
                           <Activity size={8}/> ACTIVE
                        </span>
                     </div>
                  )}
               </div>
             </div>
         </div>

         {/* Bottom: Internal Dev (Appears in Step 2) */}
         <div className={`flex-1 flex flex-col justify-center items-center transition-all duration-1000 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-full max-w-xs bg-purple-50/50 rounded-xl border border-purple-100 p-3 relative mt-4">
               <div className="text-[10px] font-bold text-purple-500 uppercase mb-2 flex items-center gap-1">
                  <User size={10}/> Client Internal Dev
               </div>
               <div className="flex items-center justify-between px-4">
                  <div className="w-8 h-8 bg-white border border-purple-200 rounded flex items-center justify-center"><User size={14} className="text-slate-600"/></div>
                  <div className="h-px flex-1 bg-purple-300 mx-2 relative">
                     {step === 2 && <div className="absolute right-0 -top-1.5 w-1 h-1 bg-purple-600 rounded-full animate-ping"></div>}
                  </div>
                  <div className="w-8 h-8 bg-white border border-purple-200 rounded flex items-center justify-center"><GitBranch size={14} className="text-purple-500"/></div>
               </div>
               
               {/* Step 2 Arrow UP to Hub */}
               {step === 2 && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                     <ArrowUp size={20} className="text-purple-500"/>
                     <span className="text-[8px] font-bold text-purple-600 bg-white px-1 rounded border border-purple-200">Deploy</span>
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* --- Panel 3: Tier 2 (Right) --- */}
      <div className={`absolute top-0 bottom-0 transition-all duration-1000 ${getRightPanelClass()} flex flex-col items-center justify-center p-4 bg-slate-50/50`}>
         <div className="w-full max-w-xs h-[80%] border-2 border-dashed border-slate-200 rounded-xl p-4 relative flex flex-col justify-center items-center">
            <div className="absolute top-[-10px] right-4 bg-white px-2 text-[10px] font-bold text-slate-400 uppercase border border-slate-200 rounded">
               Tier 2 (Internal Clients)
            </div>

            {/* Vertical Stack Structure for Tier 2 Deployment */}
            <div className="relative flex flex-col gap-6 w-full pl-12 justify-center">
               
               {/* Note: Connection lines are now rendered relative to each item to ensure perfect alignment */}
               
               {[1, 2, 3].map((i, index, arr) => (
                  <div key={i} className={`relative flex items-center gap-3 transition-all duration-500 delay-${i*100} ${step >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                     
                     {/* 1. Horizontal Branch (All Items) */}
                     {step >= 3 && (
                        <div className="absolute -left-[24px] top-1/2 -translate-y-1/2 w-[24px] h-0.5 bg-purple-400"></div>
                     )}

                     {/* 2. Vertical Trunk Segment (Item 1 & 2 only) */}
                     {/* Connects current item center to next item center. Height = 100% (item) + gap (24px) = approx 64px */}
                     {step >= 3 && index < arr.length - 1 && (
                        <div className="absolute -left-[24px] top-1/2 w-0.5 h-[calc(100%+24px)] bg-purple-400"></div>
                     )}

                     {/* 3. Incoming Line from Tier 1 (Item 1 only) */}
                     {step >= 3 && i === 1 && (
                        <div className="absolute right-[100%] mr-[24px] top-1/2 -translate-y-1/2 w-[100px] h-0.5 bg-purple-400">
                           {/* Cascade Label */}
                           <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-20">
                              <span className="bg-purple-600 text-white text-[8px] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 whitespace-nowrap">
                                 Cascade <ArrowRight size={8}/>
                              </span>
                           </div>
                        </div>
                     )}

                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center border z-10 ${step >= 3 ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-100 border-slate-200'}`}>
                        <Cpu size={18} />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-600">IPC {i}</span>
                        <span className="text-[8px] text-slate-400">Line Manager</span>
                     </div>
                     {step >= 3 && <CheckCircle2 size={12} className="text-green-500 ml-auto" />}
                  </div>
               ))}
            </div>
         </div>
      </div>

      <style>{`
        @keyframes slide-right-deploy { 
           0% { transform: translateX(0); opacity: 0; } 
           20% { opacity: 1; }
           80% { opacity: 1; }
           100% { transform: translateX(120px); opacity: 0; } 
        }
        .animate-slide-right-deploy { animation: slide-right-deploy 2s infinite; }
      `}</style>

    </div>
  );
};

// --- Text Helpers ---
const getAsIsTitle = (step) => {
  const titles = {
    1: "1. 配置上傳 (Upload Config)",
    2: "2. 人工斷點 (Manual Handover)",
    3: "3. 平台上傳 (Upload to EAP)",
    4: "4. 統一派發 (Deploy to Line)"
  };
  return titles[step] || "";
};

const getAsIsDesc = (step) => {
  const descs = {
    1: "開發完成後，Image 進 Harbor，但 Config 必須手動上傳至 SharePoint (或其他網盤)。",
    2: "運維 (Ops) 需要手動下載 Config 並進行確認，這裡是最容易出錯的「人工斷點」。",
    3: "Ops 確認無誤後，登入 Factory EAP (K8s 平台) 的管理介面，上傳應用程式。",
    4: "EAP 透過 K8s 統一對底下的 Line Manager (IPCs) 進行應用程式更新。",
  };
  return descs[step] || "";
};

const getToBeTitle = (step) => {
  const titles = {
    1: "1. 供應商部署 (Vendor to Tier 1)",
    2: "2. 內部資產活化 (Internal Asset)",
    3: "3. 拓樸延伸 (Cascading)",
    4: "4. 全面連通 (Full Connectivity)"
  };
  return titles[step] || "";
};

const getToBeDesc = (step) => {
  const descs = {
    1: "畫面左側：供應商將基礎平台更新推送至客戶端的 Tier 1 Factory Node (作為 Agent 接收)。",
    2: "畫面中間：客戶內部開發者 (Internal Dev) 由下而上將二次開發成果直接部署到 Internal Hub。",
    3: "畫面右側：Internal Hub 成為新的管理核心，向下對 Tier 2 (Line IPCs) 進行自動化部署。這是架構的自我複製。",
    4: "最終形態：形成 供應商 -> 廠級 -> 線級 的完整遞迴生態系。每一層都具備完整的管理能力。",
  };
  return descs[step] || "";
};

function App() {
  return <DistrComparison />; 
}

export default App;
