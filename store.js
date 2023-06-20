import { useEffect, useState } from 'react';
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultPosition } from './Utils/defaultPosition';



// persistance util
const useStorePersistance = () => {
    const [hasHydrated, setHasHydrated] = useState(false);
    useEffect(() => {
        setHasHydrated(true);
    }, []);
    return hasHydrated;
};
function getPersistantState(hasPersistance, state) {
    if (hasPersistance) return state;
}




// preferenceStore
let userPreferencesStore = (set) =>
({
    isViewingAsOwner: true,
    userID: "USER_NOT_LOGGED_IN",
    hasEditedModal: false,

    toggleViewerMode: () => set((state) => ({ isViewingAsOwner: !state.isViewingAsOwner })),
    changeModalEdition: (hasEdited) => set((state) => ({ hasEditedModal: hasEdited })),
    setUserID: (userID) => set((state) => ({ userID: userID })),

});
userPreferencesStore = persist(userPreferencesStore, { name: 'userPreference' });
const useUserPreferencesStore = create(userPreferencesStore);




// modalStore
let modalStore = (set) =>
({
    isModalOpen: false,
    modalType: "",
    toggleIsModalOpen: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
    setModalType: (type) => set((state) => ({ modalType: type })),

});
const useModalStore = create(modalStore);




// mapStore
let mapStore = (set) =>
({
    markerPosition: defaultPosition,
    setMarkerPosition: (position) => set((state) => ({ markerPosition: position })),

});
const useMapStore = create(mapStore);





export {
    useStorePersistance,
    getPersistantState,

    useUserPreferencesStore,
    useModalStore,
    useMapStore,
}