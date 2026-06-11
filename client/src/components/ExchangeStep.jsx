import { Badge, Card } from "react-bootstrap";
import OutputCard from "./OutputCard";

export default function ExchangeStep({ alicePublic, bobPublic }) {
    return (
        <Card className="step-card">
            <Card.Body>
                <div className="step-heading">
                    <Badge bg="info" className="step-badge">Step 3</Badge>
                    <h2>Public exchange</h2>
                </div>
                <p className="step-description">
                    Alice and Bob exchange public keys over the open channel.
                </p>

                <div className="exchange-grid">
                    <OutputCard
                        title="Alice's public key (A)"
                        party="alice"
                        value={alicePublic}
                        formula={<span>A = g<sup>a</sup> mod p</span>}
                    />

                    <div className="exchange-arrow" aria-hidden="true">&lt;-&gt;</div>

                    <OutputCard
                        title="Bob's public key (B)"
                        party="bob"
                        value={bobPublic}
                        formula={<span>B = g<sup>b</sup> mod p</span>}
                    />
                </div>
            </Card.Body>
        </Card>
    );
}