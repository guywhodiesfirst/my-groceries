import './Categories.css';

export default function Categories({ categories, data, onSelect, selected }) {
  if (!categories) {
    categories = [...new Set(data.map(product => product.category))];
  }

  return (
    <div className="categories-container">
      <h3>Filter categories</h3>
      {categories.map((category) => (
        <button
          className={`btn ${selected === category ? 'btn-active' : ''}`}
          key={category}
          onClick={() => onSelect(selected === category ? null : category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
