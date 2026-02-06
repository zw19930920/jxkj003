import React, { createContext, useContext, useState, useEffect } from 'react';
import { Activity, Wind, Maximize, Moon, Music, Layers, Zap, BookOpen, Cpu, Ruler, ShieldCheck, Palette, Image as ImageIcon, Box } from 'lucide-react';
import { Lead, SiteConfig, AboutPageData, CustomPageData, FAQItem, CustomColor, WhyCustomItem, CustomConfigImage, AdminUser } from '../types';

// --- Initial Data Constants ---

const INITIAL_HERO_SLIDES = [
    {
      "id": 1,
      "image": "https://picsum.photos/1920/1080?grayscale&blur=2&random=1",
      "tag": "Future of Silence",
      "title": "在这里，听见宇宙的寂静",
      "desc": "专为开放式环境打造的极致静谧舱。融合航空级隔音技术与极简美学，重塑您的专注力场。"
    },
    {
      "id": 2,
      "image": "https://picsum.photos/1920/1080?grayscale&blur=2&random=2",
      "tag": "Deep Focus",
      "title": "独处，是一种奢侈的能力",
      "desc": "在喧嚣都市中构建您的精神飞地，让每一次思考都深邃如海。"
    },
    {
      "id": 3,
      "image": "https://picsum.photos/1920/1080?grayscale&blur=2&random=3",
      "tag": "Smart Office",
      "title": "未来办公的静音革命",
      "desc": "模块化设计，即装即用。为团队协作注入专注基因，释放无限潜能。"
    }
];

const INITIAL_CATEGORIES = [
    {
      "id": "office",
      "title": "QE.SPACE 办公系列",
      "iconType": "Activity",
      "coverImage": "https://picsum.photos/800/800?random=101",
      "items": [
        {
          "id": "s1",
          "model": "S1-Solo",
          "name": "个人专注舱",
          "price": "¥ 19,800 起",
          "showPrice": true,
          "desc": "为深度工作者打造的独立力场。采用第四代静音架构，将开放办公区的噪音隔绝于外，留住思维的火花。",
          "threeDConfig": { "initialScale": 1, "autoRotate": true },
          "features": ["航空级铝合金框架", "4000K 护眼阅读灯", "每小时 60 次全舱换气"],
          "image": "https://picsum.photos/800/800?random=101",
          "series": "S",
          "specs": [{ "label": "-35dB", "text": "隔音量" }, { "label": "60x/h", "text": "空气置换" }, { "label": "1.2m²", "text": "占地面积" }],
          "showOnHome": true
        },
        {
          "id": "m2",
          "model": "M2-Meeting",
          "name": "双人洽谈舱",
          "price": "¥ 32,800 起",
          "showPrice": true,
          "desc": "高效沟通，拒绝外界干扰。",
          "features": ["双人舒适沙发", "集成电源与 USB 接口", "双层钢化夹胶玻璃"],
          "image": "https://picsum.photos/800/800?random=102",
          "series": "M",
          "specs": [{ "label": "-40dB", "text": "隔音量" }, { "label": "80x/h", "text": "空气置换" }, { "label": "2.4m²", "text": "占地面积" }],
          "showOnHome": true
        },
        {
          "id": "l4",
          "model": "L4-Studio",
          "name": "团队协作舱",
          "price": "¥ 58,800 起",
          "showPrice": true,
          "desc": "激荡创意的静谧会议室。支持 4-6 人小型会议。",
          "features": ["全景落地玻璃", "会议录音级声学内饰", "智能会议预约系统兼容"],
          "image": "https://picsum.photos/800/800?random=103",
          "series": "L",
          "specs": [{ "label": "-45dB", "text": "隔音量" }, { "label": "120x/h", "text": "空气置换" }, { "label": "4.5m²", "text": "占地面积" }],
          "showOnHome": true
        }
      ]
    },
    {
      "id": "home",
      "title": "QE.SPACE 家用系列",
      "iconType": "Moon",
      "coverImage": "https://picsum.photos/800/800?random=201",
      "items": [
        {
          "id": "h-sleep",
          "model": "Sleep Pod",
          "name": "深睡休眠舱",
          "price": "¥ 25,800 起",
          "showPrice": true,
          "desc": "城市中心的五星级睡眠环境。完全遮光设计配合白噪音发生器。",
          "features": ["0 勒克斯全遮光", "助眠白噪音系统", "恒温恒湿控制"],
          "image": "https://picsum.photos/800/800?random=201",
          "series": "S",
          "specs": [{ "label": "Blackout", "text": "全遮光" }, { "label": "Silent", "text": "静音新风" }, { "label": "Low Hz", "text": "低频控制" }],
          "showOnHome": true
        },
        {
          "id": "h-music",
          "model": "Music Pod",
          "name": "私人音乐舱",
          "price": "¥ 45,000 起",
          "showPrice": true,
          "desc": "尽情演奏，不扰邻里。经过专业声学调教的混响时间。",
          "features": ["非平行墙面设计", "悬浮地板减震", "专业音频线材预埋"],
          "image": "https://picsum.photos/800/800?random=203",
          "series": "M",
          "specs": [{ "label": "Acoustic", "text": "声学调教" }, { "label": "Reverb", "text": "混响控制" }, { "label": "-50dB", "text": "极致隔音" }],
          "showOnHome": true
        }
      ]
    },
    {
      "id": "accessories",
      "title": "QE.SPACE 精选配件",
      "iconType": "Cpu",
      "coverImage": "https://picsum.photos/800/800?random=301",
      "items": [
        {
          "id": "a-panel",
          "model": "Smart Panel",
          "name": "智能中控",
          "price": "¥ 2,999",
          "showPrice": true,
          "desc": "一键掌控声光电。支持 App 远程控制与语音指令。",
          "features": ["10寸触控屏", "环境监测传感器", "OTA 在线升级"],
          "image": "https://picsum.photos/800/800?random=301",
          "series": "S",
          "specs": [{ "label": "IoT", "text": "万物互联" }, { "label": "Touch", "text": "多点触控" }, { "label": "Monitor", "text": "实时监测" }],
          "showOnHome": true
        }
      ]
    }
];

