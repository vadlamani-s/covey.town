import React, { useCallback, useState } from 'react';

import {
    Box,
    VStack,
    Button,
    Stack,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
    Heading,
    Divider,
    Flex,
    Container,
    Center,
    Spacer
} from '@chakra-ui/react';

import useCoveyAppState from '../../hooks/useCoveyAppState';

// import Logo from '../../Images/logo.JPG';

interface LoginProps {
    loginHandler: (userName: string, emailId: string) => boolean
}

export default function Home({ loginHandler }: LoginProps): JSX.Element {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [signIn, setSignIn] = useState<boolean>(false);
    const [signUp, setSignUp] = useState<boolean>(false);
    const [emailID, setEmailID] = useState<string>('');
    const [userPassword, setUserPassword] = useState<string>('');
    const { apiClient } = useCoveyAppState();
    const [fullName, setFullName] = useState<string>('');
    const [reEnteredPassword, setReEnteredPassword] = useState<string>('');
    const [emailID1, setEmailID1] = useState<string>('');
    const [userPassword1, setUserPassword1] = useState<string>('');

    const openTab = useCallback(() => {
        onOpen();
    }, [onOpen]);

    const closeTab = useCallback(() => {
        onClose();
        setSignUp(false);
        setSignIn(false);
    }, [onClose]);

    const handleSignIn = () => {
        openTab();
        setSignIn(true);
    }

    const handleSignUp = () => {
        openTab();
        setSignUp(true);
    }

    const toast = useToast()
    const processLogin = async () => {
        try {

            const log = await apiClient.loginUser({
                emailId: emailID,
                password: userPassword
            });

            loginHandler(log.credentials.name, emailID);
            
            toast({
                title: 'Login Successful',
                status: 'success'
            })

        } catch (err) {
            setEmailID(' ');
            setUserPassword(' ');
            toast({
                title: 'Unable to login',
                description: err.toString(),
                status: 'error'
            });
        }
    };

    const processRegistration = async () => {
        try {
            await apiClient.registerUser({
                emailId: emailID1,
                password: userPassword1,
                name: fullName,
                creationDate: new Date()
            });

            setSignUp(false);

            toast({
                title: 'Registration Successful',
                status: 'success'
            })
        } catch (err) {
            setEmailID(' ');
            setUserPassword(' ');
            toast({
                title: 'Unable to register',
                description: err.toString(),
                status: 'error'
            });
        }
    };

    return <>
        <Container marginTop='10px' minH='60px' borderRadius='5px' borderColor='gray.400'>
            <Flex>
                <Center>
                <Button colorScheme="gray" variant="outline" onClick={handleSignIn}> SIGN IN </Button>
                </Center>
                <Spacer/>
                <Center>
                <Button colorScheme="gray" variant="outline" onClick={handleSignUp}> SIGN UP </Button>     
                </Center>              
            </Flex>
            
        </Container>
        <Container marginTop='10px' minH='40px' border='2px' borderRadius='5px' borderColor='gray.400'>
        <Heading>Welcome to Covey Town.</Heading>
        <br/>
        <div> A Remote Collaboration Tool! </div>
        <br/>
        <div> Where you can join towns and have video and chat conversations with people of the town. Happy Chatting!!</div>
        <br/>
        <div> Developed by Ram, Mownika, Satya</div>
        <br/>
        </Container>















        {
                            signIn && 
                            <Modal isOpen={isOpen} onClose={closeTab}>
                                <ModalOverlay />
                                <ModalContent>
                                <ModalHeader>Sign In </ModalHeader>
                                <ModalCloseButton />
                                <form onSubmit={(ev) => { ev.preventDefault(); }}>
                                    <ModalBody pb={6}>
                        
                                    <FormControl id="email" isRequired>
                                        <FormLabel> Email address</FormLabel>
                                        <Input type="email" placeholder="Email address"
                                        size="lg" onChange={(e) => setEmailID(e.target.value)} />
                                    </FormControl>

                                    <FormControl id="password" isRequired>
                                        <FormLabel> Password</FormLabel>
                                        <Input type="password" placeholder="*******"
                                        size="lg" onChange={(e) => setUserPassword(e.target.value)} />
                                    </FormControl>

                                    </ModalBody>

                                    <ModalFooter>
                                    <Button colorScheme="gray" onClick={processLogin} disabled={!emailID || !userPassword}> Login </Button>
                                    <Button onClick={closeTab}>Cancel</Button>
                                    </ModalFooter>
                                </form>
                                </ModalContent>
                            </Modal>
                        }

                    
                    {
                            signUp && 
                            <Modal isOpen={isOpen} onClose={closeTab}>
                                <ModalOverlay />
                                <ModalContent>
                                <ModalHeader>Create an account </ModalHeader>
                                <ModalCloseButton />
                                <form onSubmit={(ev) => { ev.preventDefault(); }}>
                                    <ModalBody pb={6}>
                        
                                    <FormControl id="name" isRequired>
                                        <FormLabel> Full name</FormLabel>
                                        <Input type="text" placeholder="Full name"
                                        size="lg" onChange={(e) => setFullName(e.target.value)} />
                                   </FormControl>

                                    <FormControl id="email" isRequired>
                                        <FormLabel> Email address</FormLabel>
                                        <Input type="email" placeholder="Email address"
                                        size="lg" onChange={(e) => setEmailID1(e.target.value)} />
                                    </FormControl>

                                    <FormControl id="password" isRequired>
                                        <FormLabel> Password</FormLabel>
                                        <Input type="password" placeholder="*******"
                                        size="lg" onChange={(e) => setUserPassword1(e.target.value)} />
                                    </FormControl>

                                    <FormControl id="reEnterPassword" isRequired>
                                        <FormLabel> Re-Enter your password</FormLabel>
                                        <Input type="password" placeholder="*******"
                                        size="lg" onChange={(e) => setReEnteredPassword(e.target.value)} />
                                    </FormControl>

                                    </ModalBody>

                                    <ModalFooter>
                                    <Button colorScheme="gray" onClick={processRegistration} disabled={!emailID1 || !userPassword1 || !fullName || reEnteredPassword !== userPassword1}> Register </Button>
                                    <Button onClick={closeTab}>Cancel</Button>
                                    </ModalFooter>
                                </form>
                                </ModalContent>
                            </Modal>
                        }
                
                {
                            signUp && 
                            <Modal isOpen={isOpen} onClose={closeTab}>
                                <ModalOverlay />
                                <ModalContent>
                                <ModalHeader>Create an account </ModalHeader>
                                <ModalCloseButton />
                                <form onSubmit={(ev) => { ev.preventDefault(); }}>
                                    <ModalBody pb={6}>
                        
                                    <FormControl id="name" isRequired>
                                        <FormLabel> Full name</FormLabel>
                                        <Input type="text" placeholder="Full name"
                                        size="lg" onChange={(e) => setFullName(e.target.value)} />
                                   </FormControl>

                                    <FormControl id="email" isRequired>
                                        <FormLabel> Email address</FormLabel>
                                        <Input type="email" placeholder="Email address"
                                        size="lg" onChange={(e) => setEmailID1(e.target.value)} />
                                    </FormControl>

                                    <FormControl id="password" isRequired>
                                        <FormLabel> Password</FormLabel>
                                        <Input type="password" placeholder="*******"
                                        size="lg" onChange={(e) => setUserPassword1(e.target.value)} />
                                    </FormControl>

                                    <FormControl id="reEnterPassword" isRequired>
                                        <FormLabel> Re-Enter your password</FormLabel>
                                        <Input type="password" placeholder="*******"
                                        size="lg" onChange={(e) => setReEnteredPassword(e.target.value)} />
                                    </FormControl>

                                    </ModalBody>

                                    <ModalFooter>
                                    <Button colorScheme="gray" onClick={processRegistration} disabled={!emailID1 || !userPassword1 || !fullName || reEnteredPassword !== userPassword1}> Register </Button>
                                    <Button onClick={closeTab}>Cancel</Button>
                                    </ModalFooter>
                                </form>
                                </ModalContent>
                            </Modal>
                        }

            
                              
    </>

}