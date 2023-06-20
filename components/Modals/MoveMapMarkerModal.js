import { FaMap } from "react-icons/fa";
import data from "../../styles/data";
import { Text } from "../../styles/Text"
import { GenericModal, MapBox, SaveMarkerButtonBox } from "./Modals.styles"



const centerChilds = { display: "flex", alignItems: "center", justifyContent: "center"};
const textIconButton = {
    ...centerChilds, 
    backgroundColor: data.styles.color.secondaryMedium, width: "max-content",
    borderRadius: "50%"
};



export default function MoveMapMarkerModal(props) {
    return (
        <GenericModal>
            <MapBox>
                {props.children}
            </MapBox>
            <SaveMarkerButtonBox>
                <Text size={3} style={textIconButton}>
                    <FaMap />
                </Text>
            </SaveMarkerButtonBox>
        </GenericModal>
    )
}