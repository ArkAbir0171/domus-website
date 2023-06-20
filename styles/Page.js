import styled from 'styled-components'
import data from './data'


let Page = styled.div`
    display: flex;
    flex-direction: column;
    @media ${data.styles.devices.tablet} {
    }
`
let Box = styled.div`
`
let MainContent = styled.div`
    display: flex;
    flex: 1;
    background-color: ${data.styles.color.primaryMedium};
    overflow-y: scroll;
    @media ${data.styles.devices.tablet} {
    }
`

export { Page, Box, MainContent }