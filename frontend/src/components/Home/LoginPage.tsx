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

import RegistrationPage from './RegistrationPage';
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

    const processRegistration = () => {
        setRegistrationState(true);
    }

    return <>

        <Flex align="center" justify="center" boxSize="xl" backgroundColor="red" padding="xl">
            <Box p={8} maxW="500px" maxH="500px">
                Welcome To Covey.Town!
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
                            <Button colorScheme="blue" onClick={processRegistration}> Create Account </Button>

                        </Box>

                    </div>
                }

                {registrationState && <RegistrationPage />}

            </Box>
        </Flex>

    </>

}

// export default LoginPage;