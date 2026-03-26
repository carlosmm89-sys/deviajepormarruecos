import React, { useEffect, useRef } from 'react';

interface Props {
  html?: string;
}

export default function WidgetRenderer({ html }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !html) return;
    
    // Set HTML Content
    containerRef.current.innerHTML = html;

    // Extract and execute scripts manually because React's dangerouslySetInnerHTML doesn't
    const scripts = containerRef.current.getElementsByTagName('script');
    const scriptsArray = Array.from(scripts) as HTMLScriptElement[];
    
    scriptsArray.forEach(script => {
      const newScript = document.createElement('script');
      Array.from(script.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.appendChild(document.createTextNode(script.innerHTML));
      script.parentNode?.replaceChild(newScript, script);
    });
  }, [html]);

  if (!html) return null;

  return <div ref={containerRef} className="w-full flex justify-center overflow-hidden py-4" />;
}
