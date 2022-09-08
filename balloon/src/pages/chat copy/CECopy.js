import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { getEmpListInSameUnit } from '../../context/EmployeeAxios';
import styles from '../../css/chat/ChatCopy.module.css';
import Button from '@mui/material/Button';
import { Alert, AlertTitle, Checkbox, Container, Grid } from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import CRCopy from './CRCopy';

export default function CECopy({ open, setOpen, empInfo }) {
  // const handleClose = () => setOpen(false);
  //채팅할사원
  const [chatEmpList, setCEList] = useState([]);
  //조직이름
  const [chatUnitList, setCUList] = useState([]);
  //채팅방모달
  const [openCreatChat, setopenCreatChat] = useState(false);
  //초대할 사원
  const [invite, setInvite] = useState([]);
  //로그인 한 사원아이디
  const empId = empInfo.empId;

  const [chatStatus, setChatStatus] = useState('chatEmpList');

  //로그인 한 사원이 속한 조직빼오기
  const returnUnit = (chatEmpList, setCUList) => {
    const unitname = [];

    chatEmpList.map((row) => {
      return unitname.push(row.unit.unitName);
    });

    const array = unitname.filter((row, index) => {
      return unitname.indexOf(row) === index;
    });

    return setCUList(array);
  };

  // 사원list 출력하기
  useEffect(() => {
    setInvite([]);
    if (!!empId) {
      if (chatUnitList.length === 0) {
        if (chatEmpList.length === 0) {
          getEmpListInSameUnit(empId, setCEList);
        } else {
          setCUList(chatEmpList.unit);
          returnUnit(chatEmpList, setCUList);
        }
      }
    }
  }, [empId, chatEmpList, chatUnitList, chatStatus]);

  //초대할 사원을 담아두는 메소드
  const onInvite = (checked, data) => {
    if (checked) {
      setInvite([...invite, data]);
    } else {
      setInvite(invite.filter((button) => button !== data));
    }
  };

  //사원 미선택 시 알림창
  const eventClickHandle = () => {
    if (invite.length === 0) {
      alert('사원을 선택해주세요!!');
    } else {
      console.log(invite);
      setopenCreatChat(true);
    }
  };

  // useEffect(() => {}, [chatStatus]);
  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"> */}
      <Box open={open}>
        <div className={styles.side2}>
          <div className={styles.listcon}>
            <div className={styles.list}>
              <div className={styles.chatIcon}>
                <div className={styles.text}>사원 목록</div>
                <Grid container justifyContent="flex-end">
                  <Button
                    className="chatIcon"
                    onClick={() => {
                      eventClickHandle();
                    }}>
                    <AddCommentIcon
                      fontSize="large"
                      className={styles.creatIcon}
                    />
                  </Button>
                  {openCreatChat && (
                    <CRCopy
                      invite={invite}
                      openCreatChat={openCreatChat}
                      setopenCreatChat={setopenCreatChat}
                      empInfo={empInfo}
                      setChatStatus={setChatStatus}
                      setInvite={setInvite}
                    />
                  )}
                </Grid>
              </div>
              {/* <hr /> */}
              <div className={styles.olList}>
                {chatUnitList.length !== 0 &&
                  chatUnitList.map((cu, index) => {
                    return (
                      <div key={index} className={styles.cuCon}>
                        <p className={styles.cuName}>{cu}</p>
                        {chatEmpList.map((ce, index) => {
                          if (ce.unit.unitName === cu) {
                            return (
                              <div key={index} className={styles.fontlist}>
                                {ce.empName} {ce.position}
                                <Checkbox
                                  type="checkbox"
                                  onChange={(e) => {
                                    onInvite(e.currentTarget.checked, ce);
                                  }}
                                  checked={invite.includes(ce) ? true : false}
                                />
                              </div>
                            );
                          }
                        })}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </Box>
      {/* </Modal> */}
    </div>
  );
}
