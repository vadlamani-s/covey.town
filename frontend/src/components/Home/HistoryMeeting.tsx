import React, { useCallback, useEffect, useState } from 'react';

import {
    Box,    
    Heading,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Container
  } from '@chakra-ui/react';

import useCoveyAppState from '../../hooks/useCoveyAppState';

import { RoomLogin } from '../../classes/TownsServiceClient';

const HistoryMeeting: React.FunctionComponent = () => {

    const [meetingLogs, setMeetingLogs] = useState<RoomLogin[]>();
    
    const {apiClient} = useCoveyAppState();

     const handleMeeting = useCallback(() => {
        apiClient.fetchLogs()
          .then((log) => {
            setMeetingLogs(log.logs)
          })
      }, [setMeetingLogs, apiClient]);

      useEffect(() => {
        handleMeeting();
        const timer = setInterval(handleMeeting, 2000);
        return () => {
          clearInterval(timer)
        };
      }, [handleMeeting]);
    
    return<>


        <Container maxH="500px" centerContent>
            <Heading p="4" as="h4" size="md">Meeting History</Heading>
            <Box maxH="500px" overflowY="scroll">
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
            </Box>
        </Container>
        
        
        
    </>

}

export default HistoryMeeting;