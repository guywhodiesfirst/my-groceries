import './FilterList.css';

export default function FilterList({ items, onSelect, selected }) {
  return (
    <div className="filter-list">
      <h3>Filter items</h3>
      {items.map((item) => (
        <button
          className={`btn ${selected === item ? 'btn-active' : ''}`}
          key={item}
          onClick={() => onSelect(selected === item ? null : item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
