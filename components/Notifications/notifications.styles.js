import styled from 'styled-components'
import data from '../../styles/data'


let NotificationsContainer = styled.div`

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

let NotifcationSnippet = styled.div`
    display: flex;
    background-color: ${data.styles.color.primary};
    width: 75%;
    padding: 5px;
    margin: auto;
    margin-top: 5px;
    justify-content: space-between;
    border: 1px solid ${data.styles.color.text.light}80;
 
    &:hover {
        border: 1px solid ${data.styles.color.text.light};
    }
    @media ${data.styles.devices.tablet} {
        width: 100%;
    }
`

export {
    NotificationsContainer,
    NotifcationSnippet
}