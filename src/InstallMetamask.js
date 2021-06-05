import { 
    ModalBody, 
    ModalContent, 
    ModalHeader, 
    ModalFooter, 
    Link,
    Button
} from "@chakra-ui/react";

import { FaExternalLinkAlt } from "react-icons/fa";

function InstallMetamask() {
    return (
        <ModalContent>
            <ModalHeader>Metamask Not Installed!</ModalHeader>
            <ModalBody>
                Please Install Metamask.
            </ModalBody>
            <ModalFooter>
                <Link 
                    href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" 
                    isExternal
                >
                    <Button colorScheme="blue" mr={3} rightIcon={<FaExternalLinkAlt />}>
                        Install On Chrome 
                    </Button>
                </Link>
                <Link href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/" isExternal>
                    <Button colorScheme="orange" rightIcon={<FaExternalLinkAlt />}>
                        Install On Firefox 
                    </Button>
                </Link>
                
            </ModalFooter>
        </ModalContent>        
    );
}

export default InstallMetamask;

