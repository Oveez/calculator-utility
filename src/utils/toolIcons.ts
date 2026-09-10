export interface ToolIconConfig {
  svgPath: string;
  badgeBg: string;
  badgeBorder: string;
  iconColor: string;
  viewBox?: string;
  name?: string;
}

export interface CategoryIconConfig {
  iconName: string;
  textColor: string;
  badgeBg: string;
  badgeBorder: string;
  svgPath: string;
}

// Global category icons matching the site design & header menubar
export const categoryIconMap: Record<string, CategoryIconConfig> = {
  // Reused from header menubar
  'Developer': {
    iconName: 'code',
    textColor: 'text-blue-500',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
    svgPath: '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',
  },
  'Text': {
    iconName: 'text',
    textColor: 'text-purple-500',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/20',
    svgPath: '<polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line>',
  },
  'Data': {
    iconName: 'converter',
    textColor: 'text-teal-500',
    badgeBg: 'bg-teal-500/10',
    badgeBorder: 'border-teal-500/20',
    svgPath: '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path>',
  },
  'Image': {
    iconName: 'image',
    textColor: 'text-emerald-500',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/20',
    svgPath: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>',
  },
  'PDF': {
    iconName: 'document',
    textColor: 'text-rose-500',
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    svgPath: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',
  },
  'Generators': {
    iconName: 'dice',
    textColor: 'text-amber-500',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/20',
    svgPath: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"></circle><circle cx="15.5" cy="8.5" r="1.5" fill="currentColor"></circle><circle cx="15.5" cy="15.5" r="1.5" fill="currentColor"></circle><circle cx="8.5" cy="15.5" r="1.5" fill="currentColor"></circle><circle cx="12" cy="12" r="1.5" fill="currentColor"></circle>',
  },
  'All': {
    iconName: 'grid',
    textColor: 'text-blue-500',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
    svgPath: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>',
  },

  // Additional categories
  'Finance': {
    iconName: 'finance',
    textColor: 'text-emerald-500',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/20',
    svgPath: '<circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path>',
  },
  'Tax & Finance': {
    iconName: 'finance',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/20',
    svgPath: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',
  },
  'Education': {
    iconName: 'education',
    textColor: 'text-indigo-500',
    badgeBg: 'bg-indigo-500/10',
    badgeBorder: 'border-indigo-500/20',
    svgPath: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>',
  },
  'Academic': {
    iconName: 'education',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    badgeBg: 'bg-indigo-500/10',
    badgeBorder: 'border-indigo-500/20',
    svgPath: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
  },
  'Health': {
    iconName: 'health',
    textColor: 'text-rose-500',
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    svgPath: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
  },
  'Math': {
    iconName: 'math',
    textColor: 'text-cyan-500',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/20',
    svgPath: '<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>',
  },
  'Converters': {
    iconName: 'converter',
    textColor: 'text-teal-600 dark:text-teal-400',
    badgeBg: 'bg-teal-500/10',
    badgeBorder: 'border-teal-500/20',
    svgPath: '<polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>',
  },
  'Time': {
    iconName: 'calendar',
    textColor: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/20',
    svgPath: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
  },
  'Career': {
    iconName: 'career',
    textColor: 'text-sky-600 dark:text-sky-400',
    badgeBg: 'bg-sky-500/10',
    badgeBorder: 'border-sky-500/20',
    svgPath: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',
  },
  'Research': {
    iconName: 'chart',
    textColor: 'text-violet-500',
    badgeBg: 'bg-violet-500/10',
    badgeBorder: 'border-violet-500/20',
    svgPath: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>',
  },
  'Business': {
    iconName: 'bolt',
    textColor: 'text-emerald-500',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/20',
    svgPath: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>',
  },
  'Pricing': {
    iconName: 'scale',
    textColor: 'text-amber-500',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/20',
    svgPath: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="M7 21h10"></path><path d="M12 3v18"></path><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>',
  },
  'Shipping': {
    iconName: 'box',
    textColor: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
    svgPath: '<rect width="16" height="13" x="4" y="5" rx="2"></rect><path d="M16 2v3M8 2v3M4 10h16"></path>',
  },
  'URL': {
    iconName: 'link',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/20',
    svgPath: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>',
  },
  'Color': {
    iconName: 'color',
    textColor: 'text-fuchsia-500',
    badgeBg: 'bg-fuchsia-500/10',
    badgeBorder: 'border-fuchsia-500/20',
    svgPath: '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563 0-4.97-4.03-8.831-10-8.831Z"></path>',
  },
};

