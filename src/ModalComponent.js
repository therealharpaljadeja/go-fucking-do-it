import { 
    Modal,
    ModalOverlay, 
} from "@chakra-ui/react";

function ModalComponent(props) {
    return (
        <Modal 
            isCentered  
            closeModalOnOverlayClick={false} 
            isOpen={props.children.props.isOpen}
            motionPreset="slideInBottom"
            onClose={props.children.props.onClose}
        >
            <ModalOverlay />
            {props.children}
        </Modal>
    );
}

export default ModalComponent;