const INITIAL_SCENARIOS = [
    {
      "id": "office",
      "title": "开放式办公",
      "description": "在嘈杂的开放办公区，通过静音舱创造即时的私密会议空间，提升团队效率。",
      "image": "https://picsum.photos/1200/800?random=10",
      "category": "Commercial"
    },
    {
      "id": "airport",
      "title": "交通枢纽",
      "description": "在繁忙的机场与车站，为旅客提供一方能够安睡或处理紧急工作的净土。",
      "image": "https://picsum.photos/1200/800?random=11",
      "category": "Commercial"
    },
    {
      "id": "home",
      "title": "家庭音乐室",
      "description": "尽情演奏，互不打扰。为乐器练习和家庭录音提供专业级声学环境。",
      "image": "https://picsum.photos/1200/800?random=12",
      "category": "Home"
    }
];

const INITIAL_SITE_CONFIG: SiteConfig = {
    siteName: 'QE.SPACE',
    seoTitle: 'The Silent Space | 极静空间',
    seoDescription: '专为开放式环境打造的极致静谧舱。融合航空级隔音技术与极简美学，重塑您的专注力场。',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/2919/2919601.png',
    contactEmail: '28583428@qq.com',
    address: '杭州市西湖区中田大厦15F-F',
    phone: '19967322073'
};

const INITIAL_LEADS: Lead[] = [
    { id: '1', name: '张先生', email: 'zhang@example.com', phone: '13800138000', company: '未来科技', message: '对 M2 会议舱感兴趣，需采购 5 台。', source: 'ContactPage', status: 'new', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: '2', name: 'Alice Wu', email: 'alice@design.io', message: '请问有 S1 的 3D 模型吗？', source: 'Footer', status: 'contacted', createdAt: new Date(Date.now() - 172800000).toISOString() }
];

