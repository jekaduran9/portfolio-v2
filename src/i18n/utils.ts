import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const pathname = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname;
  const [, lang] = pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    
    let targetPath = path;
    
    // Especial handling for projects slug mismatch between ES and EN
    if (targetPath.startsWith('/projects/') && targetPath.length > 10) {
      if (l === 'en' && !targetPath.endsWith('-en')) {
        targetPath = `${targetPath}-en`;
      } else if (l === 'es' && targetPath.endsWith('-en')) {
        targetPath = targetPath.replace(/-en$/, '');
      }
    }
    
    const translatedPath = l === defaultLang ? targetPath : `/${l}${targetPath}`;
    return `${base}${translatedPath}`.replace(/\/+/g, '/');
  }
}

export function getCleanPathname(url: URL) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  let pathname = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname;
  
  // Remove trailing slash for comparison
  pathname = pathname.replace(/\/$/, '');
  if (pathname === '') return '/';

  const parts = pathname.split('/').filter(Boolean);
  const firstPart = parts[0];

  let clean = '';
  if (firstPart in ui) {
    clean = '/' + parts.slice(1).join('/');
  } else {
    clean = '/' + parts.join('/');
  }

  // Clean the -en suffix for projects to have a unified base path
  if (clean.startsWith('/projects/') && clean.endsWith('-en')) {
    clean = clean.replace(/-en$/, '');
  }
  
  return clean === '' ? '/' : clean;
}
