import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { cn } from '../../utils/helpers';

export function ImageGallery({ images = [], productName = 'Product Image' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imgContainerRef = useRef(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleMouseMove = (e) => {
    if (!imgContainerRef.current) return;
    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto w-full md:w-20 md:min-w-[5rem] snap-x hide-scrollbar">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md border-2 overflow-hidden snap-start transition-all",
              activeIndex === idx ? "border-primary-600" : "border-transparent hover:border-gray-300"
            )}
          >
            <img
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              className="w-full h-full object-contain p-1"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden group">
        <div 
          ref={imgContainerRef}
          className="w-full aspect-square md:aspect-auto md:h-[500px] lg:h-[550px] cursor-crosshair overflow-hidden flex items-center justify-center p-4 sm:p-6"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={images[activeIndex]}
            alt={productName}
            className={cn(
              "max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-200",
              isZoomed && "scale-[2]"
            )}
            style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
          />
        </div>

        {/* Mobile Nav Arrows (Visible on touch/mobile if many imgs) */}
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full shadow-md md:hidden"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full shadow-md md:hidden"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        
        {/* Zoom hint */}
        <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-sm text-gray-500 hidden md:group-hover:block pointer-events-none transition-opacity">
          <ZoomIn size={20} />
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>
          
          <div className="relative w-full max-w-5xl max-h-[80vh] flex items-center justify-center">
            <button 
              onClick={handlePrev}
              className="absolute left-0 md:left-4 p-2 text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft size={48} />
            </button>
            
            <img
              src={images[activeIndex]}
              alt={productName}
              className="max-w-full max-h-[80vh] object-contain select-none"
            />
            
            <button 
              onClick={handleNext}
              className="absolute right-0 md:right-4 p-2 text-white/50 hover:text-white transition-colors"
            >
              <ChevronRight size={48} />
            </button>
          </div>
          
          {/* Lightbox Thumbnails */}
          <div className="flex gap-2 mt-4 max-w-3xl overflow-x-auto p-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "flex-shrink-0 w-16 h-16 rounded overflow-hidden opacity-50 hover:opacity-100 transition-opacity border-2",
                  activeIndex === idx ? "border-white opacity-100" : "border-transparent"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
