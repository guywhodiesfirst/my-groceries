import data from "../../data"
import './Categories.css'

export default function Categories() {
    let categories = [...new Set(data.map(product => product.category))].map(category => ({
        key: category.toLowerCase().replace(/\s+/g, '-'),
        name: category
    }));

    return (
        <div className="categories-container">
            <h3>Filter categories</h3>
            {categories.map((category) => (
                <button className="btn" key={category.key}>{category.name}</button>
            ))}
        </div>
    );
}