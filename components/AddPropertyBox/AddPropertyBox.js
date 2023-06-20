import { centerChilds, Text } from "../../styles/Text";
import { AddPropertyBoxContainer, AddPropertyInputBox, IconTextBox, Input, InputArea } from "./AddPropertyBox.styles";
import { FaMapMarker, FaMapMarked, FaKey, FaCopy } from 'react-icons/fa'
import { MdDesktopAccessDisabled, MdOutlineDescription } from 'react-icons/md'
import { TiTick } from 'react-icons/ti'
import { useEffect, useState } from "react";
import data from "../../styles/data";
import { getRandomID } from "../../Utils/random";
import { copyTextToClipboard } from "../../Utils/copy.js";
import { getPersistantState, useMapStore, useModalStore, useStorePersistance, useUserPreferencesStore } from "../../store";
import { ModalTypes, showModal } from "../../Utils/useModal";
import Modal from "../Modal/Modal";
import Map from '../../components/Map/index'
import MoveMapMarkerModal from "../Modals/MoveMapMarkerModal";
import { addNotificationToDatabase, addPropertyToDatabase } from "../../Utils/database";
import Loader from "../Modal/Loader";
import { useRouter } from "next/router";
import { isEqualFloat } from "../../Utils/floatComparison";
import { defaultPosition } from "../../Utils/defaultPosition";
import { getBangladeshTime } from "../../Utils/getBangladeshTime";



function RenterPrompt() {


    const verticallyCenterChilds = { display: "flex", alignItems: "center" };
    const marginedRightText = { ...verticallyCenterChilds, marginRight: "10px" };


    return <>
        <AddPropertyBoxContainer style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Text size={1} style={verticallyCenterChilds}>
                <MdDesktopAccessDisabled style={marginedRightText} />
                {"Viewing as renter, can't add property"}
            </Text>
        </AddPropertyBoxContainer>
    </>

}





export default function AddPropertyBox({ profile }) {

    const router = useRouter();

    const [isuploading, setIsuploading] = useState(false);

    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [secretKey, setSecretKey] = useState(getRandomID("KEY"));
    const [url, setUrl] = useState("");

    const verticallyCenterChilds = { display: "flex", alignItems: "center" };
    const marginedRightText = { ...verticallyCenterChilds, marginRight: "10px" };
    const textIconButton = {
        ...centerChilds, marginLeft: "auto",
        marginTop: "10px",
        backgroundColor: data.styles.color.secondaryMedium, width: "max-content",
    };
    const markerPosition = useMapStore((state) => state.markerPosition);
    const setMarkerPosition = useMapStore((state) => state.setMarkerPosition);




    const modalType = useModalStore((state) => state.modalType);
    const setModalType = useModalStore((state) => state.setModalType);

    const isModalOpen = useModalStore((state) => state.isModalOpen);
    const toggleIsModalOpen = useModalStore((state) => state.toggleIsModalOpen);

    function openModal(type) {
        setModalType(type);
        setMarkerPosition(defaultPosition);
        toggleIsModalOpen();

    }

    useEffect(() => {
        setMarkerPosition(defaultPosition);
    }, [setMarkerPosition])


    const hasPersistance = useStorePersistance();
    const isViewingAsOwner = useUserPreferencesStore((state) => state.isViewingAsOwner);

    async function sendNotification(property, description, sendNotificationTo) {
        let notification = {
            notificationID: getRandomID('NOTIFICATION'),
            sentTo: sendNotificationTo,
            description: description,
            propertyID: property.propertyID,
            propertyAddress: property.address,
            timestamp: getBangladeshTime(),
        };
        await addNotificationToDatabase(notification);
    }


    async function addProperty() {

        if (address === "") return;
        let position = { lat: 0, longitude: 0 };
        position.lat = (isEqualFloat(markerPosition.lat, defaultPosition.lat)) ? 0 : markerPosition.lat;
        position.lng = (isEqualFloat(markerPosition.lng, defaultPosition.lng)) ? 0 : markerPosition.lng;


        let property =
        {
            propertyID: getRandomID("PROPERTY"),
            propertySecretKey: secretKey,
            address: address,
            url: url,
            description: description,
            latitude: position.lat,
            longitude: position.lng,
            ownerID: profile.authID,
            renterID: "",
        };
        setIsuploading(true);
        let additionDescription = `You added a property to the list of your owned properties.\nProperty Address: @ ${property.address}`;
        let response = await addPropertyToDatabase(property);
        await sendNotification(property, additionDescription, profile.authID);
        setIsuploading(false);
        if (response.insertedProperty) router.push('/');
    }
    if (!getPersistantState(hasPersistance, isViewingAsOwner)) return <RenterPrompt />

    if (isuploading)
        return <Loader prompt={"adding property to dashboard."} />







    return (
        <AddPropertyBoxContainer>

            <AddPropertyInputBox>
                <Text size={2} style={verticallyCenterChilds}>
                    <FaMapMarked />
                </Text>
                <Input type="text" placeholder="address" spellCheck="false"
                    onChange={(event) => { setAddress(event.target.value) }}
                />
            </AddPropertyInputBox>

            <AddPropertyInputBox>
                <InputArea type="text" placeholder="description (rent, additional info ...)"
                    spellCheck="false"
                    onChange={(event) => { setDescription(event.target.value) }}
                />
            </AddPropertyInputBox>
            <AddPropertyInputBox>
                <IconTextBox>
                    <Text size={2} style={verticallyCenterChilds}> <MdOutlineDescription /> </Text>
                    <Text> {"Image URL "} </Text>
                </IconTextBox>
                <Input type="text" placeholder="image url" spellCheck="false" value={url} onChange={(e) => { setUrl(e.target.value) }} />
            </AddPropertyInputBox>

            <AddPropertyInputBox>
                <IconTextBox>
                    <Text style={marginedRightText}> {"Generate Secret Key "} </Text>
                    <Text size={1} style={marginedRightText}>
                        <FaKey onClick={() => setSecretKey(getRandomID("KEY"))} />
                    </Text>
                    <Text size={1} style={verticallyCenterChilds}>
                        <FaCopy onClick={async () => { await copyTextToClipboard(secretKey) }} />
                    </Text>
                </IconTextBox>
                <Input type="text" placeholder="SECRET KEY" spellCheck="false" value={secretKey} onChange={() => { }} />
            </AddPropertyInputBox>


            <AddPropertyInputBox>
                <IconTextBox>
                    <Text style={marginedRightText}> {"Pin exact location (optional) "} </Text>
                    <Text size={2} style={verticallyCenterChilds}>
                        <FaMapMarker onClick={() => openModal(ModalTypes.MoveMapMarkerModal)} />
                    </Text>
                </IconTextBox>
            </AddPropertyInputBox>


            <AddPropertyInputBox>
                <Text size={3} style={textIconButton} onClick={async () => {
                    await addProperty();
                }}>
                    <TiTick />
                </Text>
            </AddPropertyInputBox>



            <Modal showModal={showModal(ModalTypes.MoveMapMarkerModal, modalType, isModalOpen)}>
                <MoveMapMarkerModal>
                    <Map draggable={true} address={address} />
                </MoveMapMarkerModal>
            </Modal>


        </AddPropertyBoxContainer>
    )
}
