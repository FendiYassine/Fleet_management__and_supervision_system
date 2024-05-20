import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    background: #252831;
    border-left: 4px solid green;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  background: #252831;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;

  &:hover {
    background: green;
    cursor: pointer;
  }
`;

const SubMenu = ({ item, onItemClick }) => {
  const [subnav, setSubnav] = useState(true);

  const showSubnav = () => setSubnav(!subnav);

  const handleItemClick = (e) => {
    console.log('Clicked item:', item.path); // Log the clicked item path
    console.log('Closing sidebar'); // Log when sidebar is closed
    // onItemClick(); // Close the sidebar
    // prevent the click event from propagating to the parent element
    showSubnav();
  };

  return (
    <>
      <SidebarLink
        to={!!item?.subNav?.length ? undefined : item.path}
        onClick={handleItemClick} // Handle click event based on the item path
      >
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>
      {item.subNav &&
        subnav && // Add conditional rendering to check if subNav exists
        item.subNav.map((subItem, index) => {
          return (
            <DropdownLink to={subItem.path} key={index}>
              {subItem.icon}
              <SidebarLabel>{subItem.title}</SidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};
export default SubMenu;
