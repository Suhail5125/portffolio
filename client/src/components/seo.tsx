import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

const defaultMeta = {
  title: "CodebySRS - Professional Web Development & 3D Solutions",
  description: "We craft immersive web experiences with cutting-edge technologies. Specializing in WebGL, Three.js, and modern web development.",
  keywords: "web development, 3D web, WebGL, Three.js, React, CodebySRS, full stack development",
  ogImage: "/og-image.jpg",
  ogType: "website",
  twitterCard: "summary_large_image",
};

export function SEO({
  title,
  description,
  keywords,
  ogImage,
  ogType,
  twitterCard,
}: SEOProps) {
  const meta = {
    title: title || defaultMeta.title,
    description: description || defaultMeta.description,
    keywords: keywords || defaultMeta.keywords,
    ogImage: ogImage || defaultMeta.ogImage,
    ogType: ogType || defaultMeta.ogType,
    twitterCard: twitterCard || defaultMeta.twitterCard,
  };

  useEffect(() => {
    // Update document title
    document.title = meta.title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    // Standard meta tags
    updateMetaTag("description", meta.description);
    updateMetaTag("keywords", meta.keywords);

    // Open Graph tags
    updateMetaTag("og:title", meta.title, true);
    updateMetaTag("og:description", meta.description, true);
    updateMetaTag("og:image", meta.ogImage, true);
    updateMetaTag("og:type", meta.ogType, true);
    updateMetaTag("og:url", window.location.href, true);

    // Twitter Card tags
    updateMetaTag("twitter:card", meta.twitterCard);
    updateMetaTag("twitter:title", meta.title);
    updateMetaTag("twitter:description", meta.description);
    updateMetaTag("twitter:image", meta.ogImage);

    // Additional SEO tags
    updateMetaTag("robots", "index, follow");
    updateMetaTag("viewport", "width=device-width, initial-scale=1.0");
    updateMetaTag("theme-color", "#0ea5e9");
  }, [meta]);

  return null;
}
