
export const MATH_EXERCISE_1_DATA = `
নবম-দশম শ্রেণি সাধারণ গণিতঃ অনুশীলনী-১ বাস্তব সংখ্যা। 
১. নিচের কোনটি অমূলদ সংখ্যা? উত্তরঃ (ঘ) 5/√3
২. a, b, c, d চারটি ক্রমিক স্বাভাবিক সংখ্যা হলে নিচের কোনটি পূর্ণবর্গ সংখ্যা? উত্তরঃ (গ) abcd+1
৩. 1 থেকে 10 পর্যন্ত মৌলিক সংখ্যা কয়টি? উত্তরঃ (খ) 4
... (অন্যান্য প্রশ্ন)
`;

export const MATH_7_DATA = `
সপ্তম শ্রেণির গণিত (নতুন কারিকুলাম ২০২৩-২৪):
১. সূচকের গল্প: সূচক, ভিত্তি, শক্তি বা ঘাত সম্পর্কে আলোচনা। 
২. অজানা রাশির সূচক, গুণ ও ভাগ।
৩. ভগ্নাংশের এলসিএম (LCM) এবং জিসিডি (GCD)।
৪. অনুপাত ও সমানুপাত।
৫. আকৃতি দিয়ে চেনা: জ্যামিতিক বিভিন্ন আকৃতি।
৬. অজানা রাশির জগৎ: চলক, পদ, রাশিমালা।

উদাহরণ সমাধান:
- সূচক: 2³ মানে ২ কে ৩ বার গুণ করা (২x২x২ = ৮)। এখানে ২ ভিত্তি এবং ৩ ঘাত।
- লসাগু (LCM): দুটি সংখ্যার ক্ষুদ্রতম সাধারণ গুণিতক।
- গসাগু (GCD): দুটি সংখ্যার বৃহত্তম সাধারণ গুণনীয়ক।
`;

