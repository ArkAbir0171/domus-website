import styled from 'styled-components'
import data from '../../styles/data';


const profileBarHeight = "10vh";
const profileBarWidth = "100vw";



let ProfileBar = styled.div`
    display: flex;
    align-items: center;
    height: ${profileBarHeight};
    width:  ${profileBarWidth};
    background-color: ${data.styles.color.primary};
`

let ProfileImage = styled.img`
    height: 50%;
    aspect-ratio: 1;
    border-radius: 50%;
    margin: 20px;
    @media ${data.styles.devices.tablet} {
    }
`
let ConvertButton = styled.button`
    margin: 20px;
    margin-left: auto;
    background-color: ${data.styles.color.secondaryMedium};
    color: white;
    border-radius: 15px;
    &:hover {
        scale: 1.1;
    }
    @media ${data.styles.devices.tablet} {
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
`


export { ProfileBar, ProfileImage, NavLink, ConvertButton }