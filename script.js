const saveImgBtn = document.querySelector(".save-img");

// ---
// LIGHTNING PAYMENT WebLN
// ---
const getInvoice = async () => {
    const amountMsat = 10000;
    const recipient = "redandgreen@getalby.com";
    const invoiceRes = await fetch(`https://lnaddressproxy.getalby.com/generate-invoice?amount=${amountMsat}&ln=${recipient}`);
    const data = await invoiceRes.json();

    // preimage
    //console.log("Preimage : " + data.invoice.pr);
    const preimage = data.invoice.pr;
    try {
        const data = await postPreimage(preimage);
        //console.log(data);
        return preimage;
    } catch (error) {
        console.error(error);
    }

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
// LIGHTNING PAYMENT WebLN end
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


// check the preimage has not been seen before
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
            // Usage
            const secretValue = getCookieValue('secret');
            console.log(secretValue);  // Output the secret value to the console
            return response.json();
        } else {
            throw new Error(`Error: ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
}

// cookie - secret 
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
