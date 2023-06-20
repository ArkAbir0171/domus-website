import { RiLoaderFill } from "react-icons/ri"
import { Text } from "../../styles/Text"
import { LoadingModalContainer } from "../Modals/Modals.styles"

export default function Loader({ prompt }) {
    return (
        <LoadingModalContainer>
            <Text size={2} style={{}}>
                {prompt}
                <RiLoaderFill />
            </Text>
        </LoadingModalContainer>
    )
}
