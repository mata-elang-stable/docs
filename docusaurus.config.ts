import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";
import VersionsArchived from './versionsArchived.json';
import versions from './versions.json';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const ArchivedVersionsDropdownItems = Object.entries(VersionsArchived).splice(
  0,
  5,
);

function isPrerelease(version: string) {
  return (
    version.includes('-') ||
    version.includes('alpha') ||
    version.includes('beta') ||
    version.includes('rc')
  );
}

function getLastStableVersion() {
  const lastStableVersion = versions.find((version) => !isPrerelease(version));
  if (!lastStableVersion) {
    throw new Error('unexpected, no stable version?');
  }
  return lastStableVersion;
}
const announcedVersion = getAnnouncedVersion();

function getLastStableVersionTuple(): [string, string] {
  const lastStableVersion = getLastStableVersion();
  const parts = lastStableVersion.split('.');
  if (parts.length !== 2) {
    throw new Error(`Unexpected stable version name: ${lastStableVersion}`);
  }
  return [parts[0]!, parts[1]!];
}

// The version announced on the homepage hero and announcement banner
// 3.3.2 => 3.3
// 3.0.5 => 3.0
function getAnnouncedVersion() {
  const [major, minor] = getLastStableVersionTuple();
  return `${major}.${minor}`;
}

// This probably only makes sense for the alpha/beta/rc phase, temporary
function getNextVersionName() {
  return 'Canary';
  /*
  const expectedPrefix = '2.0.0-rc.';

  const lastReleasedVersion = versions[0];
  if (!lastReleasedVersion || !lastReleasedVersion.includes(expectedPrefix)) {
    throw new Error(
      'this code is only meant to be used during the 2.0 alpha/beta/rc phase.',
    );
  }
  const version = parseInt(lastReleasedVersion.replace(expectedPrefix, ''), 10);
  return `${expectedPrefix}${version + 1}`;

   */
}


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
    locales: ["en", "id"],
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
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
          lastVersion: "current",
          versions: {
            current: {
              label: "1.1",
              path: "1.1",
            },
            2.0: {
              label: "2.0",
              path: "2.0",
              banner: "unreleased",
              badge: true
            },
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
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
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
      theme: {light: 'neutral', dark: 'forest'},
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
            ...ArchivedVersionsDropdownItems.map(
              ([versionName, versionUrl]) => ({
                label: versionName,
                href: versionUrl,
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
        {
          type: 'localeDropdown',
          position: 'left',
          dropdownItemsAfter: [
            // {
            //   to: 'https://my-site.com/help-us-translate',
            //   label: 'Help us translate',
            // },
          ],
        },
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
              to: "/docs/quick-start",
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
