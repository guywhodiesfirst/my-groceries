const ProductsTable = ({ products }) => {
  return (
    <table className="table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Description</th>
        <th>Price</th>
        <th>Units Left</th>
        <th>Category</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
      </thead>
      <tbody>
      {products.map((product) => (
        <tr key={product.id}>
          <td>{product.id}</td>
          <td>{product.title}</td>
          <td>{product.description}</td>
          <td>${product.price.toFixed(2)}</td>
          <td>
              <span
                className={`inventory-status ${product.unitsLeft > 0 ?
                  (product.unitsLeft <= 5 ? 'low-stock' : 'in-stock') : 'out-of-stock'}`}
              >
                {product.unitsLeft}
              </span>
          </td>
          <td>{product.category}</td>
          <td>
            <button className="edit-button">Edit</button>
          </td>
          <td>
            <button className="edit-button">Delete</button>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default ProductsTable;