export function getCategoryIconConfig(category: string): CategoryIconConfig {
  if (categoryIconMap[category]) {
    return categoryIconMap[category];
  }
  for (const [key, val] of Object.entries(categoryIconMap)) {
    if (category.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(category.toLowerCase())) {
      return val;
    }
  }
  return categoryIconMap['All'];
}

// Purpose-symbolizing icons mapped specifically for tools
const specificToolIcons: Record<string, ToolIconConfig> = {
  // 1. PDF Tools (Crimson/Rose with functional document icons)
  'pdf-splitter': {
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    // Document with scissors / dashed cut split in the center
    svgPath: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="4" y1="12" x2="8" y2="12"></line><line x1="11" y1="12" x2="13" y2="12"></line><line x1="16" y1="12" x2="20" y2="12"></line><circle cx="6" cy="9" r="1.5"></circle><circle cx="6" cy="15" r="1.5"></circle>',
  },
  'pdf-merger': {
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    // Multiple documents combining with +
    svgPath: '<path d="M8 2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"></path><path d="M14 6H10a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V12"></path><polyline points="14 6 14 12 20 12"></polyline><line x1="14" y1="17" x2="14" y2="17.01"></line><path d="M12 17h4"></path>',
  },
  'images-to-pdf': {
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    // Image converting into PDF
    svgPath: '<rect x="2" y="3" width="9" height="9" rx="1.5"></rect><polyline points="2 9 5 6 9 10"></polyline><path d="M13 5h5a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-3"></path><path d="M10 13l4-4m0 0h-3m3 0v3"></path>',
  },
  'pdf-to-images': {
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    // PDF document extracting to picture photos
    svgPath: '<path d="M4 2v14a2 2 0 0 0 2 2h8"></path><polyline points="14 2 14 6 18 6"></polyline><rect x="11" y="10" width="11" height="11" rx="2"></rect><circle cx="15" cy="14" r="1"></circle><polyline points="21 19 18 16 13 21"></polyline>',
  },
  'pdf-page-counter': {
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    // Document with page numbers badge
    svgPath: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M8 17h2"></path><path d="M9 13v4"></path><path d="M14 13h2v2h-2v2h2"></path>',
  },
  'pdf-metadata-viewer': {
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    // Document under magnifying glass
    svgPath: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6"></path><polyline points="14 2 14 8 20 8"></polyline><circle cx="16" cy="16" r="3"></circle><line x1="18.5" y1="18.5" x2="21.5" y2="21.5"></line>',
  },
  'pdf-metadata-remover': {
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    // Document with shield / eraser slash
    svgPath: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="3" y1="21" x2="21" y2="3"></line>',
  },
  'pdf-page-extractor': {
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    // Document with arrow extracting sheet
    svgPath: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 17V11m0 0l-3 3m3-3l3 3"></path>',
  },
  'pdf-page-reorderer': {
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    // Two pages with shuffle arrows
    svgPath: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 14l3-3 3 3"></path><path d="M9 17l3 3 3-3"></path>',
  },
  'pdf-rotate': {
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    // Circular rotate arrow around document
    svgPath: '<path d="M21.5 2v6h-6"></path><path d="M21.34 15.57a9 9 0 1 1-.57-8.38l5.67-5.67"></path><path d="M9 10h4v4H9z"></path>',
  },

  // 2. Developer Tools (Blue/Indigo with code symbols)
  'json-formatter': {
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    // Nested syntax braces { }
    svgPath: '<path d="M7 4a3 3 0 0 0-3 3v2a2 2 0 0 1-2 2 2 2 0 0 1 2 2v2a3 3 0 0 0 3 3"></path><path d="M17 4a3 3 0 0 1 3 3v2a2 2 0 0 0 2 2 2 2 0 0 0-2 2v2a3 3 0 0 1-3 3"></path><line x1="8" y1="12" x2="16" y2="12"></line>',
  },
  'json-validator': {
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    // Braces with checkmark
    svgPath: '<path d="M7 4a3 3 0 0 0-3 3v2a2 2 0 0 1-2 2 2 2 0 0 1 2 2v2a3 3 0 0 0 3 3"></path><path d="M17 4a3 3 0 0 1 3 3v2a2 2 0 0 0 2 2 2 2 0 0 0-2 2v2a3 3 0 0 1-3 3"></path><polyline points="9 12 11 14 15 10"></polyline>',
  },
  'json-minifier': {
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    // Squeeze compression arrows inward
    svgPath: '<path d="M4 14h6m0 0v6m0-6L3 21"></path><path d="M20 10h-6m0 0V4m0 6l7-7"></path>',
  },
  'json-diff': {
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    // Two split diff panels
    svgPath: '<rect x="3" y="3" width="8" height="18" rx="2"></rect><rect x="13" y="3" width="8" height="18" rx="2"></rect><line x1="7" y1="12" x2="7" y2="12.01"></line><line x1="17" y1="12" x2="17" y2="12.01"></line>',
  },
  'jwt-decoder': {
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    // Security shield with token dots
    svgPath: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><circle cx="9" cy="12" r="1" fill="currentColor"></circle><circle cx="12" cy="12" r="1" fill="currentColor"></circle><circle cx="15" cy="12" r="1" fill="currentColor"></circle>',
  },
  'regex-tester': {
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    // Asterisk and target regex lens
    svgPath: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v10M8 9.5l8 5M8 14.5l8-5"></path>',
  },
  'uuid-generator': {
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    // GUID hash blocks
    svgPath: '<rect x="2" y="5" width="20" height="14" rx="3"></rect><line x1="7" y1="12" x2="7" y2="12.01"></line><line x1="12" y1="12" x2="12" y2="12.01"></line><line x1="17" y1="12" x2="17" y2="12.01"></line>',
  },
  'timestamp-converter': {
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    // Clock with binary time
    svgPath: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 15 15"></polyline><path d="M18 2h4v4"></path>',
  },
  'cron-expression-generator': {
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    // Cyclic recurring clock
    svgPath: '<path d="M21.5 2v6h-6"></path><path d="M21.34 15.57a9 9 0 1 1-.57-8.38l5.67-5.67"></path><polyline points="12 7 12 12 14 14"></polyline>',
  },

  // 3. Generators & Barcodes
  'qr-code-generator': {
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    // 2D QR matrix with finder patterns
    svgPath: '<rect x="3" y="3" width="7" height="7"></rect><rect x="5" y="5" width="3" height="3" fill="currentColor"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="16" y="5" width="3" height="3" fill="currentColor"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="5" y="16" width="3" height="3" fill="currentColor"></rect><line x1="14" y1="14" x2="17" y2="14"></line><line x1="14" y1="17" x2="14" y2="20"></line><line x1="17" y1="17" x2="20" y2="20"></line>',
  },
  'password-generator': {
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    // Padlock with key stars
    svgPath: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path><circle cx="12" cy="16" r="1" fill="currentColor"></circle>',
  },
  'passphrase-generator': {
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    // Diceware word blocks
    svgPath: '<rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M7 10h3M7 14h5M15 10h2M15 14h2"></path>',
  },

  // 4. Calculators & Finance
  'mortgage-calculator': {
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    // House with financial percent badge
    svgPath: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline><circle cx="12" cy="7" r="1.5" fill="currentColor"></circle>',
  },
  'compound-interest-calculator': {
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    // Upward exponential curve with coins
    svgPath: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline>',
  },
  'currency-converter': {
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    // Currency exchange circulating arrows
    svgPath: '<circle cx="8" cy="8" r="6"></circle><path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path><path d="M7 6h2M8 5v6M15 14h2M16 13v4"></path>',
  },
  'vat-calculator': {
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    // Tax receipt with percentage
    svgPath: '<path d="M4 2v20l3-2 3 2 3-2 3 2 4-2V2z"></path><path d="M8 8h8M8 12h5M8 16h8"></path>',
  },

  // 5. Health
  'bmi-calculator': {
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    // Scale balance with body heartbeat
    svgPath: '<circle cx="12" cy="5" r="3"></circle><path d="M6 22h12"></path><path d="M9 14l3-3 3 3"></path><path d="M12 8v14"></path>',
  },
  'calorie-calculator': {
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    // Energy flame
    svgPath: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>',
  },
  'water-intake-calculator': {
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    // Water drop
    svgPath: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>',
  },

  // 6. Academic & Education
  'gpa-calculator': {
    badgeBg: 'bg-indigo-500/10',
    badgeBorder: 'border-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    // Graduation cap with A+
    svgPath: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>',
  },

  // 7. Career & Resume
  'cv-maker': {
    badgeBg: 'bg-sky-500/10',
    badgeBorder: 'border-sky-500/20',
    iconColor: 'text-sky-600 dark:text-sky-400',
    // ATS Resume sheet with user badge
    svgPath: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><circle cx="10" cy="13" r="2"></circle><path d="M7 18a3 3 0 0 1 6 0"></path><line x1="15" y1="13" x2="18" y2="13"></line><line x1="15" y1="17" x2="18" y2="17"></line>',
  },

  // 8. Image Tools
  'image-compressor': {
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    // Image frame with squeeze compress arrows
    svgPath: '<rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="M17 12l-3-3m0 0l-3 3m3-3v8"></path>',
  },
  'image-color-picker': {
    badgeBg: 'bg-fuchsia-500/10',
    badgeBorder: 'border-fuchsia-500/20',
    iconColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    // Eyedropper
    svgPath: '<path d="m2 22 1-1a3 3 0 0 1 4.24 0L10 23l4.59-4.59a2 2 0 0 0 0-2.82L9.41 10.4a2 2 0 0 0-2.82 0L2 15"></path><path d="m14 16 6-6a2 2 0 0 0 0-2.83l-3.17-3.17a2 2 0 0 0-2.83 0l-6 6"></path>',
  },

  // 9. Text & URL
  'slug-generator': {
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    // Link slug with dashes
    svgPath: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path><line x1="8" y1="12" x2="16" y2="12"></line>',
  },
  'text-diff-checker': {
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    // Text comparison with + and -
    svgPath: '<path d="M4 6h16M4 12h10M4 18h7"></path><path d="M18 14v6m-3-3h6"></path>',
  },
  'word-counter': {
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    // Text lines with 'W'
    svgPath: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M8 13l1.5 4 1.5-3 1.5 3 1.5-4"></path>',
  },

  // 10. Shipping & Logistics
  'cbm-calculator': {
    badgeBg: 'bg-sky-500/10',
    badgeBorder: 'border-sky-500/20',
    iconColor: 'text-sky-600 dark:text-sky-400',
    // 3D Isometric Cube Box
    svgPath: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
  },
  'container-capacity-calculator': {
    badgeBg: 'bg-sky-500/10',
    badgeBorder: 'border-sky-500/20',
    iconColor: 'text-sky-600 dark:text-sky-400',
    // Cargo Shipping Container
    svgPath: '<rect x="1" y="4" width="22" height="16" rx="2"></rect><line x1="6" y1="4" x2="6" y2="20"></line><line x1="10" y1="4" x2="10" y2="20"></line><line x1="14" y1="4" x2="14" y2="20"></line><line x1="18" y1="4" x2="18" y2="20"></line>',
  }
};

