import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import moment from 'moment';
import SideNavigation from '../../components/SideNavigation';
import { getDocsByEmp } from '../../context/ApprovalAxios';
import styles from '../../css/Component.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Container } from '@mui/system';
import { DataGrid, GridToolbar, koKR } from '@mui/x-data-grid';
import CustomToolbar from '../personnelManagement/CustomToolbar';

function Complete() {
  const [empInfo] = useOutletContext();
  const [docList, setDocList] = useState([]);
  const [docStatus, setDocStatus] = useState(0);

  useEffect(() => {
    getDocsByEmp(empInfo.empId, docStatus, setDocList);
    docList.length === 0 && setDocStatus(2);
  }, [empInfo, docStatus, docList.length]);

  function getdocId(params) {
    let documentId = params.row.docId;
    if (documentId.includes('업무기안')) {
      return (
        <Link to={`/doc/br/${params.row.docId}`} state={{ path: '/boxes/dc' }}>
          {params.row && params.row.documentTitle}
        </Link>
      );
    } else if (documentId.includes('출장계획')) {
      return (
        <Link to={`/doc/tp/${params.row.docId}`} state={{ path: '/boxes/dc' }}>
          {params.row && params.row.documentTitle}
        </Link>
      );
    } else if (documentId.includes('인사명령')) {
      return (
        <Link to={`/doc/pa/${params.row.docId}`} state={{ path: '/boxes/dc' }}>
          {params.row && params.row.documentTitle}
        </Link>
      );
    } else {
      alert('있었는데 아니 없어요.');
    }
  }

  const columns = [
    { field: 'docId', headerName: '문서번호', width: 200 },
    {
      field: 'documentTitle',
      headerName: '문서제목',
      width: 350,
      renderCell: getdocId,
    },
    {
      field: 'updateTime',
      headerName: '처리일자',
      width: 200,
      valueFormatter: (params) =>
        moment(params?.value).format('YYYY/MM/DD HH:mm:ss'),
    },
  ];

  return (
    <>
      <SideNavigation>
        <Container>
          <p className={styles.sasinfont}>완료된</p>
          <br />
          <div style={{ border: '1px solid black' }} />
          <div style={{ height: 500, width: '100%', marginBottom: 70 }}>
            <DataGrid
              localeText={koKR.components.MuiDataGrid.defaultProps.localeText}
              getRowId={(docList) => docList.docId}
              rows={docList}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              components={{ Toolbar: CustomToolbar }}
              initialState={{
                sorting: {
                  sortModel: [{ field: 'updateTime', sort: 'desc' }],
                },
              }}
            />
          </div>
        </Container>
      </SideNavigation>
    </>
  );
}

export default Complete;
