const saveImgBtn = document.querySelector(".save-img");

// ---
// LIGHTNING PAYMENT WebLN
// ---
const getInvoice = async () => {
    const amountMsat = 10000;
    const recipient = "redandgreen@getalby.com";
    const invoiceRes = await fetch(`https://lnaddressproxy.getalby.com/generate-invoice?amount=${amountMsat}&ln=${recipient}`);
    const data = await invoiceRes.json();

    const preimage = data.invoice.pr;
    try {
        await postPreimage(preimage);
        return preimage;
    } catch (error) {
        console.error(error);
    }
};

const requestPayment = async () => {
    try {
        if (typeof window.webln !== 'undefined') {
            await window.webln.enable();
            console.log("enabled");
        }
    } catch (error) {
        // User denied permission or canceled
        console.log(error);
    }

    if (!window.webln) {
        alert("Please use a modern browser with the getalby.com extension installed.");
        return false;
    }

    const paymentRequest = await getInvoice();
    await window.webln.enable();
    const response = await window.webln.sendPayment(paymentRequest);
    console.log(response);
    return !!response.preimage;
};

const saveImage = async () => {
    const isPaid = await requestPayment();
    if (!isPaid) {
        return false;
    }
    // if paid, send query
    sendQuery();
};

async function sendQuery() {
    var uprompt = document.getElementById('uprompt').value;
    const url = '/chat';

    console.log(JSON.stringify({ "input": uprompt }));

    // Show the spinner
    document.querySelector('.spinner-container').style.display = 'block';


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
            // Hide the spinner
            document.querySelector('.spinner-container').style.display = 'none';
        })
        .catch(error => {
            console.error(error);
            // Hide the spinner
            document.querySelector('.spinner-container').style.display = 'none';
        });
}

async function postPreimage(preimage) {
    const url = '/preimages';

    try {
        const response = await fetch(`${url}?preimage=${encodeURIComponent(preimage)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const secretValue = getCookieValue('secret');
            return response.json();
        } else {
            throw new Error(`Error: ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
}

function getCookieValue(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${cookieName}=`)) {
            return cookie.substring(cookieName.length + 1);
        }
    }
    return null;
}

saveImgBtn.addEventListener("click", saveImage);
