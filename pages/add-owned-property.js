import React from 'react';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import BottomNavigationBar from '../components/BottomNavigation/BottomNavigationBar';
import { MainContent, Page } from '../styles/Page';
import ProfileInformationBar from '../components/ProfileBar/ProfileInformationBar';
import AddPropertyBox from '../components/AddPropertyBox/AddPropertyBox';
import useProfile from '../hooks/useProfile';



export default function Dashboard({ }) {
  let { profile } = useProfile();
  return (
    <Page>
      <ProfileInformationBar profile={profile} />
      <MainContent>
        <AddPropertyBox profile={profile} />
      </MainContent>
      <BottomNavigationBar />
    </Page>
  )
}




