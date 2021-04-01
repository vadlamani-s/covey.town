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


const LoginPage: React.FunctionComponent = () => {

    const [registrationState, setRegistrationState] = useState(false);
    const [emailID, setEmailID] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState('');

    const toast = useToast()
    const processLogin = async () =>{
       try{
            // apiClient Login
            toast({
                title: 'Login Successful',
                status: 'success'
            })
       }catch(err){
            setError('Invalid email ID or password');
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
                <Box textAlign="center"> <Heading> Login </Heading> </Box>

                <Box my={4} textAlign="left" boxSize="xl">

                    {error && <ErrorMessage message={error}/>}
                    
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

                    <Button colorScheme="blue" onClick={processLogin} disabled={!emailID || !password}> Login </Button>

                </Box>

            </Box>
        </Flex>
        
    </>

}
              
export default LoginPage;