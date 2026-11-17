export type Lang = 'zh' | 'en';

export interface Flavor {
  name: string;
  desc: string;
}

/** A gift set in the shop. `id` matches the photo key in `photos.ts`. */
export interface Product {
  id: string;
  name: string;
  price: string;
  badge: string;
  flavors: Flavor[];
  /** Alt text for each photo when the card is a carousel, in photo order. */
  photoLabels?: string[];
}

/** A themed party package. `id` matches the photo key in `photos.ts`. */
export interface PartyPackage {
  id: string;
  name: string;
  sizes: string;
  photoLabels?: string[];
}

export interface Step {
  n: number;
  title: string;
  body: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface NutritionPanel {
  key: string;
  name: string;
  servingCal: string;
  per100Cal: string;
  servingProtein: string;
  per100Protein: string;
  servingFat: string;
  per100Fat: string;
  servingSatFat: string;
  per100SatFat: string;
  servingTransFat: string;
  per100TransFat: string;
  servingCarb: string;
  per100Carb: string;
  servingSugar: string;
  per100Sugar: string;
  servingSodium: string;
  per100Sodium: string;
  ingredients: string;
}

export interface Strings {
  metaTitle: string;
  metaDescription: string;
  ogImageAlt: string;
  mainNavLabel: string;
  skipToContent: string;
  navShop: string;
  navStory: string;
  navProcess: string;
  navFaq: string;
  navCta: string;
  navPackages: string;
  menuOpen: string;
  menuClose: string;
  heroTitle: string;
  heroBody: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroNote: string;
  badge1: string;
  badge2: string;
  badge3: string;
  badge4: string;
  scheduleLead: string;
  scheduleBody: string;
  orderFlavorsLabel: string;
  shopEyebrow: string;
  shopTitle: string;
  shopNoteA: string;
  shopNoteB: string;
  shopNoteC: string;
  storyEyebrow: string;
  storyTitle: string;
  storyP1: string;
  storyP2: string;
  storyIgLink: string;
  processEyebrow: string;
  processTitle: string;
  pkgEyebrow: string;
  pkgTitle: string;
  pkgIntro: string;
  pkgCta: string;
  pkgSize15: string;
  pkgSize21: string;
  pkgSize30: string;
  pkgMoreA: string;
  pkgMoreLink: string;
  pkgMoreB: string;
  dmForPricing: string;
  prevPhoto: string;
  nextPhoto: string;
  photoN: string;
  followEyebrow: string;
  followTitle: string;
  followBody: string;
  followCta: string;
  faqEyebrow: string;
  faqTitle: string;
  contactEyebrow: string;
  contactTitle: string;
  contactP1: string;
  contactP3: string;
  formName: string;
  formNamePh: string;
  formDate: string;
  formMessage: string;
  formMessagePh: string;
  formSendLine: string;
  formSendIg: string;
  formSendEmail: string;
  formError: string;
  formSuccessLine: string;
  formSuccessLineDesktop: string;
  formSuccessIg: string;
  formSuccessEmail: string;
  formEmailFallback: string;
  formBlocked: string;
  formOpenLine: string;
  lineQrLink: string;
  lineQrOpened: string;
  formOpenIg: string;
  formOpenEmail: string;
  formSubjectPrefix: string;
  formNameLine: string;
  formDateLine: string;
  formNoDetails: string;
  footerBlurb: string;
  footerShopHead: string;
  footerGiftSets: string;
  footerPackages: string;
  footerCustom: string;
  footerCompanyHead: string;
  footerContact: string;
  footerFollowHead: string;
  footerCopyright: string;
  orderHint: string;
  orderMsgLabel: string;
  orderLineCta: string;
  orderIgCta: string;
  orderEmailCta: string;
  orderEmailSubject: string;
  orderIgCopied: string;
  orderLineDesktop: string;
  copyFailed: string;
  orderCancel: string;
  copyBtn: string;
  copiedBtn: string;
  followLineCta: string;
  contactChannels: string;
  contactIgBtn: string;
  contactLineBtn: string;
  contactEmailBtn: string;
  nutritionEyebrow: string;
  nutritionTitle: string;
  nutritionServingsLabel: string;
  nutritionCalories: string;
  nutritionProtein: string;
  nutritionFat: string;
  nutritionSatFat: string;
  nutritionTransFat: string;
  nutritionCarb: string;
  nutritionSugar: string;
  nutritionSodium: string;
  allergenNote1: string;
  allergenNote2: string;
  nutritionPerServing: string;
  nutritionPer100g: string;
  nutritionServingSize: string;
  ingredientsLabel: string;
  nutritionBack: string;
}

export interface SiteContent {
  lang: Lang;
  /** Value of the html `lang` attribute and of `hreflang`. */
  htmlLang: string;
  strings: Strings;
  products: Product[];
  packages: PartyPackage[];
  steps: Step[];
  faqs: Faq[];
  nutrition: NutritionPanel[];
  /** The pre-written message for a gift set. */
  productMessage: (name: string, priceDisplay: string) => string;
  /** The pre-written message for a party package. */
  packageMessage: (name: string, sizes: string) => string;
}
