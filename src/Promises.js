import { Box, Divider, Grid, GridItem, Heading, HStack, VStack, Tooltip, Spinner, Table, Thead, Tr, Th, Tbody, TagCloseButton, Tag, Button, useToast, Link } from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { FaInfoCircle } from "react-icons/fa";
import Web3 from "web3";
import abi from "./abi.json";
import { ExternalLinkIcon } from "@chakra-ui/icons";

function Promises(props) {

    const web3 = new Web3(window.ethereum);
    const toast = useToast();
    const Contract = new web3.eth.Contract(abi, "0x3152a865A4fc27A523ABc69Ac234dEc611a60Da7");
    const [promisesToFulfill, setPromisesToFulfill] = useState([]);
    const [promisesToVerify, setPromisesToVerify] = useState([]);
    const [isLoadingPromisesToFulfill, setIsLoadingPromisesToFulfill] = useState(true);
    const [isLoadingPromisesToVerify, setIsLoadingPromisesToVerify] = useState(true);
    const [isFulfillingPromise, setIsFulfillingPromise] = useState([]);

    const getPromisesToFulfill = useCallback(async () => {
        setIsLoadingPromisesToFulfill(true);
        const result = await Contract.methods.getPendingPromises().call({from: props.currentAccount});
        const promises = [];
        for(const res of result) {
            const promise = await Contract.methods.getPendingPromise(res).call();
            promises.push(promise);
        }
        setPromisesToFulfill([...promises]);
        setIsLoadingPromisesToFulfill(false);
    }, [props.currentAccount]);

    
    const getPromisesToVerify = useCallback(async () => {
        setIsLoadingPromisesToVerify(true);
        const result = await Contract.methods.getPromisesToBeFulfilled().call({from: props.currentAccount});
        const promises = [];
        for(const res of result) {
            const promise = await Contract.methods.getPendingPromise(res).call();
            promises.push(promise);
        }
        setPromisesToVerify([...promises]);
        setIsLoadingPromisesToVerify(false);
    }, [props.currentAccount]);

    const fulfillPromise = (id) => {
        setIsFulfillingPromise(prev => ({...prev, [id]: true}));
        Contract.methods.fulfillPromise(id).send({from: props.currentAccount})
        .on("transactionHash", (hash) => {
            var link = "";
            link = `https://explorer-mainnet.maticvigil.com/tx/${hash}`;
            toast({
                position: "bottom-right",
                render: () => (
                    <Box color="white" borderRadius={3} p={3} bg="blue.400">
                        <Link isExternal href={link} style={{cursor: "pointer"}}>
                            View Transaction <ExternalLinkIcon />
                        </Link>
                    </Box>
                ) 
            });
        })
        .on("receipt", (receipt) => {
            console.log(receipt);
            setIsFulfillingPromise(prev => ({...prev, [id]: false}));
            getPromisesToVerify();
        })
        .on("error", (err, receipt) => {
            console.log(receipt);
            if(err.code == 4001) {
                toast({
                    position: "bottom-right",
                    title: "User Denied Transaction",
                    status: "error",
                    isClosable: true
                });    
            } else {
                var link = "";
                link = `https://explorer-mainnet.maticvigil.com/tx/${receipt.transactionHash}`;
                toast({
                    position: "bottom-right",
                    isClosable: true,
                    render: () => (
                        <Box color="white" borderRadius={3} p={3} bg="red.400">
                            <Link isExternal href={link} style={{cursor: "pointer"}}>
                                View Transaction <ExternalLinkIcon />
                            </Link>
                        </Box>
                    ) 
                });
            }
            setIsFulfillingPromise(prev => ({...prev, [id]: false}));
        });
    }

    useEffect(() => {
        console.log(props.chainId);
        getPromisesToFulfill();
        getPromisesToVerify();
    }, [getPromisesToFulfill, getPromisesToVerify, props.chainId])
    
    var promiseComponents = [];

    return (
        <Grid gap={50} px="40px" py="50px" marginTop="0px !important" templateColumns="repeat(2, 1fr)">
            <GridItem>
                <HStack>
                    <Heading as="h2" size="lg" colorScheme="blue">
                        Promises to Fulfill
                    </Heading>
                    <Tooltip hasArrow size="md" label="Tasks to be performed" placement="top">
                        <span>
                            <FaInfoCircle />
                        </span>
                    </Tooltip>
                </HStack>
                <Divider m={0} mt={3} borderBottomWidth={0} opacity="1" borderTopWidth={3} borderColor="twitter.600"/>
                {
                    isLoadingPromisesToFulfill ? <Spinner alignSelf="center" /> :
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Promise Task</Th>
                                <Th>Deadline</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                promisesToFulfill.map((promise) => {
                                    return (<Tr key={promise["0"]}>
                                        <Th>
                                            {promise["promiseTask"]}
                                        </Th>
                                        <Th>
                                            <Tag>
                                                {`${new Date(parseInt(promise["endTime"]) * 1000).toDateString()} ${new Date(parseInt(promise["endTime"]) * 1000).toLocaleTimeString()}`}
                                            </Tag>                                        
                                        </Th>
                                    </Tr>)
                                })
                            }
                        </Tbody>
                    </Table> 
                }
            </GridItem>
            <GridItem>
                <HStack>
                    <Heading as="h2" size="lg" colorScheme="blue">
                        Promises to Verify
                    </Heading>
                    <Tooltip hasArrow size="md" label="Tasks to be verified by you" placement="top">
                        <span>
                            <FaInfoCircle />
                        </span>
                    </Tooltip>
                </HStack>
                <Divider m={0} mt={3} borderBottomWidth={0} opacity="1" borderTopWidth={3} borderColor="twitter.600"/>
                {
                    isLoadingPromisesToVerify ? <Spinner alignSelf="center" /> :
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Promise Task</Th>
                                <Th>Deadline</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                promisesToVerify.map((promise) => {
                                    return (<Tr key={promise["0"]}>
                                        <Th>
                                            {promise["promiseTask"]}
                                        </Th>
                                        <Th>
                                            <Tag>
                                                {`${new Date(parseInt(promise["endTime"]) * 1000).toDateString()} ${new Date(parseInt(promise["endTime"]) * 1000).toLocaleTimeString()}`}
                                            </Tag>                                     
                                        </Th>
                                        <Th>
                                            <Button key={promise["0"]} isLoading={isFulfillingPromise[promise["0"]]}  onClick={() => fulfillPromise(promise["0"])} colorScheme="twitter">Fulfill</Button>
                                        </Th>
                                    </Tr>)
                                })
                            }
                        </Tbody>
                    </Table> 
                }
            </GridItem>
        </Grid>
    );
}

export default Promises;