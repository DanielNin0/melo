import accountService from './../services/accountService.js';

const AccountManager = (() => {

    const signUpWindow = document.getElementById("window-signup");
    if(signUpWindow){ var signUpForm = signUpWindow.querySelector("form") }

    const logInWindow = document.getElementById("window-login");
    if(logInWindow){ var logInForm = logInWindow.querySelector("form") }

    let appLoadingIndicator = document.getElementById("main-app-loading-indicator");
    

    function openSignUpWindow(){
        toggleWindow("#window-signup");
        signUpForm.onsubmit = (event) => createAccount(event);
    }
    function openLogInWindow(){
        toggleWindow("#window-login");
        logInForm.onsubmit = (event) => logIn(event);
    }

    async function createAccount(event = false){
        if(!event) return;
        event.preventDefault();

        if(!checkEmpty(`#${signUpWindow.id}`, "input")) { return; }

        // const name = signUpForm.querySelector("[name='name']");
        const email = signUpForm.querySelector("[name='email']");
        const password = signUpForm.querySelector("[name='password']");
        const repeatPassword = signUpForm.querySelector("[name='repeat-password']");
        const buttonSubmit = signUpForm.querySelector("[type='submit']");
        const rememberMe = signUpForm.remember_me.checked;

        if(!validatePasswords(password, repeatPassword)) return;
        if(!validateEmail(email)) return;

        buttonSubmit.setAttribute("disabled", "true");
        
        const data = {
            // name: name.value,
            email: email.value,
            password: password.value,
            password_repeat: repeatPassword.value,
            remember_me: rememberMe
        }

        const result = await accountService.signUp(data);
        buttonSubmit.removeAttribute("disabled");
        if(!result) return;

        if(result === "email_taken"){
            email.setAttribute("error", "");
            message("El correo ya esta en uso", "error");
            return;
        }

        if(result.success === false){
            message(result.message, "error");
            return;
        }
        
        window.location.href="home";
        return true;
    }

    function validatePasswords(password, repeatPassword){
        if(password.value !== repeatPassword.value){
            password.setAttribute("error", "");
            repeatPassword.setAttribute("error", "");
            message("Las contraseñas no coinciden", "error");
            return false;
        }
        return true;
    }

    function validateEmail(input) {
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!regex.test(input.value)) {
            message("El correo no es valido", "error");
            input.setAttribute("error", "");
            return false;
        }
        return true;
    }


    async function logIn(event = false){
        if(!event) return;
        event.preventDefault();

        if(!checkEmpty(`#${logInWindow.id}`, "input")) { return; }

        const email = logInForm.querySelector("[name='email']");
        const password = logInForm.querySelector("[name='password']");
        const buttonSubmit = logInForm.querySelector("[type='submit']");
        const rememberMe = logInForm.remember_me.checked;

        if(!validateEmail(email)) return;

        buttonSubmit.setAttribute("disabled", "true");

        const data = {
            email: email.value,
            password: password.value,
            remember_me: rememberMe,
        }

        const result = await accountService.logIn(data);
        buttonSubmit.removeAttribute("disabled");
        if(!result) return;

        if(result === "invalid_credentials"){
            email.setAttribute("error", "");
            password.setAttribute("error", "");
            message("Credenciales invalidas", "error");
            return;
        }
        if(result === "google_account"){
            message("Inicia sesion con Google", "error");
            return;
        }

        if(result.success === false){
            message(result.message, "error");
            return;
        }

        message("Sesion iniciada", "success");
        window.location.href="home";
        return true;
        // location.reload();
    }

    async function rememberMe(){
        const rememberMeToken = getCookie("codemelon-remember_me_js_accessible");
        if(!rememberMeToken) return false;


        const path = window.location.pathname;
        const page = path.split("/").pop();
        const queryString = window.location.search;
        const fullPage = page + queryString;
        
        
        // if(apptLoadingIndicator) appLoadingIndicator.classList.remove("hidden");
        const checkSession = await accountService.checkSession();
        // if(apptLoadingIndicator) appLoadingIndicator.classList.add("hidden");
        if(!checkSession) return false;
        if(checkSession.session === true) return false; // at this point cookies do exists and session exists, so we dont need to do anything

        
        // if session does not exists, and cookies exists, we need to check if the remember me token is valid and login
        // if(apptLoadingIndicator) appLoadingIndicator.classList.remove("hidden");
        const result = await accountService.rememberMe(rememberMeToken);
        // if(apptLoadingIndicator) appLoadingIndicator.classList.add("hidden");
        if(!result) return false;


        if(fullPage === "index?redirect"){
            window.location.href="home";
        } else if(fullPage === "index" || fullPage === ""){
            window.location.reload();
        }else if(fullPage === "login"){
            window.location.href="home";
        }
        
        return true;
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            let cookieValue = parts.pop().split(';').shift();
            try {
                cookieValue = decodeURIComponent(cookieValue); // **Crucially add decodeURIComponent here**
            } catch (e) {
                // Handle potential decoding error (e.g., malformed encoded value)
                console.error("Error decoding cookie value:", e);
                return null; // Or handle error as needed
            }
            return cookieValue;
        }
        return null;
    }

    async function logOut(){
        const result = await accountService.logOut();
        if(!result) return;
        window.location.reload();
    }


    async function handleCredentialResponse(response){
        const body = document.querySelector("body");

        body.style.pointerEvents = "none";
        body.style.transition = "opacity 1s";
        body.style.opacity = "0.3";

        const result = await accountService.handleCredentialResponse(response);
        body.style.pointerEvents = "initial";
        body.style.opacity = "1";
        
        if(!result) return;
        if(result.success){
            window.location.href="home";
        }
        if(result === "not_a_google_account"){
            message("Inicia sesión con tu correo y contraseña", "error");
            
        }
        
        return;
    }

    async function syncUserData(){
        const windowSettings = document.getElementById("window-settings");
        if(!windowSettings){ return; }       
        
        const userData = await accountService.getUserData();
        if(!userData) return;

        const uernameFields = windowSettings.querySelectorAll("[name='account-username']");
        const emailFields = windowSettings.querySelectorAll("[name='account-email']");
        const idFields = windowSettings.querySelectorAll("[name='account-id']");
        const firstLetterFields = document.querySelectorAll("[name='account-first-letter']");

        uernameFields.forEach(field => {
            field.value = userData.name;
            field.innerHTML = (userData.name == "") ? "<i class='outline-text'>Sin nombre de usuario</i>" : userData.name;
        });

        emailFields.forEach(field => {
            field.value = userData.email;
            field.innerText = userData.email;
        });

        idFields.forEach(field => {
            field.value = userData.id;
            field.innerText = userData.id;
        });

        firstLetterFields.forEach(field => {
            if(userData.name){
                field.innerText = userData.name.charAt(0).toUpperCase();
            } else {
                field.innerText = userData.email.charAt(0).toUpperCase();
            }
        });
    }

    async function modidfyUserData(){
        
        const dialogAccount = document.getElementById("dialog-account");
        if(!dialogAccount){ return; }
        if(!checkEmpty(`#${dialogAccount.id}`, "input")) { return; }

        const name = dialogAccount.querySelector("[name='account-username']");
        if(name.value === document.getElementById("response-settings-account-username").innerText){
            message("No hay cambios que guardar", "error");
            return;
        }

        const data = {
            name: name.value,
        }

        const result = await accountService.modifyUserData(data);
        if(!result) return;

        if(result === "name_taken"){
            name.setAttribute("error", "");
            message("El nombre de usuario ya esta en uso", "error");
            return;
        }

        toggleDialog();
        message("Datos actualizados", "success");
        syncUserData();

        return true;
    }


    // register access functionss
    async function registerAccess(){
        const data = {
            app: getCurrentApp(),
            device: detectDevice()
        }
        const result = await accountService.registerAccess(data);
        if(!result) return;
        return result.success;
    }

    function getCurrentApp(){
        const path = window.location.pathname;
        const pathParts = path.split("/");
        const page = pathParts.pop();
        const folder = pathParts.pop() || 'root'; // Handle root case

        return folder;
    }

    function detectDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/iPhone|iPad|iPod/i.test(userAgent)) { return "iOS (iPhone/iPad)";}
        if (/android/i.test(userAgent)) { return "Android";}
        if (/windows phone/i.test(userAgent)) { return "Windows Phone";}
        if (/tablet|ipad|playbook|silk/i.test(userAgent)) { return "Tablet";}
        if (/mobile|iphone|ipod|android|blackberry|opera mini|windows phone/i.test(userAgent)) {return "Mobile";}
        return "Desktop";
    }

  


    window.registerAccess = registerAccess;
    window.handleCredentialResponse = handleCredentialResponse;    
    return {
        openSignUpWindow,
        openLogInWindow,
        rememberMe,
        logOut,
        syncUserData,
        modidfyUserData,
        
    };

})();

export default AccountManager;