export const SYSTEM_INSTRUCTION = (lang: string, mode?: string) => {
  let instruction = `
You are a ${lang === 'bn' ? 'Bangla' : 'English'}-speaking Muslim AI assistant designed to help Bangladeshi people.
Current Language Setting: ${lang === 'bn' ? 'Bangla' : 'English'}.

IDENTITY:
- Name: Md Mostafizur Rahman AI Assistant.
- Age: 25.
- Creator: Md Mostafizur Rahman (Digital Marketer & Social Media Manager).
- Always start the first message with "Assalamu Alaikum".

MATH SOLUTIONS FORMATTING (UPDATED):
- Provide math solutions in a simple, direct, and traditional way (just like a student writes in a notebook).
- IMPORTANT: Use superscript characters for squares and cubes (e.g., a², b², x², 2³, 5²) whenever possible in plain text to ensure they are easily readable.
- DO NOT force a "step-by-step" breakdown with specific headers (Given, Formula, etc.) unless the user specifically asks for it. 
- Avoid long introductory paragraphs or unnecessary complexity.
- If using LaTeX for complex equations, keep it clean. For simple algebraic expressions, prefer the direct superscript style like (a+b)² = a² + 2ab + b².

COMMUNICATION:
- Polite and respectful.
- Use simple Bangla/English for students.
- Short sentences, no long paragraphs, no emojis.
`;

  if (mode === 'MATH_9_10') {
    instruction += `
SPECIALIZED MODE: CLASS 9-10 MATH EXPERT (NCTB)
- Focus on Class 9-10 General Math.
- Data context: ${MATH_EXERCISE_1_DATA}
`;
  } else if (mode === 'MATH_7') {
    instruction += `
SPECIALIZED MODE: CLASS 7 MATH EXPERT (NCTB - NEW CURRICULUM)
- You are a Class 7 Math Tutor.
- Follow the new curriculum (২০২৩-২৪) pedagogy: focus on logical thinking and practical examples.
- Topics context: ${MATH_7_DATA}
`;
  }

  instruction += `
HEALTH SAFETY:
- MANDATORY DISCLAIMER: ${lang === 'bn' ? '"এটি চিকিৎসকের পরামর্শ নয়। সঠিক চিকিৎসার জন্য ডাক্তার দেখানো জরুরি।"' : '"This is not medical advice. Consult a doctor for treatment."'}
`;
  return instruction;
};

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
    selectPhoto: "ছবি নির্বাচন করুন",
    changePhoto: "ছবি পরিবর্তন করুন",
    settings: "সেটিংস",
    language: "ভাষা",
    theme: "থিম",
    light: "লাইট",
    dark: "ডার্ক",
    logout: "লগআউট",
    placeholder: "এখানে লিখুন...",
    welcomePrefix: "আসসালামু আলাইকুম, স্বাগতম",
    welcomeSuffix: "! আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    health: "স্বাস্থ্য",
    healthDesc: "সাধারণ স্বাস্থ্য পরামর্শ ও প্রাথমিক চিকিৎসার তথ্য।",
    jobs: "চাকরি",
    jobsDesc: "সিভি তৈরি ও ক্যারিয়ার গাইডেন্স।",
    agri: "কৃষি",
    agriDesc: "ফসল, চাষাবাদ ও কৃষি সমস্যা সমাধান।",
    general: "সাধারণ তথ্য",
    generalDesc: "সরকারি সেবা ও অন্যান্য প্রয়োজনীয় তথ্য।",
    math: "গণিত সমাধান",
    mathDesc: "ছবি বা টেক্সট থেকে গণিতের সমাধান।",
    math910: "৯ম-১০ম শ্রেণি গণিত",
    math910Desc: "নবম-দশম শ্রেণির সাধারণ গণিত বইয়ের সকল অংকের সমাধান ও ব্যাখ্যা।",
    math7: "৭ম শ্রেণি গণিত",
    math7Desc: "সপ্তম শ্রেণির নতুন কারিকুলাম অনুযায়ী গণিতের সহজ সমাধান ও ব্যাখ্যা।",
    handMath: "হাতে লেখা গণিত",
    handMathDesc: "স্ক্রিনে লিখে অংকের সমাধান করুন।",
    backToChat: "চ্যাটে ফিরে যান",
    voice: "ভয়েস",
    services: "সেবা",
    connecting: "সংযোগ করা হচ্ছে...",
    listening: "আমি শুনছি...",
    voiceHint: "আপনার সমস্যা বা প্রশ্নটি বলুন। আমি উত্তর দেব।",
    errorMsg: "দুঃখিত, কোনো একটি সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।",
    devInfo: "ডেভলপার তথ্য",
    devName: "মোস্তাফিজুর রহমান",
    devRole: "ফ্রিল্যান্সার, ডিজিটাল মার্কেটার এবং সোশ্যাল মিডিয়া ম্যানেজার",
    devEdu: "স্নাতক, ধামরাই সরকারি কলেজ (২০২৩)",
    devPhone: "+৮৮০১৬১৩৫৭২৭৪৯",
    chatHistory: "চ্যাট হিস্ট্রি",
    noHistory: "এখনো কোনো হিস্ট্রি নেই।",
    noResults: "কোনো ফলাফল পাওয়া যায়নি।",
    searchPlaceholder: "হিস্ট্রি খুঁজুন...",
    filterBy: "ফিল্টার:",
    all: "সব",
    userLabel: "আপনি",
    aiLabel: "সহকারী",
    clearHistory: "সব মুছুন",
    deleteSession: "মুছে ফেলুন",
    voiceSession: "ভয়েস চ্যাট",
    videoSession: "ভিডিও চ্যাট",
    sendFeedback: "মতামত দিন",
    feedbackTitle: "আপনার মতামত",
    feedbackLabel: "আমাদের এই সহকারী সম্পর্কে আপনার মতামত বা পরামর্শ লিখুন:",
    submitFeedback: "সাবমিট করুন",
    feedbackSuccess: "আপনার মতামতের জন্য ধন্যবাদ!",
    feedbackPlaceholder: "আপনার কথা লিখুন...",
    solutionBoard: "সমাধান বোর্ড",
    saveAsImage: "ছবি হিসেবে সংরক্ষণ"
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
    selectPhoto: "Select Photo",
    changePhoto: "Change Photo",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    logout: "Logout",
    placeholder: "Type here...",
    welcomePrefix: "Assalamu Alaikum, Welcome",
    welcomeSuffix: "! How can I help you today?",
    health: "Health",
    healthDesc: "General health advice and first aid info.",
    jobs: "Jobs",
    jobsDesc: "CV writing and career guidance.",
    agri: "Agri",
    agriDesc: "Crops, farming and agriculture solutions.",
    general: "General Info",
    generalDesc: "Govt services and other essential info.",
    math: "Math Solution",
    mathDesc: "Solve math from photo or text.",
    math910: "Class 9-10 Math",
    math910Desc: "Step-by-step solutions for NCTB Class 9-10 General Math.",
    math7: "Class 7 Math",
    math7Desc: "Simple solutions and explanations for the new Class 7 Math curriculum.",
    handMath: "Hand Math",
    handMathDesc: "Draw math on screen to solve.",
    backToChat: "Back to Chat",
    voice: "Voice",
    services: "Services",
    connecting: "Connecting...",
    listening: "I am listening...",
    voiceHint: "Tell me your problem or question. I will answer.",
    errorMsg: "Sorry, something went wrong. Please try again.",
    devInfo: "Developer Information",
    devName: "Mostafizur Rahman",
    devRole: "Freelancer, Digital Marketer & Social Media Manager",
    devEdu: "Graduate, Dhamrai Govt College (2023)",
    devPhone: "+8801613572749",
    chatHistory: "Chat History",
    noHistory: "No history found.",
    noResults: "No matching results found.",
    searchPlaceholder: "Search history...",
    filterBy: "Filter by:",
    all: "All",
    userLabel: "You",
    aiLabel: "Assistant",
    clearHistory: "Clear All",
    deleteSession: "Delete",
    voiceSession: "Voice Chat",
    videoSession: "Video Chat",
    sendFeedback: "Send Feedback",
    feedbackTitle: "Your Feedback",
    feedbackLabel: "Share your feedback or suggestions about this assistant:",
    submitFeedback: "Submit",
    feedbackSuccess: "Thank you for your feedback!",
    feedbackPlaceholder: "Type your feedback here...",
    solutionBoard: "Solution Board",
    saveAsImage: "Save as Image"
  }
};
