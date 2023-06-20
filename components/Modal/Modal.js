import { useMapStore, useModalStore, useUserPreferencesStore } from "../../store";
import { ModalContainer, CloseModalButton } from "./Modal.styles";
import { AiFillCloseCircle } from 'react-icons/ai'
import { centerChilds, Text } from "../../styles/Text";


export default function Modal(props) {

    const isModalOpen = useModalStore((state) => state.isModalOpen); 
    const toggleIsModalOpen = useModalStore((state) => state.toggleIsModalOpen);
    const setModalType = useModalStore((state) => state.setModalType);
    const hasEditedModal = useUserPreferencesStore((state) => state.hasEditedModal);
    const changeModalEdition = useUserPreferencesStore((state) => state.changeModalEdition);
    


    if (!props.showModal) return <></>

    return (
        <ModalContainer>
            <CloseModalButton onClick={() => {
                if(isModalOpen) toggleIsModalOpen();
                if (hasEditedModal) {
                    changeModalEdition(false);
                    window.location.reload(false);
                }
                setModalType("");
            }}>
                <Text size={2} style={centerChilds}>
                    <AiFillCloseCircle />
                </Text>
            </CloseModalButton>
            {props.children}
        </ModalContainer>
    )
}