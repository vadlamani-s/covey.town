import React, { useCallback, useState } from 'react';
import {
    Button,
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
    useToast
} from '@chakra-ui/react';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import { UserProfileResponse } from '../../classes/TownsServiceClient';

interface UserProfile {
    user: UserProfileResponse,
}

export default function ProfilePage({ user }: UserProfile): JSX.Element {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [userName, setUserName] = useState<string>(user.name);
    const [roomUpdatePassword, setRoomUpdatePassword] = useState<string>('');

    const openSettings = useCallback(() => {
        onOpen();
    }, [onOpen]);

    const closeSettings = useCallback(() => {
        onClose();
    }, [onClose,]);

    const processUpdates = async (action: string) => {

    };


    return <>

        <MenuItem data-testid='openMenuButton' onClick={openSettings}>
            <Typography variant="body1">Profile Page</Typography>
        </MenuItem>
        <Modal isOpen={isOpen} onClose={closeSettings}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit profile {user?.name} </ModalHeader>
                <ModalCloseButton />
                <form onSubmit={(ev) => { ev.preventDefault(); processUpdates('edit') }}>
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel htmlFor='userName'>User Name</FormLabel>
                            <Input id='userName' name="userName" value={userName} onChange={(ev) => setUserName(ev.target.value)} />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor='email'>Email address</FormLabel>
                            <Input id='emailID' placeholder="Email ID" name="emailID" value={user.emailId} />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel htmlFor="updatePassword">Town Update Password</FormLabel>
                            <Input data-testid="updatePassword" id="updatePassword" placeholder="Password" name="password" type="password" value={roomUpdatePassword} onChange={(e) => setRoomUpdatePassword(e.target.value)} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button data-testid='deletebutton' colorScheme="red" mr={3} value="delete" name='action1' onClick={() => processUpdates('delete')}>
                            Delete
            </Button>
                        <Button data-testid='updatebutton' colorScheme="blue" mr={3} value="update" name='action2' onClick={() => processUpdates('edit')}>
                            Update
            </Button>
                        <Button onClick={closeSettings}>Cancel</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    </>
}