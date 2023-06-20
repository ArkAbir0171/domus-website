import styled from 'styled-components'
import data from '../../styles/data'


let AddPropertyBoxContainer = styled.div`

    background-color: ${data.styles.color.primary};
    word-wrap: break-word;
    margin: auto;
    overflow-y: scroll;
    width: 80%;
    height: 85%;
    padding: 10px;

    @media ${data.styles.devices.tablet} {

        padding: 20px;
        min-height: 90%;
        min-width: 90%;
    }
`
let AddPropertyInputBox = styled.div`
    background-color: ${data.styles.color.primary};
    width: 100%;
    height: max-content;
    display: flex;
    flex-direction: column;
    padding: 5px;
    gap: 1em;
`
let Input = styled.input`
    all: unset;
    background-color: transparent;
    outline: none;
    border-bottom: 1px solid ${data.styles.color.secondaryMedium};
    color: ${data.styles.color.text.lighter};
    font-size: x-large;
    width: 100%;
    margin: auto;
`
let InputArea = styled.textarea`
    all: unset;
    background-color: transparent;
    outline: none;
    border-bottom: 1px solid ${data.styles.color.secondaryMedium};
    color: ${data.styles.color.text.lighter};
    font-size: x-large;
    height: 20vh;
    width: 100%;
    margin: auto;
`
let IconTextBox = styled.div`
    display: flex;
    align-items: center;
`
export {
    AddPropertyBoxContainer,
    AddPropertyInputBox,
    Input,
    InputArea,
    IconTextBox,
}

