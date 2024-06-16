import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

const Layout = () => {
  return (
    <div>
      <AdminNavbar/>
      <Outlet />
    </div>
  );
};

export default Layout;