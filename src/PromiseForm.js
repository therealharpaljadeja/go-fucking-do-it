import { useState } from "react";
import {
    Stack,
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightAddon,
    Textarea,
    Box,
    FormHelperText,
    useToast,
    VStack,
    Link
} from "@chakra-ui/react";
import Web3 from "web3";
import abi from "./abi.json";
import { ExternalLinkIcon } from "@chakra-ui/icons";

function PromiseForm(props) {
    const web3 = new Web3(window.ethereum);
    const toast = useToast();
    const [promiseAmount, setPromiseAmount] = useState("");
    const [promiseTask, setPromiseTask] = useState("I will ");
    const [promiseDeadline, setPromiseDeadline] = useState("");
    const [friend, setFriend] = useState("");
    const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(false);

    const Contract = new web3.eth.Contract(abi, "0x8E96E9B6bCB3DA7e7459f3115B4D4Ca364050429");

    const createPromise = async (event) => {
        event.preventDefault();
        setIsWaitingForConfirmation(true);
        const nowTimestamp = new Date();
        const endTimeStamp = Math.floor(nowTimestamp.setDate(nowTimestamp.getDate() + parseInt(promiseDeadline)) / 1000);
        const tx = Contract.methods.createPromise(promiseTask, web3.utils.toWei(promiseAmount, "ether"), friend, endTimeStamp)
        .send({from: props.currentAccount, value:web3.utils.toWei(promiseAmount, "ether")})
        .on("error", (error, receipt) => {
            setIsWaitingForConfirmation(false);
            if(error.code == 4001) {
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
        })
        .on("transactionHash", (hash) => {
            setIsWaitingForConfirmation(false);
            var link;
            link = `https://explorer-mainnet.maticvigil.com/tx/${hash}`;
            toast({
                position: "bottom-right",
                render: () => (
                    <Box color="white" borderRadius={3} p={3} bg="green.400">
                        <Link isExternal href={link} style={{cursor: "pointer"}}>
                            View Transaction <ExternalLinkIcon />
                        </Link>
                    </Box>
                ) 
            });
        });
    }

    return (
        <Box boxShadow="lg" mt="3rem !important" border="2px" borderColor="blue.200" borderStyle="solid" as="div" alignSelf="center" padding={10} borderRadius={10} margin="auto" maxW={1000}>
            <form onSubmit={createPromise} method="POST">
                <Stack justifyContent="center" maxWidth={1000} spacing={5} margin="auto">
                    <FormControl>
                        <HStack w={600} justify="center" align="center">
                            <FormLabel as="label" fontSize={22}>
                                I Promise
                            </FormLabel>
                            <InputGroup maxW={40}>
                                <Input onChange={({target}) => setPromiseAmount(target.value)} value={promiseAmount} type="number" isRequired />
                                <InputRightAddon children="MATIC" />
                            </InputGroup>
                            <FormLabel fontSize={22}>
                                that
                            </FormLabel>
                        </HStack>
                    </FormControl>
                    <FormControl>
                        <Textarea isRequired onChange={({target}) => setPromiseTask(target.value)} value={promiseTask} size="lg" resize="vertical" rows="3" cols="45" placeholder="I will" variant="outline" />
                    </FormControl>
                    <FormControl>
                        <HStack justify="center" align="center">
                            <FormLabel as="label" fontSize={22}>
                                in
                        </FormLabel>
                            <InputGroup maxW={40}>
                                <Input onChange={({target}) => setPromiseDeadline(target.value)} value={promiseDeadline} type="number" isRequired />
                            </InputGroup>
                            <FormLabel fontSize={22}>
                                days.
                        </FormLabel>
                        </HStack>
                    </FormControl>
                    <FormControl>
                        <Input onChange={({target}) => setFriend(target.value)} value={friend} isRequired placeholder="Friend's wallet address" />
                        <FormHelperText>Double Check otherwise your friend won't be able to verify.</FormHelperText>
                    </FormControl>
                    <FormControl textAlign="center">
                        <Button isLoading={isWaitingForConfirmation} width="100%" fontSize={20} py={7} type="submit" variant="solid" colorScheme="twitter">Promise</Button>
                        <FormHelperText>1% Fee for using app.</FormHelperText>
                    </FormControl>
                </Stack>
            </form>
        </Box>
    )
}

export default PromiseForm;