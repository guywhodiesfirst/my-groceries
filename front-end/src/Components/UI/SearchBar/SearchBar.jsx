import './SearchBar.css';

const SearchBar = ({ name, onChange }) => {
  return (
    <div className="search">
      <h1 className="title">{name}</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder={`Search ${name.charAt(0).toLowerCase() + name.slice(1)}`}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;
