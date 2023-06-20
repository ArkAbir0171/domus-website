import data from "../../styles/data"
import styled from 'styled-components'


let ProfileImage = styled.img`
    height: 10%;
    aspect-ratio: 1;
    border-radius: 50%;
    margin: 50px;
    margin-left: 50%;
    transform: translateX(-50%);
    
    @media ${data.styles.devices.tablet} {
    }
`
let ChangeNameInputContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 15%;
    width: 100%;
    display: grid;
    grid-template-columns: 90% 10%;
`
let ChangeNameInput = styled.input`
    all: unset;
    background-color: transparent;
    outline: none;
    border-bottom: 1px solid ${data.styles.color.secondaryMedium};
    color: ${data.styles.color.text.lighter};
    font-size: xx-large;
    width: 90%;
    margin: auto;
    text-align: center;
 
`

let GenericModal = styled.div`
    background-color: ${data.styles.color.primary};
    position: fixed;
    height: 75%;
    width: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    word-wrap: break-word;
    overflow-y: scroll;
    @media ${data.styles.devices.tablet} {
        height: 90%;
        width: 100%;
        top: 10%;
        left: 0%;
        transform: translate(0%, 0%);
    }
`

let EditPropertyModalContainer = styled.div`
    background-color: ${data.styles.color.primary};
    position: fixed;
    height: 80%;
    width: 80%;
    top: 10%;
    left: 10%;
    padding: 10px;
    word-wrap: break-word;
    overflow-y: scroll;
    @media ${data.styles.devices.tablet} {
        height: 90%;
        width: 100%;
        top: 10%;
        left: 0%;
    }
`

let AddIssueModalContainer = styled.div`
    background-color: ${data.styles.color.primary};
    position: fixed;
    height: 80%;
    width: 80%;
    top: 10%;
    left: 10%;
    padding: 10px;
    word-wrap: break-word;
    overflow-y: scroll;
    @media ${data.styles.devices.tablet} {
        height: 90%;
        width: 100%;
        top: 10%;
        left: 0%;
    }
`

let IssueHistoryModalContainer = styled.div`
    background-color: ${data.styles.color.primary};
    position: fixed;
    height: 80%;
    width: 80%;
    top: 10%;
    left: 10%;
    padding: 10px;
    word-wrap: break-word;
    overflow-y: scroll;
    @media ${data.styles.devices.tablet} {
        height: 90%;
        width: 100%;
        top: 10%;
        left: 0%;
    }
`
let IssueHistoryOfOwnerModalContainer = styled.div`
background-color: ${data.styles.color.primary};
position: fixed;
height: 80%;
width: 80%;
top: 10%;
left: 10%;
padding: 10px;
word-wrap: break-word;
overflow-y: scroll;
@media ${data.styles.devices.tablet} {
    height: 90%;
    width: 100%;
    top: 10%;
    left: 0%;
}
`

let LoadingModalContainer = styled.div`
    background-color: ${data.styles.color.primary};
    position: fixed;
    height: 80%;
    width: 100%;     
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;

    @media ${data.styles.devices.tablet} {

    }
`

let MapBox = styled.div`
    width: 100%;
    height: 85%;
`
let EditingMapBox = styled.div`
    margin-top: 5%;
    margin-left: 20%;
    width: 60%;
    height: 60%;
    @media ${data.styles.devices.tablet} {
        margin-left: 5%;
        width: 90%;
        height: 70%;
    }
`

let SaveMarkerButtonBox = styled.div`
    width: 100%;
    height: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
`
let DeletePropertyButton = styled.button`
  
    height: 7vh;
    width: 7vh;
    background-color: ${data.styles.color.secondaryMedium};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    margin-bottom: 3vh;
    margin-top: 3vh;
    padding: 50px;
    @media ${data.styles.devices.tablet} {
        height: 5vh;
        width: 5vh;
    }
`

let FlexBox = styled.div`
    display: flex;
`

let IssueSnippetsContainer = styled.div`
    height: 75%;
    overflow-y: scroll;
    @media ${data.styles.devices.tablet} {
        height: 85%;
    }
