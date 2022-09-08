import React, { useEffect, useState } from 'react';
import CECopy from './CECopy';
import CNCopy from './CNCopy';
import CSCopy from './CSCopy';
import CRMCopy from './CRMCopy';
import { getEmpListInSameUnit } from '../../context/EmployeeAxios';
import styles from '../../css/chat/ChatCopy.module.css';
import Box from '@mui/material/Box';
import ClearIcon from '@mui/icons-material/Clear';

export default function Test({ open, setOpen, empInfo }) {
  const handleClose = () => setOpen(false);
  const [chatEmpList, setCEList] = useState([]);
  const [chatUnitList, setCUList] = useState([]);
  const [openCreatChat, setopenCreatChat] = useState(false);
  const [invite, setInvite] = useState([]);
  const empId = empInfo.empId;
  const [chatStatus, setChatStatus] = useState('chatEmpList');

  // const returnArr = (list, setCUList) => {
  //   const arr = [];

  //   list.map((row) => {
  //     return arr.push(row.unit.unitName);
  //   });

  //   const array = arr.filter((row, index) => {
  //     return arr.indexOf(row) === index;
  //   });

  //   return setCUList(array);
  // };

  // 사원list 출력하기
  // useEffect(() => {
  //   setInvite([]);
  //   if (!!empId) {
  //     if (chatUnitList.length === 0) {
  //       if (chatEmpList.length === 0) {
  //         getEmpListInSameUnit(empId, setCEList);
  //       } else {
  //         setCUList(chatEmpList.unit);
  //         returnArr(chatEmpList, setCUList);
  //       }
  //     }
  //   }
  // }, [empId, chatEmpList, chatUnitList]);

  //초대할 사원을 담아두는 메소드
  // const onInvite = (checked, data) => {
  //   if (checked) {
  //     setInvite([...invite, data]);
  //   } else {
  //     setInvite(invite.filter((button) => button !== data));
  //   }
  // };

  // const eventClickHandle = () => {
  //   if (invite.length === 0) {
  //     alert('사원을 선택해주세요!!');
  //   } else {
  //     setopenCreatChat(true);
  //   }
  // };

  useEffect(() => {}, [chatStatus]);

  return (
    <div>
      <Box open={open}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#d0eef7',
          }}>
          <span
            style={{
              fontSize: '18px',
              marginLeft: '20px',
              color: 'black',
            }}>
            메신저
          </span>
          <div style={{ float: 'right' }} onClick={handleClose}>
            <ClearIcon />
          </div>
        </div>
        <hr />
        <div className={styles.side2}>
          <div className={styles.listcon}>
            <CSCopy setChatStatus={setChatStatus} />
            {chatStatus === 'chatEmpList' ? (
              <CECopy open={open} setOpen={setOpen} empInfo={empInfo} />
            ) : chatStatus === 'chatList' ? (
              <CRMCopy empInfo={empInfo} setChatStatus={setChatStatus} />
            ) : chatStatus === 'chatNotice' ? (
              <CNCopy empInfo={empInfo} setChatStatus={setChatStatus} />
            ) : (
              ''
            )}
          </div>
        </div>
      </Box>
    </div>
  );
}
