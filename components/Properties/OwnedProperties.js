import { useState, useEffect } from "react"
import { getPersistantState, useMapStore, useModalStore, useStorePersistance, useUserPreferencesStore } from "../../store";
import { Text, centerChilds } from "../../styles/Text";
import { getOwnedPropertiesOfUser, getUserWithAuth0ID } from "../../Utils/database";
import { IconTextBox, OwnedPropertiesBox, Property, PropertyContainer, SearchPropertyInput } from "./OwnedProperties.styles";
import Modal from "../Modal/Modal";
import MoveMapMarkerModal from "../Modals/MoveMapMarkerModal";
import Map from "../Map/index";
import { ModalTypes, showModal } from "../../Utils/useModal";
import { FaCopy, FaEye, FaHistory, FaMap, FaTrash } from "react-icons/fa";
import { BiHash } from "react-icons/bi";
import { isEqualFloat } from "../../Utils/floatComparison";
import { copyTextToClipboard } from "../../Utils/copy";
import { AiFillEdit } from "react-icons/ai";
import DeleteOwnedPropertyModal from "../Modals/DeleteOwnedPropertyModal";
import EditPropertyModal from "../Modals/EditPropertyModal";
import IssueHistoryOfOwnerModal from "../Modals/IssueHistoryOfOwnerModal";
import { FlexBox } from "../Modals/Modals.styles";
import { TiMessage } from "react-icons/ti";
import { GiCrossMark } from "react-icons/gi";
import MessengerModal from "../Modals/MessengerModal";
import { LinkItUrl } from 'react-linkify-it'

function PropertySnippet({ property, profile, openModal, setPosition, setAddress, setSelectedProperty }) {

    const setMarkerPosition = useMapStore((state) => state.setMarkerPosition);
    function openMapModal() {
        setAddress(property.address);
        let currentPosition = { lat: property.latitude, lng: property.longitude };
        setMarkerPosition(currentPosition);
        setPosition(currentPosition);
        openModal(ModalTypes.MapMarkerModal)
    }
    function openPropertyEditModal() {
        setSelectedProperty(property);
        openModal(ModalTypes.EditPropertyModal);
    }
    function openPropertyDeleteModal() {
        setSelectedProperty(property);
        openModal(ModalTypes.OwnedPropertyDeleteModal);
    }
    function openIssueHistoryOfOwnerModal() {
        setSelectedProperty(property);
        openModal(ModalTypes.IssueHistoryOfOwnerModal);
    }
    function hasMapLocation() {
        return !(isEqualFloat(property.latitude, 0) && isEqualFloat(property.longitude, 0));
    }
    function hasDescription() {
        return (property.description !== "");
    }
    function hasRenter() {
        return property.renterID !== "";
    }
    const [showSecret, setShowSecret] = useState(false);
    const [renter, setRenter] = useState("");

    async function fetchRenter() {
        const { data, error } = await getUserWithAuth0ID(property.renterID);
        if (data && data.length !== 0) setRenter(data[0]);
    }

    useEffect(() => {
        fetchRenter();
        return () => {
        }

    }, []);

    return (
        <Property style={{ display: "flex", flexDirection: "column" }}>
            <IconTextBox style={{ justifyContent: "space-between" }}>
                <Text size={1} active underline>{`Address`} </Text>
                <IconTextBox>
                    <Text size={1} style={{ ...centerChilds, justifyContent: "left", marginLeft: "10px" }}>
                        <AiFillEdit onClick={() => { openPropertyEditModal() }} />
                    </Text>
                    <Text size={1} style={{ ...centerChilds, justifyContent: "left", marginLeft: "10px" }}>
                        <FaTrash onClick={() => { openPropertyDeleteModal() }} />
                    </Text>
                </IconTextBox>
            </IconTextBox>
            <Text size={1}>{property.address}</Text>
            <Text size={1} style={{ ...centerChilds, justifyContent: "left" }}>{`owned by`} <BiHash /> {profile.name}  </Text>
            {
                hasRenter() &&
                <Text size={1} style={{ ...centerChilds, justifyContent: "left" }}>{`rented by`} <BiHash /> {renter.name}  </Text>
            }

            {hasDescription() && <Text underline active size={1}>{`Description`} </Text>}
            {hasDescription() && <LinkItUrl> <Text size={1}> {property.description} </Text> </LinkItUrl>}

            <IconTextBox>
                <Text underline active size={1}>{`Secret Key`} </Text>
                <Text size={1} style={{ ...centerChilds, justifyContent: "left", marginLeft: "10px" }}>
                    <FaEye onClick={() => { setShowSecret((state) => !state) }} />
                </Text>
                <Text size={1} style={{ ...centerChilds, justifyContent: "left", marginLeft: "10px" }}>
                    <FaCopy onClick={async () => { await copyTextToClipboard(property.propertySecretKey) }} />
                </Text>
            </IconTextBox>

            <Text size={1}> {showSecret ? property.propertySecretKey : " * * * * * * * * * * "} </Text>

            <IconTextBox>
                {hasMapLocation() && <Text underline active size={1}>{`Location`} </Text>}
                {hasMapLocation() && <Text size={1} style={{ ...centerChilds, justifyContent: "left", marginLeft: "10px" }}>
                    <FaMap onClick={() => { openMapModal() }} />
                </Text>}
            </IconTextBox>

            <IconTextBox>
                <Text underline active size={1}>{`All Issues History`} </Text>
                <Text size={1} style={{ ...centerChilds, justifyContent: "left", marginLeft: "10px" }}>
                    <FaHistory onClick={() => { openIssueHistoryOfOwnerModal() }} />
                </Text>
            </IconTextBox>
            {
                property.url && property.url !== "" &&
                <div style={{
                    marginTop: "auto",
                    flex: "1",
                    padding: "10px",
                    display: "flex",
                    alignItems: "flex-end",
                }}>
                    <img src={property.url} style={{ width: "100%", height: "20vh", marginTop: "10px" }} />
                </div>
            }
        </Property>

    )
}



