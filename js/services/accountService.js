const accountService = (() => {

    const API_URL = `${BASE_URL}back-end/controllers/account.controller.php`;
    const CSRF_TOKEN = document.querySelector("meta[name='csrf-token']").getAttribute("content");


    async function signUp(data = {}) {
        data.op = "sign_up";
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
            if(error.message === "email_taken"){ return error.message;}

            if (error.name === 'AbortError') {
                message("Request timed out", "error");
            } else {
                message(`An error occurred: ${error.message}`, "error");
            }
            return null;
        }
    }

    async function logIn(data = {}) {
        data.op = "log_in";
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
            if(error.message === "invalid_credentials"){ return error.message;}
            if(error.message === "google_account"){ return error.message;}


            if (error.name === 'AbortError') {
                message("Request timed out", "error");
            } else {
                message(`An error occurred: ${error.message}`, "error");
            }
            return null;
        }
    }

    async function checkSession(){
        const data = {
            op: "check_session"
        }
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
            if (error.name === 'AbortError') {
                message("Request timed out", "error");
            } else {
                message(`An error occurred: ${error.message}`, "error");
            }
            return null;
        }
    }

    async function rememberMe(token) {
        if(!token) return;
        const data = {
            op: "remember_me",
            token
        }
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
            if (error.name === 'AbortError') {
                message("Request timed out", "error");
            } else {
                message(`An error occurred: ${error.message}`, "error");
            }
            return null;
        }
    }

    async function logOut(){
        const data = {
            op: "log_out"
        }
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
            if (error.name === 'AbortError') {
                message("Request timed out", "error");
            } else {
                message(`An error occurred: ${error.message}`, "error");
            }
            return null;
        }
    }

    async function handleCredentialResponse(response){
        const data = {
            op: "google_auth",
            credential: response.credential
        }
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
            if(error.message === "not_a_google_account"){ return error.message }

            if (error.name === 'AbortError') {
                message("Request timed out", "error");
            } else {
                message(`An error occurred: ${error.message}`, "error");
            }
            return null;
        }
    }

    async function getUserData(){
        const data = {
            op: "get_user_data"
        }
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
            if (error.name === 'AbortError') {
                message("Request timed out", "error");
            } else {
                message(`An error occurred: ${error.message}`, "error");
            }
            return null;
        }
    }

    async function modifyUserData(data = {}){
        data.op = "modify_user_data";
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
            if(error.message === "name_taken"){ return error.message;}

            if (error.name === 'AbortError') {
                message("Request timed out", "error");
            } else {
                message(`An error occurred: ${error.message}`, "error");
            }
            return null;
        }
    }

    async function registerAccess(data = {}){
        data.op = "register_access"
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
            if (error.name === 'AbortError') {
                message("Request timed out", "error");
            } else {
                message(`An error occurred: ${error.message}`, "error");
            }
            return null;
        }
    }

    return{
        signUp,
        logIn,
        logOut,
        rememberMe,
        checkSession,
        handleCredentialResponse,
        getUserData,
        modifyUserData,
        registerAccess
    }

})();

export default accountService;