const INITIAL_ABOUT_DATA: AboutPageData = {
    heroVideoUrl: 'https://videos.pexels.com/video-files/855018/855018-hd_1920_1080_30fps.mp4', 
    vision: {
        title: '我们的愿景',
        description: '让宁静成为一种随处可得的生产力，成为全球声学空间的领导者。'
    },
    mission: {
        title: '我们的使命',
        description: '为每一颗忙碌的灵魂打造私属的寂静岛屿，守护专注与创造力。'
    },
    timeline: [
        { year: '2022', title: '实验室成立', desc: '声学材料实验室成立，经过3000次材料测试，突破低厚度中空声学材料问题。' },
        { year: '2023', title: '首款面世', desc: '公司依托自有工厂的研发能力，首款QE-SI静音舱面世。' },
        { year: '2024', title: '产品产销', desc: '公司与多家企业合作推广30个城市【静音舱】产品产销。' },
        { year: '2025', title: 'C端业务开发', desc: '开发C端业务，为解决睡眠人群的静音需求开发第一代睡眠舱QE-SMZ，成功突破隔绝低频与环保健康问题。' },
        { year: '2026', title: '全球化布局', desc: '全球化布局，预计全球服务30个国家。从北京的嘈杂街头到硅谷的科技巨头。' }
    ],
    locations: [
        { city: '北京', name: 'Beijing', address: '北京市朝阳区建国路 87 号', phone: '010-85888888', image: 'https://picsum.photos/400/300?grayscale&random=1' },
        { city: '上海', name: 'Shanghai', address: '上海市静安区南京西路 1515 号', phone: '021-62888888', image: 'https://picsum.photos/400/300?grayscale&random=2' },
        { city: '广州', name: 'Guangzhou', address: '广州市天河区天河路 218 号', phone: '020-38888888', image: 'https://picsum.photos/400/300?grayscale&random=3' }
    ]
};

// Default Master Admin
const INITIAL_ADMIN_USERS: AdminUser[] = [
    {
        id: 'master',
        name: '超级管理员',
        phone: '18675988550',
        password: 'jxkj123456',
        role: 'master',
        createdAt: new Date().toISOString()
    }
];

// Generate default config images mapping for initial state with realistic interior cases
const generateDefaultConfigImages = () => {
  const images = [];
  const sizes = ['S', 'M', 'L'];
  const colors = [
    { id: 'black', hex: '#000000' },
    { id: 'white', hex: '#FFFFFF' },
    { id: 'grey', hex: '#808080' },
    { id: 'red', hex: '#EF4444' },
    { id: 'orange', hex: '#F97316' },
    { id: 'yellow', hex: '#EAB308' },
    { id: 'green', hex: '#22C55E' },
    { id: 'purple', hex: '#A855F7' },
  ];
  
  // Curated list of high-quality Unsplash images representing pods/interiors
  const CASE_IMAGES = {
      S: [ // Personal/Home focus
          'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80'
      ],
      M: [ // Meeting/Office focus
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1504384308090-c54be3855091?auto=format&fit=crop&w=800&q=80'
      ],
      L: [ // Studio/Large focus
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=800&q=80'
      ]
  };
  
  let i = 0;
  for (const size of sizes) {
      for (const color of colors) {
          // Select a style image based on size and rotation
          const pool = CASE_IMAGES[size as 'S' | 'M' | 'L'];
          const selectedImg = pool[i % pool.length];

          images.push({
              id: `img-${size}-${color.id}`,
              sizeId: size as 'S' | 'M' | 'L',
              colorId: color.id,
              // Initial image is a high-quality case study, user can replace via admin
              imageUrl: selectedImg
          });
          i++;
      }
  }
  return images;
};

