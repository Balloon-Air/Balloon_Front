import { useEffect, useState } from 'react';
import CalendarInsertModal from './CalendarInsertModal';
import { insertSchedulList } from '../../context/CalendarAxios';
import {
  getEmpByEmpId,
  getEmpListInSameUnit,
} from '../../context/EmployeeAxios';
import { botChatroom, onSchCreateChatroom } from '../../context/ChatAxios';
import styles from '../../css/Component.module.css';
import ChatStomp from '../chat/ChatStomp';
import { BsCalendarWeek } from 'react-icons/bs';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import ChatScheduleForm from '../chat/ChatScheduleForm';
import axios from 'axios';

function CalendarInsert({ style, openInsert, setOpenInsert, empInfo }) {
  const [startValue, setStartValue] = useState();
  const [endValue, setEndValue] = useState();
  const [eList, setCEList] = useState([]);
  const [botInfo, setBotInfo] = useState([]);
  const [inviteSchedule, setInviteSchedule] = useState([]);
  //이미 존재하는 사람들
  const [botRoom, setBotRoom] = useState([]);

  const empId = empInfo.empId;

  const scheduleListAdd = [];

  const calendarBot = 'Y0000001';

  //socket연결
  const client = ChatStomp();

  let scheduletitle = '';
  let CalendarContent = '';
  let CalendarLocation = '';
  let Startvalue = null;
  let endvalue = null;

  const handleClose = () => {
    setOpenInsert(false);
  };

  //사원추가 모달을 위한 open
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleListClose = () => {
    setInviteSchedule([]);
    setOpen(false);
  };

  const handleempAddClose = () => {
    if (inviteSchedule.length === 0) {
      alert('사원을 추가 해 주세요');
    } else {
      botChatroom(inviteSchedule, setBotRoom);
      setOpen(false);
    }
  };

  const insertHandle = () => {
    scheduletitle = document.getElementById('scheduletitle').value;
    CalendarContent = document.getElementById('CalendarContent').value;
    CalendarLocation = document.getElementById('CalendarLocation').value;
    Startvalue = document.getElementById('startvalue').value;
    endvalue = document.getElementById('endvalue').value;

    inviteSchedule.push(empId);
    console.log(inviteSchedule);
    console.log(Startvalue);

    const inputdata = {
      scheduleTitle: scheduletitle,
      scheduleStart: Startvalue,
      scheduleEnd: endvalue,
      empName: empInfo.empName,
      scheduleMemo: CalendarContent,
      scheduleLocation: CalendarLocation,
      employee: { empId: empInfo.empId },
      employeeIds: inviteSchedule,
    };

    const ids = inputdata.employeeIds;
    console.log(inputdata.employeeIds);
    ids.map((id) => {
      scheduleListAdd.push({
        scheduleTitle: inputdata.scheduleTitle,
        scheduleStart: inputdata.scheduleStart,
        scheduleEnd: inputdata.scheduleEnd,
        empName: inputdata.empName,
        scheduleMemo: inputdata.scheduleMemo,
        scheduleLocation: inputdata.scheduleLocation,
        employee: { empId: id },
      });
    });

    insertSchedulList(scheduleListAdd, setOpenInsert);

    //일정등록 후 알림보내기
    onSchCreateChatroom(
      invitepeople,
      client,
      calendarBot,
      newBotroomMsg,
      botroomMsg
    );
  };

  useEffect(() => {
    getEmpListInSameUnit(empId, setCEList);
    getEmpByEmpId(calendarBot, setBotInfo);
  }, []);

  const botroomExist = [];
  const botroomId = [];
  console.log(botRoom);
  botRoom.map((data) => {
    console.log(data.empId.empId);
    botroomExist.push(data.empId.empId);
    botroomId.push(data.chatroomId.chatroomId);
  });
  console.log(botroomExist);
  console.log(botroomId);
  console.log(inviteSchedule);

  //새로운 채팅방이 생성되어야할 사람들
  let invitepeople;
  invitepeople = inviteSchedule.filter(
    (people) => !botroomExist.includes(people)
  );

  //새로생성될 채팅방에 알림보내기
  const botroomMsg = (add, client) => {
    let newchatScheduleList = [];
    add.map((add) => {
      const chatSchedule = ChatScheduleForm(
        add.chatroomId,
        botInfo,
        scheduletitle,
        CalendarContent,
        CalendarLocation,
        Startvalue,
        endvalue,
        empInfo.empName,
        empInfo.position
      );
      const schduleChat = {
        chatroomId: add.chatroomId,
        writer: botInfo,
        chatContent: '일정이 등록되었습니다.',
      };

      //실시간으로 chat이 오기위해
      client.send('/app/chat/schedulemsg', {}, JSON.stringify(chatSchedule));
      client.send('/app/chat/schedulemsg', {}, JSON.stringify(schduleChat));

      newchatScheduleList.push(chatSchedule);
      newchatScheduleList.push(schduleChat);
    });
    console.log(newchatScheduleList);
    const chatScheduleSave = (newchatScheduleList) => {
      axios.post('/chat/messages', newchatScheduleList);
    };
    chatScheduleSave(newchatScheduleList);
  };

  // 이미생성된 채팅방에 알림보내기
  const newBotroomMsg = (client) => {
    let chatScheduleList = [];
    botroomId.map((id) => {
      const chatSchedule = ChatScheduleForm(
        id,
        botInfo,
        scheduletitle,
        CalendarContent,
        CalendarLocation,
        Startvalue,
        endvalue,
        empInfo.empName,
        empInfo.position
      );

      const chatNewSchedule = {
        chatroomId: id,
        writer: botInfo,
        chatContent: '새로운 일정이 등록되었습니다. 확인하세요',
      };

      client.send('/app/chat/schedulemsg', {}, JSON.stringify(chatSchedule));
      client.send('/app/chat/schedulemsg', {}, JSON.stringify(chatNewSchedule));

      chatScheduleList.push(chatSchedule);
      chatScheduleList.push(chatNewSchedule);
    });
    console.log(chatScheduleList);
    const chatScheduleSave = (chatScheduleList) => {
      axios.post('/chat/messages', chatScheduleList);
    };

    chatScheduleSave(chatScheduleList);
  };

  const sleep = (ms) => {
    return new Promise((r) => setTimeout(r, ms));
  };

  return (
    <Modal
      open={openInsert}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h4"
          component="h4"
          sx={{ mb: 2, mt: 2, color: '#00AAFF' }}>
          <BsCalendarWeek className={styles.icon} />
          <span>일정 등록</span>
          <hr />
        </Typography>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h6"
          sx={{ mb: 2, mt: 2 }}>
          일정 제목
        </Typography>
        <TextField
          required
          id="scheduletitle"
          label="일정 제목을 입력하세요"
          sx={{ width: '100%' }}
        />
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h6"
          sx={{ mb: 2, mt: 2 }}>
          날짜 선택
        </Typography>
        <TextField
          id="startvalue"
          label="시작일"
          type="datetime-local"
          defaultValue={startValue}
          onChange={(newValue) => {
            setStartValue(newValue);
          }}
          sx={{ width: 250 }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <span className={styles.centerfont}> : </span>
        <TextField
          id="endvalue"
          label="끝나는 일"
          type="datetime-local"
          defaultValue={endValue}
          sx={{ width: 250 }}
          onChange={(newValue) => {
            setEndValue(newValue);
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <br />
        <br />
        <Button onClick={handleOpen}>사원추가</Button>
        <CalendarInsertModal
          open={open}
          handleClose={handleClose}
          style={style}
          eList={eList}
          inviteSchedule={inviteSchedule}
          handleListClose={handleListClose}
          handleempAddClose={handleempAddClose}
          setInviteSchedule={setInviteSchedule}
        />

        <Typography id="modal-modal-description" variant="h6" sx={{ mt: 2 }}>
          MEMO
        </Typography>
        <TextField
          required
          id="CalendarContent"
          label="메모 입력"
          sx={{ width: '100%' }}
        />
        <Typography id="modal-modal-description" variant="h6" sx={{ mt: 2 }}>
          장소
        </Typography>
        <TextField
          required
          id="CalendarLocation"
          label="장소 입력"
          sx={{ mt: 1, width: '100%' }}
        />
        <Button
          onClick={handleClose}
          sx={{ fontSize: 30, mr: 3, border: 1, mt: 1 }}>
          취소
        </Button>
        {/* 채팅방만드는 부분 */}
        <Button
          onClick={() => {
            insertHandle();
          }}
          sx={{ fontSize: 30, border: 1, mt: 1 }}>
          등록
        </Button>
      </Box>
    </Modal>
  );
}

export default CalendarInsert;
