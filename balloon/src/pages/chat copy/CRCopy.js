import React, { useState, useEffect, useRef } from 'react';
import ChatStomp from '../chat/ChatStomp';
import { onCreateChatroom2, onAllChatEmp } from '../../context/ChatAxios';
import styles from '../../css/chat/ChatCopy.module.css';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { Box, Modal } from '@mui/material';

const styleBox = {
  position: 'absolute',
  top: '80%',
  left: '97%',
  transform: 'translate(-90%, -90%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  textAlign: 'center',
  padding: 4,
};

function CRCopy({
  invite,
  openCreatChat,
  setopenCreatChat,
  empInfo,
  setChatStatus,
}) {
  const inputRef = useRef();
  //로그인한 사원ID
  const empId = empInfo.empId;
  const [allChatEmp, setAllChatEmp] = useState([]);
  // socket
  const client = ChatStomp();

  const keyEnter = (e) => {
    if (e.key === 'Enter') {
      eventChatHandle();
    }
  };

  //초대할 사원
  const alreadyInvite = [];
  invite.map((vite) => {
    alreadyInvite.push(vite.empId);
  });

  //headCount가 2인 chatroomEmployee T 정보 가져옴
  useEffect(() => {
    onAllChatEmp(setAllChatEmp, empId);
  }, []);

  // useEffect(() => {}, [openCreatChat]);

  //1:1채팅일 때 이미있는 채팅방 예외처리
  const checkChatEmp = (allChatEmp, alreadyInvite) => {
    let check = true;
    allChatEmp.map((id) => {
      if (id.empId.empId == alreadyInvite) {
        alert('이미 있는 채팅방입니다');
        check = false;
      }
    });
    return check;
  };

  //채팅방이름 공백처리
  //1:1채팅일 때 이미있는 채팅방 예외처리
  const eventChatHandle = () => {
    const input = document.getElementById('chatroomName');
    if (input.value.trim() !== '') {
      if (input.value.length === 0) {
        inputRef.current.focus();
        input.value = '';
        alert('채팅방 이름을 입력해주세요!!');
      } else {
        if (alreadyInvite.length === 1) {
          const check = checkChatEmp(allChatEmp, alreadyInvite[0]);
          check &&
            onCreateChatroom2(
              empInfo,
              invite,
              document.getElementById('chatroomName'),
              client,
              setChatStatus
            );

          handleClose();
        } else {
          onCreateChatroom2(
            empInfo,
            invite,
            document.getElementById('chatroomName'),
            client,
            setChatStatus
          );
          handleClose();
        }
      }
    } else {
      inputRef.current.focus();
      input.value = '';
      alert('채팅방 이름을 입력해주세요!!');
    }
  };

  //채팅방모달
  const handleClose = () => setopenCreatChat(false);

  return (
    <Modal open={openCreatChat} onClose={handleClose}>
      <Box sx={styleBox}>
        <h3 className={styles.inBox}>채팅방 만들기</h3>
        <div>
          <Input
            id="chatroomName"
            className={styles.inBox}
            ref={inputRef}
            onKeyPress={keyEnter}
            placeholder="채팅방 이름을 입력하세요"
          />
          <Button
            variant="contained"
            onClick={() => {
              eventChatHandle();
            }}>
            <div>채팅하기</div>
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
export default CRCopy;
