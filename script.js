const saveImgBtn = document.querySelector(".save-img");

// ---
// LIGHTNING PAYMENT WebLN
// ---
const getInvoice = async () => {
    const amountMsat = 1000;
    const recipient = "hello@getalby.com";
    const invoiceRes = await fetch(`https://lnaddressproxy.getalby.com/generate-invoice?amount=${amountMsat}&ln=${recipient}`);
    const data = await invoiceRes.json();

    // preimage
    console.log("Preimage : " + data.invoice.pr);
    //const preimage = data.invoice.pr;
    const preimage = 'lnbc10n1pj27z6ppp53pymny5lxv20t28shldf5zadfzauh8h6e82znc244v29eamv6w5shp50kncf9zk35xg4lxewt4974ry6mudygsztsz8qn3ar8pn3mtpe50scqzzsxqyz5vqsp5lvxsj3sj5m58hk4rxlh9wce2azs8qdcu6rzs7qua0t6sclm4ptdq9qyyssqpch3gv0w44je20c3k7a9lgrrznsekfe5nnn5kr9g96fjxrzc5ym5kfzfm7mc95qxhvfe08g5v9lg0z05h06hzw7akw4essftq766yjsqjg58wa';
    //const preimage = 'lnbc10c1pj2a5j0pp5kn5ujru36wvv65peg848us3rsy3e7cr4l67d3957phyah4d0nncshp50kncf9zk35xg4lxewt4974ry6mudygsztsz8qn3ar8pn3mtpe50scqzzsxqyz5vqsp5t0lqm4cf363ec0n3c3630utmgtan0cy9sppedlvy490llpdngwqs9qyyssqrga269z8emnea2mrd7e9s3pucfs7zvhjz7w5s4vt5zgvpt7tf0r4j7ftgfle6w9pdfxd5khck0t6kxzyrjrtnneytgtsj6ljnewxjzcpasxa742';
    try {
        const data = await postPreimage(preimage);
        console.log(data);
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
            return response.json();
        } else {
            throw new Error(`Error: ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
}




saveImgBtn.addEventListener("click", saveImage);
