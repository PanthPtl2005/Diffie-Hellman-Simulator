import { Card } from "react-bootstrap";

export default function PartyPanel({ party, title, accent, children }) {
    return (
        <Card className={`party-card ${party}`}>
            <Card.Body>
                <h3 className={`party-title ${party}`}>{title}</h3>
                {children}
                <div className="formula-box">{accent}</div>
            </Card.Body>
        </Card>
    );
}