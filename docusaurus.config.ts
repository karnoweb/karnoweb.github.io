import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'کارنووب',
  tagline: 'شریک رشد دیجیتال کسب‌وکارها',
  favicon: 'img/karnoweb-logo.png',

  future: {
    v4: true,
  },

  url: 'https://karnoweb.github.io',
  baseUrl: '/',
  organizationName: 'karnoweb',
  projectName: 'karnoweb.github.io',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'fa',
    locales: ['fa'],
    localeConfigs: {
      fa: {
        direction: 'rtl',
        htmlLang: 'fa-IR',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/karnoweb/karnoweb.github.io/tree/master/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/karnoweb-logo.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'کارنووب',
      logo: {
        alt: 'لوگوی کارنووب',
        src: 'img/karnoweb-logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'karnowebSidebar',
          position: 'left',
          label: 'مستندات',
        },
        {
          type: 'dropdown',
          label: 'خدمات',
          position: 'left',
          items: [
            { label: 'نمای کلی', to: '/docs/karnoweb/03-services/overview' },
            { label: 'طراحی وب‌سایت', to: '/docs/karnoweb/03-services/custom-website' },
            { label: 'فروشگاه آنلاین', to: '/docs/karnoweb/03-services/ecommerce' },
            { label: 'اپلیکیشن موبایل', to: '/docs/karnoweb/03-services/mobile-app' },
            { label: 'UI/UX', to: '/docs/karnoweb/03-services/ui-ux' },
            { label: 'سئو', to: '/docs/karnoweb/03-services/seo-service' },
            { label: 'تولید محتوا', to: '/docs/karnoweb/03-services/content-marketing' },
            { label: 'اتوماسیون', to: '/docs/karnoweb/03-services/automation' },
            { label: 'مشاوره', to: '/docs/karnoweb/03-services/startup-consulting' },
          ],
        },
        {
          type: 'dropdown',
          label: 'محصولات',
          position: 'left',
          items: [
            { label: 'نمای کلی', to: '/docs/karnoweb/04-products/overview' },
            { label: 'شاپ ERP', to: '/docs/karnoweb/04-products/shop-erp' },
            { label: 'CRM', to: '/docs/karnoweb/04-products/crm' },
            { label: 'حسابداری', to: '/docs/karnoweb/04-products/accounting' },
            { label: 'منابع انسانی', to: '/docs/karnoweb/04-products/hr-system' },
            { label: 'LMS', to: '/docs/karnoweb/04-products/lms' },
            { label: 'باشگاه مشتریان', to: '/docs/karnoweb/04-products/club-management' },
            { label: 'درخواست دمو', to: '/docs/karnoweb/04-products/demo-system' },
          ],
        },
        {
          label: 'نمونه‌کارها',
          to: '/docs/karnoweb/07-portfolio/overview',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'packagesSidebar',
          position: 'left',
          label: 'پکیج‌ها',
        },
        {
          label: 'درباره ما',
          to: '/docs/karnoweb/09-about/overview',
          position: 'left',
        },
        {
          label: 'تماس',
          to: '/docs/karnoweb/10-contact/overview',
          position: 'left',
        },
        {
          href: 'https://github.com/karnoweb',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'شرکت',
          items: [
            { label: 'درباره ما', to: '/docs/karnoweb/09-about/overview' },
            { label: 'تماس', to: '/docs/karnoweb/10-contact/overview' },
            { label: 'فرصت‌های شغلی', to: '/docs/karnoweb/13-careers/open-positions' },
          ],
        },
        {
          title: 'خدمات',
          items: [
            { label: 'نمای کلی', to: '/docs/karnoweb/03-services/overview' },
            { label: 'قیمت‌گذاری', to: '/docs/karnoweb/03-services/pricing' },
            { label: 'سوالات متداول', to: '/docs/karnoweb/03-services/faq' },
          ],
        },
        {
          title: 'محصولات',
          items: [
            { label: 'نمای کلی', to: '/docs/karnoweb/04-products/overview' },
            { label: 'مقایسه محصولات', to: '/docs/karnoweb/04-products/comparison' },
            { label: 'درخواست دمو', to: '/docs/karnoweb/04-products/demo-system' },
          ],
        },
        {
          title: 'منابع',
          items: [
            { label: 'پکیج‌های اوپن‌سورس', to: '/docs/packages' },
            { label: 'مستندات فنی', to: '/docs/karnoweb/18-technical/stack' },
            { label: 'GitHub', href: 'https://github.com/karnoweb' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} کارنووب. ساخته‌شده با Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
