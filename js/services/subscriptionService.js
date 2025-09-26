const subscriptionService = (() => {

    const API_URL = `${BASE_URL}back-end/controllers/subscription.controller.php`;
    const CSRF_TOKEN = document.querySelector("meta[name='csrf-token']").getAttribute("content");

    async function getSubscriptions(data = {}){
        data.op = "get_subscriptions_list";
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Abort after 10 seconds
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'X-CSRF-Token': CSRF_TOKEN,
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(data),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message || "Unknown error in response");
            }
            return result;
        } catch (error) {
            clearTimeout(timeoutId);
            // if(error.message === "email_taken"){ return error.message;}

            if (error.name === 'AbortError') {
                message("Request timed out", "error");
            } else {
                message(`An error occurred: ${error.message}`, "error");
            }
            return null;
        }
    }

    async function getInvoices(data = {}){
        data.op = "get_invoices_list";
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Abort after 10 seconds
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'X-CSRF-Token': CSRF_TOKEN,
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(data),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message || "Unknown error in response");
            }
            return result;
        } catch (error) {
            clearTimeout(timeoutId);
            // if(error.message === "email_taken"){ return error.message;}

            if (error.name === 'AbortError') {
                message("Request timed out", "error");
            } else {
                message(`An error occurred: ${error.message}`, "error");
            }
            return null;
        }
    }

    return{
        getSubscriptions,
        getInvoices
    }

})();

export default subscriptionService;