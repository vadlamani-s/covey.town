import React, { useState } from 'react';
import {
    Box,
    Button,
    useToast,
} from '@chakra-ui/react';

import useCoveyAppState from '../../hooks/useCoveyAppState';
import ProfilePage from './ProfilePage';
import { UserProfileResponse } from '../../classes/TownsServiceClient';

interface LogoutProps {
    logoutHandler: (userName: string) => boolean,
    emailID: string
}

export default function MenuBar({ logoutHandler, emailID }: LogoutProps): JSX.Element {

    const defaultUser: UserProfileResponse = {
        emailId: '',
        password: '',
        name: '',
        creationDate: new Date(),
    }

    const { apiClient } = useCoveyAppState();
    const [uProfile, setUProfile] = useState<UserProfileResponse>(defaultUser);
    const [profile, setProfile] = useState<boolean>(false);

    const toast = useToast()
    const processLogout = async () => {
        try {

            await apiClient.logoutUser();

            logoutHandler('');

            toast({
                title: 'Logout Successful',
                status: 'success'
            })

        } catch (err) {
            toast({
                title: 'Unable to logout',
                description: err.toString(),
                status: 'error'
            });
        }
    };

    const processProfile = async () => {
        try {
            if (!profile) {
                setProfile(true);
                const userProfile = await apiClient.userProfile({ emailId: emailID });
                setUProfile(userProfile);
            }
            else {
                setProfile(false);
            }

        } catch (err) {
            console.log(err);
        }

    }

    return <>

        <Box>

            <Button colorScheme="green" onClick={processProfile}> Profile </Button>
            {
                profile &&
                <ProfilePage
                    user={uProfile} />
            }
            <Button colorScheme="blue" onClick={processLogout}> Logout </Button>

        </Box>

    </>
}