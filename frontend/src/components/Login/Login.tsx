import React, { useState } from 'react';
import { HStack, Box } from "@chakra-ui/react";
import PreJoinScreens from '../VideoCall/VideoFrontend/components/PreJoinScreens/PreJoinScreens';
import MediaErrorSnackbar
  from '../VideoCall/VideoFrontend/components/PreJoinScreens/MediaErrorSnackbar/MediaErrorSnackbar';
import { TownJoinResponse } from '../../classes/TownsServiceClient';
import HistoryMeeting from '../Home/HistoryMeeting';
import MenuBar from '../Home/MenuBar';

interface LoginProps {
  doLogin: (initData: TownJoinResponse) => Promise<boolean>
  logoutHandler: (userName: string) => boolean
  emailId: string
}

export default function Login({ doLogin, logoutHandler, emailId }: LoginProps): JSX.Element {
  const [mediaError, setMediaError] = useState<Error>();

  return (
    <>
      <MediaErrorSnackbar error={mediaError} dismissError={() => setMediaError(undefined)} />
      <HStack spacing={8}>
        <Box>
          <MenuBar logoutHandler={logoutHandler}
            emailID={emailId} />
          <HistoryMeeting />
        </Box>
        <Box>
          <PreJoinScreens
            doLogin={doLogin}
            setMediaError={setMediaError}
          />
        </Box>
      </HStack>
    </>
  );
}
