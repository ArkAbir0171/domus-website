let ModalTypes =
{
    ChaneNameModal: "ChangeNameModal",
    MoveMapMarkerModal: "MoveMapMarkerModal",
    MapMarkerModal: "MapMarkerModal",
    OwnedPropertyDeleteModal: "OwnedPropertyDeleteModal",
    RentedPropertyDeleteModal: "RentedPropertyDeleteModal",
    EditPropertyModal: "EditPropertyModal",
    AddIssueModal: "AddIssueModal",
    IssueHistoryModal: "IssueHistoryModal",
    IssueHistoryOfOwnerModal: "IssueHistoryOfOwnerModal",
    MessengerModal: "MessengerModal",

}
function showModal(currentType, modalType, isModalOpen) {
    return ((currentType == modalType) && isModalOpen);
}

export { ModalTypes, showModal }