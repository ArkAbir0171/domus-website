import { IssueHistoryOfOwnerModalContainer, FlexBox, IssueSnippetContainer, IssueSnippetsContainer } from "./Modals.styles";
import { TiArrowBack, TiMessage, TiTick } from 'react-icons/ti'
import { useEffect, useState } from "react";
import { getRandomID } from "../../Utils/random";
import data from "../../styles/data";
import { useModalStore, useUserPreferencesStore } from "../../store";
import { ISSUE_STATUS } from "../../Utils/issueTypes";
import { AiOutlineReload, AiOutlineUpload } from 'react-icons/ai'
import Select from 'react-select'
import { centerChilds, Text } from "../../styles/Text";
import { addHistoryToDatabase, addNotificationToDatabase, changeStatusOfIssue, getHistoryOfIssue, getIssuesOfProperty, setClosingTimeOfIssue } from "../../Utils/database";
import { getBangladeshTime, getTimeDateString } from "../../Utils/getBangladeshTime";
import { Box } from "../../styles/Page";
import { FaClock, FaHistory, FaInfo, FaMapMarker } from "react-icons/fa";
import { AiFillCaretUp } from 'react-icons/ai';
import { AddPropertyInputBox, InputArea } from "../AddPropertyBox/AddPropertyBox.styles";
import { MdInfo, MdOutlineDescription } from "react-icons/md";
import { GiCrossMark } from "react-icons/gi";



const filterTypes = [
    { value: 'ALL', label: '🔎 All issues' },
    { value: ISSUE_STATUS.CREATED, label: '➕ Created issues' },
    { value: ISSUE_STATUS.SEEN, label: '👁️‍🗨️ Seen by owner' },
    { value: ISSUE_STATUS.ONGOING, label: '🔨 Ongoing issues' },
    { value: ISSUE_STATUS.CLOSED, label: '❌ Closed issues' },
];

const issueTypes = [
    { value: ISSUE_STATUS.CREATED, label: '➕ Created' },
    { value: ISSUE_STATUS.SEEN, label: '👁️‍🗨️ Seen' },
    { value: ISSUE_STATUS.ONGOING, label: '🔨 Ongoing' },
    { value: ISSUE_STATUS.CLOSED, label: '❌ Closed' },
];


const PAGE_TYPES =
{
    SNIPPET: 'SNIPPET',
    INFO: 'INFO',
    UPDATE: 'UPDATE',
    HISTORY: 'HISTORY',
};
const verticallyCenterChilds = { display: "flex", alignItems: "center" };
const marginedRightText = { ...verticallyCenterChilds, marginRight: "10px" };

const updateButtonStyle = {
    ...centerChilds, margin: "auto",
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: "5px",
    backgroundColor: data.styles.color.secondaryMedium, width: "max-content",
    zIndex: "100"
};




const IssueTypeSelectStyle = {
    menuList: styles => ({
        ...styles, background: data.styles.color.primaryMedium,
        minWidth: "max-content",
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? data.styles.color.primary : data.styles.color.primaryMedium,
        color: data.styles.color.text.lightest,
        minWidth: "max-content",
    }),
    menu: base => ({
        ...base, background: data.styles.color.primaryMedium,
        minWidth: "max-content",
        width: "40%",
    }),
    control: styles => ({
        ...styles,
        backgroundColor: data.styles.color.primaryMedium,
        color: data.styles.color.text.lightest,
        border: "none",
        minWidth: "max-content",
        maxWidth: "max-content"
    }),
    singleValue: (provided, state) => ({
        ...provided,
        color: data.styles.color.text.lightest,
        textAlign: "center",
        minWidth: "max-content",
    })

}

const FILTER_TYPES =
{
    ...ISSUE_STATUS,
    ALL: "ALL",
}

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

