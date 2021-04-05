import { Box, HStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { TownJoinResponse } from '../../classes/TownsServiceClient';
import HistoryMeeting from '../Home/HistoryMeeting';
import MenuBar from '../Home/MenuBar';
import MediaErrorSnackbar from '../VideoCall/VideoFrontend/components/PreJoinScreens/MediaErrorSnackbar/MediaErrorSnackbar';
import PreJoinScreens from '../VideoCall/VideoFrontend/components/PreJoinScreens/PreJoinScreens';

interface LoginProps {
  doLogin: (initData: TownJoinResponse) => Promise<boolean>;
  logoutHandler: (userName: string) => boolean;
  emailId: string;
}

export default function Login({ doLogin, logoutHandler, emailId }: LoginProps): JSX.Element {
  const [mediaError, setMediaError] = useState<Error>();

  return (
    <>
      <MediaErrorSnackbar error={mediaError} dismissError={() => setMediaError(undefined)} />
      <HStack spacing={8}>
        <Box>
          <MenuBar logoutHandler={logoutHandler} emailID={emailId} />
          <HistoryMeeting />
        </Box>
        <Box>
          <PreJoinScreens doLogin={doLogin} setMediaError={setMediaError} />
        </Box>
      </HStack>
    </>
  );
}
