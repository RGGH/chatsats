const saveImgBtn = document.querySelector(".save-img");

// ---
// LIGHTNING PAYMENT MAGIC 
// ---
const getInvoice = async () => {
    const amountMsat = 1000;
    const recipient = "hello@getalby.com";
    const invoiceRes = await fetch(`https://lnaddressproxy.getalby.com/generate-invoice?amount=${amountMsat}&ln=${recipient}`);
    const data = await invoiceRes.json();
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
// then downloads the image file
const saveImage = async () => {
    const isPaid = await requestPayment();
    if (!isPaid) {
        return false;
    }
    // do stuff
    sendQuery()

}



async function sendQuery() {

    var uprompt = document.getElementById('uprompt').value;

    // API (FastAPI)
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
            console.log(data); // Optional: Log the response data to the console
            document.getElementById("reply").innerHTML = JSON.stringify(data.response);
        })
        .catch(error => {
            console.error(error); // Handle any errors that occur during the fetch request
        });





    //document.getElementById("reply").innerHTML = res.text();

}

saveImgBtn.addEventListener("click", saveImage);
