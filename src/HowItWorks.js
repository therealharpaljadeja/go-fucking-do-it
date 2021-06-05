import { 
    ModalBody, 
    ModalContent, 
    ModalCloseButton, 
    ModalHeader, 
    ModalFooter, 
    UnorderedList,
    ListItem,
} from "@chakra-ui/react";


function HowItWorks() {
    return (
        <ModalContent>
            <ModalCloseButton />
            <ModalHeader>How It Works</ModalHeader>
            <ModalBody>
                <UnorderedList spacing={5}>
                    <ListItem>
                        Go-Fucking-Do-It is a fear motivation tool. There is 1% fee to use the app because i have a stomach too. 
                    </ListItem>
                    <ListItem>
                        First you make a promise to be fulfilled within a deadline by staking your cryptocurrency. 
                    </ListItem>
                    <ListItem>
                        You also specify your friend's wallet address. This friend is your verifier.  
                    </ListItem>
                    <ListItem>
                        If your friend goes to "Promises" page and clicks the "Fulfill" button corresponding to your promise before the deadline then you receive the funds you staked back (Excluding Gas Fees). 
                    </ListItem>
                    <ListItem>
                        But if deadline has passed then either the friend can fulfill the promise or Me. When fulfill is clicked the funds will be sent to me! 😝
                    </ListItem>
                    <ListItem>
                        You can see your pending promises and the promises for which you have been assigned as friend on "Promises" page.
                    </ListItem>
                </UnorderedList>
            </ModalBody>
            <ModalFooter></ModalFooter>
        </ModalContent>        
    );
}

export default HowItWorks;

