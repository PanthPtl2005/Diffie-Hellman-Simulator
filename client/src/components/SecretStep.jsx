import { Badge, Card } from "react-bootstrap";
import OutputCard from "./OutputCard";

export default function SecretStep({ sharedSecret, aliceComputation, bobComputation }) {
    return (
        <Card className="step-card">
            <Card.Body>
                <div className="step-heading">
                    <Badge bg="dark" className="step-badge">Step 4</Badge>
                    <h2>Shared secret</h2>
                </div>
                <p className="step-description">
                    Both parties independently arrive at the same secret.
                </p>

                <div className="secret-grid">
                    <OutputCard
                        title="Alice computes"
                        party="alice"
                        value={sharedSecret}
                        formula={aliceComputation || "s = B^a mod p"}
                    />

                    <div className="exchange-arrow" aria-hidden="true">=</div>

                    <OutputCard
                        title="Bob computes"
                        party="bob"
                        value={sharedSecret}
                        formula={bobComputation || "s = A^b mod p"}
                    />
                </div>

                <div className="secret-result">
                    <Badge bg="secondary">Shared secret</Badge>
                    <strong>{sharedSecret || "-"}</strong>
                    <span className="text-secondary">Both parties now hold the same value.</span>
                </div>
            </Card.Body>
        </Card>
    );
}