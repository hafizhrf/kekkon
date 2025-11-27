import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, X } from 'lucide-react';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Pilih...',
  label,
  className = '',
  renderOption,
  renderValue,
  gridCols = 1,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile && isOpen) {
      const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, isMobile]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
  };

  const defaultRenderValue = (opt) => opt?.label || placeholder;
  const defaultRenderOption = (opt, isSelected) => (
    <div className="flex items-center justify-between w-full">
      <span>{opt.label}</span>
      {isSelected && <Check className="w-4 h-4 text-amber-500" />}
    </div>
  );

  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }[gridCols] || 'grid-cols-1';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl text-left transition-all
          ${isOpen ? 'ring-2 ring-amber-400' : 'hover:bg-gray-100'}`}
      >
        <span className={`${selectedOption ? 'text-gray-800' : 'text-gray-400'} font-medium`}>
          {renderValue ? renderValue(selectedOption) : defaultRenderValue(selectedOption)}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Desktop Popup */}
      <AnimatePresence>
        {isOpen && !isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            style={{ maxHeight: '300px' }}
          >
            <div className={`p-2 overflow-y-auto grid ${gridClass} gap-1`} style={{ maxHeight: '280px' }}>
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-left text-sm transition-all
                      ${isSelected 
                        ? 'bg-amber-50 text-amber-700' 
                        : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    {renderOption ? renderOption(opt, isSelected) : defaultRenderOption(opt, isSelected)}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Sheet */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[70vh] flex flex-col"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">{label || 'Pilih'}</h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Options */}
              <div className={`p-4 overflow-y-auto grid ${gridClass} gap-2`}>
                {options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full px-4 py-3 rounded-xl text-left transition-all
                        ${isSelected 
                          ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg' 
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                    >
                      {renderOption ? renderOption(opt, isSelected) : defaultRenderOption(opt, isSelected)}
                    </button>
                  );
                })}
              </div>

              {/* Safe area for iOS */}
              <div className="h-6 bg-white" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
