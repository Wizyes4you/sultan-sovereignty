export type Lang = "ar" | "en" | "fr" | "es";

export const LANGS: { code: Lang; label: string; dir: "rtl" | "ltr" }[] = [
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "es", label: "Español", dir: "ltr" },
];

export interface Copy {
  brand: string;
  compliant: string;
  connect: string;
  connecting: string;
  connected: string;
  disconnect: string;
  heroTitle: string;
  heroBody: string;
  metricPoolLabel: string;
  metricPoolSub: string;
  metricFlowLabel: string;
  metricFlowActive: string;
  metricFlowIdle: string;
  metricNodesLabel: string;
  metricNodesSub: string;
  modulesTitle: string;
  zakatTitle: string;
  zakatBody: string;
  securityTitle: string;
  securityBody: string;
  utilitiesTitle: string;
  utilitiesBody: string;
  paymentTitle: string;
  paymentBody: string;
  walletRequired: string;
  theme: string;
  language: string;
  license: string;
  repo: string;
  privacy: string;
  terms: string;
  contact: string;
  developer: string;
}

export const COPY: Record<Lang, Copy> = {
  ar: {
    brand: "Sultan DApp",
    compliant: "متوافق مع Pi OS",
    connect: "ربط محفظة Pi",
    connecting: "جارٍ الربط…",
    connected: "متصل",
    disconnect: "إنهاء الجلسة",
    heroTitle: "تطبيق لامركزي على شبكة Pi للتحويلات والزكاة",
    heroBody:
      "واجهة غير حاضنة تعمل داخل متصفح Pi. تتم المصادقة عبر حساب Pi الخاص بك، ويُنفَّذ كل دفع عبر حزمة Pi الرسمية مع تحقق من الخادم.",
    metricPoolLabel: "حوض الزكاة",
    metricPoolSub: "من كل عملية دفع",
    metricFlowLabel: "تدفق الإعمار المجتمعي",
    metricFlowActive: "نشط",
    metricFlowIdle: "غير متاح",
    metricNodesLabel: "العقد النشطة",
    metricNodesSub: "خدمات مراقَبة",
    modulesTitle: "الوحدات الأساسية",
    zakatTitle: "محرك الزكاة",
    zakatBody:
      "يحسب حصة 2.5% لكل عملية ويُسجّلها ضمن بيانات الدفع على الشبكة قبل التوقيع.",
    securityTitle: "أمان سيادي",
    securityBody:
      "غير حاضن: لا يتم تخزين العبارة السرية ولا المفاتيح الخاصة. التوقيع يتم داخل محفظة Pi فقط.",
    utilitiesTitle: "خدمات المجتمع",
    utilitiesBody:
      "أدوات دفع وتقارير تحويل شفافة، مع نقاط نهاية عامة للتحقق من حالة النظام.",
    paymentTitle: "تنفيذ عملية دفع",
    paymentBody: "يتطلب ربط المحفظة أولاً، ويعمل داخل متصفح Pi فقط.",
    walletRequired: "اربط محفظة Pi لتفعيل الدفع.",
    theme: "المظهر",
    language: "اللغة",
    license: "رخصة Pi مفتوحة المصدر (PiOS)",
    repo: "GitHub",
    privacy: "الخصوصية",
    terms: "الشروط",
    contact: "تواصل",
    developer: "المطوّر: Wizyes4you",
  },
  en: {
    brand: "Sultan DApp",
    compliant: "Pi OS Compliant",
    connect: "Connect Pi Wallet",
    connecting: "Connecting…",
    connected: "Connected",
    disconnect: "End session",
    heroTitle: "A Pi Network DApp for transfers and zakat allocation",
    heroBody:
      "A non-custodial interface that runs inside the Pi Browser. Authentication uses your Pi account, and every payment is executed through the official Pi SDK with server-side verification.",
    metricPoolLabel: "Zakat pool",
    metricPoolSub: "of every payment",
    metricFlowLabel: "Community reconstruction flow",
    metricFlowActive: "Active",
    metricFlowIdle: "Unavailable",
    metricNodesLabel: "Active nodes",
    metricNodesSub: "Monitored services",
    modulesTitle: "Core modules",
    zakatTitle: "Zakat Engine",
    zakatBody:
      "Computes the 2.5% allocation per transaction and records it in on-chain payment metadata before signing.",
    securityTitle: "Sovereign Security",
    securityBody:
      "Non-custodial: no passphrase and no private key is ever stored. Signing happens only inside the Pi wallet.",
    utilitiesTitle: "Community Utilities",
    utilitiesBody:
      "Transparent payment and transfer reporting, plus public endpoints for system status verification.",
    paymentTitle: "Execute a payment",
    paymentBody: "Requires a connected wallet and runs only inside the Pi Browser.",
    walletRequired: "Connect your Pi wallet to enable payments.",
    theme: "Theme",
    language: "Language",
    license: "Pi Open Source (PiOS) License",
    repo: "GitHub",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    developer: "Developer: Wizyes4you",
  },
  fr: {
    brand: "Sultan DApp",
    compliant: "Conforme Pi OS",
    connect: "Connecter le portefeuille Pi",
    connecting: "Connexion…",
    connected: "Connecté",
    disconnect: "Terminer la session",
    heroTitle: "Une DApp Pi Network pour les transferts et l'allocation zakat",
    heroBody:
      "Une interface non dépositaire qui s'exécute dans le Pi Browser. L'authentification utilise votre compte Pi et chaque paiement passe par le SDK Pi officiel avec vérification côté serveur.",
    metricPoolLabel: "Pool zakat",
    metricPoolSub: "de chaque paiement",
    metricFlowLabel: "Flux de reconstruction communautaire",
    metricFlowActive: "Actif",
    metricFlowIdle: "Indisponible",
    metricNodesLabel: "Nœuds actifs",
    metricNodesSub: "Services surveillés",
    modulesTitle: "Modules principaux",
    zakatTitle: "Moteur Zakat",
    zakatBody:
      "Calcule l'allocation de 2,5 % par transaction et l'enregistre dans les métadonnées de paiement avant signature.",
    securityTitle: "Sécurité souveraine",
    securityBody:
      "Non dépositaire : aucune phrase secrète ni clé privée n'est stockée. La signature a lieu uniquement dans le portefeuille Pi.",
    utilitiesTitle: "Utilitaires communautaires",
    utilitiesBody:
      "Rapports de paiement et de transfert transparents, avec des points d'accès publics pour vérifier l'état du système.",
    paymentTitle: "Exécuter un paiement",
    paymentBody: "Nécessite un portefeuille connecté et fonctionne uniquement dans le Pi Browser.",
    walletRequired: "Connectez votre portefeuille Pi pour activer les paiements.",
    theme: "Thème",
    language: "Langue",
    license: "Licence Pi Open Source (PiOS)",
    repo: "GitHub",
    privacy: "Confidentialité",
    terms: "Conditions",
    contact: "Contact",
    developer: "Développeur : Wizyes4you",
  },
  es: {
    brand: "Sultan DApp",
    compliant: "Compatible con Pi OS",
    connect: "Conectar billetera Pi",
    connecting: "Conectando…",
    connected: "Conectado",
    disconnect: "Cerrar sesión",
    heroTitle: "Una DApp de Pi Network para transferencias y asignación de zakat",
    heroBody:
      "Una interfaz no custodial que se ejecuta dentro del Pi Browser. La autenticación usa tu cuenta de Pi y cada pago se ejecuta mediante el SDK oficial de Pi con verificación en el servidor.",
    metricPoolLabel: "Fondo zakat",
    metricPoolSub: "de cada pago",
    metricFlowLabel: "Flujo de reconstrucción comunitaria",
    metricFlowActive: "Activo",
    metricFlowIdle: "No disponible",
    metricNodesLabel: "Nodos activos",
    metricNodesSub: "Servicios monitorizados",
    modulesTitle: "Módulos principales",
    zakatTitle: "Motor Zakat",
    zakatBody:
      "Calcula la asignación del 2,5 % por transacción y la registra en los metadatos del pago antes de firmar.",
    securityTitle: "Seguridad soberana",
    securityBody:
      "No custodial: nunca se almacena frase secreta ni clave privada. La firma ocurre solo dentro de la billetera Pi.",
    utilitiesTitle: "Utilidades comunitarias",
    utilitiesBody:
      "Informes de pago y transferencia transparentes, con endpoints públicos para verificar el estado del sistema.",
    paymentTitle: "Ejecutar un pago",
    paymentBody: "Requiere una billetera conectada y funciona solo dentro del Pi Browser.",
    walletRequired: "Conecta tu billetera Pi para habilitar los pagos.",
    theme: "Tema",
    language: "Idioma",
    license: "Licencia Pi Open Source (PiOS)",
    repo: "GitHub",
    privacy: "Privacidad",
    terms: "Términos",
    contact: "Contacto",
    developer: "Desarrollador: Wizyes4you",
  },
};
