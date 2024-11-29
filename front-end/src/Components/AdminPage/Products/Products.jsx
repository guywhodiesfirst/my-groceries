import { useCallback, useEffect, useState } from 'react';
import { ProductsApi } from '../../../api/ProductsApi.js';
import FilterList from '../../Categories/FilterList.jsx';
import ProductsTable from './ProductsTable.jsx';
import Modal from '../../Modals/Modal.jsx';
import ProductForm from './ProductForm.jsx';
import SearchBar from '../../UI/SearchBar/SearchBar.jsx';

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const getCategories = async () => {
    const data = await ProductsApi.getCategories();
    setCategories(data);
  };

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ProductsApi.getProducts({ category: selectedCategory, name });
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, name]);

  useEffect(() => {
    getCategories().then();
  }, []);

  useEffect(() => {
    getProducts().then();
  }, [getProducts]);

  const closeModal = async () => {
    setIsModalOpen(false);
    await getCategories();
    await getProducts();
  };

  const handleCreateProduct = () => {
    setIsModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setName(e.target.value);
  };

  return (
    <>
      <SearchBar name="Products" onChange={handleSearchChange} />
      <button className="create-button" onClick={handleCreateProduct}>
        Create new product
      </button>
      <FilterList
        items={categories}
        onSelect={setSelectedCategory}
        selected={selectedCategory}
      />
      {loading ? (
        <h1>Loading...</h1>
      ) : products.length ? (
        <ProductsTable products={products} onSubmit={closeModal} />
      ) : (
        <h1>No products found for the given criteria.</h1>
      )}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ProductForm onSubmit={closeModal} />
        </Modal>
      )}
    </>
  );
}
