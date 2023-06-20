import { useEffect, useRef, useState } from 'react'
import {
    FlexBox, Message, MessengerInputContainer, MessengerModalContainer,
    MessengerProfileImage, MessengerThreadContainer,
    MessengerTopbar, MessnegerSearchInput,
    MessengerTimeStamp,
    MessageSenderInfo,
    MessageProfileImage,
    MessageContent,
    MessnegerInput,
    ThreadHistoryContainer
} from './Modals.styles'
import { centerChilds, Text } from '../../styles/Text';
import { TiArrowBack } from 'react-icons/ti';
import { BiBorderBottom, BiHash } from 'react-icons/bi';
import { AiOutlineSend } from 'react-icons/ai';
import { getThreadId } from '../../Utils/getThreadID';
import { addThreadToDatabase, getAllThreadsOfSelf, getAllUsers, getThread, getThreadMessages, getUserWithAuth0ID, sendMessageToDatabase, updateThreadByID } from '../../Utils/database';
import { getBangladeshTime, getTimeDateString } from '../../Utils/getBangladeshTime';
import { supabase } from '../../supabaseClient';
import data from '../../styles/data';




const createMessageID = () => {
    // create a unique id of 25 characters
    return Math.random().toString(36).substr(2, 25);
}


const messages = [
];


const MODES =
{
    THREAD_OPEN: 'THREAD_OPEN',
    THREAD_CLOSED: 'THREAD_CLOSED',
    THREAD_SEARCHING: 'THREAD_SEARCHING'
};



function MessageContainer({ message, isSelfMessage }) {
    if (isSelfMessage === true) {
        return (
            <Message>
                <MessageSenderInfo style={{ marginLeft: "auto" }}>
                    <MessengerTimeStamp>
                        {message.timestamp}
                    </MessengerTimeStamp>
                    <Text style={{ ...centerChilds, wordBreak: 'break-all' }}>
                        <BiHash />
                        {message.senderName}
                    </Text>
                    <MessageProfileImage src={"/default_profile_picture.png"} alt={message.senderName} />
                </MessageSenderInfo>
                <MessageContent style={{ marginLeft: "auto" }}>
                    <Text>
                        {message.content}
                    </Text>
                </MessageContent>
            </Message>
        )
    }
    else {
        return (
            <Message>
                <MessageSenderInfo>
                    <MessageProfileImage src={"/default_profile_picture.png"} alt={message.senderName} />
                    <Text style={centerChilds}>
                        <BiHash />
                        {message.senderName}
                    </Text>
                    <MessengerTimeStamp>
                        {message.timestamp}
                    </MessengerTimeStamp>
                </MessageSenderInfo>
                <MessageContent>
                    <Text>
                        {message.content}
                    </Text>
                </MessageContent>
            </Message>
        )
    }
}

