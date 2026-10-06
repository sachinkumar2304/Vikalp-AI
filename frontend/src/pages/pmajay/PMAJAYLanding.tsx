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

  const pathways = [
    {
      id: "self",
      icon: <Award className="w-6 h-6 text-amber-700" />,
      tag: "सरकारी योजना सहयोग",
      tagBg: "bg-amber-100 text-amber-900 border-amber-300",
      title: "स्वरोजगार एवं टूलकिट सहायता",
      subtitle: "Self-Employment & Enterprise Support",
      desc: "सिलाई, बढ़ईगीरी, सोलर रिपेयर, मोटर वाइंडिंग या इलेक्ट्रिकल कार्य में अपनी दुकान या स्वतंत्र सेवा शुरू करने हेतु टूलकिट उपकरण सहयोग।",
      highlight: "टूलकिट उपकरण सहयोग",
      link: "/pmajay/recommendations?pathway=self",
    },
    {
      id: "wage",
      icon: <Briefcase className="w-6 h-6 text-blue-700" />,
      tag: "नियमित आजीविका",
      tagBg: "bg-blue-100 text-blue-900 border-blue-300",
      title: "स्थानीय वेतन रोजगार (स्थिर रोजगार)",
      subtitle: "Wage Employment in Local Clusters",
      desc: "नजदीकी औद्योगिक क्षेत्र, एमएसएमई वर्कशॉप, पीएम सूर्य घर योजना व जल जीवन मिशन प्रोजेक्ट्स में नियमित कार्य आधारित रोजगार।",
      highlight: "स्थानीय औद्योगिक क्लस्टर लिंकेज",
      link: "/pmajay/recommendations?pathway=wage",
    },
    {
      id: "shg",
      icon: <Users className="w-6 h-6 text-emerald-700" />,
      tag: "महिला सशक्तिकरण",
      tagBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
      title: "महिला स्वयं सहायता समूह क्लस्टर",
      subtitle: "Women SHG Micro-Enterprise",
      desc: "प्रेरणा एवं आजीविका मिशन समूहों के साथ गांव के भीतर ही परिधान निर्माण, मसाला प्रसंस्करण, अगरबत्ती व हस्तशिल्प में सामूहिक आमदनी।",
      highlight: "गांव के भीतर कार्य • शून्य यात्रा बाधा",
      link: "/pmajay/recommendations?pathway=shg",
    },
  ];

  const popularTrades = [
    {
      qpCode: "ELE/Q1401",
      title: "Solar PV Installer (Suryamitra)",
      hindiTitle: "सोलर पीवी इंस्टॉलर (सूर्यमित्र)",
      sector: "Green Energy / Power",
      nsqf: "NSQF Level 4",
      duration: "40 घंटे RPL / 300 घंटे क्लास",
      wage: "मानक जिला आजीविका दर",
      desc: "रूफटॉप सोलर पैनल फिटिंग, इन्वर्टर टेस्टिंग व कृषि सोलर पंप रखरखाव।",
      rpl: true,
      accent: "border-l-4 border-amber-500",
    },
    {
      qpCode: "AMH/Q1947",
      title: "Self Employed Tailor & Boutique",
      hindiTitle: "सिलाई, कटिंग एवं बुटीक स्वरोजगार",
      sector: "Apparel & Textiles",
      nsqf: "NSQF Level 4",
      duration: "40 घंटे RPL मूल्यांकन",
      wage: "स्थानीय बाजार आजीविका दर",
      desc: "वस्त्र सिलाई, ब्लाउज व सूट डिजाइनिंग व गांव में ही स्वतंत्र बुटीक स्वरोजगार।",
      rpl: true,
      accent: "border-l-4 border-emerald-600",
    },
    {
      qpCode: "ELE/Q3102",
      title: "Field Technician Home Appliances",
      hindiTitle: "घरेलू उपकरण एवं मोटर मरम्मत तकनीशियन",
      sector: "Electronics",
      nsqf: "NSQF Level 4",
      duration: "360 घंटे (प्रैक्टिकल)",
      wage: "मानक जिला आजीविका दर",
      desc: "घरेलू पंखा, कूलर, मोटर व मिक्सर ग्राइंडर रिपेयर व इलेक्ट्रॉनिक सर्विसिंग।",
      rpl: true,
      accent: "border-l-4 border-blue-600",
    },
    {
      qpCode: "PLU/Q0101",
      title: "Plumber (Jal Jeevan Mission)",
      hindiTitle: "नल-जल योजना प्लंबर एवं पंप तकनीशियन",
      sector: "Plumbing",
      nsqf: "NSQF Level 3",
      duration: "240 घंटे",
      wage: "मानक जिला आजीविका दर",
      desc: "ग्रामीण पेयजल पाइपलाइन फिटिंग, नल लीकेज मरम्मत व ग्राम जल समिति पंप ऑपरेटर।",
      rpl: true,
      accent: "border-l-4 border-sky-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <PMAJAYNavbar />

      <main id="main-content" className="flex-1 w-full flex flex-col">
        {/* ════ HERO SECTION: Warm, Humane, Reassuring ════ */}
        <section className="bg-gradient-to-b from-[#002147] via-[#002754] to-[#001733] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 relative overflow-hidden">
          {/* Subtle National Emblem background watermark */}
          <div className="absolute right-4 top-10 opacity-5 pointer-events-none hidden lg:block">
            <EmblemOfIndia size={440} variant="white" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Reassurance Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs text-amber-300 font-medium backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-pulse" />
                <span>भारत सरकार • सामाजिक न्याय एवं अधिकारिता मंत्रालय (MoSJE)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full text-xs text-emerald-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>PM-AJAY GIA घटक • 100% निःशुल्क सरकारी सहायता</span>
              </span>
            </div>

            {/* Main Headline & Voice Console Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Empathetic Message */}
              <div className="lg:col-span-7 space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                  बोलिए अपनी भाषा में,
                  <br />
                  <span className="text-amber-400">हम आपकी बात सुन रहे हैं</span>
                </h1>

                <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl">
                  अनुसूचित जाति (SC) के ग्रामीण युवाओं, महिलाओं और अनुभवी कारीगरों के लिए विशेष आवाज-आधारित सेवा। कोई जटिल कागजी फॉर्म नहीं — बस बोलकर बताएं और पाएं मुफ्त NSQF प्रशिक्षण, नजदीकी कौशल केंद्र व <strong>टूलकिट सहायता</strong>।
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    to="/pmajay/interview"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-all active:scale-95 hover:shadow-emerald-900/40"
                  >
                    <Mic className="w-5 h-5 text-emerald-200 animate-pulse" />
                    <span>माइक दबाकर शुरू करें</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIvrModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-amber-400/40 text-amber-300 px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all"
                    title="कीपैड फोन से कॉल करने का सिम्युलेटर"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>साधारण फोन IVR (1800-11-2026)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPassportModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3.5 rounded-xl font-medium text-xs sm:text-sm transition-all"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>आजीविका पासपोर्ट</span>
                  </button>
                </div>

                {/* Guarantees */}
                <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>कोई कागजी फॉर्म नहीं</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>टूलकिट उपकरण सहायता</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>NCVET सरकारी प्रमाणपत्र</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Humane Voice Assistant Preview Card */}
              <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      वॉयस सहायक तैयार है (Voice Assistant Ready)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => playVoice(t("welcome_speech"))}
                    className="p-1 rounded text-slate-500 hover:text-emerald-700 transition-colors"
                    title="ऑडियो सुनें"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4">
                  <p className="text-xs text-slate-500 mb-1 font-semibold">सहायक का अभिवादन:</p>
                  <p className="text-sm text-slate-800 font-medium leading-relaxed italic">
                    "नमस्ते! पीएम-अजय आजीविका सेवा में आपका स्वागत है। आप क्या काम जानते हैं या क्या नया सीखना चाहते हैं? बेझिझक अपनी भाषा में बोलिए।"
                  </p>
                </div>

                {/* Quick language selection chips */}
                <div className="space-y-2 mb-5">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    अपनी बोली चुनें और शुरू करें:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/pmajay/interview?lang=hi-IN"
                      className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/50 text-left transition-all group"
                    >
                      <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800">हिन्दी (Hindi)</div>
                      <div className="text-[10px] text-slate-500">मानक एवं स्थानीय लहजा</div>
                    </Link>
                    <Link
                      to="/pmajay/interview?lang=bho-IN"
                      className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/50 text-left transition-all group"
                    >
                      <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800">भोजपुरी / अवधी</div>
                      <div className="text-[10px] text-slate-500">पूर्वी उत्तर प्रदेश व बिहार</div>
                    </Link>
                    <Link
                      to="/pmajay/interview?lang=mr-IN"
                      className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/50 text-left transition-all group"
                    >
                      <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800">मराठी (Marathi)</div>
                      <div className="text-[10px] text-slate-500">विदर्भ व ग्रामीण महाराष्ट्र</div>
                    </Link>
                    <Link
                      to="/pmajay/interview?lang=en-IN"
                      className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/50 text-left transition-all group"
                    >
                      <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800">Indian English</div>
                      <div className="text-[10px] text-slate-500">Semi-Urban & Facilitators</div>
                    </Link>
                  </div>
                </div>

                {/* Bottom Card CTA */}
                <Link
                  to="/pmajay/interview"
                  className="w-full py-3 rounded-xl bg-[#002147] hover:bg-[#002b5c] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>साक्षात्कार आरंभ करें (Start Interview)</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ════ 3 DISTINCT LIVELIHOOD PATHWAYS (Competitor Benchmark Upgrade) ════ */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                तीन आजीविका विकल्प (3 Livelihood Tracks)
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002147] mt-2">
                आपकी आवश्यकता के अनुसार सही रास्ता
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                चाहे आप अपनी खुद की दुकान खोलना चाहते हों, वेतन वाली नौकरी चाहते हों, या समूह में काम करना चाहते हों — पीएम-अजय में हर विकल्प मौजूद है।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pathways.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 p-6 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                        {item.icon}
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.tagBg}`}>
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500 mb-3">{item.subtitle}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <div className="text-xs font-bold text-[#002147] mb-3">{item.highlight}</div>
                    <Link
                      to={item.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      <span>पाठ्यक्रम एवं अवसर देखें</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ 40-HOUR RPL FAST-TRACK BANNER (C03 & C25 Benchmark) ════ */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 bg-amber-50/60 border-b border-amber-200">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border-2 border-amber-300 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded text-xs font-bold">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>RPL (पूर्व अनुभव की मान्यता) फास्ट-ट्रैक</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#002147]">
                  क्या आपके पास पहले से काम का अनुभव है?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  यदि आप पहले से सिलाई, बिजली, राजमिस्त्री या नल फिटिंग का काम जानते हैं, तो आपको 300 घंटे की लंबी क्लास करने की आवश्यकता नहीं है। <strong>मात्र 40 घंटे (5 दिन) के RPL मूल्यांकन</strong> से सीधा NCVET सरकारी प्रमाण पत्र और टूलकिट सहायता संस्वीकृति प्राप्त करें।
                </p>
              </div>

              <Link
                to="/pmajay/interview"
                className="shrink-0 px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                RPL अनुभव दर्ज करें
              </Link>
            </div>
          </div>
        </section>

        {/* ════ POPULAR NSQF TRADES (Clean, High-Readability Cards) ════ */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  NCVET अनुमोदित पाठ्यक्रम
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002147] mt-1">
                  प्रमुख मांग वाले कौशल एवं अनुदान ट्रेड
                </h2>
              </div>
              <Link
                to="/pmajay/recommendations"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002147] hover:text-emerald-700"
              >
                <span>सभी 18 ट्रेड ब्राउज करें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {popularTrades.map((t, i) => (
                <div
                  key={i}
                  className={`bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between ${t.accent}`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-2">
                      <span>{t.qpCode}</span>
                      <span className="font-semibold text-slate-700">{t.nsqf}</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                      {t.hindiTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500 mb-2">{t.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{t.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-500 text-[11px]">{t.duration}</span>
                      <span className="font-bold text-emerald-700">{t.wage}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                      टूलकिट उपकरण सहायता पात्र
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ 4 SIMPLE STEPS JOURNEY ════ */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002147]">
                आसान 4 चरणों में योजना सहायता
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                सीधे आपके मोबाइल या नजदीकी केंद्र से — बिना किसी बिचौलिए या कागजी परेशानी के।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-amber-500 font-mono mb-2">01</div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">बोलकर बताएं</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  अपनी बोली में 6 आसान सवालों के उत्तर दें। कोई टाइपिंग या फॉर्म भरने की जरूरत नहीं।
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-amber-500 font-mono mb-2">02</div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">पारदर्शी मैपिंग</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  आपकी शिक्षा, यात्रा की सीमा और पुराने हुनर का पारदर्शी मिलान स्कोर तैयार होता है।
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-amber-500 font-mono mb-2">03</div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">केंद्र व टूलकिट सहायता</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  नजदीकी मान्यता प्राप्त केंद्र का आवंटन और टूलकिट उपकरण सहयोग। स्थानीय डेस्क से संपर्क करें; यह स्क्रीन धन स्वीकृत नहीं करती है।
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-amber-500 font-mono mb-2">04</div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">आजीविका पासपोर्ट</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  QR कोड युक्त आधिकारिक कार्ड डाउनलोड या प्रिंट कर केंद्र में प्रस्तुत करें।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════ LOCAL CLUSTER HIGHLIGHT (Varanasi & Chandauli) ════ */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>पायलट जिला क्लस्टर: वाराणसी एवं चंदौली (सेवापुरी ब्लॉक)</span>
                </div>
                <h3 className="text-xl font-bold text-[#002147]">
                  नजदीकी केंद्र: PMKK करौंदी, बड़ौदा RSETI चिरईगांव व सेवापुरी क्लस्टर
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  प्रशिक्षण के बाद पीएम सूर्य घर, जल जीवन मिशन एवं स्थानीय प्रेरणा महिला स्वयं सहायता समूहों में वास्तविक काम से जुड़ाव।
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/pmajay/opportunities"
                  className="px-5 py-3 rounded-xl bg-[#002147] hover:bg-[#002b5c] text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
                >
                  स्थानीय अवसर देखें
                </Link>
                <Link
                  to="/pmajay/admin"
                  className="px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-all"
                >
                  अधिकारी लॉगिन
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER: Clean, GIGW 3.0 / NIC Standards ── */}
      <footer className="bg-[#001733] text-slate-300 py-10 px-4 sm:px-6 lg:px-8 font-sans border-t-2 border-amber-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs">
          <div className="flex items-center gap-3">
            <EmblemOfIndia size={28} variant="gold" />
            <div>
              <div className="font-bold text-white text-sm">विकल्प AI (Vikalp AI)</div>
              <div className="text-slate-400 text-[11px]">
                सामाजिक न्याय और अधिकारिता मंत्रालय • भारत सरकार (MoSJE)
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <Link to="/pmajay" className="hover:text-white">मुख्य पृष्ठ</Link>
            <span>•</span>
            <Link to="/pmajay/interview" className="hover:text-white">वॉयस साक्षात्कार</Link>
            <span>•</span>
            <Link to="/pmajay/recommendations" className="hover:text-white">सिफारिशें</Link>
            <span>•</span>
            <Link to="/pmajay/opportunities" className="hover:text-white">अवसर</Link>
            <span>•</span>
            <Link to="/pmajay/admin" className="hover:text-white">प्रशासनिक ऑडिट</Link>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            <div>हेल्पलाइन: 1800-11-2026 (टोल-फ्री)</div>
            <div className="text-[10px] text-slate-500 mt-0.5">GIGW 3.0 & NCVET NSQF Compliant</div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <IVRSimulatorModal isOpen={ivrModalOpen} onClose={() => setIvrModalOpen(false)} />
      <LivelihoodPassportModal isOpen={passportModalOpen} onClose={() => setPassportModalOpen(false)} />
    </div>
  );
};
