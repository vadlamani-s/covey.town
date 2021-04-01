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
    Alert,
    AlertIcon,
    AlertDescription  
} from '@chakra-ui/react';

const RegistrationPage: React.FunctionComponent = () => {

    const [fullName, setFullName] = useState<string>('');
    const [emailID, setEmailID] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [reEnteredPassword, setReEnteredPassword] = useState<string>('');
    const [error, setError] = useState('');

    const toast = useToast()
    const processRegistration = async () =>{
       try{
            // apiClient Registration
            toast({
                title: 'Registration Successful',
                status: 'success'
            })
       }catch(err){
            setError('Invalid email ID or passwords doesn\'t match');
            setEmailID(' ');
            setPassword(' ');
            toast({
               title: 'Unable to login',
               description: err.toString(),
               status: 'error'
            });
       }
    };  

    function ErrorMessage({message} : { message: string }) {
        return (
            <Box my={4}>
              <Alert status="error" borderRadius={4}>
                <AlertIcon />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            </Box>
          );
    }
    
    return<>

        <Flex align="center" justify="center" boxSize="xl" backgroundColor="red" padding="xl">
            <Box p={8} maxW="500px" maxH="500px">
                Welcome To Covey.Town!
                <Box textAlign="center"> <Heading> Register </Heading> </Box>

                <Box my={4} textAlign="left" boxSize="xl">

                    {error && <ErrorMessage message={error}/>}

                    <FormControl id="name" isRequired>
                        <FormLabel> Enter your Full name</FormLabel>
                        <Input type="text" placeholder="enter your full name"
                        size="lg" onChange={(e) => setFullName(e.target.value)}/>
                    </FormControl>
                    
                    <FormControl id="email" isRequired>
                        <FormLabel> Enter your email address</FormLabel>
                        <Input type="email" placeholder="enter your email address"
                        size="lg" onChange={(e) => setEmailID(e.target.value)}/>
                    </FormControl>

                    <FormControl id="password" isRequired>
                        <FormLabel> Enter your password</FormLabel>
                        <Input type="password" placeholder="*******"
                        size="lg" onChange={(e) => setPassword(e.target.value)}/>
                    </FormControl>

                    <FormControl id="reEnterPassword" isRequired>
                        <FormLabel> Re-Enter your password</FormLabel>
                        <Input type="password" placeholder="*******"
                        size="lg" onChange={(e) => setReEnteredPassword(e.target.value)}/>
                    </FormControl>

                    <Button colorScheme="blue" onClick={processRegistration} disabled={!emailID || !password || !fullName || reEnteredPassword !== password }> Register </Button>

                </Box>

            </Box>
        </Flex>
        
    </>
}

export default RegistrationPage;