const INITIAL_CUSTOM_DATA: CustomPageData = {
    faqs: [
        { id: 1, q: '定制周期通常是多久？', a: '标准定制周期为 15-20 个工作日，特殊工艺可能需要额外时间。', img: '' },
        { id: 2, q: '提供上门测量服务吗？', a: '是的，我们为企业客户提供免费的专业上门测量与声学评估服务。', img: '' },
        { id: 3, q: '如何保证隔音效果？', a: '我们采用多层阻尼复合结构，并经过严格的声学实验室测试，确保达到预期的隔音指标。', img: '' }
    ],
    colors: [
        { id: 'black', name: 'Midnight Black', hex: '#000000' },
        { id: 'white', name: 'Polar White', hex: '#FFFFFF' },
        { id: 'grey', name: 'Space Grey', hex: '#808080' },
        { id: 'red', name: 'Mars Red', hex: '#EF4444' },
        { id: 'orange', name: 'Sunset Orange', hex: '#F97316' },
        { id: 'yellow', name: 'Cyber Yellow', hex: '#EAB308' },
        { id: 'green', name: 'Forest Green', hex: '#22C55E' },
        { id: 'purple', name: 'Neon Purple', hex: '#A855F7' }
    ],
    configImages: generateDefaultConfigImages(),
    whyCustomItems: [
        { id: '1', title: '量身定制', desc: '根据您的空间尺寸与风格需求，提供 1v1 专属设计方案。', icon: 'Ruler' },
        { id: '2', title: '环保材料', desc: '全线产品采用 E0 级环保板材，即装即用，无醛无味。', icon: 'ShieldCheck' },
        { id: '3', title: '模块化组装', desc: '乐高式模块化安装，灵活拆卸重组，搬家也能带走。', icon: 'Box' }
    ]
};

