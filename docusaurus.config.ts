import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";
import versions from './versions.json';
import VersionsArchived from './versionsArchived.json';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...);

const config: Config = {
  title: "Mata Elang - Network Monitoring Platform",
  tagline: "Open Source Network Monitoring Platform",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://mataelang.net",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "mata-elang-stable", // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  trailingSlash: false,

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
    // path: 'i18n',
    // localeConfigs: {
    //   en: {
    //     label: 'English',
    //     direction: 'ltr',
    //     htmlLang: 'en-US',
    //     calendar: 'gregory',
    //     path: 'en',
    //   },
    //   fa: {
    //     label: 'Indonesia',
    //     direction: 'rtl',
    //     htmlLang: 'id-ID',
    //     calendar: 'gregory',
    //     path: 'id',
    //   },
    // },
  },

  markdown: {
    mermaid: true,
  },

  themes: ["@docusaurus/theme-mermaid"],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
          lastVersion: "2.0.0",
          includeCurrentVersion: false,
          versions: {
            // current: {
            //   label: "canary",
            //   path: "canary",
            //   banner: 'unreleased',
            //   badge: true,
            // },
            "2.0.0": {
              label: "2.0.0 (latest)",
              path: "2.0.0",
              badge: true,
            },
            "1.1.0": {
              label: "1.1.0",
              path: "1.1.0",
              badge: true,
            },
            "1.0.0": {
              label: "1.0.0",
              path: "1.0.0",
              badge: true,
              banner: 'unmaintained',
            }
          },
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
    // Replace with your project's social card
    image: "img/logo-me-red.png",
    navbar: {
      title: "Mata Elang Platform",
      logo: {
        alt: "Mata Elang Logo",
        src: "img/logo-me-red.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Tutorial",
        },
        { to: "/blog", label: "Blog", position: "left" },
        {
          type: 'search',
          position: 'right',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          // dropdownItemsAfter: [{to: '/versions', label: 'All versions'}],
          dropdownItemsAfter: [
            {
              type: 'html',
              value: '<hr class="dropdown-separator">',
            },
            {
              type: 'html',
              className: 'dropdown-archived-versions',
              value: '<b>Archived versions</b>',
            },
            ...VersionsArchived.map(
              (versionName) => ({
                label: versionName,
                to: `/docs/${versionName}/intro`,
              }),
            ),
            {
              type: 'html',
              value: '<hr class="dropdown-separator">',
            },
            {
              to: '/versions',
              label: 'All versions',
            },
          ],
          dropdownActiveClassDisabled: true,
          label: 'Version:',
        },
        // {
        //   type: 'localeDropdown',
        //   position: 'left',
        //   dropdownItemsAfter: [
        //     // {
        //     //   to: 'https://my-site.com/help-us-translate',
        //     //   label: 'Help us translate',
        //     // },
        //   ],
        // },
        {
          href: "https://github.com/mata-elang-stable",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Tutorial",
              to: `/docs/${versions.sort().reverse()[0]}/quick-start`,
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Cyber Security Research Group (CSRG) - PENS",
              href: "https://pens.ac.id",
            },
            {
              label: "Discord",
              href: "https://discordapp.com/invite/csrg",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/mata-elang-stable",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mata Elang. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
