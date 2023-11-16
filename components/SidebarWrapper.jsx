'use client'

import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar';

const SidebarWrapper = () => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const token = Cookies.get('admin_token');
        setToken(token);
    }, [])
    
  return (
    <div>{token ? <Sidebar /> : null}</div>
  )
}

export default SidebarWrapper;