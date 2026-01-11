export const CATEGORIES = [
  { id: 'all', name: '全部', icon: '🎨' },
  { id: 'art', name: '艺术', icon: '🖼️' },
  { id: 'photo', name: '摄影', icon: '📷' },
  { id: 'design', name: '设计', icon: '✨' },
  { id: 'illustration', name: '插画', icon: '🎭' },
  { id: 'animation', name: '动画', icon: '🎬' },
  { id: 'other', name: '其他', icon: '🌟' },
] as const;

export const AI_MODELS = [
  'Midjourney',
  'DALL-E',
  'Stable Diffusion',
  'Leonardo AI',
  'Adobe Firefly',
  'Other',
] as const;
