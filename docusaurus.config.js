const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: "Chart2Music",
    url: "http://www.chart2music.com",
    baseUrl: "/",

    i18n: {
        defaultLocale: "en",
        locales: ["en"]
    },

    presets: [
        [
            "classic",
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve("./sidebars.js")
                }
            })
        ]
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            docs: {
                sidebar: {
                    hideable: true,
                    autoCollapseCategories: true
                }
            },
            navbar: {
                items: [
                    {
                        to: "https://codepen.io/collection/BNedqm",
                        label: "Examples",
                        position: "right"
                    },
                    {
                        to: "https://www.npmjs.com/package/chart2music",
                        label: "NPM",
                        position: "right"
                    },
                    {
                        to: "https://github.com/julianna-langston/chart2music#readme",
                        label: "Github",
                        position: "right"
                    }
                ]
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme
            }
        })
};

module.exports = config;
