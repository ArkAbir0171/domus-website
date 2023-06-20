import data from "../../styles/data"
import styled from 'styled-components'


const ModalContainer = styled.div`
    background-color: rgb(0,0,0, 0.9);
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    @media ${data.styles.devices.tablet} {
        background-color: ${data.styles.color.primary};
    }
`
const CloseModalButton = styled.button`
    position: fixed;
    display: flex;
    justify-content: center;
    background-color: ${data.styles.color.secondaryMedium};
    margin: 1.5vh;
    border-radius: 50%;
    right: 0;
    @media ${data.styles.devices.tablet} {
    }
`
export { ModalContainer, CloseModalButton }