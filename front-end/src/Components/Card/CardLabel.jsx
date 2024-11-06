import './Card.css';

export default function CardLabel({ unitsLeft }) {
    let label;
    if (unitsLeft === 0) {
        label = {
            message: "OUT OF STOCK",
            color: "red"
        };
    } else if(unitsLeft <= 5) {
        label = {
            message: "RUNNING LOW",
            color: "orange"
        };
    }

    return (
        <>
            {label && <div className={`card--label ${label.color}`}>{label.message}</div>}
        </>
    );
}