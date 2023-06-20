import styled from 'styled-components'
import data from '../../styles/data';


const navbarHeight = "10vh";
const navbarWidth = "100vw";



let NavbarContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${navbarHeight};
    width:  ${navbarWidth};
    background-color: ${data.styles.color.primary};
`

let NavbarMain = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    grid-gap: 1em;
    height: 100%;
    width: 50%;
    padding: 15px;
    border-bottom: 1px solid ${data.styles.color.text.lighter}20;
    @media ${data.styles.devices.tablet} {
        width: 100%;
    }
`

let fontFamily = "'Yanone Kaffeesatz', sans-serif";
let NavLink = styled.div`
    width: min-content;
    height: min-content;
    min-height: 100%;
    aspect-ratio: 1;
    max-width: 22.5%;
    font-size: xx-large;
    cursor: pointer;
    font-family: ${fontFamily};
    display: flex;
    align-items: center;
    justify-content: center;
    // {active == true : if the page is in the current link}
    color:  ${({ active }) => (active ? `${data.styles.color.text.lightest}` : `${data.styles.color.text.lighter}`)};
    background-color: ${({ active }) => (active ? `${data.styles.color.secondaryMedium}` : ` ${data.styles.color.primary}`)};
    border-radius: 10px;

    &:hover {
        scale: 1.1;
    }
`

const centerChilds = { display: "flex", justifyContent: "center", alignItems: "center" };

export { NavbarContainer, NavbarMain, NavLink, centerChilds }