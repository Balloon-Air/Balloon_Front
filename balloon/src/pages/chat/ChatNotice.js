import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import ChatSide from './ChatSide';
import { onChatroom, onExitRoom } from '../../context/ChatAxios';
import { sendExit } from '../../utils/ChatUtils';
import ChatStomp from '../chat/ChatStomp';
import styles from '../../css/chat/Chat.module.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container } from '@mui/system';

function ChatNotice() {
  const [chatroom, setChatroom] = useState([]);
  const [empInfo] = useOutletContext();
  const empId = empInfo.empId;
  // socket
  const client = ChatStomp();

  //마지막으로 보낸 채팅list가져오기
  useEffect(() => {
    if (empId) {
      onChatroom(setChatroom, empId);
    }
  }, [empId]);

  return (
    <Container maxWidth="xs" className={styles.Listcontainer}>
      <div className={styles.side1}>
        <div className={styles.chatRoomList}>
          <ChatSide />
          <div className={styles.listroom}>
            <div className={styles.chatfont}>
              <div className={styles.ChatText}>공지 사항</div>
            </div>
            <div className={styles.roomContanar}>
              {chatroom.map((chat, index) => {
                console.log(chat.chatTime.substr(11, 5));
                console.log(chat.chatContent.substr(0, 15));
                console.log(chat.chatroom.chatroomName.substr(0, 15));
                return (
                  <div className={styles.roomcon} key={index}>
                    <Link to={`/chatting?room=${chat.chatroom.chatroomId}`}>
                      <Box className={styles.chatRoomBox}>
                        {chat.chatroom.chatroomName.length <= '15' ? (
                          <div>
                            <span className={styles.chatName}>
                              {chat.chatroom.chatroomName}(
                              {chat.chatroom.headCount})
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className={styles.chatName}>
                              {chat.chatroom.chatroomName.substr(0, 12)}...(
                              {chat.chatroom.headCount})
                            </span>
                          </div>
                        )}

                        <div className={styles.DeleteBtn}>
                          <Button
                            variant="text"
                            disableElevation
                            onClick={(e) => {
                              const roomDelete = () => {
                                e.preventDefault();
                                onExitRoom(
                                  chat.chatroom.chatroomId,
                                  empInfo.empId,
                                  sendExit(
                                    client,
                                    chat.chatroom.chatroomId,
                                    empInfo
                                  )
                                );

                                window.location.href = '/chatroom';
                              };

                              return roomDelete();
                            }}>
                            <DeleteIcon />
                          </Button>
                        </div>
                        <div className={styles.content}>
                          {chat.chatContent.length <= '30' ? (
                            <div className={styles.content}>
                              {chat.chatContent}
                              <div className={styles.LastTimecon}>
                                <div className={styles.LastTime}>
                                  {chat.chatTime.substr(11, 5)}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className={styles.content}>
                              {chat.chatContent.substr(0, 30)}...
                              <div className={styles.LastTime}>
                                {chat.chatTime.substr(11, 5)}
                              </div>
                            </div>
                          )}
                        </div>
                      </Box>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
export default ChatNotice;
