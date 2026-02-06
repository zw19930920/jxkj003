import { Product, Scenario, TechLayer } from './types';

export const NAV_LINKS = [
  { label: '产品分类', key: 'products' },
  { label: '定制业务', key: 'custom' },
  { label: '关于我们', key: 'about' },
  { label: '联系我们', key: 'contact' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'pod-s',
    name: 'Silence Pod S',
    model: 'S1-Solo',
    series: 'S',
    desc: '专为个人专注设计。紧凑的空间，无限的思维延伸。',
    specs: [
      { label: '-35dB', text: '隔音量' },
      { label: '60x/h', text: '空气置换' },
      { label: '4000K', text: '智能护眼' }
    ],
    image: 'https://picsum.photos/600/800?random=1',
  },
  {
    id: 'pod-m',
    name: 'Silence Pod M',
    model: 'M2-Meeting',
    series: 'M',
    desc: '商务洽谈的理想场所。双人对坐，隔绝干扰。',
    specs: [
      { label: '-40dB', text: '隔音量' },
      { label: '80x/h', text: '空气置换' },
      { label: 'Smart', text: '可调色温' }
    ],
    image: 'https://picsum.photos/600/800?random=2',
  },
  {
    id: 'pod-l',
    name: 'Silence Pod L',
    model: 'L4-Studio',
    series: 'L',
    desc: '团队协作的静音堡垒。容纳四人会议，思维无界。',
    specs: [
      { label: '-45dB', text: '隔音量' },
      { label: '120x/h', text: '空气置换' },
      { label: 'Pano', text: '全景天光' }
    ],
    image: 'https://picsum.photos/600/800?random=3',
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'office',
    title: '开放式办公',
    description: '在嘈杂的开放办公区，通过静音舱创造即时的私密会议空间，提升团队效率。',
    image: 'https://picsum.photos/1200/800?random=10',
    category: 'Commercial',
  },
  {
    id: 'airport',
    title: '交通枢纽',
    description: '在繁忙的机场与车站，为旅客提供一方能够安睡或处理紧急工作的净土。',
    image: 'https://picsum.photos/1200/800?random=11',
    category: 'Commercial',
  },
  {
    id: 'home',
    title: '家庭音乐室',
    description: '尽情演奏，互不打扰。为乐器练习和家庭录音提供专业级声学环境。',
    image: 'https://picsum.photos/1200/800?random=12',
    category: 'Home',
  },
];

export const TECH_LAYERS: TechLayer[] = [
  {
    id: 1,
    title: '高密度碳金板',
    description: '外层采用高强度碳金复合材料，表面氟碳喷涂，提供卓越的结构强度与第一道隔音防线。',
    // Zinc/Slate for dark metallic look
    color: 'bg-zinc-800/90 border-zinc-600'
  },
  {
    id: 2,
    title: '多层阻尼隔音毡',
    description: '高分子复合阻尼材料，有效抑制板材共振，针对性阻隔中低频噪音穿透。',
    // Darker, rubbery look
    color: 'bg-slate-700/80 border-slate-500'
  },
  {
    id: 3,
    title: '声学吸音棉',
    description: '高密度环保聚酯纤维，多孔结构高效吸收舱内回声，还原纯净人声。',
    // Light, airy look
    color: 'bg-gray-200/60 border-gray-300'
  },
  {
    id: 4,
    title: '多层实木板',
    description: '精选多层实木高压成型，结构稳固环保，为静谧空间注入自然温润的质感。',
    // Warm wood tone
    color: 'bg-amber-700/80 border-amber-600'
  }
];