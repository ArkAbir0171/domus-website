import React from 'react';
import BottomNavigationBar from '../components/BottomNavigation/BottomNavigationBar';
import ProfileInformationBar from '../components/ProfileBar/ProfileInformationBar';
import { MainContent, Page } from '../styles/Page';
import OwnedProperties from '../components/Properties/OwnedProperties';
import RentedProperties from '../components/Properties/RentedProperties';
import Authentication from './authentication';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import useProfile from '../hooks/useProfile';


export default function Dashboard({ }) {

  
  let { profile } = useProfile();
  
  return (
    <Authentication>
      <Page>
        <ProfileInformationBar profile={profile} />
        <MainContent>
          <OwnedProperties profile={profile} />
          <RentedProperties profile={profile} />
        </MainContent>
        <BottomNavigationBar />
      </Page>
    </Authentication>
  )
}

