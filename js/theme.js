function changeTheme(originButton){
    if(originButton === undefined){return;}

    newTheme = originButton.getAttribute('data-theme');
    document.getElementById('theme-style').setAttribute('href', `${BASE_URL}css/theme/colors/${newTheme}.css`);

    const parent = document.getElementById("app-theme-selector-parent");
    parent.querySelector("div[active]").removeAttribute("active");
    originButton.setAttribute("active", "");

    localStorage.setItem('sb-selected-theme', newTheme);
}

function resetTheme(){
    const parent = document.getElementById("app-theme-selector-parent");
    changeTheme(parent.querySelector(`div[data-theme="oled"]`));
}

function loadTheme(){
    newTheme = localStorage.getItem('sb-selected-theme') || "oled";
    document.getElementById('theme-style').setAttribute('href', `${BASE_URL}css/theme/colors/${newTheme}.css`);

    document.addEventListener("DOMContentLoaded", function(event) {
        const parent = document.getElementById("app-theme-selector-parent");
        parent.querySelector("div[active]").removeAttribute("active");

        const activeButton = parent.querySelector(`div[data-theme="${newTheme}"]`);
        activeButton.setAttribute("active", "");

    }, {once:true });
}

loadTheme();


function changeNav(originButton){
    if(originButton === undefined){return;}
    newNav = originButton.getAttribute('data-nav-option');
    
    const navParent = document.getElementById("nav-parent")
    if(navParent){
        navParent.className = `nav-style-${newNav}`;
    }

    const navSelectorParent = document.getElementById("nav-selector-parent");
    if(navSelectorParent){
        const activeButton = navSelectorParent.querySelector("div[active]");
        if(activeButton){
            activeButton.removeAttribute("active");
        }
    }
        
    originButton.setAttribute("active", "");

    localStorage.setItem('sb-selected-nav', newNav);
}
function loadNav(){
    newNav = localStorage.getItem('sb-selected-nav') || "2";
    
    document.addEventListener("DOMContentLoaded", function(event) {
        const navParent = document.getElementById("nav-parent")
        if(navParent){
            navParent.className = `nav-style-${newNav}`;
        }

        const navSelectorParent = document.getElementById("nav-selector-parent");
        if(navSelectorParent){
            navSelectorParent.querySelector("div[active]").removeAttribute("active");
        }

        const activeButton = navSelectorParent.querySelector(`div[data-nav-option="${newNav}"]`);
        if(activeButton){
            activeButton.setAttribute("active", "");
        }
    }, {once:true });
}

loadNav();