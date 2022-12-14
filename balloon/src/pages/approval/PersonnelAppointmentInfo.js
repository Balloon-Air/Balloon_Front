import React, { useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import SideNavigation from '../../components/SideNavigation';
import { DfCard, ApCard } from './approvalCards/DrafterApproverCard';
import { getApvlByDocId, getPAByPAId } from '../../context/ApprovalAxios';
import styles from '../../css/Report.module.css';
import '../../css/Modal.css';
import { FcDocument } from 'react-icons/fc';
import { Button, Card, Container, Paper, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { blue } from '@mui/material/colors';

const SaveButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[500]),
  backgroundColor: blue[500],
  '&:hover': {
    backgroundColor: blue[700],
  },
}));

function PersonnelAppointmentInfo() {
  const [paInfo, setPaInfo] = useState({});
  const [approver, setApprover] = useState([]);

  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    !!params && getPAByPAId(params.docId, setPaInfo);
    getApvlByDocId(params.docId, setApprover);
  }, [params]);

  const path = location.state?.path;

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
              <th className={styles.th}>{paInfo.personnelAppointmentId}</th>
            </tr>
          </thead>

          <tbody>
            <tr align="center" bgcolor="white">
              <td className={styles.tdleft}>보존연한</td>
              <td className={styles.td}>5년</td>
              <td className={styles.tdleft}>기안자</td>
              <th className={styles.th}>
                {paInfo.empName}({paInfo.emp && paInfo.emp.empId})
              </th>
            </tr>
            <tr align="center" bgcolor="white"></tr>
          </tbody>
        </table>
        <div className={styles.body1}>
          <span className={styles.subtitle}>결재선</span>
        </div>
        {/* {openModal && <Modal closeModal={setOpenModal} />} */}

        <div style={{ border: '1px solid black' }} />
        <br />
        <div className={styles.approvalCard}>
          <Card
            variant="outlined"
            sx={{ maxWidth: 150 }}
            style={{ backgroundColor: '#F1F9FF' }}>
            <DfCard drafterName={paInfo.empName} />
          </Card>
          {approver.map((empData, index) => {
            return (
              <Card
                variant="outlined"
                sx={{ maxWidth: 150 }}
                style={{ backgroundColor: '#F1F9FF' }}
                key={index}>
                <ApCard approverName={empData.empName} />
              </Card>
            );
          })}
        </div>
        <hr className={styles.hrmargins} />

        <p className={styles.giantitle}>기안내용</p>

        {/* 여기부터는 상세내용 */}

        <table className={styles.tableborder}>
          <thead>
            <tr className={styles.trcon}>
              <td className={styles.tdleft}>기안제목</td>
              <td colSpan={2} className={styles.tdright}>
                {paInfo.documentTitle}
              </td>
            </tr>
            <tr className={styles.trcon}>
              <td className={styles.tdleft}>인사명령일</td>
              <td className={styles.titlename} colSpan={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disabled
                    label="명령 일자"
                    value={paInfo.personnelDate}
                    type=" date"
                    inputFormat={'yyyy-MM-dd'}
                    className={styles.datepicker}
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
              <td className={styles.tdreaui}>발령직급</td>
            </tr>

            <tr>
              <td className={styles.tdreaui}>
                <TextField
                  focused={false}
                  type="text"
                  name="title"
                  value={paInfo.movedEmpName}
                  className={styles.inputtext1}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </td>
              <td className={styles.tdreaui}>
                <TextField
                  focused={false}
                  type="text"
                  name="title"
                  value={paInfo.unit && paInfo.unit.unitName}
                  className={styles.inputtext1}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </td>
              <td className={styles.tdreaui}>
                <TextField
                  type="text"
                  name="title"
                  value={paInfo.position}
                  className={styles.inputtext1}
                  focused={false}
                  InputProps={{
                    readOnly: true,
                  }}
                />
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
              fullWidth
              multiline
              rows={10}
              value={paInfo.documentContent}
              focused={false}
              InputProps={{
                readOnly: true,
              }}
            />
          </Paper>

          <div className={styles.savebutton}>
            <Box sx={{ '& button': { m: 1 } }}>
              <Link to={path}>
                <SaveButton variant="contained" color="success" size="large">
                  목록으로
                </SaveButton>
              </Link>
            </Box>
          </div>
        </div>
      </Container>
    </SideNavigation>
  );
}

export default PersonnelAppointmentInfo;
