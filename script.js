const saveImgBtn = document.querySelector(".save-img");

// ---
// LIGHTNING PAYMENT MAGIC 
// ---
const getInvoice = async () => {
    const amountMsat = 1000;
    const recipient = "hello@getalby.com";
    const invoiceRes = await fetch(`https://lnaddressproxy.getalby.com/generate-invoice?amount=${amountMsat}&ln=${recipient}`);
    const data = await invoiceRes.json();

    console.log("Preimage : " + data.invoice.pr);
    checkPreimage(data.invoice.pr)
        .then(message => console.log(message))
        .catch(error => console.error(error));

    return data.invoice.pr;
}

const requestPayment = async () => {
    try {
        if (typeof window.webln !== 'undefined') {
            await window.webln.enable();
            console.log("enabled");
        }
    }
    catch (error) {
        // User denied permission or cancelled 
        console.log(error);
    }

    if (!window.webln) {
        alert("Please use a modern browser with webln: get the getalby.com extension");
        return false;
    }
    const paymentRequest = await getInvoice();
    await webln.enable();
    const response = await webln.sendPayment(paymentRequest);
    console.log(response);
    return !!response.preimage;
}
// ---
// LIGHTNING PAYMENT MAGIC 
// ---

// Save image first requests a payment from the user
// then makes the query to OpenAI
const saveImage = async () => {
    const isPaid = await requestPayment();
    if (!isPaid) {
        return false;
    }
    // if paid, send query
    sendQuery()

}



async function sendQuery() {

    var uprompt = document.getElementById('uprompt').value;
    const url = '/chat';

    console.log(JSON.stringify({ "input": uprompt }))

    fetch(url, {

        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "input": uprompt,
        })

    })

        .then(response => response.json())
        .then(data => {
            console.log(data);
            var str = JSON.stringify(data.response);
            var newStr = str.replace(/(\r\n|\n|\r)/gm, "");
            console.log(newStr);
            document.getElementById("reply").innerHTML = newStr;
        })
        .catch(error => {
            console.error(error);
        });

}




function postPreimage(preimage) {
    const url = 'http://localhost:5000/preimages';

    return fetch(`${url}?preimage=${encodeURIComponent(preimage)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Error: ${response.statusText}`);
            }
        })
        .catch(error => {
            throw new Error(`Error: ${error.message}`);
        });
}

saveImgBtn.addEventListener("click", saveImage);
