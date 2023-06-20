import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { ImNotification } from 'react-icons/im'
import { RiAddCircleFill } from 'react-icons/ri'


import {
    getPersistantState,
    useStorePersistance,
    useUserPreferencesStore
} from "../../store";
import { Text } from "../../styles/Text";
import { NavbarContainer, NavbarMain, NavLink, centerChilds } from "./BottomNavbar.styles";
import { useSupabaseClient } from "@supabase/auth-helpers-react";



export default function BottomNavigationBar() {
    const supabase = useSupabaseClient();

    const hasPersistance = useStorePersistance();
    const isViewingAsOwner = useUserPreferencesStore((state) => state.isViewingAsOwner);


    const PAGES =
    {
        ADD_OWNED_PROPERTY: 'ADD_OWNED_PROPERTY',
        ADD_RENTED_PROPERTY: 'ADD_RENED_PROPERTY',
        HOME: 'HOME',
        NOTIFICATION: 'NOTIFICATION',
    }
    const Router = useRouter();
    const [currentPage, setCurrentPage] = useState(PAGES.HOME);

    useEffect(() => {
        if (!Router.pathname) return;
        if (Router.pathname.includes('add-rented-property')) setCurrentPage(PAGES.ADD_RENTED_PROPERTY);
        else if (Router.pathname.includes('add-owned-property')) setCurrentPage(PAGES.ADD_OWNED_PROPERTY);
        else if (Router.pathname.includes('notifications')) setCurrentPage(PAGES.NOTIFICATION);
        else if (Router.pathname.includes('owner-complaint-notifications')) setCurrentPage(PAGES.OWNER_NOTIFICATION);
        else setCurrentPage(PAGES.HOME);
    }, [Router.pathname]);

    useEffect(() => {
        if (isViewingAsOwner && currentPage === PAGES.ADD_RENTED_PROPERTY) Router.push('/add-owned-property');
        if (!isViewingAsOwner && currentPage === PAGES.ADD_OWNED_PROPERTY) Router.push('/add-rented-property');
    }, [isViewingAsOwner]);

    async function logout()
    {
        await supabase.auth.signOut();
        Router.reload();
    }



    return (
        <NavbarContainer>
            <NavbarMain>
                {
                    getPersistantState(hasPersistance, isViewingAsOwner) ?
                        <NavLink active={(currentPage === PAGES.ADD_OWNED_PROPERTY)} onClick={() => { Router.push('/add-owned-property') }}>
                            <Text size={3} style={centerChilds}>
                                <RiAddCircleFill />
                            </Text>
                        </NavLink>
                        :
                        <NavLink active={(currentPage === PAGES.ADD_RENTED_PROPERTY)} onClick={() => { Router.push('/add-rented-property') }}>
                            <Text size={3} style={centerChilds}>
                                <RiAddCircleFill />
                            </Text>
                        </NavLink>
                }


                <NavLink active={(currentPage === PAGES.HOME)} onClick={() => { Router.push('/') }}>
                    <Text size={3} style={centerChilds}>
                        <FaHome />
                    </Text>
                </NavLink>


                <NavLink active={(currentPage === PAGES.NOTIFICATION)} onClick={() => { Router.push('/notifications') }}>
                    <Text size={3} style={centerChilds}>
                        <ImNotification />
                    </Text>
                </NavLink>



                <NavLink onClick={async () => { await logout() }}>
                    <Text size={3} style={centerChilds}>
                        <AiOutlineLogout />
                    </Text>
                </NavLink>

            </NavbarMain>
        </NavbarContainer >

    )
}
