import { useRouter } from "next/router";
import { FaTrash, FaUpload } from "react-icons/fa";
import { centerChilds, Text } from "../../styles/Text";
import { addNotificationToDatabase, deleteIssueOfProperty, deleteOwnedPropertyByID } from "../../Utils/database";
import { DeletePropertyButton, GenericModal } from "./Modals.styles";
import { useModalStore } from "../../store"
import { useState } from "react";
import { getRandomID } from "../../Utils/random";
import { getBangladeshTime } from "../../Utils/getBangladeshTime";

export default function DeleteOwnedPropertyModal({ property, profile }) {
    let router = useRouter();


    const toggleIsModalOpen = useModalStore((state) => state.toggleIsModalOpen);
    const [isDeleting, setIsDeleting] = useState(false);


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


    async function deleteProperty() {
        let deletionDescription = `You removed a property to the list of your owned properties.\nProperty Address: @ ${property.address}`;
        let deletionDescriptionToRenter = `A property you rented has been removed from the website.\nProperty Address: @ ${property.address}\n(if you think this was a mistake, talk to the owner.)`;
        setIsDeleting(true);
        const { data, error } = await deleteOwnedPropertyByID(property.propertyID);
        await deleteIssueOfProperty(property.propertyID);
        await sendNotification(deletionDescription, property.ownerID);
        if (property.renterID && property.renterID !== "") {
            await sendNotification(deletionDescriptionToRenter, property.renterID);
        }
        setIsDeleting(false);
        toggleIsModalOpen();
        window.location.reload(false);


    }
    return (
        <GenericModal style={{ height: "max-content" }}>
            <Text style={centerChilds}>
                {`Click the button to remove the property @address "`}
                {`${property.address}`}
                {`" from the list of your owned properties!`}
            </Text>
            <DeletePropertyButton onClick={async () => { await deleteProperty() }}>
                <Text size={3} style={centerChilds}>
                    {isDeleting ? <FaUpload /> : <FaTrash />}
                </Text>
            </DeletePropertyButton>
        </GenericModal>
    )
}