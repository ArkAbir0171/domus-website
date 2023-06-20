
const screenSize = {
    mobileSmall: '320px',
    mobileMedium: '375px',
    mobileLarge: '425px',
    tablet: '768px',
    laptop: '1024px',
    laptopLarge: '1440px',
    desktop: '2560px',
};

const devices = {
    mobileS: `(max-width: ${screenSize.mobileSmall})`,
    mobileM: `(max-width: ${screenSize.mobileMedium})`,
    mobileL: `(max-width: ${screenSize.mobileLarge})`,
    tablet: `(max-width: ${screenSize.tablet})`,
    laptop: `(max-width: ${screenSize.laptop})`,
    laptopL: `(max-width: ${screenSize.laptopLarge})`,
    desktop: `(max-width: ${screenSize.desktop})`,
};

const bkashLinks = [
    {
        target: 'https://www.linkedin.com/in/youraccount/',
        title: '1',
    },
    {
        target: 'https://www.linkedin.com/in/youraccount/',
        title: '2',
    }
];



// const color = {
//     dark: "#000000",
//     light: "#FFFFFF",
//     primary: "#222932",
//     primaryMedium: "#545f6b",
//     secondary: "#C73A33",
//     secondaryMedium: "#C73A33",
//     text: {
//         light: "#99AAB5",
//         lighter: "#C0C0C0",
//         lightest: "#dddddd",
//         inverted: "#000000"
//     }
// };

const color = {
    dark: "#000000",
    light: "#FFFFFF",
    primary: "#1c1c1c",
    primaryMedium: "#232323",
    secondary: "#3FCF8E",
    secondaryMedium: "#3FCF8E",
    text: {
        light: "#99AAB5",
        lighter: "#C0C0C0",
        lightest: "#dddddd",
        inverted: "#000000"
    }
};

const data = {
    styles: {
        devices: devices,
        color: color,
    },
    bkashLinks: bkashLinks,
};

export { data as default }