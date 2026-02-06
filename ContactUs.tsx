import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Briefcase, Building2, Globe, User, Lightbulb, X, Send, Check, Loader2, ArrowRight } from 'lucide-react';
import Button from './Button';
import Footer from './Footer';
import { useData } from '../contexts/DataContext';

// --- Data ---
const CATEGORIES = [
  {
    id: 'feedback',
    title: '产品反馈',
    subtitle: 'Product Feedback',
    desc: '售后支持与技术问题反馈',
    icon: <MessageSquare strokeWidth={1.5} />,
    color: 'bg-blue-50'
  },
  {
    id: 'collab',
    title: '品牌合作',
    subtitle: 'Collaboration',
    desc: '市场活动与媒体联络',
    icon: <Briefcase strokeWidth={1.5} />,
    color: 'bg-orange-50'
  },
  {
    id: 'corporate',
    title: '产品采购',
    subtitle: 'Corporate',
    desc: 'B 端大宗采购与定制',
    icon: <Building2 strokeWidth={1.5} />,
    color: 'bg-slate-50'
  },
  {
    id: 'franchise',
    title: '加盟经销',
    subtitle: 'Franchise',
    desc: '成为全球合作伙伴',
    icon: <Globe strokeWidth={1.5} />,
    color: 'bg-indigo-50'
  },
  {
    id: 'personal',
    title: '个人购买',
    subtitle: 'Personal',
    desc: '零售咨询与体验预约',
    icon: <User strokeWidth={1.5} />,
    color: 'bg-green-50'
  },
  {
    id: 'suggestion',
    title: '您的建议',
    subtitle: 'Suggestion',
    desc: '帮助我们做得更好',
    icon: <Lightbulb strokeWidth={1.5} />,
    color: 'bg-yellow-50'
  }
];

// --- Components ---

