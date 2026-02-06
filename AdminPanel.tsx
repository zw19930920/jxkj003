import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { 
    LayoutDashboard, Package, Users, Settings, Image as ImageIcon, 
    Type, X, Plus, Trash2, Save, Search, Check, Copy, ChevronDown, 
    ChevronRight, MoreHorizontal, ExternalLink, Box, Eye, Mail, Upload, FileCode, Monitor,
    Home, Info, PenTool, MessageSquare, MapPin, Calendar, HelpCircle, Palette, Grid, Video, Download, Filter, Target, Lightbulb, Lock, LogOut, Shield
} from 'lucide-react';
import { TimelineItem, LocationItem, FAQItem, SiteConfig, CustomColor, CustomConfigImage, WhyCustomItem, ValueItem, AdminUser } from '../types';

interface AdminPanelProps {
    onClose: () => void;
}

// --- Reusable UI Components for Admin ---

const Card = ({ children, className = '', onClick }: any) => (
    <div 
        onClick={onClick}
        className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}
    >
        {children}
    </div>
);

const Badge = ({ children, color = 'blue' }: any) => {
    const colors: any = {
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        green: 'bg-green-50 text-green-700 border-green-100',
        gray: 'bg-slate-100 text-slate-700 border-slate-200',
        red: 'bg-red-50 text-red-700 border-red-100',
        purple: 'bg-purple-50 text-purple-700 border-purple-100',
        orange: 'bg-orange-50 text-orange-700 border-orange-100',
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${colors[color] || colors.gray}`}>
            {children}
        </span>
    );
};

const Input = ({ label, value, onChange, placeholder, type = "text", className = "" }: any) => (
    <div className={`mb-4 ${className}`}>
        {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>}
        <input 
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
    </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 3 }: any) => (
    <div className="mb-4">
        {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>}
        <textarea 
            rows={rows}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y"
        />
    </div>
);

// --- File Uploader Component ---
const FileUploader = ({ label, value, onChange, accept = "image/*", type = "image", note = "" }: { label: string, value: string, onChange: (val: string) => void, accept?: string, type?: 'image' | 'file' | 'video', note?: string }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset value
        e.target.value = '';

        setIsUploading(true);
        try {
            // Directly read file as Data URL (Base64) without compression
            const reader = new FileReader();
            reader.readAsDataURL(file);
            const base64 = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = (error) => reject(error);
            });
            onChange(base64);
        } catch (err) {
            console.error("Upload failed", err);
            alert("文件读取失败，请重试。");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="mb-6">
             <div className="flex justify-between items-baseline mb-2">
                {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>}
                {note && <span className="text-[10px] text-orange-500 font-medium text-right ml-2">{note}</span>}
             </div>
             
             <div className="flex gap-4 items-start">
                <div className="relative group shrink-0">
                    <div className={`border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center ${type === 'image' || type === 'video' ? 'w-24 h-24 rounded-lg' : 'w-full h-12 rounded-lg px-4'}`}>
                        {value ? (
                            type === 'image' ? (
                                <img src={value} alt="Preview" className="w-full h-full object-cover" />
                            ) : type === 'video' ? (
                                <div className="flex items-center justify-center w-full h-full bg-slate-900 text-white">
                                    <Video size={24} />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-xs text-slate-600 truncate max-w-[200px]">
                                    <FileCode size={16} /> File Loaded
                                </div>
                            )
                        ) : (
                            <span className="text-xs text-slate-400">No file</span>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-3">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept={accept}
                        onChange={handleFileChange}
                    />
                    
                    {/* URL Input */}
                    <div className="relative">
                        <input 
                            type="text" 
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={type === 'image' ? "Paste Image URL or upload..." : "Paste URL or upload..."}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-24 py-2 text-xs focus:outline-none focus:border-blue-500 transition-all"
                        />
                        <div className="absolute right-1 top-1 bottom-1 flex gap-1">
                             <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold uppercase rounded-md flex items-center gap-1 transition-colors"
                            >
                                <Upload size={10} /> {isUploading ? 'Loading...' : 'Upload'}
                            </button>
                        </div>
                    </div>

                    {value && (
                        <button 
                            type="button"
                            onClick={() => onChange('')}
                            className="text-red-500 hover:bg-red-50 text-xs px-2 py-1 rounded transition-colors flex items-center gap-1"
                        >
                            <Trash2 size={12} /> Remove
                        </button>
                    )}
                </div>
             </div>
        </div>
    );
};

// --- Login & Account Components ---

const LoginScreen = ({ onLogin, onCancel }: { onLogin: (p: string, pwd: string) => boolean, onCancel: () => void }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onLogin(phone, password)) {
            setError('');
        } else {
            setError('手机号或密码错误');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-slate-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-xl mx-auto mb-4">Q</div>
                    <h2 className="text-2xl font-bold text-slate-800">后台管理系统</h2>
                    <p className="text-slate-400 text-sm mt-1">请使用管理员账号登录</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">手机号 (Phone)</label>
                        <div className="relative">
                            <input 
                                type="tel" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="输入手机号"
                                required
                            />
                            <Users className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">密码 (Password)</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="输入密码"
                                required
                            />
                            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs bg-red-50 p-2 rounded text-center">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                        登录后台
                    </button>
                </form>

                <button 
                    onClick={onCancel}
                    className="w-full text-slate-400 hover:text-slate-600 text-sm mt-6 text-center"
                >
                    返回首页
                </button>
            </div>
        </div>
    );
};

const AccountsManager = ({ admins, addAdmin, deleteAdmin }: { admins: AdminUser[], addAdmin: (u: Omit<AdminUser, 'id' | 'createdAt'>) => void, deleteAdmin: (id: string) => void }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', phone: '', password: '', role: 'admin' as const });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAdmin.name || !newAdmin.phone || !newAdmin.password) return alert('请填写完整信息');
        
        // Simple check if phone exists
        if (admins.some(a => a.phone === newAdmin.phone)) return alert('该手机号已存在');

        addAdmin(newAdmin);
        setIsAdding(false);
        setNewAdmin({ name: '', phone: '', password: '', role: 'admin' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">账号权限 (Accounts)</h2>
                    <p className="text-sm text-slate-400">管理后台登录人员与权限</p>
                </div>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {isAdding ? <X size={18}/> : <Plus size={18}/>} {isAdding ? '取消' : '添加管理员'}
                </button>
            </div>

            {isAdding && (
                <Card className="p-6 bg-blue-50 border-blue-100">
                    <h3 className="font-bold text-slate-800 mb-4">新增管理员</h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="姓名" value={newAdmin.name} onChange={(v: string) => setNewAdmin({...newAdmin, name: v})} placeholder="例如：王经理" />
                        <Input label="手机号 (登录账号)" value={newAdmin.phone} onChange={(v: string) => setNewAdmin({...newAdmin, phone: v})} placeholder="11位手机号" />
                        <Input label="密码" value={newAdmin.password} onChange={(v: string) => setNewAdmin({...newAdmin, password: v})} placeholder="设置登录密码" type="text" />
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">角色</label>
                            <select 
                                value={newAdmin.role}
                                onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value as 'admin'})}
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="admin">普通管理员 (Admin)</option>
                                <option value="master">超级管理员 (Master)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 pt-2">
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">确认添加</button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-4">
                {admins.map((admin) => (
                    <Card key={admin.id} className="p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${admin.role === 'master' ? 'bg-purple-600' : 'bg-slate-400'}`}>
                                {admin.name.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-slate-900">{admin.name}</h4>
                                    <Badge color={admin.role === 'master' ? 'purple' : 'gray'}>{admin.role}</Badge>
                                </div>
                                <p className="text-sm text-slate-500 font-mono">{admin.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>添加于: {new Date(admin.createdAt).toLocaleDateString()}</span>
                            {admin.role !== 'master' && (
                                <button 
                                    onClick={() => deleteAdmin(admin.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="删除账号"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// --- Main Panel Code (Existing Modules) ---
// Note: I'm reusing the existing Sub-Modules code by reference structure. 
// Ideally I should output the full file content. 
// Below includes DashboardHome, LeadsManager, etc. fully to comply with "Full content of file_1".

const DashboardHome = ({ stats, navigateTo }: any) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">仪表盘 (Dashboard)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-blue-500" onClick={() => navigateTo('contact')}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24} /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">线索总数</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.leads}</p>
                    </div>
                </div>
            </Card>
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-purple-500" onClick={() => navigateTo('products')}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Package size={24} /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">在线产品</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.products}</p>
                    </div>
                </div>
            </Card>
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-orange-500" onClick={() => navigateTo('home')}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><ImageIcon size={24} /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Banner 轮播</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.slides}</p>
                    </div>
                </div>
            </Card>
        </div>
    </div>
);

const LeadsManager = ({ leads, deleteLead }: any) => {
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [filterSource, setFilterSource] = useState('');

    const sources = Array.from(new Set(leads.map((l: any) => l.source))) as string[];

    const handleDateChange = (field: 'start' | 'end', value: string) => {
        const newRange = { ...dateRange, [field]: value };
        if (newRange.start && newRange.end) {
            const start = new Date(newRange.start);
            const end = new Date(newRange.end);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            if (diffDays > 92) {
                alert("时间跨度不能超过3个月 (Time range cannot exceed 3 months)");
                return;
            }
        }
        setDateRange(newRange);
    }

    const filteredLeads = leads.filter((lead: any) => {
        const matchSource = filterSource ? lead.source === filterSource : true;
        let matchDate = true;
        if (dateRange.start || dateRange.end) {
            const d = new Date(lead.createdAt);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const leadDateStr = `${year}-${month}-${day}`;
            if (dateRange.start && leadDateStr < dateRange.start) matchDate = false;
            if (dateRange.end && leadDateStr > dateRange.end) matchDate = false;
        }
        return matchSource && matchDate;
    });

    const getSourceColor = (source: string) => {
        switch(source) {
            case 'ContactPage': return 'blue';
            case 'Footer': return 'gray';
            case 'CustomPage': return 'purple';
            case 'AboutPage': return 'orange';
            case 'ProductPage': return 'green';
            default: return 'gray';
        }
    };

    const handleExport = () => {
        const headers = "提交时间,来源,姓名,公司,邮箱,电话,留言\n";
        const rows = filteredLeads.map((l: any) => 
            `${new Date(l.createdAt).toLocaleString()},${l.source},${l.name},${l.company || ''},${l.email},${l.phone || ''},"${(l.message || '').replace(/"/g, '""')}"`
        ).join("\n");
        const blob = new Blob(["\ufeff" + headers + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `leads_export_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">线索管理 (Leads)</h2>
                    <p className="text-sm text-slate-400">管理来自网站的所有咨询与预约</p>
                 </div>
                 <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                    <div className="relative group">
                        <select 
                            value={filterSource} 
                            onChange={(e) => setFilterSource(e.target.value)}
                            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="">所有来源</option>
                            {sources.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <Filter className="absolute right-2 top-2.5 text-slate-400 pointer-events-none" size={14} />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-2">
                         <span className="text-xs text-slate-400 font-bold whitespace-nowrap pl-1">日期:</span>
                         <input type="date" value={dateRange.start} onChange={(e) => handleDateChange('start', e.target.value)} className="bg-transparent text-slate-700 text-sm py-2 focus:outline-none w-32" />
                        <span className="text-slate-400">-</span>
                        <input type="date" value={dateRange.end} onChange={(e) => handleDateChange('end', e.target.value)} className="bg-transparent text-slate-700 text-sm py-2 focus:outline-none w-32" />
                    </div>
                    <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-md hover:bg-green-700 transition-colors shadow-sm whitespace-nowrap">
                        <Download size={16} /> 导出表格
                    </button>
                 </div>
            </div>
            <Card className="overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">提交时间</th>
                            <th className="px-6 py-4">来源</th>
                            <th className="px-6 py-4">姓名/公司</th>
                            <th className="px-6 py-4">联系方式</th>
                            <th className="px-6 py-4">留言内容</th>
                            <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredLeads.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">暂无符合条件的线索</td></tr>
                        ) : (
                            filteredLeads.map((lead: any) => (
                                <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-slate-600">
                                        <div className="flex flex-col"><span className="font-bold">{new Date(lead.createdAt).toLocaleDateString()}</span><span className="text-xs text-slate-400">{new Date(lead.createdAt).toLocaleTimeString()}</span></div>
                                    </td>
                                    <td className="px-6 py-4"><Badge color={getSourceColor(lead.source)}>{lead.source}</Badge></td>
                                    <td className="px-6 py-4"><p className="font-bold text-slate-900">{lead.name}</p><p className="text-xs text-slate-500">{lead.company || '-'}</p></td>
                                    <td className="px-6 py-4"><div className="flex flex-col gap-1"><div className="flex items-center gap-1.5"><Mail size={12} className="text-slate-400"/> {lead.email || '-'}</div><div className="text-slate-500 font-mono">{lead.phone}</div></div></td>
                                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={lead.message}>{lead.message}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => deleteLead(lead.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

const AboutEditor = ({ aboutData, updateAboutData }: any) => {
    const [tab, setTab] = useState<'video' | 'values' | 'timeline' | 'locations'>('video');
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [editingIndex, setEditingIndex] = useState<number>(-1);

    const [localValues, setLocalValues] = useState<{ vision: ValueItem, mission: ValueItem }>({
        vision: { title: '', description: '' },
        mission: { title: '', description: '' }
    });

    useEffect(() => {
        if (tab === 'video') {
            setEditingItem(aboutData.heroVideoUrl || '');
        } else if (tab === 'values') {
             setLocalValues({
                 vision: aboutData.vision || { title: '我们的愿景', description: '' },
                 mission: aboutData.mission || { title: '我们的使命', description: '' }
             });
             setEditingItem(null);
             setEditingIndex(-1);
        } else {
            setEditingItem(null);
            setEditingIndex(-1);
        }
    }, [tab, aboutData]);

    const selectItem = (item: any, index: number) => {
        setEditingItem(item);
        setEditingIndex(index);
    };

    const handleCreateNew = () => {
        setEditingIndex(-1);
        setEditingItem(tab === 'timeline' 
            ? { year: '2027', title: 'New Event', desc: '' } 
            : { city: 'New City', name: 'Store Name', address: '', phone: '', image: '' }
        );
    };

    const handleSave = () => {
        if (tab === 'values') {
            updateAboutData({
                ...aboutData,
                vision: localValues.vision,
                mission: localValues.mission
            });
            alert('Values saved!');
            return;
        }

        if (!editingItem && tab !== 'video') return;

        if (tab === 'video') {
            updateAboutData({ ...aboutData, heroVideoUrl: editingItem });
            return;
        }

        if (tab === 'timeline') {
            const newList = [...aboutData.timeline];
            if (editingIndex > -1) {
                newList[editingIndex] = editingItem;
            } else {
                newList.push(editingItem);
            }
            updateAboutData({ ...aboutData, timeline: newList });
        } else {
            const newList = [...aboutData.locations];
            if (editingIndex > -1) {
                newList[editingIndex] = editingItem;
            } else {
                newList.push(editingItem);
            }
            updateAboutData({ ...aboutData, locations: newList });
        }
        setEditingItem(null);
        setEditingIndex(-1);
    };

    const handleDelete = (index: number) => {
        if (!window.confirm("确定删除吗？(Confirm Delete?)")) return;

        if (tab === 'timeline') {
            const newList = aboutData.timeline.filter((_: any, i: number) => i !== index);
            updateAboutData({ ...aboutData, timeline: newList });
        } else {
             const newList = aboutData.locations.filter((_: any, i: number) => i !== index);
             updateAboutData({ ...aboutData, locations: newList });
        }
        
        if (editingIndex === index) {
            setEditingItem(null);
            setEditingIndex(-1);
        } else if (editingIndex > index) {
            setEditingIndex(editingIndex - 1);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex gap-4 mb-6 border-b border-slate-200 pb-4 overflow-x-auto">
                <button onClick={() => { setTab('video'); }} className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${tab === 'video' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Banner Video</button>
                <button onClick={() => { setTab('values'); }} className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${tab === 'values' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>愿景使命 (Values)</button>
                <button onClick={() => { setTab('timeline'); setEditingItem(null); setEditingIndex(-1); }} className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${tab === 'timeline' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>品牌轨迹 (Timeline)</button>
                <button onClick={() => { setTab('locations'); setEditingItem(null); setEditingIndex(-1); }} className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${tab === 'locations' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>线下门店 (Locations)</button>
            </div>

            <div className="flex gap-6 h-full overflow-hidden">
                <div className="w-1/3 overflow-y-auto space-y-4 pr-2 pb-20">
                    {(tab !== 'video' && tab !== 'values') && (
                         <button 
                            type="button"
                            onClick={handleCreateNew}
                            className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:border-blue-500 font-bold flex items-center justify-center gap-2"
                        >
                            <Plus size={18} /> 新增项目
                        </button>
                    )}

                    {tab === 'video' && (
                        <Card className="p-4 bg-blue-50 border-l-4 border-l-blue-500 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Video size={20} className="text-blue-600" />
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Hero Video</h4>
                                    <p className="text-xs text-slate-500">Global background</p>
                                </div>
                            </div>
                        </Card>
                    )}
                    
                    {tab === 'values' && (
                        <Card className="p-4 bg-blue-50 border-l-4 border-l-blue-500 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Target size={20} className="text-blue-600" />
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Vision & Mission</h4>
                                    <p className="text-xs text-slate-500">Core Brand Values</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {tab === 'timeline' && aboutData.timeline.map((t: TimelineItem, i: number) => (
                        <Card 
                            key={i} 
                            className={`overflow-hidden group cursor-pointer border-l-4 transition-all ${editingIndex === i ? 'border-l-blue-500 bg-blue-50' : 'border-l-transparent hover:border-l-blue-300'}`} 
                            onClick={() => selectItem(t, i)}
                        >
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <Calendar size={16} className="text-blue-500"/>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">{t.year}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-1">{t.title}</p>
                                    </div>
                                </div>
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(i); }} className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-slate-50"><Trash2 size={16} /></button>
                            </div>
                        </Card>
                    ))}
                    {tab === 'locations' && aboutData.locations.map((l: LocationItem, i: number) => (
                        <Card 
                            key={i} 
                            className={`overflow-hidden group cursor-pointer border-l-4 transition-all ${editingIndex === i ? 'border-l-blue-500 bg-blue-50' : 'border-l-transparent hover:border-l-blue-300'}`} 
                            onClick={() => selectItem(l, i)}
                        >
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <MapPin size={16} className="text-orange-500"/>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">{l.city}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-1">{l.name}</p>
                                    </div>
                                </div>
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(i); }} className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-slate-50"><Trash2 size={16} /></button>
                            </div>
                        </Card>
                    ))}
                </div>
                <div className="w-2/3 h-full overflow-y-auto pb-20">
                    {tab === 'video' ? (
                        <Card className="p-6 space-y-6">
                             <h3 className="font-bold text-lg mb-4">Edit About Us Hero Video</h3>
                             <FileUploader 
                                label="Background Video" 
                                type="video" 
                                accept="video/mp4,video/webm"
                                note="Support: MP4/WEBM | Max: 10MB | Res: 1920x1080 (16:9)"
                                value={editingItem || ''} 
                                onChange={(v) => setEditingItem(v)} 
                             />
                             <button type="button" onClick={handleSave} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Update Video
                            </button>
                        </Card>
                    ) : tab === 'values' ? (
                        <Card className="p-6 space-y-8">
                            <div>
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-700"><Target size={18}/> 愿景 (Vision)</h3>
                                <Input label="Title" value={localValues.vision.title} onChange={(v: string) => setLocalValues({...localValues, vision: {...localValues.vision, title: v}})} />
                                <TextArea label="Description" value={localValues.vision.description} onChange={(v: string) => setLocalValues({...localValues, vision: {...localValues.vision, description: v}})} />
                            </div>
                            <hr className="border-slate-100" />
                            <div>
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-700"><Lightbulb size={18}/> 使命 (Mission)</h3>
                                <Input label="Title" value={localValues.mission.title} onChange={(v: string) => setLocalValues({...localValues, mission: {...localValues.mission, title: v}})} />
                                <TextArea label="Description" value={localValues.mission.description} onChange={(v: string) => setLocalValues({...localValues, mission: {...localValues.mission, description: v}})} />
                            </div>
                             <button type="button" onClick={handleSave} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                保存 (Save Values)
                            </button>
                        </Card>
                    ) : editingItem ? (
                        <Card className="p-6 space-y-6">
                            <h3 className="font-bold text-lg mb-4">
                                {tab === 'timeline' ? `编辑时间节点 ${editingIndex > -1 ? '' : '(New)'}` : `编辑门店信息 ${editingIndex > -1 ? '' : '(New)'}`}
                            </h3>
                            {tab === 'timeline' ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Year" value={editingItem.year} onChange={(v: string) => setEditingItem({...editingItem, year: v})} />
                                        <Input label="Title" value={editingItem.title} onChange={(v: string) => setEditingItem({...editingItem, title: v})} />
                                    </div>
                                    <TextArea label="Description" value={editingItem.desc} onChange={(v: string) => setEditingItem({...editingItem, desc: v})} />
                                </>
                            ) : (
                                <>
                                    <FileUploader 
                                        label="Store Image" 
                                        note="Support: JPG/PNG/WEBP | Max: 2MB | Rec: 800x600 px" 
                                        value={editingItem.image} 
                                        onChange={(v) => setEditingItem({...editingItem, image: v})} 
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="City" value={editingItem.city} onChange={(v: string) => setEditingItem({...editingItem, city: v})} />
                                        <Input label="Store Name" value={editingItem.name} onChange={(v: string) => setEditingItem({...editingItem, name: v})} />
                                    </div>
                                    <Input label="Address" value={editingItem.address} onChange={(v: string) => setEditingItem({...editingItem, address: v})} />
                                    <Input label="Phone" value={editingItem.phone || ''} onChange={(v: string) => setEditingItem({...editingItem, phone: v})} placeholder="例如: 021-62888888" />
                                </>
                            )}
                            <button type="button" onClick={handleSave} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                {editingIndex > -1 ? '保存 (Update)' : '创建 (Create)'}
                            </button>
                        </Card>
                    ) : <div className="text-slate-400 text-center mt-10">从左侧选择一个项目进行编辑</div>}
                </div>
            </div>
        </div>
    );
};

const HomeEditor = ({ slides, updateSlides, scenarios, updateScenarios, categories, updateCategories }: any) => {
    const [tab, setTab] = useState<'hero' | 'scenarios' | 'matrix'>('hero');
    const [editingItem, setEditingItem] = useState<any | null>(null);

    const handleSaveSlide = (slide: any) => {
        const newSlides = slide.id ? slides.map((s: any) => s.id === slide.id ? slide : s) : [...slides, { ...slide, id: Date.now() }];
        updateSlides(newSlides); setEditingItem(null);
    };
    const handleDeleteSlide = (id: number) => { if(window.confirm('Delete Slide?')) updateSlides(slides.filter((s: any) => s.id !== id)); if (editingItem?.id === id) setEditingItem(null); };

    const handleSaveScenario = (item: any) => {
        const newItems = item.id ? scenarios.map((s: any) => s.id === item.id ? item : s) : [...scenarios, { ...item, id: `sc-${Date.now()}` }];
        updateScenarios(newItems); setEditingItem(null);
    };
    const handleDeleteScenario = (id: string) => { if(window.confirm('Delete Scenario?')) updateScenarios(scenarios.filter((s: any) => s.id !== id)); if (editingItem?.id === id) setEditingItem(null); }

    const handleSaveMatrixCat = (cat: any) => { const newCats = categories.map((c: any) => c.id === cat.id ? cat : c); updateCategories(newCats); setEditingItem(null); };
    const handleDeleteMatrixCat = (id: string) => { if(window.confirm('Delete Category?')) updateCategories(categories.filter((c: any) => c.id !== id)); if (editingItem?.id === id) setEditingItem(null); }

    return (
        <div className="h-full flex flex-col">
            <div className="flex gap-4 mb-6 border-b border-slate-200 pb-4">
                <button onClick={() => { setTab('hero'); setEditingItem(null); }} className={`text-sm font-bold px-4 py-2 rounded-lg ${tab === 'hero' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Banner (Hero)</button>
                <button onClick={() => { setTab('scenarios'); setEditingItem(null); }} className={`text-sm font-bold px-4 py-2 rounded-lg ${tab === 'scenarios' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>场景 (Scenarios)</button>
                <button onClick={() => { setTab('matrix'); setEditingItem(null); }} className={`text-sm font-bold px-4 py-2 rounded-lg ${tab === 'matrix' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>矩阵 (Matrix)</button>
            </div>
            <div className="flex gap-6 h-full overflow-hidden">
                <div className="w-1/3 overflow-y-auto space-y-4 pr-2 pb-20">
                    {tab !== 'matrix' && <button type="button" onClick={() => setEditingItem(tab === 'hero' ? { title: 'New Slide', desc: '', tag: '', image: '' } : { title: 'New Scenario', description: '', category: 'Commercial', image: '' })} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:border-blue-500 flex justify-center gap-2"><Plus size={18} /> Add</button>}
                    {tab === 'hero' && slides.map((slide: any) => <Card key={slide.id} className="cursor-pointer hover:border-blue-500" onClick={() => setEditingItem(slide)}><div className="flex gap-4 p-4 items-center"><img src={slide.image} className="w-16 h-10 object-cover rounded bg-slate-100"/><div><h4 className="font-bold text-xs truncate w-32">{slide.tag}</h4></div><button onClick={(e) => {e.stopPropagation(); handleDeleteSlide(slide.id)}} className="ml-auto text-slate-300 hover:text-red-500"><Trash2 size={16}/></button></div></Card>)}
                    {tab === 'scenarios' && scenarios.map((s: any) => <Card key={s.id} className="cursor-pointer hover:border-blue-500" onClick={() => setEditingItem(s)}><div className="flex gap-4 p-4 items-center"><img src={s.image} className="w-16 h-10 object-cover rounded bg-slate-100"/><div><h4 className="font-bold text-xs truncate w-32">{s.title}</h4></div><button onClick={(e) => {e.stopPropagation(); handleDeleteScenario(s.id)}} className="ml-auto text-slate-300 hover:text-red-500"><Trash2 size={16}/></button></div></Card>)}
                    {tab === 'matrix' && categories.slice(0,3).map((cat: any) => <Card key={cat.id} className="cursor-pointer hover:border-blue-500" onClick={() => setEditingItem(cat)}><div className="flex gap-4 p-4 items-center"><img src={cat.coverImage || cat.items[0]?.image} className="w-16 h-10 object-cover rounded bg-slate-100"/><div><h4 className="font-bold text-xs truncate w-32">{cat.title}</h4></div><button onClick={(e) => {e.stopPropagation(); handleDeleteMatrixCat(cat.id)}} className="ml-auto text-slate-300 hover:text-red-500"><Trash2 size={16}/></button></div></Card>)}
                </div>
                <div className="w-2/3 h-full overflow-y-auto pb-20">
                    {editingItem ? <Card className="p-6 space-y-6">
                        {tab === 'hero' && <><FileUploader label="Image" note="Support: JPG/PNG/WEBP | Max: 5MB | Rec: 1920x1080 (16:9)" value={editingItem.image} onChange={(v)=>setEditingItem({...editingItem, image: v})} /><Input label="Title" value={editingItem.title} onChange={(v:string)=>setEditingItem({...editingItem, title: v})} /><Input label="Tag" value={editingItem.tag} onChange={(v:string)=>setEditingItem({...editingItem, tag: v})} /><TextArea label="Desc" value={editingItem.desc} onChange={(v:string)=>setEditingItem({...editingItem, desc: v})} /><button onClick={()=>handleSaveSlide(editingItem)} className="w-full py-2 bg-blue-600 text-white rounded">Save</button></>}
                        {tab === 'scenarios' && <><FileUploader label="Image" note="Support: JPG/PNG/WEBP | Max: 2MB | Rec: 1200x800 px" value={editingItem.image} onChange={(v)=>setEditingItem({...editingItem, image: v})} /><Input label="Title" value={editingItem.title} onChange={(v:string)=>setEditingItem({...editingItem, title: v})} /><Input label="Category" value={editingItem.category} onChange={(v:string)=>setEditingItem({...editingItem, category: v})} /><TextArea label="Desc" value={editingItem.description} onChange={(v:string)=>setEditingItem({...editingItem, description: v})} /><button onClick={()=>handleSaveScenario(editingItem)} className="w-full py-2 bg-blue-600 text-white rounded">Save</button></>}
                        {tab === 'matrix' && <><FileUploader label="Cover" note="Support: JPG/PNG/WEBP | Max: 2MB | Rec: 800x600 px" value={editingItem.coverImage || editingItem.items?.[0]?.image} onChange={(v)=>setEditingItem({...editingItem, coverImage: v})} /><Input label="Title" value={editingItem.title} onChange={(v:string)=>setEditingItem({...editingItem, title: v})} /><button onClick={()=>handleSaveMatrixCat(editingItem)} className="w-full py-2 bg-blue-600 text-white rounded">Save</button></>}
                    </Card> : <div className="text-center text-slate-400 mt-10">Select an item</div>}
                </div>
            </div>
        </div>
    );
};

const CustomEditor = ({ customData, updateCustomData }: any) => {
    const [tab, setTab] = useState<'faqs' | 'colors' | 'images' | 'why'>('faqs');
    const [editingItem, setEditingItem] = useState<any | null>(null);

    const handleSaveFAQ = (item: any) => { const newList = item.id ? customData.faqs.map((f: any) => f.id === item.id ? item : f) : [...customData.faqs, { ...item, id: Date.now() }]; updateCustomData({ ...customData, faqs: newList }); setEditingItem(null); };
    const handleDeleteFAQ = (id: number) => { if (window.confirm("Confirm?")) updateCustomData({ ...customData, faqs: customData.faqs.filter((f: any) => f.id !== id) }); if (editingItem?.id === id) setEditingItem(null); };

    const handleSaveColor = (item: any) => { const newList = (item.id && customData.colors.find((c: any) => c.id === item.id)) ? customData.colors.map((c: any) => c.id === item.id ? item : c) : [...customData.colors, { ...item, id: item.id || `col-${Date.now()}` }]; updateCustomData({ ...customData, colors: newList }); setEditingItem(null); };
    const handleDeleteColor = (id: string) => { if (window.confirm("Confirm?")) updateCustomData({ ...customData, colors: customData.colors.filter((c: any) => c.id !== id) }); if (editingItem?.id === id) setEditingItem(null); };

    const handleSaveImage = (item: any) => { const existingIndex = customData.configImages.findIndex((img: any) => (item.id && img.id === item.id) || (img.sizeId === item.sizeId && img.colorId === item.colorId)); let newList = [...customData.configImages]; if (existingIndex > -1) newList[existingIndex] = { ...newList[existingIndex], ...item }; else newList.push({ ...item, id: `img-${Date.now()}` }); updateCustomData({ ...customData, configImages: newList }); setEditingItem(null); };
    const handleDeleteImage = (id: string) => { if (window.confirm("Confirm?")) updateCustomData({ ...customData, configImages: customData.configImages.filter((img: any) => img.id !== id) }); if (editingItem?.id === id) setEditingItem(null); };

    const handleSaveWhy = (item: any) => { const currentItems = customData.whyCustomItems || []; const newList = item.id && currentItems.find((w: any) => w.id === item.id) ? currentItems.map((w: any) => w.id === item.id ? item : w) : [...currentItems, { ...item, id: item.id || `why-${Date.now()}` }]; updateCustomData({ ...customData, whyCustomItems: newList }); setEditingItem(null); };
    const handleDeleteWhy = (id: string) => { if (window.confirm("Confirm?")) updateCustomData({ ...customData, whyCustomItems: (customData.whyCustomItems || []).filter((w: any) => w.id !== id) }); if (editingItem?.id === id) setEditingItem(null); };

    return (
        <div className="h-full flex flex-col">
            <div className="flex gap-4 mb-6 border-b border-slate-200 pb-4 overflow-x-auto">
                <button onClick={() => { setTab('faqs'); setEditingItem(null); }} className={`text-sm font-bold px-4 py-2 rounded-lg ${tab === 'faqs' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>FAQ</button>
                <button onClick={() => { setTab('colors'); setEditingItem(null); }} className={`text-sm font-bold px-4 py-2 rounded-lg ${tab === 'colors' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Colors</button>
                <button onClick={() => { setTab('images'); setEditingItem(null); }} className={`text-sm font-bold px-4 py-2 rounded-lg ${tab === 'images' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Images</button>
                <button onClick={() => { setTab('why'); setEditingItem(null); }} className={`text-sm font-bold px-4 py-2 rounded-lg ${tab === 'why' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Why Custom</button>
            </div>
            <div className="flex gap-6 h-full overflow-hidden">
                <div className="w-1/3 overflow-y-auto space-y-3 pr-2 pb-20">
                     <button onClick={() => { if (tab === 'faqs') setEditingItem({ id: 0, q: 'New Q?', a: '', img: '' }); if (tab === 'colors') setEditingItem({ id: '', name: 'New Color', hex: '#000000' }); if (tab === 'images') setEditingItem({ id: '', sizeId: 'S', colorId: customData.colors[0]?.id || '', imageUrl: '' }); if (tab === 'why') setEditingItem({ id: '', title: 'New', desc: '', icon: 'Ruler' }); }} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold flex justify-center gap-2"><Plus size={18} /> Add</button>
                     {tab === 'faqs' && customData.faqs.map((f:any) => <Card key={f.id} className="p-4 cursor-pointer" onClick={() => setEditingItem(f)}><div className="flex justify-between"><p className="text-sm font-bold line-clamp-1">{f.q}</p><Trash2 size={16} className="text-slate-300 hover:text-red-500" onClick={(e:any)=>{e.stopPropagation(); handleDeleteFAQ(f.id)}}/></div></Card>)}
                     {tab === 'colors' && customData.colors.map((c:any) => <Card key={c.id} className="p-4 cursor-pointer" onClick={() => setEditingItem(c)}><div className="flex justify-between items-center"><div className="flex gap-2 items-center"><div className="w-6 h-6 rounded-full border" style={{backgroundColor:c.hex}}/><p className="text-sm font-bold">{c.name}</p></div><Trash2 size={16} className="text-slate-300 hover:text-red-500" onClick={(e:any)=>{e.stopPropagation(); handleDeleteColor(c.id)}}/></div></Card>)}
                     {tab === 'images' && customData.configImages.map((img:any) => <Card key={img.id} className="p-4 cursor-pointer" onClick={() => setEditingItem(img)}><div className="flex justify-between items-center"><div className="flex gap-2 items-center"><img src={img.imageUrl} className="w-10 h-10 rounded object-cover"/><div className="text-xs">Size: {img.sizeId}</div></div><Trash2 size={16} className="text-slate-300 hover:text-red-500" onClick={(e:any)=>{e.stopPropagation(); handleDeleteImage(img.id)}}/></div></Card>)}
                     {tab === 'why' && (customData.whyCustomItems || []).map((w:any) => <Card key={w.id} className="p-4 cursor-pointer" onClick={() => setEditingItem(w)}><div className="flex justify-between"><p className="text-sm font-bold">{w.title}</p><Trash2 size={16} className="text-slate-300 hover:text-red-500" onClick={(e:any)=>{e.stopPropagation(); handleDeleteWhy(w.id)}}/></div></Card>)}
                </div>
                <div className="w-2/3 h-full overflow-y-auto pb-20">
                     {editingItem ? <Card className="p-6 space-y-6">
                        {tab === 'faqs' && <><Input label="Q" value={editingItem.q} onChange={(v:string)=>setEditingItem({...editingItem,q:v})}/><TextArea label="A" value={editingItem.a} onChange={(v:string)=>setEditingItem({...editingItem,a:v})}/><button onClick={()=>handleSaveFAQ(editingItem)} className="w-full py-2 bg-blue-600 text-white rounded">Save</button></>}
                        {tab === 'colors' && <><Input label="Name" value={editingItem.name} onChange={(v:string)=>setEditingItem({...editingItem,name:v})}/><div className="flex gap-4"><input type="color" value={editingItem.hex} onChange={(e)=>setEditingItem({...editingItem,hex:e.target.value})} className="h-10 w-16"/><Input label="Hex" value={editingItem.hex} onChange={(v:string)=>setEditingItem({...editingItem,hex:v})}/></div><button onClick={()=>handleSaveColor(editingItem)} className="w-full py-2 bg-blue-600 text-white rounded">Save</button></>}
                        {tab === 'images' && <><div className="flex gap-4"><select value={editingItem.sizeId} onChange={(e)=>setEditingItem({...editingItem,sizeId:e.target.value})} className="border p-2 rounded"><option value="S">S</option><option value="M">M</option><option value="L">L</option></select><select value={editingItem.colorId} onChange={(e)=>setEditingItem({...editingItem,colorId:e.target.value})} className="border p-2 rounded">{customData.colors.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div><FileUploader label="Image" note="Support: JPG/PNG/WEBP | Max: 2MB | Rec: 800x800 px (Transparent)" value={editingItem.imageUrl} onChange={(v)=>setEditingItem({...editingItem,imageUrl:v})}/><button onClick={()=>handleSaveImage(editingItem)} className="w-full py-2 bg-blue-600 text-white rounded">Save</button></>}
                        {tab === 'why' && <><Input label="Title" value={editingItem.title} onChange={(v:string)=>setEditingItem({...editingItem,title:v})}/><TextArea label="Desc" value={editingItem.desc} onChange={(v:string)=>setEditingItem({...editingItem,desc:v})}/><Input label="Icon" value={editingItem.icon} onChange={(v:string)=>setEditingItem({...editingItem,icon:v})}/><button onClick={()=>handleSaveWhy(editingItem)} className="w-full py-2 bg-blue-600 text-white rounded">Save</button></>}
                     </Card> : <div className="text-center text-slate-400 mt-10">Select item</div>}
                </div>
            </div>
        </div>
    );
};

const SettingsManager = ({ siteConfig, updateSiteConfig }: any) => {
    const [localConfig, setLocalConfig] = useState<SiteConfig>(siteConfig);
    const [isSaved, setIsSaved] = useState(false);
    useEffect(() => { setLocalConfig(siteConfig); }, [siteConfig]);
    const handleSave = () => { updateSiteConfig(localConfig); setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); };

    return (
        <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">全局设置</h2>
            <Card className="p-6 space-y-6">
                <Input label="Site Name" value={localConfig.siteName} onChange={(v: string) => setLocalConfig({...localConfig, siteName: v})} />
                <FileUploader label="Logo" note="Support: PNG/SVG | Max: 1MB | Rec: 512x512 px" value={localConfig.logoUrl} onChange={(v) => setLocalConfig({...localConfig, logoUrl: v})} />
                <Input label="Email" value={localConfig.contactEmail} onChange={(v: string) => setLocalConfig({...localConfig, contactEmail: v})} />
                <Input label="Address" value={localConfig.address || ''} onChange={(v: string) => setLocalConfig({...localConfig, address: v})} />
                <Input label="Phone" value={localConfig.phone || ''} onChange={(v: string) => setLocalConfig({...localConfig, phone: v})} />
                <button type="button" onClick={handleSave} className={`w-full py-3 rounded-lg font-bold text-white transition-all ${isSaved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}>{isSaved ? 'Saved!' : 'Save Settings'}</button>
            </Card>
        </div>
    );
};

const ProductEditor = ({ categories, updateCategories }: any) => {
    const [expandedCat, setExpandedCat] = useState<string | null>(categories[0]?.id);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);

    const handleSaveProduct = (updatedProduct: any) => { const newCats = categories.map((cat: any) => { const productIndex = cat.items.findIndex((p: any) => p.id === updatedProduct.id); if (productIndex > -1) { const newItems = [...cat.items]; newItems[productIndex] = updatedProduct; return { ...cat, items: newItems }; } return cat; }); updateCategories(newCats); setEditingProduct(null); };
    const handleAddProduct = (catId: string) => { const newProduct = { id: `prod-${Date.now()}`, model: 'New', name: 'Product', series: 'S', price: '0', showPrice: true, desc: 'Desc...', features: [], specs: [{label:'',text:''},{label:'',text:''},{label:'',text:''}], image: '', showOnHome: false }; const newCats = categories.map((cat: any) => cat.id === catId ? { ...cat, items: [newProduct, ...cat.items] } : cat); updateCategories(newCats); setEditingProduct(newProduct); };
    const handleDeleteProduct = (catId: string, prodId: string) => { if (!window.confirm("Delete?")) return; const newCats = categories.map((cat: any) => cat.id === catId ? { ...cat, items: cat.items.filter((p: any) => p.id !== prodId) } : cat); updateCategories(newCats); if (editingProduct?.id === prodId) setEditingProduct(null); };

    return (
        <div className="flex gap-6 h-[calc(100vh-140px)]">
            <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 pb-20">
                {categories.map((cat: any) => (
                    <Card key={cat.id} className="overflow-hidden flex flex-col max-h-[600px]">
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer" onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}>
                            <span className="font-bold">{cat.title}</span> {expandedCat === cat.id ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                        </div>
                        {expandedCat === cat.id && <div className="p-2 space-y-1">
                            {cat.items.map((item: any) => <div key={item.id} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded cursor-pointer" onClick={()=>setEditingProduct(item)}><span className="text-sm">{item.model}</span><Trash2 size={14} className="text-slate-300 hover:text-red-500" onClick={(e)=>{e.stopPropagation(); handleDeleteProduct(cat.id, item.id)}}/></div>)}
                            <button onClick={()=>handleAddProduct(cat.id)} className="w-full text-center text-xs text-blue-600 py-2">+ Add Product</button>
                        </div>}
                    </Card>
                ))}
            </div>
            <div className="w-2/3 h-full overflow-y-auto pb-20">
                {editingProduct ? <Card className="p-6 space-y-4">
                    <h3 className="font-bold">Edit {editingProduct.model}</h3>
                    <div className="grid grid-cols-2 gap-4"><Input label="Model" value={editingProduct.model} onChange={(v:string)=>setEditingProduct({...editingProduct,model:v})}/><Input label="Name" value={editingProduct.name} onChange={(v:string)=>setEditingProduct({...editingProduct,name:v})}/></div>
                    <div className="flex gap-4"><Input label="Price" value={editingProduct.price} onChange={(v:string)=>setEditingProduct({...editingProduct,price:v})}/><label className="flex items-center gap-2"><input type="checkbox" checked={editingProduct.showPrice} onChange={(e)=>setEditingProduct({...editingProduct,showPrice:e.target.checked})}/> Show Price</label><label className="flex items-center gap-2"><input type="checkbox" checked={editingProduct.showOnHome} onChange={(e)=>setEditingProduct({...editingProduct,showOnHome:e.target.checked})}/> Show on Home</label></div>
                    <TextArea label="Desc" value={editingProduct.desc} onChange={(v:string)=>setEditingProduct({...editingProduct,desc:v})}/>
                    <FileUploader label="Image" note="Support: JPG/PNG/WEBP | Max: 2MB | Rec: 800x800 px (Transparent)" value={editingProduct.image} onChange={(v)=>setEditingProduct({...editingProduct,image:v})}/>
                    <div className="space-y-2"><p className="text-xs font-bold">Specs</p>{[0,1,2].map(i=><div key={i} className="flex gap-2"><input className="border p-1 w-1/3" placeholder="Value" value={editingProduct.specs?.[i]?.label||''} onChange={(e)=>{const s=[...(editingProduct.specs||[])];if(!s[i])s[i]={};s[i].label=e.target.value;setEditingProduct({...editingProduct,specs:s})}}/><input className="border p-1 w-2/3" placeholder="Name" value={editingProduct.specs?.[i]?.text||''} onChange={(e)=>{const s=[...(editingProduct.specs||[])];if(!s[i])s[i]={};s[i].text=e.target.value;setEditingProduct({...editingProduct,specs:s})}}/></div>)}</div>
                    <button onClick={()=>handleSaveProduct(editingProduct)} className="w-full py-2 bg-blue-600 text-white rounded">Save</button>
                </Card> : <div className="text-center text-slate-400 mt-10">Select a product</div>}
            </div>
        </div>
    );
};

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
     const { 
        heroSlides, productCategories, scenarios, siteConfig, leads, aboutData, customData, adminUsers,
        updateHeroSlides, updateProductCategories, updateScenarios, updateSiteConfig,
        updateLeadStatus, deleteLead, updateAboutData, updateCustomData, updateAdminUsers
    } = useData();
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
    const [activeModule, setActiveModule] = useState<'dashboard' | 'home' | 'products' | 'custom' | 'about' | 'contact' | 'settings' | 'accounts'>('dashboard');

    // Check for existing session
    useEffect(() => {
        const savedSession = localStorage.getItem('qespace_admin_session');
        if (savedSession) {
            const user = JSON.parse(savedSession);
            // Verify if user still exists in database
            const validUser = adminUsers.find(u => u.phone === user.phone && u.password === user.password);
            if (validUser) {
                setCurrentUser(validUser);
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem('qespace_admin_session');
            }
        }
    }, [adminUsers]);

    const handleLogin = (phone: string, pwd: string) => {
        const user = adminUsers.find(u => u.phone === phone && u.password === pwd);
        if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
            localStorage.setItem('qespace_admin_session', JSON.stringify(user));
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem('qespace_admin_session');
    };

    const handleAddAdmin = (newAdminData: Omit<AdminUser, 'id' | 'createdAt'>) => {
        const newAdmin: AdminUser = {
            ...newAdminData,
            id: `admin-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        updateAdminUsers([...adminUsers, newAdmin]);
    };

    const handleDeleteAdmin = (id: string) => {
        if (id === 'master') return alert('超级管理员账号不可删除');
        if (id === currentUser?.id) return alert('不能删除当前登录账号');
        if (window.confirm('确定删除该管理员账号？')) {
            updateAdminUsers(adminUsers.filter(u => u.id !== id));
        }
    };

    const stats = {
        leads: leads.length,
        products: productCategories.reduce((acc: number, cat: any) => acc + cat.items.length, 0),
        slides: heroSlides.length
    };

    const navigateTo = (module: string) => {
        setActiveModule(module as any);
    };

    const renderContent = () => {
        switch(activeModule) {
            case 'dashboard': return <DashboardHome stats={stats} navigateTo={navigateTo} />;
            case 'home': return <HomeEditor slides={heroSlides} updateSlides={updateHeroSlides} scenarios={scenarios} updateScenarios={updateScenarios} categories={productCategories} updateCategories={updateProductCategories} />;
            case 'products': return <ProductEditor categories={productCategories} updateCategories={updateProductCategories} />;
            case 'custom': return <CustomEditor customData={customData} updateCustomData={updateCustomData} />;
            case 'about': return <AboutEditor aboutData={aboutData} updateAboutData={updateAboutData} />;
            case 'contact': return <LeadsManager leads={leads} deleteLead={deleteLead} />;
            case 'settings': return <SettingsManager siteConfig={siteConfig} updateSiteConfig={updateSiteConfig} />;
            case 'accounts': return <AccountsManager admins={adminUsers} addAdmin={handleAddAdmin} deleteAdmin={handleDeleteAdmin} />;
            default: return <DashboardHome stats={stats} navigateTo={navigateTo} />;
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 z-[100] bg-slate-100 flex font-sans text-slate-600">
                <div className="w-full h-full">
                    <LoginScreen onLogin={handleLogin} onCancel={onClose} />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-slate-100 flex font-sans text-slate-600">
            {/* Sidebar Navigation */}
            <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 transition-all">
                <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shrink-0">Q</div>
                    <span className="ml-3 font-bold text-lg hidden lg:block">QE Admin</span>
                </div>

                <nav className="flex-1 py-6 space-y-2 px-2 lg:px-4 overflow-y-auto">
                    {[
                        { id: 'dashboard', label: '仪表盘 (Dashboard)', icon: LayoutDashboard },
                        { id: 'home', label: '首页配置 (Home)', icon: Home },
                        { id: 'products', label: '产品管理 (Products)', icon: Package },
                        { id: 'custom', label: '零售定制 (Custom)', icon: PenTool },
                        { id: 'about', label: '关于我们 (About)', icon: Info },
                        { id: 'contact', label: '线索管理 (Leads)', icon: MessageSquare },
                        { id: 'accounts', label: '账号权限 (Accounts)', icon: Shield },
                        { id: 'settings', label: '全局设置 (Settings)', icon: Settings },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveModule(item.id as any)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                                activeModule === item.id 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <item.icon size={20} />
                            <span className="hidden lg:block font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <div className="hidden lg:flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                            {currentUser?.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{currentUser?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{currentUser?.role}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                    >
                        <LogOut size={20} />
                        <span className="hidden lg:block font-medium text-sm">注销 (Logout)</span>
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                    >
                        <ExternalLink size={20} />
                        <span className="hidden lg:block font-medium text-sm">退出后台 (Exit)</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
                    <h1 className="text-xl font-bold text-slate-800 capitalize">
                        {activeModule === 'dashboard' && '仪表盘概览'}
                        {activeModule === 'home' && '首页内容配置'}
                        {activeModule === 'products' && '产品库管理'}
                        {activeModule === 'custom' && '定制页面配置'}
                        {activeModule === 'about' && '关于页面配置'}
                        {activeModule === 'contact' && '客户线索管理'}
                        {activeModule === 'accounts' && '管理员账号权限'}
                        {activeModule === 'settings' && '全局站点设置'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"><Users size={16}/></div>
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;