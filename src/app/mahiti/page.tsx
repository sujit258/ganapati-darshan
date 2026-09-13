'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  Share2,
  Check,
  Shield,
  Heart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function MahitiPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleShare = async () => {
    const shareData = {
      title: '🪔 पुणे गणपती दर्शन',
      text: '🪔 पुणे गणपती दर्शन\nपुण्यातील ५ मानाचे आणि प्रमुख गणपतींचे दर्शन घेण्यासाठी सोपा डिजिटल मार्गदर्शक.\nतुमच्या स्थानानुसार दर्शनाचा क्रम आणि दिशा मिळवा:\n',
      url: typeof window !== 'undefined' ? window.location.origin : '',
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (e) {}
    }
  };

  const faqs = [
    {
      q: 'स्थानाची (Location) परवानगी का आवश्यक आहे?',
      a: 'तुम्ही पुण्यात ज्या ठिकाणी उभे आहात, तिथून सर्वात जवळ असणाऱ्या गणपतीपासून दर्शनाची सुरुवात करता यावी आणि चालण्याचे अंतर किमान व्हावे, यासाठी स्थान आवश्यक आहे. आम्ही तुमचा डेटा कुठेही साठवत नाही.',
    },
    {
      q: 'जर मी स्थान परवानगी दिली नाही तर?',
      a: 'अॅप तरीही पूर्णपणे चालते! तुम्ही शनिवार वाडा किंवा पुणे रेल्वे स्टेशन येथून सुरुवात करू शकता किंवा ५ मानाच्या गणपतींचा पारंपरिक क्रम वापरू शकता.',
    },
    {
      q: 'सर्व ९ गणपतींचे दर्शन पूर्ण करण्यासाठी किती वेळ लागतो?',
      a: 'सामान्य दिवसांत चालत साधारण १.५ ते २ तासांत हे दर्शन पूर्ण होते. गणेशोत्सवाच्या मुख्य गर्दीच्या दिवसांत भाविकांच्या रांगेनुसार वेळ बदलू शकतो.',
    },
    {
      q: 'दर्शन पूर्ण झाल्याची नोंद मोबाईल बंद केल्यावर टिकून राहते का?',
      a: 'होय! तुमची प्रगती तुमच्याच मोबाईलच्या ब्राउझरमध्ये (localStorage) सुरक्षित राहते. पेज रिफ्रेश किंवा बंद केले तरी दर्शन क्रम आणि पूर्ण झालेली नोंद कायम राहते.',
    },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-150 pb-8">
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
          <Sparkles size={12} />
          <span>परंपरा व मार्गदर्शक</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 leading-tight">
          ℹ️ माहिती व इतिहास
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          पुण्याचा गणेशोत्सव, मानाचे गणपती व या ॲपविषयी सविस्तर माहिती
        </p>
      </div>

      {/* Pune Ganeshotsav Tradition History */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-soft space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen size={17} className="text-saffron-600" />
          <span>पुण्याच्या गणेशोत्सवाची परंपरा</span>
        </h2>
        <div className="text-xs text-slate-700 leading-relaxed space-y-2.5">
          <p>
            पुण्याला महाराष्ट्राची सांस्कृतिक राजधानी आणि सार्वजनिक गणेशोत्सवाची जन्मभूमी मानले जाते. १८९२ मध्ये श्रीमंत भाऊसाहेब रंगारी यांनी स्वातंत्र्यलढ्यासाठी जनतेला एकत्र आणण्याच्या उद्देशाने देशातील पहिला सार्वजनिक गणेशोत्सव सुरू केला.
          </p>
          <p>
            पुढे १८९३ मध्ये लोकमान्य बाळ गंगाधर टिळकांनी या उपक्रमाला व्यापक स्वरूप दिले आणि घरोघरी साजरा होणारा गणेशोत्सव सामाजिक प्रबोधन व स्वातंत्र्यलढ्याचे महाशक्तीपीठ बनवला.
          </p>
        </div>
      </div>

      {/* 5 Manache Ganpati Meaning */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-soft space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>👑</span>
          <span>५ मानाचे गणपती म्हणजे काय?</span>
        </h2>
        <div className="text-xs text-slate-700 leading-relaxed space-y-2.5">
          <p>
            अनंत चतुर्दशीच्या विसर्जन मिरवणुकीमध्ये शतकांपासून ठरवून दिलेल्या विशिष्ट क्रमाने हे गणपती विसर्जनासाठी मार्गस्थ होतात. हा क्रम परंपरेने आदरपूर्वक पाळला जातो:
          </p>
          <ol className="space-y-1.5 pl-2 font-medium text-slate-800">
            <li><strong>१. श्री कसबा गणपती</strong> — पुण्याचे ग्रामदैवत</li>
            <li><strong>२. श्री तांबडी जोगेश्वरी गणपती</strong> — पुण्याची कुलस्वामिनी</li>
            <li><strong>३. श्री गुरुजी तालीम गणपती</strong> — हिंदू-मुस्लिम ऐक्य प्रतीक</li>
            <li><strong>४. श्री तुळशीबाग गणपती</strong> — देखणी व भव्य मूर्ती</li>
            <li><strong>५. श्री केसरीवाडा गणपती</strong> — लोकमान्य टिळकांचा विचार वारसा</li>
          </ol>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-soft space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle size={17} className="text-saffron-600" />
          <span>नेहमी विचारले जाणारे प्रश्न (FAQ)</span>
        </h2>

        <div className="space-y-2 pt-1">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-3 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <span className="pr-2">{faq.q}</span>
                  {isOpen ? <ChevronUp size={15} className="text-slate-400 shrink-0" /> : <ChevronDown size={15} className="text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 pt-1 text-xs text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy & Trust Badge */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900">
        <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">गोपनीयता आणि सुरक्षितता</p>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            हे ॲप कोणतेही लॉगिन, पासवर्ड किंवा वैयक्तिक माहिती मागत नाही. तुमचे स्थान केवळ तुमच्याच फोनमध्ये अंतर मोजण्यासाठी तात्पुरते वापरले जाते.
          </p>
        </div>
      </div>

      {/* Share with Friends */}
      <div className="bg-gradient-to-r from-saffron-500 to-amber-600 text-white rounded-2xl p-5 text-center space-y-3 shadow-md">
        <h3 className="text-base font-bold">
          आपल्या मित्र-परिवाराला पाठवा
        </h3>
        <p className="text-xs text-saffron-100 max-w-xs mx-auto">
          पुण्यात येणाऱ्या प्रत्येक भाविकाला सोपे गणपती दर्शन घेता यावे यासाठी ही उपयुक्त माहिती शेअर करा.
        </p>
        <button
          type="button"
          onClick={handleShare}
          className="py-2.5 px-5 bg-white text-saffron-800 hover:bg-saffron-50 active:scale-95 font-bold rounded-xl text-xs inline-flex items-center gap-2 shadow-sm transition-all"
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>लिंक कॉपी झाली!</span>
            </>
          ) : (
            <>
              <Share2 size={14} />
              <span>↗️ मित्रांना पाठवा</span>
            </>
          )}
        </button>
      </div>

      {/* Credits */}
      <div className="text-center pt-2 pb-2 text-[11px] text-slate-400 space-y-1">
        <p className="flex items-center justify-center gap-1">
          <span>पुण्यातील भाविकांच्या सेवेसाठी श्रद्धेने समर्पित</span>
          <Heart size={12} className="text-red-400 fill-red-400" />
        </p>
        <p>© २०२६ पुणे गणपती दर्शन • सर्व हक्क राखीव</p>
      </div>
    </div>
  );
}
