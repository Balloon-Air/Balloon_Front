import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import ModalApproval from './ModalApproval';
import { DfCard, ApCard } from './approvalCards/DrafterApproverCard';
import SideNavigation from '../../components/SideNavigation';
import { findUnitList } from '../../context/UnitAxios';
import {
  getEmpByEmpId,
  getEmpListInSameUnit,
} from '../../context/EmployeeAxios';
import {
  getLatestPA,
  insertApproval,
  insertPA,
} from '../../context/ApprovalAxios';
import { positionArr } from '../../context/EmpFunc';
import styles from '../../css/Report.module.css';
import '../../css/Modal.css';
import axios from 'axios';
import moment from 'moment';
import ChatStomp from '../chat/ChatStomp';
import { FcDocument } from 'react-icons/fc';
import {
  Button,
  Card,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { blue } from '@mui/material/colors';
import { botApvlChatroom, onApvlCreateChatroom } from '../../context/ChatAxios';
import PersonnelAppointmentForm from '../chat/PersonnelAppointmentForm';

//socket연결
const client = ChatStomp();

const SaveButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[500]),
  backgroundColor: blue[500],
  '&:hover': {
    backgroundColor: blue[700],
  },
}));

function PersonnelAppointment() {
  const [posi, setPosi] = useState('');
  const [units, setUnits] = useState('');
  const [unit, setUnit] = useState('');
  const [mEmpInfo, setMEmpInfo] = useState('');
  const [mEmp, setMEmp] = useState('');
  const [docNum, setDocNum] = useState(0);
  const [docId, setDocId] = useState('');
  const [approver, setApprover] = useState([]);
  const [noApprover, setNoApprover] = useState([]);

  // 날짜 관련
  const [startValue, setStartValue] = useState(null);

  // 모달
  // const [openModal, setOpenModal] = useState(false);
  const [openapprovalModal, setOpenapprovalModal] = useState(false);

  // 사원 정보 context
  const [empInfo] = useOutletContext();
  const [inputData, setInputData] = useState({});

  console.log(empInfo);
  console.log(mEmp);

  const [botInfo, setBotInfo] = useState([]);
  //이미 존재하는 사람들
  const [botApvlRoom, setBotApvlRoom] = useState([]);
  //결재선설정empId
  const apvlPeople = [];
  const approverBot = 'Y0000002';
  console.log(botInfo);
  const empName = empInfo.empName;
  const position = empInfo.position;
  const approvalForm = '인사명령';

  //기안제목
  const approvalTitle =
    document.getElementById('PATitle') &&
    document.getElementById('PATitle').value;
  console.log(approvalTitle);

  const member = mEmp.empName;
  const appointDepartment = unit.unitName;
  const appointPosition = posi;

  //결재선설정empIdList
  {
    approver.map((empId) => apvlPeople.push(empId.empId));
  }
  console.log(apvlPeople);
  console.log(botApvlRoom);

  //결재봇정보가져오기
  useEffect(() => {
    getEmpByEmpId(approverBot, setBotInfo);
    botApvlChatroom(apvlPeople, setBotApvlRoom);
  }, [apvlPeople.length]);

  const botroomExist = [];
  const botroomId = [];
  console.log(botApvlRoom);
  botApvlRoom.map((data) => {
    console.log(data.empId.empId);
    botroomExist.push(data.empId.empId);
    botroomId.push(data.chatroomId.chatroomId);
  });
  console.log(botroomExist);
  console.log(botroomId);

  //새로운 채팅방이 생성되어야할 사람들
  let newApvlPeople;
  newApvlPeople = apvlPeople.filter((people) => !botroomExist.includes(people));
  console.log(newApvlPeople);

  const sendChatHandle = () => {
    onApvlCreateChatroom(
      newApvlPeople,
      client,
      approverBot,
      AlreadyBotroomMsg,
      botroomMsg
    );
  };

  //생성될 채팅방에 알림보내기
  const botroomMsg = (add, client) => {
    let chatApprovalList = [];
    add.map((add) => {
      const chatApproval = PersonnelAppointmentForm(
        add.chatroomId,
        botInfo,
        approvalTitle,
        approvalForm,
        member,
        appointDepartment,
        appointPosition,
        empName,
        position
      );
      const approvalChat = {
        chatroomId: add.chatroomId,
        writer: botInfo,
        chatContent: '결재가 등록되었습니다.',
      };

      //실시간으로 chat이 오기위해
      client.send('/app/chat/schedulemsg', {}, JSON.stringify(chatApproval));
      client.send('/app/chat/schedulemsg', {}, JSON.stringify(approvalChat));

      chatApprovalList.push(chatApproval);
      chatApprovalList.push(approvalChat);
    });

    console.log(chatApprovalList);
    const chatApprovalSave = (chatApprovalList) => {
      axios.post('/chat/messages', chatApprovalList);
    };
    chatApprovalSave(chatApprovalList);
  };

  // 이미생성된 채팅방에 알림보내기
  const AlreadyBotroomMsg = (client) => {
    let AlreadyChatApproval = [];
    botroomId.map((id) => {
      const AchatApproval = PersonnelAppointmentForm(
        id,
        botInfo,
        approvalTitle,
        approvalForm,
        member,
        appointDepartment,
        appointPosition,
        empName,
        position
      );
      const chatNewApproval = {
        chatroomId: id,
        writer: botInfo,
        chatContent: '새로운 결재가 생성되었습니다. 확인하세요',
      };

      client.send('/app/chat/schedulemsg', {}, JSON.stringify(AchatApproval));
      client.send('/app/chat/schedulemsg', {}, JSON.stringify(chatNewApproval));

      AlreadyChatApproval.push(AchatApproval);
      AlreadyChatApproval.push(chatNewApproval);
    });
    console.log(AlreadyChatApproval);
    const chatScheduleSave = (AlreadyChatApproval) => {
      axios.post('/chat/messages', AlreadyChatApproval);
    };

    chatScheduleSave(AlreadyChatApproval);
  };

  useEffect(() => {
    if (units.length === 0) {
      findUnitList(setUnits);

      if (mEmpInfo.length === 0) {
        getEmpListInSameUnit(empInfo.empId, setMEmpInfo);
      }
    } else {
      if (docNum === 0) {
        getLatestPA(setDocNum);
        setDocId('인사명령-22-0000001');
      } else {
        setDocId('인사명령' + '-22-' + ('0000000' + (docNum + 1)).slice(-7));
      }

      noApprover.length === 0 && setNoApprover(noApprover);

      mEmp && console.log('mEmp~~~', mEmp);
    }
  }, [units, empInfo, mEmpInfo, docNum, noApprover, mEmp]);

  return (
    <SideNavigation>
      <Container>
        <p className={styles.maintitle}>
          <FcDocument />
          인사명령
        </p>

        <table className={styles.table}>
          <thead>
            <tr align="center" bgcolor="white">
              <td className={styles.tdleft}>기안양식</td>
              <td className={styles.td}>인사명령</td>
              <td className={styles.tdright}>문서번호</td>
              <th className={styles.th}>{docId}</th>
            </tr>
          </thead>

          <tbody>
            <tr align="center" bgcolor="white">
              <td className={styles.tdleft}>보존연한</td>
              <td className={styles.td}>5년</td>
              <td className={styles.tdleft}>기안자</td>
              <th className={styles.th}>
                {' '}
                {empInfo.empName}({empInfo.empId})
              </th>
            </tr>
            <tr align="center" bgcolor="white"></tr>
          </tbody>
        </table>
        <div className={styles.body1}>
          <span className={styles.subtitle}>결재선</span>
          <button
            type="button"
            className={styles.btnnav}
            onClick={() => {
              // setOpenModal(true);
              setOpenapprovalModal(true);
            }}
            id="cancelBtn">
            결재선설정
          </button>
        </div>
        {/* {openModal && <Modal closeModal={setOpenModal} />} */}
        {openapprovalModal && (
          <ModalApproval
            openapprovalModal={openapprovalModal}
            setOpenapprovalModal={setOpenapprovalModal}
            setApprover={setApprover}
            approver={approver}
            setNoApprover={setNoApprover}
            noApprover={noApprover}
          />
        )}
        <hr />
        <br />
        <div className={styles.approvalCard}>
          <Card
            variant="outlined"
            sx={{ maxWidth: 150 }}
            style={{ backgroundColor: '#F1F9FF' }}>
            {!!empInfo && <DfCard drafterName={empInfo.empName} />}
          </Card>

          {approver.map((empData, index) => {
            console.log(empData);

            return (
              <Card
                key={index}
                variant="outlined"
                sx={{ maxWidth: 150 }}
                style={{ backgroundColor: '#F1F9FF' }}>
                <ApCard approverName={empData.empName} />
              </Card>
            );
          })}
        </div>

        <hr className={styles.hrmargins} />

        <p className={styles.giantitle}>기안내용</p>
        <table className={styles.table}>
          <thead>
            <tr className={styles.trcon}>
              <td className={styles.tdleft}>기안제목</td>
              <td colSpan={2} className={styles.tdright}>
                {' '}
                <form>
                  <input
                    id="PATitle"
                    type="text"
                    name="title"
                    placeholder="기안제목을 입력하세요."
                    className={styles.inputtext}
                  />
                </form>
              </td>
            </tr>
          </thead>
        </table>
        <br />
        {/* 여기부터는 상세내용 */}

        <table className={styles.tableborder}>
          <thead>
            <tr className={styles.trcon}>
              <td className={styles.titlename}>인사명령일</td>
              <td className={styles.titlename} colSpan={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="일자 선택"
                    value={startValue}
                    type=" date"
                    inputFormat={'yyyy-MM-dd'}
                    onChange={(newValue) => {
                      setStartValue(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </td>
            </tr>
          </thead>
          <tbody className={styles.tbodyin}>
            <tr className={styles.trcolor}>
              <td className={styles.tdreaui}>구성원명</td>
              <td className={styles.tdreaui}>발령부서</td>
              <td className={styles.tdreaui}>발령직위</td>
            </tr>

            <tr>
              <td className={styles.tdreaui}>
                <FormControl fullWidth>
                  <InputLabel>구성원을 설정해주세요</InputLabel>
                  <Select
                    id="mEmp"
                    label="구성원을 선택하세요"
                    value={mEmp}
                    placeholder="구성원을 선택하세요"
                    onChange={(e) => {
                      setMEmp(e.target.value);
                    }}

                    // className={styles.inputtext}
                  >
                    {mEmpInfo.length !== 0 &&
                      mEmpInfo.map((mEmps, index) => (
                        <MenuItem key={index} value={mEmps}>
                          {mEmps.empName} ({mEmps.empId})
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </td>
              <td className={styles.tdreaui}>
                <FormControl fullWidth>
                  <InputLabel>부서를 설정해주세요</InputLabel>
                  <Select
                    id="unit1"
                    label="발령부서를 선택하세요"
                    value={unit}
                    placeholder=" 발령부서를 선택하세요"
                    onChange={(e) => {
                      setUnit(e.target.value);
                    }}

                    // className={styles.inputtext}
                  >
                    {units &&
                      units.map((unitInfo, index) => (
                        <MenuItem key={index} value={unitInfo}>
                          {unitInfo.unitName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </td>
              <td className={styles.tdreaui}>
                <FormControl fullWidth>
                  <InputLabel>직위를 설정해주세요</InputLabel>
                  <Select
                    id="position"
                    label="발령직위를 선택하세요"
                    value={posi}
                    placeholder=" 발령직위를 선택하세요"
                    onChange={(e) => {
                      setPosi(e.target.value);
                    }}

                    // className={styles.inputtext}
                  >
                    {positionArr.map((position, index) => (
                      <MenuItem key={index} value={position}>
                        {position}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </td>
            </tr>
          </tbody>
        </table>

        <div className={styles.fonttext}>
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            <TextField
              id="PAContent"
              fullWidth
              multiline
              rows={10}
              placeholder="내용을 입력해주세요."
            />
          </Paper>

          <div className={styles.savebutton}>
            <Box sx={{ '& button': { m: 1 } }}>
              <Link to={'/boxes/ds'}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={async () => {
                    await insertPA(
                      docId,
                      3,
                      inputData,
                      empInfo,
                      startValue,
                      mEmp,
                      unit,
                      posi,
                      setInputData
                    );

                    // approver.map((data, index) => {
                    //   console.log(data);
                    //   return insertApproval(docId, 0, data, inputData, empInfo);
                    // });
                    insertApproval(docId, 0, approver, inputData, empInfo);

                    alert('문서가 임시저장되었습니다!');
                  }}>
                  임시저장
                </Button>
              </Link>
              <Link
                to={'/boxes/dd'}
                onClick={async (e) => {
                  if (approver.length !== 0) {
                    await insertPA(
                      docId,
                      1,
                      inputData,
                      empInfo,
                      startValue,
                      mEmp,
                      unit,
                      posi,
                      setInputData
                    );
                    sendChatHandle();
                    alert('문서가 상신되었습니다!');
                  } else {
                    alert('결재선을 설정해주세요 !');
                    e.preventDefault();
                  }

                  // approver.map((data, index) => {
                  //   console.log(data);
                  //   return insertApproval(docId, 1, data, inputData, empInfo);
                  // });
                  insertApproval(docId, 1, approver, inputData, empInfo);
                }}>
                <SaveButton variant="contained" color="success" size="large">
                  상신하기
                </SaveButton>
              </Link>
            </Box>
          </div>
        </div>
      </Container>
    </SideNavigation>
  );
}

export default PersonnelAppointment;
