import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import ChatSide from './ChatSide';
import { onChatroom } from '../../context/ChatAxios';
import styles from '../../css/chat/Chat.module.css';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container } from '@mui/system';
import ExitChatroom from './ExitChatroom';

function ChatRoom() {
  const [chatroom, setChatroom] = useState([]);
  //채팅방 나가기 모달
  const [openExitChat, setOpenExitChat] = useState(false);
  const [empInfo] = useOutletContext();
  const empId = empInfo.empId;

  //마지막으로 보낸 채팅list가져오기
  useEffect(() => {
    if (empId) {
      onChatroom(setChatroom, empId);
    }
  }, [empId]);

  //삭제확인알림창
  const eventClickHandle = () => {
    setOpenExitChat(true);
  };

  return (
    <Container maxWidth="xs" className={styles.Listcontainer}>
      <div className={styles.side1}>
        <div className={styles.chatRoomList}>
          <ChatSide />
          <div className={styles.listroom}>
            <div className={styles.chatfont}>
              <div className={styles.ChatText}>채팅 목록</div>
            </div>
            <div className={styles.roomContanar}>
              {chatroom.map((chat, index) => {
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
                              const eventExit = () => {
                                e.preventDefault();
                                eventClickHandle();
                              };

                              return eventExit();
                            }}>
                            <DeleteIcon />
                          </Button>
                          {openExitChat && (
                            <ExitChatroom
                              openExitChat={openExitChat}
                              setOpenExitChat={setOpenExitChat}
                              chatroomId={chat.chatroom.chatroomId}
                              chatroomName={chat.chatroom.chatroomName}
                              headCount={chat.chatroom.headCount}
                            />
                          )}
                        </div>
                        <div className={styles.content}>
                          {chat.chatContent.length <= '15' ? (
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
                              {chat.chatContent.substr(0, 15)}...
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
export default ChatRoom;
