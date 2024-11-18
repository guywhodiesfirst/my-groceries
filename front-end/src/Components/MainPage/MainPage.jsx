import Card from '../Card/Card';
import './MainPage.css';
import data from '../../data';
import { useEffect, useState } from 'react';
import Pagination from '../Pagination/Pagination';
import FilterList from '../Categories/FilterList.jsx';
import SearchBar from '../UI/SearchBar/SearchBar.jsx';
import { ProductsApi } from '../../api/ProductsApi.js';

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = data.slice(firstItemIndex, lastItemIndex);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getCategories = async () => {
    const data = await ProductsApi.getCategories();
    setCategories(data);
  };

  useEffect(() => {
    getCategories().then();
  }, []);

  const cardArray = currentItems.map(itemData => (
    <Card
      key={itemData.id}
      {...itemData}
    />
  ));

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="main-page">
        <div className="catalog">
          <SearchBar name='products' onChange={handlePageChange} />
          <Pagination
            totalItems={data.length}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
          />
          <div className="cards-container">
            {cardArray}
          </div>
        </div>
        <div>
          <FilterList
            items={categories}
            onSelect={setSelectedCategory}
            selected={selectedCategory}
          />
        </div>
      </div>
    </>
  );
}