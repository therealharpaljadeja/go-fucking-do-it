import { useState } from "react";
import { 
    ModalBody, 
    ModalContent, 
    ModalHeader, 
    ModalFooter, 
    Button,
    useToast
} from "@chakra-ui/react";



function AddChain() {
    const toast = useToast();
    const mainnetOptions = {
        chainId: "0x89",
        chainName: "Matic Network",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
        blockExplorerUrls: ["https://explorer.maticvigil.com"]
    }

    const [isAddingMainnetChain, setIsAddingMainnetChain] = useState(false);

    const addChain = async (chainOptions, type) => {
        setIsAddingMainnetChain(true);    
        
        window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [chainOptions]
        }).then((type) => {
            setIsAddingMainnetChain(false);
            toast({
                position: "top-right",
                title: "Connected",
                status: "success",
                isClosable: true
            });
        })
        .catch((err, type) => {
            setIsAddingMainnetChain(false);
            toast({
                position: "top-right",
                title: `Request Rejected`,
                status: "error",
                isClosable: true
            })
        });
    }


    return (
        <ModalContent>
            <ModalHeader textAlign="center">Incorrect Chain Selected!</ModalHeader>
            <ModalBody textAlign="center">
                Please connect to Matic Network.
            </ModalBody>
            <ModalFooter justifyContent="center">
                <Button isLoading={isAddingMainnetChain} onClick={() => addChain(mainnetOptions, "MAINNET")} colorScheme="blue" mr={3}>
                    Add Matic Mainnet 
                </Button>                
            </ModalFooter>
        </ModalContent>        
    );
}

export default AddChain;

