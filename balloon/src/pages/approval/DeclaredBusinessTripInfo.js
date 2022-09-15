import React, { useEffect, useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import ModalApproval from './ModalApproval';
import { DfCard, ApCard } from './approvalCards/DrafterApproverCard';
import SideNavigation from '../../components/SideNavigation';
import {
  deleteBizTp,
  getApvlByDocId,
  getBizTpByBizTpId,
  getBizTpEmpByBizTpId,
} from '../../context/ApprovalAxios';
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

function DeclaredBusinessTripInfo() {
  // 사원 정보 context
  const [empInfo] = useOutletContext();
  const [bizTpInfo, setBizTpInfo] = useState({});
  const [bizTpEmp, setBizTpEmp] = useState({});
  const [approver, setApprover] = useState([]);
  const [openapprovalModal, setOpenapprovalModal] = useState(false);

  const params = useParams();

  useEffect(() => {
    if (!!params) {
      getBizTpByBizTpId(params.docId, setBizTpInfo);
      getBizTpEmpByBizTpId(params.docId, setBizTpEmp);
      getApvlByDocId(params.docId, setApprover);
    }
  }, [params]);

  console.log(bizTpInfo);
  console.log(bizTpEmp);

  return (
    <SideNavigation>
      <Container>
        <p className={styles.maintitle}>
          <FcDocument />
          출장계획서
        </p>

        <table className={styles.table}>
          <thead>
            <tr align="center" bgcolor="white">
              <td className={styles.tdleft}>기안양식</td>
              <td className={styles.td}>출장계획서</td>
              <td className={styles.tdright}>문서번호</td>
              <th className={styles.th}>{bizTpInfo.businessTripId}</th>
            </tr>
          </thead>

          <tbody>
            <tr align="center" bgcolor="white">
              <td className={styles.tdleft}>보존연한</td>
              <td className={styles.td}>5년</td>
              <td className={styles.tdleft}>기안자</td>
              <th className={styles.th}>
                {bizTpInfo.empName}({bizTpInfo.emp && bizTpInfo.emp.empId})
              </th>
            </tr>
            <tr align="center" bgcolor="white"></tr>
          </tbody>
        </table>

        <div className={styles.body1}>
          <span className={styles.subtitle}>결재선</span>
        </div>
        {openapprovalModal && (
          <ModalApproval
            openapprovalModal={openapprovalModal}
            setOpenapprovalModal={setOpenapprovalModal}
          />
        )}
        <hr />
        <br />
        <div className={styles.approvalCard}>
          <Card
            variant="outlined"
            sx={{ maxWidth: 150 }}
            style={{ backgroundColor: '#F1F9FF' }}>
            {!!empInfo && <DfCard drafterName={bizTpInfo.empName} />}
          </Card>
          {approver.map((empData, index) => {
            console.log(empData);
            // if (apvl.length === 0) {
            //   setApvl(empData);
            // }

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
        <table className={styles.tableborder}>
          <thead>
            <tr className={styles.trcon}>
              <td className={styles.titlename}>기안제목</td>
              <td className={styles.titlename} colSpan={2}>
                {bizTpInfo.documentTitle}
              </td>
            </tr>
          </thead>
          <thead>
            <tr className={styles.trcon}>
              <td className={styles.titlename}>신청자 정보</td>
              <td className={styles.titlename} colSpan={2}>
                {bizTpInfo.empName} ({bizTpInfo.emp && bizTpInfo.emp.empId})
              </td>
            </tr>
          </thead>
          <tbody className={styles.tbodyin}>
            <tr align="center">
              <td className={styles.titlename}>동반 출장자</td>
              <td className={styles.titlename} colSpan={2}>
                {bizTpEmp[0] &&
                  bizTpEmp.map((data) => {
                    return (
                      <div>
                        {data.emp.empName} ({data.emp.empId})
                      </div>
                    );
                  })}
              </td>
              <td className={styles.titlename}></td>
            </tr>
            <tr align="center">
              <td colSpan={3} className={styles.tdmargin}>
                상세내용
              </td>
            </tr>

            <tr className={styles.trcolor}>
              <td className={styles.tdreaui}>방문기간</td>
              <td className={styles.tdreaui}>방문처</td>
              <td className={styles.tdreaui}>방문목적</td>
            </tr>

            <tr>
              <td className={styles.tdreaui}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TextField
                    disabled
                    id="startValue"
                    label="시작일"
                    type="date"
                    value={bizTpInfo.startDate}
                    sx={{ width: 250 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  {/* <DatePicker
                    disabled
                    label="시작일"
                    value={bizTpInfo.startDate}
                    type=" date"
                    inputFormat={'yyyy-MM-dd'}
                    renderInput={(params) => <TextField {...params} />}
                  /> */}
                </LocalizationProvider>

                <span className={styles.centerfont}> : </span>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  {/* <DatePicker
                    disabled
                    label="끝나는일"
                    value={bizTpInfo && bizTpInfo.endDate}
                    inputFormat={'yyyy-MM-dd'}
                    renderInput={(params) => <TextField {...params} />}
                  /> */}
                  <TextField
                    disabled
                    id="endValue"
                    label="종료일"
                    type="date"
                    value={bizTpInfo.endDate}
                    sx={{ width: 250 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </LocalizationProvider>
              </td>
              <td className={styles.tdreaui}>
                <form>
                  <TextField
                    focused={false}
                    type="text"
                    name="title"
                    value={bizTpInfo.destination}
                    className={styles.inputtext}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </form>
              </td>
              <td className={styles.tdreaui}>
                <form>
                  <TextField
                    focused={false}
                    type="text"
                    name="title"
                    value={bizTpInfo.visitingPurpose}
                    className={styles.inputtext}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </form>
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
              focused={false}
              fullWidth
              multiline
              rows={10}
              value={bizTpInfo.documentContent}
              InputProps={{
                readOnly: true,
              }}
            />
          </Paper>

          <div className={styles.savebutton}>
            <Box sx={{ '& button': { m: 1 } }}>
              <Link to="/boxes/dd">
                <Button
                  variant="outlined"
                  size="large"
                  onClick={async () => {
                    await deleteBizTp(params.docId);
                    alert('문서가 삭제되었습니다!');
                  }}>
                  삭제하기
                </Button>
              </Link>
              <Link to="/boxes/dd">
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

export default DeclaredBusinessTripInfo;
