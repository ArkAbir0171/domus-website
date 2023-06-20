import { useState, useEffect } from "react"
import { getPersistantState, useMapStore, useModalStore, useStorePersistance, useUserPreferencesStore } from "../../store";
import { Text, centerChilds } from "../../styles/Text";
import { getRentedPropertiesOfUser, getUserWithAuth0ID } from "../../Utils/database";
import { IconTextBox, OwnedPropertiesBox, Property, PropertyContainer, SearchPropertyInput } from "./OwnedProperties.styles";
import Modal from "../Modal/Modal";
import MoveMapMarkerModal from "../Modals/MoveMapMarkerModal";
import Map from "../Map/index";
import { ModalTypes, showModal } from "../../Utils/useModal";
import { FaComment, FaCopy, FaEye, FaHistory, FaMap, FaTrash } from "react-icons/fa";
import { BiHash } from "react-icons/bi";
import { isEqualFloat } from "../../Utils/floatComparison";
import { copyTextToClipboard } from "../../Utils/copy";
import DeleteRentedPropertyModal from "../Modals/DeleteRentedPropertyModal";
import AddIssueModal from "../Modals/AddIssueModal";
import IssueHistoryModal from "../Modals/IssueHistoryModal";
import { MdOutlineReportProblem } from "react-icons/md";
import { FlexBox } from "../Modals/Modals.styles";
import { TiMessage } from "react-icons/ti";
import { GiCrossMark } from "react-icons/gi";
import { BsCashCoin } from 'react-icons/bs';
import data from "../../styles/data";
import MessengerModal from "../Modals/MessengerModal";
import { getThreadId } from "../../Utils/getThreadID";
import { LinkItUrl } from 'react-linkify-it'


function BkashLink({ link }) {
    return (
        <IconTextBox>
            <Text size={1} style={{ ...centerChilds, justifyContent: "left", marginLeft: "10px" }}>
                <BiHash />
            </Text>
            <Text style={{ marginLeft: "10px" }} underline>
                <a onClick={() => {
                    var newTab = window.open();
                    newTab.opener = null;
                    newTab.location = link.target;
                }}> {link.title} </a>
            </Text>
        </IconTextBox>
    )
}


