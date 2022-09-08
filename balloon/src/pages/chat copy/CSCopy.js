import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../css/chat/CS.module.css';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import { Badge } from '@mui/material';

function CSCopy({ children, setChatStatus }) {
  return (
    <div className={styles.constainer}>
      <div className={styles.iconcon}>
        <ul className={styles.constainer}>
          <li
            className={styles.listyle}
            onClick={() => setChatStatus('chatEmpList')}>
            <PersonIcon fontSize="large" />
          </li>
          <li
            className={styles.listyle}
            onClick={() => setChatStatus('chatList')}>
            {/* <Badge
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              color="secondary"
              badgeContent={501}
              max={500}> */}
            <ChatIcon fontSize="large" />
            {/* </Badge> */}
          </li>
          <li
            className={styles.listyle}
            onClick={() => setChatStatus('chatNotice')}>
            <SettingsIcon fontSize="large" />
          </li>
        </ul>
      </div>
      <main>{children}</main>
    </div>
  );
}

export default CSCopy;
