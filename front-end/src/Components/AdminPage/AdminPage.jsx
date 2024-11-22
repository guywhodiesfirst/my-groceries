import './AdminPage.css'
import { useContext, useState, useEffect } from 'react';
import { FaBox, FaChartBar, FaUsers, FaCog } from 'react-icons/fa';
import SidebarMenu from '../UI/SidebarMenu/SidebarMenu';
import Products from './Products/Products';
import Users from './Users/Users';
import { Context } from '../../App';
import { useNavigate } from 'react-router';

export default function AdminPage() {
  const [activeItem, setActiveItem] = useState('Products');

  const menuItems = [
    { name: 'Products', icon: <FaBox /> },
    { name: 'Users', icon: <FaUsers /> },
    { name: 'Analytics', icon: <FaChartBar /> },
    { name: 'Settings', icon: <FaCog /> },
  ];

  const components = {
    Products: <Products />,
    Users: <Users />,
    Analytics: <div>Analytics Content</div>,
    Settings: <div>Settings Content</div>,
  };

  const { user } = useContext(Context)
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !user.is_admin) {
      navigate('/catalog');
    }
  }, [user, navigate]);

  return (
    <>
      <div className="admin-page">
        <SidebarMenu
          menuItems={menuItems}
          active={activeItem}
          onSelect={setActiveItem}
        />
        <div className="main-content">
          {components[activeItem]}
        </div>
      </div>
    </>
  );
}
