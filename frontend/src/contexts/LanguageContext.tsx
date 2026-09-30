import React, { createContext, useContext, useState, useEffect } from "react";

export type SupportedLang = "hi" | "en" | "mr";

interface LanguageContextType {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t: (key: string) => string;
  playVoice: (text: string, overrideLang?: SupportedLang) => void;
  stopVoice: () => void;
  isSpeaking: boolean;
}

const TRANSLATIONS: Record<SupportedLang, Record<string, string>> = {
  hi: {
    // Top Ribbon & Header
    gov_title: "भारत सरकार | Government of India",
    ministry_title: "सामाजिक न्याय और अधिकारिता मंत्रालय",
    scheme_tag: "PM-AJAY कौशल घटक",
    helpline: "टोल-फ्री: 1800-11-2026",
    portal_name: "वाणीपथ कौशल मित्र",
    portal_sub: "अनुसूचित जाति (SC) कल्याण एवं आजीविका मैपिंग पोर्टल",
    btn_speak_nav: "बोलकर बात करें",
    nav_home: "मुख्य पृष्ठ",
    nav_voice: "वॉयस संवाद",
    nav_profile: "प्रोफाइल",
    nav_recommendations: "NSQF कोर्स",
    nav_jobs: "स्थानीय अवसर",
    nav_admin: "प्रशासनिक पोर्टल",

    // Hero Section
    hero_badge: "पीएम-अजय कौशल मित्र • प्रत्यक्ष आजीविका सहायता",
    hero_h1_1: "अपनी बोली में बताएं अपना हुनर,",
    hero_h1_2: "पाएं मुफ्त सरकारी कोर्स व टूलकिट",
    hero_desc: "अनुसूचित जाति (SC) के ग्रामीण भाई-बहनों और कारीगरों के लिए विशेष वॉयस सेवा। कोई फॉर्म नहीं भरना — बस बोलकर बताएं और पाएं 100% फ्री NSQF सर्टिफाइड ट्रेनिंग, पास का सेंटर और ₹50,000 तक की टूलकिट सहायता।",
    btn_start_voice: "अभी माइक दबाकर बोलें",
    btn_view_jobs: "स्थानीय अवसर देखें",

    // Quick Card
    quick_box_title: "यह कैसे काम करता है?",
    q1: "1. आपकी पढ़ाई कहाँ तक हुई है?",
    q2: "2. आप अभी क्या काम या मजदूरी करते हैं?",
    q3: "3. नया क्या काम या हुनर सीखना चाहते हैं?",
    q4: "4. क्या आप गांव से बाहर जा सकते हैं या पास रहना चाहते हैं?",
    quick_btn: "बातचीत शुरू करें",

    // 4 Steps
    steps_heading: "आसान 4 चरण",
    step1_title: "01. बोलकर बताएं",
    step1_desc: "माइक दबाकर अपनी पढ़ाई, काम और रुचियों के बारे में बताएं।",
    step2_title: "02. प्रोफाइल मैपिंग",
    step2_desc: "सिस्टम आपके पुराने हुनर और यात्रा की सीमा को समझता है।",
    step3_title: "03. सही कोर्स का चयन",
    step3_desc: "आपकी सुविधा अनुसार सोलर, सिलाई, प्लंबिंग आदि कोर्स मिलते हैं।",
    step4_title: "04. टूलकिट व सेंटर",
    step4_desc: "नजदीकी केंद्र से जुड़ें और ₹50,000 तक की टूलकिट ग्रांट पाएं।",

    // NSQF Popular Trades
    popular_heading: "लोकप्रिय सरकारी कौशल पाठ्यक्रम",
    solar_title: "सोलर रूफटॉप इंस्टालर (Suryamitra)",
    solar_desc: "सोलर पैनल फिटिंग व विद्युत रखरखाव।",
    tailor_title: "स्वरोजगार दर्जी व बुटीक (Tailoring)",
    tailor_desc: "सिलाई, कटिंग व गांव में बुटीक स्वरोजगार।",
    appliance_title: "घरेलू उपकरण रिपेयर (Appliance)",
    appliance_desc: "पंखा, कूलर, मोटर व मिक्सर सर्विसिंग।",
    plumber_title: "ग्रामीण प्लंबर (Jal Jeevan Mission)",
    plumber_desc: "नल जल पाइपलाइन व मोटर पंप रखरखाव।",

    // Welcome Speech Text
    welcome_speech: "नमस्ते! पीएम-अजय कौशल मित्र में आपका स्वागत है। आप माइक दबाकर अपनी भाषा में बात कर सकते हैं। पूरी वेबसाइट को अच्छे से समझने के लिए नीचे दायें कोने में दिए गए 'वेबसाइट का मार्गदर्शन' पर क्लिक करें।",
    audio_badge: "ऑडियो सुनें",
    audio_stop: "आवाज बंद करें",
    stop_audio: "आवाज बंद करें",
    play_audio: "ऑडियो चलाएं",
    // Statistics
    stat_courses: "कौशल पाठ्यक्रम",
    stat_toolkit: "टूलकिट अनुदान",
    stat_languages: "भाषाएं",
    stat_free: "निःशुल्क"
  },
  en: {
    // Top Ribbon & Header
    gov_title: "Government of India",
    ministry_title: "Ministry of Social Justice & Empowerment",
    scheme_tag: "PM-AJAY Skilling Component",
    helpline: "Toll-Free: 1800-11-2026",
    portal_name: "Vaanipath Kaushal Mitra",
    portal_sub: "SC Welfare & NSQF Livelihood Mapping Portal",
    btn_speak_nav: "Speak to Assistant",
    nav_home: "Home",
    nav_voice: "Voice Interview",
    nav_profile: "Beneficiary Profile",
    nav_recommendations: "NSQF Courses",
    nav_jobs: "Local Opportunities",
    nav_admin: "Admin Dashboard",

    // Hero Section
    hero_badge: "PM-AJAY Kaushal Mitra • Direct Livelihood Support",
    hero_h1_1: "Speak In Your Own Language,",
    hero_h1_2: "Get Certified NSQF Skilling & Toolkits",
    hero_desc: "Specialized voice AI service for Scheduled Caste (SC) rural youth, women, and artisans. No typing required — speak naturally to get matched with 100% grant-funded courses, local training centres, and up to ₹50,000 toolkit capital subsidies.",
    btn_start_voice: "Start Voice Assessment",
    btn_view_jobs: "View Local Opportunities",

    // Quick Card
    quick_box_title: "How It Works",
    q1: "1. What is your highest level of education?",
    q2: "2. What work or daily labor do you currently do?",
    q3: "3. Which trade or skill would you like to learn?",
    q4: "4. Can you travel outside your village or prefer local work?",
    quick_btn: "Begin Voice Assistant",

    // 4 Steps
    steps_heading: "Simple 4-Step Process",
    step1_title: "01. Speak Naturally",
    step1_desc: "Tap the mic and speak about your education and trade experience.",
    step2_title: "02. Profile Mapping",
    step2_desc: "System identifies existing skills, aspirations, and travel constraints.",
    step3_title: "03. Transparent Matching",
    step3_desc: "Rule-based engine recommends NSQF courses with explainable logic.",
    step4_title: "04. Toolkits & Centers",
    step4_desc: "Connect with accredited centers and claim up to ₹50,000 toolkit grants.",

    // NSQF Popular Trades
    popular_heading: "Popular NSQF Skill Trades",
    solar_title: "Solar PV Installer (Suryamitra)",
    solar_desc: "Rooftop solar panel installation and electrical maintenance.",
    tailor_title: "Self Employed Tailor & Boutique",
    tailor_desc: "Commercial stitching and village micro-boutique enterprise.",
    appliance_title: "Home Appliance Technician",
    appliance_desc: "Repairing coolers, fans, motors, and household appliances.",
    plumber_title: "Rural Plumber (Jal Jeevan Mission)",
    plumber_desc: "Panchayat drinking water pipeline and pump maintenance.",

    // Welcome Speech Text
    welcome_speech: "Welcome to PM-AJAY Kaushal Mitra. You can speak naturally by tapping the microphone. For complete guidance of this portal, please click 'Listen to Website Tour' in the bottom right corner.",
    audio_badge: "Audio Guide",
    audio_stop: "Stop Audio",
    stop_audio: "Stop Audio",
    play_audio: "Play Audio",
    // Statistics
    stat_courses: "Skill Courses",
    stat_toolkit: "Toolkit Grant",
    stat_languages: "Languages",
    stat_free: "Free"
  },
  mr: {
    // Top Ribbon & Header
    gov_title: "भारत सरकार | Government of India",
    ministry_title: "सामाजिक न्याय आणि सक्षमीकरण मंत्रालय",
    scheme_tag: "PM-AJAY कौशल्य घटक",
    helpline: "टोल-फ्री: 1800-11-2026",
    portal_name: "वाणीपथ कौशल मित्र",
    portal_sub: "अनुसूचित जाती (SC) कल्याण आणि उपजीविका मॅपिंग पोर्टल",
    btn_speak_nav: "आवाजाने बोला",
    nav_home: "मुख्य पृष्ठ",
    nav_voice: "व्हॉइस संवाद",
    nav_profile: "प्रोफाइल",
    nav_recommendations: "NSQF कोर्सेस",
    nav_jobs: "स्थानिक संधी",
    nav_admin: "प्रशासकीय पोर्टल",

    // Hero Section
    hero_badge: "पीएम-अजय कौशल्य मित्र • थेट उपजीविका सहाय्य",
    hero_h1_1: "तुमच्या भाषेत सांगा तुमचे कौशल्य,",
    hero_h1_2: "मिळवा मोफत सरकारी कोर्स व टूलकिट",
    hero_desc: "अनुसूचित जातीच्या (SC) तरुण व कारागिरांसाठी विशेष व्हॉइस सेवा. कोणताही फॉर्म भरण्याची गरज नाही — फक्त बोलून सांगा आणि १००% मोफत NSQF प्रशिक्षण, जवळचे केंद्र आणि ₹५०,००० पर्यंत टूलकिट अनुदान मिळवा.",
    btn_start_voice: "आता माइक दाबून बोला",
    btn_view_jobs: "स्थानिक संधी पहा",

    // Quick Card
    quick_box_title: "हे कसे कार्य करते?",
    q1: "१. तुमचे शिक्षण कुठपर्यंत झाले आहे?",
    q2: "२. सध्या तुम्ही काय काम किंवा मजुरी करता?",
    q3: "३. तुम्हाला नवीन कोणते काम किंवा कौशल्य शिकायचे आहे?",
    q4: "४. तुम्ही गावाबाहेर प्रवास करू शकता की गावातच काम हवे?",
    quick_btn: "संवाद सुरू करा",

    // 4 Steps
    steps_heading: "सोप्या ४ पायऱ्या",
    step1_title: "०१. बोलून सांगा",
    step1_desc: "माइक दाबून तुमचे शिक्षण, काम आणि आवडीबद्दल सांगा.",
    step2_title: "०२. प्रोफाइल मॅपिंग",
    step2_desc: "सिस्टम तुमचे जुने कौशल्य आणि प्रवासाची मर्यादा समजून घेते.",
    step3_title: "०३. योग्य कोर्सची निवड",
    step3_desc: "तुमच्या गरजेनुसार सोलर, टेलरिंग, प्लंबिंग इत्यादी कोर्सेस मिळतात.",
    step4_title: "०४. टूलकिट व केंद्र",
    step4_desc: "जवळच्या केंद्राशी जोडा आणि ₹५०,००० पर्यंत टूलकिट अनुदान मिळवा.",

    // NSQF Popular Trades
    popular_heading: "लोकप्रिय सरकारी कौशल्य कोर्सेस",
    solar_title: "सोलर रूफटॉप इंस्टॉलर (सूर्यमित्र)",
    solar_desc: "सोलर पॅनेल बसवणे आणि विद्युत देखभाल.",
    tailor_title: "स्वयंरोजगार टेलर आणि बुटीक",
    tailor_desc: "शिलाई, कटिंग आणि गावात बुटीक व्यवसाय.",
    appliance_title: "घरगुती उपकरणे दुरुस्ती (Appliance)",
    appliance_desc: "पंखा, कुलर, मोटर आणि मिक्सर दुरुस्ती.",
    plumber_title: "ग्रामीण प्लंबर (जल जीवन मिशन)",
    plumber_desc: "नळ पाणीपुरवठा पाईपलाईन आणि मोटर पंप देखभाल.",

    // Welcome Speech Text
    welcome_speech: "नमस्कार! पीएम-अजय कौशल्य मित्र मध्ये आपले स्वागत आहे. आपण माइक दाबून आपल्या भाषेत संवाद साधू शकता. संपूर्ण वेबसाइटच्या माहितीसाठी उजव्या कोपऱ्यातील 'वेबसाइट मार्गदर्शन' वर क्लिक करा.",
    audio_badge: "ऑडिओ मार्गदर्शन",
    audio_stop: "आवाज बंद करा",
    stop_audio: "आवाज बंद करा",
    play_audio: "ऑडिओ चालवा",
    // Statistics
    stat_courses: "कौशल्य अभ्यासक्रम",
    stat_toolkit: "टूलकिट अनुदान",
    stat_languages: "भाषा",
    stat_free: "निःशुल्क"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLang>(() => {
    const saved = localStorage.getItem("pmajay_app_lang") as SupportedLang;
    if (saved === "hi" || saved === "en" || saved === "mr") return saved;
    return "hi";
  });
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const setLang = (newLang: SupportedLang) => {
    setLangState(newLang);
    localStorage.setItem("pmajay_app_lang", newLang);
    localStorage.setItem("pmajay_selected_lang", newLang === "hi" ? "hi-IN" : newLang === "mr" ? "mr-IN" : "en-IN");
    // Play quick language switch acknowledgement
    playVoice(TRANSLATIONS[newLang].welcome_speech, newLang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[lang][key] || key;
  };

  const playVoice = (text: string, overrideLang?: SupportedLang) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const targetLang = overrideLang || lang;
      utterance.lang = targetLang === "hi" ? "hi-IN" : targetLang === "mr" ? "mr-IN" : "en-IN";
      utterance.rate = 0.92;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopVoice = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, playVoice, stopVoice, isSpeaking }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
