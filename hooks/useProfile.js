import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import data from "../styles/data";
import { addAuth0UserToDatabase, getUserWithAuth0ID } from "../Utils/database";
import { useUserPreferencesStore } from '../store';


export default function useProfile() {
    const session = useSession();
    const [profile, setProfile] = useState(null);
    const setUserID = useUserPreferencesStore((state) => state.setUserID);

    console.log(profile);

    useEffect(() => {

        async function handleProfile() {
            console.log('session here!');
            let { data: user, error } = await getUserWithAuth0ID(session.user.id);
            if (user && user.length !== 0) {
                console.log('this is the user found by id: ', user)
                setProfile(user[0]);
                setUserID(session.user.id);
            }
            else {
                console.log('no user found, adding current user');
                let { data: user, error } = addAuth0UserToDatabase(session.user);
                console.log('inserted', user, error);
                setProfile(user);
                setUserID(session.user.id);
            }
        }
        if (session && !profile) {
            handleProfile();
        }
    }, [session])

    return {
        profile,
    };
}