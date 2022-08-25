import styles from '../css/Navbar.module.css';
import { Link, NavLink } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { logoutFunc, getCookie } from '../context/AuthFunc';
import { getMe } from '../context/EmployeeAxios';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import ClearIcon from '@mui/icons-material/Clear';
import './Navbar.css';

function Navbar({ setEmpInfo, empInfo, logout, isLogin }) {
  const cookies = new Cookies();

  function activeStyle({ isActive }) {
    return {
      textDecoration: 'none',
      fontSize: isActive ? '24px' : undefined,
      color: isActive ? '#00AAFF' : 'black',
      background: 'white',
    };
  }

  useEffect(() => {
    if (isLogin === true) {
      getCookie(cookies);

      if (cookies.cookies.accessToken) {
        getMe(setEmpInfo);
        // console.log(empInfo);
      } else {
        logoutFunc(logout);
        localStorage.setItem('logged', false);
      }
    }
  }, [isLogin]);

  const [isMobile, setIsMobile] = useState(false);

  return (
    <nav className="navbar">
      <Link to={'/'} className={styles.Link}>
        <h3 className="logo">
          BALL<span className={styles.oofont}>OO</span>N{' '}
        </h3>
      </Link>
      <ul
        className={isMobile ? 'nav-links-mobile' : 'nav-links'}
        onClick={() => setIsMobile(false)}>
        <NavLink to={'/boxes'} style={activeStyle}>
          <li className="approval">결재관리</li>
        </NavLink>
        <NavLink to={'/calendar'} style={activeStyle}>
          <li className="celendar">캘린더</li>
        </NavLink>
        <NavLink to={'/chatemplist'} style={activeStyle}>
          <li className="chat">메신저</li>
        </NavLink>
        <NavLink to={'/organization'} style={activeStyle}>
          <li className="management">조직도</li>
        </NavLink>
        {empInfo && empInfo.userRoleGrade === 'ROLE_ADMIN' ? (
          <NavLink to={'/management/unit'} style={activeStyle}>
            <li className="unit">조직관리</li>
          </NavLink>
        ) : null}
        {empInfo && empInfo.userRoleGrade === 'ROLE_ADMIN' ? (
          <NavLink to={'/management/employee'} style={activeStyle}>
            <li className="unit">사원관리</li>
          </NavLink>
        ) : null}
      </ul>
      <ul>
        {isLogin ? (
          <div className={styles.namediv}>
            <p className="login">
              {' '}
              {empInfo.empName} {empInfo.position}{' '}
              <Button
                type="button"
                variant="outlined"
                size="small"
                className={styles.btnnav}
                onClick={() => logoutFunc(logout)}>
                Logout
              </Button>
            </p>
          </div>
        ) : (
          <div className={styles.namediv}>
            <Link to={'/loginpage'}>
              <p className="login">
                <Button
                  className={styles.btnnav}
                  variant="contained"
                  size="small">
                  Login
                </Button>
              </p>
            </Link>
          </div>
        )}
        <button
          className="mobile-menu-icon"
          onClick={() => setIsMobile(!isMobile)}>
          {isMobile ? <ClearIcon /> : <MenuOpenIcon />}
        </button>
      </ul>
    </nav>
  );
}

export default Navbar;
