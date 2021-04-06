import React, { useState, useCallback } from 'react';
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
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import PreJoinScreens from '../VideoCall/VideoFrontend/components/PreJoinScreens/PreJoinScreens';
import MediaErrorSnackbar
  from '../VideoCall/VideoFrontend/components/PreJoinScreens/MediaErrorSnackbar/MediaErrorSnackbar';
import { TownJoinResponse, RoomLogin, UserProfileResponse} from '../../classes/TownsServiceClient';
import useCoveyAppState from '../../hooks/useCoveyAppState';

interface LoginProps {
  doLogin: (initData: TownJoinResponse) => Promise<boolean>
  logoutHandler: (userName: string) => boolean
  emailID: string
}

export default function Login({ doLogin, logoutHandler, emailID }: LoginProps): JSX.Element {
  const [mediaError, setMediaError] = useState<Error>();
  const { apiClient } = useCoveyAppState();
  const [logs, setLogs] = useState<boolean>(false);
  const [profile, setProfile] = useState<boolean>(false);
  const [meetingLogs, setMeetingLogs] = useState<RoomLogin[]>();
  const [userProfile, setUserProfile] = useState<UserProfileResponse>({emailId: emailID, name: ' ', password: ' ', creationDate: new Date()});
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openTab = useCallback(() => {
    onOpen();
  }, [onOpen]);

  const closeTab = useCallback(() => {
    onClose();
    setLogs(false);
    setProfile(false);
  }, [onClose]);

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

  const handleMeeting = useCallback(() => {
    apiClient.fetchLogs()
      .then((log) => {
        setMeetingLogs(log.logs)
      })
  }, [setMeetingLogs, apiClient]);

  const handleMeetings = () => {
    openTab();
    setLogs(true);
    handleMeeting()
  }

  const processProfile = async () => {
    try {
      await apiClient.userProfile({
        emailId: emailID
      }).then((user) => setUserProfile(user));

      } catch (err) {
        console.log(err);
      }
  };

  const handleProfile = () => {
    openTab();
    processProfile();
    setProfile(true);
  }

  const processUpdates = async (action: string) => {

  };

  return (
    <>
      <MediaErrorSnackbar error={mediaError} dismissError={() => setMediaError(undefined)} />
      
      <VStack>
        <Stack direction="row" spacing="50px">
          <Box>
              <Button colorScheme="gray" onClick={handleProfile} variant="outline"> Profile </Button>
              {
                profile && 
                <Modal isOpen={isOpen} onClose={closeTab}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Edit profile {userProfile.name} </ModalHeader>
                <ModalCloseButton />
                <form onSubmit={(ev) => { ev.preventDefault(); processUpdates('edit') }}>
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel htmlFor='userName'>User Name</FormLabel>
                            <Input id='userName' name="userName" placeholder="User name" type="text" value={userName} onChange={(ev) => setUserName(ev.target.value)} />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor='email'>Email address</FormLabel>
                            <Input id='emailID' placeholder="Email ID" name="emailID" value={emailID} />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel htmlFor="updatePassword">User Update Password</FormLabel>
                            <Input id="updatePassword" name="password" placeholder="Password"  type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button data-testid='deletebutton' colorScheme="red" mr={3} value="delete" name='action1' variant="outline" disabled={!password} onClick={() => processUpdates('delete')}>
                            Delete
                        </Button>
                        <Button data-testid='updatebutton' colorScheme="green" mr={3} value="update" name='action2' variant="outline" disabled={!password || !userName} onClick={() => processUpdates('edit')}>
                            Update
                        </Button>
                        <Button onClick={closeTab}>Cancel</Button>
                    </ModalFooter>
                </form>
                </ModalContent>
                </Modal>
              }
          </Box>
          <Box>
              <Button colorScheme="gray" onClick={handleMeetings} variant="outline"> History </Button>
              {
                logs && 
                <Modal isOpen={isOpen} onClose={closeTab}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Meeting History</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                        
                    <Table>
                      <Thead><Tr><Th>Room Name</Th><Th>Meeting Date</Th></Tr></Thead>
                      <Tbody>
                        {meetingLogs?.map((meeting) => (
                        <Tr key={meeting.emailId}><Td role='cell'>{meeting.friendlyName}</Td><Td
                        role='cell'>{meeting.loginDate}</Td>
                        </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </ModalBody>
                  <ModalFooter>              
                    <Button onClick={closeTab}>Cancel</Button>
                  </ModalFooter>
                </ModalContent>
                </Modal>
              }
          </Box>
          <Box>
            <Button colorScheme="gray" onClick={processLogout} variant="outline"> Logout </Button>
          </Box>
        </Stack>
        <Box height="auto">
          <PreJoinScreens
            doLogin={doLogin}
            setMediaError={setMediaError}
          />
        </Box>
      </VStack>
    </>
  );
}
