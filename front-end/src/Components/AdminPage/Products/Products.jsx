import { useEffect, useState } from 'react';
import { ProductsApi } from '../../../api/ProductsApi.js';
import Categories from '../../Categories/Categories.jsx';
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

  const getCategories = async () => {
    const data = await ProductsApi.getCategories();
    setCategories(data);
  };

  const getProducts = async () => {
    const data = await ProductsApi.getProducts({ category: selectedCategory, name });
    setProducts(data);
  };
  
  useEffect(() => {
    getCategories().then();
  }, []);

  useEffect(() => {
    getProducts().then();
  }, [selectedCategory, name]);

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
      <Categories
        categories={categories}
        onSelect={setSelectedCategory}
        selected={selectedCategory}
      />
      <ProductsTable products={products} onSubmit={closeModal}/>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ProductForm onSubmit={closeModal} />
        </Modal>
      )}
    </>
  );
}
