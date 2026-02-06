import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck, Ruler, Layers, Palette, Plus, X, Zap, Box, Image as ImageIcon } from 'lucide-react';
import Button from './Button';
import Footer from './Footer';
import ThreePod from './ThreePod';
import { useData, getIconByName } from '../contexts/DataContext';

// --- Types & Data ---

const SIZES = [
  { id: 'S', label: 'Solo', desc: '1.2m x 1.2m', area: '1.44m²', people: '1 Person' },
  { id: 'M', label: 'Meeting', desc: '2.1m x 1.4m', area: '2.94m²', people: '2-3 People' },
  { id: 'L', label: 'Studio', desc: '2.4m x 2.2m', area: '5.28m²', people: '4-6 People' }
];

// --- Sub-components ---

const InputField = ({ label, type = "text", placeholder = "", value, onChange, required = false }: any) => (
    <div className="relative group">
        <input 
            type={type} 
            className="w-full bg-transparent border-b border-slate-300 py-3 text-lg text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 transition-colors"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
        />
        <label className="absolute -top-3 left-0 text-xs text-slate-500 font-medium">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 group-focus-within:w-full transition-all duration-500" />
    </div>
);

const Configurator: React.FC = () => {
    const { customData } = useData();
    const [size, setSize] = useState(SIZES[0]);
    // Default to first color if available, otherwise fallback
    const [color, setColor] = useState(customData.colors[0] || { id: 'white', name: 'White', hex: '#FFFFFF' });
    
    // Find matching image for Size + Color
    const matchingImage = customData.configImages?.find(
        img => img.sizeId === size.id && img.colorId === color.id
    );

    // Ensure we have a fallback image if no match
    const displayImage = matchingImage?.imageUrl || "https://picsum.photos/800/800?grayscale&blur=2";

    useEffect(() => {
        // Sync color if customData changes (e.g. initial load or admin update)
        if (customData.colors.length > 0 && !customData.colors.find(c => c.id === color.id)) {
            setColor(customData.colors[0]);
        }
    }, [customData.colors]);

    return (
        <div className="flex flex-col min-h-[60vh] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200/50">
            {/* Header: Moved to Top */}
            <div className="w-full bg-white pt-10 pb-4 px-8 text-center z-20">
                <span className="text-blue-600 font-bold text-xs tracking-widest uppercase mb-2 block">Configuration</span>
                <h2 className="text-3xl font-bold text-slate-900">模块化灵感，由您驱动</h2>
            </div>

            {/* Middle: Visualizer (Split into Image and 3D) */}
            <div className="flex-1 relative flex flex-col md:flex-row border-y border-slate-200/50 min-h-[400px]">
                
                {/* 1. Image View */}
                <div className="flex-1 bg-[#F5F5F7] relative flex items-center justify-center p-8 border-r border-slate-200/50 min-h-[300px]">
                     <div className="absolute top-4 left-4 z-10">
                        <span className="flex items-center gap-2 px-3 py-1 bg-white/50 backdrop-blur rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <ImageIcon size={14} /> Style Preview
                        </span>
                     </div>
                     <motion.img 
                        key={`${size.id}-${color.id}`}
                        src={displayImage}
                        alt={`${size.label} - ${color.name}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full object-contain max-h-[320px] drop-shadow-xl"
                     />
                     <p className="absolute bottom-4 text-[10px] text-slate-400 text-center">图片为样式展示，仅供参考实际尺寸与具体样式请联系我们</p>
                </div>

                {/* 2. 3D Model View */}
                <div className="flex-1 bg-[#F0F2F5] relative min-h-[300px]">
                     <div className="absolute top-4 left-4 z-10">
                        <span className="flex items-center gap-2 px-3 py-1 bg-white/50 backdrop-blur rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <Box size={14} /> 3D Model
                        </span>
                     </div>
                     {/* Pass series S/M/L to ThreePod, disable interaction */}
                     <ThreePod series={size.id as 'S' | 'M' | 'L'} allowInteraction={false} />
                </div>

            </div>

            {/* Bottom: Controls */}
            <div className="w-full bg-white p-6 lg:p-10 flex flex-col z-20">
                <div className="flex flex-col lg:flex-row gap-8 justify-center">
                    {/* Size Control */}
                    <div className="flex-1 max-w-lg mx-auto w-full">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-4 justify-center lg:justify-start">
                            <Ruler size={16} /> 空间尺寸
                        </label>
                        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
                            {SIZES.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setSize(s)}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                        size.id === s.id 
                                        ? 'bg-white text-slate-900 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                        <div className="mt-3 flex justify-between text-xs text-slate-500 px-1">
                            <span>{size.people}</span>
                            <span>{size.area}</span>
                        </div>
                    </div>

                    {/* Color Control (Dynamic) */}
                    <div className="flex-1 max-w-lg mx-auto w-full">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-4 justify-center lg:justify-start">
                            <Palette size={16} /> 外观涂装
                        </label>
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            {customData.colors.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setColor(c)}
                                    className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                                        color.id === c.id ? 'border-blue-500 scale-110' : 'border-transparent hover:scale-105'
                                    }`}
                                    title={c.name}
                                >
                                    <div 
                                        className="w-full h-full rounded-full border border-slate-200 shadow-sm"
                                        style={{ backgroundColor: c.hex }}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-2 text-center lg:text-left">Selected: {color.name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RetailCustom: React.FC = () => {
    const { customData, addLead } = useData();
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', company: '' });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.phone) {
            alert('请填写姓名和联系电话');
            return;
        }

        addLead({
            name: formData.name,
            phone: formData.phone,
            email: formData.email || '',
            company: formData.company || '',
            message: "客户从【零售定制页面】提交了咨询申请。",
            source: 'CustomPage'
        });
        alert("申请已提交！我们会尽快与您联系。");
        setFormOpen(false);
        setFormData({ name: '', phone: '', email: '', company: '' });
    };

    return (
        <div className="bg-[#F5F5F7] min-h-screen">
            
            {/* 1. Hero Section */}
            <section className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-white to-slate-200 opacity-80" />
                    {/* Abstract ambient shapes */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-[100px] animate-pulse-slow" />
                </div>
                
                <div className="relative z-10 text-center px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-[#1D1D1F] tracking-tight mb-6">
                            不是在购买一件产品<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-400">
                                而是在构建一种秩序
                            </span>
                        </h1>
                        <p className="text-xl text-slate-500 mt-8 max-w-2xl mx-auto">
                            QE-SPACE 定制业务，为您提供模块化的灵感解决方案。
                            从色彩到材质，从功能到配件，一切由您定义。
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. Configurator Section (Sticky) */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <Configurator />
            </section>

            {/* 3. Why Custom - Flip Cards */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">为什么要定制？</h2>
                        <p className="text-slate-500">为独特的需求，提供唯一的解。</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(customData.whyCustomItems || []).map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30, rotateX: 15 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: idx * 0.2 }}
                                className="group perspective-1000 h-80"
                            >
                                <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180 bg-slate-50 rounded-2xl border border-slate-100">
                                    {/* Front */}
                                    <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 text-center">
                                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 text-slate-900 transform group-hover:scale-110 transition-transform">
                                            {/* Dynamic Icon Rendering */}
                                            {getIconByName(item.icon, 32)}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                        <div className="w-8 h-1 bg-slate-200 mt-4 rounded-full" />
                                    </div>
                                    {/* Back */}
                                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-white">
                                        <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                                        <p className="text-slate-300 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Contact CTA */}
            <section className="py-32 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-5xl font-bold text-slate-900 mb-8">准备好开始了吗？</h2>
                    <p className="text-xl text-slate-500 mb-12">
                        无论您是需要一个私密的角落，还是为整个园区规划静音方案，我们都准备好了。
                    </p>
                    <Button onClick={() => setFormOpen(true)} className="px-16 py-4 text-lg">
                        开启您的定制旅程
                    </Button>
                </div>
            </section>

            {/* 5. Modal Form */}
            <AnimatePresence>
                {formOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        {/* Backdrop */}
                        <div 
                            className="absolute inset-0 bg-white/60 backdrop-blur-xl" 
                            onClick={() => setFormOpen(false)} 
                        />
                        
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl p-8 md:p-12 overflow-hidden border border-slate-100"
                        >
                            <button 
                                onClick={() => setFormOpen(false)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
                            >
                                <X size={24} className="text-slate-500" />
                            </button>

                            <div className="mb-10">
                                <h3 className="text-3xl font-bold text-slate-900 mb-2">定制咨询</h3>
                                <p className="text-slate-500">填写您的需求，专业声学顾问将在 24 小时内与您联系。</p>
                            </div>

                            <form className="space-y-8" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <InputField label="姓名" placeholder="怎么称呼您" required={true} value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
                                    <InputField label="联系电话" placeholder="您的手机号码" required={true} type="tel" value={formData.phone} onChange={(v: string) => setFormData({...formData, phone: v})} />
                                </div>
                                <InputField label="电子邮箱" placeholder="选填" type="email" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} />
                                <InputField label="公司/机构名称" placeholder="选填" value={formData.company} onChange={(v: string) => setFormData({...formData, company: v})} />
                                
                                <div className="pt-4">
                                    <Button className="w-full text-lg py-4">
                                        提交申请 <ArrowRight size={18} />
                                    </Button>
                                </div>
                            </form>
                            
                            <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                                <p className="text-xs text-slate-400">
                                    提交即表示您同意我们的隐私政策。您的信息将被严格保密。
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Universal Footer */}
            <Footer />
        </div>
    );
};

export default RetailCustom;