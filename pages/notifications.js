import React from 'react';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import BottomNavigationBar from '../components/BottomNavigation/BottomNavigationBar';
import { MainContent, Page } from '../styles/Page';
import ProfileInformationBar from '../components/ProfileBar/ProfileInformationBar';
import { addAuth0UserToDatabase, getUserWithAuth0ID } from '../Utils/database';
import Notifcations from '../components/Notifications/notificationsBox';
import useProfile from '../hooks/useProfile';


export default function ComplaintNotifications({ }) {

  let { profile } = useProfile();
  
  return (
    <Page>
      <ProfileInformationBar profile={profile} />
      <MainContent>
        <Notifcations profile={profile} />
      </MainContent>
      <BottomNavigationBar />
    </Page>
  )

}

