import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [authStep, setAuthStep] = useState<'options' | 'success'>('options');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setAuthStep('success');
    }
  };

  const handleProviderLogin = (name: string) => {
    setSelectedProvider(name);
    setTimeout(() => {
      setAuthStep('success');
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-[#09090B]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full border border-[#d5d5d5] shadow-none relative p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E6E3DC]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#09090B] text-white flex items-center justify-center font-bold text-xs font-serif">
              A
            </span>
            <span className="font-title-md text-[16px] text-[#09090B] font-bold">
              Institutional Access Portal
            </span>
          </div>
          <button onClick={onClose} className="text-[#838383] hover:text-[#09090B] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {authStep === 'options' ? (
          <div className="space-y-4">
            <p className="font-body-sm text-[13px] text-[#838383]">
              Verify identity via sovereign university credentials, EduID Africa federation, or institutional email for executive benchmarking and registry submissions.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleProviderLogin('EduID Africa')}
                className="w-full flex items-center justify-between p-3 bg-[#f9f9f9] hover:bg-[#E6E3DC] border border-[#d5d5d5] text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#09090B]">badge</span>
                  <div>
                    <div className="font-title-md text-[13px] text-[#09090B] font-bold">
                      EduID Africa Single Sign-On
                    </div>
                    <div className="text-[11px] text-[#838383]">EAC, SADC &amp; ECOWAS federated identity</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#838383]">chevron_right</span>
              </button>

              <button
                onClick={() => handleProviderLogin('African National Research Network')}
                className="w-full flex items-center justify-between p-3 bg-[#f9f9f9] hover:bg-[#E6E3DC] border border-[#d5d5d5] text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#164A3A]">hub</span>
                  <div>
                    <div className="font-title-md text-[13px] text-[#09090B] font-bold">
                      UbuntuNet / WACREN NREN
                    </div>
                    <div className="text-[11px] text-[#838383]">National Research &amp; Education Networks</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#838383]">chevron_right</span>
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#d5d5d5]"></div>
              <span className="flex-shrink mx-3 text-[#8c8e87] text-[11px] font-code-badge uppercase">
                Or Institutional Email
              </span>
              <div className="flex-grow border-t border-[#d5d5d5]"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-code-badge text-[10px] uppercase font-semibold text-[#09090B] mb-1">
                  Accredited Domain Email (.ac.* / .edu.*)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. registrar@uonbi.ac.ke"
                  className="w-full bg-[#f2f2f2] border border-[#d5d5d5] p-2.5 text-xs text-[#232323] outline-none focus:border-[#09090B]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#09090B] text-white py-2.5 font-title-md text-[13px] hover:bg-[#2A6B55] transition-colors cursor-pointer shadow-xs"
              >
                Authenticate Institutional Session
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#D9D7D0] text-[#0d2e24] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[26px]">verified</span>
            </div>
            <h4 className="font-headline-sm text-[18px] text-[#09090B] font-serif font-bold">
              Access Token Provisioned
            </h4>
            <p className="font-body-sm text-[13px] text-[#838383]">
              Authenticated as verified researcher ({selectedProvider || email}). You now have unrestricted access to raw longitudinal datasets and the University Submissions Console.
            </p>
            <button
              onClick={() => {
                setAuthStep('options');
                onClose();
              }}
              className="mt-4 px-6 py-2 bg-[#09090B] text-white text-xs font-semibold cursor-pointer"
            >
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
