import React, { useState } from 'react';
import { Camera, Image, Link2, RotateCcw, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImagePlaceholderProps {
  id: string;
  label: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'custom';
  imageUrl: string;
  onUpdateImage: (id: string, url: string) => void;
  onResetImage: (id: string) => void;
  className?: string;
  defaultGraphicType?: 'couple' | 'flowers' | 'location';
  isPolaroid?: boolean;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  id,
  label,
  aspectRatio = 'square',
  imageUrl,
  onUpdateImage,
  onResetImage,
  className = '',
  defaultGraphicType = 'couple',
  isPolaroid = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isCustomImage = imageUrl && !imageUrl.startsWith('default_graphic_');

  // Aspect ratio classes
  const aspectClass = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    custom: 'w-full h-full',
  }[aspectRatio];

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onUpdateImage(id, urlInput);
      setIsOpen(false);
      setUrlInput('');
      setErrorMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Kuvan enimmäiskoko on 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdateImage(id, reader.result);
          setIsOpen(false);
          setErrorMessage('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Tiedoston täytyy olla kuva.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Kuvan enimmäiskoko on 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdateImage(id, reader.result);
          setIsOpen(false);
          setErrorMessage('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Render beautiful hand-drawn default vector SVGs based on theme
  const renderDefaultSvg = () => {
    switch (defaultGraphicType) {
      case 'couple':
        return (
          <svg className="w-2/3 h-2/3 opacity-70 text-sage-dark max-w-[180px]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Elegant silhouette drawing */}
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
            <path d="M50 20 C54 20, 56 24, 52 28 C48 32, 45 35, 47 40" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M43 23 C41 21, 37 23, 39 27 C41 31, 46 34, 44 42" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M35 55 C40 45, 55 45, 60 55 C65 65, 75 75, 75 85 L25 85 C25 75, 30 65, 35 55Z" fill="#C3CFB5" opacity="0.3" stroke="currentColor" strokeWidth="1" />
            <path d="M45 42 L48 85 M51 40 L53 85" stroke="currentColor" strokeWidth="0.75" />
            {/* Tiny tulip blossom above */}
            <path d="M48 13 C49 11, 51 11, 52 13 C50 15, 50 15, 48 13Z" fill="#8E9C7F" />
            <text x="50" y="70" className="text-[6px] tracking-[0.2em] font-serif fill-current text-center" textAnchor="middle">
              TÄHÄN OMACUVA
            </text>
          </svg>
        );
      case 'flowers':
        return (
          <svg className="w-2/3 h-2/3 opacity-70 text-sage-dark max-w-[180px]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.75" />
            {/* Tulip bouquet */}
            <path d="M45 55 L35 80 M50 55 L50 82 M55 55 L65 80" stroke="currentColor" strokeWidth="1.2" />
            <path d="M32 45 C35 32, 45 35, 45 48 C38 49, 34 48, 32 45Z" fill="#FDF7CA" stroke="currentColor" strokeWidth="0.75" />
            <path d="M68 45 C65 32, 55 35, 55 48 C62 49, 66 48, 68 45Z" fill="#FDF7CA" stroke="currentColor" strokeWidth="0.75" />
            <path d="M50 40 C53 24, 47 24, 50 42 C45 43, 45 43, 50 40Z" fill="#FDF7CA" stroke="currentColor" strokeWidth="0.75" />
            <path d="M35 70 Q20 62, 38 52" stroke="currentColor" strokeWidth="0.8" fill="none" />
            <path d="M65 72 Q80 62, 62 52" stroke="currentColor" strokeWidth="0.8" fill="none" />
            <text x="50" y="65" className="text-[6px] tracking-[0.2em] font-serif fill-current" textAnchor="middle">
              MEIDÄN TARINA
            </text>
          </svg>
        );
      case 'location':
        return (
          <svg className="w-2/3 h-2/3 opacity-70 text-sage-dark max-w-[180px]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Location or church icon drawer */}
            <rect x="25" y="45" width="50" height="35" rx="2" stroke="currentColor" strokeWidth="1" />
            <path d="M22 45 L50 20 L78 45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="44" y="60" width="12" height="20" rx="1" fill="#C3CFB5" opacity="0.4" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="13" r="5" stroke="currentColor" strokeWidth="0.75" fill="#FDF7CA" />
            <line x1="50" y1="8" x2="50" y2="18" stroke="currentColor" strokeWidth="0.75" />
            <line x1="47" y1="13" x2="53" y2="13" stroke="currentColor" strokeWidth="0.75" />
            <text x="50" y="52" className="text-[5px] tracking-[0.15em] font-serif fill-current" textAnchor="middle">
              JUHLAPAIKKA
            </text>
          </svg>
        );
    }
  };

  const borderClass = isCustomImage
    ? 'border-0 bg-transparent'
    : 'border-2 border-dashed border-sage bg-[#FDF9ED]/90 hover:border-sage-dark';

  // Beautiful render of Polaroid structure
  if (isPolaroid) {
    return (
      <div 
        id={`image-container-${id}`}
        className={`group relative mx-auto w-full max-w-[360px] bg-white p-4 pb-12 rounded-sm border border-stone-200/50 shadow-[0_12px_30px_-5px_rgba(47,62,50,0.15)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rotate-[-2deg] hover:rotate-0 hover:scale-[1.04] hover:shadow-[0_22px_45px_-8px_rgba(47,62,50,0.22)] ${className}`}
      >
        {/* Photo sleeve (strictly squared picture cutout) */}
        <div id="polaroid-photo-sleeve" className="relative aspect-square overflow-hidden bg-stone-50 border border-stone-100 shadow-inner">
          {isCustomImage ? (
            <img
              src={imageUrl}
              alt={label}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
              {renderDefaultSvg()}
              <span className="mt-3 font-serif text-sm italic text-stone-500 tracking-wide">{label}</span>
            </div>
          )}
          
          {/* Subtle glossy photo screen reflection effect across the picture */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-40 mix-blend-overlay" />
        </div>

        {/* Polaroid caption - handwritten look */}
        <div className="flex justify-center items-center h-12 pt-1 select-none">
          <p className="font-handwritten text-[22px] font-medium text-stone-700/95 tracking-wide rotate-[-1deg]">
            {id === 'couple' ? 'Samu ja Aino 15.08.2026' : label}
          </p>
        </div>

        {/* Configuration Modal - Beautiful Overlay Dialog with smooth exit/entrance */}
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-xs">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#FFFEF4] p-6 shadow-2xl border-2 border-sage"
              >
                
                {/* Header */}
                <div className="mb-4 flex items-center justify-between border-b border-sage/20 pb-3">
                  <div>
                    <h4 className="font-serif text-xl font-semibold text-stone-800">Muokkaa kuvaa: {label}</h4>
                    <p className="font-sans text-xs text-stone-500 mt-0.5">Lisää oma valokuvasi ja katso miltä sivu näyttää</p>
                  </div>
                  <button
                    id={`close-modal-btn-${id}`}
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                {errorMessage && (
                  <div className="mb-4 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-600 border border-rose-100">
                    {errorMessage}
                  </div>
                )}

                {/* Way 1: Upload File with Drag and Drop area */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">VAIHTOEHTO 1: Lataa tiedosto laitteeltasi</label>
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-smooth ${
                        dragActive
                          ? 'border-sage-dark bg-sage/20'
                          : 'border-sage bg-stone-50/50 hover:bg-stone-50'
                      }`}
                    >
                      <Image size={32} className="text-sage-dark mb-2 opacity-80" />
                      <span className="font-sans text-xs font-medium text-stone-700">Raahaa ja pudota kuva tähän</span>
                      <span className="font-sans text-[10px] text-stone-400 mt-1">tai</span>
                      <label className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#C3CFB5] hover:bg-sage-dark px-3.5 py-1.5 font-sans text-xs font-medium text-stone-800 transition-colors shadow-xs">
                        Valitse tiedosto
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                      <span className="font-sans text-[9px] text-stone-400 mt-2">Suositeltu enimmäiskoko 5MB (PNG, JPG, WEBP)</span>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-sage/20"></div>
                    <span className="flex-shrink mx-3 text-[10px] text-stone-400 uppercase tracking-widest font-sans">tai</span>
                    <div className="flex-grow border-t border-sage/20"></div>
                  </div>

                  {/* Way 2: Paste Direct Link */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">VAIHTOEHTO 2: Liitä kuvan verkko-osoite (URL)</label>
                    <form onSubmit={handleUrlSubmit} className="flex gap-2">
                      <div className="relative flex-grow">
                        <Link2 size={16} className="absolute left-3 top-3 text-stone-400" />
                        <input
                          id={`image-url-input-${id}`}
                          type="url"
                          placeholder="https://esimerkki.fi/kuvasi.jpg"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          className="w-full rounded-xl border border-sage/60 bg-white py-2 pl-9 pr-3 font-sans text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-sage-dark"
                        />
                      </div>
                      <button
                        id={`save-url-btn-${id}`}
                        type="submit"
                        disabled={!urlInput.trim()}
                        className="rounded-xl bg-[#C3CFB5] px-4 font-sans text-xs font-semibold text-stone-800 hover:bg-sage-dark disabled:opacity-40 transition-colors flex items-center gap-1.5"
                      >
                        <Check size={14} />
                        Tallenna
                      </button>
                    </form>
                    <span className="mt-1.5 block font-sans text-[10px] text-stone-400 leading-relaxed">
                      Voit käyttää palveluita kuten Google Photos (kopioi kuvan suora osoite), Imgur tai mitä tahansa julkista kuvapankkia.
                    </span>
                  </div>
                </div>

                {/* Close footer */}
                <div className="mt-6 flex justify-end border-t border-sage/10 pt-3">
                  <button
                    id={`cancel-modal-btn-${id}`}
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl border border-stone-300 px-4 py-2 font-sans text-xs text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Peruuta
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div 
      id={`image-container-${id}`} 
      className={`group relative w-full ${aspectClass} overflow-hidden rounded-3xl ${borderClass} shadow-md transition-smooth hover:shadow-xl ${className}`}
    >
      
      {/* 1. Main Display - Custom image or default vector decorative background */}
      {isCustomImage ? (
        <img
          src={imageUrl}
          alt={label}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
          {renderDefaultSvg()}
          <span className="mt-3 font-serif text-sm italic text-stone-500 tracking-wide">{label}</span>
        </div>
      )}



      {/* 4. Configuration Modal - Beautiful Overlay Dialog with smooth exit/entrance */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#FFFEF4] p-6 shadow-2xl border-2 border-sage"
            >
              
              {/* Header */}
              <div className="mb-4 flex items-center justify-between border-b border-sage/20 pb-3">
                <div>
                  <h4 className="font-serif text-xl font-semibold text-stone-800">Muokkaa kuvaa: {label}</h4>
                  <p className="font-sans text-xs text-stone-500 mt-0.5">Lisää oma valokuvasi ja katso miltä sivu näyttää</p>
                </div>
                <button
                  id={`close-modal-btn-${id}`}
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                >
                  <X size={20} />
                </button>
              </div>

              {errorMessage && (
                <div className="mb-4 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-600 border border-rose-100">
                  {errorMessage}
                </div>
              )}

              {/* Way 1: Upload File with Drag and Drop area */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">VAIHTOEHTO 1: Lataa tiedosto laitteeltasi</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-smooth ${
                      dragActive
                        ? 'border-sage-dark bg-sage/20'
                        : 'border-sage bg-stone-50/50 hover:bg-stone-50'
                    }`}
                  >
                    <Image size={32} className="text-sage-dark mb-2 opacity-80" />
                    <span className="font-sans text-xs font-medium text-stone-700">Raahaa ja pudota kuva tähän</span>
                    <span className="font-sans text-[10px] text-stone-400 mt-1">tai</span>
                    <label className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#C3CFB5] hover:bg-sage-dark px-3.5 py-1.5 font-sans text-xs font-medium text-stone-800 transition-colors shadow-xs">
                      Valitse tiedosto
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    <span className="font-sans text-[9px] text-stone-400 mt-2">Suositeltu enimmäiskoko 5MB (PNG, JPG, WEBP)</span>
                  </div>
                </div>

                {/* Separator */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-sage/20"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-stone-400 uppercase tracking-widest font-sans">tai</span>
                  <div className="flex-grow border-t border-sage/20"></div>
                </div>

                {/* Way 2: Paste Direct Link */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">VAIHTOEHTO 2: Liitä kuvan verkko-osoite (URL)</label>
                  <form onSubmit={handleUrlSubmit} className="flex gap-2">
                    <div className="relative flex-grow">
                      <Link2 size={16} className="absolute left-3 top-3 text-stone-400" />
                      <input
                        id={`image-url-input-${id}`}
                        type="url"
                        placeholder="https://esimerkki.fi/kuvasi.jpg"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full rounded-xl border border-sage/60 bg-white py-2 pl-9 pr-3 font-sans text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-sage-dark"
                      />
                    </div>
                    <button
                      id={`save-url-btn-${id}`}
                      type="submit"
                      disabled={!urlInput.trim()}
                      className="rounded-xl bg-[#C3CFB5] px-4 font-sans text-xs font-semibold text-stone-800 hover:bg-sage-dark disabled:opacity-40 transition-colors flex items-center gap-1.5"
                    >
                      <Check size={14} />
                      Tallenna
                    </button>
                  </form>
                  <span className="mt-1.5 block font-sans text-[10px] text-stone-400 leading-relaxed">
                    Voit käyttää palveluita kuten Google Photos (kopioi kuvan suora osoite), Imgur tai mitä tahansa julkista kuvapankkia.
                  </span>
                </div>
              </div>

              {/* Close footer */}
              <div className="mt-6 flex justify-end border-t border-sage/10 pt-3">
                <button
                  id={`cancel-modal-btn-${id}`}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-stone-300 px-4 py-2 font-sans text-xs text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Peruuta
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
