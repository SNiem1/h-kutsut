import React, { useState } from 'react';
import { RSVPResponse } from '../types';
import { Users, CheckCircle, XCircle, Search, Trash2, ShieldAlert, Sparkles, Download, Copy, Check } from 'lucide-react';

interface AdminRSVPListProps {
  responses: RSVPResponse[];
  onDeleteResponse: (id: string) => void;
  onClearAll: () => void;
}

export const AdminRSVPList: React.FC<AdminRSVPListProps> = ({
  responses,
  onDeleteResponse,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredResponses = responses.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.otherAllergies || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.message || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const totalCount = responses.length;
  const lactoseCount = responses.filter((r) => r.lactoseFree).length;
  const glutenCount = responses.filter((r) => r.glutenFree).length;
  const customDietCount = responses.filter(
    (r) => r.otherAllergies && r.otherAllergies.trim().length > 0
  ).length;

  const copyDietSummary = () => {
    const summary = responses
      .map((r) => {
        const diets = [];
        if (r.lactoseFree) diets.push('Laktoositon');
        if (r.glutenFree) diets.push('Gluteeniton');
        if (r.otherAllergies) diets.push(`Muu: ${r.otherAllergies}`);
        return `${r.name}: ${diets.join(', ') || 'Ei allergioita'}`;
      })
      .join('\n');

    navigator.clipboard.writeText(summary);
    setCopiedId('summary');
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="rounded-2xl glass-panel p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-sage/20 pb-4 mb-6">
        <div>
          <h4 className="font-serif text-xl font-bold text-stone-800 flex items-center gap-2">
            <Users className="text-sage-dark" size={22} />
            Häävieraiden ilmoittautumiset
          </h4>
          <p className="font-sans text-xs text-stone-500 mt-0.5">
            Tästä näet kootusti vieraslistan ja erikoisruokavaliot ({responses.length} vastausta)
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {responses.length > 0 && (
            <>
              <button
                id="copy-diet-summary-btn"
                onClick={copyDietSummary}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-sage/30 bg-white/60 px-3 py-1.5 font-sans text-xs font-semibold text-stone-700 hover:bg-[#C3CFB5]/30 transition-all cursor-pointer"
              >
                {copiedId === 'summary' ? (
                  <>
                    <Check size={14} className="text-emerald-700" />
                    Kopioitu!
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Kopioi ruokavaliot
                  </>
                )}
              </button>
              <button
                id="clear-all-rsvps-btn"
                onClick={() => {
                  if (window.confirm('Haluatko varmasti poistaa kaikki ilmoittautumiset selaimesi muistista?')) {
                    onClearAll();
                  }
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white/60 px-3 py-1.5 font-sans text-xs font-bold text-rose-600 hover:bg-rose-50/80 transition-all cursor-pointer"
              >
                <Trash2 size={14} />
                Tyhjennä lista
              </button>
            </>
          )}
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl bg-white/30 border border-dashed border-sage/40">
          <Sparkles className="text-[#C3CFB5] mb-2.5 opacity-80" size={36} />
          <p className="font-serif text-md italic text-stone-700">Ei vielä ilmoittautumisia</p>
          <p className="font-sans text-xs text-stone-400 mt-1 max-w-sm">
            Tee ensimmäinen testivastaus täyttämällä hääkutsun RSVP-lomake!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick Real-time Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl border border-white/60 bg-white/40 p-3 text-center">
              <span className="block font-sans text-[10px] uppercase tracking-wider text-stone-500 font-medium">Ilmoitukset yhteensä</span>
              <span className="font-serif text-2xl font-bold text-stone-800 mt-1 block">{totalCount}</span>
            </div>
            <div className="rounded-xl border border-white/60 bg-white/40 p-3 text-center">
              <span className="block font-sans text-[10px] uppercase tracking-wider text-stone-500 font-medium font-sans">Laktoositon</span>
              <span className="font-serif text-2xl font-bold text-[#869675] mt-1 block">{lactoseCount}</span>
            </div>
            <div className="rounded-xl border border-white/60 bg-white/40 p-3 text-center">
              <span className="block font-sans text-[10px] uppercase tracking-wider text-stone-500 font-medium font-sans font-sans">Gluteeniton</span>
              <span className="font-serif text-2xl font-bold text-[#869675] mt-1 block">{glutenCount}</span>
            </div>
            <div className="rounded-xl border border-white/60 bg-white/40 p-3 text-center">
              <span className="block font-sans text-[10px] uppercase tracking-wider text-stone-500 font-medium font-sans font-sans">Muu erityisruoka</span>
              <span className="font-serif text-2xl font-bold text-[#869675] mt-1 block">{customDietCount}</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative font-sans text-xs">
            <Search className="absolute left-3 top-3 text-stone-400" size={16} />
            <input
              id="rsvp-search-field"
              type="text"
              placeholder="Etsi vierasta, allergiatietoa tai viestiä..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl py-2.5 pl-10 pr-4 text-stone-700 placeholder-stone-400 glass-input"
            />
          </div>

          {/* Guest list scrollable region */}
          <div className="overflow-x-auto rounded-xl border border-sage/20 bg-white/60 backdrop-blur-xs">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F9F3]/60 border-b border-sage/20 text-stone-600 uppercase tracking-wider font-semibold text-[10px] select-none">
                  <th className="py-3 px-4">Nimi</th>
                  <th className="py-3 px-4">Erityisruokavaliot</th>
                  <th className="py-3 px-4">Terveiset parille</th>
                  <th className="py-3 px-4 text-center">Toiminnot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredResponses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-stone-400 italic">
                      Hakullasi ei löytynyt ilmoittautumisia.
                    </td>
                  </tr>
                ) : (
                  filteredResponses.map((res) => (
                    <tr id={`rsvp-row-${res.id}`} key={res.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-stone-800">{res.name}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {res.lactoseFree && (
                            <span className="rounded bg-[#C3CFB5]/30 text-stone-850 px-1.5 py-0.5 text-[10px] font-medium">
                              Laktoositon
                            </span>
                          )}
                          {res.glutenFree && (
                            <span className="rounded bg-[#C3CFB5]/30 text-stone-850 px-1.5 py-0.5 text-[10px] font-medium">
                              Gluteeniton
                            </span>
                          )}
                          {res.otherAllergies && res.otherAllergies.trim() !== '' ? (
                            <span className="rounded bg-[#FDF7CA] text-stone-850 border border-[#C3CFB5]/40 px-1.5 py-0.5 text-[10px] font-medium" title={res.otherAllergies}>
                              Muu: {res.otherAllergies}
                            </span>
                          ) : null}
                          {!res.lactoseFree && !res.glutenFree && (!res.otherAllergies || res.otherAllergies.trim() === '') && (
                            <span className="text-stone-400 italic">Ei rajoitteita</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 italic text-stone-600 max-w-xs truncate" title={res.message}>
                        {res.message || <span className="text-stone-300">Ei viestiä</span>}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          id={`delete-rsvp-btn-${res.id}`}
                          onClick={() => onDeleteResponse(res.id)}
                          className="rounded-lg p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Poista vastaus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
