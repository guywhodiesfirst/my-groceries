import './MainPage.css';
import { useEffect, useState, useCallback } from 'react';
import Card from '../Card/Card';
import Pagination from '../Pagination/Pagination';
import FilterList from '../Categories/FilterList.jsx';
import SearchBar from '../UI/SearchBar/SearchBar.jsx';
import { ProductsApi } from '../../api/ProductsApi.js';

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState('');

  const getCategories = async () => {
    const data = await ProductsApi.getCategories();
    setCategories(data);
  };

  const getProducts = useCallback(async () => {
    const data = await ProductsApi.getProducts({
      category: selectedCategory,
      name,
    });
    setProducts(data);
  }, [selectedCategory, name]);

  useEffect(() => {
    getCategories().then();
  }, []);

  useEffect(() => {
    getProducts().then();
  }, [getProducts]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setName(e.target.value);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null)
  }

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = products.slice(firstItemIndex, lastItemIndex);

  return (
    <>
      <div className="main-page">
        <div className="catalog">
          <SearchBar name="Products" onChange={handleSearchChange} />
          <Pagination
            totalItems={products.length}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
          />
          <div className="cards-container">
            {currentItems.length ? (
              currentItems.map((item) => <Card key={item._id} {...item} />)
            ) : (
              <h1>No products found for the given criteria.</h1>
            )}
          </div>
        </div>
        <div>
          <FilterList
            items={categories}
            onSelect={setSelectedCategory}
            onClearSelection={handleClearSelection}
            selected={selectedCategory}
          />
        </div>
      </div>
    </>
  );
}
