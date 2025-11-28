import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GallerySection({ invitation }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const rawImages = invitation.gallery_images || [];
  
  // Normalize images to always have url and caption (backward compatible)
  const images = rawImages.map(img => 
    typeof img === 'string' ? { url: img, caption: '' } : { url: img.url, caption: img.caption || '' }
  );

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goNext = () => {
    if (selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const goPrev = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  if (images.length === 0) return null;

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className={`text-3xl md:text-4xl font-${invitation.font_family || 'playfair'} font-semibold`}
            style={{ color: invitation.primary_color }}
          >
            Gallery
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative cursor-pointer overflow-hidden rounded-2xl group
                ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              onClick={() => openLightbox(index)}
            >
              <img
                src={img.url}
                alt={img.caption || `Gallery ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity ${img.caption ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                {img.caption && (
                  <p className="text-white text-sm md:text-base font-medium line-clamp-2 mb-1">
                    {img.caption}
                  </p>
                )}
                <div className="text-white/70 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {index + 1} / {images.length}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {selectedIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {selectedIndex < images.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}

            <div className="flex flex-col items-center max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={images[selectedIndex].url}
                alt={images[selectedIndex].caption || ''}
                className="max-h-[75vh] max-w-full object-contain rounded-lg"
              />
              
              <div className="mt-4 text-center px-4">
                {images[selectedIndex].caption && (
                  <p className="text-white text-base md:text-lg mb-2 max-w-2xl">
                    {images[selectedIndex].caption}
                  </p>
                )}
                <div className="text-white/60 text-sm">
                  {selectedIndex + 1} / {images.length}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
