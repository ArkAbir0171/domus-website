import styled from 'styled-components'
import data from './data'


let fontFamily = "'Yanone Kaffeesatz', sans-serif";
let fonts = ['2.5vmin', '4.5vmin', '6vmin', '7.5vmin'];
let fontsSmaller = ['5vmin', '6vmin', '7.5vmin', '9vmin'];

let getFontSize = (fontIndex, isSmallerDevice) => {
    if (!fontIndex) fontIndex = 0;
    else fontIndex = fontIndex - 1;
    return (isSmallerDevice ? fontsSmaller[fontIndex] : fonts[fontIndex]);
};

// props : 
// size : null or (1 - 5) : Number
// active : null or true/false
// underline : null or true/false
// underlineOnHover : null or true/false


let Text = styled.p`
    cursor: pointer;
    font-size: ${({ size }) => (getFontSize(size))};
    font-family: ${fontFamily};
    text-decoration: ${({ underline }) => (underline ? "underline" : "none")};
    color:  ${({ active }) => (active ? `${data.styles.color.text.lightest}` : `${data.styles.color.text.lighter}`)};
    line-height: 1.3;
    height: max-content;
    white-space: pre-line;
    > a {
        color: ${data.styles.color.secondary};
        text-decoration: underline;
    }
    &:hover{
        text-decoration: ${({ underlineOnHover, underline }) => ((underlineOnHover || underline) ? "underline" : "none")};
    }
    @media ${data.styles.devices.tablet} {
        font-size: ${({ size }) => (getFontSize(size, true))};
    }

`
const centerChilds = { display: "flex", justifyContent: "center", alignItems: "center" };

export { Text, centerChilds}