export default function IssueHistoryOfOwnerModal({ property, profile }) {


    const toggleIsModalOpen = useModalStore((state) => state.toggleIsModalOpen);
    const userID = useUserPreferencesStore((state) => state.userID);

    const [retrievedIssues, setRetrievedIssues] = useState(null);
    const [histories, setCurrentHistories] = useState(null);
    const [filteredIssues, setFilteredIssues] = useState(null);
    const [filterType, setFIlterType] = useState(FILTER_TYPES.ALL);
    const [currentIssueTypes, setCurrentIssueTypes] = useState(FILTER_TYPES);

    const [pageType, setPageType] = useState(PAGE_TYPES.SNIPPET);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [isuploading, setIsuploading] = useState(false);


    const [message, setMessage] = useState("");
    const [currentStatus, setCurrentStatus] = useState("");
    const [issueUpdateError, setIssueUpdateError] = useState(null);


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




    function getIssueSelectionLabel(issueType) {
        for (let i = 0; i < issueTypes.length; i++) {
            if (issueType === issueTypes[i].value) return issueTypes[i];
        }
        return {};
    }


    async function fetchIssues() {
        const { issues, error } = await getIssuesOfProperty(property.propertyID);
        if (issues) {
            issues.sort(function (a, b) { return b.issuedAt - a.issuedAt })
            setRetrievedIssues(issues);
            setFilteredIssues(issues);
        }
    }

    async function addHistory(issueID, action, message, timestamp) {
        let history = {
            historyID: getRandomID('HISTORY'),
            creatorID: profile.authID,
            issueID: issueID,
            action: action,
            message: message,
            timestamp: timestamp,
        };
        let { data, error } = await addHistoryToDatabase(history);
    }

    async function fetchHistories(issueID) {
        let { data: retrievedHistories, error } = await getHistoryOfIssue(issueID);
        retrievedHistories.sort(function (a, b) { return b.timestamp - a.timestamp });
        setCurrentHistories(retrievedHistories);
    }

    async function updateIssueState() {
        if (currentStatus === '') {
            let availableIssueTypesString = '';
            for (let i = 0; i < currentIssueTypes.length; i++) {
                availableIssueTypesString += " " + currentIssueTypes[i].label + " | ";
            }
            let error = `you haven't chosen a state for the current issue. Choose from these options : ${availableIssueTypesString}`
            setIssueUpdateError(error);
            return;
        }
        setIsuploading(true);
        // change the status of the propperty-issue to currentStatus
        let { updatedIssue, updateError } = await changeStatusOfIssue(selectedIssue.id, currentStatus);
        let closingTime = (currentStatus === ISSUE_STATUS.CLOSED) ? getBangladeshTime() : null;
        let { updatedIssue: closingTimeUpdated, updateError: closingTimeUpdateError } = await setClosingTimeOfIssue(selectedIssue.id, closingTime);
        setIsuploading(false);


        let action = `changed issue status from "${getIssueSelectionLabel(selectedIssue?.currentStatus).label}" to "${getIssueSelectionLabel(currentStatus).label}"`
        let ownerMotificationDescription = `You ${action} for issue, titled "${selectedIssue.title}"\nThe issue was in the property you currently own @ ${property.address}`;
        let renterMotificationDescription = `The owner ${action} for issue, titled "${selectedIssue.title}"\nThe issue was in the property you currently rent @ ${property.address}`;

        await addHistory(selectedIssue?.id, action, message, getBangladeshTime());
        await sendNotification(ownerMotificationDescription, profile.authID);
        await sendNotification(renterMotificationDescription, property.renterID);

        setMessage("");
        toggleIsModalOpen();
    }


    useEffect(() => {
        fetchIssues();
        return () => {
        }

    }, []);

    function filterIssues() {

        let filtered;
        if (filterType === FILTER_TYPES.ALL) {
            filtered = retrievedIssues;
            filtered?.sort(function (a, b) { return b.issuedAt - a.issuedAt });
            setFilteredIssues(filtered);
        }
        else if (filterType === FILTER_TYPES.CREATED) {
            filtered = retrievedIssues?.filter(issue => issue.currentStatus === FILTER_TYPES.CREATED);
            filtered?.sort(function (a, b) { return b.issuedAt - a.issuedAt });
            setFilteredIssues(filtered);
        }
        else if (filterType === FILTER_TYPES.SEEN) {
            filtered = retrievedIssues?.filter(issue => issue.currentStatus === FILTER_TYPES.SEEN);
            filtered?.sort(function (a, b) { return b.issuedAt - a.issuedAt });
            setFilteredIssues(filtered);
        }
        else if (filterType === FILTER_TYPES.ONGOING) {
            filtered = retrievedIssues?.filter(issue => issue.currentStatus === FILTER_TYPES.ONGOING);
            filtered?.sort(function (a, b) { return b.issuedAt - a.issuedAt });
            setFilteredIssues(filtered);
        }
        else if (filterType === FILTER_TYPES.CLOSED) {
            filtered = retrievedIssues?.filter(issue => issue.currentStatus === FILTER_TYPES.CLOSED);
            filtered?.sort(function (a, b) { return b.issuedAt - a.issuedAt });
            setFilteredIssues(filtered);
        }

    }

    useEffect(() => {
        setIssueUpdateError(null);
    }, [currentStatus]);


    useEffect(() => {
        filterIssues();
    }, [filterType]);



    useEffect(() => {
        if (selectedIssue) {
            // fetch all the history of the current issue and set it to the state
            fetchHistories(selectedIssue.id);
        }

    }, [selectedIssue])

    useEffect(() => {
        if (selectedIssue) {


            // if created, can change to seen, ongoing or closed, directly
            if (selectedIssue.currentStatus === ISSUE_STATUS.CREATED) {
                setCurrentIssueTypes([
                    issueTypes[1],
                    issueTypes[2],
                    issueTypes[3]
                ]);
            }
            // if seen, can change to ongoing or closed
            if (selectedIssue.currentStatus === ISSUE_STATUS.SEEN) {
                setCurrentIssueTypes([
                    issueTypes[2],
                    issueTypes[3]
                ]);
            }
            // if ongoing, can change to ongoing (with an update message) or closed
            if (selectedIssue.currentStatus === ISSUE_STATUS.ONGOING) {
                setCurrentIssueTypes([
                    issueTypes[2],
                    issueTypes[3]
                ]);
            }
            // if closed, can change to ongoing (essesntially re-opening the issue)
            if (selectedIssue.currentStatus === ISSUE_STATUS.CLOSED) {
                setCurrentIssueTypes([
                    issueTypes[2],
                ]);
            }
        }

        else {
            setCurrentIssueTypes(null);
        }
    }, [selectedIssue])




    return (
        <IssueHistoryOfOwnerModalContainer>

            {/* snippet */}
            {
                (pageType === PAGE_TYPES.SNIPPET) &&
                <>
                    <Select options={filterTypes}
                        isSearchable={false}
                        styles={IssueTypeSelectStyle}
                        defaultValue={filterTypes[0]}
                        onChange={(selected) => { setFIlterType(selected.value) }}
                    />
                    <Text size={2} underline style={{ width: "max-content", maxWidth: "100%", margin: "auto", marginTop: "10px" }}>
                        {`"${filterType?.toLowerCase()} issues" of the property @address : ${JSON.stringify(property.address)} are shown below.`}
                    </Text>

                    <IssueSnippetsContainer>
                        {
                            filteredIssues && (filteredIssues.length == 0) &&
                            <Text size={3} underline style={{ width: "max-content", maxWidth: "100%", margin: "auto", marginTop: "10px" }}>
                                <GiCrossMark />
                            </Text>
                        }

                        {
                            filteredIssues &&
                            filteredIssues.map((current, index) => {
                                return (
                                    <IssueSnippetContainer key={current.id} onClick={() => { setSelectedIssue(current); setPageType(PAGE_TYPES.INFO) }}>
                                        <Text>
                                            {index + 1}. {current.title}
                                        </Text>
                                        <Text>
                                            {getTimeDateString(current.issuedAt)}
                                        </Text>
                                    </IssueSnippetContainer>
                                )

                            })
                        }
                        {
                            !filteredIssues &&
                            <Text size={3} underline style={{ width: "max-content", maxWidth: "100%", margin: "auto", marginTop: "10px" }}>
                                <AiOutlineReload />
                            </Text>
                        }
                    </IssueSnippetsContainer>
                </>
            }

            {/* INFO */}
            {
                (pageType === PAGE_TYPES.INFO) &&
                <>
                    <FlexBox>
                        <Text size={2} style={{ width: "max-content", maxWidth: "100%" }}>
                            <TiArrowBack onClick={() => { setPageType(PAGE_TYPES.SNIPPET); setSelectedIssue(null) }} />
                        </Text>
                    </FlexBox>
                    <FlexBox>
                        <Box style={selectedTabStyle} onClick={() => { setPageType(PAGE_TYPES.INFO); }}>
                            <Text size={3} style={verticallyCenterChilds}>
                                <FaInfo />
                            </Text>
                        </Box>
                        <Box style={tabStyle} onClick={() => { setPageType(PAGE_TYPES.UPDATE); }}>
                            <Text size={3} style={verticallyCenterChilds}>
                                <AiFillCaretUp />
                            </Text>
                        </Box>
                        <Box style={tabStyle} onClick={() => { setPageType(PAGE_TYPES.HISTORY); }}>
                            <Text size={3} style={verticallyCenterChilds}>
                                <FaHistory />
                            </Text>
                        </Box>
                    </FlexBox>




                    <AddPropertyInputBox>
                        <FlexBox>
                            <Text size={1} style={marginedRightText}>
                                <MdOutlineDescription />
                            </Text>
                            <Text size={1} style={verticallyCenterChilds}>
                                Title :  {selectedIssue.title}
                            </Text>
                        </FlexBox>
                    </AddPropertyInputBox>


                    {
                        selectedIssue.description !== "" &&
                        <AddPropertyInputBox>
                            <FlexBox>
                                <Text size={1} style={marginedRightText}>
                                    <MdOutlineDescription />
                                </Text>
                                <Text size={1} style={verticallyCenterChilds}>
                                    Description :
                                </Text>
                            </FlexBox>
                            <Text size={1} style={verticallyCenterChilds}>
                                {selectedIssue.description}
                            </Text>
                        </AddPropertyInputBox>
                    }


                    <AddPropertyInputBox>
                        <FlexBox>
                            <Text size={1} style={verticallyCenterChilds}>
                                Status :
                            </Text>
                            <Text size={1} style={verticallyCenterChilds}>
                                {getIssueSelectionLabel(selectedIssue.currentStatus).label}
                            </Text>
                        </FlexBox>

                        <FlexBox>
                            <Text size={1} style={marginedRightText}>
                                <MdOutlineDescription />
                            </Text>
                            <Text size={1} style={verticallyCenterChilds}>
                                Issued at :  {getTimeDateString(selectedIssue.issuedAt)}
                            </Text>
                        </FlexBox>
                        {
                            (selectedIssue.currentStatus === ISSUE_STATUS.CLOSED) &&
                            <FlexBox>
                                <Text size={1} style={marginedRightText}>
                                    <MdOutlineDescription />
                                </Text>
                                <Text size={1} style={verticallyCenterChilds}>
                                    Issued closed at :  {getTimeDateString(selectedIssue.issueClosedAt)}
                                </Text>
                            </FlexBox>
                        }
                    </AddPropertyInputBox>
                </>

            }

            {/* update */}
            {
                (pageType === PAGE_TYPES.UPDATE) &&
                <>
                    <FlexBox>
                        <Text size={2} style={{ width: "max-content", maxWidth: "100%" }}>
                            <TiArrowBack onClick={() => {
                                setCurrentStatus("");
                                setMessage("");
                                setPageType(PAGE_TYPES.SNIPPET);
                                setFIlterType(FILTER_TYPES.ALL);
                                setSelectedIssue(null);
                                setCurrentIssueTypes(FILTER_TYPES);
                            }} />
                        </Text>
                    </FlexBox>
                    <FlexBox>
                        <Box style={tabStyle} onClick={() => { setPageType(PAGE_TYPES.INFO); }}>
                            <Text size={3} style={verticallyCenterChilds}>
                                <FaInfo />
                            </Text>
                        </Box>
                        <Box style={selectedTabStyle} onClick={() => { setPageType(PAGE_TYPES.UPDATE); }}>
                            <Text size={3} style={verticallyCenterChilds}>
                                <AiFillCaretUp />
                            </Text>
                        </Box>
                        <Box style={tabStyle} onClick={() => { setPageType(PAGE_TYPES.HISTORY); }}>
                            <Text size={3} style={verticallyCenterChilds}>
                                <FaHistory />
                            </Text>
                        </Box>
                    </FlexBox>

                    {
                        issueUpdateError && <Text style={{ marginTop: "10px" }}> {issueUpdateError} </Text>
                    }

                    <AddPropertyInputBox style={{ marginTop: "10px" }}>
                        <Select options={currentIssueTypes}
                            isSearchable={false}
                            styles={IssueTypeSelectStyle}
                            defaultValue={getIssueSelectionLabel(currentStatus)}
                            onChange={(selected) => {
                                setCurrentStatus(selected.value);
                            }}
                        />
                        <FlexBox>
                            <Text size={1} style={marginedRightText}>
                                <MdOutlineDescription />
                            </Text>
                            <Text size={1} style={{ ...verticallyCenterChilds, marginRight: "10px" }}>
                                Message to the renter after updating the issue (optional)
                            </Text>
                        </FlexBox>
                        <InputArea type="text" placeholder="message to renter (optional) ..."
                            spellCheck="false" value={message}
                            onChange={(event) => { setMessage(event.target.value) }}
                        />
                    </AddPropertyInputBox>

                    <AddPropertyInputBox>
                        <Text size={3} style={updateButtonStyle} onClick={async () => {
                            await updateIssueState();
                        }}>
                            {isuploading ? <AiOutlineUpload /> : <TiTick />}
                        </Text>
                    </AddPropertyInputBox>
                </>
            }

            {/* History */}
            {
                (pageType === PAGE_TYPES.HISTORY) &&
                <>
                    <FlexBox>
                        <Text size={2} style={{ width: "max-content", maxWidth: "100%" }}>
                            <TiArrowBack onClick={() => { setPageType(PAGE_TYPES.SNIPPET); setSelectedIssue(null) }} />
                        </Text>
                    </FlexBox>
                    <FlexBox>
                        <Box style={tabStyle} onClick={() => { setPageType(PAGE_TYPES.INFO); }}>
                            <Text size={3} style={verticallyCenterChilds}>
                                <FaInfo />
                            </Text>
                        </Box>
                        <Box style={tabStyle} onClick={() => { setPageType(PAGE_TYPES.UPDATE); }}>
                            <Text size={3} style={verticallyCenterChilds}>
                                <AiFillCaretUp />
                            </Text>
                        </Box>
                        <Box style={selectedTabStyle} onClick={() => { setPageType(PAGE_TYPES.HISTORY); }}>
                            <Text size={3} style={verticallyCenterChilds}>
                                <FaHistory />
                            </Text>
                        </Box>
                    </FlexBox>
                    <IssueSnippetsContainer>

                        {
                            histories &&
                            histories.map((history, index) => {
                                return (
                                    <IssueSnippetContainer key={history.historyID} style={{ flexDirection: "column" }}>

                                        <FlexBox>
                                            <Text size={1} style={marginedRightText}>
                                                <MdInfo />
                                            </Text>
                                            <Text size={1}>
                                                Action : {`${profile.authID === history.creatorID ? "You" : "The renter"} ${history.action}`}
                                            </Text>
                                        </FlexBox>

                                        {
                                            (history.message !== "") &&
                                            <FlexBox>
                                                <Text size={1} style={marginedRightText}>
                                                    <TiMessage />
                                                </Text>
                                                <Text size={1} style={verticallyCenterChilds}>
                                                    Message : {history.message}
                                                </Text>
                                            </FlexBox>

                                        }
                                        <FlexBox>
                                            <Text size={1} style={marginedRightText}>
                                                <FaClock />
                                            </Text>
                                            <Text size={1} style={verticallyCenterChilds}>
                                                Time : {getTimeDateString(history.timestamp)}
                                            </Text>
                                        </FlexBox>

                                    </IssueSnippetContainer>
                                )

                            })
                        }
                    </IssueSnippetsContainer>

                </>

            }

        </IssueHistoryOfOwnerModalContainer >
    )
}