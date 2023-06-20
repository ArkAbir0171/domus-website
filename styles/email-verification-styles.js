import styled from 'styled-components'
import data from './data'

let PromptBox = styled.div`
    height: max-content;
    width: max-content;
    padding: 10px;
    text-align: center;
    justify-content: center;
    background-color: ${data.styles.color.primary};
    border-radius: 5px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
    @media ${data.styles.devices.tablet} {
    }
`
let ImagedBackground = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-image: url("https://i.pinimg.com/originals/fd/91/13/fd91131ea693096d6be5e8aa99d18f9e.jpg");
    @media ${data.styles.devices.tablet} {
    }
`

let RefreshButton = styled.button`
	cursor: pointer;
    padding: 10px;
    height: max-content;
    width: max-content;
    text-align: center;
	border: none;
    border-radius: 5px;
    background-color: ${data.styles.color.secondary};
    box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
`
export { PromptBox, ImagedBackground, RefreshButton }