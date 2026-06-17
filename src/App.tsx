import React, { useState, useEffect } from 'react';
import { RSVPResponse } from './types';
import { TulipSingle, TulipDivider, TulipCorner } from './components/TulipSVG';
import { ImagePlaceholder } from './components/ImagePlaceholder';
import { RSVPForm } from './components/RSVPForm';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Flower2, 
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // 1. Core State Handlers
  const [isAdmin, setIsAdmin] = useState(() => {
    return new URLSearchParams(window.location.search).has('admin');
  });
  const [adminClicks, setAdminClicks] = useState(0);

  const handleCopyrightClick = () => {
    setAdminClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setIsAdmin(true);
      }
      return next;
    });
  };

  const [guestResponses, setGuestResponses] = useState<RSVPResponse[]>(() => {
    const saved = localStorage.getItem('wedding_rsvp_responses');
    return saved ? JSON.parse(saved) : [];
  });

  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('wedding_custom_images');
    const parsed = saved ? JSON.parse(saved) : {};
    
    // Explicitly override 'default_graphic_couple' or empty couple image with the new URL requested by user
    const coupleImage = (!parsed.couple || parsed.couple === 'default_graphic_couple')
      ? 'https://i.postimg.cc/hPcqd4rx/ha-a-kuva-A-S-cropped.png'
      : parsed.couple;

    const flowersImage = (!parsed.flowers || parsed.flowers === 'default_graphic_flowers' || parsed.flowers === 'https://i.postimg.cc/K1CjVHh9/image.png')
      ? 'https://i.postimg.cc/pdLjmwGt/ha-a-kartta.png'
      : parsed.flowers;

    return {
      couple: coupleImage,
      flowers: flowersImage,
      location: parsed.location || 'default_graphic_location',
    };
  });

  // Dynamic text customization (allows couple to personalize live without coding!)
  const [weddingNames, setWeddingNames] = useState(() => {
    const saved = localStorage.getItem('wedding_names');
    if (!saved || saved === 'Samu & Aino') {
      return 'Aino & Samu';
    }
    return saved;
  });
  const [weddingDate, setWeddingDate] = useState(() => {
    return localStorage.getItem('wedding_date') || '15. elokuuta 2026';
  });
  const [weddingVenue, setWeddingVenue] = useState(() => {
    const saved = localStorage.getItem('wedding_venue');
    if (!saved || saved === 'Tanhuanpään tila, Renko' || saved === 'Tenalji von Fersen, Suomenlinna, Helsinki' || saved === 'Tanhuanpään tila, Vehmaistentie 855, 14300 Hämeenlinna') {
      return 'Vehmaistentie 855, 14300 Hämeenlinna';
    }
    return saved;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('wedding_rsvp_responses', JSON.stringify(guestResponses));
  }, [guestResponses]);

  useEffect(() => {
    localStorage.setItem('wedding_custom_images', JSON.stringify(customImages));
  }, [customImages]);

  // Handle updates
  const handleUpdateImage = (id: string, url: string) => {
    setCustomImages(prev => ({ ...prev, [id]: url }));
  };

  const handleResetImage = (id: string) => {
    if (id === 'couple') {
      setCustomImages(prev => ({ ...prev, couple: 'https://i.postimg.cc/hPcqd4rx/ha-a-kuva-A-S-cropped.png' }));
    } else if (id === 'flowers') {
      setCustomImages(prev => ({ ...prev, flowers: 'https://i.postimg.cc/pdLjmwGt/ha-a-kartta.png' }));
    } else {
      setCustomImages(prev => ({ ...prev, [id]: `default_graphic_${id}` }));
    }
  };

  const handleAddResponse = (res: RSVPResponse) => {
    setGuestResponses(prev => [res, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#FFFEF4] text-stone-800 selection:bg-[#C3CFB5]/40 select-text">
      
      {/* Elegantly simple and clean top bar without any management controls */}
      <div className="max-w-4xl mx-auto px-6 pt-8 flex justify-between items-center select-none">
        <div className="flex items-center gap-2">
          <TulipSingle size={24} />
          <span className="font-serif text-xs font-semibold tracking-widest text-stone-500 uppercase">
            HÄÄKUTSU • {weddingDate}
          </span>
        </div>
        <div className="h-px bg-stone-200 flex-grow mx-4 hidden sm:block opacity-40" />
        <span className="font-serif text-xs italic text-[#8E9C7F] hidden sm:inline">{weddingVenue}</span>
      </div>

      <main className="pb-24">
        <AnimatePresence mode="wait">
          
          {/* ==================================== */}
          {/* TAB 1: GUEST VIEW (INVITATION AND RSVP) */}
          {/* ==================================== */}
          <motion.div
            id="guest-invitation-container"
            key="guest"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-4xl mx-auto px-4 mt-6 space-y-12"
          >
              
              {/* LANDING ENVELOPE / HERO BANNER CARD */}
              <div className="relative overflow-hidden rounded-3xl glass-panel-heavy p-8 md:p-14 text-center">
                {/* Tulip corner frames */}
                <div className="absolute left-0 top-0 pointer-events-none select-none">
                  <TulipCorner />
                </div>
                <div className="absolute right-0 top-0 pointer-events-none select-none">
                  <TulipCorner flipX />
                </div>
                
                {/* Visual bouquet top motif */}
                <div className="flex justify-center mb-6 animate-float">
                  <img 
                    src="https://i.postimg.cc/YSkYBqPT/ankat-removebg-preview.png" 
                    alt="Hääparin kuvitus" 
                    className="h-28 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <p className="font-script text-4xl text-[#8E9C7F] select-none">Kutsu meidän häihin</p>
                
                <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-stone-900 mt-4 leading-none select-text">
                  {weddingNames}
                </h1>

                <TulipDivider className="my-6" />

                <p className="font-sans text-xs md:text-sm font-semibold tracking-widest text-[#8E9C7F] uppercase mb-1">
                  LAUANTAINA • {weddingDate.toUpperCase()}
                </p>
                <p className="font-serif text-md italic text-stone-600">
                  {weddingVenue}
                </p>

                <p className="font-sans text-xs max-w-lg mx-auto text-stone-500 leading-relaxed mt-6">
                  Tervetuloa juhlimaan meidän häitä. Ihanaa että juuri sinä pääset osaksi meidän tärkeää päivää!
                </p>

                {/* Main Hero customizable placeholder image styled as a realistic Polaroid card */}
                <div className="mt-10 max-w-sm mx-auto">
                  <ImagePlaceholder
                    id="couple"
                    label={`${weddingNames} valokuva`}
                    imageUrl={customImages.couple}
                    onUpdateImage={handleUpdateImage}
                    onResetImage={handleResetImage}
                    defaultGraphicType="couple"
                    isPolaroid={true}
                  />
                </div>
              </div>

              {/* TIMELINE & OUR STORY SECTION WITH FLEX GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                
                {/* Program timeline list */}
                <div className="rounded-3xl glass-panel p-6 md:p-8 flex flex-col justify-between h-full">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-stone-850 flex items-center gap-2 mb-6">
                      <Sparkles size={20} className="text-sage-dark" />
                      Tärkeät tiedot
                    </h2>

                    <div className="space-y-6 relative border-l border-sage/55 pl-5 ml-2.5 font-sans text-xs">
                      <div className="relative">
                        <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-[#C3CFB5] border-2 border-white ring-2 ring-[#C3CFB5]/20" />
                        <span className="block font-semibold tracking-wider text-[#8E9C7F]">14:00</span>
                        <h4 className="font-serif text-sm font-bold text-stone-850 mt-0.5">Vihkiminen</h4>
                        <p className="text-stone-500 mt-1 leading-relaxed">Vihkiminen tapahtuu ulkona, juhlapaikan pihalla. Suosittelemme varustautumaan sään mukaisesti.</p>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-[#FDF7CA] border-2 border-white ring-2 ring-gold-cream/40" />
                        <h4 className="font-serif text-sm font-bold text-stone-850 mt-0.5">Osoite</h4>
                        <div className="text-stone-500 mt-1 space-y-1 leading-relaxed">
                          <p className="text-stone-700">{weddingVenue}</p>
                        </div>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-[#C3CFB5] border-2 border-white ring-2 ring-[#C3CFB5]/20" />
                        <h4 className="font-serif text-sm font-bold text-stone-850 mt-0.5">Autoilijat</h4>
                        <p className="text-stone-500 mt-1 leading-relaxed">Juhlatilalla on hyvin parkkeeraus tilaa, ohjaamme teidät sopivaan paikkaan saapuessanne.</p>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-[#FDF7CA] border-2 border-white ring-2 ring-gold-cream/40" />
                        <h4 className="font-serif text-sm font-bold text-stone-850 mt-0.5">Allergiat ja erikoisruokavaliot</h4>
                        <p className="text-stone-500 mt-1 leading-relaxed">Vastaathan alla olevaan kyselyyn allergioista ja erikoisruokavalioista mahdollisimman pian.</p>
                      </div>
                    </div>
                  </div>


                </div>

                {/* Custom Bouquet photo placeholder */}
                <div className="h-full flex flex-col">
                  <a 
                    href="https://maps.app.goo.gl/5L3r5ETQj5ViGXtr9" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group/link cursor-pointer transition-transform hover:scale-[1.01] h-full flex flex-col"
                    title="Avaa Google Maps"
                  >
                    <ImagePlaceholder
                      id="flowers"
                      label="Tuleva hääpari tai kukkainspiraatio"
                      aspectRatio="custom"
                      className="h-full min-h-[300px] md:min-h-0 md:h-full"
                      imageUrl={customImages.flowers}
                      onUpdateImage={handleUpdateImage}
                      onResetImage={handleResetImage}
                      defaultGraphicType="flowers"
                    />
                  </a>
                </div>

              </div>

              {/* LAHJAT JA MUISTAMINEN CARD */}
              <div className="w-full mt-8">
                <div className="rounded-2xl glass-panel p-6 shadow-xs text-center space-y-3.5">
                  <div className="mx-auto w-10 h-10 rounded-full bg-white/60 border border-white flex items-center justify-center text-stone-700 select-none">
                    <Gift size={18} id="gift-icon" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-stone-800 mb-2" id="gift-card-title">Lahjat ja Muistaminen</h4>
                    <p className="font-sans text-xs text-stone-600 leading-relaxed" id="gift-card-desc">
                      Jos haluatte muistaa meitä, voitte lahjoittaa häämatkatilillemme.
                    </p>
                  </div>
                  
                  <div className="py-2 px-4 bg-white/50 rounded-xl border border-[#C3CFB5]/30 inline-block font-sans text-stone-850 text-xs font-bold tracking-wider select-all" id="iban-display">
                    FI31 3939 1010 0564 95
                  </div>

                  <p className="font-sans text-[11px] text-stone-550 italic" id="gift-note">
                    Kirjoittakaa viestikenttään "häälahja/lahjoitus"
                  </p>

                  <div className="pt-2 select-text" id="signature-container">
                    <p className="font-script text-4xl text-[#8E9C7F] block" id="signature-text">
                      Kiitos - Niemet
                    </p>
                  </div>
                </div>
              </div>

              <hr className="border-sage/20 my-10" />

              {/* THE WEDDING RESPONSIVE RSVP SECTION */}
              <div id="guest-rsvp-section" className="max-w-xl mx-auto border-t border-sage/10 pt-4 space-y-6">
                <RSVPForm onAddResponse={handleAddResponse} />
              </div>

            </motion.div>

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#1C251F] text-stone-400 py-12 px-6 border-t border-stone-800 mt-20 select-none">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TulipSingle budColor="#FFFEF4" size={32} />
            <span className="font-serif text-lg text-white font-medium italic select-text">{weddingNames}</span>
          </div>
          <p className="font-sans text-xs leading-relaxed text-stone-500 max-w-sm mx-auto">
            Tehty rakkaudella
          </p>
          <p 
            className="font-sans text-[10px] text-stone-600 cursor-default select-none active:opacity-80"
            onClick={handleCopyrightClick}
            title={isAdmin ? "Määritystila aktiivinen" : undefined}
          >
            © 2026 Kaikki oikeudet pidätetään hääparille. {isAdmin && <span className="text-[9px] text-emerald-500/80 ml-1">(Määritystila aktivoitu)</span>}
          </p>
        </div>
      </footer>
    </div>
  );
}
