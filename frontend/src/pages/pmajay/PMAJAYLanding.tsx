import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PMAJAYNavbar } from "@/components/pmajay/PMAJAYNavbar";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Mic,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  Briefcase,
  Users,
  GraduationCap,
  MapPin,
  Clock,
  IndianRupee,
  ChevronRight,
  Award,
  Phone,
  Landmark,
  FileText,
  Building2,
  ExternalLink,
  SlidersHorizontal,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { EmblemOfIndia } from "@/components/pmajay/EmblemOfIndia";
import { IVRSimulatorModal } from "@/components/pmajay/IVRSimulatorModal";
import { LivelihoodPassportModal } from "@/components/pmajay/LivelihoodPassportModal";

export const PMAJAYLanding: React.FC = () => {
  const { lang, t, playVoice } = useLanguage();
  const [ivrModalOpen, setIvrModalOpen] = useState<boolean>(false);
  const [passportModalOpen, setPassportModalOpen] = useState<boolean>(false);

  // Auto welcome audio on first visit if not yet heard
  useEffect(() => {
    const key = `pmajay_welcome_played_${lang}`;
    if (!sessionStorage.getItem(key)) {
      const timer = setTimeout(() => {
        playVoice(t("welcome_speech"));
        sessionStorage.setItem(key, "1");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lang]);

  const steps = [
    {
      num: "01",
      icon: <Mic className="w-5 h-5 text-[#002147]" />,
      title: "मौखिक संवाद (Voice Assessment)",
      desc: "माइक दबाकर अपनी बोली (हिन्दी, भोजपुरी, मराठी) में अपनी शिक्षा, वर्तमान कार्य और रुचियों की जानकारी दें। कोई फॉर्म भरने की आवश्यकता नहीं।",
      badge: "Zero Digital Barrier",
    },
    {
      num: "02",
      icon: <FileText className="w-5 h-5 text-[#002147]" />,
      title: "प्रमाणित प्रोफाइल मैपिंग (Transparent Profile)",
      desc: "सिस्टम आपके पुराने अनौपचारिक हुनर, कार्य अनुभव और यात्रा की दूरी (मोबिलिटी बाधा) का पारदर्शी स्कोर तैयार करता है।",
      badge: "Field Confidence Tracked",
    },
    {
      num: "03",
      icon: <GraduationCap className="w-5 h-5 text-[#002147]" />,
      title: "कठिन बाधा व कौशल मिलान (Deterministic Match)",
      desc: "6 गणितीय पैमानों से आपके लिए सबसे उपयुक्त NSQF कोर्स चुना जाता है। अनुपयुक्त विकल्पों को स्पष्ट कारण सहित निरस्त किया जाता है।",
      badge: "No Hallucination Gate",
    },
    {
      num: "04",
      icon: <Award className="w-5 h-5 text-[#002147]" />,
      title: "कौशल केंद्र व ₹50,000 टूलकिट अनुदान",
      desc: "नजदीकी मान्यता प्राप्त कौशल केंद्र से जुड़ें और स्वरोजगार के लिए ₹50,000 की 100% मुफ्त सरकारी टूलकिट सब्सिडी संस्वीकृति पत्रक पाएं।",
      badge: "GIA Grant Sanctioned",
    },
  ];

  const popularTrades = [
    {
      qpCode: "ELE/Q1401",
      title: "Solar PV Installer (Suryamitra)",
      sector: "Green Jobs / Power",
      nsqf: "NSQF L4",
      hours: "300 hrs",
      wage: "₹15,000 – ₹22,000 / माह",
      desc: "छत पर सोलर पैनल फिटिंग, इन्वर्टर टेस्टिंग व कृषि सोलर पंप रखरखाव।",
      rpl: true,
      color: "#b45309",
    },
    {
      qpCode: "AMH/Q1947",
      title: "Self Employed Tailor & Boutique",
      sector: "Apparel & Textiles",
      nsqf: "NSQF L4",
      hours: "340 hrs",
      wage: "₹12,000 – ₹25,000 / माह",
      desc: "वस्त्र सिलाई, कटिंग डिजाइनिंग व गांव में ही स्वतंत्र बुटीक स्वरोजगार।",
      rpl: true,
      color: "#15803d",
    },
    {
      qpCode: "ELE/Q3102",
      title: "Field Technician Home Appliances",
      sector: "Electronics",
      nsqf: "NSQF L4",
      hours: "360 hrs",
      wage: "₹14,000 – ₹20,000 / माह",
      desc: "घरेलू पंखा, कूलर, मोटर व मिक्सर ग्राइंडर रिपेयर व इलेक्ट्रॉनिक सर्विसिंग।",
      rpl: true,
      color: "#002147",
    },
    {
      qpCode: "PLU/Q0101",
      title: "Plumber (Jal Jeevan Mission Maintenance)",
      sector: "Plumbing",
      nsqf: "NSQF L3",
      hours: "240 hrs",
      wage: "₹12,000 – ₹18,000 / माह",
      desc: "हर घर जल योजना अंतर्गत पाइपलाइन फिटिंग, नल लीकेज रिपेयर व जल पंप ऑपरेटर।",
      rpl: true,
      color: "#0369a1",
    },
    {
      qpCode: "CON/Q0102",
      title: "General Mason & Tiler (ग्रामीण राजमिस्त्री)",
      sector: "Construction",
      nsqf: "NSQF L4",
      hours: "320 hrs",
      wage: "₹16,000 – ₹26,000 / माह",
      desc: "ग्रामीण आवास योजनाओं में ईंट चिनाई, प्लास्टर व आधुनिक फ्लोर टाइल फिटिंग।",
      rpl: true,
      color: "#78350f",
    },
    {
      qpCode: "FIC/Q0103",
      title: "Food Processing & Masala Packing",
      sector: "Food Processing",
      nsqf: "NSQF L3",
      hours: "240 hrs",
      wage: "₹11,000 – ₹18,000 / माह",
      desc: "मसाला पिसाई, आचार निर्माण, स्वच्छ पैकेजिंग व महिला SHG क्लस्टर उत्पाद।",
      rpl: true,
      color: "#991b1b",
    },
    {
      qpCode: "ASC/Q9702",
      title: "Two-Wheeler & EV Service Technician",
      sector: "Automotive",
      nsqf: "NSQF L4",
      hours: "400 hrs",
      wage: "₹14,000 – ₹24,000 / माह",
      desc: "मोटरसाइकिल, स्कूटर व ई-रिक्शा बैटरी/मोटर सर्विसिंग और गांव में गैरेज।",
      rpl: true,
      color: "#4338ca",
    },
    {
      qpCode: "SSC/Q2212",
      title: "Domestic Data Entry & CSC Assistant",
      sector: "IT-ITeS",
      nsqf: "NSQF L4",
      hours: "400 hrs",
      wage: "₹12,000 – ₹18,000 / माह",
      desc: "कंप्यूटर टाइपिंग, जन सेवा केंद्र (CSC) डिजिटल सेवाएं व नागरिक ऑनलाइन आवेदन।",
      rpl: false,
      color: "#0f766e",
    },
  ];

  const govStats = [
    {
      value: "18+",
      label: "NCVET अनुमोदित कौशल ट्रेड",
      sub: "National Qualifications Register (NQR)",
      icon: <GraduationCap className="w-5 h-5 text-amber-400" />,
    },
    {
      value: "₹50,000",
      label: "टूलकिट पूंजी अनुदान (प्रति लाभार्थी)",
      sub: "100% निःशुल्क केंद्रीय योजना सहायता",
      icon: <IndianRupee className="w-5 h-5 text-amber-400" />,
    },
    {
      value: "4 भाषाएं",
      label: "क्षेत्रीय बोली व भाषा समर्थन",
      sub: "हिन्दी, भोजपुरी, मराठी व English",
      icon: <Volume2 className="w-5 h-5 text-amber-400" />,
    },
    {
      value: "100%",
      label: "पारदर्शी व व्याख्यात्मक मिलान",
      sub: "गणितीय 6-कारक स्कोर • कोई मनमाना निर्णय नहीं",
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PMAJAYNavbar />

      <main id="main-content" className="flex-1 w-full flex flex-col">
        {/* ════ HERO SECTION: Authentic Indian Government Identity ════ */}
        <section
          id="hero-section"
          className="bg-gradient-to-b from-[#002147] via-[#002b5c] to-[#001733] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[#b45309] relative overflow-hidden"
        >
          {/* Subtle National Emblem background watermark */}
          <div className="absolute right-6 top-8 opacity-5 pointer-events-none hidden lg:block">
            <EmblemOfIndia size={420} variant="white" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Ministry & Scheme Verification Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-xs text-amber-300 backdrop-blur-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-pulse" />
                <span>भारत सरकार • सामाजिक न्याय एवं अधिकारिता मंत्रालय (MoSJE)</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/50 px-3 py-1 rounded-full text-[11px] text-emerald-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>PM-AJAY GIA घटक • कौशल विकास एवं आजीविका मैपिंग</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Headline, Scheme Objectives & Primary CTAs */}
              <div className="lg:col-span-7 space-y-5">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white font-serif">
                  अपनी बोली में बताएं अपना हुनर,
                  <br />
                  <span className="text-amber-400 font-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl block mt-1">
                    पाएं मुफ्त सरकारी NSQF कौशल व ₹50,000 टूलकिट अनुदान
                  </span>
                </h1>

                <p className="text-slate-200 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl font-sans">
                  अनुसूचित जाति (SC) के ग्रामीण युवाओं, महिलाओं और पारंपरिक कारीगरों के लिए विशेष आवाज-आधारित सेवा। कोई जटिल कागजी फॉर्म भरने की आवश्यकता नहीं — बस माइक दबाकर बोलें और अपनी शिक्षा, कार्य अनुभव और यात्रा की सुविधा के अनुसार 100% निःशुल्क सरकारी NSQF प्रशिक्षण, नजदीकी कौशल केंद्र और ₹50,000 की टूलकिट सब्सिडी संस्वीकृति पत्रक प्राप्त करें।
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/pmajay/interview"
                    className="inline-flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    <Mic className="w-4 h-4 text-emerald-200 animate-pulse" />
                    <span>अभी माइक दबाकर बोलें (Start Voice)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIvrModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-[#001733] hover:bg-blue-900 border border-amber-400/50 text-amber-300 px-5 py-3.5 rounded-xl font-bold text-sm transition-all shadow-xs"
                    title="फीचर फोन IVR सिम्युलेटर डायल करें"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>फीचर फोन IVR डायल (1800-11-2026)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPassportModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white px-4 py-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>आजीविका पासपोर्ट कार्ड</span>
                  </button>
                </div>

                {/* Official Scheme Guarantees Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/15 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>100% निःशुल्क सरकारी योजना</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>₹50,000 टूलकिट पूंजी सहायता</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>NCVET अधिकृत सरकारी प्रमाणपत्र</span>
                  </div>
                </div>
              </div>

              {/* Right Column: 4 Multi-Channel Access Cards (Competitor Benchmark Upgrade) */}
              <div className="lg:col-span-5 bg-white/95 text-slate-900 rounded-2xl p-5 sm:p-6 shadow-2xl border-2 border-amber-500/80 backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#002147]" />
                    <h2 className="font-extrabold text-sm text-[#002147] uppercase tracking-wide">
                      ४ बहु-माध्यम नागरिक सेवाएं (Access Channels)
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                    GIA Standard
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Channel 1: Voice Assistant */}
                  <Link
                    to="/pmajay/interview"
                    className="p-3 rounded-xl border border-slate-200 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/50 flex items-start gap-3 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800">
                          १. वॉयस संवाद (Voice Assistant)
                        </h3>
                        <span className="text-[10px] font-bold text-emerald-700">सक्रिय</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        स्मार्टफोन या कंप्यूटर ब्राउज़र में हिन्दी, भोजपुरी या मराठी में ६ आसान प्रश्नों का उत्तर बोलकर दें।
                      </p>
                    </div>
                  </Link>

                  {/* Channel 2: Feature Phone IVR */}
                  <div
                    onClick={() => setIvrModalOpen(true)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-amber-600 bg-slate-50 hover:bg-amber-50/50 flex items-start gap-3 transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#002147] text-amber-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-amber-900">
                          २. फीचर फोन IVR (1800-11-2026)
                        </h3>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                          DTMF कीपैड
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        बिना इंटरनेट या स्मार्टफोन के सामान्य कीपैड मोबाइल से १, २, ३ दबाकर सरकारी कोर्स व अनुदान चुनें।
                      </p>
                    </div>
                  </div>

                  {/* Channel 3: RPL Fast Track Assessment */}
                  <Link
                    to="/pmajay/recommendations"
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-600 bg-slate-50 hover:bg-blue-50/50 flex items-start gap-3 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#b45309] text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-900">
                          ३. RPL पूर्व अनुभव प्रमाणन (40 घंटे)
                        </h3>
                        <span className="text-[10px] font-bold text-blue-700">फास्ट-ट्रैक</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        अनुभवी सिलाई कारीगर, बिजली मिस्त्री व राजमिस्त्री लंबी ट्रेनिंग के बिना सीधे परीक्षा देकर प्रमाण पत्र लें।
                      </p>
                    </div>
                  </Link>

                  {/* Channel 4: Livelihood Passport */}
                  <div
                    onClick={() => setPassportModalOpen(true)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-purple-600 bg-slate-50 hover:bg-purple-50/50 flex items-start gap-3 transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-purple-900">
                          ४. आजीविका पासपोर्ट व अनुदान कार्ड
                        </h3>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded">
                          QR सत्यापित
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        QR कोड और संस्वीकृति क्रमांक सहित आधिकारिक कार्ड डाउनलोड कर नजदीकी समाज कल्याण कार्यालय में प्रस्तुत करें।
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">टोल-फ्री हेल्पलाइन: 1800-11-2026</span>
                  <Link
                    to="/pmajay/interview"
                    className="font-bold text-[#002147] hover:text-[#b45309] flex items-center gap-1"
                  >
                    <span>संवाद शुरू करें</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════ GOVERNMENT STATISTICS RIBBON ════ */}
        <section className="bg-[#002147] text-white py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-700">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {govStats.map((st, i) => (
                <div key={i} className="flex items-start gap-3 border-l-2 border-amber-500/60 pl-3">
                  <div className="p-2 rounded-lg bg-white/10 shrink-0">{st.icon}</div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                      {st.value}
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5">{st.label}</div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{st.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ 4 STEPS PROCESS: Authentic NIC Portal Layout ════ */}
        <section id="steps-section" className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-extrabold text-[#b45309] uppercase tracking-wider bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                पारदर्शी एवं सुरक्षित प्रक्रिया
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002147] mt-2">
                आसान ४ चरणों में योजना सहायता प्राप्त करें
              </h2>
              <div className="mt-2.5 w-20 h-1 bg-[#002147] rounded mx-auto" />
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mt-2 leading-relaxed">
                यह प्रणाली बिना किसी बिचौलिए के सीधे लाभार्थी की आवश्यकता को समझकर नजदीकी सरकारी केंद्र और अनुदान से जोड़ती है।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((st, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border-2 border-slate-200 hover:border-[#002147] rounded-xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-white group-hover:bg-[#002147] border border-slate-300 flex items-center justify-center transition-colors shadow-xs">
                        <div className="group-hover:[&_svg]:text-amber-300 transition-colors">
                          {st.icon}
                        </div>
                      </div>
                      <span className="text-3xl font-black text-slate-300 group-hover:text-amber-600 font-mono transition-colors">
                        {st.num}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 inline-block mb-2">
                      {st.badge}
                    </span>

                    <h3 className="font-bold text-sm text-[#002147] mb-2 leading-snug">
                      {st.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-bold text-[#002147] flex items-center justify-between">
                    <span>चरण {idx + 1} विवरण</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ CURATED 18 NSQF TRADES SHOWCASE ════ */}
        <section id="trades-section" className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                  NCVET & National Qualifications Register
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002147] mt-1.5">
                  PM-AJAY GIA अनुमोदित प्रमुख कौशल पाठ्यक्रम
                </h2>
                <div className="mt-2 w-20 h-1 bg-emerald-700 rounded" />
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/pmajay/recommendations"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#002147] text-white text-xs font-bold shadow-xs hover:bg-blue-900 transition-colors"
                >
                  <span>सभी १८ ट्रेड देखें (View All Trades)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {popularTrades.map((trade, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-300 hover:border-slate-400 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Color accent top strip */}
                  <div className="h-1.5 w-full" style={{ backgroundColor: trade.color }} />

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-center text-[10px] font-bold mb-2.5">
                      <span className="font-mono bg-slate-100 text-slate-800 border border-slate-200 px-1.5 py-0.5 rounded">
                        {trade.qpCode}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-white font-mono"
                        style={{ backgroundColor: trade.color }}
                      >
                        {trade.nsqf}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                      {trade.title}
                    </h3>

                    <div className="text-[11px] font-medium text-slate-500 mb-2">
                      Sector: {trade.sector}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed flex-1 mb-3">
                      {trade.desc}
                    </p>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>{trade.hours}</span>
                      </div>
                      <div className="font-bold text-emerald-700 text-xs">{trade.wage}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-medium">टूलकिट अनुदान:</span>
                    <span className="font-bold text-amber-800">₹50,000/- पात्र</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ DISTRICT PILOT HIGHLIGHT (Varanasi & Chandauli Cluster) ════ */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-amber-50 via-white to-blue-50 border-2 border-amber-300 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded text-xs font-bold">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>पायलट जिला क्लस्टर: वाराणसी एवं चंदौली (उत्तर प्रदेश)</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-[#002147]">
                    सेवापुरी मॉडल ब्लॉक एवं नजदीकी कौशल केंद्रों से सीधा संपर्क
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    प्रशिक्षण उपरांत स्थानीय मांग के आधार पर पीएम सूर्य घर योजना, जल जीवन मिशन ग्राम जल समिति, प्रेरणा महिला स्वयं सहायता समूह एवं स्थानीय बाजार की वास्तविक रिक्तियों से जोड़ा जाता है।
                  </p>

                  <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-800">
                    <div>
                      <strong>मान्यता प्राप्त केंद्र:</strong> PMKK ITI करौंदी, बड़ौदा RSETI चिरईगांव, सेवापुरी ब्लॉक केंद्र
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-2.5">
                  <Link
                    to="/pmajay/opportunities"
                    className="w-full text-center py-3 px-4 rounded-xl bg-[#002147] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
                  >
                    स्थानीय रोजगार व क्लस्टर अवसर देखें
                  </Link>
                  <Link
                    to="/pmajay/admin"
                    className="w-full text-center py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs transition-all"
                  >
                    प्रशासनिक निगरानी डैशबोर्ड खोलें
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════ CTA SECTION ════ */}
        <section id="cta-section" className="bg-[#002147] py-14 px-4 sm:px-6 lg:px-8 text-white text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <span>निःशुल्क एवं सरल सेवा</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white font-serif">
              आज ही अपना वॉयस साक्षात्कार शुरू करें
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
              माइक बटन दबाएं और अपनी मातृभाषा में बात करें। हमारा AI सहायक आपके लिए सबसे सही कोर्स, नजदीकी केंद्र और ₹50,000 की टूलकिट सहायता संस्वीकृत करेगा।
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                to="/pmajay/interview"
                className="inline-flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-8 py-4 rounded-xl font-black text-sm sm:text-base shadow-lg transition-all"
              >
                <Mic className="w-5 h-5 text-emerald-200" />
                <span>माइक दबाकर शुरू करें (Start Assessment)</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ════ AUTHENTIC NIC GOVERNMENT PORTAL FOOTER ════ */}
      <footer className="bg-[#0b1726] text-slate-300 text-xs pt-12 pb-6 px-4 sm:px-6 lg:px-8 border-t-2 border-slate-800 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            {/* Column 1: Ministry Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <EmblemOfIndia size={36} variant="gold" />
                <div>
                  <div className="font-bold text-white text-sm">विकल्प AI (Vikalp AI)</div>
                  <div className="text-[10px] text-amber-300 font-semibold">
                    PM-AJAY GIA Livelihood Mapping Portal
                  </div>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                सामाजिक न्याय और अधिकारिता मंत्रालय, भारत सरकार के तत्वावधान में अनुसूचित जाति (SC) कल्याण हेतु विकसित राष्ट्रीय वॉयस सहायक पोर्टल।
              </p>
              <div className="text-[11px] text-slate-400 font-mono">
                SIH 2026 • Problem Statement ID: 26097
              </div>
            </div>

            {/* Column 2: Ministry Office Address */}
            <div className="space-y-2">
              <div className="font-bold text-white text-xs uppercase tracking-wider text-amber-300">
                मंत्रालय संपर्क (Ministry Contact)
              </div>
              <div className="text-[11px] text-slate-300 leading-relaxed">
                सामाजिक न्याय एवं अधिकारिता विभाग,
                <br />
                शास्त्री भवन, डॉ. राजेंद्र प्रसाद रोड,
                <br />
                नई दिल्ली - 110001 (भारत)
              </div>
              <div className="text-[11px] text-amber-300 font-semibold pt-1">
                राष्ट्रीय टोल-फ्री हेल्पलाइन: 1800-11-2026 (24x7)
              </div>
            </div>

            {/* Column 3: Important Official Portals */}
            <div className="space-y-2">
              <div className="font-bold text-white text-xs uppercase tracking-wider text-amber-300">
                महत्वपूर्ण सरकारी पोर्टल (Gov Portals)
              </div>
              <ul className="space-y-1 text-[11px] text-slate-400">
                <li>
                  <a
                    href="https://pmajay.dosje.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>PM-AJAY आधिकारिक पोर्टल</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://nqr.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>राष्ट्रीय योग्यता रजिस्टर (NQR)</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://india.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>National Portal of India (india.gov.in)</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://pgportal.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>CPGRAMS जन शिकायत निवारण पोर्टल</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Compliance & Auditing */}
            <div className="space-y-2">
              <div className="font-bold text-white text-xs uppercase tracking-wider text-amber-300">
                प्रमाणीकरण एवं मानक (Standards)
              </div>
              <div className="text-[11px] text-slate-400 space-y-1">
                <div>• Guidelines for Indian Government Websites (GIGW 3.0)</div>
                <div>• STQC Certified Security Architecture</div>
                <div>• W3C Web Content Accessibility (WCAG 2.1 AA)</div>
              </div>
              <div className="pt-2">
                <span className="text-[10px] text-slate-500 block">कुल पंजीकृत लाभार्थी (Visitor Counter):</span>
                <span className="text-sm font-bold text-amber-400 font-mono">1,48,924</span>
              </div>
            </div>
          </div>

          {/* Bottom Compliance & Copyright Strip */}
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 सामाजिक न्याय और अधिकारिता मंत्रालय, भारत सरकार। सर्वाधिकार सुरक्षित।
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>वेबसाइट नीतियां (Website Policies)</span>
              <span>•</span>
              <span>RTI (सूचना का अधिकार)</span>
              <span>•</span>
              <span>अंतिम अद्यतन: 06 अक्टूबर 2026</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── MODALS (IVR SIMULATOR & PASSPORT) ── */}
      <IVRSimulatorModal isOpen={ivrModalOpen} onClose={() => setIvrModalOpen(false)} />
      <LivelihoodPassportModal isOpen={passportModalOpen} onClose={() => setPassportModalOpen(false)} />
    </div>
  );
};