interface DataContextType {
  heroSlides: any[];
  productCategories: any[];
  scenarios: any[];
  siteConfig: SiteConfig;
  leads: Lead[];
  aboutData: AboutPageData;
  customData: CustomPageData;
  adminUsers: AdminUser[];
  updateHeroSlides: (slides: any[]) => void;
  updateProductCategories: (categories: any[]) => void;
  updateScenarios: (scenarios: any[]) => void;
  updateSiteConfig: (config: SiteConfig) => void;
  updateAboutData: (data: AboutPageData) => void;
  updateCustomData: (data: CustomPageData) => void;
  updateAdminUsers: (users: AdminUser[]) => void;
  addLead: (lead: Omit<Lead, 'id' | 'status' | 'createdAt'>) => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  deleteLead: (id: string) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to safely set localStorage with error handling
const safeSetItem = (key: string, value: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e: any) {
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            console.error('LocalStorage Limit Exceeded:', e);
            alert(`保存失败！浏览器本地存储空间已满 (LocalStorage Quota Exceeded)。\n\n您上传的图片或数据量过大。\n\n由于您已部署到 Cloudflare，请确保已连接真正的后端数据库 (D1/R2)，否则本地存储无法承载大量高清图片。`);
        } else {
            console.error('LocalStorage Save Error:', e);
        }
    }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heroSlides, setHeroSlides] = useState(INITIAL_HERO_SLIDES);
  const [productCategories, setProductCategories] = useState(INITIAL_CATEGORIES);
  const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS);
  const [siteConfig, setSiteConfig] = useState(INITIAL_SITE_CONFIG);
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [aboutData, setAboutData] = useState(INITIAL_ABOUT_DATA);
  const [customData, setCustomData] = useState(INITIAL_CUSTOM_DATA);
  const [adminUsers, setAdminUsers] = useState(INITIAL_ADMIN_USERS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
        const savedHero = localStorage.getItem('qespace_hero');
        const savedProducts = localStorage.getItem('qespace_products');
        const savedScenarios = localStorage.getItem('qespace_scenarios');
        const savedConfig = localStorage.getItem('qespace_config');
        const savedLeads = localStorage.getItem('qespace_leads');
        const savedAbout = localStorage.getItem('qespace_about');
        const savedCustom = localStorage.getItem('qespace_custom');
        const savedAdmins = localStorage.getItem('qespace_admins');

        if (savedHero) setHeroSlides(JSON.parse(savedHero));
        if (savedProducts) setProductCategories(JSON.parse(savedProducts));
        if (savedScenarios) setScenarios(JSON.parse(savedScenarios));
        if (savedConfig) setSiteConfig(JSON.parse(savedConfig));
        if (savedLeads) setLeads(JSON.parse(savedLeads));
        
        if (savedAbout) {
            const parsedAbout = JSON.parse(savedAbout);
            setAboutData({ ...INITIAL_ABOUT_DATA, ...parsedAbout });
        }
        
        if (savedCustom) setCustomData(JSON.parse(savedCustom));
        if (savedAdmins) setAdminUsers(JSON.parse(savedAdmins));
    } catch (e) {
        console.error("Error loading initial data", e);
    }
    
    setIsLoaded(true);
  }, []);

  // Persistence Effects - Using safeSetItem
  useEffect(() => { if (isLoaded) safeSetItem('qespace_hero', heroSlides); }, [heroSlides, isLoaded]);
  useEffect(() => { if (isLoaded) safeSetItem('qespace_products', productCategories); }, [productCategories, isLoaded]);
  useEffect(() => { if (isLoaded) safeSetItem('qespace_scenarios', scenarios); }, [scenarios, isLoaded]);
  useEffect(() => { if (isLoaded) safeSetItem('qespace_config', siteConfig); }, [siteConfig, isLoaded]);
  useEffect(() => { if (isLoaded) safeSetItem('qespace_leads', leads); }, [leads, isLoaded]);
  useEffect(() => { if (isLoaded) safeSetItem('qespace_about', aboutData); }, [aboutData, isLoaded]);
  useEffect(() => { if (isLoaded) safeSetItem('qespace_custom', customData); }, [customData, isLoaded]);
  useEffect(() => { if (isLoaded) safeSetItem('qespace_admins', adminUsers); }, [adminUsers, isLoaded]);

  // Lead Management Actions
  const addLead = (leadData: Omit<Lead, 'id' | 'status' | 'createdAt'>) => {
      const newLead: Lead = {
          ...leadData,
          id: `lead-${Date.now()}`,
          status: 'new',
          createdAt: new Date().toISOString()
      };
      setLeads(prev => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const deleteLead = (id: string) => {
      setLeads(prev => prev.filter(l => l.id !== id));
  };

  const resetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <DataContext.Provider value={{
      heroSlides,
      productCategories,
      scenarios,
      siteConfig,
      leads,
      aboutData,
      customData,
      adminUsers,
      updateHeroSlides: setHeroSlides,
      updateProductCategories: setProductCategories,
      updateScenarios: setScenarios,
      updateSiteConfig: setSiteConfig,
      updateAboutData: setAboutData,
      updateCustomData: setCustomData,
      updateAdminUsers: setAdminUsers,
      addLead,
      updateLeadStatus,
      deleteLead,
      resetData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const getIconByName = (name: string, size: number = 18) => {
    const props = { size };
    switch(name) {
        case 'Activity': return <Activity {...props} />;
        case 'Moon': return <Moon {...props} />;
        case 'Cpu': return <Cpu {...props} />;
        case 'Wind': return <Wind {...props} />;
        case 'Maximize': return <Maximize {...props} />;
        case 'Music': return <Music {...props} />;
        case 'Layers': return <Layers {...props} />;
        case 'Zap': return <Zap {...props} />;
        case 'BookOpen': return <BookOpen {...props} />;
        case 'Ruler': return <Ruler {...props} />;
        case 'ShieldCheck': return <ShieldCheck {...props} />;
        case 'Palette': return <Palette {...props} />;
        case 'ImageIcon': return <ImageIcon {...props} />;
        case 'Box': return <Box {...props} />;
        default: return <Activity {...props} />;
    }
};