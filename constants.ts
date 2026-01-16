
export const SYSTEM_INSTRUCTION = (lang: string) => `
You are a ${lang === 'bn' ? 'Bangla' : 'English'}-speaking AI assistant designed to help Bangladeshi people.
Current Language Setting: ${lang === 'bn' ? 'Bangla' : 'English'}.

IDENTITY INFORMATION:
- Your name is: Md Mostafizur Rahman AI Assistant.
- Your age is: 25 years.
- Your address is: Puijala, Assasuni, Satkhira.
- Your creator/developer is: Md Mostafizur Rahman (who lives at the same address).
- If anyone asks who you are or who made you, always provide these details politely in ${lang === 'bn' ? 'Bangla' : 'English'}.

LANGUAGE & COMMUNICATION:
- Always respond in ${lang === 'bn' ? 'simple, clear Bangla' : 'simple English'}.
- Use polite, friendly, and respectful tone.
- Explain so that a school student can understand.
- Use short sentences and natural conversational style.
- No emojis.
- No long paragraphs.

SUPPORTED MODES:
1) HEALTH MODE (General info only, NO diagnosis/prescription, safety disclaimer required)
2) JOB MODE (CV writing, interview prep)
3) AGRICULTURE MODE (Crop advice)
4) GENERAL INFORMATION MODE

HEALTH SAFETY:
- If emergency (chest pain, breathing trouble), advise hospital immediately.
- MANDATORY DISCLAIMER: ${lang === 'bn' ? '"এটি চিকিৎসকের পরামর্শ নয়। সঠিক চিকিৎসার জন্য ডাক্তার দেখানো জরুরি।"' : '"This is not medical advice. Consult a doctor for treatment."'}
`;

export const TRANSLATIONS = {
  bn: {
    appName: "মোস্তাফিজুর এআই সহকারী",
    appSubtitle: "সহজ বাংলা এআই সহকারী",
    dashboardTitle: "আপনার ড্যাশবোর্ড",
    loginTitle: "লগইন করুন",
    loginSubtitle: "আপনার প্রয়োজনীয় সেবা পেতে লগইন করুন",
    googleLogin: "গুগল দিয়ে লগইন",
    guestLogin: "গেস্ট হিসেবে প্রবেশ",
    guestNameLabel: "আপনার নাম লিখুন",
    guestAgeLabel: "আপনার বয়স",
    selectPhoto: "ছবি নির্বাচন করুন",
    changePhoto: "ছবি পরিবর্তন করুন",
    settings: "সেটিংস",
    language: "ভাষা",
    theme: "থিম",
    light: "লাইট",
    dark: "ডার্ক",
    logout: "লগআউট",
    placeholder: "এখানে লিখুন...",
    welcomePrefix: "স্বাগতম",
    welcomeSuffix: "! আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    health: "স্বাস্থ্য",
    healthDesc: "সাধারণ স্বাস্থ্য পরামর্শ ও প্রাথমিক চিকিৎসার তথ্য।",
    jobs: "চাকরি",
    jobsDesc: "সিভি তৈরি ও ক্যারিয়ার গাইডেন্স।",
    agri: "কৃষি",
    agriDesc: "ফসল, চাষাবাদ ও কৃষি সমস্যা সমাধান।",
    general: "সাধারণ তথ্য",
    generalDesc: "সরকারি সেবা ও অন্যান্য প্রয়োজনীয় তথ্য।",
    backToChat: "চ্যাটে ফিরে যান",
    voice: "ভয়েস",
    services: "সেবা",
    connecting: "সংযোগ করা হচ্ছে...",
    listening: "আমি শুনছি...",
    voiceHint: "আপনার সমস্যা বা প্রশ্নটি বলুন। আমি উত্তর দেব।",
    errorMsg: "দুঃখিত, কোনো একটি সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।",
    devInfo: "ডেভলপার তথ্য",
    devName: "মোস্তাফিজুর রহমান",
    devRole: "ডিজিটাল মার্কেটার এবং সোশ্যাল মিডিয়া ম্যানেজার",
    devPhone: "+৮৮০১৬১৩৫৭২৭৪৯"
  },
  en: {
    appName: "Mostafizur AI Assistant",
    appSubtitle: "Easy AI Assistant",
    dashboardTitle: "Your Dashboard",
    loginTitle: "Login",
    loginSubtitle: "Login to access personalized services",
    googleLogin: "Login with Google",
    guestLogin: "Login as Guest",
    guestNameLabel: "Enter your name",
    guestAgeLabel: "Your Age",
    selectPhoto: "Select Photo",
    changePhoto: "Change Photo",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    logout: "Logout",
    placeholder: "Type here...",
    welcomePrefix: "Welcome",
    welcomeSuffix: "! How can I help you today?",
    health: "Health",
    healthDesc: "General health advice and first aid info.",
    jobs: "Jobs",
    jobsDesc: "CV writing and career guidance.",
    agri: "Agri",
    agriDesc: "Crops, farming and agriculture solutions.",
    general: "General Info",
    generalDesc: "Govt services and other essential info.",
    backToChat: "Back to Chat",
    voice: "Voice",
    services: "Services",
    connecting: "Connecting...",
    listening: "I am listening...",
    voiceHint: "Tell me your problem or question. I will answer.",
    errorMsg: "Sorry, something went wrong. Please try again.",
    devInfo: "Developer Information",
    devName: "Mostafizur Rahman",
    devRole: "Digital Marketer & Social Media Manager",
    devRoleEn: "Digital Marketer & Social Media Manager",
    devPhone: "+8801613572749"
  }
};
