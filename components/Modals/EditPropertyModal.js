import { centerChilds, Text } from "../../styles/Text";
import AddPropertyBox from "../AddPropertyBox/AddPropertyBox";
import { AddPropertyBoxContainer, AddPropertyInputBox, IconTextBox, Input, InputArea } from "../AddPropertyBox/AddPropertyBox.styles";
import { EditingMapBox, EditPropertyModalContainer, FlexBox, MapBox } from "./Modals.styles";
import { FaMapMarker, FaMapMarked, FaKey, FaCopy, FaInfo, FaUpload } from 'react-icons/fa'
import { MdDesktopAccessDisabled, MdOutlineDescription } from 'react-icons/md'
import { TiTick } from 'react-icons/ti'
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getRandomID } from "../../Utils/random";
import data from "../../styles/data";
import { Box } from "../../styles/Page";
import Map from '../Map/index'
import { defaultPosition } from "../../Utils/defaultPosition";
import { isEqualFloat } from "../../Utils/floatComparison";
import { useMapStore, useModalStore, useUserPreferencesStore } from "../../store";
import { AiOutlineWarning, AiOutlineUpload } from "react-icons/ai"
import { addNotificationToDatabase, deleteIssueOfProperty, updatePropertyByID } from "../../Utils/database";
import { getBangladeshTime } from "../../Utils/getBangladeshTime";

const verticallyCenterChilds = { display: "flex", alignItems: "center" };
const marginedRightText = { ...verticallyCenterChilds, marginRight: "10px" };



