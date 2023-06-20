let getThreadId = (senderID, recieverID) => {
    let computed = "thread_";
    if (senderID < recieverID) computed += senderID + "_" + recieverID;
    else computed += recieverID + "_" + senderID;
    return computed;
}
export { getThreadId }