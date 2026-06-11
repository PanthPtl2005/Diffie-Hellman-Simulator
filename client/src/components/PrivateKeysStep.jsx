import { Badge, Card, Col, Form, Row } from "react-bootstrap";
import PartyPanel from "./PartyPanel";

export default function PrivateKeysStep({ form, onFieldChange }) {
    return (
        <Card className="step-card">
            <Card.Body>
                <div className="step-heading">
                    <Badge bg="secondary" className="step-badge">Step 2</Badge>
                    <h2>Private keys</h2>
                </div>
                <p className="step-description">
                    Alice and Bob pick secret values that never leave their side of the exchange.
                </p>

                <Row className="g-3">
                    <Col md={6}>
                        <PartyPanel
                            party="alice"
                            title="Alice"
                            accent={<span>Computes A = g<sup>a</sup> mod p</span>}
                        >
                            <Form.Group controlId="alicePrivate">
                                <Form.Label className="field-label">Private key (a)</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={form.a}
                                    onChange={onFieldChange("a")}
                                    placeholder="6"
                                />
                                <Form.Text className="field-hint">Positive integer only.</Form.Text>
                            </Form.Group>
                        </PartyPanel>
                    </Col>
                    <Col md={6}>
                        <PartyPanel
                            party="bob"
                            title="Bob"
                            accent={<span>Computes B = g<sup>b</sup> mod p</span>}
                        >
                            <Form.Group controlId="bobPrivate">
                                <Form.Label className="field-label">Private key (b)</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={form.b}
                                    onChange={onFieldChange("b")}
                                    placeholder="15"
                                />
                                <Form.Text className="field-hint">Positive integer only.</Form.Text>
                            </Form.Group>
                        </PartyPanel>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}