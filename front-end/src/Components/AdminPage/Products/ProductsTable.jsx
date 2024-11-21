import { useState } from 'react';
import Modal from '../../Modals/Modal.jsx';
import ProductForm from './ProductForm.jsx';
import { ProductsApi } from '../../../api/ProductsApi.js';

const ProductsTable = ({ products, onSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setIsDeleteModal(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDeleteModal(false);
    setSelectedProduct(null);
  };

  const handleFormSubmit = () => {
    closeModal();
    onSubmit();
  };

  const confirmDelete = async () => {
    await ProductsApi.deleteProduct(selectedProduct._id);
    closeModal();
    onSubmit();
  };

  return (
    <>
      <table className="table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Image</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Category</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
        </thead>
        <tbody>
        {products.map((product) => (
          <tr key={product._id}>
            <td>{product._id}</td>
            <td>
              <img
                src={product.image}
                alt={product.name}
                className="table-image"
              />
            </td>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>₴{product.price}</td>
            <td>{product.quantity}</td>
            <td>{product.category}</td>
            <td>
              <button
                className="edit-button"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
            </td>
            <td>
              <button
                className="edit-button"
                onClick={() => handleDelete(product)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {isDeleteModal ? (
            <>
              <h3>
                Are you sure you want to delete the product with ID:{' '}
                {selectedProduct?._id}?
              </h3>
              <button className="create-button" onClick={confirmDelete}>
                Yes, delete
              </button>
            </>
          ) : (
            <ProductForm
              initialData={selectedProduct}
              onSubmit={handleFormSubmit}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default ProductsTable;
