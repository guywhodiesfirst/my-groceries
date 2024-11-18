import './Checkbox.css';

function Checkbox({ label, defaultChecked, onChange }) {
  return (
    <div className="checkbox-wrapper">
      <input
        id={'checkbox' + label}
        type="checkbox"
        className="promoted-input-checkbox"
        defaultChecked={defaultChecked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <svg>
        <use xlinkHref="#checkmark" />
      </svg>
      <label htmlFor={'checkbox' + label}>
        {label}
      </label>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol id="checkmark" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeMiterlimit="10"
            fill="none"
            d="M22.9 3.7l-15.2 16.6-6.6-7.1"
          />
        </symbol>
      </svg>
    </div>
  );
}

export default Checkbox;
