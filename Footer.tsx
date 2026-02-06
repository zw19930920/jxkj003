import React, { useState } from 'react';
import Button from './Button';
import { Settings } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface FooterProps {
    onAdminClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const { addLead, siteConfig } = useData();
  const [formState, setFormState] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation: Name and Phone are required
    if (!formState.name || !formState.phone) return;

    addLead({
        name: formState.name,
        phone: formState.phone,
        email: formState.email || '', // Optional
        message: formState.message || '', // Optional
        source: 'Footer'
    });
    
    setSubmitted(true);
    setTimeout(() => {
        setSubmitted(false);
        setFormState({ name: '', phone: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <footer id="contact" className="bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              开启您的<br />静谧之旅
            </h2>
            <p className="text-slate-500 mb-8 max-w-md">
              无论是企业采购还是个人定制，我们的声学专家随时准备为您提供专业建议。
            </p>
            <div className="space-y-4">
                <p className="text-slate-900 font-medium">{siteConfig.address || "杭州市西湖区中田大厦15F-F"}</p>
                <p className="text-slate-900 font-medium">{siteConfig.phone || "19967322073"}</p>
                <p className="text-slate-900 font-medium">{siteConfig.contactEmail || "28583428@qq.com"}</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">提交成功</h3>
                    <p className="text-slate-500 mt-2">我们会尽快与您取得联系。</p>
                </div>
            ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">姓名 <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                required
                                value={formState.name}
                                onChange={e => setFormState({...formState, name: e.target.value})}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">电话 <span className="text-red-500">*</span></label>
                            <input 
                                type="tel" 
                                required
                                value={formState.phone}
                                onChange={e => setFormState({...formState, phone: e.target.value})}
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">邮箱 <span className="text-slate-400 font-normal text-xs">(选填)</span></label>
                        <input 
                            type="email" 
                            value={formState.email}
                            onChange={e => setFormState({...formState, email: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">需求描述 <span className="text-slate-400 font-normal text-xs">(选填)</span></label>
                        <textarea 
                            rows={4} 
                            value={formState.message}
                            onChange={e => setFormState({...formState, message: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                        ></textarea>
                    </div>
                    <Button className="w-full">发送咨询</Button>
                </form>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-12 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>© 2024 The Silent Space. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 items-center">
            <a href="#" className="hover:text-slate-900">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900">Terms of Service</a>
            {onAdminClick && (
                <button 
                    onClick={onAdminClick} 
                    className="opacity-20 hover:opacity-100 transition-opacity flex items-center gap-1 ml-4"
                    title="Admin Panel"
                >
                    <Settings size={14} />
                </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;