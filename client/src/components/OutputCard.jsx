export default function OutputCard({ title, party, value, formula }) {
    return (
        <div className={`output-card ${party}`}>
            <span className="output-label">{title}</span>
            <span className="output-value">{value || "-"}</span>
            <span className="output-formula">{formula}</span>
        </div>
    );
}