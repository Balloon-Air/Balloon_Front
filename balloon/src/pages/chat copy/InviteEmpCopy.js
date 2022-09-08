import React, { useState, useEffect } from 'react';
import ChatStomp from '../chat/ChatStomp';
import { getEmpListInSameUnit } from '../../context/EmployeeAxios';
import {
  chatroomInfo,
  empIdInfo,
  onHCInvite,
  onUserInvite,
} from '../../context/ChatAxios';
import styles from '../../css/chat/ChatCopy.module.css';
import { Checkbox } from '@mui/material';
import { Box, Button, Modal } from '@mui/material';

function InviteEmpCopy({
  style,
  modalOpen,
  setModalOpen,
  setChatempinfo,
  empInfo,
  chatroomId,
}) {
  const [chatEmpList, setCEList] = useState([]);
  const [chatUnitList, setCUList] = useState([]);
  const [newInvite, setNewInvite] = useState([]);
  const [existChatEmp, setECEList] = useState([]);

  //채팅방 정보 불러오기
  const [chatroomName, setChatroomName] = useState('');
  const [headCount, setHeadCount] = useState(0);
  const [chatAddEmpInfo, setChatAddEmpInfo] = useState([]);
  const empId = empInfo.empId;

  // socket
  const client = ChatStomp();

  ////////////////////////////////////////////////////////////
  //이미 채팅방에 초대 된 사원들 -> existEmp
  const existEmp = [];
  chatAddEmpInfo.map((info) => {
    return existEmp.push(info.empId.empId);
  });

  //Unit이름 띄우기
  const returnArr = (list, setCUList) => {
    const arr = [];
    list.map((row) => {
      return arr.push(row.unit.unitName);
    });
    const array = arr.filter((row, index) => {
      return arr.indexOf(row) === index;
    });
    return setCUList(array);
  };

  //초대할 사원을 담아두는 메소드
  const onInvite = (checked, data) => {
    if (checked) {
      setNewInvite([...newInvite, data]);
    } else {
      setNewInvite(newInvite.filter((button) => button !== data));
    }
  };

  //채팅방에 없는 사원list
  const ChatEmpHandle = (chatEmpList, setECEList) => {
    const arr = chatEmpList.filter((list) => !existEmp.includes(list.empId));
    setECEList(arr);
  };

  useEffect(() => {
    if (!!chatroomId) {
      //사원정보가져오기
      chatroomInfo(chatroomId, setChatroomName, setHeadCount);
      empIdInfo(chatroomId, setChatAddEmpInfo);
      if (chatUnitList.length === 0) {
        if (chatEmpList.length === 0) {
          // 사원list 출력하기
          getEmpListInSameUnit(empId, setCEList);
          setNewInvite([]);
        } else {
          setCUList(chatEmpList.unit);
          returnArr(chatEmpList, setCUList);
          ChatEmpHandle(chatEmpList, setECEList);
        }
      }
    }
  }, [chatroomId, chatEmpList, empId, chatUnitList, existChatEmp]);

  const closemodal = () => {
    setModalOpen(false);
  };

  return (
    <Modal open={modalOpen} onClose={closemodal}>
      <Box sx={style}>
        <h3>사원 초대하기</h3>
        <div className={styles.olList}>
          {chatUnitList.length !== 0 &&
            chatUnitList.map((cu, index) => {
              return (
                <div key={index} className={styles.cuCon}>
                  <p className={styles.cuName}>{cu}</p>
                  {existChatEmp.length !== 0 &&
                    existChatEmp.map((ce, index) => {
                      if (ce.unit.unitName === cu) {
                        return (
                          <div key={index} className={styles.fontlist}>
                            {ce.empName} {ce.position}
                            <Checkbox
                              type="checkbox"
                              onChange={(e) => {
                                onInvite(e.currentTarget.checked, ce);
                              }}
                              checked={newInvite.includes(ce) ? true : false}
                            />
                          </div>
                        );
                      }
                    })}
                </div>
              );
            })}
        </div>
        <Button
          variant="contained"
          onClick={() => (
            onUserInvite(chatroomId, newInvite, client),
            onHCInvite(chatroomId, chatroomName, headCount, newInvite),
            closemodal(),
            empIdInfo(chatroomId, setChatempinfo)
          )}>
          초대하기
        </Button>
      </Box>
    </Modal>
  );
}

export default InviteEmpCopy;