function Thread({ profile, threadID, setThreadID, setSearchInput }) {


    let scrollTextRef = useRef();
    const [currentThread, setCurrentThread] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [self, setSelf] = useState(null);
    const [sendTo, setSendTo] = useState(null);
    let [messages, setMessages] = useState([]);

    useEffect(() => {
        scrollTextRef?.current?.scrollIntoView({ behavior: 'smooth' });;
    }, [messages]);



    async function fetchOrCreateThread(threadID) {

        let { data, error } = await getThread(threadID);
        if (data && data.length !== 0) {
            setCurrentThread(data[0]);
        }
        else {
            await addThreadToDatabase(threadID, "", getBangladeshTime());
        }
    }

    useEffect(() => {
        if (threadID) fetchOrCreateThread(threadID);
    }, [threadID]);

    async function updateUsers(threadID) {
        if (!threadID) return;


        let senderID = profile.authID;
        let sender = await getUserWithAuth0ID(senderID);
        sender = sender.data[0];
        setSelf(sender);
        let recieverID = getRecieverID(threadID, profile.authID);
        let reciever = await getUserWithAuth0ID(recieverID);
        reciever = reciever.data[0];
        setSendTo(reciever);

    }

    useEffect(() => {
        if (currentThread) {
            updateUsers(currentThread.threadID);

        }
    }, [currentThread]);

    async function fetchMessages(threadID) {
        let { data, error } = await getThreadMessages(threadID);
        console.log('messages', data);
        let fetchedMessages = data;
        console.log('ahh', fetchedMessages);
        if (!fetchMessages) return;
        setMessages([]);

        for (let i = 0; i < fetchedMessages.length; i++) {

            const newMessage = fetchedMessages[i];
            let time = getTimeDateString(parseInt(newMessage.timestamp));
            let senderName = '';
            let recieverName = '';
            if (self?.authID == newMessage.senderID) {
                senderName = self?.name;
                recieverName = sendTo?.name;
            }
            else {
                senderName = sendTo?.name;
                recieverName = self?.name;
            }

            let newMessageObject = {
                id: newMessage.messageID,
                senderID: newMessage.senderID,
                senderName: senderName,
                recieverID: newMessage.recieverID,
                recieverName: recieverName,
                content: newMessage.content,
                timestamp: time
            }
            setMessages((messages) => [...messages, newMessageObject]);

        }

    }

    useEffect(() => {
        if (currentThread && self && sendTo) {
            console.log('calm down');
            fetchMessages(currentThread.threadID);

        }
    }, [currentThread, self, sendTo]);


    useEffect(() => {
        const channel = supabase
            .channel("*")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                (payload) => {
                    const newMessage = payload.new;
                    let time = getTimeDateString(parseInt(newMessage.timestamp));
                    let senderName = '';
                    let recieverName = '';
                    if (self?.authID == newMessage.senderID) {
                        senderName = self?.name;
                        recieverName = sendTo?.name;
                    }
                    else {
                        senderName = sendTo?.name;
                        recieverName = self?.name;
                    }

                    let newMessageObject = {
                        id: newMessage.messageID,
                        senderID: newMessage.senderID,
                        senderName: senderName,
                        recieverID: newMessage.recieverID,
                        recieverName: recieverName,
                        content: newMessage.content,
                        timestamp: time
                    }
                    setMessages((messages) => [...messages, newMessageObject]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };

    }, [supabase, self, sendTo]);



    function getRecieverID(threadID, currentUserID) {
        let IDS = threadID.split('_');
        if (IDS[1] === currentUserID) return IDS[2];
        else return IDS[1];
    }

    async function sendMessage(content) {
        let messageID = createMessageID();
        let senderID = profile.authID;
        let recieverID = getRecieverID(threadID, senderID);
        let timestamp = getBangladeshTime();

        let message = {
            messageID,
            senderID,
            recieverID,
            threadID,
            content,
            timestamp
        }
        await sendMessageToDatabase(message);
        await updateThreadByID(threadID, content, timestamp);
        setCurrentMessage('');
    }

    useEffect(() => {

        console.log('updated users', 'self', self, 'sendTo', sendTo);

    }, [sendTo, self])



    return (
        <MessengerModalContainer>
            <MessengerTopbar>
                <Text size={1} style={{ width: "max-content" }} onClick={() => { setThreadID(null); setSearchInput(''); }}>
                    <TiArrowBack /> Back
                </Text>
                <MessengerProfileImage src={"/default_profile_picture.png"} alt={sendTo?.name} />
                <Text size={1} style={{ width: "max-content", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <BiHash />
                    {sendTo?.name}
                </Text>
            </MessengerTopbar>
            <MessengerThreadContainer>
                {
                    messages.map((message, index) => {
                        return (<MessageContainer key={index} message={message} isSelfMessage={(message.senderID === self?.authID)} />)
                    })
                }
                <Text ref={scrollTextRef}></Text>
            </MessengerThreadContainer>
            <MessengerInputContainer>
                <MessnegerInput type="text" placeholder={`Message #${sendTo?.name}`}
                    value={currentMessage} onChange={(event) => { setCurrentMessage(event.target.value) }}
                    spellCheck="false"
                    onKeyDown={async (event) => {
                        if (event.key === 'Enter') {
                            if (currentMessage !== '') {
                                await sendMessage(currentMessage);
                            }
                        }

                    }}
                />
                <Text size={3} style={centerChilds}
                    onClick={async () => {
                        if (currentMessage !== '') {
                            await sendMessage(currentMessage);
                        }
                    }}
                >
                    <AiOutlineSend />
                </Text>
            </MessengerInputContainer>

        </MessengerModalContainer>
    )

}


export default function MessengerModal({ profile, currentThreadID }) {



    //

    const [currentMode, setCurrentMode] = useState(MODES.THREAD_CLOSED);
    const [threadID, setThreadID] = useState(currentThreadID);
    const [searchInput, setSearchInput] = useState('');
    const [users, setUsers] = useState([]);
    const [allThreads, setAllThreads] = useState([]);


    useEffect(() => {
        if (threadID) {
            setCurrentMode(MODES.THREAD_OPEN);
        }
        else
            setCurrentMode(MODES.THREAD_CLOSED);
    }, [threadID]);



    useEffect(() => {
        if (searchInput !== '')
            setCurrentMode(MODES.THREAD_SEARCHING);
        else
            setCurrentMode(MODES.THREAD_CLOSED);

    }, [searchInput]);

    async function fetchUsers() {
        let { data } = await getAllUsers();
        setUsers(data);
    }

    useEffect(() => {
        fetchUsers();
    }, []);


    async function fetchThreadsOfUser() {
        let ID = profile.authID;
        let { data, error } = await getAllThreadsOfSelf(ID);
        let newThreads = [];
        console.log('thread Data', data);
        for (let i = 0; i < data?.length; i++) {
            let threadID = data[i].threadID;
            let splitted = threadID.split('_');
            let recieverID = splitted[1];
            if (recieverID === ID) {
                recieverID = splitted[2];
            }
            let reciever = await getUserWithAuth0ID(recieverID);
            reciever = reciever.data[0];
            let newThread = {
                threadID: threadID,
                threadName: reciever.name,
                lastMessageContent: data[i].lastMessageContent,
                timestamp: data[i].lastUpdationTime,
            }
            newThreads.push(newThread);
        }
        setAllThreads(newThreads);
        console.log('okat', allThreads);
    }

    useEffect(() => {
        if (profile && profile.authID) {
            fetchThreadsOfUser();
        }
    }, [currentMode, profile])



    function usersFilteredByInput(user) {
        return ((user.name.toLowerCase().includes(searchInput.toLowerCase())) && (user.authID !== profile.authID));
    }





    if (currentMode === MODES.THREAD_OPEN || threadID) {
        return (
            <Thread profile={profile} threadID={threadID} setThreadID={setThreadID} setSearchInput={setSearchInput} />
        )

    }
    else if (currentMode === MODES.THREAD_CLOSED) {
        return (
            <MessengerModalContainer>
                <FlexBox>
                    <MessnegerSearchInput type="text" placeholder="🔎 search user" spellCheck="false"
                        value={searchInput} onChange={(event) => { setSearchInput(event.target.value) }} />
                </FlexBox>
                {
                    allThreads.map((thread, index) => {
                        return (
                            <ThreadHistoryContainer>
                                <MessageProfileImage src={"/default_profile_picture.png"} alt={thread.threadName} />
                                <div style={{ width: "100%" }}>
                                    <Text onClick={() => { setThreadID(thread.threadID) }} style={{
                                        width: "100%",
                                        borderBottom: `1px solid #ffffff10`
                                    }
                                    }>
                                        {thread.threadName}
                                    </Text>
                                    <Text>
                                        {
                                            thread.threadID.lastMessageContent > 25 ? thread.lastMessageContent.substring(0, 25) + '...' : thread.lastMessageContent
                                        }
                                    </Text>
                                    <p style={{ color: data.styles.color.text.lighter }}>
                                        {
                                            getTimeDateString(parseInt(thread.timestamp))
                                        }
                                    </p>

                                </div>
                            </ThreadHistoryContainer>
                        )
                    })
                }


            </MessengerModalContainer>
        )

    }
    else if (currentMode === MODES.THREAD_SEARCHING) {
        return (
            <MessengerModalContainer>
                <FlexBox>
                    <MessnegerSearchInput type="text" placeholder="🔎 search user" spellCheck="false"
                        value={searchInput} onChange={(event) => { setSearchInput(event.target.value) }} />
                </FlexBox>
                {
                    users.filter(usersFilteredByInput).map((user, index) => {
                        return (
                            <MessageSenderInfo>
                                <MessageProfileImage src={"/default_profile_picture.png"} alt={user.name} />

                                <Text key={user.authID} style={centerChilds} onClick={() => { setThreadID(getThreadId(profile.authID, user.authID)) }}>
                                    <BiHash />
                                    {user.name}
                                </Text>
                            </MessageSenderInfo>


                        )

                    })
                }
            </MessengerModalContainer>
        )
    }


}
