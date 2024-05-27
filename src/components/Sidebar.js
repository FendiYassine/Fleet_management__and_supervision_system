import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';

const Nav = styled.div`
  background: #15171c;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  color: white;
  cursor: pointer;
  position: relative;
`;

const Username = styled.span`
  margin-left: 10px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #15171c;
  border: 1px solid #333;
  border-radius: 8px;
  width: 150px;
  display: none;
  ${UserMenu}:hover & {
    display: block;
  }
`;

const DropdownItem = styled(Link)`
  padding: 10px;
  display: block;
  color: white;
  text-decoration: none;
  &:hover {
    background: #333;
  }
`;

const SidebarNav = styled.nav`
  background: #15171c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebaropen }) => (sidebaropen ? '0' : '-100%')};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = ({ toggleSidebar, sidebarOpen, sidebarRef, navbarRef }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/'); // Redirect to login page
  };

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <Nav ref={navbarRef}>
          <NavIcon to="#">
            <FaIcons.FaBars onClick={toggleSidebar} />
          </NavIcon>
          <div className="Name_page">
            <h1 style={{ color: 'green' }}>Gestion de flotte</h1>
          </div>
          <UserMenu>
            <FaIcons.FaUserCircle size={30} />
            <Username>Y.Fendi</Username>
            <DropdownMenu>
              <DropdownItem to="/" onClick={handleLogout}>
                Déconnexion
              </DropdownItem>
            </DropdownMenu>
          </UserMenu>
        </Nav>
        <SidebarNav ref={sidebarRef} sidebaropen={sidebarOpen ? 1 : undefined}>
          <SidebarWrap>
            <NavIcon to="#">
              <AiIcons.AiOutlineClose onClick={toggleSidebar} />
            </NavIcon>
            {SidebarData.map((item, index) => (
              <SubMenu item={item} key={index} />
            ))}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;