export default function EditPropertyModal({ property, profile }) {

    const setMarkerPosition = useMapStore((state) => state.setMarkerPosition);
    const markerPosition = useMapStore((state) => state.markerPosition);
    const changeModalEdition = useUserPreferencesStore((state) => state.changeModalEdition);
    const toggleIsModalOpen = useModalStore((state) => state.toggleIsModalOpen);



    function getPosition() {
        if (isEqualFloat(property.latitude, 0) && isEqualFloat(property.longitude, 0)) setMarkerPosition(defaultPosition);
        else setMarkerPosition({ lat: property.latitude, lng: property.longitude });
    }

    useEffect(() => {
        if(profile) getPosition();
    }, [profile])

    const router = useRouter();
    const [isuploading, setIsuploading] = useState(false);
    const [isEditingMap, setIsEditingMap] = useState(false);
    const [address, setAddress] = useState(property.address);
    const [description, setDescription] = useState(property.description);
    const [secretKey, setSecretKey] = useState(property.propertySecretKey);
    const [url, setUrl] = useState(property.url);

    async function sendNotification(description, sendNotificationTo) {
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


    async function editProperty() {


        // change the occupency of the property to be empty if the secret key is changed
        let renterID = (secretKey === property.propertySecretKey) ? property.renterID : "";
        let position = { lat: 0, longitude: 0 };
        position.lat = (isEqualFloat(markerPosition.lat, defaultPosition.lat)) ? 0 : markerPosition.lat;
        position.lng = (isEqualFloat(markerPosition.lng, defaultPosition.lng)) ? 0 : markerPosition.lng;
        let editedProperty =
        {
            propertyID: property.propertyID,
            propertySecretKey: secretKey,
            address: address,
            description: description,
            latitude: position.lat,
            longitude: position.lng,
            ownerID: profile.authID,
            url: url,
            renterID: renterID,
        };
        setIsuploading(true);

        let evicted = ((secretKey !== property.propertySecretKey) && (property.renterID !== ""));
        //evcition
        if (evicted) {
            await deleteIssueOfProperty(property.propertyID);
            let evcitionNoticeForOwner = `You evicted the renter.\nThe renter was renting a property you own @ ${property.address}`;
            let evcitionNoticeForRenter = `You were evicted from a property by the renter.\nProperty Address: @ ${property.address}\n(If you think, this was a mistake, resolve the issue with the owner. Thanks.)`;
            await sendNotification(evcitionNoticeForOwner, profile.authID);
            await sendNotification(evcitionNoticeForRenter, property.renterID);
        }
        let { updatedProperty, updateError } = await updatePropertyByID(property.propertyID, editedProperty);
        let updatetionNoticeForOwner = `You updated the property.\nProperty Address: @ ${property.address}`;
        let updatetionNoticeForRenter = `The owner updated the property you rent.\nProperty Address: @ ${property.address}`;
        if (!evicted) {
            await sendNotification(updatetionNoticeForOwner, profile.authID);
            await sendNotification(updatetionNoticeForRenter, property.renterID);
        }
        toggleIsModalOpen();
        if (updatedProperty) {
            window.location.reload(false);
        }
        setIsuploading(false);
        window.location.reload(false);
    }

    const updateButtonStyle = {
        ...centerChilds, margin: "auto",
        position: "absolute",
        bottom: 20,
        right: 20,
        padding: "5px",
        backgroundColor: data.styles.color.secondaryMedium, width: "max-content",
        zIndex: "100"
    };

    const tabStyle = {
        display: "flex", width: "50%", justifyContent: "space-around", alignItems: "center",
        padding: "10px",
        border: `1px solid ${data.styles.color.primaryMedium}`,
    }
    const selectedTabStyle =
    {
        ...tabStyle,
        backgroundColor: data.styles.color.primaryMedium,
    }



    return (
        <EditPropertyModalContainer>
            <FlexBox>
                <Box style={isEditingMap ? tabStyle : selectedTabStyle} onClick={() => { setIsEditingMap(false) }}>
                    <Text size={3} style={verticallyCenterChilds}>
                        <FaInfo />
                    </Text>
                </Box>
                <Box style={isEditingMap ? selectedTabStyle : tabStyle} onClick={() => { setIsEditingMap(true) }}>
                    <Text size={3} style={verticallyCenterChilds}>
                        <FaMapMarker />
                    </Text>
                </Box>
            </FlexBox>
            {
                !isEditingMap &&
                <AddPropertyBoxContainer>
                    <AddPropertyInputBox>
                        <FlexBox>
                            <Text size={2} style={marginedRightText}>
                                <FaMapMarked />
                            </Text>
                            <Text size={2} style={verticallyCenterChilds}>
                                Address
                            </Text>
                        </FlexBox>
                        <Input type="text" placeholder="address" spellCheck="false" value={address}
                            onChange={(event) => { setAddress(event.target.value) }}
                        />
                    </AddPropertyInputBox>

                    <AddPropertyInputBox>
                        <FlexBox>
                            <Text size={2} style={marginedRightText}>
                                <MdOutlineDescription />
                            </Text>
                            <Text size={2} style={verticallyCenterChilds}>
                                Description
                            </Text>
                        </FlexBox>
                        <InputArea type="text" placeholder="description (rent, additional info ...)"
                            spellCheck="false" value={description}
                            onChange={(event) => { setDescription(event.target.value) }}
                        />
                    </AddPropertyInputBox>
                    <AddPropertyInputBox>
                        <FlexBox style={{alignItems: "center"}}>
                            <Text size={2} style={marginedRightText}>
                                <MdOutlineDescription />
                            </Text>
                            <Text size={1} style={verticallyCenterChilds}>
                                Image
                            </Text>
                        </FlexBox>
                        <Input type="text" placeholder="Image URL)"
                            spellCheck="false" value={url}
                            onChange={(event) => { setUrl(event.target.value) }}
                        />
                    </AddPropertyInputBox>

                    <AddPropertyInputBox>
                        <IconTextBox>
                            <Text style={marginedRightText}> {"Regenerate Secret Key (Evict renter) "} </Text>
                            <Text size={1} style={marginedRightText}>
                                <FaKey onClick={() => setSecretKey(getRandomID("KEY"))} />
                            </Text>

                            <Text size={1} style={verticallyCenterChilds}>
                                <AiOutlineWarning />
                            </Text>
                        </IconTextBox>
                        <Input type="text" placeholder="SECRET KEY" spellCheck="false" value={secretKey} onChange={() => { }} />
                    </AddPropertyInputBox>
                </AddPropertyBoxContainer>
            }
            {
                isEditingMap &&
                <EditingMapBox>
                    <Text>Change Location</Text>
                    <Map address={address} position={markerPosition} draggable={true} />
                </EditingMapBox>
            }

            <AddPropertyInputBox>
                <Text size={3} style={updateButtonStyle} onClick={async () => { await editProperty() }}>
                    {isuploading ? <AiOutlineUpload /> : <TiTick />}
                </Text>
            </AddPropertyInputBox>
        </EditPropertyModalContainer>
    )
}