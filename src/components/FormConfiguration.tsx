import React, { useState } from 'react';
import { Web3FormsConfig } from '../types';
import { Settings, Check, HelpCircle, Save, Clipboard } from 'lucide-react';
import { motion } from 'motion/react';

interface FormConfigurationProps {
  config: Web3FormsConfig;
  onSaveConfig: (newConfig: Web3FormsConfig) => void;
}

export const FormConfiguration: React.FC<FormConfigurationProps> = ({ config, onSaveConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [accessKey, setAccessKey] = useState(config.accessKey || '');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      accessKey: accessKey.trim(),
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const fillTemplate = () => {
    setAccessKey('YOUR_WEB3FORMS_ACCESS_KEY_HERE');
  };

  return (
    <div className="rounded-2xl glass-panel p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/60 p-2 text-[#8E9C7F]">
            <Settings size={20} />
          </div>
          <div>
            <h4 className="font-serif text-lg font-semibold text-stone-800">
              Web3Forms-integraatio
            </h4>
            <p className="font-sans text-xs text-stone-500">
              Vastaanota vieraiden ilmoittautumiset ja erikoisruokavaliot suoraan sähköpostiisi!
            </p>
          </div>
        </div>
        <button
          id="toggle-forms-config-btn"
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-lg px-4 py-1.5 font-sans text-xs font-semibold whitespace-nowrap transition-all border ${
            isOpen
              ? 'bg-stone-100 border-stone-300 text-stone-600 hover:bg-stone-200'
              : 'bg-[#C3CFB5] border-sage/50 text-stone-800 hover:bg-[#6B755D]'
          }`}
        >
          {isOpen ? 'Sulje asetukset' : 'Määritä integraatio'}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="mt-5 border-t border-sage/20 pt-4"
        >
          {/* Quick Guide */}
          <div className="mb-5 rounded-xl bg-white/60 p-4 text-xs text-stone-700 border border-white">
            <h5 className="font-semibold text-stone-800 mb-2 flex items-center gap-1.5 font-serif text-sm">
              <HelpCircle size={16} className="text-sage-dark" />
              Kulujen poistaminen – Miten otan Web3Forms-lomakkeen käyttöön?
            </h5>
            <ol className="list-decimal list-inside space-y-1.5 text-stone-600 leading-relaxed font-sans">
              <li>
                Siirry osoitteeseen <a href="https://web3forms.com" target="_blank" rel="noreferrer" className="text-sage-dark font-medium underline">Web3Forms.com</a>.
              </li>
              <li>
                Syötä sähköpostiosoitteesi heti etusivun "Create Access Key" -kenttään. Se on <strong>täysin ilmainen</strong> up to 250 viestiä kuukaudessa (mikä riittää hääilmoittautumisille erinomaisesti)!
              </li>
              <li>
                Saat sähköpostiisi salaisen <strong>Access Key</strong> -avaimen (UUID-merkkijono).
              </li>
              <li>
                Liitä saamasi avain alla olevaan kenttään ja tallenna. Tämän jälkeen vieraiden lähetykset saapuvat suoraan sähköpostiisi Web3Formsin kautta!
              </li>
            </ol>
          </div>

          <form onSubmit={handleSave} className="space-y-4 font-sans text-xs">
            {/* Access Key Input */}
            <div>
              <label className="block font-semibold text-stone-700 uppercase tracking-widest mb-1">
                Web3Forms Access Key
              </label>
              <input
                id="config-access-key"
                type="text"
                required
                placeholder="Esim. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-stone-700 glass-input text-xs"
              />
              <span className="text-[10px] text-stone-400">Tätä avainta käytetään viestien ohjaamiseen oikeaan sähköpostilaatikkoosi ilman näkyviä osoitteita sivustolla.</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between border-t border-sage/10 pt-4 mt-2">
              <p className="text-[10px] text-stone-400">
                Määritykset tallentuvat selaimesi muistiin ja lomake on heti käyttövalmis tuotannossa.
              </p>
              <button
                id="save-forms-config-btn"
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-sage-dark px-4 py-2 font-sans text-xs font-semibold text-white hover:bg-[#6D7B5F] transition-colors shadow-sm cursor-pointer"
              >
                <Save size={14} />
                Tallenna avain
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Success Toast */}
      {showSavedToast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-xl bg-stone-900 px-4 py-2.5 text-xs text-white shadow-xl animate-bounce">
          <Check size={16} className="text-sage" />
          <span>Web3Forms-avain tallennettu onnistuneesti!</span>
        </div>
      )}
    </div>
  );
};
