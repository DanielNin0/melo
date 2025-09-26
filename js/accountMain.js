import AccountManager from './managers/accountManager.js'; 
import SubscriptionManager from './managers/subscriptionManager.js'; 

(async function accountMain() {

    console.log("accountMain.js");

    try{
        
        await AccountManager.rememberMe();
        AccountManager.syncUserData();
        
        setupAccountGlobalEvents();
        setupUserGlobalEvents();
    } catch (error) {
        console.error("An unexpected error occurred.");
    }

})();

function setupAccountGlobalEvents(){

    const buttonOpenLoginWindow = document.querySelectorAll("[name='button-open-login-window']");
    if(buttonOpenLoginWindow.length > 0){
        buttonOpenLoginWindow.forEach(button => {
            button.addEventListener("click", () => {
                AccountManager.openLogInWindow();
            });
        });
    }

    const buttonOpenSignUpWindow = document.querySelectorAll("[name='button-open-signup-window']");
    if(buttonOpenSignUpWindow.length > 0){
        buttonOpenSignUpWindow.forEach(button => {
            button.addEventListener("click", () => {
                AccountManager.openSignUpWindow();
            });
        });
    }

    const buttonOpenSubscriptionSubSection = document.querySelectorAll("[name='button-open-subscription-sub-section']");
    if(buttonOpenSubscriptionSubSection.length > 0){
        buttonOpenSubscriptionSubSection.forEach(button => {
            button.addEventListener("click", () => {
                SubscriptionManager.openSubscriptionSubSection();
            });
        });
    }

    const buttonCloseSubscriptionSubSection = document.querySelectorAll("[name='button-close-subscription-sub-section']");
    if(buttonCloseSubscriptionSubSection.length > 0){
        buttonCloseSubscriptionSubSection.forEach(button => {
            button.addEventListener("click", () => {
                SubscriptionManager.closeSubscriptionSubSection();
            });
        });
    }
}

function setupUserGlobalEvents(){

    // Modify user data form submit
    const dialogAccount = document.getElementById("dialog-account");
    if(dialogAccount){
        dialogAccount.querySelector("[name='button-modify-user-data']").addEventListener("click", () => {
            AccountManager.modidfyUserData();
        });
    }

    const dialogLogoutConfirmation = document.getElementById("dialog-logout-confirmation");
    if(dialogLogoutConfirmation){
        dialogLogoutConfirmation.querySelector("[name='button-logout']").addEventListener("click", () => {
            AccountManager.logOut();
        });
    }

}