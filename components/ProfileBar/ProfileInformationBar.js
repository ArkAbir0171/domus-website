
import { useUserPreferencesStore, useStorePersistance, getPersistantState, useModalStore } from "../../store"
import { centerChilds, Text } from "../../styles/Text";
import ChangeNameModal from "../Modals/ChangeNameModal";
import { BiHash } from "react-icons/bi";


import { ProfileBar, ProfileImage, ConvertButton } from "./ProfileInformationBar.style";

import Modal from '../Modal/Modal'
import { AiFillEye } from "react-icons/ai";
import { showModal, ModalTypes } from "../../Utils/useModal";



export default function ProfileInformationBar({ profile }) {

    const hasPersistance = useStorePersistance();

    const isViewingAsOwner = useUserPreferencesStore((state) => state.isViewingAsOwner);
    const toggleViewerMode = useUserPreferencesStore((state) => state.toggleViewerMode);

    const modalType = useModalStore((state) => state.modalType);
    const setModalType = useModalStore((state) => state.setModalType);

    const isModalOpen = useModalStore((state) => state.isModalOpen);
    const toggleIsModalOpen = useModalStore((state) => state.toggleIsModalOpen);

    function openModal(type) {
        setModalType(type);
        toggleIsModalOpen();

    }
    // if(!profile || !profile.authUser) return null;

    return (
        <ProfileBar>
            <ProfileImage src={"/default_profile_picture.png"} alt={profile?.name}
                onClick={() => { openModal(ModalTypes.ChaneNameModal) }} />
            <Text size={1} style={centerChilds} onClick={() => { openModal(ModalTypes.ChaneNameModal) }}  > <BiHash />
                {profile?.name} {getPersistantState(hasPersistance, isViewingAsOwner) ? " (owner) " : " (renter) "}</Text>
            <ConvertButton onClick={() => { getPersistantState(hasPersistance, toggleViewerMode)() }}>
                <Text size={1} style={centerChilds} active={true}>
                    <AiFillEye />
                    {getPersistantState(hasPersistance, isViewingAsOwner) ? " View as Renter" : " View as Owner"}
                </Text>
            </ConvertButton>

            <Modal showModal={showModal(ModalTypes.ChaneNameModal, modalType, isModalOpen)}>
                <ChangeNameModal profile={profile} />
            </Modal>

        </ProfileBar>
    )
}
