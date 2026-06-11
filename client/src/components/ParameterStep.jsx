import { Badge, Card, Col, Form, Row } from "react-bootstrap";

export default function ParameterStep({ form, onFieldChange }) {
    return (
        <Card className="step-card">
            <Card.Body>
                <div className="step-heading">
                    <Badge bg="primary" className="step-badge">Step 1</Badge>
                    <h2>Public parameters</h2>
                </div>
                <p className="step-description">
                    These values are shared openly and define the group used for the exchange.
                </p>

                <Row className="g-3">
                    <Col md={6}>
                        <Form.Group controlId="primeNumber">
                            <Form.Label className="field-label">Prime number (p)</Form.Label>
                            <Form.Control
                                type="number"
                                min="2"
                                value={form.p}
                                onChange={onFieldChange("p")}
                                placeholder="23"
                            />
                            <Form.Text className="field-hint">Choose a prime number greater than 1.</Form.Text>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="generator">
                            <Form.Label className="field-label">Generator (g)</Form.Label>
                            <Form.Control
                                type="number"
                                min="2"
                                value={form.g}
                                onChange={onFieldChange("g")}
                                placeholder="5"
                            />
                            <Form.Text className="field-hint">Must be less than p and greater than 1.</Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}