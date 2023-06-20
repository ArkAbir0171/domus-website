import { useEffect, useState } from "react";
import { Text } from "../../styles/Text";
import { getNotificationsOfUser } from "../../Utils/database";
import { getTimeDateString } from "../../Utils/getBangladeshTime";
import { NotifcationSnippet, NotificationsContainer } from "./notifications.styles";

export default function Notifcations({ profile }) {

    let [notifications, setNotifications] = useState(null);

    async function fetchNotifications() {
        let { data: retrieved, error } = await getNotificationsOfUser(profile.authID);
        let all = retrieved;
        all.sort(function (a, b) { return b.timestamp - a.timestamp });
        setNotifications(all);
    }


    useEffect(() => {
        if (profile) fetchNotifications();
        return () => {
        }

    }, [profile]);


    return (
        <NotificationsContainer>


            {
                notifications &&
                notifications.map((notification, index) => {
                    return (
                        <NotifcationSnippet key={notification.notificationID}>
                            <Text>
                                {notification.description}
                            </Text>
                            <Text size={1}>
                                {getTimeDateString(notification.timestamp)}
                            </Text>
                        </NotifcationSnippet>

                    )

                })
            }

        </NotificationsContainer>
    )
}