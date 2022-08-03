import { useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaCog, FaThList } from 'react-icons/fa';
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarHeader,
  SubMenu,
} from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import '../css/Sidebar.css';
import 'react-pro-sidebar/dist/css/styles.css';
import '../css/SidebarCustom.scss';

const Menuitem = styled(MenuItem)`
  :hover {
    text-decoration: none;
    padding: 5px;
    border-radius: 10px;
  }
`;

const SideNavigation = ({ children }) => {
  console.log(children);
  const [collapsed, setCollapsed] = useState(false);
  const styles = {
    sideBarHeight: {
      height: '100vh',
    },
    menuIcon: {
      float: 'right',
      margin: '10px',
    },
  };
  const onClickMenuIcon = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div>
      <div className="container1">
        <ProSidebar style={styles.sideBarHeight} collapsed={collapsed}>
          <SidebarHeader>
            <div style={styles.menuIcon} onClick={onClickMenuIcon}>
              <AiOutlineMenu />
            </div>
          </SidebarHeader>

          <Menu iconShape="square">
            <Menuitem icon={<FaCog />}>
              <Link to={'/dratf/form'}>기안작성</Link>
            </Menuitem>

            <SubMenu title="진행중" icon={<FaThList />}>
              <Menuitem>
                <Link to={'/box/dd'}>상신한</Link>
              </Menuitem>

              <MenuItem>
                <Link to={'/box/dc'}>완료된</Link>
              </MenuItem>

              <MenuItem>
                <Link to={'/box/ds'}>저장된</Link>
              </MenuItem>

              <MenuItem>
                <Link to={'/box/dr'}>반려된</Link>
              </MenuItem>
            </SubMenu>
            <SubMenu title="결재함" icon={<FaThList />}>
              <Menuitem>
                <Link to={'/box/ab'}>결재전</Link>
              </Menuitem>

              <MenuItem>
                <Link to={'/box/ao'}>진행중</Link>
              </MenuItem>

              <MenuItem>
                <Link to={'/box/ac'}>완료된</Link>
              </MenuItem>

              <MenuItem>
                <Link to={'/box/ar'}>반려된</Link>
              </MenuItem>
            </SubMenu>
            <Menuitem icon={<FaCog />}>
              <Link to={'/box/dl'}>문서대장</Link>
            </Menuitem>
          </Menu>
        </ProSidebar>

        <main>{children}</main>
      </div>
    </div>
  );
};
export default SideNavigation;
