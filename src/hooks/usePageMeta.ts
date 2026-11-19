import { useEffect } from 'react';
import { STORE_CONFIG } from '../config/store';

interface PageMetaOptions {
  title: string;
  description: string;
}

export function usePageMeta({ title, description }: PageMetaOptions) {
  useEffect(() => {
    const fullTitle = title.includes(STORE_CONFIG.brandName) ? title : `${title} | ${STORE_CONFIG.fullBrandName}`;
    document.title = fullTitle;

    const updateMeta = (selector: string, content: string) => {
      const el = document.querySelector<HTMLMetaElement>(selector);
      if (el) el.content = content;
    };

    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:title"]', fullTitle);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[name="twitter:title"]', fullTitle);
    updateMeta('meta[name="twitter:description"]', description);
  }, [title, description]);
}
