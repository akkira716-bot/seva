const fs = require('fs');
const path = require('path');

// 1. Load translations from update-docs-i18n.js
const i18nSource = fs.readFileSync(path.join(__dirname, 'update-docs-i18n.js'), 'utf8');
const i18nFunc = new Function('require', i18nSource + '; return { TRANSLATIONS, SUPPORTED_LANGS };');
const { TRANSLATIONS, SUPPORTED_LANGS } = i18nFunc(require);

console.log('Loaded TRANSLATIONS languages:', Object.keys(TRANSLATIONS));
console.log('Loaded SUPPORTED_LANGS count:', SUPPORTED_LANGS.length);

// 2. Read docs/index.html
const indexPath = path.join(__dirname, 'docs', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// A. Update font links in <head> to include Arabic / Urdu font
if (!html.includes('Noto+Sans+Arabic')) {
  html = html.replace(
    '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">',
    '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Arabic:wght@400;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">'
  );
}

// B. Update CSS for RTL
const rtlStyle = `
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    html[dir="rtl"], body[dir="rtl"], .rtl {
      direction: rtl;
      text-align: right;
      font-family: 'Noto Sans Arabic', 'Plus Jakarta Sans', system-ui, sans-serif;
    }
    [dir="rtl"] .space-x-1 > :not([hidden]) ~ :not([hidden]),
    [dir="rtl"] .space-x-2 > :not([hidden]) ~ :not([hidden]),
    [dir="rtl"] .space-x-3 > :not([hidden]) ~ :not([hidden]),
    [dir="rtl"] .space-x-4 > :not([hidden]) ~ :not([hidden]) {
      --tw-space-x-reverse: 1;
    }
    [dir="rtl"] .text-left { text-align: right !important; }
    [dir="rtl"] .text-right { text-align: left !important; }
    [dir="rtl"] .font-mono, [dir="rtl"] input[type="date"], [dir="rtl"] input[type="tel"] {
      direction: ltr;
      text-align: left;
    }
    @media print {
      .no-print { display: none !important; }
      .print-only { display: block !important; }
    }
`;

html = html.replace(/<style>[\s\S]*?<\/style>/, `<style>${rtlStyle}</style>`);

// C. Replace SUPPORTED_LANGS definition with 11 languages with dir
const supportedLangsCode = `    const SUPPORTED_LANGS = [
      { code: 'en', flag: '🇬🇧', name: 'English', nativeName: 'English', dir: 'ltr' },
      { code: 'hi', flag: '🇮🇳', name: 'हिन्दी', nativeName: 'हिन्दी (Hindi)', dir: 'ltr' },
      { code: 'te', flag: '🇮🇳', name: 'తెలుగు', nativeName: 'తెలుగు (Telugu)', dir: 'ltr' },
      { code: 'ta', flag: '🇮🇳', name: 'தமிழ்', nativeName: 'தமிழ் (Tamil)', dir: 'ltr' },
      { code: 'kn', flag: '🇮🇳', name: 'ಕನ್ನಡ', nativeName: 'ಕನ್ನಡ (Kannada)', dir: 'ltr' },
      { code: 'bn', flag: '🇮🇳', name: 'বাংলা', nativeName: 'বাংলা (Bengali)', dir: 'ltr' },
      { code: 'mr', flag: '🇮🇳', name: 'मराठी', nativeName: 'मराठी (Marathi)', dir: 'ltr' },
      { code: 'ur', flag: '🇵🇰', name: 'اردو', nativeName: 'اردو (Urdu)', dir: 'rtl' },
      { code: 'or', flag: '🇮🇳', name: 'ଓଡ଼ିଆ', nativeName: 'ଓଡ଼ିଆ (Odia)', dir: 'ltr' },
      { code: 'ml', flag: '🇮🇳', name: 'മലയാളം', nativeName: 'മലയാളം (Malayalam)', dir: 'ltr' },
      { code: 'gu', flag: '🇮🇳', name: 'ગુજરાતી', nativeName: 'ગુજરાતી (Gujarati)', dir: 'ltr' }
    ];

    const TRANSLATIONS = ${JSON.stringify(TRANSLATIONS, null, 2)};

    const LanguageContext = React.createContext({
      activeLang: 'en',
      setActiveLang: () => {},
      t: (k, fb) => fb || k,
      isRTL: false
    });

    const useLang = () => React.useContext(LanguageContext);
`;

html = html.replace(/const SUPPORTED_LANGS = \[[\s\S]*?\];/, supportedLangsCode);

// D. Update React imports to include createContext, useContext
html = html.replace(
  'const { useState, useEffect, useMemo } = React;',
  'const { useState, useEffect, useMemo, createContext, useContext } = React;'
);

// E. Update activeLang in App()
const oldLangState = `      const [activeRole, setActiveRole] = useState('mother');
      const [activeLang, setActiveLang] = useState('en');`;

const newLangState = `      const [activeRole, setActiveRole] = useState('mother');
      const [activeLang, setActiveLang] = useState(() => {
        try {
          const saved = localStorage.getItem('maatrusetu_lang') || localStorage.getItem('seva_lang');
          return (saved && SUPPORTED_LANGS.some(l => l.code === saved)) ? saved : 'en';
        } catch (e) {
          return 'en';
        }
      });

      const isRTL = activeLang === 'ur';

      useEffect(() => {
        try {
          localStorage.setItem('maatrusetu_lang', activeLang);
          localStorage.setItem('seva_lang', activeLang);
        } catch (e) {}
        document.documentElement.lang = activeLang;
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      }, [activeLang, isRTL]);

      const t = (key, fallback) => {
        if (TRANSLATIONS[activeLang] && TRANSLATIONS[activeLang][key]) {
          return TRANSLATIONS[activeLang][key];
        }
        if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
          return TRANSLATIONS['en'][key];
        }
        return fallback || key;
      };`;

html = html.replace(oldLangState, newLangState);

// F. Wrap App return with LanguageContext.Provider
html = html.replace(
  'return (\n        <div className="flex flex-col min-h-screen">',
  'return (\n        <LanguageContext.Provider value={{ activeLang, setActiveLang, t, isRTL }}>\n        <div className={`flex flex-col min-h-screen ${isRTL ? \'rtl\' : \'\'}`} dir={isRTL ? \'rtl\' : \'ltr\'}>'
);

html = html.replace(
  '          {/* Onboarding Registration Modal */}\n          {onboardModalOpen && (',
  '          {/* Onboarding Registration Modal */}\n          {onboardModalOpen && ('
);

// Close LanguageContext.Provider at end of App return
html = html.replace(
  '        </div>\n      );\n    }\n\n    // ---------------- SUBVIEW: MAATRUSETU DASHBOARD ----------------',
  '        </div>\n        </LanguageContext.Provider>\n      );\n    }\n\n    // ---------------- SUBVIEW: MAATRUSETU DASHBOARD ----------------'
);

// G. Update Emergency Ticker with translations
html = html.replace(
  '<strong>URGENT MEDICAL TRIAGE:</strong> Experiencing fever &ge;100.4&deg;F, heavy bleeding &gt;1 pad/hr, or infant lethargy?',
  '<strong>{t(\'ticker_label\', \'URGENT MEDICAL TRIAGE:\')}</strong> {t(\'ticker_text\', \'Experiencing fever ≥100.4°F, heavy bleeding >1 pad/hr, or infant lethargy?\')}'
);
html = html.replace(
  'Call 108 Ambulance',
  "{t('ticker_call', 'Call 108 Ambulance')}"
);
html = html.replace(
  'Red Flag Matrix →',
  "{t('ticker_matrix', 'Red Flag Matrix →')}"
);

// H. Brand subtitle
html = html.replace(
  '<p className="text-[10px] text-slate-500 font-medium hidden sm:block">Maternal, Newborn & Community Continuum</p>',
  '<p className="text-[10px] text-slate-500 font-medium hidden sm:block">{t(\'brand_sub\', \'Maternal, Newborn & Community Continuum\')}</p>'
);

// I. Navigation portal items
const oldNavItems = `                {[
                  { id: 'maatrusetu', label: 'MaatruSetu 42-Day', icon: '🤱', badge: 'Care' },
                  { id: 'asha', label: 'ASHA Field', icon: '👩‍⚕️', badge: 'Field' },
                  { id: 'organizer', label: 'Organizer', icon: '📅' },
                  { id: 'tracker', label: 'Vitals Tracker', icon: '📊' },
                  { id: 'urgent', label: 'Urgent Red Flags', icon: '🚨', badge: 'Urgent' },
                  { id: 'providers', label: 'Providers', icon: '🔍' },
                  { id: 'articles', label: 'Guidance', icon: '📚' },
                  { id: 'admin', label: 'Governance', icon: '🔒' }
                ].map((item) => (`;

const newNavItems = `                {[
                  { id: 'maatrusetu', label: t('nav_maatrusetu', 'MaatruSetu 42-Day'), icon: '🤱', badge: t('badge_care', 'Care') },
                  { id: 'asha', label: t('nav_asha', 'ASHA Field'), icon: '👩‍⚕️', badge: t('badge_field', 'Field') },
                  { id: 'organizer', label: t('nav_organizer', 'Organizer'), icon: '📅' },
                  { id: 'tracker', label: t('nav_tracker', 'Vitals Tracker'), icon: '📊' },
                  { id: 'urgent', label: t('nav_urgent', 'Urgent Red Flags'), icon: '🚨', badge: t('badge_urgent', 'Urgent') },
                  { id: 'providers', label: t('nav_providers', 'Providers'), icon: '🔍' },
                  { id: 'articles', label: t('nav_articles', 'Guidance'), icon: '📚' },
                  { id: 'admin', label: t('nav_admin', 'Governance'), icon: '🔒' }
                ].map((item) => (`;

html = html.replace(oldNavItems, newNavItems);

// J. Language Switcher button
const oldLangBtn = `                {/* Language Switcher */}
                <button
                  onClick={() => setLangModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold transition shadow-xs"
                >
                  <span>🌐</span>
                  <span className="uppercase text-[11px] font-mono">{activeLang}</span>
                </button>`;

const newLangBtn = `                {/* Language Switcher */}
                <button
                  onClick={() => setLangModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold transition shadow-xs"
                  title="Change Language"
                >
                  <span>🌐</span>
                  <span className="uppercase text-[11px] font-mono">{activeLang}</span>
                  <span className="hidden sm:inline text-[11px] text-slate-500 font-medium">
                    {SUPPORTED_LANGS.find(l => l.code === activeLang)?.name || 'English'}
                  </span>
                </button>`;

html = html.replace(oldLangBtn, newLangBtn);

// K. Language Modal
const oldLangModal = `          {/* Language Modal */}
          {langModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-extrabold text-base text-slate-900">Select Application Language</h3>
                  <button onClick={() => setLangModalOpen(false)} className="text-slate-400 font-bold text-lg">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
                  {SUPPORTED_LANGS.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setActiveLang(lang.code); setLangModalOpen(false); }}
                      className={\`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between \${
                        activeLang === lang.code ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }\`}
                    >
                      <span>{lang.flag} {lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}`;

const newLangModal = `          {/* Language Modal */}
          {langModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{t('lang_modal_title', 'Select Application Language')}</h3>
                    <p className="text-xs text-slate-500">11 Languages • RTL Layout for Urdu</p>
                  </div>
                  <button onClick={() => setLangModalOpen(false)} className="text-slate-400 font-bold text-lg hover:text-slate-600">✕</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto p-1">
                  {SUPPORTED_LANGS.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setActiveLang(lang.code); setLangModalOpen(false); }}
                      className={\`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition \${
                        activeLang === lang.code ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }\`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{lang.flag}</span>
                        <div className="text-left">
                          <div className="font-bold">{lang.nativeName}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-mono">{lang.code} {lang.dir === 'rtl' ? '• RTL' : ''}</div>
                        </div>
                      </div>
                      {activeLang === lang.code && <span className="text-rose-600 font-black">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}`;

html = html.replace(oldLangModal, newLangModal);

// L. Role Modal
html = html.replace(
  '<h3 className="font-extrabold text-base text-slate-900">Switch Healthcare Persona & Access Tier</h3>',
  '<h3 className="font-extrabold text-base text-slate-900">{t(\'role_modal_title\', \'Switch Healthcare Persona & Access Tier\')}</h3>'
);

// M. Onboard Modal
html = html.replace(
  '<h3 className="font-extrabold text-lg text-slate-900">Register Mother &amp; Newborn</h3>',
  '<h3 className="font-extrabold text-lg text-slate-900">{t(\'onboard_title\', \'Register Mother & Newborn\')}</h3>'
);
html = html.replace(
  '<label className="font-bold text-slate-700 block mb-1">Mother Full Name</label>',
  '<label className="font-bold text-slate-700 block mb-1">{t(\'form_mother_name\', \'Mother Full Name\')}</label>'
);
html = html.replace(
  '<label className="font-bold text-slate-700 block mb-1">Mother Age</label>',
  '<label className="font-bold text-slate-700 block mb-1">{t(\'form_mother_age\', \'Mother Age\')}</label>'
);
html = html.replace(
  '<label className="font-bold text-slate-700 block mb-1">Infant Name</label>',
  '<label className="font-bold text-slate-700 block mb-1">{t(\'form_baby_name\', \'Infant Name\')}</label>'
);
html = html.replace(
  '<label className="font-bold text-slate-700 block mb-1">Infant Biological Sex</label>',
  '<label className="font-bold text-slate-700 block mb-1">{t(\'form_baby_sex\', \'Infant Biological Sex\')}</label>'
);
html = html.replace(
  '<label className="font-bold text-slate-700 block mb-1">Birth Date</label>',
  '<label className="font-bold text-slate-700 block mb-1">{t(\'form_birth_date\', \'Birth Date\')}</label>'
);
html = html.replace(
  '<label className="font-bold text-slate-700 block mb-1">Birth Weight (kg)</label>',
  '<label className="font-bold text-slate-700 block mb-1">{t(\'form_birth_weight\', \'Birth Weight (kg)\')}</label>'
);
html = html.replace(
  'Cancel\n                  </button>',
  '{t(\'btn_cancel\', \'Cancel\')}\n                  </button>'
);
html = html.replace(
  'Register &amp; Launch Continuum\n                  </button>',
  '{t(\'btn_submit\', \'Register & Launch Continuum\')}\n                  </button>'
);

// N. MaatruSetuDashboard
html = html.replace(
  'function MaatruSetuDashboard({ records, selectedRecord, careDay, onSelectRecordId, onOpenOnboarding }) {\n      const [clinicalTab, setClinicalTab] = useState(\'guidance\');',
  'function MaatruSetuDashboard({ records, selectedRecord, careDay, onSelectRecordId, onOpenOnboarding }) {\n      const { t, isRTL } = useLang();\n      const [clinicalTab, setClinicalTab] = useState(\'guidance\');'
);

html = html.replace(
  '<span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Mother Profile:</span>',
  '<span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">{t(\'mother_profile\', \'Mother Profile\')}:</span>'
);

html = html.replace(
  '<span>+ Register Mother &amp; Newborn</span>',
  '<span>{t(\'register_button\', \'+ Register Mother & Newborn\')}</span>'
);

html = html.replace(
  '<span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">Mother Profile</span>',
  '<span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">{t(\'mother_profile\', \'Mother Profile\')}</span>'
);

html = html.replace(
  'Age: {selectedRecord.mother.age} yrs • RCH ID: {selectedRecord.mother.rchId}',
  '{t(\'age\', \'Age\')}: {selectedRecord.mother.age} {t(\'years\', \'yrs\')} • {t(\'rch_id\', \'RCH ID\')}: {selectedRecord.mother.rchId}'
);

html = html.replace(
  'Phone: {selectedRecord.mother.phone}',
  '{t(\'phone\', \'Phone\')}: {selectedRecord.mother.phone}'
);

html = html.replace(
  '{selectedRecord.healthStatus === \'stable\' ? \'Clinical Status: STABLE\' : \'Clinical Status: ATTENTION NEEDED\'}',
  '{selectedRecord.healthStatus === \'stable\' ? t(\'status_stable\', \'Clinical Status: STABLE\') : t(\'status_attention\', \'Clinical Status: ATTENTION NEEDED\')}'
);

html = html.replace(
  '<span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">Newborn Profile</span>',
  '<span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">{t(\'newborn_profile\', \'Newborn Profile\')}</span>'
);

html = html.replace(
  'Sex: {selectedRecord.newborn.sex.toUpperCase()} • Birth Weight: {selectedRecord.newborn.birthWeightKg} kg',
  '{t(\'sex\', \'Sex\')}: {selectedRecord.newborn.sex.toUpperCase()} • {t(\'birth_weight\', \'Birth Weight\')}: {selectedRecord.newborn.birthWeightKg} kg'
);

html = html.replace(
  'Gestational Age: {selectedRecord.newborn.gestationalAgeWeeks} weeks',
  '{t(\'gestational_age\', \'Gestational Age\')}: {selectedRecord.newborn.gestationalAgeWeeks} {t(\'weeks\', \'weeks\')}'
);

html = html.replace(
  'Born on: {selectedRecord.newborn.birthDate}',
  '{t(\'born_on\', \'Born on\')}: {selectedRecord.newborn.birthDate}'
);

html = html.replace(
  '<span className="text-xs font-bold uppercase tracking-wider text-rose-100">42-Day Postnatal Continuum</span>',
  '<span className="text-xs font-bold uppercase tracking-wider text-rose-100">{t(\'continuum_heading\', \'42-Day Postnatal Continuum\')}</span>'
);

html = html.replace(
  '{careDay.daysRemaining} days remaining in immediate continuum.',
  '{careDay.daysRemaining} {t(\'days_remaining\', \'days remaining in immediate continuum.\')}'
);

html = html.replace(
  '<strong>Next Follow-up:</strong>',
  '<strong>{t(\'next_followup\', \'Next Follow-up\')}:</strong>'
);

// Tab strip buttons in MaatruSetuDashboard
const oldTabStrip = `            {[
              { id: 'guidance', label: '1. MaatruAI Guidance', icon: '✨' },
              { id: 'family_care', label: '2. Family Care Mode', icon: '👨‍👩‍👦' },
              { id: 'discharge', label: '3. Discharge Plan', icon: '📋' },
              { id: 'journal', label: '4. Recovery Journal', icon: '📖' },
              { id: 'summary', label: '5. Doctor Summary', icon: '🩺' },
              { id: 'explainer', label: '6. Family Explainer', icon: '💡' },
              { id: 'offline', label: '7. Offline Mode', icon: '📶' },
              { id: 'circle', label: '8. Care Circle', icon: '🛡️' },
              { id: 'report', label: '9. 42-Day Report', icon: '🎓' }
            ].map(tab => (`;

const newTabStrip = `            {[
              { id: 'guidance', label: t('tab_guidance', '1. MaatruAI Guidance'), icon: '✨' },
              { id: 'family_care', label: t('tab_family_care', '2. Family Care Mode'), icon: '👨‍👩‍👦' },
              { id: 'discharge', label: t('tab_discharge', '3. Discharge Plan'), icon: '📋' },
              { id: 'journal', label: t('tab_journal', '4. Recovery Journal'), icon: '📖' },
              { id: 'summary', label: t('tab_summary', '5. Doctor Summary'), icon: '🩺' },
              { id: 'explainer', label: t('tab_explainer', '6. Family Explainer'), icon: '💡' },
              { id: 'offline', label: t('tab_offline', '7. Offline Mode'), icon: '📶' },
              { id: 'circle', label: t('tab_circle', '8. Care Circle'), icon: '🛡️' },
              { id: 'report', label: t('tab_report', '9. 42-Day Report'), icon: '🎓' }
            ].map(tab => (`;

html = html.replace(oldTabStrip, newTabStrip);

// O. MaatruAIGuidanceTab
html = html.replace(
  'function MaatruAIGuidanceTab({ careDay, record }) {',
  'function MaatruAIGuidanceTab({ careDay, record }) {\n      const { t } = useLang();'
);
html = html.replace(
  '<h3 className="text-lg font-black text-slate-900">MaatruAI: Personalized Daily Clinical Guidance</h3>',
  '<h3 className="text-lg font-black text-slate-900">{t(\'ai_title\', \'MaatruAI: Personalized Daily Clinical Guidance\')}</h3>'
);
html = html.replace(
  '<span className="font-bold text-rose-800 uppercase text-[10px]">Recovery Milestone</span>',
  '<span className="font-bold text-rose-800 uppercase text-[10px]">{t(\'ai_milestone\', \'Recovery Milestone\')}</span>'
);
html = html.replace(
  '<span className="font-bold text-teal-800 uppercase text-[10px]">Hydration &amp; Nutrition</span>',
  '<span className="font-bold text-teal-800 uppercase text-[10px]">{t(\'ai_nutrition\', \'Hydration & Nutrition\')}</span>'
);
html = html.replace(
  '<span className="font-bold text-xs text-slate-700 block">Ask MaatruAI Maternal Assistant:</span>',
  '<span className="font-bold text-xs text-slate-700 block">{t(\'ai_ask_title\', \'Ask MaatruAI Maternal Assistant:\')}</span>'
);
html = html.replace(
  'Ask AI\n              </button>',
  '{t(\'ai_button\', \'Ask AI\')}\n              </button>'
);

// P. FamilyCareTab
html = html.replace(
  'function FamilyCareTab({ record }) {',
  'function FamilyCareTab({ record }) {\n      const { t } = useLang();'
);
html = html.replace(
  '<h3 className="text-lg font-black text-slate-900">Family Care Mode: Shared Caregiver Tasks</h3>',
  '<h3 className="text-lg font-black text-slate-900">{t(\'family_title\', \'Family Care Mode: Shared Caregiver Tasks\')}</h3>'
);
html = html.replace(
  '<p className="text-xs text-slate-500">Empower partners, mothers-in-law, and family to take active ownership of maternal recovery.</p>',
  '<p className="text-xs text-slate-500">{t(\'family_desc\', \'Empower partners, mothers-in-law, and family to take active ownership of maternal recovery.\')}</p>'
);
html = html.replace(
  'Add Task\n            </button>',
  '{t(\'family_add\', \'Add Task\')}\n            </button>'
);

// Q. DischargePlanTab
html = html.replace(
  'function DischargePlanTab({ record }) {',
  'function DischargePlanTab({ record }) {\n      const { t } = useLang();'
);
html = html.replace(
  '<h3 className="text-lg font-black text-slate-900">Digital Discharge Plan</h3>',
  '<h3 className="text-lg font-black text-slate-900">{t(\'discharge_title\', \'Digital Discharge Plan\')}</h3>'
);
html = html.replace(
  '✓ Clinician Authenticated',
  '{t(\'discharge_verified\', \'✓ Clinician Authenticated\')}'
);
html = html.replace(
  '1. Maternal Medications &amp; Dosages',
  '{t(\'discharge_q1\', \'1. Maternal Medications & Dosages\')}'
);
html = html.replace(
  '2. Incision / Perineal Wound Care',
  '{t(\'discharge_q2\', \'2. Incision / Perineal Wound Care\')}'
);
html = html.replace(
  '3. Activity &amp; Lifting Restrictions',
  '{t(\'discharge_q3\', \'3. Activity & Lifting Restrictions\')}'
);
html = html.replace(
  '4. Emergency Return Criteria',
  '{t(\'discharge_q4\', \'4. Emergency Return Criteria\')}'
);

// R. RecoveryJournalTab
html = html.replace(
  'function RecoveryJournalTab({ record }) {',
  'function RecoveryJournalTab({ record }) {\n      const { t } = useLang();'
);
html = html.replace(
  '<h3 className="text-lg font-black text-slate-900">Recovery Journal &amp; Symptom Tracker</h3>',
  '<h3 className="text-lg font-black text-slate-900">{t(\'journal_title\', \'Recovery Journal & Symptom Tracker\')}</h3>'
);
html = html.replace(
  '<p className="text-xs text-slate-500">Record daily pain score, lochia bleeding level, and emotional well-being.</p>',
  '<p className="text-xs text-slate-500">{t(\'journal_desc\', \'Record daily pain score, lochia bleeding level, and emotional well-being.\')}</p>'
);
html = html.replace(
  '+ Save Today’s Entry',
  '{t(\'journal_save\', \'+ Save Today’s Entry\')}'
);
html = html.replace(
  '<label className="font-extrabold text-slate-800 block">Lochia Bleeding Level</label>',
  '<label className="font-extrabold text-slate-800 block">{t(\'journal_lochia\', \'Lochia Bleeding Level\')}</label>'
);
html = html.replace(
  '<label className="font-extrabold text-slate-800 block">Emotional Mood State</label>',
  '<label className="font-extrabold text-slate-800 block">{t(\'journal_mood\', \'Emotional Mood State\')}</label>'
);

// S. DoctorSummaryTab
html = html.replace(
  'function DoctorSummaryTab({ record, careDay }) {',
  'function DoctorSummaryTab({ record, careDay }) {\n      const { t } = useLang();'
);
html = html.replace(
  '<h3 className="text-lg font-black text-slate-900">Doctor Recovery Summary</h3>',
  '<h3 className="text-lg font-black text-slate-900">{t(\'summary_title\', \'Doctor Recovery Summary\')}</h3>'
);
html = html.replace(
  '🖨️ Print Clinical Summary',
  '{t(\'summary_print\', \'🖨️ Print Clinical Summary\')}'
);
html = html.replace(
  '<span className="font-bold text-slate-700 uppercase text-[10px]">Vital &amp; Healing Trends</span>',
  '<span className="font-bold text-slate-700 uppercase text-[10px]">{t(\'summary_trends\', \'Vital & Healing Trends\')}</span>'
);
html = html.replace(
  '<span className="font-bold text-slate-700 uppercase text-[10px]">Questions Prepared for Doctor</span>',
  '<span className="font-bold text-slate-700 uppercase text-[10px]">{t(\'summary_questions\', \'Questions Prepared for Doctor\')}</span>'
);

// T. FamilyExplainerTab
html = html.replace(
  'function FamilyExplainerTab() {',
  'function FamilyExplainerTab() {\n      const { t } = useLang();'
);
html = html.replace(
  '<h3 className="text-lg font-black text-slate-900">Family Medical Explainer</h3>',
  '<h3 className="text-lg font-black text-slate-900">{t(\'explainer_title\', \'Family Medical Explainer\')}</h3>'
);
html = html.replace(
  '<p className="text-xs text-slate-500">Demystifying medical terminology into actionable caregiver guidance.</p>',
  '<p className="text-xs text-slate-500">{t(\'explainer_desc\', \'Demystifying medical terminology into actionable caregiver guidance.\')}</p>'
);
html = html.replace(
  'placeholder="Search terms (e.g. lochia, latch)..."',
  'placeholder={t(\'explainer_search\', \'Search terms (e.g. lochia, latch)...\')}'
);
html = html.replace(
  '<strong>✓ What to do:</strong>',
  '<strong>{t(\'explainer_do\', \'✓ What to do:\')}</strong>'
);
html = html.replace(
  '<strong>✕ What NOT to do:</strong>',
  '<strong>{t(\'explainer_dont\', \'✕ What NOT to do:\')}</strong>'
);

// U. OfflineModeTab
html = html.replace(
  'function OfflineModeTab({ record, careDay }) {',
  'function OfflineModeTab({ record, careDay }) {\n      const { t } = useLang();'
);
html = html.replace(
  '<h3 className="text-lg font-black text-slate-900">Offline Mode &amp; Emergency Care Pass</h3>',
  '<h3 className="text-lg font-black text-slate-900">{t(\'offline_title\', \'Offline Mode & Emergency Care Pass\')}</h3>'
);
html = html.replace(
  '<p className="text-xs text-slate-500">Stored locally in your browser so you have zero dependency on network coverage.</p>',
  '<p className="text-xs text-slate-500">{t(\'offline_desc\', \'Stored locally in your browser so you have zero dependency on network coverage.\')}</p>'
);
html = html.replace(
  '● Locally Cached &amp; Ready',
  '{t(\'offline_cached\', \'● Locally Cached & Ready\')}'
);

// V. CareCircleTab
html = html.replace(
  'function CareCircleTab({ record }) {',
  'function CareCircleTab({ record }) {\n      const { t } = useLang();'
);
html = html.replace(
  '<h3 className="text-lg font-black text-slate-900">Care Circle: Consent-Based Caregiver Access</h3>',
  '<h3 className="text-lg font-black text-slate-900">{t(\'circle_title\', \'Care Circle: Consent-Based Caregiver Access\')}</h3>'
);
html = html.replace(
  '<p className="text-xs text-slate-500">Grant and immediately revoke permissions to family members and healthcare workers.</p>',
  '<p className="text-xs text-slate-500">{t(\'circle_desc\', \'Grant and immediately revoke permissions to family members and healthcare workers.\')}</p>'
);
html = html.replace(
  'Grant Access\n            </button>',
  '{t(\'circle_grant\', \'Grant Access\')}\n            </button>'
);
html = html.replace(
  'Revoke Access\n                </button>',
  '{t(\'circle_revoke\', \'Revoke Access\')}\n                </button>'
);

// W. CompletionReportTab
html = html.replace(
  'function CompletionReportTab({ record, careDay }) {',
  'function CompletionReportTab({ record, careDay }) {\n      const { t } = useLang();'
);
html = html.replace(
  '<h3 className="text-lg font-black text-slate-900">42-Day Completion Report &amp; Graduation</h3>',
  '<h3 className="text-lg font-black text-slate-900">{t(\'report_title\', \'42-Day Completion Report & Graduation\')}</h3>'
);
html = html.replace(
  '🎓 Print Graduation Certificate',
  '{t(\'report_print\', \'🎓 Print Graduation Certificate\')}'
);
html = html.replace(
  '<h4 className="text-2xl font-black text-slate-900">Postnatal Care Continuum Certificate</h4>',
  '<h4 className="text-2xl font-black text-slate-900">{t(\'report_cert\', \'Postnatal Care Continuum Certificate\')}</h4>'
);

// Save updated index.html
fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully updated docs/index.html with full multilingual and RTL support!');
