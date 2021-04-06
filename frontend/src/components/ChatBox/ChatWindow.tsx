import { Box, Button, Container, Flex, Input, List, ListItem } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useCoveyAppState from '../../hooks/useCoveyAppState';

interface Message {
  name: string;
  messageBody: string;
  messageId: string;
  playerId: string;
}

export default function ChatWindow(): JSX.Element {
  const { userName, myPlayerID, players, nearbyPlayers, socket } = useCoveyAppState();
  const [publicMessageList, setPublicMessage] = useState<Array<Message>>([]);
  const [privateMessageList, setPrivateMessage] = useState<Array<Message>>([]);
  const [myMessage, setMyMessage] = useState<string>('');
  const [recentMessageId, setRecentMsgId] = useState<string>('');
  const [isPrivate, setPrivate] = useState<boolean>(false);

  //   const publicMessageList: Array<Message> = [];

  socket?.off('chatMsgReceivedPublic');
  socket?.on('chatMsgReceivedPublic', (val: Record<string, string>) => {
    console.log(val);
    const newMsg = {
      name: val.name,
      messageBody: val.messageBody,
      playerId: val.playerId,
      messageId: val.messageId,
    };
    publicMessageList.push(newMsg);
    setRecentMsgId(val.messageId);
    setPublicMessage(publicMessageList);
  });

  socket?.off('chatMsgReceivedPrivate');
  socket?.on('chatMsgReceivedPrivate', (val: Record<string, string>) => {
    console.log(val);
    const newMsg = {
      name: val.name,
      messageBody: val.messageBody,
      playerId: val.playerId,
      messageId: val.messageId,
    };
    privateMessageList.push(newMsg);
    setRecentMsgId(val.messageId);
    setPrivateMessage(privateMessageList);
  });

  const sendMessage = () => {
    if (myMessage.length !== 0 && !isPrivate) {
      console.log(myPlayerID + publicMessageList.length);
      socket?.emit('chatMsgSendPublic', {
        name: userName,
        messageBody: myMessage,
        playerId: myPlayerID,
        messageId: myPlayerID + publicMessageList.length,
      });
    } else if (myMessage.length !== 0 && isPrivate) {
      console.log(myPlayerID + publicMessageList.length);
      socket?.emit('chatMsgSendPrivate', {
        name: userName,
        messageBody: myMessage,
        playerId: myPlayerID,
        messageId: myPlayerID + publicMessageList.length,
      });
    }
    setMyMessage('');
  };

  useEffect(() => {}, [recentMessageId]);

  //   const messages = useMemo(
  //     () =>
  //       publicMessageList.map(item => (
  //         <List key={item.name}>
  //           <div>
  //             <ListItem fontStyle='italic'>{item.name}</ListItem>
  //             <ListItem>{item.messageBody}</ListItem>
  //           </div>
  //         </List>
  //       )),
  //     [publicMessageList],
  //   );

  return (
    <Container marginTop='10px' minH='400px' border='2px' borderRadius='5px' borderColor='gray.400'>
      <Box minH='360px'>
        {publicMessageList.map(item => (
          <List key={item.name}>
            <div>
              <ListItem fontStyle='italic'>{item.name}</ListItem>
              <ListItem>{item.messageBody}</ListItem>
            </div>
          </List>
        ))}
      </Box>
      <Flex>
        <Input
          placeholder='Type your Message'
          size='sm'
          value={myMessage}
          onChange={event => setMyMessage(event.target.value)}
        />
        <Box paddingLeft='5px'>
          <Button size='sm' onClick={() => sendMessage()}>
            Send
          </Button>
        </Box>
      </Flex>
    </Container>
  );
}