export default function OwnedProperties({ profile }) {

    const modalType = useModalStore((state) => state.modalType);
    const isModalOpen = useModalStore((state) => state.isModalOpen);
    const setModalType = useModalStore((state) => state.setModalType);
    const toggleIsModalOpen = useModalStore((state) => state.toggleIsModalOpen);

    const [position, setPosition] = useState([]);
    const [address, setAddress] = useState("");
    const [inputAddress, setInputAddress] = useState("");
    const [selectedProperty, setSelectedProperty] = useState({})

    function openModal(type) {
        setModalType(type);
        toggleIsModalOpen();
    }

    function openMessengerModal() {
        openModal(ModalTypes.MessengerModal);
    }
    const [properties, setProperties] = useState([]);

    async function fetchProperties() {
        let { data, error } = await getOwnedPropertiesOfUser(profile.authID);
        if (data) setProperties(data);
    }

    useEffect(() => {
        if (profile) fetchProperties();
        return () => {
        };
    }, [profile]);

    const hasPersistance = useStorePersistance();
    const isViewingAsOwner = useUserPreferencesStore((state) => state.isViewingAsOwner);

    if (!getPersistantState(hasPersistance, isViewingAsOwner)) return null;
    function propertyFilteredByInput(property) {
        return property.address.toLowerCase().includes(inputAddress.toLowerCase());
    }


    return (
        <OwnedPropertiesBox>
            <FlexBox>
                <Text size={3}>
                    <TiMessage onClick={() => { openMessengerModal() }} />
                </Text>
                <SearchPropertyInput placeholder="address of owned property" spellCheck="false" onChange={(event) => { setInputAddress(event.target.value) }} />
            </FlexBox>
            {
                properties.filter(propertyFilteredByInput) && (properties.filter(propertyFilteredByInput).length == 0) &&
                <Text size={3} underline style={{ width: "max-content", marginLeft: "52.5%", }}>
                    <GiCrossMark />
                </Text>
            }
            <PropertyContainer>

                {
                    properties.filter(propertyFilteredByInput).map((property, index) => {
                        return (<PropertySnippet key={property.propertyID}
                            property={property}
                            profile={profile}
                            openModal={openModal}
                            setPosition={setPosition}
                            setAddress={setAddress}
                            setSelectedProperty={setSelectedProperty}
                        />)
                    })
                }
            </PropertyContainer>

            <Modal showModal={showModal(ModalTypes.MapMarkerModal, modalType, isModalOpen, setPosition)}>
                <MoveMapMarkerModal>
                    <Map address={address} position={position} />
                </MoveMapMarkerModal>
            </Modal>

            <Modal showModal={showModal(ModalTypes.EditPropertyModal, modalType, isModalOpen, setPosition)}>
                <EditPropertyModal property={selectedProperty} profile={profile} />
            </Modal>

            <Modal showModal={showModal(ModalTypes.OwnedPropertyDeleteModal, modalType, isModalOpen, setPosition)}>
                <DeleteOwnedPropertyModal property={selectedProperty} profile={profile} />
            </Modal>

            <Modal showModal={showModal(ModalTypes.MessengerModal, modalType, isModalOpen, setPosition)}>
                <MessengerModal profile={profile}>
                </MessengerModal>
            </Modal>



            <Modal showModal={showModal(ModalTypes.IssueHistoryOfOwnerModal, modalType, isModalOpen, setPosition)}>
                <IssueHistoryOfOwnerModal property={selectedProperty} profile={profile}>
                </IssueHistoryOfOwnerModal>
            </Modal>


        </OwnedPropertiesBox>
    )
}
