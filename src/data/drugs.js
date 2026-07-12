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
    id: "40", nameAr: "بنجلوكاز", nameEn: "Metformin", category: "Antidiabetic", categoryAr: "خافض لسكر الدم",
    description: "الخط الأول في علاج السكري من النوع 2",
    drugInteractions: [],
    diseaseInteractions: [
      { diseaseId: "d1", severity: "contraindicated", description: "ممنوع في الفشل الكلوي المتقدم" },
      { diseaseId: "d2", severity: "severe", description: "احتياط في أمراض الكبد" },
    ]
  },
  {
    id: "41", nameAr: "باراسيتامول", nameEn: "Paracetamol (Acetaminophen)", category: "Analgesic", categoryAr: "مسكن",
    description: "مسكن وخافض للحرارة - آمن للمعدة",
    drugInteractions: [
      { drugId: "1", severity: "moderate", description: "الجرعات العالية تزيد تأثير الوارفارين" },
    ],
    diseaseInteractions: [
      { diseaseId: "d2", severity: "severe", description: "سمي للكبد في الجرعات العالية - خطر في تليف الكبد" },
    ]
  },
  {
    id: "42", nameAr: "دومبيريدون", nameEn: "Domperidone", category: "Prokinetic", categoryAr: "محفز للحركة المعوية",
    description: "منشط لحركة المعدة والأمعاء - مضاد للغثيان والقيء",
    drugInteractions: [
      { drugId: "27", severity: "moderate", description: "قد يقلل تركيز الدومبيريدون" },
    ],
    diseaseInteractions: [
      { diseaseId: "d19", severity: "contraindicated", description: "ممنوع في إطالة QT - خطر اضطراب النظم" },
    ]
  },
  {
    id: "43", nameAr: "فيراباميل", nameEn: "Verapamil", category: "CCB (Non-dihydropyridine)", categoryAr: "حاصر لقنوات الكالسيوم",
    description: "مضاد لاضطراب النظم وخافض للضغط - يستخدم للذبحة وارتفاع الضغط",
    drugInteractions: [
      { drugId: "11", severity: "severe", description: "يزيد تركيز الديجوكسين بنسبة 50-75%" },
      { drugId: "9", severity: "severe", description: "يزيد خطر انحلال العضلات مع السيمفاستاتين" },
    ],
    diseaseInteractions: [
      { diseaseId: "d3", severity: "severe", description: "يبطئ التوصيل القلبي - خطر تفاقم فشل القلب" },
      { diseaseId: "d2", severity: "moderate", description: "ضعف استقلاب الفيراباميل في أمراض الكبد" },
    ]
  },
  {
    id: "44", nameAr: "كويتيابين", nameEn: "Quetiapine", category: "Atypical Antipsychotic", categoryAr: "مضاد ذهان غير نمطي",
    description: "مضاد للذهان - يستخدم في الفصام والاضطراب ثنائي القطب والاكتئاب",
    drugInteractions: [
      { drugId: "27", severity: "moderate", description: "يزيد استقلاب الكويتيابين - يقلل فعاليته" },
      { drugId: "34", severity: "moderate", description: "يزيد تركيز الكويتيابين" },
    ],
    diseaseInteractions: [
      { diseaseId: "d4", severity: "severe", description: "يزيد خطر متلازمة الأيض وارتفاع السكر" },
      { diseaseId: "d12", severity: "moderate", description: "يزيد ضغط العين" },
      { diseaseId: "d13", severity: "moderate", description: "يزيد احتباس البول" },
      { diseaseId: "d19", severity: "moderate", description: "قد يطيل QT - احتياط" },
    ]
  },
  {
    id: "45", nameAr: "ديازيبام", nameEn: "Diazepam", category: "Benzodiazepine", categoryAr: "بنزوديازيبين",
    description: "مزيل للقلق - مضاد للتشنجات - مرخي للعضلات",
    drugInteractions: [
      { drugId: "27", severity: "moderate", description: "يقلل تركيز الديازيبام" },
    ],
    diseaseInteractions: [
      { diseaseId: "d2", severity: "moderate", description: "ضعف استقلاب الديازيبام في أمراض الكبد" },
      { diseaseId: "d12", severity: "moderate", description: "احتياط في الجلوكوما ضيقة الزاوية" },
    ]
  },
]

export const drugCategories = [
  ...new Set(drugs.map(d => d.category))
].sort()

export const drugCategoriesAr = [
  ...new Set(drugs.map(d => d.categoryAr))
].sort()