function PropertySnippet({ property, profile, openModal, setPosition, setAddress, setSelectedProperty, setThreadID }) {

    const setMarkerPosition = useMapStore((state) => state.setMarkerPosition);
    function openMapModal() {
        setAddress(property.address);
        let currentPosition = { lat: property.latitude, lng: property.longitude };
        setMarkerPosition(currentPosition);
        setPosition(currentPosition);
        openModal(ModalTypes.MapMarkerModal)
    }

    function openPropertyDeleteModal() {
        setSelectedProperty(property);
        openModal(ModalTypes.RentedPropertyDeleteModal);
    }
    function openAddIssueModal() {
        setSelectedProperty(property);
        openModal(ModalTypes.AddIssueModal);
    }
    function openIssueHistoryModal() {
        setSelectedProperty(property);
        openModal(ModalTypes.IssueHistoryModal);
    }

    function openMessengerModal() {
        openModal(ModalTypes.MessengerModal);
        setThreadID(getThreadId(profile.authID, renter.authID))
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
        const { data, error } = await getUserWithAuth0ID(property.ownerID);
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
                        <FaTrash onClick={() => { openPropertyDeleteModal() }} />
                    </Text>
                </IconTextBox>
            </IconTextBox>
            <Text size={1}>{property.address}</Text>
            <Text size={1} style={{ ...centerChilds, justifyContent: "left" }} onClick={() => { openMessengerModal() }}>{`owned by`} <BiHash /> {renter.name}  </Text>
            {
                hasRenter() &&
                <Text size={1} style={{ ...centerChilds, justifyContent: "left" }}>{`rented by`} <BiHash /> {profile.name}  </Text>
            }

            {hasDescription() && <Text underline active size={1}>{`Description`} </Text>}
            {hasDescription() && <LinkItUrl>  <Text size={1}> {property.description} </Text> </LinkItUrl>}

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

            {/* {
                (data.bkashLinks && data.bkashLinks.length !== 0) &&
                <>
                    <IconTextBox>
                        <Text underline active size={1}>{`Payment`} </Text>
                        <Text size={1} style={{ ...centerChilds, justifyContent: "left", marginLeft: "10px" }}>
                            <BsCashCoin />
                        </Text>
                    </IconTextBox>

                    {
                        data.bkashLinks.map((link, index) => {
                            return (
                                <BkashLink key={index} link={link} />

                            )
                        })
                    }
                </>
            } */}







            <IconTextBox>
                <Text underline active size={1}>{`Create Issue/Complaint`} </Text>
                <Text size={1} style={{ ...centerChilds, justifyContent: "left", marginLeft: "10px" }}>
                    <MdOutlineReportProblem onClick={() => { openAddIssueModal() }} />
                </Text>
            </IconTextBox>

            <IconTextBox>
                <Text underline active size={1}>{`All Issues History`} </Text>
                <Text size={1} style={{ ...centerChilds, justifyContent: "left", marginLeft: "10px" }}>
                    <FaHistory onClick={() => { openIssueHistoryModal() }} />
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


export default function RentedProperties({ profile }) {



    const modalType = useModalStore((state) => state.modalType);
    const isModalOpen = useModalStore((state) => state.isModalOpen);
    const setModalType = useModalStore((state) => state.setModalType);
    const toggleIsModalOpen = useModalStore((state) => state.toggleIsModalOpen);

    const [position, setPosition] = useState([]);
    const [address, setAddress] = useState("");
    const [inputAddress, setInputAddress] = useState("");
    const [selectedProperty, setSelectedProperty] = useState({})

    const [threadId, setThreadID] = useState(null);

    function openModal(type) {
        setModalType(type);
        toggleIsModalOpen();
    }
    function openMessengerModal() {
        openModal(ModalTypes.MessengerModal);
        setThreadID(null);
    }

    const [properties, setProperties] = useState([]);

    async function fetchProperties() {
        let { data, error } = await getRentedPropertiesOfUser(profile.authID);
        if (data) setProperties(data);
    }

    useEffect(() => {
        if (profile) fetchProperties();
        return () => {
        };
    }, [profile]);

    const hasPersistance = useStorePersistance();
    const isViewingAsOwner = useUserPreferencesStore((state) => state.isViewingAsOwner);

    if (getPersistantState(hasPersistance, isViewingAsOwner)) return null;

    function propertyFilteredByInput(property) {
        return property.address.toLowerCase().includes(inputAddress.toLowerCase());
    }



    return (
        <OwnedPropertiesBox>
            <FlexBox>
                <Text size={3}>
                    <TiMessage onClick={() => { openMessengerModal() }} />
                </Text>
                <SearchPropertyInput placeholder="address of rented property" spellCheck="false" onChange={(event) => { setInputAddress(event.target.value) }} />
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
                            setThreadID={setThreadID}
                        />)
                    })
                }
            </PropertyContainer>

            <Modal showModal={showModal(ModalTypes.MessengerModal, modalType, isModalOpen, setPosition)}>
                <MessengerModal profile={profile} currentThreadID={threadId}>
                </MessengerModal>
            </Modal>



            <Modal showModal={showModal(ModalTypes.MapMarkerModal, modalType, isModalOpen, setPosition)}>
                <MoveMapMarkerModal>
                    <Map address={address} position={position} />
                </MoveMapMarkerModal>
            </Modal>

            <Modal showModal={showModal(ModalTypes.AddIssueModal, modalType, isModalOpen, setPosition)}>
                <AddIssueModal property={selectedProperty} profile={profile}>
                </AddIssueModal>
            </Modal>


            <Modal showModal={showModal(ModalTypes.IssueHistoryModal, modalType, isModalOpen, setPosition)}>
                <IssueHistoryModal property={selectedProperty} profile={profile}>
                </IssueHistoryModal>
            </Modal>

            <Modal showModal={showModal(ModalTypes.RentedPropertyDeleteModal, modalType, isModalOpen, setPosition)}>
                <DeleteRentedPropertyModal property={selectedProperty} profile={profile} />
            </Modal>


        </OwnedPropertiesBox>
    )
}