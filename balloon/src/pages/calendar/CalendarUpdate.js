import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  getScheduleIdInModal,
  updateSchedule,
  deleteSchedule,
} from '../../context/CalendarAxios';
import styles from '../../css/Component.module.css';
import { BsCalendarWeek } from 'react-icons/bs';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function CalendarUpdate({ style, openUpdate, setOpenUpdate, scheduleId }) {
  const handleClose = () => {
    setOpenUpdate(false);
    window.location.href = '/calendar';
  };

  const [list, setList] = useState([]);
  const [startValue, setStartValue] = useState(list.scheduleStart);
  const [endvalue, setEndValue] = useState(list.scheduleEnd);
  console.log(list.scheduleStart);
  const [empInfo] = useOutletContext();

  useEffect(() => {
    const headers = {
      'Content-Type': 'application/json',
    };
    getScheduleIdInModal(openUpdate.scheduleId, headers, setList);
  }, []);

  useEffect(() => {
    setStartValue(list.scheduleStart);
    setEndValue(list.scheduleEnd);
    console.log(startValue);
    console.log(endvalue);
  }, [list]);

  //업데이트
  const updateHandle = async () => {
    const scheduletitle = document.getElementById('scheduletitle').value;
    const CalendarContent = document.getElementById('CalendarContent').value;
    const CalendarLocation = document.getElementById('CalendarLocation').value;

    const inputdata = {
      scheduleId: list.scheduleId,
      scheduleTitle: scheduletitle,
      scheduleStart: startValue,
      scheduleEnd: endvalue,
      empName: empInfo.empName,
      scheduleMemo: CalendarContent,
      scheduleLocation: CalendarLocation,
      empId: { empId: empInfo.empId },
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    await updateSchedule(inputdata, headers, setOpenUpdate);
  };

  const deletehandle = async () => {
    console.log(openUpdate.scheduleId);
    await deleteSchedule(openUpdate.scheduleId, handleClose);
  };

  return (
    <Modal
      open={openUpdate.length !== 0 && openUpdate.state}
      onClose={() => handleClose()}>
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h4"
          component="h4"
          sx={{ mb: 2, mt: 2, color: '#00AAFF' }}>
          <BsCalendarWeek className={styles.icon} />
          <span>일정 보기</span>
          <hr />
        </Typography>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h6"
          sx={{ mb: 2, mt: 2, color: 'red' }}>
          일정 제목
        </Typography>
        <input
          required
          defaultValue={list.scheduleTitle}
          className={styles.input}
          id="scheduletitle"
        />
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h6"
          sx={{ mb: 2, mt: 2 }}>
          일정
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {/* <DateTimePicker
            locale={ko}
            label="시작일"
            value={startValue}
            inputFormat={'yyyy/MM/dd  HH:mm'}
            renderInput={(params) => <TextField {...params} />}
            onChange={(newValue) => {
              setStartValue(newValue);
            }}
          /> */}
          <TextField
            id="startvalue"
            label="시작일"
            type="datetime-local"
            value={!!startValue && startValue}
            sx={{ width: 250 }}
            onChange={(e) => {
              setStartValue(e.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </LocalizationProvider>
        <span className={styles.centerfont}> : </span>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {/* <DateTimePicker */}

          {/* <DateTimePicker

            locale={ko}
            label="끝나는일"
            value={endvalue}
            inputFormat={'yyyy/MM/dd  HH:mm'}
            onChange={(newValue) => {
              setEndValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          /> */}

          <TextField
            id="endvalue"
            label="끝나는 일"
            type="datetime-local"
            value={!!endvalue && endvalue}
            sx={{ width: 250 }}
            onChange={(e) => {
              setEndValue(e.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </LocalizationProvider>

        <Typography
          id="modal-modal-description"
          variant="h6"
          sx={{ mt: 2, mb: 2 }}>
          MEMO
        </Typography>
        <input
          defaultValue={list.scheduleMemo}
          className={styles.input}
          id="CalendarContent"></input>
        <Typography
          id="modal-modal-description"
          variant="h6"
          sx={{ mt: 2, mb: 2 }}>
          장소
        </Typography>
        <input
          defaultValue={list.scheduleLocation}
          className={styles.input}
          id="CalendarLocation"
        />
        <br />
        <Button
          onClick={() => handleClose()}
          sx={{ fontSize: 30, mr: 3, border: 1, mt: 1 }}>
          취소
        </Button>
        <Button
          onClick={() => updateHandle()}
          sx={{ fontSize: 30, border: 1, mr: 3, mt: 1 }}>
          수정
        </Button>
        <Button
          onClick={() => deletehandle()}
          sx={{ fontSize: 30, border: 1, mt: 1 }}>
          삭제
        </Button>
      </Box>
    </Modal>
  );
}

export default CalendarUpdate;
