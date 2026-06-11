import { useMemo, useState } from "react";
import { Alert, Button, Container, Collapse, Spinner, Stack } from "react-bootstrap";
import { API_BASE_URL, INITIAL_FORM } from "./constants";
import { validateInputs } from "./utils/validation";
import ParameterStep from "./components/ParameterStep";
import PrivateKeysStep from "./components/PrivateKeysStep";
import ExchangeStep from "./components/ExchangeStep";
import SecretStep from "./components/SecretStep";

export default function App() {
    const [form, setForm] = useState(INITIAL_FORM);
    const [alicePublic, setAlicePublic] = useState("");
    const [bobPublic, setBobPublic] = useState("");
    const [sharedSecret, setSharedSecret] = useState("");
    const [aliceComputation, setAliceComputation] = useState("");
    const [bobComputation, setBobComputation] = useState("");
    const [showExchange, setShowExchange] = useState(false);
    const [showSecret, setShowSecret] = useState(false);
    const [error, setError] = useState("");
    const [warning, setWarning] = useState("");
    const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
    const [isGeneratingSecret, setIsGeneratingSecret] = useState(false);

    const publicKeysReady = useMemo(() => Boolean(alicePublic && bobPublic), [alicePublic, bobPublic]);

    const onFieldChange = (field) => (event) => {
        const value = event.target.value;
        setForm((current) => ({ ...current, [field]: value }));
        setError("");
        setWarning("");
    };

    const applyValidationMessages = (result) => {
        if (result.errors.length > 0) {
            setError(result.errors.join(" "));
            setWarning("");
            return false;
        }

        setError("");
        setWarning(result.warnings.join(" "));
        return true;
    };

    const handleGenerateKeys = async () => {
        const validation = validateInputs(form);
        if (!applyValidationMessages(validation)) {
            return;
        }

        setIsGeneratingKeys(true);

        try {
            const response = await fetch(`${API_BASE_URL}/generate-public`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ p: validation.p, g: validation.g, a: validation.a, b: validation.b })
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.error || "Failed to generate public keys.");
            }

            setAlicePublic(payload.A);
            setBobPublic(payload.B);
            setShowExchange(true);
            setShowSecret(false);
            setSharedSecret("");
            setAliceComputation("");
            setBobComputation("");
        } catch (fetchError) {
            setError(fetchError.message);
        } finally {
            setIsGeneratingKeys(false);
        }
    };

    const handleGenerateSecret = async () => {
        if (!publicKeysReady) {
            setError("Generate the public keys first.");
            return;
        }

        const validation = validateInputs(form);
        if (!applyValidationMessages(validation)) {
            return;
        }

        setIsGeneratingSecret(true);

        try {
            const response = await fetch(`${API_BASE_URL}/generate-secret`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ p: validation.p, a: validation.a, B: bobPublic })
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.error || "Failed to compute shared secret.");
            }

            setSharedSecret(payload.sharedSecret);
            setAliceComputation(`s = ${bobPublic}^${validation.a} mod ${validation.p} = ${payload.sharedSecret}`);
            setBobComputation(`s = ${alicePublic}^${validation.b} mod ${validation.p} = ${payload.sharedSecret}`);
            setShowSecret(true);
        } catch (fetchError) {
            setError(fetchError.message);
        } finally {
            setIsGeneratingSecret(false);
        }
    };

    const handleReset = () => {
        setForm(INITIAL_FORM);
        setAlicePublic("");
        setBobPublic("");
        setSharedSecret("");
        setAliceComputation("");
        setBobComputation("");
        setShowExchange(false);
        setShowSecret(false);
        setError("");
        setWarning("");
        setIsGeneratingKeys(false);
        setIsGeneratingSecret(false);
    };

    return (
        <div className="app-shell">
            <Container style={{ maxWidth: "1100px" }}>
                <div className="hero">
                    <div className="eyebrow">Diffie-Hellman simulator</div>
                    <br />
                    <br />
                    <p>
                        Enter the public parameters, generate each party's public key, then reveal the shared secret.
                        The sequence stays intentionally staged so the protocol flow is easy to follow.
                    </p>
                </div>

                <Stack gap={3}>
                    {warning ? <Alert variant="warning" className="mb-0">{warning}</Alert> : null}
                    {error ? <Alert variant="danger" className="mb-0">{error}</Alert> : null}
                    <ParameterStep form={form} onFieldChange={onFieldChange} />

                    <PrivateKeysStep form={form} onFieldChange={onFieldChange} />

                    <div className="action-row">
                        <Button variant="primary" onClick={handleGenerateKeys} disabled={isGeneratingKeys}>
                            {isGeneratingKeys ? <Spinner size="sm" className="me-2" /> : null}
                            Generate public keys
                        </Button>
                        <Button variant="outline-primary" onClick={handleGenerateSecret} disabled={!publicKeysReady || isGeneratingSecret}>
                            {isGeneratingSecret ? <Spinner size="sm" className="me-2" /> : null}
                            Compute shared secret
                        </Button>
                        <Button variant="outline-secondary" onClick={handleReset}>
                            Reset
                        </Button>
                    </div>

                    <Collapse in={showExchange}>
                        <div className="section-enter">
                            <ExchangeStep alicePublic={alicePublic} bobPublic={bobPublic} />
                        </div>
                    </Collapse>

                    <Collapse in={showSecret}>
                        <div className="section-enter">
                            <SecretStep
                                sharedSecret={sharedSecret}
                                aliceComputation={aliceComputation}
                                bobComputation={bobComputation}
                            />
                        </div>
                    </Collapse>
                </Stack>
            </Container>
        </div>
    );
}