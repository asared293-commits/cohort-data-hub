import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, ExternalLink, ArrowRight, Sparkles, Check, Smartphone } from 'lucide-react';
import { LINKS } from '../data/constants';

export const QRCodeSection: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<'telegram' | 'whatsapp'>('telegram');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentUrl = activeChannel === 'telegram' ? LINKS.TELEGRAM : LINKS.WHATSAPP;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        currentUrl,
        {
          width: 250,
          margin: 1.5,
          color: {
            dark: '#030712', // deep crisp dark
            light: '#ffffff', // pure white for camera contrast
          },
          errorCorrectionLevel: 'H',
        },
        (error) => {
          if (error) console.error('QR code render error:', error);
        }
      );
    }
  }, [currentUrl]);

  return (
    <section id="qr-code" className="py-20 md:py-28 bg-[#0b1015] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-slate-900/90 to-[#0e1722] border border-emerald-500/30 rounded-3xl p-7 sm:p-12 shadow-2xl shadow-emerald-950/30 text-center relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Heading */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <QrCode className="w-3.5 h-3.5" />
            <span>INSTANT PHONE CAMERA SCAN</span>
          </div>

          <h2
            id="qr-heading"
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-3"
          >
            📲 SCAN. JOIN. STAY CONNECTED.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8">
            Scan the QR code to connect with Cohort Tech.
          </p>

          {/* Channel Selector for QR Code */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveChannel('telegram')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeChannel === 'telegram'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Telegram Community QR
            </button>
            <button
              onClick={() => setActiveChannel('whatsapp')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeChannel === 'whatsapp'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              WhatsApp Channel QR
            </button>
          </div>

          {/* QR Code Container */}
          <div className="inline-block p-5 bg-white rounded-3xl shadow-2xl shadow-black/80 mb-6 border-4 border-emerald-500/40 relative group">
            <canvas ref={canvasRef} className="rounded-xl w-[220px] h-[220px] sm:w-[250px] sm:h-[250px]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-xl bg-[#0b1015] border-2 border-emerald-400 flex items-center justify-center shadow-lg">
                <span className="font-display font-black text-xs text-emerald-400">CT</span>
              </div>
            </div>
          </div>

          {/* Instructional helper */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-8 font-medium">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Open your smartphone camera & point at the screen to join {activeChannel === 'telegram' ? 'Telegram' : 'WhatsApp'}</span>
          </div>

          {/* "Prefer clicking?" Option */}
          <div className="pt-6 border-t border-slate-800 max-w-md mx-auto">
            <p className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider font-mono">
              Prefer clicking?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={LINKS.TELEGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-sky-300 border border-slate-700 hover:border-sky-500/40 text-sm font-bold transition-all"
              >
                <span>Telegram Community →</span>
              </a>

              <a
                href={LINKS.WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-sm font-bold transition-all"
              >
                <span>WhatsApp Channel →</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
