import './Pagination.css'

export default function Pagination({totalItems, itemsPerPage, handlePageChange, currentPage}) {
  let pages = [];

  for(let i = 1; i <= Math.ceil(totalItems/itemsPerPage); i++) {
    pages.push(i)
  }

  return (
    <div className="pagination--btn-group">
      {pages.map((page, index) => {
        return (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            className = {`pagination--btn ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}