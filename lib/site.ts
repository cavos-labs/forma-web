export type Language = "EN" | "ES";
export type Theme = "dark" | "light";

export const INK = "#373737";
export const PAPER = "#F0F0F0";

export const WHATSAPP_HREF = "https://wa.me/50686766484";
export const PHONE_DISPLAY = "+506 8676-6484";
export const EMAIL = "adrianvrj@cavos.xyz";
export const LOCATION = "Alajuela, Costa Rica";
export const SITE_URL = "www.formacr.com";

export type SiteCopy = {
  nav: { features: string; contact: string; pricing: string; menu: string; close: string };
  hero: { headline: string; line: string; cta: string };
  work: {
    title: string;
    slices: { id: string; image: string; alt: string; headline: string; body: string }[];
  };
  control: { headline: string; body: string; link: string };
  sinpe: { headline: string; body: string };
  contact: { headline: string; body: string; cta: string; consent: string };
  footer: { tagline: string; privacy: string; terms: string; rights: string; whatsappPolicy: string };
  pricing: {
    headline: string;
    currency: string;
    monthly: string;
    yearly: string;
    perMonth: string;
    perYear: string;
    saveTwoMonths: string;
    monthlyHint: string;
    getStarted: string;
    features: string[];
  };
};

export const COPY: Record<Language, SiteCopy> = {
  EN: {
    nav: {
      features: "Features",
      contact: "Contact",
      pricing: "Pricing",
      menu: "Menu",
      close: "Close",
    },
    hero: {
      headline: "One desk for the whole gym.",
      line: "Memberships, payments, and clients.",
      cta: "View Pricing",
    },
    work: {
      title: "The desk work.",
      slices: [
        {
          id: "register",
          image: "/images/work-register.png",
          alt: "Membership form on a gym front desk",
          headline: "Register a member in the time it takes to walk them to the floor.",
          body: "Short forms. No extra fields. They are on the floor before the clipboard gets lost.",
        },
        {
          id: "track",
          image: "/images/work-members.png",
          alt: "Checking membership status at the front desk",
          headline: "See who is current without opening a spreadsheet.",
          body: "Active, pending, expired. The list you actually use at the door.",
        },
        {
          id: "report",
          image: "/images/work-report.png",
          alt: "Printed weekly gym report on the counter",
          headline: "A week you can read in one sitting.",
          body: "Who joined, who lapsed, what landed. Printed or on screen.",
        },
      ],
    },
    control: {
      headline: "See who is active before they walk in.",
      body: "Live membership status. Expired, pending, paid.",
      link: "See pricing",
    },
    sinpe: {
      headline: "SINPE lands. The book updates.",
      body: "Automatic payment confirmation for Costa Rican gyms.",
    },
    contact: {
      headline: "Talk to us.",
      body: "WhatsApp, Alajuela. We help you pick a plan.",
      cta: "Message WhatsApp",
      consent:
        'By contacting us via WhatsApp, you agree to receive information about FORMA and our services. You can opt out anytime by replying "STOP".',
    },
    footer: {
      tagline: "Gym operations, Costa Rica.",
      privacy: "Privacy",
      terms: "Terms",
      rights: "All rights reserved.",
      whatsappPolicy:
        "By contacting us, you agree to receive informational messages about our gym management services. We only send relevant information about FORMA, product updates, and technical support. We never share your information with third parties. You can opt out at any time by replying STOP to any message.",
    },
    pricing: {
      headline: "Two ways to pay.",
      currency: "Currency",
      monthly: "Monthly",
      yearly: "Yearly plan",
      perMonth: "per month",
      perYear: "per year",
      saveTwoMonths: "Save two months",
      monthlyHint: "Monthly",
      getStarted: "Get started",
      features: [
        "Complete membership management",
        "Automated payment tracking",
        "Real-time dashboard",
        "Priority technical support",
        "Detailed reports",
      ],
    },
  },
  ES: {
    nav: {
      features: "Características",
      contact: "Contacto",
      pricing: "Precios",
      menu: "Menú",
      close: "Cerrar",
    },
    hero: {
      headline: "Un escritorio para todo el gimnasio.",
      line: "Membresías, pagos y clientes.",
      cta: "Ver precios",
    },
    work: {
      title: "El trabajo de escritorio.",
      slices: [
        {
          id: "register",
          image: "/images/work-register.png",
          alt: "Formulario de membresía en la recepción del gimnasio",
          headline: "Registra un miembro en el tiempo que toma llevarlo al piso.",
          body: "Formularios cortos. Sin campos de más. Están en el piso antes de que se pierda el papel.",
        },
        {
          id: "track",
          image: "/images/work-members.png",
          alt: "Revisión de membresías en recepción",
          headline: "Ve quién está al día sin abrir una hoja de cálculo.",
          body: "Activa, pendiente, vencida. La lista que usas en la puerta.",
        },
        {
          id: "report",
          image: "/images/work-report.png",
          alt: "Reporte semanal impreso en el mostrador",
          headline: "Una semana que se lee de una sentada.",
          body: "Quién entró, quién se atrasó, qué llegó. Impreso o en pantalla.",
        },
      ],
    },
    control: {
      headline: "Ve quién está activo antes de que entre.",
      body: "Estado de membresía en vivo. Vencida, pendiente, pagada.",
      link: "Ver precios",
    },
    sinpe: {
      headline: "Llega el SINPE. El libro se actualiza.",
      body: "Confirmación automática de pagos para gimnasios de Costa Rica.",
    },
    contact: {
      headline: "Hablemos.",
      body: "WhatsApp, Alajuela. Te ayudamos a elegir un plan.",
      cta: "Escribir por WhatsApp",
      consent:
        'Al contactarnos por WhatsApp, aceptas recibir información sobre FORMA y nuestros servicios. Puedes cancelar en cualquier momento respondiendo "STOP".',
    },
    footer: {
      tagline: "Operación de gimnasios, Costa Rica.",
      privacy: "Privacidad",
      terms: "Términos",
      rights: "Todos los derechos reservados.",
      whatsappPolicy:
        "Al contactarnos, usted acepta recibir mensajes informativos sobre nuestros servicios de gestión de gimnasios. Solo enviamos información relevante sobre FORMA, actualizaciones de productos y soporte técnico. Nunca compartimos su información con terceros. Puede cancelar estas comunicaciones en cualquier momento respondiendo STOP o CANCELAR.",
    },
    pricing: {
      headline: "Dos formas de pago.",
      currency: "Moneda",
      monthly: "Mensual",
      yearly: "Plan anual",
      perMonth: "por mes",
      perYear: "por año",
      saveTwoMonths: "Ahorra dos meses",
      monthlyHint: "Mensual",
      getStarted: "Comenzar",
      features: [
        "Gestión completa de membresías",
        "Seguimiento de pagos automatizado",
        "Panel de control en tiempo real",
        "Soporte técnico prioritario",
        "Reportes detallados",
      ],
    },
  },
};