export function getToolIconConfig(slugOrUrl: string, title?: string, category?: string): ToolIconConfig {
  const normalized = (slugOrUrl || '')
    .replace(/^\/?(calculators|developer-tools|text-tools|data-tools|image-tools|pdf-tools|generators|color-tools|education-tools|academic-tools|research-tools|career-tools|shipping-calculators|pricing-calculators|business-tools|url-tools|tax-calculators)\//, '')
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .toLowerCase();

  // 1. Direct specific match
  if (specificToolIcons[normalized]) {
    return specificToolIcons[normalized];
  }

  // 2. Substring matching for tool families
  if (normalized.includes('pdf')) {
    const defaultPdf = specificToolIcons['pdf-page-counter'];
    if (normalized.includes('split')) return specificToolIcons['pdf-splitter'];
    if (normalized.includes('merge')) return specificToolIcons['pdf-merger'];
    if (normalized.includes('rotate')) return specificToolIcons['pdf-rotate'];
    if (normalized.includes('extract')) return specificToolIcons['pdf-page-extractor'];
    if (normalized.includes('reorder')) return specificToolIcons['pdf-page-reorderer'];
    if (normalized.includes('meta')) return specificToolIcons['pdf-metadata-viewer'];
    return defaultPdf;
  }

  if (normalized.includes('tax') || normalized.includes('income-tax') || normalized.includes('salary')) {
    return {
      badgeBg: 'bg-emerald-500/10',
      badgeBorder: 'border-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      svgPath: '<circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path>',
    };
  }

  if (normalized.includes('json') || normalized.includes('yaml') || normalized.includes('xml')) {
    if (normalized.includes('diff')) return specificToolIcons['json-diff'];
    if (normalized.includes('minify') || normalized.includes('compress')) return specificToolIcons['json-minifier'];
    if (normalized.includes('validate')) return specificToolIcons['json-validator'];
    return specificToolIcons['json-formatter'];
  }

  if (normalized.includes('password') || normalized.includes('passphrase') || normalized.includes('secret')) {
    return specificToolIcons['password-generator'];
  }

  if (normalized.includes('qr') || normalized.includes('barcode')) {
    return specificToolIcons['qr-code-generator'];
  }

  if (normalized.includes('color') || normalized.includes('rgb') || normalized.includes('hex') || normalized.includes('cmyk') || normalized.includes('hsl')) {
    return {
      badgeBg: 'bg-fuchsia-500/10',
      badgeBorder: 'border-fuchsia-500/20',
      iconColor: 'text-fuchsia-600 dark:text-fuchsia-400',
      svgPath: '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563 0-4.97-4.03-8.831-10-8.831Z"></path>',
    };
  }

  if (normalized.includes('image') || normalized.includes('exif') || normalized.includes('photo')) {
    return specificToolIcons['image-compressor'];
  }

  if (normalized.includes('cbm') || normalized.includes('weight') || normalized.includes('shipping') || normalized.includes('container')) {
    return specificToolIcons['cbm-calculator'];
  }

  if (normalized.includes('resume') || normalized.includes('cv') || normalized.includes('job') || normalized.includes('career')) {
    return specificToolIcons['cv-maker'];
  }

  // 3. Fallback to Category Icon
  const cat = category || 'Finance';
  const catConfig = getCategoryIconConfig(cat);

  return {
    badgeBg: catConfig.badgeBg,
    badgeBorder: catConfig.badgeBorder,
    iconColor: catConfig.textColor,
    svgPath: catConfig.svgPath,
  };
}
