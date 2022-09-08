import { useEffect, useRef, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import ChatStomp from '../chat/ChatStomp';
import InviteEmpCopy from './InviteEmpCopy';
import { sendExit } from '../../utils/ChatUtils';
import {
  chatRecord2,
  chatroomInfo,
  empIdInfo,
  onExitRoom,
  onHCupdate,
  onUserUpdate,
} from '../../context/ChatAxios';
import styles from '../../css/chat/ChatCopy.module.css';
import {
  Button,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ExitChatroom from '../chat/ExitChatroom';
import InviteEmp from '../chat/InviteEmp';
import { style } from '@mui/system';

function ChatCopy({ empInfo, roomId, setChatStatus }) {
  const empId = empInfo.empId;
  const chatroomId = roomId;
  const [input, setInput] = useState([]);
  const inputRef = useRef();
  // socket
  const client = ChatStomp();

  console.log(roomId);

  //채팅방 사람 확인 state
  const [open, setOpen] = useState(false);

  //채팅방 채팅기록
  const [chatting, setChatting] = useState([]);

  //채팅방 정보 불러오기
  const [chatroomName, setChatroomName] = useState('');
  const [headCount, setHeadCount] = useState(0);

  //chatroomEmployee T에 chatroomId로 사원정보 가져오기
  //채팅방에 어떤사람이 남아있는지 알려주기 위해서
  const [chatempinfo, setChatempinfo] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  // 채팅방 이름 바꾸기
  const [chatRoomTitle, setChatRoomTitle] = useState(chatroomName);
  const [clickChk, setClickChk] = useState(0);

  //채팅방 나가기 모달
  const [openExitChat, setOpenExitChat] = useState(false);

  //삭제확인알림창
  const eventClickHandle = () => {
    setOpenExitChat(true);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const styleBox = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
  };

  client.connect({}, () => {
    client.subscribe(`/topic/message`, (data) => {
      const chat = JSON.parse(data.body);
      setInput([...input, chat]);
      disconnect();
    });
  });

  const disconnect = () => {
    client.disconnect();
  };

  const send = () => {
    if (inputRef.current.value.trim() !== '') {
      client.send(
        '/app/chat/message',
        {},
        JSON.stringify({
          chatroomId: chatroomId,
          writer: empInfo,
          chatContent: inputRef.current.value,
        })
      );
    }
  };

  //엔터키
  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      send();
      inputRef.current.value = '';
    }
  };

  //chatroom에 들어갔을 때 기록남게
  useEffect(() => {
    if (!!chatroomId) {
      empIdInfo(chatroomId, setChatempinfo);
    }
    chatRecord2(chatroomId, setChatting, empId);
    chatroomInfo(chatroomId, setChatroomName, setHeadCount);
  }, [input, chatroomId, chatting.length]);

  //채팅방 이름수정
  const onChangeTitle = (event) => {
    setChatRoomTitle(event.target.value);
  };
  useEffect(() => {
    setChatRoomTitle(chatroomName);
    setClickChk(clickChk);
  }, [chatroomName, clickChk]);

  const onClickChatRoomTitle = () => {
    setClickChk(clickChk + 1);
    if (clickChk > 1) {
      setClickChk(0);
    }
  };

  // useEffect(() => {
  //   if (chatempinfo.length !== 0) {
  // empIdInfo(chatroomId, setChatempinfo);
  //   }
  // }, [chatempinfo]);

  const keyEnter = (e) => {
    if (e.key == 'Enter') {
      setClickChk(0);
      onChangeTitle();
    }
  };

  return (
    <div className={styles.chatconvimeline}>
      <div className={styles.chatroomname}>
        {chatroomName ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '33px',
              justifyContent: 'center',
            }}>
            <TextField
              id="outlined-multiline-flexible"
              multiline
              sx={{
                '& .MuiInputBase-root': {
                  height: 20,
                },
              }}
              value={chatRoomTitle}
              onChange={onChangeTitle}
              onKeyPress={keyEnter}
              onClick={onClickChatRoomTitle}
            />
            {clickChk == 2 ? (
              <Button
                variant="contained"
                sx={{ height: 30 }}
                onClick={() => {
                  onUserUpdate(chatroomId, chatRoomTitle, headCount);
                  setClickChk(0);
                }}>
                수정하기
              </Button>
            ) : (
              ''
            )}
          </div>
        ) : (
          <h5 className=" mb-2 font-weight-bold text-gray-dark">
            {chatRoomTitle}{' '}
          </h5>
        )}
      </div>

      <List sx={{ zIndex: 5 }}>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="채팅중인 사람" />

          {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </ListItemButton>

        <Collapse
          in={open}
          timeout="auto"
          unmountOnExit
          sx={{
            position: 'absolute',
            width: '100%',
            background: 'lightgray',
            paddingTop: 2,
            maxHeight: 200,
            overflowY: 'scroll',
          }}>
          {chatempinfo &&
            chatempinfo.map((data, index) => {
              return (
                <List component="div" disablePadding key={index}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary={data.empId.empName} />
                  </ListItemButton>
                </List>
              );
            })}
          {/* 채팅방 나가기 */}
          <div className={styles.logoutBtn}>
            {/* 사원추가 */}
            <Button
              onClick={(e) => {
                e.preventDefault();
                setModalOpen(true);
              }}>
              <PersonAddAlt1Icon />
            </Button>

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
              <LogoutIcon />
            </Button>
            {openExitChat && (
              <ExitChatroom
                openExitChat={openExitChat}
                setOpenExitChat={setOpenExitChat}
                chatroomId={chatroomId}
                chatroomName={chatroomName}
                headCount={headCount}
              />
            )}
          </div>
        </Collapse>
      </List>

      {modalOpen && (
        <InviteEmpCopy
          style={styleBox}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          setChatempinfo={setChatempinfo}
          empInfo={empInfo}
          chatroomId={chatroomId}
        />
      )}

      <ScrollToBottom className={styles.scrollbar} id="scroller">
        {/* 채팅기록을 가져옴 */}
        {chatting.map((msg, index) => {
          const chatTime = msg.chatTime.substr(11, 5);
          if (msg.status === 1) {
            return (
              <div key={index}>
                {msg.employee.empId === empInfo.empId ? (
                  <div className={styles.message}>
                    <div className={styles.mytime}>{chatTime}</div>
                    <div className={styles.mycontent}>{msg.chatContent}</div>
                  </div>
                ) : (
                  <div key={index} className={styles.othermessage}>
                    <div>{msg.employee.empName}</div>
                    <div className={styles.contentContan}>
                      <div className={styles.othercontent}>
                        {msg.chatContent}
                      </div>
                      <div className={styles.time}>{chatTime}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          } else if (msg.status === 2) {
            const scheduleContent = JSON.parse(msg.chatContent);
            let startValue = scheduleContent.Startvalue.replace('T', ' ');
            let endValue = scheduleContent.endvalue.replace('T', ' ');
            return (
              <>
                <div key={index} className={styles.othermessage}>
                  <div>{msg.employee.empName}</div>
                  <div className={styles.contentContan}>
                    <div className={styles.scheduleContent}>
                      <div>일정제목 : {scheduleContent.scheduletitle}</div>
                      <div>일정내용 : {scheduleContent.CalendarContent}</div>
                      <div>장소 : {scheduleContent.CalendarLocation}</div>
                      <div>
                        시작일자 : <br />
                        {startValue}
                      </div>
                      <div>
                        종료일자 : <br />
                        {endValue}
                      </div>
                    </div>
                    <div className={styles.time}>{chatTime}</div>
                  </div>
                </div>
              </>
            );
          }
        })}
      </ScrollToBottom>

      <div className={styles.scroll}>
        <div className={styles.contain}></div>
        <div className={styles.inputmain}>
          <input
            className={styles.inputform}
            ref={inputRef}
            onKeyPress={onKeyPress}
            placeholder="메시지를 입력하세요"
          />

          <Button
            variant="contained"
            endIcon={<SendIcon />}
            className={styles.inputbutton}
            onClick={() => {
              inputRef.current.value && send();
              inputRef.current.focus();
              inputRef.current.value = '';
            }}>
            전송
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ChatCopy;
