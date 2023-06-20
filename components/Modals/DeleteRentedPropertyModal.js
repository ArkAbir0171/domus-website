import { useRouter } from "next/router";
import { FaTrash, FaUpload } from "react-icons/fa";
import { centerChilds, Text } from "../../styles/Text";
import { addNotificationToDatabase, deleteIssueOfProperty, deleteOwnedPropertyByID, updatePropertyRenterID } from "../../Utils/database";
import { DeletePropertyButton, GenericModal } from "./Modals.styles";
import { useModalStore } from "../../store"
import { useState } from "react";
import { getRandomID } from "../../Utils/random";
import { getBangladeshTime } from "../../Utils/getBangladeshTime";

export default function DeleteRentedPropertyModal({ property, profile }) {
    let router = useRouter();


    const toggleIsModalOpen = useModalStore((state) => state.toggleIsModalOpen);
    const [isDeleting, setIsDeleting] = useState(false);

    async function sendNotification(description, sendNotificationTo)
    {
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
        setIsDeleting(true);
        let deletionDescription =  `You removed a property to the list of your rented properties.\nProperty Address: @ ${property.address}`;
        const { updatedProperty, updateError } = await updatePropertyRenterID(property.propertyID, profile = { authID: "" });
        await deleteIssueOfProperty(property.propertyID);
        await sendNotification(deletionDescription, property.renterID);
        setIsDeleting(false);
        toggleIsModalOpen();
        window.location.reload(false);


    }
    return (
        <GenericModal style={{ height: "max-content" }}>
            <Text style={centerChilds}>
                {`Click the button to remove the property @address "`}
                {`${property.address}`}
                {`" from the list of your rented properties!`}
            </Text>
            <Text style={centerChilds}>
                {`(All the issues and issue history will be removed.)`}
            </Text>
            <DeletePropertyButton onClick={async () => { await deleteProperty() }}>
                <Text size={3} style={centerChilds}>
                    {isDeleting ? <FaUpload /> : <FaTrash />}
                </Text>
            </DeletePropertyButton>
        </GenericModal>
    )
}