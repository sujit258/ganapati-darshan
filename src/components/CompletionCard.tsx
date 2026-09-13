'use client';

import React, { useState } from 'react';
import { RotateCcw, Share2, Check, Sparkles } from 'lucide-react';
import { useDarshan } from '@/context/DarshanContext';

export const CompletionCard: React.FC = () => {
  const { resetProgress } = useDarshan();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: '🪔 पुणे गणपती दर्शन',
      text: '🪔 पुणे गणपती दर्शन\nपुण्यातील ५ मानाचे आणि ४ प्रमुख गणपतींचे दर्शन मी पूर्ण केले!\nतुमच्या स्थानानुसार सुचवलेला दर्शन क्रम मिळवा:\n',
      url: typeof window !== 'undefined' ? window.location.origin : '',
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // user cancelled or share failed
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (e) {}
    }
  };

  return (
    <div className="bg-gradient-to-b from-amber-50 to-orange-50/70 border-2 border-amber-300 rounded-3xl p-6 text-center space-y-4 shadow-card animate-in zoom-in-95 duration-200">
      <div className="w-16 h-16 mx-auto rounded-full bg-saffron-500 text-white flex items-center justify-center text-3xl shadow-md animate-bounce">
        🪔
      </div>

      <div className="space-y-1.5">
        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-200/80 text-amber-900">
          <Sparkles size={13} />
          <span>दर्शन संपन्न</span>
        </span>
        <h2 className="text-2xl font-bold text-slate-900">
          🙏 गणपती बाप्पा मोरया!
        </h2>
        <p className="text-base font-semibold text-saffron-800">
          तुमचे ९ गणपतींचे दर्शन पूर्ण झाले.
        </p>
        <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed pt-1">
          पुण्याच्या गणेशोत्सवाच्या या सुंदर, ऐतिहासिक परंपरेला मनापासून नमस्कार. बाप्पा आपल्या सर्व मनोकामना पूर्ण करोत!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 space-y-2.5">
        <button
          type="button"
          onClick={handleShare}
          className="w-full py-3 px-4 bg-saffron-600 hover:bg-saffron-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
        >
          {copied ? (
            <>
              <Check size={16} />
              <span>लिंक कॉपी झाली!</span>
            </>
          ) : (
            <>
              <Share2 size={16} />
              <span>↗️ मित्रांना पाठवा (शेअर करा)</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={resetProgress}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-bold rounded-xl border border-slate-300 flex items-center justify-center gap-2 text-xs transition-colors"
        >
          <RotateCcw size={14} />
          <span>🪔 पुन्हा दर्शन सुरू करा</span>
        </button>
      </div>
    </div>
  );
};
