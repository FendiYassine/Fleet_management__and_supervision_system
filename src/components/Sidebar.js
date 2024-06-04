import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import Logo from '../components/logo.png'; // Ensure the logo path is correct

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

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  color: white;
`;

const LogoImage = styled.img`
  height: 60px;
  width: 60px;
  margin-left: 20px;
`;

const LogoText = styled.span`
  font-family: 'Dancing Script', cursive;
  font-size: 24px;
  margin-left: 10px;
`;

const Sidebar = ({ toggleSidebar, sidebarOpen, sidebarRef, navbarRef }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setUsername(storedName.replace(/['"]+/g, ''));
    }
  }, []);

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
          <LogoContainer>
            <LogoImage src={Logo} alt="Gestion de flotte" />
            <LogoText>Gestion de flotte de véhicules</LogoText>
          </LogoContainer>
          <UserMenu>
            <FaIcons.FaUserCircle size={30} />
            <Username>{username}</Username>
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
