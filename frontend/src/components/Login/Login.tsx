import React, { useState, useCallback } from 'react';
import {
  Box,
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
  useToast,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  EditIcon
} from '@chakra-ui/icons';
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
  const [userPassword, setPassword] = useState<string>('');
  const [edit, setEdit] = useState<boolean>(false);
  
  
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

  const handleEdit = () => {
    if (edit) {
      setEdit(false);
    } else {
      setEdit(true);
    }
  }

  const processProfile = async () => {
    try {
      await apiClient.userProfile({
        emailId: emailID
      }).then((user) => setUserProfile(user));

      } catch (err) {
        setUserProfile({emailId: emailID, name: ' ', password: ' ', creationDate: new Date()});
      }
  };

  const handleProfile = () => {
    openTab();
    processProfile();
    setProfile(true);
  }

  const processUpdates = async (action: string) => {
      if (action === 'delete') {
        try {

          await apiClient.deleteProfile({emailId: emailID, password: userPassword});

          toast({
            title: 'User delete Successful',
            status: 'success'
          })

          logoutHandler('');

        } catch(err) {
          toast({
            title: 'Unable to delete',
            description: err.toString(),
            status: 'error'
          });
        }
      } else {
          try {

            await apiClient.updateProfile({name: userName, password: userPassword, emailId: emailID});

            toast({
              title: 'User update Successful',
              status: 'success'
            })

            logoutHandler(userName);
            closeTab();

          } catch(err) {
            toast({
              title: 'Unable to update',
              description: err.toString(),
              status: 'error'
            });
          }
      }
  };

  return (
    <>
      <MediaErrorSnackbar error={mediaError} dismissError={() => setMediaError(undefined)} />

          {
                profile && 
                <Modal isOpen={isOpen} onClose={closeTab}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader> {userProfile.name} Profile </ModalHeader>
                <ModalCloseButton />
                <form onSubmit={(ev) => { ev.preventDefault(); processUpdates('edit') }}>
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel htmlFor='userName'>User Name <EditIcon onClick={handleEdit}/> </FormLabel>
                            {
                              edit &&
                            <Input id='userName' name="userName" placeholder="User name" type="text" value={userName} onChange={(ev) => setUserName(ev.target.value)} />
                            }
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor='email'>Email address</FormLabel>
                            <Input id='emailID' placeholder="Email ID" name="emailID" value={emailID} />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel htmlFor="updatePassword">User Update/Delete Password</FormLabel>
                            <Input id="updatePassword" name="password" placeholder="Password"  type="password" value={userPassword} onChange={(e) => setPassword(e.target.value)} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button data-testid='deletebutton' colorScheme="red" mr={3} value="delete" name='action1' variant="outline" disabled={!userPassword} onClick={() => processUpdates('delete')}>
                            Delete
                        </Button>
                        <Button data-testid='updatebutton' colorScheme="green" mr={3} value="update" name='action2' variant="outline" disabled={!userPassword || !userName} onClick={() => processUpdates('edit')}>
                            Update
                        </Button>
                        <Button onClick={closeTab}>Cancel</Button>
                    </ModalFooter>
                </form>
                </ModalContent>
                </Modal>
              }

{
                logs && 
                <Modal isOpen={isOpen} onClose={closeTab} scrollBehavior='inside'>
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
  
        <Box height="auto">
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Menu
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleMeetings}>Meeting History</MenuItem>
              <MenuItem onClick={processLogout}> Logout</MenuItem>
            </MenuList>
          </Menu>
          <PreJoinScreens
            doLogin={doLogin}
            setMediaError={setMediaError}
          />
        </Box>
    </>
  );
}