const SubmitButton: React.FC<{ onClick: () => void; status: 'idle' | 'loading' | 'success' }> = ({ onClick, status }) => {
    return (
        <motion.button
            layout
            onClick={onClick}
            disabled={status !== 'idle'}
            className={`relative h-12 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden ${
                status === 'idle' ? 'w-full bg-slate-900 text-white hover:bg-slate-800' : 
                status === 'loading' ? 'w-12 bg-slate-100' : 
                'w-full bg-green-500 text-white'
            }`}
        >
            <AnimatePresence mode="wait">
                {status === 'idle' && (
                    <motion.span 
                        key="idle"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 font-medium"
                    >
                        发送信息 <Send size={16} />
                    </motion.span>
                )}
                {status === 'loading' && (
                    <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Loader2 className="animate-spin text-slate-900" size={20} />
                    </motion.span>
                )}
                {status === 'success' && (
                    <motion.span
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 font-medium"
                    >
                        <Check size={20} /> 已发送
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

const InputField = ({ label, type = "text", placeholder = "", rows, value, onChange, required = false }: any) => {
    const [focused, setFocused] = useState(false);

    return (
        <div className="relative mt-6">
            <motion.label
                animate={{
                    y: focused || value ? -24 : 0,
                    scale: focused || value ? 0.85 : 1,
                    color: focused ? '#2563EB' : '#94A3B8',
                    originX: 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute left-0 top-3 text-slate-400 pointer-events-none"
            >
                {label} {required && <span className="text-red-500">*</span>}
            </motion.label>
            {rows ? (
                 <textarea
                    rows={rows}
                    className="w-full bg-transparent border-b border-slate-200 py-3 text-slate-900 outline-none transition-colors focus:border-blue-600 resize-none"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => onChange(e.target.value)}
                    value={value}
                />
            ) : (
                <input
                    type={type}
                    className="w-full bg-transparent border-b border-slate-200 py-3 text-slate-900 outline-none transition-colors focus:border-blue-600"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => onChange(e.target.value)}
                    value={value}
                />
            )}
        </div>
    );
};

const WorldMap: React.FC = () => {
    return (
        <div className="relative w-full aspect-[2/1] max-w-5xl mx-auto mt-8">
             <div className="absolute inset-0 flex items-center justify-center">
                 <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2560px-World_map_blank_without_borders.svg.png" 
                    alt="World Map" 
                    className="w-full h-full object-contain opacity-20 filter grayscale contrast-125"
                 />
             </div>
             
             {/* Simple Pulse Dots for Key Cities (Optional) */}
             {[
                 { t: 'top-[35%]', l: 'left-[22%]' }, // NY
                 { t: 'top-[28%]', l: 'left-[49%]' }, // London
                 { t: 'top-[38%]', l: 'left-[82%]' }, // Tokyo
                 { t: 'top-[42%]', l: 'left-[79%]' }, // Shanghai
             ].map((pos, i) => (
                 <div key={i} className={`absolute ${pos.t} ${pos.l} w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50`}>
                     <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" />
                 </div>
             ))}

            <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5F7] to-transparent h-1/2 bottom-0 pointer-events-none" />
        </div>
    );
};

const ContactUs: React.FC = () => {
    const { addLead } = useData();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [formState, setFormState] = useState({ name: '', company: '', email: '', phone: '', message: '' });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = () => {
        // Validation: Phone is required
        if (!formState.name || !formState.phone) return;

        setSubmitStatus('loading');
        setTimeout(() => {
            addLead({
                name: formState.name,
                company: formState.company || '',
                email: formState.email || '',
                phone: formState.phone,
                message: formState.message || '',
                source: 'ContactPage'
            });
            setSubmitStatus('success');
            // Reset form after delay
            setTimeout(() => {
                setSubmitStatus('idle');
                setSelectedId(null);
                setFormState({ name: '', company: '', email: '', phone: '', message: '' });
            }, 2000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] pt-32 pb-12 overflow-x-hidden font-sans">
            
            {/* Header */}
            <div className="container mx-auto px-6 text-center mb-16">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight"
                >
                    倾听，是静谧的开始。
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-light"
                >
                    无论您是寻求专业的技术支持，还是探索未来的商业合作，<br className="hidden md:block"/>
                    QE.SPACE 团队都期待与您进行深度对话。
                </motion.p>
            </div>

            {/* Main Interactive Grid / Form Area */}
            <div className="container mx-auto px-6 relative min-h-[600px] mb-32">
                <AnimatePresence>
                    {/* Background overlay when form is active */}
                    {selectedId && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedId(null)}
                            className="absolute inset-0 bg-[#F5F5F7]/80 backdrop-blur-sm z-10"
                        />
                    )}
                </AnimatePresence>

                <div className="max-w-6xl mx-auto">
                    {/* The Grid */}
                    <motion.div 
                        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ${selectedId ? 'pointer-events-none' : ''}`}
                    >
                        {CATEGORIES.map((cat) => (
                            <motion.div
                                layoutId={`card-${cat.id}`}
                                key={cat.id}
                                onClick={() => !selectedId && setSelectedId(cat.id)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ 
                                    opacity: selectedId && selectedId !== cat.id ? 0 : 1,
                                    y: 0,
                                    scale: selectedId && selectedId !== cat.id ? 0.95 : 1
                                }}
                                whileHover={!selectedId ? { 
                                    scale: 1.02, 
                                    y: -5,
                                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)"
                                } : {}}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className={`bg-white rounded-3xl p-8 border border-white/50 shadow-sm cursor-pointer relative overflow-hidden group h-64 flex flex-col justify-between ${selectedId === cat.id ? 'z-20 opacity-0' : 'z-0'}`}
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 transition-transform duration-700 group-hover:scale-150 ${cat.color}`} />
                                
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                                        {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 24 })}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{cat.title}</h3>
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{cat.subtitle}</p>
                                </div>
                                
                                <div className="flex justify-between items-end">
                                    <p className="text-sm text-slate-500 max-w-[80%]">{cat.desc}</p>
                                    <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* The Expanded Form */}
                    <AnimatePresence>
                        {selectedId && (
                            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                                <motion.div
                                    layoutId={`card-${selectedId}`}
                                    className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto border border-slate-100"
                                >
                                    <div className="flex flex-col md:flex-row h-full min-h-[500px]">
                                        {/* Sidebar / Header of Form */}
                                        <div className={`md:w-1/3 p-8 ${CATEGORIES.find(c => c.id === selectedId)?.color} bg-opacity-30 flex flex-col justify-between`}>
                                            <div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                                                    className="w-10 h-10 rounded-full bg-white/50 hover:bg-white flex items-center justify-center text-slate-500 transition-colors mb-8"
                                                >
                                                    <X size={20} />
                                                </button>
                                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-900 mb-6">
                                                    {React.cloneElement(CATEGORIES.find(c => c.id === selectedId)?.icon as React.ReactElement<any>, { size: 32 })}
                                                </div>
                                                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                                    {CATEGORIES.find(c => c.id === selectedId)?.title}
                                                </h3>
                                                <p className="text-slate-500 text-sm leading-relaxed">
                                                    {CATEGORIES.find(c => c.id === selectedId)?.desc}
                                                </p>
                                            </div>
                                            <div className="mt-8 md:mt-0">
                                                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Response Time</p>
                                                <p className="text-sm font-semibold text-slate-700">Within 24 Hours</p>
                                            </div>
                                        </div>

                                        {/* Form Fields */}
                                        <div className="flex-1 p-8 md:p-12 flex flex-col">
                                            <div className="space-y-2 flex-1">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <InputField label="姓名" value={formState.name} onChange={(v: string) => setFormState({...formState, name: v})} required={true} />
                                                    <InputField label="公司 (选填)" value={formState.company} onChange={(v: string) => setFormState({...formState, company: v})} />
                                                </div>
                                                <InputField label="邮箱 (选填)" type="email" value={formState.email} onChange={(v: string) => setFormState({...formState, email: v})} />
                                                <InputField label="联系电话" type="tel" value={formState.phone} onChange={(v: string) => setFormState({...formState, phone: v})} required={true} />
                                                <InputField label="详细描述 (选填)" rows={3} value={formState.message} onChange={(v: string) => setFormState({...formState, message: v})} />
                                            </div>
                                            <div className="mt-8">
                                                <SubmitButton onClick={handleSubmit} status={submitStatus} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Global Presence */}
            <section className="py-24 border-t border-slate-200 bg-white relative overflow-hidden">
                 <div className="container mx-auto px-6 text-center relative z-10">
                     <h2 className="text-3xl font-bold text-slate-900 mb-4">全球服务网络</h2>
                     <p className="text-slate-500 mb-12">从硅谷到上海，静谧无处不在。</p>
                     <WorldMap />
                 </div>
            </section>

             {/* Universal Footer */}
             <Footer />
        </div>
    );
};

export default ContactUs;