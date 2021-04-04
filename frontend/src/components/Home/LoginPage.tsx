import React, { useState } from 'react';

import {
    Button,
    FormControl,
    FormLabel,
    Flex,
    Box,
    useToast,
    Input,
    Heading,
} from '@chakra-ui/react';

import useCoveyAppState from '../../hooks/useCoveyAppState';

interface LoginProps {
    loginHandler: (userName: string, emailId: string) => boolean
}

// const LoginPage: React.FunctionComponent = ({loginHandler}) => {
export default function LoginPage({ loginHandler }: LoginProps): JSX.Element {

    const [registrationState, setRegistrationState] = useState(false);
    const [emailID, setEmailID] = useState<string>('');
    const [userPassword, setUserPassword] = useState<string>('');
    const { apiClient } = useCoveyAppState();
    const [fullName, setFullName] = useState<string>('');
    const [reEnteredPassword, setReEnteredPassword] = useState<string>('');
    const [emailID1, setEmailID1] = useState<string>('');
    const [userPassword1, setUserPassword1] = useState<string>('');

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

    const processRegister = () => {
        setRegistrationState(true);
    }

    const processRegistration = async () => {
        try {
            await apiClient.registerUser({
                emailId: emailID1,
                password: userPassword1,
                name: fullName,
                creationDate: new Date()
            });

            setRegistrationState(false);
            toast({
                title: 'Registration Successful',
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

    return <>

        <Flex align="center" justify="center" boxSize="xl" backgroundColor="red" padding="xl">
            <Box p={8} maxW="500px" maxH="500px">
                <h3>Welcome To Covey.Town! </h3>
                {!registrationState &&
                    <div>
                        <Box textAlign="center"> <Heading> Login </Heading> </Box>


                        <Box my={4} textAlign="left" boxSize="xl">

                            <FormControl id="email" isRequired>
                                <FormLabel> Enter your email address</FormLabel>
                                <Input type="email" placeholder="enter your email address"
                                    size="lg" onChange={(e) => setEmailID(e.target.value)} />
                            </FormControl>

                            <FormControl id="password" isRequired>
                                <FormLabel> Enter your password</FormLabel>
                                <Input type="password" placeholder="*******"
                                    size="lg" onChange={(e) => setUserPassword(e.target.value)} />
                            </FormControl>

                            <Button colorScheme="blue" onClick={processLogin} disabled={!emailID || !userPassword}> Login </Button>

                        </Box>


                        <Box>
                            <Button colorScheme="blue" onClick={processRegister}> Create Account </Button>

                        </Box>

                    </div>
                }

                {registrationState &&

                    <Flex align="center" justify="center" boxSize="xl" backgroundColor="red" padding="xl">
                        <Box p={8} maxW="500px" maxH="500px">
                            <Box textAlign="center"> <Heading> Register </Heading> </Box>

                            <Box my={4} textAlign="left" boxSize="xl">

                                <FormControl id="name" isRequired>
                                    <FormLabel> Enter your Full name</FormLabel>
                                    <Input type="text" placeholder="enter your full name"
                                        size="lg" onChange={(e) => setFullName(e.target.value)} />
                                </FormControl>

                                <FormControl id="email" isRequired>
                                    <FormLabel> Enter your email address</FormLabel>
                                    <Input type="email" placeholder="enter your email address"
                                        size="lg" onChange={(e) => setEmailID1(e.target.value)} />
                                </FormControl>

                                <FormControl id="password" isRequired>
                                    <FormLabel> Enter your password</FormLabel>
                                    <Input type="password" placeholder="*******"
                                        size="lg" onChange={(e) => setUserPassword1(e.target.value)} />
                                </FormControl>

                                <FormControl id="reEnterPassword" isRequired>
                                    <FormLabel> Re-Enter your password</FormLabel>
                                    <Input type="password" placeholder="*******"
                                        size="lg" onChange={(e) => setReEnteredPassword(e.target.value)} />
                                </FormControl>

                                <Button colorScheme="blue" onClick={processRegistration} disabled={!emailID1 || !userPassword1 || !fullName || reEnteredPassword !== userPassword1}> Register </Button>

                            </Box>

                        </Box>
                    </Flex>



                }

            </Box>
        </Flex>

    </>

}

// export default LoginPage;