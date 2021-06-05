import { useState } from "react";
import { Flex, Spacer, Box, Heading, Button, Switch, useColorMode, Tag, useToast, TagLabel, Avatar, Link } from "@chakra-ui/react";
import Jazzicon from "./Jazzicon";

function Header(props){
    const toast = useToast();
    const [isLoading, setisLoading] = useState(false);
    const { colorMode, toggleColorMode } = useColorMode();

    const requestConnect = async () => {
        setisLoading(true);
        window.ethereum.request({
            method: "eth_requestAccounts"
        }).then(() => {
            props.setCurrentAccount(window.ethereum.selectedAddress);
            setisLoading(false);
        }).catch((err) => {
            console.log(err);
            toast({
                position: "bottom-right",
                title: `Request Rejected`,
                status: "error",
                isClosable: true
            })
            setisLoading(false);
        })
    }
    return (
        <Flex
            px={10}
            py={4}
            w="100vw"
            boxShadow="lg"
            align="center"
        >    
            <Box> 
                <Heading style={{cursor: "pointer"}} onClick={() => props.setIsHome(true)} as="h2" size="lg" colorScheme="twitter">
                    Go-Fucking-Do-It!
                </Heading>
            </Box>
            <Spacer />
            <Box
                mx={2}
            >
                <Tag variant="solid" size="lg" colorScheme="twitter">
                    {props.chain}
                </Tag>
            </Box>
            <Box
                mx={2}
            >
                <Button onClick={props.onOpen} variant="ghost" colorScheme="twitter">
                    How it Works?
                </Button>
            </Box>
            <Box
                mx={2}
            >
                <Button onClick={() => props.setIsHome(false)} variant="ghost" colorScheme="twitter">
                    Promises
                </Button>
            </Box>
            <Box>
                {
                    props.chainId == "137" ?
                    <Link isExternal style={{textDecoration: "none"}} href="https://explorer-mainnet.maticvigil.com/address/0x3152a865A4fc27A523ABc69Ac234dEc611a60Da7">
                        <Button variant="ghost" colorScheme="twitter">Contract</Button>
                    </Link> : 
                    ""
                }
            </Box>
            <Box
                mx={2}
            >
                <Switch colorScheme="twitter" size="lg" onChange={toggleColorMode}>

                </Switch>
            </Box>
            <Box
                ml={7}
                mr={2}
            >
                {
                    props.currentAccount == undefined ?
                        <Button isLoading={isLoading} onClick={requestConnect} variant="solid" colorScheme="twitter">
                            Connect
                        </Button> :
                        <Tag
                            size="lg"
                            borderRadius="full"
                            ml={3}
                            mr={-2}
                        >
                            <TagLabel>
                                {`${props.currentAccount.substr(0,6)}...${props.currentAccount.substr(-4)}`}
                            </TagLabel>
                            <Avatar ml={3} size="xs" bg="transparent" icon={<Jazzicon address={props.currentAccount} />} />
                        </Tag>
                        
                }                  
            </Box>
        </Flex>
    );
}

export default Header;