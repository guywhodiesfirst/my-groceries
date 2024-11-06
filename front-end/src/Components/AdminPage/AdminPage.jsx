import './AdminPage.css'
import { FaBox, FaChartBar, FaUsers, FaCog } from 'react-icons/fa';
import ProductsTable from './ProductsTable.jsx';
import SidebarMenu from '../UI/SidebarMenu/SidebarMenu.jsx';
import { useState } from 'react';
import data from "../../data"
import Categories from '../Categories/Categories';
import SearchBar from '../UI/SearchBar/SearchBar';
import UsersTable from './UsersTable.jsx';
import { userData } from '../../users.js';

export default function AdminPage() {
  const [activeItem, setActiveItem] = useState('Products');

  const menuItems = [
    { name: 'Products', icon: <FaBox /> },
    { name: 'Users', icon: <FaUsers /> },
    { name: 'Analytics', icon: <FaChartBar /> },
    { name: 'Settings', icon: <FaCog /> },
  ];

  const components = {
    Products: (
      <>
        <button className='create-button'>Create new product</button>
        <Categories data={data} />
        <ProductsTable products={data} />
      </>
    ),
    Users: (
      <>
        <button className='create-button'>Add new user</button>
        <UsersTable users={userData} />
      </>
    ),
    Analytics: <div>Analytics Content</div>,
    Settings: <div>Settings Content</div>,
  };

  return (
    <div className="admin-page">
      <SidebarMenu
        menuItems={menuItems}
        active={activeItem}
        onSelect={setActiveItem}
      />
      <div className="main-content">
        {['Products', 'Users'].includes(activeItem) && (
          <SearchBar name={activeItem} onChange={() => {}} />
        )}
        {components[activeItem]}
      </div>
    </div>
  );
}
