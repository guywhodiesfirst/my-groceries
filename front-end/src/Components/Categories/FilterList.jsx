import './FilterList.css';

export default function FilterList({ items, onSelect, onClearSelection, selected }) {
  return (
    <div className="filter-list">
      <h3>Filter items</h3>
      {items.map((item) => (
        <button
          className={`btn ${selected === item ? 'btn-active' : ''}`}
          key={item}
          onClick={() => {
            if (selected === item) {
              onClearSelection(item);
              onSelect(null);
            } else {
              onSelect(item);
            }
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
