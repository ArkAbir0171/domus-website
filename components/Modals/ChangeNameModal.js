import { useEffect, useState } from "react";
import { RiLoaderFill } from "react-icons/ri";
import { AiFillEdit, AiFillCloseCircle, AiOutlineUpload } from "react-icons/ai"; TiTick
import { TiTick, TiMail } from "react-icons/ti";
import { BiHash } from "react-icons/bi";



import { useModalStore, useUserPreferencesStore } from "../../store";
import { centerChilds, Text } from "../../styles/Text"
import { addNotificationToDatabase, changeNameOfUser, getOwnedPropertiesOfUser, getRentedPropertiesOfUser, getUserWithAuth0ID } from "../../Utils/database";
import {
    ChangeNameInput,
    ChangeNameInputContainer,
    GenericModal,
    ProfileImage
} from "./Modals.styles"
import { getBangladeshTime } from "../../Utils/getBangladeshTime";
import { getRandomID } from "../../Utils/random";






function ChangeName({ userName, userID, isUpdating, setIsUpdating }) {

    const changeModalEdition = useUserPreferencesStore((state) => state.changeModalEdition);
    const toggleIsModalOpen = useModalStore((state) => state.toggleIsModalOpen);

    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState(userName);
    const [nameInput, setNameInput] = useState("");

    async function sendNotification(description) {
        let notification = {
            notificationID: getRandomID('NOTIFICATION'),
            sentTo: userID,
            description: description,
            propertyID: null,
            propertyAddress: null,
            timestamp: getBangladeshTime(),
        };
        await addNotificationToDatabase(notification);
    }

    async function updateNameEffects() {
        const validName = nameInput && (nameInput.length > 2) && (name !== nameInput);
        if (!validName) return;

        setIsEditing(false);
        setIsUpdating(true);
        let { updatedProfile, updateError } = await changeNameOfUser(userID, nameInput);
        let description = `You changed your name from "#${userName}" to "#${nameInput}"`;
        await sendNotification(description);
        setIsUpdating(false);
        if (updatedProfile)
            setName(nameInput);
        changeModalEdition(false);
        toggleIsModalOpen();
        window.location.reload(false);
    }

    return (
        <>
            <Text size={3} style={centerChilds} onClick={() => setIsEditing(!isEditing)}>
                <BiHash />
                {isUpdating ? <AiOutlineUpload /> : name}
                {isEditing ? <AiFillCloseCircle /> : <AiFillEdit />}
            </Text>
            {
                isEditing &&
                <ChangeNameInputContainer>
                    <ChangeNameInput type="text" placeholder="name" spellCheck="false"
                        onChange={(event) => { setNameInput(event.target.value) }}
                    />
                    <Text size={2} onClick={async () => {
                        await updateNameEffects();
                    }}>
                        <TiTick />
                    </Text>
                </ChangeNameInputContainer>
            }
        </>
    )



}




export default function ChangeNameModal({ profile }) {
    const userID = useUserPreferencesStore((state) => state.userID);
    const user = profile;
    const [isUpdating, setIsUpdating] = useState(false);
    const [ownedPropertyCount, setOwnedPropertyCount] = useState(0);
    const [rentedPropertyCount, setRentedPropertyCount] = useState(0);




    async function getandSetOwnedPropertyCount() {
        let { data, error } = await getOwnedPropertiesOfUser(profile.authID);
        if (data) setOwnedPropertyCount(data.length);
    }


    async function getandSetRentedPropertyCount() {
        let { data, error } = await getRentedPropertiesOfUser(profile.authID);
        if (data) setRentedPropertyCount(data.length);
    }



    useEffect(() => {
        getandSetOwnedPropertyCount();
        getandSetRentedPropertyCount();
    }, []);

    return (
        <GenericModal>
            <ProfileImage src={"/default_profile_picture.png"} alt={user.name} />
            <ChangeName userName={user.name} userID={userID} isUpdating={isUpdating} setIsUpdating={setIsUpdating} />
            <Text size={2} style={centerChilds}>
                <TiMail />
                {user.authUser.email}
            </Text>
            <Text style={centerChilds}>
                <BiHash /> {`you own ${ownedPropertyCount} properties.`}
            </Text>
            <Text style={centerChilds}>
                <BiHash /> {`you rent ${rentedPropertyCount} properties.`}
            </Text>
        </GenericModal>

    )

}