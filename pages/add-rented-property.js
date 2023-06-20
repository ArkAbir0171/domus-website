import React from 'react';
import BottomNavigationBar from '../components/BottomNavigation/BottomNavigationBar';
import { MainContent, Page } from '../styles/Page';
import ProfileInformationBar from '../components/ProfileBar/ProfileInformationBar';
import AddRentedPropertyBox from '../components/AddPropertyBox/AddRentedProperty';
import useProfile from '../hooks/useProfile';




export default function Dashboard({  }) {

  let { profile } = useProfile();

  return (
    <Page>
      <ProfileInformationBar profile={profile} />
      <MainContent>
        <AddRentedPropertyBox profile={profile}/>
      </MainContent>
      <BottomNavigationBar />
    </Page>
  )
}