`


let IssueSnippetContainer = styled.div`
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
let MessengerModalContainer = styled.div`
    background-color: ${data.styles.color.primary};
    position: fixed;
    height: 80%;
    width: 80%;
    top: 10%;
    left: 10%;
    padding: 10px;
    word-wrap: break-word;
    overflow-y: scroll;
    @media ${data.styles.devices.tablet} {
        height: 90%;
        width: 100%;
        top: 10%;
        left: 0%;
    }
`
let MessengerTopbar = styled.div`
    display: flex;
    height: 10%;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 1px solid ${data.styles.color.text.light}90;
    @media ${data.styles.devices.tablet} {
        height: 5%;
    }
`

let MessnegerSearchInput = styled.input`
    all: unset;
    background-color: transparent;
    outline: none;
    border-bottom: 1px solid ${data.styles.color.secondaryMedium};
    color: ${data.styles.color.text.lighter};
    font-size: x-large;
    width: 90%;
    margin: auto;
    margin-bottom: 10px;
    padding-top: 10px;
    text-align: center;
`

let MessengerThreadContainer = styled.div`
    background-color: ${data.styles.color.primary};
    height: 78%;
    width: 99%;
    padding: 10px;
    word-wrap: break-word;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    margin: auto;
    @media ${data.styles.devices.tablet} {
        height: 83%;
        width: 100%;
    }
`
let MessengerTimeStamp = styled.div`
  width: max-content;
  display: flex;
  align-items: center;
@media ${data.styles.devices.tablet} {
}
`


let MessengerProfileImage = styled.img`
    height: 90%;
    aspect-ratio: 1;
    border-radius: 50%;
    @media ${data.styles.devices.tablet} {
    }
`
let Message = styled.div`
  height: max-content;
  width: 100%;
  min-width: 10px;
  margin-bottom: 5px;
  color:  ${data.styles.color.text.lighter};
  padding: 5px;
  margin-bottom: 10px;
  border: 1px solid ${data.styles.color.text.light}40;
  &:hover{
  }
`
let MessageSenderInfo = styled.div`
  width: max-content;
  max-width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
@media ${data.styles.devices.tablet} {
}
`
let MessageProfileImage = styled.img`
    height: 30px;
    width: 30px;
    border-radius: 50%;
    @media ${data.styles.devices.tablet} {
    }
`

let MessageContent = styled.div`
  height: max-content;
  width: max-content;
  max-width: 60%;
  word-wrap: break-word;
  flex-direction: column;
  padding: 10px;
  background-color: ${data.styles.color.primaryMedium}30;
  border-radius: 5px;
@media ${data.styles.devices.tablet} {
    max-width: 90%;
}
`

let ThreadHistoryContainer = styled.div`
    height: max-content;
    width: 100%;
    display: flex;
    gap: 10px;
    padding: 10px;
    border-bottom: 1px solid ${data.styles.color.text.light}90;
  
}`


let MessengerInputContainer = styled.div`
  background-color: ${data.styles.color.primary};
  height: 10%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: auto;
  border-top: 1px solid ${data.styles.color.text.light}90;
@media ${data.styles.devices.tablet} {
    height: 10%;
    width: 100%;
}
`

let MessnegerInput = styled.input`
    all: unset;
    background-color: transparent;
    outline: none;
    border-bottom: 1px solid ${data.styles.color.secondaryMedium};
    color: ${data.styles.color.text.lighter};
    font-size: x-large;
    width: 90%;
    height: 90%;
    text-align: center;
`

export {
    ProfileImage,
    ChangeNameInputContainer,
    ChangeNameInput,

    GenericModal,

    LoadingModalContainer,

    MapBox,
    SaveMarkerButtonBox,
    EditingMapBox,

    DeletePropertyButton,

    FlexBox,

    EditPropertyModalContainer,

    AddIssueModalContainer,

    IssueHistoryModalContainer,
    IssueHistoryOfOwnerModalContainer,

    IssueSnippetsContainer,
    IssueSnippetContainer,

    MessengerModalContainer,
    MessengerTopbar,
    MessnegerSearchInput,
    MessengerThreadContainer,
    MessengerInputContainer,
    MessengerProfileImage,
    MessengerTimeStamp,
    Message,
    MessageSenderInfo,
    MessageProfileImage,
    MessageContent,
    MessnegerInput,
    ThreadHistoryContainer
}