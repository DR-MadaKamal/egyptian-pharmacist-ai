const STORAGE_KEY = 'pharma-lang'

const FALLBACK_LANG = 'ar'

const TRANSLATIONS = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.drugs': 'الأدوية',
    'nav.interview': 'المقابلة',
    'nav.pharmacopeia': 'الدستور واللوائح',
    'nav.admin': 'لوحة التحكم',
    'nav.adminLogin': 'دخول المشرف',
    // Search
    'search.placeholder': 'ابحث باسم الدواء (عربي/English)...',
    'search.results': 'نتائج',
    'search.noResults': 'لا توجد أدوية مطابقة للبحث',
    'search.found': 'دواء / drugs found',
    'search.loadMore': 'عرض المزيد',
    // Categories
    'browse.title': 'تصفح الأدوية',
    'browse.all': 'الكل',
    // Interactions
    'interact.title': 'التفاعلات',
    'interact.drugDrug': 'دواء-دواء',
    'interact.drugDisease': 'دواء-مرض',
    // Pharmacopeia
    'pharma.title': 'الدستور واللوائح',
    'pharma.subtitle': 'المرجع الرسمي لمعايير الجودة والتسجيل الدوائي في مصر',
    // Quiz
    'quiz.start': 'ابدأ المقابلة',
    'quiz.next': 'السؤال التالي',
    'quiz.results': 'عرض النتائج',
    'quiz.skip': 'تخطي',
    'quiz.retry': 'إعادة',
    // Detail
    'detail.scientificName': 'الاسم العلمي',
    'detail.manufacturer': 'الشركة المصنعة',
    'detail.prices': 'الأسعار',
    'detail.interactions': 'التفاعلات الدوائية',
    // General
    'general.loading': 'جاري التحميل...',
    'general.error': 'حدث خطأ',
    'general.save': 'حفظ',
    'general.cancel': 'إلغاء',
    'general.delete': 'حذف',
    'general.edit': 'تعديل',
    'general.view': 'عرض',
    'general.close': 'إغلاق',
    'general.search': 'بحث',
    'general.print': 'طباعة',
    'general.share': 'مشاركة',
    'general.copy': 'نسخ',
    'general.more': 'المزيد',
    'general.less': 'أقل',
    'general.clearAll': 'مسح الكل',
  },
  en: {
    'nav.home': 'Home',
    'nav.drugs': 'Drugs',
    'nav.interview': 'Interview',
    'nav.pharmacopeia': 'Pharmacopeia',
    'nav.admin': 'Admin Panel',
    'nav.adminLogin': 'Admin Login',
    'search.placeholder': 'Search by drug name (عربي/English)...',
    'search.results': 'Results',
    'search.noResults': 'No drugs match your search',
    'search.found': 'drugs found',
    'search.loadMore': 'Load More',
    'browse.title': 'Drug Browser',
    'browse.all': 'All',
    'interact.title': 'Interactions',
    'interact.drugDrug': 'Drug-Drug',
    'interact.drugDisease': 'Drug-Disease',
    'pharma.title': 'Pharmacopeia & Regulations',
    'pharma.subtitle': 'Quality standards, regulations, and official EDA references',
    'quiz.start': 'Start Interview',
    'quiz.next': 'Next Question',
    'quiz.results': 'View Results',
    'quiz.skip': 'Skip',
    'quiz.retry': 'Retry',
    'detail.scientificName': 'Scientific Name',
    'detail.manufacturer': 'Manufacturer',
    'detail.prices': 'Prices',
    'detail.interactions': 'Drug Interactions',
    'general.loading': 'Loading...',
    'general.error': 'An error occurred',
    'general.save': 'Save',
    'general.cancel': 'Cancel',
    'general.delete': 'Delete',
    'general.edit': 'Edit',
    'general.view': 'View',
    'general.close': 'Close',
    'general.search': 'Search',
    'general.print': 'Print',
    'general.share': 'Share',
    'general.copy': 'Copy',
    'general.more': 'More',
    'general.less': 'Less',
    'general.clearAll': 'Clear All',
  },
}

export function getStoredLang() {
  try { return localStorage.getItem(STORAGE_KEY) || FALLBACK_LANG } catch { return FALLBACK_LANG }
}

export function setStoredLang(lang) {
  try { localStorage.setItem(STORAGE_KEY, lang) } catch {}
}

export function getLang() {
  return getStoredLang()
}

export function t(key) {
  const lang = getLang()
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS[FALLBACK_LANG]?.[key] || key
}
