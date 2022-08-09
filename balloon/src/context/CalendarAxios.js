import axios from 'axios';

export const getScheduleByEmp = async (empId, list, setList) => {
  const url = '/api/cal/';
  const str = url + empId;
  await axios
    .get(str)
    .then((response) => {
      const arr = [];
      response.data.map((data) => {
        arr.push({
          scheduleId: data.scheduleId,
          title: data.scheduleTitle,
          start: data.scheduleStart,
          end: data.scheduleEnd,
          allDay: true,
          empId: data.employee.empId,
        });
      });
      setList(arr);
    })
    .catch((err) => console.log(err));
};

export const insertSchedule = async (inputdata, setOpen) => {
  const url = '/api/cal/insert';
  const headers = {
    'Content-Type': 'application/json',
  };

  await axios
    .post(url, inputdata, {
      headers,
    })
    .catch((err) => console.log(err));

  setOpen(false);
};

//삭제
export const deletehandle = async (scheduleId, handleClose) => {
  console.log(scheduleId);

  await axios
    .delete(`http://localhost:8080/cal/delete/${scheduleId}`)

    .then(() => {
      handleClose(false);
    })
    .catch((err) => console.log(err));

  window.location.href = '/calendar';
};