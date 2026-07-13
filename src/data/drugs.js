export const drugs = [
  {
    id: "1", nameAr: "وارفارين", nameEn: "Warfarin", category: "Anticoagulant", categoryAr: "مضاد تخثر",
    description: "مضاد تخثر يستخدم للوقاية من الجلطات الدموية",
    drugInteractions: [
      { drugId: "2", severity: "severe", description: "يزيد خطر النزيف بشكل كبير" },
      { drugId: "14", severity: "severe", description: "يزيد INR بشكل كبير - تجنب الاستخدام المشترك" },
      { drugId: "16", severity: "severe", description: "يزيد تأثير الوارفارين ومستوى INR" },
      { drugId: "18", severity: "moderate", description: "يقلل تأثير الوارفارين" },
      { drugId: "27", severity: "severe", description: "يزيد INR مع زيادة خطر النزيف" },
      { drugId: "34", severity: "severe", description: "يزيد خطر النزيف" },
    ],
    diseaseInteractions: [
      { diseaseId: "d1", severity: "severe", description: "يزيد خطر النزيف في مرضى الفشل الكلوي" },
      { diseaseId: "d2", severity: "severe", description: "ضعف استقلاب الوارفارين في تليف الكبد" },
      { diseaseId: "d10", severity: "contraindicated", description: "ممنوع في الحمل - يسبب تشوهات جنينية" },
      { diseaseId: "d18", severity: "contraindicated", description: "ممنوع في اضطرابات النزيف" },
    ]
  },
  {
    id: "2", nameAr: "أسبرين", nameEn: "Aspirin", category: "NSAID / Antiplatelet", categoryAr: "مضاد صفائح / مسكن",
    description: "مسكن ومضاد التهاب ومضاد للصفائح الدموية - يستخدم للوقاية من الجلطات",
    drugInteractions: [
      { drugId: "1", severity: "severe", description: "يزيد خطر النزيف بشكل كبير" },
      { drugId: "3", severity: "moderate", description: "يزيد خطر النزيف" },
      { drugId: "14", severity: "moderate", description: "يزيد خطر تهيج المعدة والنزيف" },
      { drugId: "33", severity: "moderate", description: "يزيد خطر النزيف عند استخدامه مع مضادات الالتهاب" },
    ],
    diseaseInteractions: [
      { diseaseId: "d7", severity: "contraindicated", description: "ممنوع في القرحة الهضمية النشطة" },
      { diseaseId: "d8", severity: "moderate", description: "قد يزيد حمض اليوريك ويثير النقرس" },
      { diseaseId: "d10", severity: "contraindicated", description: "ممنوع في الثلث الثالث من الحمل" },
      { diseaseId: "d18", severity: "contraindicated", description: "ممنوع في اضطرابات النزيف" },
    ]
  },
  {
    id: "3", nameAr: "كلوبيدوجريل", nameEn: "Clopidogrel", category: "Antiplatelet", categoryAr: "مضاد صفائح دموية",
    description: "مضاد لتجميع الصفائح الدموية - يستخدم مع الأسبرين بعد الجلطات",
    drugInteractions: [
      { drugId: "2", severity: "moderate", description: "يزيد خطر النزيف" },
      { drugId: "14", severity: "moderate", description: "يزيد خطر نزيف الجهاز الهضمي" },
      { drugId: "33", severity: "moderate", description: "يزيد خطر النزيف" },
    ],
    diseaseInteractions: [
      { diseaseId: "d7", severity: "severe", description: "يزيد خطر النزيف في القرحة الهضمية" },
      { diseaseId: "d18", severity: "contraindicated", description: "ممنوع في اضطرابات النزيف" },
    ]
  },
  {
    id: "4", nameAr: "ميتفورمين", nameEn: "Metformin", category: "Antidiabetic", categoryAr: "خافض لسكر الدم",
    description: "الخط الأول لعلاج السكري من النوع الثاني - يقلل إنتاج الجلوكوز الكبدي",
    drugInteractions: [
      { drugId: "9", severity: "moderate", description: "يزيد تركيز الميتفورمين - يجب مراقبة سكر الدم" },
      { drugId: "33", severity: "moderate", description: "قد يقلل فعالية الميتفورمين" },
    ],
    diseaseInteractions: [
      { diseaseId: "d1", severity: "contraindicated", description: "يزيد خطر الحماض اللبني في الفشل الكلوي" },
      { diseaseId: "d2", severity: "severe", description: "يزيد خطر الحماض اللبني في أمراض الكبد" },
      { diseaseId: "d3", severity: "moderate", description: "يزيد خطر الحماض اللبني في الفشل القلبي" },
    ]
  },
  {
    id: "5", nameAr: "أملوديبين", nameEn: "Amlodipine", category: "CCB", categoryAr: "حاصر لقنوات الكالسيوم",
    description: "موسع للأوعية الدموية - يستخدم لعلاج ارتفاع ضغط الدم والذبحة الصدرية",
    drugInteractions: [
      { drugId: "7", severity: "moderate", description: "يزيد خطر انخفاض ضغط الدم" },
      { drugId: "35", severity: "moderate", description: "يزيد تركيز الأملوديبين مع مثبطات CYP3A4" },
    ],
    diseaseInteractions: [
      { diseaseId: "d2", severity: "moderate", description: "احتياط في أمراض الكبد" },
    ]
  },
  {
    id: "6", nameAr: "إنالابريل", nameEn: "Enalapril", category: "ACE Inhibitor", categoryAr: "مثبط الإنزيم المحول للأنجيوتنسين",
    description: "مثبط ACE - يستخدم لارتفاع ضغط الدم وفشل القلب",
    drugInteractions: [
      { drugId: "10", severity: "severe", description: "يزيد خطر ارتفاع البوتاسيوم" },
      { drugId: "14", severity: "moderate", description: "يقلل فعالية الإنالابريل ويزيد خطر الفشل الكلوي" },
      { drugId: "33", severity: "moderate", description: "يقلل فعالية خفض الضغط" },
    ],
    diseaseInteractions: [
      { diseaseId: "d1", severity: "severe", description: "يزيد خطر ارتفاع البوتاسيوم وتدهور الوظيفة الكلوية" },
      { diseaseId: "d10", severity: "contraindicated", description: "ممنوع في الحمل - يسبب تشوهات كلوية للجنين" },
    ]
  },
  {
    id: "7", nameAr: "لوسارتان", nameEn: "Losartan", category: "ARB", categoryAr: "حاصر مستقبلات الأنجيوتنسين",
    description: "مضاد لمستقبلات الأنجيوتنسين II - يستخدم لارتفاع ضغط الدم وحماية الكلى",
    drugInteractions: [
      { drugId: "5", severity: "moderate", description: "يزيد خطر انخفاض ضغط الدم" },
      { drugId: "10", severity: "severe", description: "يزيد خطر ارتفاع البوتاسيوم" },
      { drugId: "14", severity: "moderate", description: "يقلل فعالية اللوسارتان" },
    ],
    diseaseInteractions: [
      { diseaseId: "d1", severity: "severe", description: "مراقبة البوتاسيوم والوظيفة الكلوية" },
      { diseaseId: "d10", severity: "contraindicated", description: "ممنوع في الحمل" },
    ]
  },
  {
    id: "8", nameAr: "أتورفاستاتين", nameEn: "Atorvastatin", category: "Statin", categoryAr: "خافض للكوليسترول",
    description: "مثبط HMG-CoA reductase - يستخدم لخفض الكوليسترول الضار",
    drugInteractions: [
      { drugId: "27", severity: "moderate", description: "يزيد خطر الاعتلال العضلي" },
      { drugId: "35", severity: "moderate", description: "يزيد تركيز الأتورفاستاتين - مراقبة الآثار الجانبية" },
    ],
    diseaseInteractions: [
      { diseaseId: "d2", severity: "severe", description: "احتياط شديد في أمراض الكبد النشطة" },
      { diseaseId: "d10", severity: "contraindicated", description: "ممنوع في الحمل" },
    ]
  },
  {
    id: "9", nameAr: "سيمفاستاتين", nameEn: "Simvastatin", category: "Statin", categoryAr: "خافض للكوليسترول",
    description: "مثبط HMG-CoA reductase - يستخدم لخفض الكوليسترول والدهون الثلاثية",
    drugInteractions: [
      { drugId: "4", severity: "moderate", description: "زيادة طفيفة في تركيز السيمفاستاتين" },
      { drugId: "16", severity: "severe", description: "يزيد خطر انحلال العضلات (رابدوميوليسس)" },
      { drugId: "27", severity: "severe", description: "يزيد خطر الاعتلال العضلي وانحلال العضلات" },
      { drugId: "35", severity: "severe", description: "يمنع استقلاب السيمفاستاتين - يزيد خطر السمية" },
    ],
    diseaseInteractions: [
      { diseaseId: "d2", severity: "contraindicated", description: "ممنوع في أمراض الكبد النشطة" },
      { diseaseId: "d10", severity: "contraindicated", description: "ممنوع في الحمل" },
    ]
  },
  {
    id: "10", nameAr: "سبيرونولاكتون", nameEn: "Spironolactone", category: "Potassium-Sparing Diuretic", categoryAr: "مدر بول حافظ للبوتاسيوم",
    description: "مدر بول ومضاد للألدوستيرون - يستخدم في فشل القلب وارتفاع الضغط",
    drugInteractions: [
      { drugId: "6", severity: "severe", description: "يزيد خطر ارتفاع البوتاسيوم بشكل خطير" },
      { drugId: "7", severity: "severe", description: "يزيد خطر ارتفاع البوتاسيوم" },
      { drugId: "14", severity: "moderate", description: "يقلل فعالية مدرات البول" },
    ],
    diseaseInteractions: [
      { diseaseId: "d1", severity: "severe", description: "خطر ارتفاع البوتاسيوم في الفشل الكلوي" },
    ]
  },
  {
    id: "11", nameAr: "ديجوكسين", nameEn: "Digoxin", category: "Cardiac Glycoside", categoryAr: "جليكوسيد قلبي",
    description: "مقوي لعضلة القلب - يستخدم في فشل القلب والرجفان الأذيني",
    drugInteractions: [
      { drugId: "9", severity: "moderate", description: "يزيد تركيز الديجوكسين قليلاً" },
      { drugId: "12", severity: "severe", description: "نقص البوتاسيوم يزيد سمية الديجوكسين" },
      { drugId: "16", severity: "severe", description: "يزيد تركيز الديجوكسين بنسبة كبيرة" },
      { drugId: "10", severity: "moderate", description: "يزيد تركيز الديجوكسين" },
    ],
    diseaseInteractions: [
      { diseaseId: "d1", severity: "severe", description: "يزيد خطر سمية الديجوكسين في الفشل الكلوي" },
      { diseaseId: "d9", severity: "moderate", description: "يزيد حساسية عضلة القلب للديجوكسين" },
    ]
  },
  {
    id: "12", nameAr: "فوروسيميد", nameEn: "Furosemide", category: "Loop Diuretic", categoryAr: "مدر بول عروي",
    description: "مدر بول قوي - يستخدم في الوذمة وفشل القلب وارتفاع الضغط",
    drugInteractions: [
      { drugId: "11", severity: "severe", description: "نقص البوتاسيوم يزيد سمية الديجوكسين" },
      { drugId: "14", severity: "moderate", description: "يزيد خطر السمية الكلوية لمضادات الالتهاب" },
      { drugId: "33", severity: "moderate", description: "يقلل فعالية مدرات البول" },
    ],
    diseaseInteractions: [
      { diseaseId: "d1", severity: "moderate", description: "قد يحتاج لجرعات أعلى في الفشل الكلوي" },
    ]
  },
  {
    id: "13", nameAr: "أوميبرازول", nameEn: "Omeprazole", category: "PPI", categoryAr: "مثبط مضخة البروتون",
    description: "يقلل إفراز حمض المعدة - يستخدم لعلاج قرحة المعدة والارتجاع",
    drugInteractions: [
      { drugId: "3", severity: "moderate", description: "يقلل فعالية كلوبيدوجريل" },
      { drugId: "23", severity: "moderate", description: "يقلل امتصاص هرمون الغدة الدرقية" },
    ],
    diseaseInteractions: [
      { diseaseId: "d17", severity: "moderate", description: "الاستخدام الطويل يزيد خطر هشاشة العظام" },
    ]
  },
  {
    id: "14", nameAr: "إيبوبروفين", nameEn: "Ibuprofen", category: "NSAID", categoryAr: "مضاد التهاب غير ستيرويدي",
    description: "مسكن ومضاد للالتهابات وخافض للحرارة",
    drugInteractions: [
      { drugId: "1", severity: "severe", description: "يزيد خطر النزيف مع مضادات التخثر" },
      { drugId: "2", severity: "moderate", description: "يزيد خطر تهيج المعدة والنزيف" },
      { drugId: "6", severity: "moderate", description: "يقلل فعالية خفض الضغط ويزيد خطر الفشل الكلوي" },
      { drugId: "7", severity: "moderate", description: "يقلل فعالية خفض الضغط" },
      { drugId: "10", severity: "moderate", description: "يقلل تأثير مدر البول" },
    ],
    diseaseInteractions: [
      { diseaseId: "d1", severity: "severe", description: "يزيد خطر الفشل الكلوي - تجنب أو استخدم بحذر" },
      { diseaseId: "d3", severity: "moderate", description: "يزيد خطر احتباس السوائل وتفاقم فشل القلب" },
      { diseaseId: "d5", severity: "moderate", description: "يقلل فعالية أدوية الضغط" },
      { diseaseId: "d7", severity: "contraindicated", description: "ممنوع في القرحة الهضمية النشطة" },
      { diseaseId: "d18", severity: "severe", description: "يزيد خطر النزيف" },
    ]
  },
  {
    id: "15", nameAr: "دايكلوفيناك", nameEn: "Diclofenac", category: "NSAID", categoryAr: "مضاد التهاب غير ستيرويدي",
    description: "مسكن ومضاد للالتهابات - يستخدم لآلام المفاصل والعضلات",
    drugInteractions: [
      { drugId: "1", severity: "severe", description: "يزيد خطر النزيف بشكل كبير" },
      { drugId: "2", severity: "moderate", description: "يزيد خطر تهيج المعدة" },
      { drugId: "6", severity: "moderate", description: "يقلل فعالية خفض الضغط" },
      { drugId: "29", severity: "severe", description: "يزيد سمية الميثوتركسيت" },
    ],
    diseaseInteractions: [
      { diseaseId: "d1", severity: "severe", description: "يزيد خطر الفشل الكلوي" },
      { diseaseId: "d7", severity: "contraindicated", description: "ممنوع في القرحة الهضمية" },
      { diseaseId: "d10", severity: "contraindicated", description: "ممنوع في الثلث الثالث من الحمل" },
    ]
  },
  {
    id: "16", nameAr: "أميودارون", nameEn: "Amiodarone", category: "Antiarrhythmic", categoryAr: "مضاد لاضطراب النظم",
    description: "دواء قوي لعلاج عدم انتظام ضربات القلب",
    drugInteractions: [
      { drugId: "1", severity: "severe", description: "يزيد INR بشكل كبير - مراقبة دقيقة للوارفارين" },
      { drugId: "9", severity: "severe", description: "يزيد خطر انحلال العضلات (رابدوميوليسس)" },
      { drugId: "11", severity: "severe", description: "يزيد تركيز الديجوكسين بنسبة 50-100%" },
      { drugId: "27", severity: "severe", description: "يزيد سمية الفينيتوين" },
    ],
    diseaseInteractions: [
      { diseaseId: "d2", severity: "severe", description: "ضعف استقلاب الأميودارون في أمراض الكبد" },
      { diseaseId: "d9", severity: "moderate", description: "يزيد خطر اضطراب النظم في قصور الغدة" },
      { diseaseId: "d19", severity: "severe", description: "يزيد من إطالة QT - خطر تسرع القلب البطيني" },
    ]
  },
  {
    id: "17", nameAr: "كاربامازيبين", nameEn: "Carbamazepine", category: "Antiepileptic", categoryAr: "مضاد للصرع",
    description: "مضاد للصرع ومثبت للمزاج - يستخدم في الصرع والاضطراب ثنائي القطب",
    drugInteractions: [
      { drugId: "1", severity: "moderate", description: "يقلل تأثير الوارفارين (محفز إنزيمي)" },
      { drugId: "25", severity: "moderate", description: "يقلل فعالية موانع الحمل الفموية" },
      { drugId: "27", severity: "moderate", description: "يقلل تركيز الفينيتوين" },
    ],
    diseaseInteractions: [
      { diseaseId: "d2", severity: "severe", description: "يزيد سمية الكاربامازيبين في أمراض الكبد" },
      { diseaseId: "d10", severity: "contraindicated", description: "ممنوع في الحمل (تشوهات الأنبوب العصبي)" },
      { diseaseId: "d14", severity: "moderate", description: "قد يزيد النوبات عند التوقف المفاجئ" },
    ]
  },
  {
    id: "18", nameAr: "حمض الفالبرويك", nameEn: "Valproic Acid", category: "Antiepileptic", categoryAr: "مضاد للصرع",
    description: "مضاد للصرع ومثبت للمزاج - يستخدم في الصرع والصداع النصفي",
    drugInteractions: [
      { drugId: "1", severity: "moderate", description: "يقلل تأثير الوارفارين" },
      { drugId: "27", severity: "severe", description: "يزيد تركيز الفينيتوين الحر" },
    ],
    diseaseInteractions: [
      { diseaseId: "d2", severity: "contraindicated", description: "ممنوع في أمراض الكبد النشطة" },
      { diseaseId: "d10", severity: "contraindicated", description: "ممنوع في الحمل - خطر تشوهات" },
    ]
  },
  {
    id: "19", nameAr: "ثيوفيلين", nameEn: "Theophylline", category: "Bronchodilator", categoryAr: "موسع للشعب الهوائية",
    description: "موسع للشعب الهوائية - يستخدم في الربو ومرض الانسداد الرئوي المزمن",
    drugInteractions: [
      { drugId: "21", severity: "severe", description: "يزيد تركيز الثيوفيلين - خطر التسمم" },
      { drugId: "27", severity: "severe", description: "يزيد تركيز الثيوفيلين بشكل كبير" },
    ],
    diseaseInteractions: [
      { diseaseId: "d2", severity: "severe", description: "ضعف استقلاب الثيوفيلين في أمراض الكبد" },
      { diseaseId: "d3", severity: "moderate", description: "يزيد خطر السمية في فشل القلب" },
    ]
  },
  {
    id: "20", nameAr: "بريدنيزولون", nameEn: "Prednisolone", category: "Corticosteroid", categoryAr: "كورتيكوستيرويد",
    description: "كورتيكوستيرويد - مضاد للالتهابات ومثبط للمناعة",
    drugInteractions: [
      { drugId: "14", severity: "moderate", description: "يزيد خطر قرحة المعدة والنزيف" },
      { drugId: "33", severity: "moderate", description: "يزيد خطر قرحة المعدة" },
    ],
    diseaseInteractions: [
      { diseaseId: "d4", severity: "severe", description: "يزيد سكر الدم بشكل كبير" },
      { diseaseId: "d6", severity: "moderate", description: "قد يثبط محور الغدة الكظرية" },
      { diseaseId: "d7", severity: "severe", description: "يزيد خطر تفاقم قرحة المعدة" },
      { diseaseId: "d12", severity: "moderate", description: "يزيد ضغط العين - خطر الجلوكوما" },
      { diseaseId: "d17", severity: "severe", description: "الاستخدام الطويل يزيد هشاشة العظام" },
    ]
  },
  {
    id: "21", nameAr: "سيبروفلوكساسين", nameEn: "Ciprofloxacin", category: "Antibiotic (Fluoroquinolone)", categoryAr: "مضاد حيوي (فلوروكينولون)",
    description: "مضاد حيوي واسع المجال من مجموعة الفلوروكينولونات",
    drugInteractions: [
      { drugId: "1", severity: "severe", description: "يزيد INR والوارفارين بشكل كبير" },
      { drugId: "19", severity: "severe", description: "يزيد تركيز الثيوفيلين إلى مستويات سامة" },
      { drugId: "29", severity: "moderate", description: "يزيد سمية الميثوتركسيت" },
    ],
    diseaseInteractions: [
      { diseaseId: "d14", severity: "severe", description: "يخفض عتبة النوبات التشنجية" },
      { diseaseId: "d19", severity: "moderate", description: "يزيد خطر إطالة QT" },
      { diseaseId: "d10", severity: "moderate", description: "احتياط في الحمل" },
    ]
  },
  {
    id: "22", nameAr: "ميترونيدازول", nameEn: "Metronidazole", category: "Antibiotic (Nitroimidazole)", categoryAr: "مضاد حيوي (نيتروإيميدازول)",
    description: "مضاد للبكتيريا اللاهوائية والأوالي - يستخدم لالتهابات القولون والحوض",
    drugInteractions: [
      { drugId: "1", severity: "severe", description: "يزيد تأثير الوارفارين و INR بشكل كبير" },
    ],
    diseaseInteractions: [
      { diseaseId: "d2", severity: "moderate", description: "ضعف استقلاب الميترونيدازول في أمراض الكبد" },
      { diseaseId: "d10", severity: "contraindicated", description: "ممنوع في الثلث الأول من الحمل" },
    ]
  },
  {
    id: "23", nameAr: "ليفوثيروكسين", nameEn: "Levothyroxine", category: "Thyroid Hormone", categoryAr: "هرمون الغدة الدرقية",
    description: "هرمون الغدة الدرقية البديل - يستخدم لعلاج قصور الغدة الدرقية",
    drugInteractions: [
      { drugId: "13", severity: "moderate", description: "يقلل امتصاص الليفوثيروكسين" },
      { drugId: "30", severity: "moderate", description: "يقلل امتصاص الليفوثيروكسين" },
    ],
    diseaseInteractions: [
      { diseaseId: "d3", severity: "moderate", description: "يزيد عبء العمل على القلب في فشل القلب" },
      { diseaseId: "d17", severity: "moderate", description: "الجرعة الزائدة تزيد فقدان العظام" },
    ]
  },
  {
    id: "24", nameAr: "فلوكستين", nameEn: "Fluoxetine", category: "SSRI", categoryAr: "مثبط استرداد السيروتونين",
    description: "مضاد للاكتئاب من مثبطات استرداد السيروتونين الانتقائية",
    drugInteractions: [
      { drugId: "1", severity: "moderate", description: "يزيد خطر النزيف مع الوارفارين" },
      { drugId: "14", severity: "moderate", description: "يزيد خطر نزيف الجهاز الهضمي" },
    ],
    diseaseInteractions: [
      { diseaseId: "d2", severity: "moderate", description: "ضعف استقلاب الفلوكستين في أمراض الكبد" },
    ]
  },
  {
    id: "25", nameAr: "سيرترالين", nameEn: "Sertraline", category: "SSRI", categoryAr: "مثبط استرداد السيروتونين",
    description: "مضاد للاكتئاب من مثبطات استرداد السيروتونين",
    drugInteractions: [
      { drugId: "14", severity: "moderate", description: "يزيد خطر النزيف" },
      { drugId: "17", severity: "moderate", description: "تأثير مثبط خفيف على CYP3A4" },
    ],
    diseaseInteractions: [
      { diseaseId: "d2", severity: "moderate", description: "احتياط في أمراض الكبد" },
    ]
  },
  {
    id: "26", nameAr: "أميتريبتيلين", nameEn: "Amitriptyline", category: "TCA", categoryAr: "مضاد اكتئاب ثلاثي الحلقات",
    description: "مضاد للاكتئاب من مجموعة ثلاثية الحلقات - يستخدم أيضاً للألم العصبي",
    drugInteractions: [
      { drugId: "27", severity: "moderate", description: "يزيد تركيز الأميتريبتيلين" },
    ],
    diseaseInteractions: [
      { diseaseId: "d12", severity: "contraindicated", description: "يزيد ضغط العين في الجلوكوما" },
      { diseaseId: "d13", severity: "severe", description: "يزيد احتباس البول في تضخم البروستاتا" },
      { diseaseId: "d14", severity: "moderate", description: "يخفض عتبة النوبات التشنجية" },
      { diseaseId: "d19", severity: "severe", description: "يزيد خطر إطالة QT" },
    ]
  },
  {
    id: "27", nameAr: "فينيتوين", nameEn: "Phenytoin", category: "Antiepileptic", categoryAr: "مضاد للصرع",
    description: "مضاد للصرع - يستخدم للنوبات التوترية الرمعية",
    drugInteractions: [
      { drugId: "1", severity: "severe", description: "تفاعل دوائي معقد - زيادة أو نقصان تأثير الوارفارين" },
      { drugId: "9", severity: "severe", description: "يزيد خطر انحلال العضلات مع السيمفاستاتين" },
      { drugId: "16", severity: "severe", description: "يزيد تركيز الفينيتوين مع الأميودارون" },
      { drugId: "19", severity: "severe", description: "يزيد تركيز الثيوفيلين" },
      { drugId: "21", severity: "severe", description: "السيبروفلوكساسين يزيد تركيز الفينيتوين" },
    ],
    diseaseInteractions: [
      { diseaseId: "d2", severity: "severe", description: "ضعف استقلاب الفينيتوين في أمراض الكبد" },
      { diseaseId: "d10", severity: "contraindicated", description: "ممنوع في الحمل - تشوهات جنينية" },
    ]
  },
  {
    id: "28", nameAr: "آزويثرومايسين", nameEn: "Azithromycin", category: "Antibiotic (Macrolide)", categoryAr: "مضاد حيوي (ماكرولايد)",
    description: "مضاد حيوي من مجموعة الماكرولايد - يستخدم لالتهابات الجهاز التنفسي",
    drugInteractions: [
      { drugId: "1", severity: "moderate", description: "يزيد INR قليلاً" },
    ],
    diseaseInteractions: [
      { diseaseId: "d19", severity: "severe", description: "يزيد من إطالة QT - خطر عدم انتظام ضربات القلب" },
    ]
  },
  {
    id: "29", nameAr: "ميثوتركسيت", nameEn: "Methotrexate", category: "Antimetabolite / Immunosuppressant", categoryAr: "مثبط المناعة / مضاد للأيض",
    description: "مثبط للمناعة - يستخدم في الروماتويد والصدفية وبعض السرطانات",
    drugInteractions: [
      { drugId: "14", severity: "severe", description: "يقلل طرح الميثوتركسيت - سمية شديدة" },
      { drugId: "15", severity: "severe", description: "يزيد سمية الميثوتركسيت بشكل كبير" },
      { drugId: "21", severity: "moderate", description: "يزيد سمية الميثوتركسيت" },
    ],
    diseaseInteractions: [
      { diseaseId: "d1", severity: "severe", description: "يتراكم في الفشل الكلوي - سمية شديدة" },
      { diseaseId: "d2", severity: "contraindicated", description: "ممنوع في تليف الكبد النشط" },
      { diseaseId: "d10", severity: "contraindicated", description: "ممنوع في الحمل - تشوهات وإجهاض" },
      { diseaseId: "d22", severity: "moderate", description: "يزيد خطر تثبيط نخاع العظم في الذئبة" },
    ]
  },
  {
    id: "30", nameAr: "ألوبيورينول", nameEn: "Allopurinol", category: "Xanthine Oxidase Inhibitor", categoryAr: "خافض لحمض اليوريك",
    description: "يقلل إنتاج حمض اليوريك - يستخدم لعلاج النقرس والوقاية منه",
    drugInteractions: [
      { drugId: "1", severity: "severe", description: "يزيد تأثير الوارفارين" },
      { drugId: "23", severity: "moderate", description: "يزيد تركيز الآزوثيوبرين (إن وجد)" },
    ],
    diseaseInteractions: [
      { diseaseId: "d1", severity: "moderate", description: "يحتاج لتعديل الجرعة في الفشل الكلوي" },
      { diseaseId: "d8", severity: "moderate", description: "قد يزيد نوبات النقرس في بداية العلاج" },
    ]
  },
  {
    id: "31", nameAr: "سيلدينافيل", nameEn: "Sildenafil", category: "PDE5 Inhibitor", categoryAr: "مثبط PDE5",
    description: "لعلاج ضعف الانتصاب وارتفاع ضغط الشريان الرئوي",
    drugInteractions: [
      { drugId: "5", severity: "moderate", description: "يزيد خطر انخفاض ضغط الدم" },
      { drugId: "7", severity: "moderate", description: "يزيد خطر انخفاض ضغط الدم" },
    ],
    diseaseInteractions: [
      { diseaseId: "d3", severity: "severe", description: "احتياط في فشل القلب - مراقبة ضغط الدم" },
    ]
  },
  {
    id: "32", nameAr: "أوجمنتين", nameEn: "Augmentin", category: "Antibiotic (Penicillin)", categoryAr: "مضاد حيوي (بنسلين)",
    description: "أموكسيسيلين + حمض الكلافولانيك - مضاد حيوي واسع المجال",
    drugInteractions: [
      { drugId: "1", severity: "moderate", description: "قد يزيد INR" },
      { drugId: "29", severity: "moderate", description: "يقلل طرح الميثوتركسيت" },
    ],
    diseaseInteractions: [
      { diseaseId: "d1", severity: "moderate", description: "يحتاج تعديل الجرعة في الفشل الكلوي" },
    ]
  },
  {
    id: "33", nameAr: "نابروكسين", nameEn: "Naproxen", category: "NSAID", categoryAr: "مضاد التهاب غير ستيرويدي",
    description: "مسكن ومضاد التهاب طويل المفعول - لآلام المفاصل والتهاب المفاصل",
    drugInteractions: [
      { drugId: "1", severity: "severe", description: "يزيد خطر النزيف مع مضادات التخثر" },
      { drugId: "2", severity: "moderate", description: "يزيد خطر النزيف" },
      { drugId: "3", severity: "moderate", description: "يزيد خطر النزيف" },
      { drugId: "6", severity: "moderate", description: "يقلل فعالية خفض الضغط" },
      { drugId: "12", severity: "moderate", description: "يقلل فعالية مدرات البول" },
    ],
    diseaseInteractions: [
      { diseaseId: "d1", severity: "severe", description: "يزيد خطر الفشل الكلوي" },
      { diseaseId: "d7", severity: "contraindicated", description: "ممنوع في القرحة الهضمية" },
      { diseaseId: "d18", severity: "severe", description: "يزيد خطر النزيف" },
    ]
  },
  {
    id: "34", nameAr: "فلوكونازول", nameEn: "Fluconazole", category: "Antifungal (Azole)", categoryAr: "مضاد فطري (آزول)",
    description: "مضاد فطري واسع المجال - يستخدم للفطريات الجهازية والموضعية",
    drugInteractions: [
      { drugId: "1", severity: "severe", description: "يزيد INR والوارفارين بشكل كبير" },
      { drugId: "9", severity: "severe", description: "يمنع استقلاب السيمفاستاتين - خطر انحلال العضلات" },
      { drugId: "8", severity: "moderate", description: "يزيد تركيز الأتورفاستاتين" },
      { drugId: "27", severity: "severe", description: "يزيد تركيز الفينيتوين" },
    ],
    diseaseInteractions: [
      { diseaseId: "d2", severity: "severe", description: "ضعف استقلاب الفلوكونازول في أمراض الكبد" },
      { diseaseId: "d10", severity: "contraindicated", description: "ممنوع في الحمل - تشوهات (خاصة الجرعات العالية)" },
      { diseaseId: "d19", severity: "moderate", description: "يزيد من إطالة QT" },
    ]
  },
  {
    id: "35", nameAr: "أوميبرازول", nameEn: "Omeprazole", category: "PPI", categoryAr: "مثبط مضخة البروتون",
    description: "يقلل إفراز حمض المعدة - لعلاج القرحة والارتجاع ووقاية المعدة",
    drugInteractions: [
      { drugId: "3", severity: "moderate", description: "يقلل فعالية كلوبيدوجريل" },
      { drugId: "5", severity: "moderate", description: "يزيد تركيز الأملوديبين" },
      { drugId: "8", severity: "moderate", description: "قد يزيد تركيز الأتورفاستاتين" },
      { drugId: "9", severity: "severe", description: "يزيد تركيز السيمفاستاتين" },
    ],
    diseaseInteractions: [
      { diseaseId: "d17", severity: "moderate", description: "الاستخدام الطويل يزيد خطر هشاشة العظام" },
      { diseaseId: "d16", severity: "moderate", description: "الاستخدام الطويل قد يخفي أعراض سرطان المعدة" },
    ]
  },
  {
    id: "36", nameAr: "جلوكوفان", nameEn: "Glimepiride", category: "Sulfonylurea", categoryAr: "سلفونيليوريا",
    description: "خافض لسكر الدم من مجموعة السلفونيليوريا - يحفز البنكرياس لإفراز الأنسولين",
    drugInteractions: [
      { drugId: "14", severity: "moderate", description: "يزيد تأثير خفض السكر" },
      { drugId: "27", severity: "moderate", description: "يقلل فعالية خفض السكر" },
    ],
    diseaseInteractions: [
      { diseaseId: "d1", severity: "moderate", description: "يزيد خطر هبوط السكر في الفشل الكلوي" },
      { diseaseId: "d2", severity: "moderate", description: "احتياط في أمراض الكبد" },
    ]
  },
  {
    id: "37", nameAr: "مونتيلوكاست", nameEn: "Montelukast", category: "Leukotriene Receptor Antagonist", categoryAr: "مضاد مستقبلات الليوكوترين",
    description: "لعلاج الربو والتحكم في أعراض الحساسية الموسمية",
    drugInteractions: [],
    diseaseInteractions: [
      { diseaseId: "d6", severity: "moderate", description: "يستخدم في الربو - مراقبة الاستجابة" },
    ]
  },
  {
    id: "38", nameAr: "أتروفنت", nameEn: "Ipratropium", category: "Anticholinergic Bronchodilator", categoryAr: "موسع قصبي مضاد للكولين",
    description: "موسع للشعب الهوائية - يستخدم في الربو ومرض الانسداد الرئوي المزمن",
    drugInteractions: [],
    diseaseInteractions: [
      { diseaseId: "d12", severity: "moderate", description: "احتياط في الجلوكوما (يزيد ضغط العين)" },
      { diseaseId: "d13", severity: "moderate", description: "احتياط في تضخم البروستاتا" },
    ]
  },
  {
    id: "39", nameAr: "سولوبريد", nameEn: "Prednisolone", category: "Corticosteroid", categoryAr: "كورتيكوستيرويد",
    description: "كورتيكوستيرويد - لعلاج الحساسية الشديدة والالتهابات",
    drugInteractions: [
      { drugId: "14", severity: "moderate", description: "يزيد خطر قرحة المعدة" },
      { drugId: "20", severity: "moderate", description: "تأثير مضاف للكورتيكوستيرويدات" },
    ],
    diseaseInteractions: [
      { diseaseId: "d4", severity: "severe", description: "يزيد سكر الدم" },
      { diseaseId: "d7", severity: "severe", description: "يزيد خطر القرحة" },
      { diseaseId: "d17", severity: "severe", description: "يزيد هشاشة العظام" },
    ]
  },
  {
    id: "41",
    nameAr: "كويتيابين",
    nameEn: "Quetiapine",
    scientificNameAr: "كويتيابين فومارات",
    scientificNameEn: "Quetiapine Fumarate",
    activeIngredientAr: "كويتيابين",
    activeIngredientEn: "Quetiapine",
    category: "Antipsychotic",
    categoryAr: "مضاد ذهان",
    formEmoji: "💊",
    description: "Atypical antipsychotic used for schizophrenia, bipolar disorder, and major depressive disorder.",
    descriptionAr: "مضاد ذهان غير تقليدي يستخدم لعلاج الفصام والاضطراب ثنائي القطب والاكتئاب الشديد.",
    indicationEn: "Schizophrenia, bipolar disorder (manic/depressive episodes), major depressive disorder (adjunct), generalized anxiety disorder.",
    indicationAr: "الفصام، الاضطراب ثنائي القطب (نوبات الهوس/الاكتئاب)، الاكتئاب الشديد (كعلاج مساعد)، اضطراب القلق العام.",
    mechanismEn: "Blocks serotonin 5-HT2A and dopamine D2 receptors; also antagonizes histamine H1 and alpha1-adrenergic receptors.",
    mechanismAr: "يمنع مستقبلات السيروتونين 5-HT2A والدوبامين D2؛ كما يعادي مستقبلات الهيستامين H1 ومستقبلات ألفا-1 الأدرينالية.",
    sideEffectsEn: "Sedation, weight gain, dry mouth, dizziness, constipation, increased appetite, dyslipidemia.",
    sideEffectsAr: "تخدير، زيادة الوزن، جفاف الفم، دوار، إمساك، زيادة الشهية، اضطراب شحوم الدم.",
    dosageEn: "Starting 25-50 mg/day, up to 400-800 mg/day depending on indication. Immediate release tablets available in 25, 100, 200, 300 mg.",
    dosageAr: "الجرعة البدء 25-50 ملغ/يوم، حتى 400-800 ملغ/يوم حسب المؤشر. أقراص سريعة المفعول متوفرة بتركيز 25، 100، 200، 300 ملغ.",
    pregnancyEn: "Category C. Use only if potential benefit justifies risk to fetus; may cause neonatal withdrawal syndrome.",
    pregnancyAr: "الفئة C. يستخدم فقط إذا كانت الفائدة المحتملة تبرر الخطر على الجنين؛ قد يسبب متلازمة انسحاب حديثي الولادة.",
    breastfeedingEn: "Excreted in breast milk; monitor infant for sedation and poor feeding. Avoid if possible.",
    breastfeedingAr: "يفرز في حليب الثدي؛ راقب الرضيع للتخدير وضعف التغذية. تجنبه إن أمكن.",
    manufacturerEn: "AstraZeneca (Seroquel)",
    manufacturerAr: "أسترازينيكا (سيروكويل)",
    prices: [
      { form: "Seroquel 200 mg 30 tabs", formEn: "Seroquel 200 mg 30 tabs", price: 90, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "23", severity: "severe", description: "CNS depressants (benzodiazepines, alcohol) increase sedation and respiratory depression risk." },
      { drugId: "12", severity: "moderate", description: "Ketoconazole and other CYP3A4 inhibitors increase quetiapine levels." },
      { drugId: "15", severity: "moderate", description: "Carbamazepine induces CYP3A4, reducing quetiapine plasma concentration." }
    ],
    diseaseInteractions: [
      { diseaseId: "d7", severity: "contraindicated", description: "Contraindicated in patients with severe CNS depression or coma." },
      { diseaseId: "d15", severity: "severe", description: "May cause QT prolongation; use with caution in cardiac disease." },
      { diseaseId: "d19", severity: "moderate", description: "May worsen hepatic impairment; monitor liver function." }
    ]
  },
  {
    id: "42",
    nameAr: "ديازيبام",
    nameEn: "Diazepam",
    scientificNameAr: "ديازيبام",
    scientificNameEn: "Diazepam",
    activeIngredientAr: "ديازيبام",
    activeIngredientEn: "Diazepam",
    category: "Benzodiazepine",
    categoryAr: "بنزوديازيبين",
    formEmoji: "💊",
    description: "Long-acting benzodiazepine with anxiolytic, sedative, muscle relaxant, and anticonvulsant properties.",
    descriptionAr: "بنزوديازيبين طويل المفعول له خصائص مزيلة للقلق، مهدئة، مرخية للعضلات، ومضادة للتشنجات.",
    indicationEn: "Anxiety disorders, alcohol withdrawal, status epilepticus, muscle spasms, preoperative sedation.",
    indicationAr: "اضطرابات القلق، انسحاب الكحول، الصرع المستمر، تشنجات العضلات، التخدير قبل الجراحة.",
    mechanismEn: "Enhances GABA-A receptor activity by increasing the frequency of chloride channel opening, leading to neuronal inhibition.",
    mechanismAr: "يعزز نشاط مستقبل GABA-A عن طريق زيادة تواتر فتح قنوات الكلوريد، مما يؤدي إلى تثبيط عصبي.",
    sideEffectsEn: "Drowsiness, ataxia, dizziness, fatigue, muscle weakness, confusion, dependence with long-term use.",
    sideEffectsAr: "نعاس، ترنح، دوار، إرهاق، ضعف عضلي، ارتباك، اعتماد مع الاستخدام الطويل.",
    dosageEn: "2-10 mg 2-4 times daily. Maximum 40 mg/day. Tablets available as 2, 5, 10 mg.",
    dosageAr: "2-10 ملغ 2-4 مرات يومياً. الحد الأقصى 40 ملغ/يوم. أقراص متوفرة بتركيز 2، 5، 10 ملغ.",
    pregnancyEn: "Category D. Avoid in first and third trimesters; risk of congenital malformations and neonatal withdrawal.",
    pregnancyAr: "الفئة D. يتجنب في الثلث الأول والثالث من الحمل؛ خطر التشوهات الخلقية وانسحاب حديثي الولادة.",
    breastfeedingEn: "Excreted in breast milk; may cause sedation and poor feeding in infant. Avoid chronic use.",
    breastfeedingAr: "يفرز في حليب الثدي؛ قد يسبب تخديراً وضعفاً في التغذية للرضيع. تجنب الاستخدام المزمن.",
    manufacturerEn: "Roche (Valium)",
    manufacturerAr: "روش (فاليوم)",
    prices: [
      { form: "Valium 5 mg 20 tabs", formEn: "Valium 5 mg 20 tabs", price: 15, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "23", severity: "severe", description: "Alcohol and other CNS depressants potentiate sedation and respiratory depression." },
      { drugId: "22", severity: "moderate", description: "Cimetidine inhibits diazepam metabolism, increasing its plasma levels." },
      { drugId: "46", severity: "moderate", description: "Carbamazepine may decrease diazepam levels via CYP3A4 induction." }
    ],
    diseaseInteractions: [
      { diseaseId: "d18", severity: "severe", description: "May cause paradoxical excitation in elderly patients." },
      { diseaseId: "d8", severity: "contraindicated", description: "Contraindicated in severe respiratory insufficiency." },
      { diseaseId: "d19", severity: "moderate", description: "Hepatic impairment reduces clearance; use lower doses." }
    ]
  },
  {
    id: "43",
    nameAr: "أميتريبتيلين",
    nameEn: "Amitriptyline",
    scientificNameAr: "أميتريبتيلين هيدروكلوريد",
    scientificNameEn: "Amitriptyline Hydrochloride",
    activeIngredientAr: "أميتريبتيلين",
    activeIngredientEn: "Amitriptyline",
    category: "Tricyclic Antidepressant (TCA)",
    categoryAr: "مضاد اكتئاب ثلاثي الحلقات",
    formEmoji: "💊",
    description: "Tricyclic antidepressant used for major depression, neuropathic pain, and migraine prophylaxis.",
    descriptionAr: "مضاد اكتئاب ثلاثي الحلقات يستخدم للاكتئاب الشديد، الألم العصبي، والوقاية من الصداع النصفي.",
    indicationEn: "Major depressive disorder, neuropathic pain, fibromyalgia, migraine prophylaxis, nocturnal enuresis in children.",
    indicationAr: "اضطراب الاكتئاب الشديد، الألم العصبي، الفيبروميالغيا، الوقاية من الصداع النصفي، التبول اللاإرادي الليلي عند الأطفال.",
    mechanismEn: "Inhibits reuptake of serotonin and norepinephrine; also blocks histamine H1, alpha1-adrenergic, and muscarinic receptors.",
    mechanismAr: "يثبط إعادة امتصاص السيروتونين والنورإبينفرين؛ كما يمنع مستقبلات الهيستامين H1 ومستقبلات ألفا-1 الأدرينالية والموسكارينية.",
    sideEffectsEn: "Dry mouth, blurred vision, constipation, urinary retention, sedation, weight gain, orthostatic hypotension, cardiac arrhythmia.",
    sideEffectsAr: "جفاف الفم، تشوش الرؤية، إمساك، احتباس البول، تخدير، زيادة الوزن، انخفاض ضغط الدم الانتصابي، عدم انتظام ضربات القلب.",
    dosageEn: "Starting 25-50 mg at bedtime, up to 150-300 mg/day. Tablets: 10, 25, 50, 75 mg.",
    dosageAr: "الجرعة البدء 25-50 ملغ عند النوم، حتى 150-300 ملغ/يوم. أقراص: 10، 25، 50، 75 ملغ.",
    pregnancyEn: "Category C. Use only if clearly needed; may cause neonatal withdrawal if used near term.",
    pregnancyAr: "الفئة C. يستخدم فقط إذا لزم الأمر؛ قد يسبب انسحاب حديثي الولادة إذا استخدم قرب نهاية الحمل.",
    breastfeedingEn: "Excreted in breast milk in low amounts; monitor infant for drowsiness. Generally considered compatible.",
    breastfeedingAr: "يفرز في حليب الثدي بكميات قليلة؛ راقب الرضيع للنعاس. يعتبر متوافقاً عموماً.",
    manufacturerEn: "Sigma Pharmaceutical Industries",
    manufacturerAr: "شركة سيجما للصناعات الدوائية",
    prices: [
      { form: "Amitriptyline 25 mg 30 tabs", formEn: "Amitriptyline 25 mg 30 tabs", price: 20, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "12", severity: "severe", description: "MAOIs may cause hypertensive crisis; avoid concurrent use." },
      { drugId: "56", severity: "moderate", description: "May decrease antihypertensive effect of clonidine." },
      { drugId: "23", severity: "moderate", description: "CNS depressants increase sedative effects." }
    ],
    diseaseInteractions: [
      { diseaseId: "d15", severity: "severe", description: "May cause QT prolongation; contraindicated in recent myocardial infarction." },
      { diseaseId: "d17", severity: "moderate", description: "May worsen angle-closure glaucoma due to anticholinergic effects." },
      { diseaseId: "d20", severity: "moderate", description: "May worsen prostatic hypertrophy due to urinary retention risk." }
    ]
  },
  {
    id: "44",
    nameAr: "سيرترالين",
    nameEn: "Sertraline",
    scientificNameAr: "سيرترالين هيدروكلوريد",
    scientificNameEn: "Sertraline Hydrochloride",
    activeIngredientAr: "سيرترالين",
    activeIngredientEn: "Sertraline",
    category: "SSRI",
    categoryAr: "مثبط امتصاص السيروتونين الانتقائي",
    formEmoji: "💊",
    description: "Selective serotonin reuptake inhibitor used for depression, anxiety, OCD, PTSD, and panic disorder.",
    descriptionAr: "مثبط انتقائي لامتصاص السيروتونين يستخدم للاكتئاب والقلق والوسواس القهري واضطراب ما بعد الصدمة واضطراب الهلع.",
    indicationEn: "Major depressive disorder, obsessive-compulsive disorder, panic disorder, social anxiety disorder, PTSD, PMDD.",
    indicationAr: "اضطراب الاكتئاب الشديد، اضطراب الوسواس القهري، اضطراب الهلع، اضطراب القلق الاجتماعي، اضطراب ما بعد الصدمة، اضطراب ما قبل الحيض المزعج.",
    mechanismEn: "Selectively inhibits serotonin reuptake at the presynaptic transporter, increasing serotonin availability in the synaptic cleft.",
    mechanismAr: "يثبط بشكل انتقائي إعادة امتصاص السيروتونين عند الناقل قبل المشبكي، مما يزيد من توفر السيروتونين في الشق المشبكي.",
    sideEffectsEn: "Nausea, diarrhea, insomnia, sexual dysfunction, dry mouth, dizziness, fatigue, weight changes.",
    sideEffectsAr: "غثيان، إسهال، أرق، ضعف جنسي، جفاف الفم، دوار، إرهاق، تغيرات في الوزن.",
    dosageEn: "Starting 50 mg/day, up to 200 mg/day. Tablets: 50, 100 mg.",
    dosageAr: "الجرعة البدء 50 ملغ/يوم، حتى 200 ملغ/يوم. أقراص: 50، 100 ملغ.",
    pregnancyEn: "Category C. May increase risk of persistent pulmonary hypertension in newborn if used after 20 weeks.",
    pregnancyAr: "الفئة C. قد يزيد خطر ارتفاع ضغط الدم الرئوي المستمر عند المولود إذا استخدم بعد 20 أسبوعاً.",
    breastfeedingEn: "Excreted in breast milk in low levels; generally considered safe. Monitor infant for irritability.",
    breastfeedingAr: "يفرز في حليب الثدي بمستويات منخفضة؛ يعتبر آمناً عموماً. راقب الرضيع للتهيج.",
    manufacturerEn: "Pfizer (Zoloft / Lustral)",
    manufacturerAr: "فايزر (زولوفت / لوسترال)",
    prices: [
      { form: "Zoloft 50 mg 30 tabs", formEn: "Zoloft 50 mg 30 tabs", price: 60, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "12", severity: "severe", description: "MAOIs may cause serotonin syndrome; avoid within 14 days." },
      { drugId: "43", severity: "severe", description: "Other serotonergic drugs increase serotonin syndrome risk." },
      { drugId: "33", severity: "moderate", description: "NSAIDs and anticoagulants increase bleeding risk due to platelet inhibition." }
    ],
    diseaseInteractions: [
      { diseaseId: "d19", severity: "moderate", description: "Hepatic impairment reduces clearance; use lower doses." },
      { diseaseId: "d12", severity: "moderate", description: "May cause hyponatremia in elderly or volume-depleted patients." },
      { diseaseId: "d4", severity: "moderate", description: "May worsen bipolar mania; screen for bipolar before treating depression." }
    ]
  },
  {
    id: "45",
    nameAr: "فلوكونازول",
    nameEn: "Fluconazole",
    scientificNameAr: "فلوكونازول",
    scientificNameEn: "Fluconazole",
    activeIngredientAr: "فلوكونازول",
    activeIngredientEn: "Fluconazole",
    category: "Antifungal",
    categoryAr: "مضاد فطريات",
    formEmoji: "💊",
    description: "Triazole antifungal used for systemic and superficial fungal infections, including vaginal candidiasis.",
    descriptionAr: "مضاد فطريات ثلاثي الأزول يستخدم للعدوى الفطرية الجهازية والسطحية، بما في ذلك داء المبيضات المهبلي.",
    indicationEn: "Vaginal candidiasis, oropharyngeal candidiasis, cryptococcal meningitis, candidemia, candiduria.",
    indicationAr: "داء المبيضات المهبلي، داء المبيضات الفموي البلعومي، التهاب السحايا بالمستخفيات، فطريات الدم، فطريات البول.",
    mechanismEn: "Inhibits fungal cytochrome P450 14-alpha-demethylase, preventing conversion of lanosterol to ergosterol, damaging fungal cell membrane.",
    mechanismAr: "يثبط إنزيم السيتوكروم P450 14-ألفا-ديميثيلاز الفطري، مما يمنع تحويل اللانوستيرول إلى إرغوستيرول، مما يتلف غشاء الخلية الفطرية.",
    sideEffectsEn: "Headache, nausea, abdominal pain, diarrhea, rash, elevated liver enzymes, QT prolongation.",
    sideEffectsAr: "صداع، غثيان، ألم بطني، إسهال، طفح جلدي، ارتفاع إنزيمات الكبد، تطويل QT.",
    dosageEn: "Vaginal candidiasis: 150 mg single dose. Systemic: 200-400 mg daily. Capsules: 50, 100, 150, 200 mg.",
    dosageAr: "داء المبيضات المهبلي: جرعة واحدة 150 ملغ. جهازي: 200-400 ملغ يومياً. كبسولات: 50، 100، 150، 200 ملغ.",
    pregnancyEn: "Category D. Avoid in first trimester; higher doses associated with congenital malformations.",
    pregnancyAr: "الفئة D. يتجنب في الثلث الأول من الحمل؛ الجرعات العالية مرتبطة بتشوهات خلقية.",
    breastfeedingEn: "Excreted in breast milk; manufacturer recommends caution. Single 150 mg dose likely compatible.",
    breastfeedingAr: "يفرز في حليب الثدي؛ توصي الشركة المصنعة بالحذر. الجرعة الواحدة 150 ملغ متوافقة على الأرجح.",
    manufacturerEn: "Pfizer (Diflucan)",
    manufacturerAr: "فايزر (ديفلوكان)",
    prices: [
      { form: "Diflucan 150 mg 1 cap", formEn: "Diflucan 150 mg 1 cap", price: 40, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "25", severity: "severe", description: "Warfarin: fluconazole increases INR and bleeding risk." },
      { drugId: "60", severity: "moderate", description: "Omeprazole: increased omeprazole levels via CYP2C19 inhibition." },
      { drugId: "41", severity: "moderate", description: "Quetiapine: fluconazole inhibits CYP3A4, increasing quetiapine levels." }
    ],
    diseaseInteractions: [
      { diseaseId: "d15", severity: "severe", description: "QT prolongation risk; avoid in patients with pre-existing QT prolongation." },
      { diseaseId: "d19", severity: "severe", description: "Hepatic impairment may require dose reduction; monitor LFTs." },
      { diseaseId: "d12", severity: "moderate", description: "Renal impairment requires dose adjustment." }
    ]
  },
  {
    id: "46",
    nameAr: "كاربامازيبين",
    nameEn: "Carbamazepine",
    scientificNameAr: "كاربامازيبين",
    scientificNameEn: "Carbamazepine",
    activeIngredientAr: "كاربامازيبين",
    activeIngredientEn: "Carbamazepine",
    category: "Antiepileptic",
    categoryAr: "مضاد صرع",
    formEmoji: "💊",
    description: "Anticonvulsant and mood stabilizer used for epilepsy, trigeminal neuralgia, and bipolar disorder.",
    descriptionAr: "مضاد تشنج ومثبت مزاج يستخدم للصرع وألم العصب الثلاثي التوائم والاضطراب ثنائي القطب.",
    indicationEn: "Partial and generalized tonic-clonic seizures, trigeminal neuralgia, bipolar disorder (manic episodes), neuropathic pain.",
    indicationAr: "النوبات الجزئية والنوبات التوترية الرمعية العامة، ألم العصب الثلاثي التوائم، الاضطراب ثنائي القطب (نوبات الهوس)، الألم العصبي.",
    mechanismEn: "Stabilizes neuronal membranes by blocking voltage-gated sodium channels, reducing repetitive firing of action potentials.",
    mechanismAr: "يثبت الأغشية العصبية عن طريق منع قنوات الصوديوم ذات البوابات الجهدية، مما يقلل الإطلاق المتكرر لجهد الفعل.",
    sideEffectsEn: "Dizziness, drowsiness, ataxia, blurred vision, nausea, hyponatremia, rash, Stevens-Johnson syndrome (rare).",
    sideEffectsAr: "دوار، نعاس، ترنح، تشوش الرؤية، غثيان، نقص صوديوم الدم، طفح جلدي، متلازمة ستيفنز جونسون (نادر).",
    dosageEn: "Starting 200-400 mg/day, up to 1200 mg/day. Tablets: 200 mg (CR and immediate release).",
    dosageAr: "الجرعة البدء 200-400 ملغ/يوم، حتى 1200 ملغ/يوم. أقراص: 200 ملغ (ممتد المفعول وسريع المفعول).",
    pregnancyEn: "Category D. Associated with neural tube defects; use lowest effective dose with folic acid supplementation.",
    pregnancyAr: "الفئة D. مرتبط بعيوب الأنبوب العصبي؛ استخدم أقل جرعة فعالة مع مكملات حمض الفوليك.",
    breastfeedingEn: "Excreted in breast milk; monitor infant for drowsiness and poor feeding. Generally compatible.",
    breastfeedingAr: "يفرز في حليب الثدي؛ راقب الرضيع للنعاس وضعف التغذية. متوافق عموماً.",
    manufacturerEn: "Novartis (Tegretol)",
    manufacturerAr: "نوفارتيس (تيجريتول)",
    prices: [
      { form: "Tegretol 200 mg 50 tabs", formEn: "Tegretol 200 mg 50 tabs", price: 35, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "23", severity: "severe", description: "CNS depressants increase sedation and dizziness." },
      { drugId: "49", severity: "severe", description: "Theophylline: carbamazepine induces theophylline metabolism, reducing efficacy." },
      { drugId: "41", severity: "moderate", description: "Carbamazepine induces CYP3A4, reducing quetiapine levels." }
    ],
    diseaseInteractions: [
      { diseaseId: "d12", severity: "moderate", description: "May worsen hyponatremia; monitor serum sodium in renal disease." },
      { diseaseId: "d19", severity: "moderate", description: "Hepatic impairment may require dose adjustment; monitor LFTs." },
      { diseaseId: "d3", severity: "severe", description: "Avoid in patients with history of bone marrow suppression." }
    ]
  },
  {
    id: "47",
    nameAr: "حمض الفالبرويك",
    nameEn: "Valproic Acid",
    scientificNameAr: "حمض الفالبرويك / فالبوروات الصوديوم",
    scientificNameEn: "Valproic Acid / Sodium Valproate",
    activeIngredientAr: "فالبوروات الصوديوم",
    activeIngredientEn: "Sodium Valproate",
    category: "Antiepileptic",
    categoryAr: "مضاد صرع",
    formEmoji: "💊",
    description: "Anticonvulsant and mood stabilizer effective for epilepsy, bipolar disorder, and migraine prophylaxis.",
    descriptionAr: "مضاد تشنج ومثبت مزاج فعال للصرع والاضطراب ثنائي القطب والوقاية من الصداع النصفي.",
    indicationEn: "Generalized and partial seizures, bipolar disorder (manic episodes), migraine prophylaxis, neuropathic pain.",
    indicationAr: "النوبات العامة والجزئية، الاضطراب ثنائي القطب (نوبات الهوس)، الوقاية من الصداع النصفي، الألم العصبي.",
    mechanismEn: "Increases GABA levels by inhibiting GABA transaminase; also blocks voltage-gated sodium channels and T-type calcium channels.",
    mechanismAr: "يزيد مستويات GABA عن طريق تثبيط إنزيم GABA ترانس أميناز؛ كما يمنع قنوات الصوديوم ذات البوابات الجهدية وقنوات الكالسيوم من النوع T.",
    sideEffectsEn: "Nausea, weight gain, tremors, hair loss, thrombocytopenia, hepatotoxicity, pancreatitis, sedation.",
    sideEffectsAr: "غثيان، زيادة الوزن، رعاش، تساقط الشعر، نقص الصفيحات، سمية كبدية، التهاب البنكرياس، تخدير.",
    dosageEn: "Starting 400-600 mg/day, up to 2500 mg/day. Tablets: 200, 500 mg; syrup available.",
    dosageAr: "الجرعة البدء 400-600 ملغ/يوم، حتى 2500 ملغ/يوم. أقراص: 200، 500 ملغ؛ شراب متوفر.",
    pregnancyEn: "Category D. HIGHEST TERATOGENICITY among antiepileptics (neural tube defects). AVOID in pregnancy if possible.",
    pregnancyAr: "الفئة D. أعلى مسخية بين مضادات الصرع (عيوب الأنبوب العصبي). يتجنب في الحمل إن أمكن.",
    breastfeedingEn: "Excreted in breast milk at low levels; generally considered compatible. Monitor infant for jaundice.",
    breastfeedingAr: "يفرز في حليب الثدي بمستويات منخفضة؛ يعتبر متوافقاً عموماً. راقب الرضيع لليرقان.",
    manufacturerEn: "Sanofi (Depakine / Depakote)",
    manufacturerAr: "سانوفي (ديباكين / ديباكوت)",
    prices: [
      { form: "Depakine 500 mg 30 tabs", formEn: "Depakine 500 mg 30 tabs", price: 40, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "35", severity: "severe", description: "Aspirin displaces valproate from protein binding, increasing free valproate levels and toxicity." },
      { drugId: "46", severity: "moderate", description: "Carbamazepine induces valproate metabolism, reducing valproate efficacy." },
      { drugId: "43", severity: "moderate", description: "Amitriptyline increases valproate levels; monitor for toxicity." }
    ],
    diseaseInteractions: [
      { diseaseId: "d19", severity: "contraindicated", description: "Contraindicated in severe hepatic impairment or active liver disease." },
      { diseaseId: "d3", severity: "severe", description: "May cause thrombocytopenia; monitor platelet counts." },
      { diseaseId: "d10", severity: "moderate", description: "Pancreatitis risk; avoid in patients with history of pancreatitis." }
    ]
  },
  {
    id: "48",
    nameAr: "فينيتوين",
    nameEn: "Phenytoin",
    scientificNameAr: "فينيتوين صوديوم",
    scientificNameEn: "Phenytoin Sodium",
    activeIngredientAr: "فينيتوين",
    activeIngredientEn: "Phenytoin",
    category: "Antiepileptic",
    categoryAr: "مضاد صرع",
    formEmoji: "💊",
    description: "Hydantoin anticonvulsant used for generalized tonic-clonic and partial seizures, and status epilepticus.",
    descriptionAr: "مضاد تشنج من مشتقات الهيدانتوين يستخدم للنوبات التوترية الرمعية العامة والجزئية والصرع المستمر.",
    indicationEn: "Generalized tonic-clonic seizures, partial seizures, status epilepticus (IV), prevention of seizures during neurosurgery.",
    indicationAr: "النوبات التوترية الرمعية العامة، النوبات الجزئية، الصرع المستمر (وريدياً)، الوقاية من النوبات أثناء جراحة الأعصاب.",
    mechanismEn: "Blocks voltage-gated sodium channels, stabilizing neuronal membranes and reducing post-tetanic potentiation.",
    mechanismAr: "يمنع قنوات الصوديوم ذات البوابات الجهدية، مما يثبت الأغشية العصبية ويقلل التقوية بعد التكزز.",
    sideEffectsEn: "Nystagmus, ataxia, dizziness, drowsiness, gingival hyperplasia, hirsutism, megaloblastic anemia, lymphadenopathy.",
    sideEffectsAr: "رأرأة، ترنح، دوار، نعاس، تضخم اللثة، كثرة الشعر، فقر الدم كبير الكريات، تضخم العقد اللمفاوية.",
    dosageEn: "Starting 200-400 mg/day, up to 600 mg/day. Capsules: 100 mg; suspension 125 mg/5ml.",
    dosageAr: "الجرعة البدء 200-400 ملغ/يوم، حتى 600 ملغ/يوم. كبسولات: 100 ملغ؛ معلق 125 ملغ/5 مل.",
    pregnancyEn: "Category D. Associated with fetal hydantoin syndrome (cleft palate, heart defects, microcephaly).",
    pregnancyAr: "الفئة D. مرتبط بمتلازمة الهيدانتوين الجنينية (شق الحنك، عيوب القلب، صغر الرأس).",
    breastfeedingEn: "Excreted in breast milk in low amounts; generally considered compatible with breastfeeding.",
    breastfeedingAr: "يفرز في حليب الثدي بكميات منخفضة؛ يعتبر متوافقاً مع الرضاعة الطبيعية عموماً.",
    manufacturerEn: "Sigma Pharmaceutical Industries",
    manufacturerAr: "شركة سيجما للصناعات الدوائية",
    prices: [
      { form: "Phenytoin 100 mg 30 caps", formEn: "Phenytoin 100 mg 30 caps", price: 20, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "25", severity: "severe", description: "Warfarin: phenytoin induces warfarin metabolism, reducing anticoagulant effect." },
      { drugId: "57", severity: "moderate", description: "Folic acid supplementation may decrease phenytoin levels." },
      { drugId: "45", severity: "moderate", description: "Fluconazole inhibits CYP2C9, increasing phenytoin levels and toxicity." }
    ],
    diseaseInteractions: [
      { diseaseId: "d19", severity: "severe", description: "Hepatic impairment significantly reduces phenytoin clearance; monitor levels." },
      { diseaseId: "d11", severity: "moderate", description: "Hypoalbuminemia increases free phenytoin fraction; monitor free levels." },
      { diseaseId: "d9", severity: "moderate", description: "May cause megaloblastic anemia due to folate deficiency; monitor CBC." }
    ]
  },
  {
    id: "49",
    nameAr: "ثيوفيلين",
    nameEn: "Theophylline",
    scientificNameAr: "ثيوفيلين",
    scientificNameEn: "Theophylline",
    activeIngredientAr: "ثيوفيلين",
    activeIngredientEn: "Theophylline",
    category: "Bronchodilator",
    categoryAr: "موسع قصبات",
    formEmoji: "💊",
    description: "Xanthine bronchodilator used for asthma and COPD maintenance therapy.",
    descriptionAr: "موسع قصبات من مجموعة الزانثين يستخدم للعلاج الوقائي للربو ومرض الانسداد الرئوي المزمن.",
    indicationEn: "Asthma (maintenance), COPD, neonatal apnea, chronic bronchitis.",
    indicationAr: "الربو (العلاج الوقائي)، مرض الانسداد الرئوي المزمن، انقطاع النفس عند حديثي الولادة، التهاب الشعب الهوائية المزمن.",
    mechanismEn: "Inhibits phosphodiesterase III/IV, increasing cAMP levels; also blocks adenosine A1/A2 receptors, causing bronchodilation.",
    mechanismAr: "يثبط فوسفودايستيراز III/IV، مما يزيد مستويات cAMP؛ ويمنع مستقبلات الأدينوزين A1/A2، مما يسبب توسع القصبات.",
    sideEffectsEn: "Nausea, vomiting, headache, insomnia, tachycardia, palpitations, seizures (at high levels), tremor.",
    sideEffectsAr: "غثيان، قيء، صداع، أرق، تسرع القلب، خفقان، تشنجات (عند المستويات العالية)، رعاش.",
    dosageEn: "Starting 200-400 mg/day, up to 900 mg/day. SR tablets: 200, 300, 400 mg.",
    dosageAr: "الجرعة البدء 200-400 ملغ/يوم، حتى 900 ملغ/يوم. أقراص ممتدة المفعول: 200، 300، 400 ملغ.",
    pregnancyEn: "Category C. Use only if clearly needed; monitor levels closely as metabolism changes in pregnancy.",
    pregnancyAr: "الفئة C. يستخدم فقط إذا لزم الأمر؛ راقب المستويات عن كثب حيث يتغير الأيض في الحمل.",
    breastfeedingEn: "Excreted in breast milk; may cause infant irritability. Monitor infant and time feedings away from doses.",
    breastfeedingAr: "يفرز في حليب الثدي؛ قد يسبب تهيج الرضيع. راقب الرضيع وحدد مواعيد الرضاعة بعيداً عن الجرعات.",
    manufacturerEn: "Sanofi (Theotrim / Uniphyllin)",
    manufacturerAr: "سانوفي (ثيوتريم / يونيفيلين)",
    prices: [
      { form: "Theotrim SR 300 mg 30 tabs", formEn: "Theotrim SR 300 mg 30 tabs", price: 25, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "46", severity: "severe", description: "Carbamazepine induces theophylline metabolism, reducing efficacy." },
      { drugId: "45", severity: "moderate", description: "Fluconazole inhibits theophylline metabolism, increasing toxicity risk." },
      { drugId: "23", severity: "moderate", description: "Cigarette smoking induces theophylline clearance; higher doses may be needed." }
    ],
    diseaseInteractions: [
      { diseaseId: "d15", severity: "severe", description: "May cause tachycardia and arrhythmias in patients with cardiac disease." },
      { diseaseId: "d19", severity: "moderate", description: "Hepatic impairment reduces clearance; reduce dose and monitor levels." },
      { diseaseId: "d21", severity: "moderate", description: "Seizure threshold is lowered; use with caution in epilepsy." }
    ]
  },
  {
    id: "50",
    nameAr: "مونتيلوكاست",
    nameEn: "Montelukast",
    scientificNameAr: "مونتيلوكاست صوديوم",
    scientificNameEn: "Montelukast Sodium",
    activeIngredientAr: "مونتيلوكاست",
    activeIngredientEn: "Montelukast",
    category: "Leukotriene Receptor Antagonist",
    categoryAr: "مضاد مستقبلات الليكوترين",
    formEmoji: "💊",
    description: "Leukotriene receptor antagonist used for asthma maintenance and allergic rhinitis.",
    descriptionAr: "مضاد مستقبلات الليكوترين يستخدم للعلاج الوقائي للربو والتهاب الأنف التحسسي.",
    indicationEn: "Prophylaxis of asthma (mild to persistent), exercise-induced bronchoconstriction, allergic rhinitis.",
    indicationAr: "الوقاية من الربو (الخفيف إلى المستمر)، تضيق القصبات الناجم عن التمرين، التهاب الأنف التحسسي.",
    mechanismEn: "Selectively blocks leukotriene LTRA (cysLT1) receptors, inhibiting leukotriene-mediated bronchoconstriction, inflammation, and mucus production.",
    mechanismAr: "يمنع بشكل انتقائي مستقبلات الليكوترين LTRA (cysLT1)، مما يثبط تضيق القصبات والالتهاب وإنتاج المخاط بوساطة الليكوترين.",
    sideEffectsEn: "Headache, abdominal pain, cough, dyspepsia, pharyngitis, behavioral changes (rare), eosinophilic granulomatosis (rare).",
    sideEffectsAr: "صداع، ألم بطني، سعال، عسر هضم، التهاب البلعوم، تغيرات سلوكية (نادر)، الورم الحبيبي اليوزيني (نادر).",
    dosageEn: "Adults: 10 mg once daily in evening. Children: 5 mg (chewable) or 4 mg (granules).",
    dosageAr: "البالغين: 10 ملغ مرة واحدة يومياً في المساء. الأطفال: 5 ملغ (قابل للمضغ) أو 4 ملغ (حبيبات).",
    pregnancyEn: "Category B. Generally considered safe; no adequate well-controlled studies in pregnancy.",
    pregnancyAr: "الفئة B. يعتبر آمناً عموماً؛ لا توجد دراسات كافية محكمة في الحمل.",
    breastfeedingEn: "Excreted in breast milk; use with caution. Consider benefit versus risk.",
    breastfeedingAr: "يفرز في حليب الثدي؛ يستخدم بحذر. وازن بين الفائدة والخطر.",
    manufacturerEn: "Merck Sharp & Dohme (Singulair)",
    manufacturerAr: "ميرك شارب ودوم (سينجولير)",
    prices: [
      { form: "Singulair 10 mg 30 tabs", formEn: "Singulair 10 mg 30 tabs", price: 70, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "49", severity: "moderate", description: "Theophylline may decrease montelukast levels slightly; not clinically significant in most cases." },
      { drugId: "46", severity: "moderate", description: "Carbamazepine induces metabolism; monitor asthma control." },
      { drugId: "12", severity: "minor", description: "CYP3A4 inducers may reduce montelukast efficacy; monitor response." }
    ],
    diseaseInteractions: [
      { diseaseId: "d8", severity: "moderate", description: "Not for acute asthma attacks; continue rescue inhaler for acute bronchospasm." },
      { diseaseId: "d22", severity: "moderate", description: "Monitor for eosinophilic granulomatosis with polyangiitis in severe asthmatics." },
      { diseaseId: "d19", severity: "minor", description: "No dose adjustment needed in mild hepatic impairment." }
    ]
  },
  {
    id: "51",
    nameAr: "بريدنيزولون",
    nameEn: "Prednisolone",
    scientificNameAr: "بريدنيزولون",
    scientificNameEn: "Prednisolone",
    activeIngredientAr: "بريدنيزولون",
    activeIngredientEn: "Prednisolone",
    category: "Corticosteroid",
    categoryAr: "كورتيكوستيرويد",
    formEmoji: "💊",
    description: "Systemic corticosteroid with potent anti-inflammatory and immunosuppressant properties.",
    descriptionAr: "كورتيكوستيرويد جهازي له خصائص قوية مضادة للالتهاب ومثبطة للمناعة.",
    indicationEn: "Severe allergic reactions, asthma exacerbations, autoimmune diseases, inflammatory bowel disease, nephrotic syndrome, organ transplantation.",
    indicationAr: "تفاعلات الحساسية الشديدة، تفاقم الربو، أمراض المناعة الذاتية، مرض الأمعاء الالتهابي، المتلازمة الكلوية، زراعة الأعضاء.",
    mechanismEn: "Binds to glucocorticoid receptors, modulating gene expression to decrease pro-inflammatory cytokines, inhibit phospholipase A2, and suppress immune cell activity.",
    mechanismAr: "يرتبط بمستقبلات الجلوكوكورتيكويد، مما يعدل التعبير الجيني لتقليل السيتوكينات المؤيدة للالتهاب، وتثبيط الفسفوليباز A2، وقمع نشاط الخلايا المناعية.",
    sideEffectsEn: "Weight gain, hyperglycemia, osteoporosis, hypertension, glaucoma, cataracts, immunosuppression, adrenal suppression, Cushing's syndrome.",
    sideEffectsAr: "زيادة الوزن، ارتفاع السكر في الدم، هشاشة العظام، ارتفاع ضغط الدم، الزرق، إعتام عدسة العين، كبت المناعة، قصور الغدة الكظرية، متلازمة كوشينغ.",
    dosageEn: "5-60 mg/day depending on condition. Taper when discontinuing. Tablets: 5, 10, 20 mg.",
    dosageAr: "5-60 ملغ/يوم حسب الحالة. يجب التناقص التدريجي عند التوقف. أقراص: 5، 10، 20 ملغ.",
    pregnancyEn: "Category C. Use lowest effective dose; may cause adrenal insufficiency in newborn if used long-term.",
    pregnancyAr: "الفئة C. استخدم أقل جرعة فعالة؛ قد يسبب قصور الغدة الكظرية عند المولود إذا استخدم طويلاً.",
    breastfeedingEn: "Excreted in breast milk at low levels. Safe at prednisolone doses below 40 mg/day.",
    breastfeedingAr: "يفرز في حليب الثدي بمستويات منخفضة. آمن عند جرعات البريدنيزولون أقل من 40 ملغ/يوم.",
    manufacturerEn: "Sigma Pharmaceutical Industries",
    manufacturerAr: "شركة سيجما للصناعات الدوائية",
    prices: [
      { form: "Prednisolone 5 mg 30 tabs", formEn: "Prednisolone 5 mg 30 tabs", price: 15, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "25", severity: "severe", description: "Warfarin: corticosteroids may increase or decrease anticoagulant effect; monitor INR." },
      { drugId: "33", severity: "moderate", description: "NSAIDs increase risk of gastrointestinal bleeding." },
      { drugId: "57", severity: "minor", description: "May cause hypokalemia at high doses; monitor electrolytes with diuretics." }
    ],
    diseaseInteractions: [
      { diseaseId: "d14", severity: "severe", description: "May cause hyperglycemia; monitor blood glucose in diabetic patients." },
      { diseaseId: "d16", severity: "severe", description: "May worsen hypertension; monitor blood pressure regularly." },
      { diseaseId: "d6", severity: "moderate", description: "Increases osteoporosis risk especially with long-term use." }
    ]
  },
  {
    id: "52",
    nameAr: "ديكساميثازون",
    nameEn: "Dexamethasone",
    scientificNameAr: "ديكساميثازون",
    scientificNameEn: "Dexamethasone",
    activeIngredientAr: "ديكساميثازون",
    activeIngredientEn: "Dexamethasone",
    category: "Corticosteroid",
    categoryAr: "كورتيكوستيرويد",
    formEmoji: "💊",
    description: "Potent long-acting corticosteroid with strong anti-inflammatory and immunosuppressant effects.",
    descriptionAr: "كورتيكوستيرويد قوي طويل المفعول له تأثيرات قوية مضادة للالتهاب ومثبطة للمناعة.",
    indicationEn: "Cerebral edema, severe allergies, COPD exacerbation, COVID-19 (severe), antiemetic in chemotherapy, neonatal respiratory distress syndrome.",
    indicationAr: "وذمة الدماغ، الحساسية الشديدة، تفاقم مرض الانسداد الرئوي المزمن، كوفيد-19 (الشديد)، مضاد للقيء في العلاج الكيميائي، متلازمة الضائقة التنفسية لحديثي الولادة.",
    mechanismEn: "Potent glucocorticoid receptor agonist with minimal mineralocorticoid activity; suppresses inflammation by inhibiting cytokines, chemokines, and inflammatory mediators.",
    mechanismAr: "منشط قوي لمستقبلات الجلوكوكورتيكويد مع نشاط قشري معدني ضئيل؛ يثبط الالتهاب عن طريق تثبيط السيتوكينات والكيموكينات والوسطاء الالتهابيين.",
    sideEffectsEn: "Hyperglycemia, insomnia, mood changes, increased appetite, weight gain, immunosuppression, osteoporosis, adrenal suppression.",
    sideEffectsAr: "ارتفاع السكر في الدم، أرق، تغيرات مزاجية، زيادة الشهية، زيادة الوزن، كبت المناعة، هشاشة العظام، قصور الغدة الكظرية.",
    dosageEn: "0.5-24 mg/day depending on indication. Short courses: 4-8 mg/day. Tablets: 0.5, 0.75, 4 mg.",
    dosageAr: "0.5-24 ملغ/يوم حسب المؤشر. الدورات القصيرة: 4-8 ملغ/يوم. أقراص: 0.5، 0.75، 4 ملغ.",
    pregnancyEn: "Category C. Use only if clearly needed; may cause fetal growth restriction with prolonged use.",
    pregnancyAr: "الفئة C. يستخدم فقط إذا لزم الأمر؛ قد يسبب تقييد نمو الجنين مع الاستخدام المطول.",
    breastfeedingEn: "Excreted in breast milk; use lowest effective dose. Short-term use is generally compatible.",
    breastfeedingAr: "يفرز في حليب الثدي؛ استخدم أقل جرعة فعالة. الاستخدام قصير المدى متوافق عموماً.",
    manufacturerEn: "Memphis Pharmaceutical (Memdex)",
    manufacturerAr: "ممفيس للأدوية (ميمديكس)",
    prices: [
      { form: "Memdex 0.5 mg 30 tabs", formEn: "Memdex 0.5 mg 30 tabs", price: 10, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "33", severity: "severe", description: "NSAIDs significantly increase risk of gastrointestinal ulceration and bleeding." },
      { drugId: "25", severity: "moderate", description: "Warfarin: dexamethasone may alter anticoagulant effect; monitor INR." },
      { drugId: "45", severity: "moderate", description: "Fluconazole inhibits dexamethasone metabolism, increasing corticosteroid exposure." }
    ],
    diseaseInteractions: [
      { diseaseId: "d14", severity: "severe", description: "May cause significant hyperglycemia and diabetic ketoacidosis." },
      { diseaseId: "d5", severity: "moderate", description: "May mask infection signs; use cautiously in active infections." },
      { diseaseId: "d6", severity: "moderate", description: "Long-term use accelerates bone loss; use minimum effective duration." }
    ]
  },
  {
    id: "53",
    nameAr: "ميثوتركسيت",
    nameEn: "Methotrexate",
    scientificNameAr: "ميثوتركسيت",
    scientificNameEn: "Methotrexate",
    activeIngredientAr: "ميثوتركسيت",
    activeIngredientEn: "Methotrexate",
    category: "Immunosuppressant / Antimetabolite",
    categoryAr: "مثبط مناعة / مضاد الأيض",
    formEmoji: "💊",
    description: "Folate analogue antimetabolite used in cancer chemotherapy, rheumatoid arthritis, and psoriasis.",
    descriptionAr: "مضاد أيض مماثل للفولات يستخدم في العلاج الكيميائي للسرطان والتهاب المفاصل الروماتويدي والصدفية.",
    indicationEn: "Rheumatoid arthritis, psoriasis, psoriatic arthritis, Crohn's disease, leukemia, lymphoma, osteosarcoma, ectopic pregnancy.",
    indicationAr: "التهاب المفاصل الروماتويدي، الصدفية، التهاب المفاصل الصدفي، مرض كرون، اللوكيميا، الليمفوما، ساركوما العظام، الحمل خارج الرحم.",
    mechanismEn: "Inhibits dihydrofolate reductase (DHFR), blocking thymidine and purine synthesis, thereby suppressing DNA replication and cell proliferation.",
    mechanismAr: "يثبط إنزيم ثنائي هيدروفولات ريدوكتاز (DHFR)، مما يمنع تخليق الثيميدين والبيورين، وبالتالي يثبط تضاعف الحمض النووي وانقسام الخلايا.",
    sideEffectsEn: "Nausea, vomiting, hepatotoxicity, myelosuppression, mucositis, pneumonitis, nephrotoxicity, fatigue.",
    sideEffectsAr: "غثيان، قيء، سمية كبدية، تثبيط نقي العظم، التهاب الغشاء المخاطي، التهاب رئوي، سمية كلوية، إرهاق.",
    dosageEn: "Rheumatoid arthritis: 7.5-25 mg once weekly. Cancer: variable. Tablets: 2.5 mg.",
    dosageAr: "التهاب المفاصل الروماتويدي: 7.5-25 ملغ مرة أسبوعياً. السرطان: متغير. أقراص: 2.5 ملغ.",
    pregnancyEn: "Category X. CONTRAINDICATED in pregnancy; causes severe fetal malformations and miscarriage.",
    pregnancyAr: "الفئة X. ممنوع في الحمل؛ يسبب تشوهات جنينية حادة وإجهاضاً.",
    breastfeedingEn: "Excreted in breast milk; contraindicated due to potential immunosuppression in infant.",
    breastfeedingAr: "يفرز في حليب الثدي؛ ممنوع بسبب كبت المناعة المحتمل عند الرضيع.",
    manufacturerEn: "Pfizer (Methotrexate / Trexall)",
    manufacturerAr: "فايزر (ميثوتركسيت / تريكسال)",
    prices: [
      { form: "Methotrexate 2.5 mg 50 tabs", formEn: "Methotrexate 2.5 mg 50 tabs", price: 50, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "33", severity: "severe", description: "NSAIDs reduce methotrexate clearance, increasing severe toxicity risk." },
      { drugId: "58", severity: "severe", description: "Folic acid supplements may reduce methotrexate efficacy; separate by 24 hours." },
      { drugId: "51", severity: "moderate", description: "Corticosteroids may increase immunosuppressive effect." }
    ],
    diseaseInteractions: [
      { diseaseId: "d19", severity: "contraindicated", description: "Contraindicated in significant hepatic impairment or hepatitis." },
      { diseaseId: "d12", severity: "severe", description: "Renal impairment increases methotrexate toxicity; adjust dose or avoid." },
      { diseaseId: "d3", severity: "severe", description: "May worsen bone marrow suppression; monitor CBC regularly." }
    ]
  },
  {
    id: "54",
    nameAr: "فيناستيريد",
    nameEn: "Finasteride",
    scientificNameAr: "فيناستيريد",
    scientificNameEn: "Finasteride",
    activeIngredientAr: "فيناستيريد",
    activeIngredientEn: "Finasteride",
    category: "5-Alpha Reductase Inhibitor",
    categoryAr: "مثبط مختزلة ألفا-5",
    formEmoji: "💊",
    description: "Type II 5-alpha-reductase inhibitor used for benign prostatic hyperplasia and male pattern baldness.",
    descriptionAr: "مثبط مختزلة ألفا-5 من النوع II يستخدم لتضخم البروستاتا الحميد والصلع الوراثي عند الذكور.",
    indicationEn: "Benign prostatic hyperplasia (BPH), male androgenetic alopecia (male pattern baldness).",
    indicationAr: "تضخم البروستاتا الحميد، الصلع الوراثي الذكري (الصلع الذكري).",
    mechanismEn: "Inhibits type II 5-alpha-reductase, blocking conversion of testosterone to dihydrotestosterone (DHT), reducing prostatic growth and hair follicle miniaturization.",
    mechanismAr: "يثبط مختزلة ألفا-5 من النوع II، مما يمنع تحويل التستوستيرون إلى ديهدروتستوستيرون (DHT)، مما يقلل نمو البروستاتا وتصغير بصيلات الشعر.",
    sideEffectsEn: "Decreased libido, erectile dysfunction, ejaculation disorders, gynecomastia, depression (rare), decreased PSA levels.",
    sideEffectsAr: "انخفاض الرغبة الجنسية، ضعف الانتصاب، اضطرابات القذف، التثدي، اكتئاب (نادر)، انخفاض مستويات PSA.",
    dosageEn: "BPH: 5 mg once daily. Hair loss: 1 mg once daily. Tablets: 1 mg (Propecia), 5 mg (Proscar).",
    dosageAr: "تضخم البروستاتا: 5 ملغ مرة واحدة يومياً. تساقط الشعر: 1 ملغ مرة واحدة يومياً. أقراص: 1 ملغ (بروبيشيا)، 5 ملغ (بروسكار).",
    pregnancyEn: "Category X. CONTRAINDICATED in women who are or may become pregnant; causes hypospadias in male fetuses. Pregnant women should not handle crushed tablets.",
    pregnancyAr: "الفئة X. ممنوع للنساء الحوامل أو اللواتي قد يصبحن حوامل؛ يسبب تحت الإحليل في الأجنة الذكور. يجب على النساء الحوامل عدم لمس الأقراص المسحوقة.",
    breastfeedingEn: "Not indicated for women; not applicable for breastfeeding.",
    breastfeedingAr: "غير مخصص للنساء؛ لا ينطبق على الرضاعة الطبيعية.",
    manufacturerEn: "Merck Sharp & Dohme (Proscar / Propecia)",
    manufacturerAr: "ميرك شارب ودوم (بروسكار / بروبيشيا)",
    prices: [
      { form: "Proscar 5 mg 30 tabs", formEn: "Proscar 5 mg 30 tabs", price: 75, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "12", severity: "minor", description: "No significant CYP-mediated interactions; minimal drug interaction profile." },
      { drugId: "23", severity: "minor", description: "No clinically significant interactions with alcohol or CNS depressants." },
      { drugId: "33", severity: "minor", description: "No significant interaction with NSAIDs." }
    ],
    diseaseInteractions: [
      { diseaseId: "d20", severity: "moderate", description: "Monitor for urinary retention; finasteride may improve flow but requires 6-12 months." },
      { diseaseId: "d15", severity: "minor", description: "Monitor PSA in cardiac patients; finasteride reduces PSA by ~50%." },
      { diseaseId: "d19", severity: "moderate", description: "Hepatic impairment may increase finasteride exposure; use caution." }
    ]
  },
  {
    id: "55",
    nameAr: "سيلدينافيل",
    nameEn: "Sildenafil",
    scientificNameAr: "سيلدينافيل سيترات",
    scientificNameEn: "Sildenafil Citrate",
    activeIngredientAr: "سيلدينافيل",
    activeIngredientEn: "Sildenafil",
    category: "PDE5 Inhibitor",
    categoryAr: "مثبط PDE5",
    formEmoji: "💊",
    description: "Phosphodiesterase-5 inhibitor used for erectile dysfunction and pulmonary arterial hypertension.",
    descriptionAr: "مثبط فوسفودايستيراز-5 يستخدم لضعف الانتصاب وارتفاع ضغط الدم الرئوي.",
    indicationEn: "Erectile dysfunction, pulmonary arterial hypertension (Revatio), benign prostatic hyperplasia (off-label).",
    indicationAr: "ضعف الانتصاب، ارتفاع ضغط الدم الشرياني الرئوي (ريفاتيو)، تضخم البروستاتا الحميد (خارج النشرة).",
    mechanismEn: "Inhibits PDE5, increasing cGMP levels in corpus cavernosum, enhancing nitric oxide-mediated vasodilation and penile erection.",
    mechanismAr: "يثبط PDE5، مما يزيد مستويات cGMP في الجسم الكهفي، مما يعزز توسع الأوعية بوساطة أكسيد النيتريك والانتصاب.",
    sideEffectsEn: "Headache, flushing, dyspepsia, nasal congestion, visual disturbances (blue tint), back pain, hearing loss (rare), priapism (rare).",
    sideEffectsAr: "صداع، احمرار الوجه، عسر الهضم، احتقان الأنف، اضطرابات بصرية (تشوش أزرق)، ألم الظهر، فقدان السمع (نادر)، انتصاب مؤلم طويل (نادر).",
    dosageEn: "ED: 50 mg 1 hour before sex (range 25-100 mg). PAH: 20 mg three times daily. Tablets: 25, 50, 100 mg.",
    dosageAr: "ضعف الانتصاب: 50 ملغ قبل ساعة من الجماع (المدى 25-100 ملغ). ارتفاع ضغط الدم الرئوي: 20 ملغ ثلاث مرات يومياً. أقراص: 25، 50، 100 ملغ.",
    pregnancyEn: "Category B. No adequate studies in pregnant women for PAH indication; use only if clearly needed.",
    pregnancyAr: "الفئة B. لا توجد دراسات كافية في النساء الحوامل لمؤشر ارتفاع ضغط الدم الرئوي؛ يستخدم فقط إذا لزم الأمر.",
    breastfeedingEn: "Excreted in breast milk in low amounts; generally considered compatible.",
    breastfeedingAr: "يفرز في حليب الثدي بكميات منخفضة؛ يعتبر متوافقاً عموماً.",
    manufacturerEn: "Pfizer (Viagra / Revatio)",
    manufacturerAr: "فايزر (فياجرا / ريفاتيو)",
    prices: [
      { form: "Viagra 50 mg 4 tabs", formEn: "Viagra 50 mg 4 tabs", price: 80, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "22", severity: "severe", description: "Nitrates (organic nitrates) cause severe hypotension; CONTRAINDICATED." },
      { drugId: "12", severity: "severe", description: "Alpha-blockers may cause orthostatic hypotension; separate by 4 hours if co-administered." },
      { drugId: "45", severity: "moderate", description: "CYP3A4 inhibitors (fluconazole, ketoconazole) increase sildenafil levels." }
    ],
    diseaseInteractions: [
      { diseaseId: "d15", severity: "contraindicated", description: "Contraindicated in patients taking nitrates for angina or with severe cardiac disease." },
      { diseaseId: "d16", severity: "moderate", description: "May cause hypotension in patients with uncontrolled hypertension." },
      { diseaseId: "d20", severity: "moderate", description: "Use with caution in severe urinary obstruction; no direct effect." }
    ]
  },
  {
    id: "56",
    nameAr: "ليفوثيروكسين",
    nameEn: "Levothyroxine",
    scientificNameAr: "ليفوثيروكسين صوديوم",
    scientificNameEn: "Levothyroxine Sodium",
    activeIngredientAr: "ليفوثيروكسين",
    activeIngredientEn: "Levothyroxine",
    category: "Thyroid Hormone",
    categoryAr: "هرمون الغدة الدرقية",
    formEmoji: "💊",
    description: "Synthetic T4 thyroid hormone replacement used for hypothyroidism and TSH suppression.",
    descriptionAr: "هرمون الغدة الدرقية T4 الاصطناعي يستخدم لعلاج قصور الغدة الدرقية وقمع TSH.",
    indicationEn: "Primary hypothyroidism, secondary hypothyroidism, myxedema coma, TSH suppression in thyroid cancer.",
    indicationAr: "قصور الغدة الدرقية الأولي، قصور الغدة الدرقية الثانوي، الغيبوبة الوذمية المخاطية، قمع TSH في سرطان الغدة الدرقية.",
    mechanismEn: "Synthetic T4 is converted to T3 (active hormone) by deiodinases; T3 binds to thyroid hormone receptors, regulating gene expression for metabolism, growth, and development.",
    mechanismAr: "يتم تحويل T4 الاصطناعي إلى T3 (الهرمون النشط) بواسطة إنزيمات نزع اليود؛ يرتبط T3 بمستقبلات هرمون الغدة الدرقية، وينظم التعبير الجيني للأيض والنمو والتطور.",
    sideEffectsEn: "Tremor, palpitations, tachycardia, insomnia, weight loss, increased appetite, sweating, heat intolerance, anxiety.",
    sideEffectsAr: "رعاش، خفقان، تسرع القلب، أرق، فقدان الوزن، زيادة الشهية، تعرق، عدم تحمل الحرارة، قلق.",
    dosageEn: "Starting 12.5-50 mcg/day, adjusted based on TSH. Typical maintenance 75-150 mcg/day. Tablets: 25, 50, 75, 100, 125, 150 mcg.",
    dosageAr: "الجرعة البدء 12.5-50 ميكروغرام/يوم، تُعدل حسب TSH. الجرعة المداومة النموذجية 75-150 ميكروغرام/يوم. أقراص: 25، 50، 75، 100، 125، 150 ميكروغرام.",
    pregnancyEn: "Category A. Essential in pregnancy; dose often increases by 30-50%. Monitor TSH every 4 weeks.",
    pregnancyAr: "الفئة A. أساسي في الحمل؛ الجرعة غالباً تزيد بنسبة 30-50%. راقب TSH كل 4 أسابيع.",
    breastfeedingEn: "Excreted in breast milk in low amounts; compatible with breastfeeding. Essential for maternal health.",
    breastfeedingAr: "يفرز في حليب الثدي بكميات منخفضة؛ متوافق مع الرضاعة الطبيعية. أساسي لصحة الأم.",
    manufacturerEn: "Sigma Pharmaceutical Industries (Eltroxin / Euthyrox)",
    manufacturerAr: "شركة سيجما للصناعات الدوائية (إلتروكسين / يوثايروكس)",
    prices: [
      { form: "Eltroxin 50 mcg 30 tabs", formEn: "Eltroxin 50 mcg 30 tabs", price: 20, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "60", severity: "moderate", description: "PPIs may reduce levothyroxine absorption; take on empty stomach, separate by 4 hours." },
      { drugId: "46", severity: "moderate", description: "Carbamazepine induces levothyroxine metabolism; may require dose increase." },
      { drugId: "45", severity: "minor", description: "Fluconazole may increase levothyroxine levels; monitor TSH." }
    ],
    diseaseInteractions: [
      { diseaseId: "d15", severity: "severe", description: "Over-replacement may cause tachycardia, angina, or arrhythmias in cardiac patients." },
      { diseaseId: "d14", severity: "moderate", description: "May increase insulin resistance; monitor blood glucose in diabetics." },
      { diseaseId: "d6", severity: "moderate", description: "Long-term over-replacement may accelerate bone loss in postmenopausal women." }
    ]
  },
  {
    id: "57",
    nameAr: "فيتامين د",
    nameEn: "Vitamin D",
    scientificNameAr: "كولي كالسيفيرول / فيتامين د3",
    scientificNameEn: "Cholecalciferol / Vitamin D3",
    activeIngredientAr: "فيتامين د3 (كولي كالسيفيرول)",
    activeIngredientEn: "Vitamin D3 (Cholecalciferol)",
    category: "Vitamin",
    categoryAr: "فيتامين",
    formEmoji: "💊",
    description: "Fat-soluble vitamin essential for calcium absorption, bone health, and immune function.",
    descriptionAr: "فيتامين قابل للذوبان في الدهون أساسي لامتصاص الكالسيوم وصحة العظام والوظيفة المناعية.",
    indicationEn: "Vitamin D deficiency, osteoporosis, rickets, osteomalacia, hypoparathyroidism, prevention of fractures in elderly.",
    indicationAr: "نقص فيتامين د، هشاشة العظام، الكساح، لين العظام، قصور جارات الدرقية، الوقاية من الكسور عند كبار السن.",
    mechanismEn: "Converted to calcitriol (active form), which increases intestinal calcium and phosphate absorption, promotes renal reabsorption of calcium, and regulates bone mineralization.",
    mechanismAr: "يتحول إلى كالسيتريول (الشكل النشط)، والذي يزيد امتصاص الكالسيوم والفوسفات في الأمعاء، ويعزز إعادة امتصاص الكالسيوم في الكلى، وينظم تمعدن العظام.",
    sideEffectsEn: "Generally well tolerated. High doses: hypercalcemia, hypercalciuria, nausea, vomiting, constipation, weakness, kidney stones.",
    sideEffectsAr: "جيد التحمل عموماً. الجرعات العالية: فرط كالسيوم الدم، فرط كالسيوم البول، غثيان، قيء، إمساك، ضعف، حصوات الكلى.",
    dosageEn: "Maintenance: 400-2000 IU/day. Deficiency: 50,000 IU weekly for 8 weeks, then maintenance. Capsules: 1000, 2000 IU; injection available.",
    dosageAr: "الجرعة المداومة: 400-2000 وحدة دولية/يوم. النقص: 50,000 وحدة دولية أسبوعياً لمدة 8 أسابيع، ثم مداومة. كبسولات: 1000، 2000 وحدة دولية؛ حقن متوفرة.",
    pregnancyEn: "Category A/C (safe). Essential for fetal bone development; deficiency may increase risk of preeclampsia.",
    pregnancyAr: "الفئة A/C (آمن). أساسي لنمو عظام الجنين؛ النقص قد يزيد خطر تسمم الحمل.",
    breastfeedingEn: "Excreted in breast milk; supplementation recommended to prevent infant deficiency.",
    breastfeedingAr: "يفرز في حليب الثدي؛ يُوصى بالمكملات للوقاية من النقص عند الرضيع.",
    manufacturerEn: "Various manufacturers (Vidrop, D-Forte, De-vit)",
    manufacturerAr: "شركات مصنعة متعددة (فيدروب، دي-فورت، دي-فيت)",
    prices: [
      { form: "Vidrop 2000 IU 30 caps", formEn: "Vidrop 2000 IU 30 caps", price: 15, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "46", severity: "moderate", description: "Carbamazepine induces vitamin D metabolism, reducing vitamin D levels." },
      { drugId: "51", severity: "moderate", description: "Corticosteroids reduce calcium absorption and increase vitamin D catabolism." },
      { drugId: "33", severity: "minor", description: "Thiazide diuretics may increase risk of hypercalcemia with high-dose vitamin D." }
    ],
    diseaseInteractions: [
      { diseaseId: "d12", severity: "moderate", description: "Renal impairment affects calcitriol production; use active form (calcitriol) if severe." },
      { diseaseId: "d6", severity: "moderate", description: "Essential for osteoporosis management; ensure adequate calcium and vitamin D." },
      { diseaseId: "d15", severity: "minor", description: "Very high doses may cause hypercalcemia affecting cardiac conduction." }
    ]
  },
  {
    id: "58",
    nameAr: "حمض الفوليك",
    nameEn: "Folic Acid",
    scientificNameAr: "حمض الفوليك",
    scientificNameEn: "Folic Acid",
    activeIngredientAr: "حمض الفوليك",
    activeIngredientEn: "Folic Acid",
    category: "Vitamin",
    categoryAr: "فيتامين",
    formEmoji: "💊",
    description: "Water-soluble B vitamin essential for DNA synthesis, red blood cell formation, and fetal neural tube development.",
    descriptionAr: "فيتامين ب قابل للذوبان في الماء أساسي لتخليق الحمض النووي وتكوين خلايا الدم الحمراء وتطور الأنبوب العصبي للجنين.",
    indicationEn: "Megaloblastic anemia (folate deficiency), prevention of neural tube defects in pregnancy, homocysteine reduction, methotrexate toxicity prevention.",
    indicationAr: "فقر الدم كبير الكريات (نقص الفولات)، الوقاية من عيوب الأنبوب العصبي في الحمل، تقليل الهوموسيستين، الوقاية من سمية الميثوتركسيت.",
    mechanismEn: "Converted to tetrahydrofolate, which acts as a coenzyme in purine and pyrimidine synthesis, essential for DNA replication and cell division.",
    mechanismAr: "يتحول إلى رباعي هيدروفولات، والذي يعمل كإنزيم مساعد في تخليق البيورين والبيريميدين، أساسي لتضاعف الحمض النووي وانقسام الخلايا.",
    sideEffectsEn: "Generally well tolerated. Rare: allergic reaction, nausea, bloating, bitter taste. High doses may affect zinc absorption.",
    sideEffectsAr: "جيد التحمل عموماً. نادر: رد فعل تحسسي، غثيان، انتفاخ، طعم مر. الجرعات العالية قد تؤثر على امتصاص الزنك.",
    dosageEn: "Pregnancy: 400-800 mcg/day. Anemia: 1-5 mg/day. Tablets: 400 mcg, 1 mg, 5 mg.",
    dosageAr: "الحمل: 400-800 ميكروغرام/يوم. فقر الدم: 1-5 ملغ/يوم. أقراص: 400 ميكروغرام، 1 ملغ، 5 ملغ.",
    pregnancyEn: "Category A. ESSENTIAL before and during pregnancy to prevent neural tube defects. All pregnant women should supplement.",
    pregnancyAr: "الفئة A. أساسي قبل وأثناء الحمل للوقاية من عيوب الأنبوب العصبي. يجب على جميع الحوامل تناوله.",
    breastfeedingEn: "Excreted in breast milk; recommended to maintain maternal stores. Safe for infant.",
    breastfeedingAr: "يفرز في حليب الثدي؛ يُوصى به للحفاظ على مخزون الأم. آمن للرضيع.",
    manufacturerEn: "Various manufacturers (Folacin, Folicap, Folate)",
    manufacturerAr: "شركات مصنعة متعددة (فولاسين، فوليكاب، فوليت)",
    prices: [
      { form: "Folic Acid 5 mg 30 tabs", formEn: "Folic Acid 5 mg 30 tabs", price: 10, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "53", severity: "severe", description: "Methotrexate: folic acid may reduce methotrexate efficacy; separate dosing by 24 hours." },
      { drugId: "48", severity: "moderate", description: "Phenytoin: folic acid may decrease phenytoin levels; monitor phenytoin levels." },
      { drugId: "46", severity: "moderate", description: "Carbamazepine induces folate metabolism; increased folate requirement." }
    ],
    diseaseInteractions: [
      { diseaseId: "d9", severity: "moderate", description: "Essential for megaloblastic anemia treatment; do not mask B12 deficiency." },
      { diseaseId: "d2", severity: "severe", description: "Folate supplementation may mask B12 deficiency in pernicious anemia; check B12 first." },
      { diseaseId: "d12", severity: "minor", description: "Renal impairment: no dose adjustment needed; monitor if on dialysis." }
    ]
  },
  {
    id: "59",
    nameAr: "دومبيريدون",
    nameEn: "Domperidone",
    scientificNameAr: "دومبيريدون",
    scientificNameEn: "Domperidone",
    activeIngredientAr: "دومبيريدون",
    activeIngredientEn: "Domperidone",
    category: "Prokinetic / Antiemetic",
    categoryAr: "محرك حركة المعدة / مضاد للقيء",
    formEmoji: "💊",
    description: "Peripheral dopamine D2 receptor antagonist used for nausea, vomiting, and gastric motility disorders.",
    descriptionAr: "مضاد مستقبلات الدوبامين D2 المحيطي يستخدم للغثيان والقيء واضطرابات حركة المعدة.",
    indicationEn: "Nausea and vomiting, gastroparesis, gastroesophageal reflux disease (GERD), dyspepsia, lactation stimulation (off-label).",
    indicationAr: "الغثيان والقيء، خزل المعدة، مرض الارتجاع المعدي المريئي، عسر الهضم، تحفيز الرضاعة (خارج النشرة).",
    mechanismEn: "Blocks dopamine D2 receptors in the chemoreceptor trigger zone (CTZ) and enhances gastric motility by increasing antral contractions and peristalsis without affecting CNS due to poor BBB penetration.",
    mechanismAr: "يمنع مستقبلات الدوبامين D2 في منطقة تحفيز المستقبلات الكيميائية ويعزز حركة المعدة عن طريق زيادة انقباضات الغار والتمعج دون التأثير على الجهاز العصبي المركزي بسبب ضعف اختراق الحاجز الدموي الدماغي.",
    sideEffectsEn: "Dry mouth, headache, diarrhea, abdominal cramps, hyperprolactinemia, galactorrhea, gynecomastia, QT prolongation (rare with high doses).",
    sideEffectsAr: "جفاف الفم، صداع، إسهال، تشنجات بطنية، فرط برولاكتين الدم، إدرار اللبن، التثدي، تطويل QT (نادر مع الجرعات العالية).",
    dosageEn: "10 mg 3-4 times daily before meals. Maximum 40 mg/day. Tablets: 10 mg; suspension 5 mg/5ml.",
    dosageAr: "10 ملغ 3-4 مرات يومياً قبل الوجبات. الحد الأقصى 40 ملغ/يوم. أقراص: 10 ملغ؛ معلق 5 ملغ/5 مل.",
    pregnancyEn: "Category C. Use only if clearly needed; no adequate studies in pregnancy.",
    pregnancyAr: "الفئة C. يستخدم فقط إذا لزم الأمر؛ لا توجد دراسات كافية في الحمل.",
    breastfeedingEn: "Excreted in breast milk at low levels; used off-label to enhance lactation. Compatible at standard doses.",
    breastfeedingAr: "يفرز في حليب الثدي بمستويات منخفضة؛ يستخدم خارج النشرة لتحفيز الرضاعة. متوافق مع الجرعات القياسية.",
    manufacturerEn: "Sanofi (Motilium / Domidon)",
    manufacturerAr: "سانوفي (موتيليوم / دوميدون)",
    prices: [
      { form: "Motilium 10 mg 30 tabs", formEn: "Motilium 10 mg 30 tabs", price: 25, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "12", severity: "severe", description: "CYP3A4 inhibitors (ketoconazole) increase domperidone levels and risk of arrhythmia." },
      { drugId: "60", severity: "moderate", description: "PPIs may reduce domperidone absorption; separate dosing." },
      { drugId: "23", severity: "minor", description: "Anticholinergics may antagonize prokinetic effects of domperidone." }
    ],
    diseaseInteractions: [
      { diseaseId: "d15", severity: "severe", description: "QT prolongation risk; avoid with pre-existing long QT or arrhythmias." },
      { diseaseId: "d19", severity: "severe", description: "Hepatic impairment increases exposure; avoid in moderate to severe disease." },
      { diseaseId: "d10", severity: "moderate", description: "May worsen GI obstruction; contraindicated if perforation or obstruction suspected." }
    ]
  },
  {
    id: "60",
    nameAr: "بانتوبرازول",
    nameEn: "Pantoprazole",
    scientificNameAr: "بانتوبرازول صوديوم",
    scientificNameEn: "Pantoprazole Sodium",
    activeIngredientAr: "بانتوبرازول",
    activeIngredientEn: "Pantoprazole",
    category: "Proton Pump Inhibitor (PPI)",
    categoryAr: "مثبط مضخة البروتون",
    formEmoji: "💊",
    description: "Proton pump inhibitor that reduces gastric acid secretion for peptic ulcers, GERD, and Zollinger-Ellison syndrome.",
    descriptionAr: "مثبط مضخة البروتون يقلل إفراز حمض المعدة لقرحة المعدة والأمعاء والارتجاع المعدي المريئي ومتلازمة زولينجر إليسون.",
    indicationEn: "Gastroesophageal reflux disease (GERD), erosive esophagitis, peptic ulcer disease, Zollinger-Ellison syndrome, H. pylori eradication (combination therapy), NSAID-associated ulcer prevention.",
    indicationAr: "مرض الارتجاع المعدي المريئي، التهاب المريء التآكلي، القرحة الهضمية، متلازمة زولينجر إليسون، استئصال الملوية البوابية (العلاج المركب)، الوقاية من قرحة مضادات الالتهاب غير الستيرويدية.",
    mechanismEn: "Irreversibly binds to H+/K+-ATPase (proton pump) in gastric parietal cells, blocking the final step of gastric acid secretion.",
    mechanismAr: "يرتبط بشكل لا رجعة فيه بـ H+/K+-ATPase (مضخة البروتون) في الخلايا الجدارية للمعدة، مما يمنع الخطوة الأخيرة من إفراز حمض المعدة.",
    sideEffectsEn: "Headache, diarrhea, nausea, abdominal pain, flatulence, constipation. Long-term: increased risk of fractures, C. difficile, B12 deficiency, hypomagnesemia.",
    sideEffectsAr: "صداع، إسهال، غثيان، ألم بطني، غازات، إمساك. طويل المدى: زيادة خطر الكسور، المطثية العسيرة، نقص B12، نقص مغنيسيوم الدم.",
    dosageEn: "20-40 mg once daily before breakfast. IV also available. Tablets: 20, 40 mg (enteric coated).",
    dosageAr: "20-40 ملغ مرة واحدة يومياً قبل الإفطار. متوفر أيضاً للحقن. أقراص: 20، 40 ملغ (مغلفة معوياً).",
    pregnancyEn: "Category B. Generally considered safe; use lowest effective dose for shortest duration.",
    pregnancyAr: "الفئة B. يعتبر آمناً عموماً؛ استخدم أقل جرعة فعالة لأقصر مدة.",
    breastfeedingEn: "Excreted in breast milk in low amounts; generally considered compatible.",
    breastfeedingAr: "يفرز في حليب الثدي بكميات منخفضة؛ يعتبر متوافقاً عموماً.",
    manufacturerEn: "Takeda (Pantoloc / Controloc)",
    manufacturerAr: "تاكيدا (بانتولوك / كونترولوك)",
    prices: [
      { form: "Controloc 40 mg 30 tabs", formEn: "Controloc 40 mg 30 tabs", price: 45, unit: "EGP" }
    ],
    imageUrl: "",
    drugInteractions: [
      { drugId: "25", severity: "moderate", description: "Warfarin: PPIs may increase INR; monitor closely when starting or stopping." },
      { drugId: "56", severity: "moderate", description: "Levothyroxine: increased gastric pH reduces absorption; take levothyroxine 4 hours before PPI." },
      { drugId: "12", severity: "moderate", description: "Ketoconazole and itraconazole: reduced absorption due to increased gastric pH." }
    ],
    diseaseInteractions: [
      { diseaseId: "d6", severity: "moderate", description: "Long-term use associated with increased fracture risk; ensure calcium supplementation." },
      { diseaseId: "d12", severity: "moderate", description: "Long-term use may cause hypomagnesemia; monitor magnesium in renal disease." },
      { diseaseId: "d2", severity: "moderate", description: "Long-term use may reduce vitamin B12 absorption; monitor B12 levels." }
    ]
  },
]

export const drugCategories = [
  ...new Set(drugs.map(d => d.category))
].sort()

export const drugCategoriesAr = [
  ...new Set(drugs.map(d => d.categoryAr))
].sort()
