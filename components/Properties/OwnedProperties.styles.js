import styled from 'styled-components'
import data from '../../styles/data'


let OwnedPropertiesBox = styled.div`

    background-color: ${data.styles.color.primary};
    word-wrap: break-word;
    margin: auto;
    overflow-y: scroll;
    width: 100%;
    height: 98%;
    padding: 10px;

    @media ${data.styles.devices.tablet} {
        padding: 20px;
    }
`
let PropertyContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1em;
    background-color: ${data.styles.color.primary};
    word-wrap: break-word;
    margin: auto;
    overflow-y: scroll;
    width: 100%;
    max-height: 90%;
    padding: 10px;
    @media ${data.styles.devices.tablet} {
        grid-template-columns: 1fr;
        padding: 20px;
    }
`
let SearchPropertyInput = styled.input`
    all: unset;
    background-color: transparent;
    outline: none;
    border-bottom: 1px solid ${data.styles.color.secondaryMedium};
    color: ${data.styles.color.text.lighter};
    font-size: xx-large;
    margin-bottom: 10px;
    margin-left: 30%;
    margin-right: 25%;
    text-align: center;
    width: 45%;
    height: 7.5%;


    @media ${data.styles.devices.tablet} {     
        width: 95%;
        margin-left: 5%;
        margin-right: 0%;

    }
`
let Property = styled.div`
    background-color: ${data.styles.color.primary};
    border: 1px solid ${data.styles.color.text.light}80;
    height: max-content;
    height: 100%;
    padding: 20px;
    &:hover
    {
        border: 1px solid ${data.styles.color.text.light};
    }
`
let IconTextBox = styled.div`
    display: flex;
    align-items: center;
`
export { OwnedPropertiesBox, SearchPropertyInput, PropertyContainer, Property, IconTextBox }