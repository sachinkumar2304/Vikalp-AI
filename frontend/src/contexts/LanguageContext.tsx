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
    scheme_tag: "PM-AJAY GIA घटक",
    scheme_sub: "100% निःशुल्क सरकारी सहायता",
    helpline: "टोल-फ्री: 1800-11-2026",
    portal_name: "विकल्प AI (Vikalp AI)",
    portal_sub: "अनुसूचित जाति (SC) कल्याण एवं आजीविका मैपिंग पोर्टल",
    btn_speak_nav: "बोलकर बताएं",
    nav_home: "मुख्य पृष्ठ",
    nav_voice: "वॉयस साक्षात्कार",
    nav_profile: "प्रोफाइल सारांश",
    nav_recommendations: "NSQF सिफारिशें",
    nav_jobs: "स्थानीय अवसर",
    nav_admin: "प्रशासनिक ऑडिट",
    nav_ivr_cta: "IVR डायल (1800-11-2026)",
    nav_passport_cta: "आजीविका पासपोर्ट",

    // Hero Section
    hero_gov_tag: "भारत सरकार • सामाजिक न्याय एवं अधिकारिता मंत्रालय (MoSJE)",
    hero_badge: "PM-AJAY GIA घटक • 100% निःशुल्क सरकारी सहायता",
    hero_h1_main: "बोलिए अपनी भाषा में,",
    hero_h1_sub: "हम आपकी बात सुन रहे हैं",
    hero_desc: "अनुसूचित जाति (SC) के ग्रामीण युवाओं, महिलाओं और अनुभवी कारीगरों के लिए विशेष आवाज-आधारित सेवा। कोई जटिल कागजी फॉर्म नहीं — बस बोलकर बताएं और पाएं मुफ्त NSQF प्रशिक्षण, नजदीकी कौशल केंद्र व टूलकिट सहायता।",
    btn_mic_start: "माइक दबाकर शुरू करें",
    btn_ivr_dial: "साधारण फोन IVR (1800-11-2026)",
    btn_passport: "आजीविका पासपोर्ट",
    guarantee_no_forms: "कोई कागजी फॉर्म नहीं",
    guarantee_toolkit: "टूलकिट उपकरण सहायता",
    guarantee_cert: "NCVET सरकारी प्रमाणपत्र",

    // Interactive Assistant Card
    assistant_ready: "वॉयस सहायक तैयार है (Voice Assistant Ready)",
    assistant_greeting_title: "सहायक का अभिवादन:",
    assistant_greeting_quote: "नमस्ते! पीएम-अजय आजीविका सेवा में आपका स्वागत है। आप क्या काम जानते हैं या क्या नया सीखना चाहते हैं? बेझिझक अपनी भाषा में बोलिए।",
    dialect_heading: "अपनी बोली चुनें और शुरू करें:",
    dialect_hindi_title: "हिन्दी (Hindi)",
    dialect_hindi_desc: "मानक एवं स्थानीय लहजा",
    dialect_bhojpuri_title: "भोजपुरी / अवधी",
    dialect_bhojpuri_desc: "पूर्वी उत्तर प्रदेश व बिहार",
    dialect_marathi_title: "मराठी (Marathi)",
    dialect_marathi_desc: "विदर्भ व ग्रामीण महाराष्ट्र",
    dialect_english_title: "Indian English",
    dialect_english_desc: "सरल संवाद व फैसिलिटेटर",
    btn_start_interview: "साक्षात्कार आरंभ करें (Start Interview)",

    // Pathways Section
    pathways_badge: "तीन आजीविका विकल्प (3 Livelihood Tracks)",
    pathways_heading: "आपकी आवश्यकता के अनुसार सही रास्ता",
    pathways_desc: "चाहे आप अपनी खुद की दुकान खोलना चाहते हों, वेतन वाली नौकरी चाहते हों, या समूह में काम करना चाहते हों — पीएम-अजय में हर विकल्प मौजूद है।",
    pathway_self_title: "स्वरोजगार एवं टूलकिट सहायता",
    pathway_self_sub: "Self-Employment & Enterprise Support",
    pathway_self_desc: "सिलाई, बढ़ईगीरी, सोलर रिपेयर, मोटर वाइंडिंग या इलेक्ट्रिकल कार्य में अपनी दुकान या स्वतंत्र सेवा शुरू करने हेतु टूलकिट उपकरण सहयोग।",
    pathway_self_highlight: "टूलकिट उपकरण सहयोग",
    pathway_wage_title: "स्थानीय वेतन रोजगार (स्थिर रोजगार)",
    pathway_wage_sub: "Wage Employment in Local Clusters",
    pathway_wage_desc: "नजदीकी औद्योगिक क्षेत्र, एमएसएमई वर्कशॉप, पीएम सूर्य घर योजना व जल जीवन मिशन प्रोजेक्ट्स में नियमित कार्य आधारित रोजगार।",
    pathway_wage_highlight: "स्थानीय औद्योगिक क्लस्टर लिंकेज",
    pathway_shg_title: "महिला स्वयं सहायता समूह क्लस्टर",
    pathway_shg_sub: "Women SHG Micro-Enterprise",
    pathway_shg_desc: "प्रेरणा एवं आजीविका मिशन समूहों के साथ गांव के भीतर ही परिधान निर्माण, मसाला प्रसंस्करण, अगरबत्ती व हस्तशिल्प में सामूहिक आमदनी।",
    pathway_shg_highlight: "गांव के भीतर कार्य • शून्य यात्रा बाधा",
    btn_explore_track: "पाठ्यक्रम एवं अवसर देखें",

    // RPL Fast-Track Banner
    rpl_banner_tag: "RPL (पूर्व अनुभव की मान्यता) फास्ट-ट्रैक",
    rpl_banner_title: "क्या आपके पास पहले से काम का अनुभव है?",
    rpl_banner_desc: "यदि आप पहले से सिलाई, बिजली, राजमिस्त्री या नल फिटिंग का काम जानते हैं, तो आपको 300 घंटे की लंबी क्लास करने की आवश्यकता नहीं है। 40 घंटे (5 दिन) के RPL मूल्यांकन से सीधा NCVET सरकारी प्रमाण पत्र और टूलकिट सहायता संस्वीकृति प्राप्त करें।",
    btn_rpl_record: "RPL अनुभव दर्ज करें",

    // Popular NSQF Trades
    trades_section_tag: "NCVET अनुमोदित पाठ्यक्रम",
    trades_section_title: "प्रमुख मांग वाले कौशल एवं अनुदान ट्रेड",
    btn_browse_all_trades: "सभी 18 ट्रेड ब्राउज करें",
    trade_toolkit_tag: "टूलकिट उपकरण सहायता पात्र",

    // 4 Steps Journey
    steps_section_title: "आसान 4 चरणों में योजना सहायता",
    steps_section_desc: "सीधे आपके मोबाइल या नजदीकी केंद्र से — बिना किसी बिचौलिए या कागजी परेशानी के।",
    step1_num: "०१",
    step1_title: "बोलकर बताएं",
    step1_desc: "अपनी बोली में 6 आसान सवालों के उत्तर दें। कोई टाइपिंग या फॉर्म भरने की जरूरत नहीं।",
    step2_num: "०२",
    step2_title: "पारदर्शी मैपिंग",
    step2_desc: "आपकी शिक्षा, यात्रा की सीमा और पुराने हुनर का पारदर्शी मिलान स्कोर तैयार होता है।",
    step3_num: "०३",
    step3_title: "केंद्र व टूलकिट सहायता",
    step3_desc: "नजदीकी मान्यता प्राप्त केंद्र का आवंटन और टूलकिट उपकरण सहयोग। स्थानीय डेस्क से संपर्क करें; यह स्क्रीन धन स्वीकृत नहीं करती है।",
    step4_num: "०४",
    step4_title: "आजीविका पासपोर्ट",
    step4_desc: "QR कोड युक्त आधिकारिक कार्ड डाउनलोड या प्रिंट कर केंद्र में प्रस्तुत करें।",

    // Pilot Cluster
    cluster_tag: "पायलट जिला क्लस्टर: वाराणसी एवं चंदौली (सेवापुरी ब्लॉक)",
    cluster_title: "नजदीकी केंद्र: PMKK करौंदी, बड़ौदा RSETI चिरईगांव व सेवापुरी क्लस्टर",
    cluster_desc: "प्रशिक्षण के बाद पीएम सूर्य घर, जल जीवन मिशन एवं स्थानीय प्रेरणा महिला स्वयं सहायता समूहों में वास्तविक काम से जुड़ाव।",
    btn_view_local_opps: "स्थानीय अवसर देखें",
    btn_officer_login: "अधिकारी लॉगिन",

    // Footer
    footer_tagline: "सामाजिक न्याय और अधिकारिता मंत्रालय • भारत सरकार (MoSJE)",
    footer_helpline: "हेल्पलाइन: 1800-11-2026 (टोल-फ्री)",
    footer_compliance: "GIGW 3.0 & NCVET NSQF Compliant",

    // Voice Synthesis
    welcome_speech: "नमस्ते! पीएम-अजय विकल्प AI में आपका स्वागत है। आप माइक दबाकर अपनी भाषा में बात कर सकते हैं।",
    audio_badge: "ऑडियो सुनें",
    audio_stop: "आवाज बंद करें",
    stop_audio: "आवाज बंद करें",
    play_audio: "ऑडियो चलाएं",
    stat_courses: "कौशल पाठ्यक्रम",
    stat_toolkit: "टूलकिट अनुदान",
    stat_languages: "भाषाएं",
    stat_free: "निःशुल्क"
  },

  en: {
    // Top Ribbon & Header
    gov_title: "Government of India",
    ministry_title: "Ministry of Social Justice & Empowerment",
    scheme_tag: "PM-AJAY GIA Component",
    scheme_sub: "100% Free Government Assistance",
    helpline: "Toll-Free: 1800-11-2026",
    portal_name: "Vikalp AI",
    portal_sub: "Scheduled Caste (SC) Welfare & Livelihood Mapping Portal",
    btn_speak_nav: "Speak to Us",
    nav_home: "Home",
    nav_voice: "Voice Interview",
    nav_profile: "Profile Summary",
    nav_recommendations: "Recommendations",
    nav_jobs: "Opportunities",
    nav_admin: "Admin Audit",
    nav_ivr_cta: "IVR Dial (1800-11-2026)",
    nav_passport_cta: "Livelihood Passport",

    // Hero Section
    hero_gov_tag: "Government of India • Ministry of Social Justice & Empowerment (MoSJE)",
    hero_badge: "PM-AJAY GIA Component • 100% Free Government Assistance",
    hero_h1_main: "Speak In Your Own Language,",
    hero_h1_sub: "We Are Listening To You",
    hero_desc: "Specialized voice AI service designed for Scheduled Caste (SC) rural youth, women, and experienced artisans. Zero paperwork — speak naturally to access free NSQF skilling, nearest accredited training centers, and toolkit equipment assistance.",
    btn_mic_start: "Tap Mic to Start",
    btn_ivr_dial: "Basic Phone IVR (1800-11-2026)",
    btn_passport: "Livelihood Passport",
    guarantee_no_forms: "Zero Paperwork",
    guarantee_toolkit: "Toolkit Support",
    guarantee_cert: "Official NCVET Certificate",

    // Interactive Assistant Card
    assistant_ready: "Voice Assistant Ready",
    assistant_greeting_title: "Assistant Greeting:",
    assistant_greeting_quote: "Hello! Welcome to PM-AJAY Livelihood Service. What work do you currently know, or what new skill would you like to learn? Speak freely in your preferred dialect.",
    dialect_heading: "Choose your dialect and start:",
    dialect_hindi_title: "Hindi (Standard)",
    dialect_hindi_desc: "National & Regional Dialect",
    dialect_bhojpuri_title: "Bhojpuri / Awadhi",
    dialect_bhojpuri_desc: "Eastern UP & Bihar Dialects",
    dialect_marathi_title: "Marathi (Statewide)",
    dialect_marathi_desc: "Vidarbha & Rural Dialects",
    dialect_english_title: "Indian English",
    dialect_english_desc: "Accessible English & Facilitators",
    btn_start_interview: "Start Interview",

    // Pathways Section
    pathways_badge: "Three Livelihood Tracks",
    pathways_heading: "The Right Pathway Tailored to You",
    pathways_desc: "Whether you wish to launch an independent trade workshop, secure wage employment, or engage in community collective enterprises — PM-AJAY provides tailored pathways.",
    pathway_self_title: "Self-Employment & Enterprise Support",
    pathway_self_sub: "Toolkits for Independent Practitioners",
    pathway_self_desc: "Equipment assistance to establish your independent shop or service in tailoring, carpentry, solar servicing, electricals, or motor winding.",
    pathway_self_highlight: "Toolkit Equipment Assistance",
    pathway_wage_title: "Local Wage Employment (Stable Jobs)",
    pathway_wage_sub: "Direct Industry & Project Placements",
    pathway_wage_desc: "Regular salaried employment in neighboring industrial corridors, MSME workshops, PM Surya Ghar ventures, and Jal Jeevan Mission pipeline maintenance.",
    pathway_wage_highlight: "Local Industrial Linkages",
    pathway_shg_title: "Women SHG Micro-Enterprise Clusters",
    pathway_shg_sub: "Collective Community Livelihoods",
    pathway_shg_desc: "Village-level collective income with Prerna and livelihood mission groups across garment manufacturing, spices, incense, and local craft clusters.",
    pathway_shg_highlight: "Work Inside Village • Zero Travel Barriers",
    btn_explore_track: "Explore Courses & Opportunities",

    // RPL Fast-Track Banner
    rpl_banner_tag: "RPL (Recognition of Prior Learning) Fast-Track",
    rpl_banner_title: "Do You Already Possess Work Experience?",
    rpl_banner_desc: "If you already practice tailoring, electrical work, masonry, or plumbing, you do not need 300 hours in a classroom. A 40-hour (5-day) RPL assessment directly grants your NCVET government credential and unlocks toolkit equipment assistance.",
    btn_rpl_record: "Record Prior Experience",

    // Popular NSQF Trades
    trades_section_tag: "NCVET Accredited Qualifications",
    trades_section_title: "High-Demand Skilling & Grant Trades",
    btn_browse_all_trades: "Browse All 18 Trades",
    trade_toolkit_tag: "Eligible for Toolkit Assistance",

    // 4 Steps Journey
    steps_section_title: "Assistance in 4 Simple Steps",
    steps_section_desc: "Directly via your phone or nearest accredited center — zero intermediaries or bureaucratic hurdles.",
    step1_num: "01",
    step1_title: "Speak Naturally",
    step1_desc: "Answer 6 conversational prompts in your dialect. No typing or complicated forms required.",
    step2_num: "02",
    step2_title: "Transparent Mapping",
    step2_desc: "A transparent evaluation score calculates best-fit trades matching your education, radius, and background.",
    step3_num: "03",
    step3_title: "Center & Toolkit Match",
    step3_desc: "Allocation to your nearest accredited center with toolkit support. Contact local desk; this screen does not grant funds.",
    step4_num: "04",
    step4_title: "Livelihood Passport",
    step4_desc: "Download or print your official QR-verified dossier to present at your nearest training center.",

    // Pilot Cluster
    cluster_tag: "Pilot District Cluster: Varanasi & Chandauli (Sewapuri Block)",
    cluster_title: "Nearest Centers: PMKK Karaundi, Baroda RSETI Chiraigaon & Sewapuri Cluster",
    cluster_desc: "Post-training linkage with PM Surya Ghar, Jal Jeevan Mission, and women SHG livelihood programs.",
    btn_view_local_opps: "View Local Opportunities",
    btn_officer_login: "Officer Login",

    // Footer
    footer_tagline: "Ministry of Social Justice and Empowerment • Government of India (MoSJE)",
    footer_helpline: "Helpline: 1800-11-2026 (Toll-Free)",
    footer_compliance: "GIGW 3.0 & NCVET NSQF Compliant",

    // Voice Synthesis
    welcome_speech: "Welcome to PM-AJAY Vikalp AI. Tap the microphone to speak naturally in your mother tongue.",
    audio_badge: "Audio Guide",
    audio_stop: "Stop Audio",
    stop_audio: "Stop Audio",
    play_audio: "Play Audio",
    stat_courses: "Skill Courses",
    stat_toolkit: "Toolkit Grant",
    stat_languages: "Languages",
    stat_free: "Free"
  },

  mr: {
    // Top Ribbon & Header
    gov_title: "भारत सरकार | Government of India",
    ministry_title: "सामाजिक न्याय आणि सक्षमीकरण मंत्रालय",
    scheme_tag: "PM-AJAY GIA घटक",
    scheme_sub: "१००% मोफत सरकारी सहाय्य",
    helpline: "टोल-फ्री: 1800-11-2026",
    portal_name: "विकल्प AI (Vikalp AI)",
    portal_sub: "अनुसूचित जाती (SC) कल्याण आणि उपजीविका मॅपिंग पोर्टल",
    btn_speak_nav: "आवाजाने बोला",
    nav_home: "मुख्य पृष्ठ",
    nav_voice: "व्हॉइस मुलाखत",
    nav_profile: "प्रोफाइल सारांश",
    nav_recommendations: "शिफारसी",
    nav_jobs: "स्थानिक संधी",
    nav_admin: "प्रशासकीय ऑडिट",
    nav_ivr_cta: "IVR डायल (1800-11-2026)",
    nav_passport_cta: "उपजीविका पासपोर्ट",

    // Hero Section
    hero_gov_tag: "भारत सरकार • सामाजिक न्याय आणि सक्षमीकरण मंत्रालय (MoSJE)",
    hero_badge: "PM-AJAY GIA घटक • १००% मोफत सरकारी सहाय्य",
    hero_h1_main: "तुमच्या भाषेत सांगा,",
    hero_h1_sub: "आम्ही तुमचे ऐकत आहोत",
    hero_desc: "अनुसूचित जातीच्या (SC) ग्रामीण तरुण, महिला आणि कुशल कारागिरांसाठी विशेष व्हॉइस सेवा. कोणतेही क्लिष्ट फॉर्म भरण्याची गरज नाही — फक्त बोलून सांगा आणि मोफत NSQF प्रशिक्षण, जवळचे केंद्र आणि टूलकिट सहाय्य मिळवा.",
    btn_mic_start: "माइक दाबून सुरू करा",
    btn_ivr_dial: "साधा फोन IVR (1800-11-2026)",
    btn_passport: "उपजीविका पासपोर्ट",
    guarantee_no_forms: "कोणताही कागदी फॉर्म नाही",
    guarantee_toolkit: "टूलकिट उपकरण सहाय्य",
    guarantee_cert: "NCVET सरकारी प्रमाणपत्र",

    // Interactive Assistant Card
    assistant_ready: "व्हॉइस सहाय्यक सज्ज आहे (Voice Assistant Ready)",
    assistant_greeting_title: "सहाय्यकाचे स्वागत:",
    assistant_greeting_quote: "नमस्कार! पीएम-अजय उपजीविका सेवेत आपले स्वागत आहे. आपण कोणते काम करता किंवा नवीन काय शिकू इच्छिता? मनमोकळेपणाने आपल्या भाषेत बोला.",
    dialect_heading: "आपली बोली निवडा आणि सुरू करा:",
    dialect_hindi_title: "हिंदी (Hindi)",
    dialect_hindi_desc: "प्रमाण आणि प्रादेशिक बोली",
    dialect_bhojpuri_title: "भोजपुरी / अवधी",
    dialect_bhojpuri_desc: "पूर्व उत्तर प्रदेश व बिहार",
    dialect_marathi_title: "मराठी (Marathi)",
    dialect_marathi_desc: "विदर्भ व ग्रामीण महाराष्ट्र",
    dialect_english_title: "Indian English",
    dialect_english_desc: "सोपा संवाद आणि मार्गदर्शक",
    btn_start_interview: "मुलाखत सुरू करा (Start Interview)",

    // Pathways Section
    pathways_badge: "तीन उपजीविका मार्ग (3 Livelihood Tracks)",
    pathways_heading: "तुमच्या गरजेनुसार योग्य मार्ग",
    pathways_desc: "तुम्हाला स्वतःचा व्यवसाय सुरू करायचा असो, नियमित वेतनाची नोकरी हवी असो किंवा बचत गटात काम करायचे असो — पीएम-अजय मध्ये प्रत्येक पर्याय उपलब्ध आहे.",
    pathway_self_title: "स्वयंरोजगार आणि टूलकिट सहाय्य",
    pathway_self_sub: "Self-Employment & Enterprise Support",
    pathway_self_desc: "शिलाई, सुतारकाम, सोलर दुरुस्ती, मोटर वाइंडिंग किंवा इलेक्ट्रिकल कामात स्वतःचे दुकान किंवा स्वतंत्र सेवा सुरू करण्यासाठी टूलकिट उपकरण सहाय्य.",
    pathway_self_highlight: "टूलकिट उपकरण सहाय्य",
    pathway_wage_title: "स्थानिक वेतन रोजगार (स्थिर रोजगार)",
    pathway_wage_sub: "Wage Employment in Local Clusters",
    pathway_wage_desc: "जवळपासचे औद्योगिक क्षेत्र, एमएसएमई वर्कशॉप, पीएम सूर्य घर आणि जल जीवन मिशन प्रकल्पांमध्ये नियमित वेतनावर काम.",
    pathway_wage_highlight: "स्थानिक औद्योगिक क्लस्टर लिंकेज",
    pathway_shg_title: "महिला बचत गट क्लस्टर",
    pathway_shg_sub: "Women SHG Micro-Enterprise",
    pathway_shg_desc: "प्रेरणा व आजीविका अभियानांतर्गत गावातच महिला बचत गटांसोबत वस्त्रनिर्मिती, मसाला प्रक्रिया, अगरबत्ती व हस्तकलेतून सामूहिक उत्पन्न.",
    pathway_shg_highlight: "गावातच काम • प्रवासाची अडचण नाही",
    btn_explore_track: "कोर्सेस आणि संधी पहा",

    // RPL Fast-Track Banner
    rpl_banner_tag: "RPL (मागील अनुभवाची मान्यता) फास्ट-ट्रॅक",
    rpl_banner_title: "तुमच्याकडे आधीपासून कामाचा अनुभव आहे का?",
    rpl_banner_desc: "जर तुम्हाला आधीपासून शिलाई, इलेक्ट्रिकल, गवंडी किंवा प्लंबिंगचे काम येत असेल तर ३०० तासांचा मोठा वर्ग करण्याची गरज नाही. ४० तासांच्या (५ दिवसांच्या) RPL मूल्यांकनाने थेट NCVET प्रमाणपत्र आणि टूलकिट सहाय्य मिळवा.",
    btn_rpl_record: "RPL अनुभव नोंदवा",

    // Popular NSQF Trades
    trades_section_tag: "NCVET मान्यताप्राप्त कोर्सेस",
    trades_section_title: "प्रमुख मागणी असलेले कौशल्य कोर्सेस",
    btn_browse_all_trades: "सर्व १८ कोर्सेस पहा",
    trade_toolkit_tag: "टूलकिट उपकरणासाठी पात्र",

    // 4 Steps Journey
    steps_section_title: "सोप्या ४ पायऱ्यांत योजना सहाय्य",
    steps_section_desc: "थेट तुमच्या मोबाईलवरून किंवा जवळच्या केंद्रावरून — मध्यस्थांशिवाय.",
    step1_num: "०१",
    step1_title: "बोलून सांगा",
    step1_desc: "आपल्या भाषेत ६ सोप्या प्रश्नांची उत्तरे द्या. कोणतीही टायपिंग गरज नाही.",
    step2_num: "०२",
    step2_title: "पारदर्शक मॅपिंग",
    step2_desc: "शिक्षण, प्रवासाची मर्यादा आणि जुन्या अनुभवाचे पारदर्शक मूल्यमापन होते.",
    step3_num: "०३",
    step3_title: "केंद्र व टूलकिट सहाय्य",
    step3_desc: "जवळच्या मान्यताप्राप्त केंद्राची जोडणी आणि टूलकिट सहाय्य. स्थानिक डेस्कशी संपर्क साधा.",
    step4_num: "०४",
    step4_title: "उपजीविका पासपोर्ट",
    step4_desc: "अधिकृत QR कार्ड डाउनलोड किंवा प्रिंट करून केंद्रात सादर करा.",

    // Pilot Cluster
    cluster_tag: "पायलट जिल्हा क्लस्टर: वाराणसी आणि चंदौली (सेवापुरी ब्लॉक)",
    cluster_title: "जवळचे केंद्र: PMKK करौंदी, बडोदा RSETI आणि सेवापुरी क्लस्टर",
    cluster_desc: "प्रशिक्षणानंतर पीएम सूर्य घर, जल जीवन मिशन आणि महिला बचत गटांमध्ये थेट कामाशी जोडणी.",
    btn_view_local_opps: "स्थानिक संधी पहा",
    btn_officer_login: "अधिकारी लॉगिन",

    // Footer
    footer_tagline: "सामाजिक न्याय आणि सक्षमीकरण मंत्रालय • भारत सरकार (MoSJE)",
    footer_helpline: "हेल्पलाइन: 1800-11-2026 (टोल-फ्री)",
    footer_compliance: "GIGW 3.0 & NCVET NSQF Compliant",

    // Voice Synthesis
    welcome_speech: "नमस्कार! पीएम-अजय कौशल्य मित्र मध्ये आपले स्वागत आहे. आपण माइक दाबून आपल्या भाषेत संवाद साधू शकता.",
    audio_badge: "ऑडिओ मार्गदर्शन",
    audio_stop: "आवाज बंद करा",
    stop_audio: "आवाज बंद करा",
    play_audio: "ऑडिओ चालवा",
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

  // Sync across tabs & storage updates
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "pmajay_app_lang" && e.newValue) {
        const next = e.newValue as SupportedLang;
        if (next === "hi" || next === "en" || next === "mr") {
          setLangState(next);
          document.documentElement.lang = next;
        }
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<SupportedLang>;
      if (customEvent.detail && (customEvent.detail === "hi" || customEvent.detail === "en" || customEvent.detail === "mr")) {
        setLangState(customEvent.detail);
        document.documentElement.lang = customEvent.detail;
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("pmajay_language_change", handleCustomChange);
    document.documentElement.lang = lang;

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("pmajay_language_change", handleCustomChange);
    };
  }, [lang]);

  const setLang = (newLang: SupportedLang) => {
    setLangState(newLang);
    const fullCode = newLang === "hi" ? "hi-IN" : newLang === "mr" ? "mr-IN" : "en-IN";
    try {
      localStorage.setItem("pmajay_app_lang", newLang);
      localStorage.setItem("pmajay_selected_lang", fullCode);
    } catch {
      // Storage quota or error safe
    }
    document.documentElement.lang = newLang;

    // Dispatch broadcast event for instantaneous cross-component and BeneficiaryContext sync
    window.dispatchEvent(new CustomEvent("pmajay_language_change", { detail: newLang }));

    // Voice announcement
    playVoice(TRANSLATIONS[newLang]?.welcome_speech || "", newLang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.hi[key] || key;
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
