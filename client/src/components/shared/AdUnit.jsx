import { useEffect, useRef } from 'react';

// Google AdSense Component
// To use: Replace 'ca-pub-XXXXXXXXXXXXXXXX' with your actual AdSense publisher ID
// and the data-ad-slot with your actual ad slot ID

export default function AdUnit({ 
  adSlot = '1234567890', 
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = {},
  className = ''
}) {
  const adRef = useRef(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Only load once
    if (isLoaded.current) return;
    
    try {
      // Check if adsbygoogle is available
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        isLoaded.current = true;
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}

// Horizontal Banner Ad
export function HorizontalAd({ className = '' }) {
  return (
    <div className={`w-full py-4 ${className}`}>
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-[10px] text-gray-400 text-center mb-1">Advertisement</p>
        <AdUnit 
          adSlot="1234567890"
          adFormat="horizontal"
          style={{ minHeight: '90px' }}
        />
      </div>
    </div>
  );
}

// In-Article Ad
export function InArticleAd({ className = '' }) {
  return (
    <div className={`w-full py-6 ${className}`}>
      <p className="text-[10px] text-gray-400 text-center mb-1">Advertisement</p>
      <AdUnit 
        adSlot="0987654321"
        adFormat="fluid"
        style={{ minHeight: '250px' }}
      />
    </div>
  );
}

// Sticky Footer Ad
export function StickyFooterAd({ primaryColor = '#D4A373' }) {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t shadow-lg"
      style={{ borderColor: `${primaryColor}20` }}
    >
      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] text-gray-400 hidden sm:block">Sponsored</p>
          <div className="flex-1">
            <AdUnit 
              adSlot="1122334455"
              adFormat="horizontal"
              style={{ minHeight: '50px', maxHeight: '90px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Placeholder for development (shows a mock ad)
export function AdPlaceholder({ 
  height = '90px', 
  label = 'Advertisement',
  className = '' 
}) {
  return (
    <div className={`w-full ${className}`}>
      <p className="text-[10px] text-gray-400 text-center mb-1">{label}</p>
      <div 
        className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200"
        style={{ minHeight: height }}
      >
        <div className="text-center text-gray-400">
          <p className="text-xs font-medium">Google AdSense</p>
          <p className="text-[10px]">Ad will appear here</p>
        </div>
      </div>
    </div>
  );
}
