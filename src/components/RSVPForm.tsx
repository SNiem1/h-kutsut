import React, { useState } from 'react';
import { RSVPResponse, Web3FormsConfig } from '../types';
import { TulipSingle } from './TulipSVG';
import { Heart, Send, Check, HeartCrack } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RSVPFormProps {
  onAddResponse: (response: RSVPResponse) => void;
  web3FormsConfig: Web3FormsConfig;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ onAddResponse, web3FormsConfig }) => {
  const [name, setName] = useState('');
  const [lactoseFree, setLactoseFree] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [noAllergies, setNoAllergies] = useState(false);
  const [otherAllergies, setOtherAllergies] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleLactoseChange = (checked: boolean) => {
    setLactoseFree(checked);
    if (checked) {
      setNoAllergies(false);
    }
  };

  const handleGlutenChange = (checked: boolean) => {
    setGlutenFree(checked);
    if (checked) {
      setNoAllergies(false);
    }
  };

  const handleNoAllergiesChange = (checked: boolean) => {
    setNoAllergies(checked);
    if (checked) {
      setLactoseFree(false);
      setGlutenFree(false);
      setOtherAllergies('');
    }
  };

  const handleOtherAllergiesChange = (value: string) => {
    setOtherAllergies(value);
    if (value.trim()) {
      setNoAllergies(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    const newResponse: RSVPResponse = {
      id: Date.now().toString(),
      name: name.trim(),
      lactoseFree,
      glutenFree,
      noAllergies,
      otherAllergies: otherAllergies.trim(),
      message: message.trim(),
      timestamp: new Date().toLocaleString('fi-FI'),
    };

    // Submission logic
    if (web3FormsConfig && web3FormsConfig.accessKey) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            access_key: web3FormsConfig.accessKey,
            subject: `Uusi hääilmoittautuminen: ${newResponse.name}`,
            from_name: 'Hääkutsu RSVP',
            Nimi: newResponse.name,
            Laktoositon: newResponse.lactoseFree ? 'Kyllä' : 'Ei',
            Gluteeniton: newResponse.glutenFree ? 'Kyllä' : 'Ei',
            'Ei allergioita': newResponse.noAllergies ? 'Kyllä' : 'Ei',
            'Muut allergiat/ruokavaliot': newResponse.otherAllergies || '-',
            Terveiset: newResponse.message || '-',
            Aikaleima: newResponse.timestamp,
          }),
        });
      } catch (error) {
        console.error('Web3Forms submit error:', error);
      }
    } else {
      console.log('Huom: Web3Forms access key puuttuu. Vastaukset tallentuvat vain paikallisesti selaimeen esittelyä varten.');
    }

    // Add locally to state list for review in browser
    onAddResponse(newResponse);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form fields
      setName('');
      setLactoseFree(false);
      setGlutenFree(false);
      setNoAllergies(false);
      setOtherAllergies('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel-heavy p-6 md:p-8 transition-all duration-500 hover:shadow-2xl">
      
      {/* Decorative floral corner arches */}
      <div className="absolute right-0 top-0 rotate-90 opacity-20 pointer-events-none select-none">
        <TulipSingle size={50} />
      </div>
      <div className="absolute left-0 bottom-0 -rotate-90 opacity-20 pointer-events-none select-none">
        <TulipSingle size={50} />
      </div>

      <AnimatePresence mode="wait">
        {!submitSuccess ? (
          <motion.form
             id="rsvp-wedding-form"
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="text-center">
              <h3 className="font-serif text-2xl font-bold tracking-tight text-stone-850">
                Allergiat ja erikoisruokavaliot
              </h3>
              <p className="font-sans text-xs text-stone-500 mt-1">
                Ilmoitathan allergiat ja erikoisruokavaliot tarjoilujen suunnittelua varten.
              </p>
              <p className="font-sans text-[11px] text-[#8E9C7F] font-semibold mt-1.5 leading-relaxed italic max-w-xs mx-auto">
                * Ilmoittakaa tiedot henkilökohtaisesti, jotta saamme tarkat määrät.
              </p>
              {web3FormsConfig.accessKey ? (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-sans font-medium text-emerald-800 border border-emerald-100/60 select-none">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Yhdistetty sähköpostiin (Web3Forms)
                </div>
              ) : (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#FAF9F5] px-2.5 py-0.5 text-[10px] font-sans font-medium text-stone-500 border border-stone-200/40 select-none">
                  <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                  Käytetään testitilaa (vastaukset tallentuvat vain selaimen muistiin)
                </div>
              )}
            </div>

            {/* Guest Name input with smooth focus boundary transition */}
            <div className="space-y-1.5">
              <label htmlFor="guest-full-name" className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                Nimi *
              </label>
              <input
                id="guest-full-name"
                name="guest-full-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Esim. Sofia tai Elias"
                className="w-full rounded-xl px-4 py-3 font-sans text-xs text-stone-800 placeholder-stone-400 glass-input"
              />
            </div>

            {/* Dietary Sub-section */}
            <div className="space-y-3 rounded-2xl bg-white/60 border border-white/80 p-4 mt-2 shadow-xs">
              <label className="block font-serif text-sm font-bold text-stone-855 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-sage-dark" />
                Valitse ruokavaliot
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-1">
                {/* Checkbox 1: Laktoositon */}
                <label className="relative flex items-center cursor-pointer select-none gap-2 px-2 py-1.5 rounded-xl border border-stone-200/40 hover:bg-white/40 group">
                  <div className="relative">
                    <input
                      id="checkbox-lactose-free"
                      type="checkbox"
                      checked={lactoseFree}
                      onChange={(e) => handleLactoseChange(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`h-5 w-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${
                      lactoseFree ? 'border-sage-dark bg-[#C3CFB5]/80' : 'border-sage bg-white group-hover:bg-[#FDF7CA]/55'
                    }`}>
                      {lactoseFree && <Check size={12} className="text-stone-850 stroke-[3px]" />}
                    </div>
                  </div>
                  <span className="font-sans text-[11px] text-stone-700 font-medium">Laktoositon</span>
                </label>

                {/* Checkbox 2: Gluteeniton */}
                <label className="relative flex items-center cursor-pointer select-none gap-2 px-2 py-1.5 rounded-xl border border-stone-200/40 hover:bg-white/40 group">
                  <div className="relative">
                    <input
                      id="checkbox-gluten-free"
                      type="checkbox"
                      checked={glutenFree}
                      onChange={(e) => handleGlutenChange(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`h-5 w-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${
                      glutenFree ? 'border-sage-dark bg-[#C3CFB5]/80' : 'border-sage bg-white group-hover:bg-[#FDF7CA]/55'
                    }`}>
                      {glutenFree && <Check size={12} className="text-stone-850 stroke-[3px]" />}
                    </div>
                  </div>
                  <span className="font-sans text-[11px] text-stone-700 font-medium">Gluteeniton</span>
                </label>

                {/* Checkbox 3: Ei allergioita */}
                <label className="relative flex items-center cursor-pointer select-none gap-2 px-2 py-1.5 rounded-xl border border-stone-200/40 hover:bg-white/40 group">
                  <div className="relative">
                    <input
                      id="checkbox-no-allergies"
                      type="checkbox"
                      checked={noAllergies}
                      onChange={(e) => handleNoAllergiesChange(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`h-5 w-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${
                      noAllergies ? 'border-sage-dark bg-[#C3CFB5]/80' : 'border-sage bg-white group-hover:bg-[#FDF7CA]/55'
                    }`}>
                      {noAllergies && <Check size={12} className="text-stone-850 stroke-[3px]" />}
                    </div>
                  </div>
                  <span className="font-sans text-[11px] text-stone-700 font-medium">Ei allergioita</span>
                </label>
              </div>

              {/* Textarea: Kerro allergiasi tai erikoisruokavaliosi */}
              <div className="space-y-1 mt-2">
                <label htmlFor="allergies-text-field" className="block font-sans text-[11px] font-semibold text-stone-600">
                  Muut allergiat tai erikoisruokavaliot
                </label>
                <textarea
                  id="allergies-text-field"
                  name="allergies-text-field"
                  rows={2}
                  value={otherAllergies}
                  onChange={(e) => handleOtherAllergiesChange(e.target.value)}
                  placeholder="Laadi tähän esim. pähkinäallergia, vegaani jne."
                  className="w-full rounded-xl px-3 py-2 text-xs font-sans text-stone-800 placeholder-stone-400 focus:outline-none transition-smooth glass-input h-20 resize-none"
                />
              </div>
            </div>

            {/* Custom Greetings Message */}
            <div className="space-y-1.5">
              <label htmlFor="guest-message-field" className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-700">
                Terveiset tai toiveet hääparille (Vapaaehtoinen)
              </label>
              <textarea
                id="guest-message-field"
                name="guest-message-field"
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Lämmin tervehdys tulevalle avioparille..."
                className="w-full rounded-xl px-4 py-3 font-sans text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-smooth glass-input h-16 resize-none"
              />
            </div>

            {/* Submit button with spinner and state loading */}
            <button
              id="submit-rsvp-button"
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="group/btn relative w-full flex items-center justify-center gap-2 rounded-2xl bg-[#C3CFB5] hover:bg-[#6B755D] py-3.5 font-serif text-md font-semibold text-stone-850 hover:text-white disabled:opacity-50 transition-smooth shadow-lg hover:-translate-y-0.5 active:scale-95 uppercase tracking-widest text-xs cursor-pointer select-none"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-stone-800 border-t-transparent" />
              ) : (
                <>
                  <Send size={16} className="transition-transform group-hover/btn:translate-x-1 duration-200" />
                  <span>Lähetä tiedot</span>
                </>
              )}
            </button>
          </motion.form>
        ) : (
          /* Submission success beautiful celebratory state Card */
          <motion.div
            id="rsvp-success-card"
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-10 px-2"
          >
            <div className="h-16 w-16 bg-[#C3CFB5]/30 rounded-full flex items-center justify-center mb-5 text-sage-dark animate-bounce">
              <Heart className="fill-rose-500 text-rose-500 animate-pulse" size={32} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-800 mb-2">
              Suuret kiitokset! 🌸
            </h3>
            <p className="font-sans text-xs text-stone-600 max-w-sm leading-relaxed mb-6">
              Ruokavalio- ja muut tiedot on välitetty hääparille onnistuneesti. Odottakaamme innolla yhteistä suurta päivää!
            </p>
            <button
              id="submit-new-rsvp-btn"
              onClick={() => setSubmitSuccess(false)}
              className="text-xs font-semibold text-[#8E9C7F] hover:underline"
            >
              Ilmoita uudet tiedot tai uusi vieras tarvittaessa
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
