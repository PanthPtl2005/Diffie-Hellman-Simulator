const p_Input = document.getElementById("p");
const g_Input = document.getElementById("g");
const a_Input = document.getElementById("alicePrivate");
const b_Input = document.getElementById("bobPrivate");

const btn_keys = document.getElementById("generateKeys");
const btn_secret = document.getElementById("generateSecret");

const A_Output = document.getElementById("alicePublic");
const B_Output = document.getElementById("bobPublic");
const Secret_Output = document.getElementById("secret");


btn_keys.addEventListener("click", async() => {
    const p = p_Input.value;
    const g = g_Input.value;
    const a = a_Input.value;
    const b = b_Input.value;

    if(!p ||  !g || !a || !b){
        alert("all fields are required.");
        return;
    }

    if(p <= 1 || g <= 1){
        alert("invalid p or g");
        return;
    }

    if (p > 1000000) {
        alert("Use smaller value of (p) for simulation");
        return;
    }

    const response = await fetch("http://localhost:5000/api/dh/generate-public", {
        method : "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({p, g, a, b})
    });

    const data = await response.json();

    A_Output.textContent = data.A;
    B_Output.textContent = data.B;
});

btn_secret.addEventListener('click', async() => {
    const p = p_Input.value;
    const a = a_Input.value;
    const B = B_Output.textContent;

    const response = await fetch("http://localhost:5000/api/dh/generate-secret",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({p, a, B})
    });

    const data = await response.json();

    Secret_Output.textContent = data.sharedSecret;
});