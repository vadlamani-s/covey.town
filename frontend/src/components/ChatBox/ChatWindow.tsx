import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useCoveyAppState from '../../hooks/useCoveyAppState';

interface Message {
  name: string;
  messageBody: string;
  messageId: string;
  playerId: string;
  isPrivate: boolean;
}

export default function ChatWindow(): JSX.Element {
  const { userName, myPlayerID, nearbyPlayers, socket } = useCoveyAppState();
  const [messageList, setMessage] = useState<Array<Message>>([]);
  // const [privateMessageList, setPrivateMessage] = useState<Array<Message>>([]);
  const [myMessage, setMyMessage] = useState<string>('');
  const [recentMessageId, setRecentMsgId] = useState<string>('');
  const [isPrivate, setPrivate] = useState<boolean>(false);
  const [radioValue, setValue] = useState<string>('public');
  const [selectedPrivatePlayer, setPrivatePlayer] = useState<string>('');

  socket?.off('chatMsgReceivedPublic');
  socket?.on('chatMsgReceivedPublic', (val: Record<string, string>) => {
    const newMsg = {
      name: val.name,
      messageBody: val.messageBody,
      playerId: val.playerId,
      messageId: val.messageId,
      isPrivate: false,
    };
    messageList.push(newMsg);
    setRecentMsgId(val.messageId);
    setMessage(messageList);
  });

  socket?.off('chatMsgReceivedPrivate');
  socket?.on('chatMsgReceivedPrivate', (val: Record<string, string>) => {
    const newMsg = {
      name: val.name,
      messageBody: val.messageBody,
      playerId: val.playerId,
      messageId: val.messageId,
      isPrivate: true,
    };
    messageList.push(newMsg);
    setRecentMsgId(val.messageId);
    setMessage(messageList);
  });

  const sendMessage = () => {
    if (myMessage.length !== 0 && !isPrivate) {
      const newMsg: Message = {
        name: userName,
        messageBody: myMessage,
        playerId: myPlayerID,
        messageId: `${myPlayerID}_pub_${messageList.length}`,
        isPrivate: false,
      };
      socket?.emit('chatMsgSendPublic', newMsg);
    } else if (myMessage.length !== 0 && isPrivate) {
      const newMsg: Message = {
        name: userName,
        messageBody: myMessage,
        playerId: myPlayerID,
        messageId: `${myPlayerID}_pri_${messageList.length}`,
        isPrivate: true,
      };
      socket?.emit('chatMsgSendPrivate', newMsg, selectedPrivatePlayer);
    }
    setMyMessage('');
  };

  useEffect(() => {
    console.log(recentMessageId);
    console.log(nearbyPlayers.nearbyPlayers);
  }, [recentMessageId, nearbyPlayers.nearbyPlayers]);

  return (
    <Container marginTop='10px' minH='400px' border='2px' borderRadius='5px' borderColor='gray.400'>
      <Box py={2}>
        <RadioGroup
          onChange={e => {
            setValue(e as string);
            setPrivate((e as string) === 'private');
          }}
          value={radioValue}>
          <Stack direction='row'>
            <Radio value='public'>Public</Radio>
            <Radio value='private'>Private</Radio>
          </Stack>
        </RadioGroup>
      </Box>
      {radioValue === 'private' ? (
        <Box py={2}>
          <Select
            size='xs'
            placeholder='Select option'
            value={selectedPrivatePlayer}
            onChange={e => {
              setPrivatePlayer(e.target.value as string);
            }}>
            {nearbyPlayers.nearbyPlayers.map(player => (
              <option key={player.id} value={player.id}>
                {player.userName}
              </option>
            ))}
          </Select>
        </Box>
      ) : (
        <></>
      )}
      <Box minH='340px'>
        {messageList.map(item => (
          <List key={item.messageId}>
            <div>
              <ListItem>
                <div style={{ color: 'red' }}>{`${item.name}: ${
                  item.isPrivate ? 'Private' : 'Public'
                }`}</div>
                <div>{item.messageBody}</div>
              </ListItem>
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
