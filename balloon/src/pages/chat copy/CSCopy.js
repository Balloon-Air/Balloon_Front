import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../css/chat/ChatSide.module.css';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';

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
            <ChatIcon fontSize="large" />
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