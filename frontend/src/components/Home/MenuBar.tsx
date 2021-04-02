import React, { useState } from 'react';
import {
    Box,
    Button,
    useToast
} from '@chakra-ui/react';

import useCoveyAppState from '../../hooks/useCoveyAppState';

const MenuBar: React.FunctionComponent = () => {

    const {apiClient} = useCoveyAppState();

    const toast = useToast()
    const processLogout = async () =>{
       try{

           

            toast({
                title: 'Logut Successful',
                status: 'success'
            })

       }catch(err){
            toast({
               title: 'Unable to logout',
               description: err.toString(),
               status: 'error'
            });
       }
    };  

    return<>

        <Box>
            <Button colorScheme="blue" onClick={processLogout}> Logout </Button>
        </Box>
        
    </>
}

export default MenuBar;