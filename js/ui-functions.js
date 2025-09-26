let nav = document.querySelector('nav');
function toggleSection(objetiveSectionId, specialScrollTarget = false) {
  activeSection = document.querySelector('section[active]');
  activeNavButton = nav.querySelector('nav button[active]');
  if (activeSection.id === objetiveSectionId) {
    if(specialScrollTarget){
      document.querySelector(specialScrollTarget).scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    activeSection.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    return;
  }

  // if (!document.startViewTransition) {
  //   updateDom(objetiveSectionId);
  //   return;
  // }

  // const transition = document.startViewTransition(() => {
    // updateDom(objetiveSectionId)
  // });
  // transition.finished
  updateDom(objetiveSectionId);
  function updateDom( objetiveSectionId ) {
    if(activeSection) {activeSection.removeAttribute('active'); activeSection.classList.remove("section-open");}
    if(activeNavButton) {activeNavButton.removeAttribute('active');}
    if(document.getElementById(objetiveSectionId)) {
      document.getElementById(objetiveSectionId).setAttribute('active', '');

      const navButton = nav.querySelector(`button[data-section="${objetiveSectionId}"]`);
      if(navButton) navButton.setAttribute('active', '');
      document.getElementById(objetiveSectionId).classList.add("section-open");

      if((window.location.pathname).split("/").pop() === "home"){
        localStorage.setItem("currentSection", objetiveSectionId);

      }
    }
  }
}
function resetDialog(dialog){
  if(!dialog){return;}
  const inputs = dialog.querySelectorAll('input, textarea, select, '+ materialT("input"));
  for (let i=0; i<inputs.length; i++){
    inputs[i].value = "";
    inputs[i].removeAttribute('error');
  }
  toggleButton("#"+dialog.id, false);
}
function toggleDialog(dialogId) {
  if (dialogId == '' || dialogId == undefined){
    const openDialog = document.querySelector('md-dialog[open]')
    if(openDialog){
      openDialog.removeAttribute('open');
      openDialog.classList.remove('dialog-active');
      resetDialog(openDialog);
    }
    // resetForm();
    return
  }
  const dialog = document.getElementById(dialogId);
  dialog.setAttribute('open', '');
  dialog.classList.add('dialog-active');

}

// Menus
function toggleMenu(menuId, originButton = false) {
  if(originButton){
    const menu = originButton.nextElementSibling;
    menu.open = !menu.open;
    return;
  }

  const menu = document.getElementById(menuId);
  menu.open = !menu.open;
}


// old
function materialT(elements) {
  const mapping = {
    'option': 'md-select-option',
    'select': 'MD-OUTLINED-SELECT, MD-FILLED-SELECT, md-outlined-select, md-filled-select',
    'select-not-reset': 'md-outlined-select:not(.no-reset), md-filled-select:not(.no-reset)', 
    'button': 'md-outlined-button, md-filled-button, md-filled-tonal-button, md-text-button, md-elevated-button',
    'input': 'md-outlined-text-field, md-filled-text-field',
    'input-not-reset': 'md-outlined-text-field:not(.no-reset), md-filled-text-field:not(.no-reset)',
    'slider': 'md-slider',
    'textarea': 'mwc-textarea',
  };

  const elementList = elements.split(',').map(e => e.trim().toLowerCase());

  const result = [];
  elementList.forEach(element => {
    const mapped = mapping[element];
    if (mapped) {
      result.push(mapped);
    }
  });

  return result.length > 0 ? result.join(', ') : 'Componente no mapeado';
}

function resetForm(parent){
  if (parent) {
    const parentElement = document.querySelector(parent);
    if(!parentElement){return;}
    var inputs = parentElement.querySelectorAll(materialT("input-not-reset")+', textarea, select:not(.no-reset), input:not(.no-reset) ,'+materialT("select-not-reset")+','+materialT("slider"));
  } else {
    var inputs = document.querySelectorAll(materialT("input")+', textarea, select:not(.no-reset), input:not(.no-reset)');
  }
  for (let i=0; i<inputs.length; i++){
    inputs[i].value = "";
    inputs[i].style.background = "";
    inputs[i].classList.remove('error');
  }
}

function resetFormNextGen(parentId){
  if(!parent){return;}
  const parentElement = document.getElementById(parentId);
  if(!parentElement){return;}
  const inputs = parentElement.querySelectorAll(materialT("input-not-reset")+', textarea, select:not(.no-reset), input:not(.no-reset) ,'+materialT("select-not-reset")+','+materialT("slider"));
  for (let i=0; i<inputs.length; i++){
      if(inputs[i].tagName == "select" || inputs[i].tagName == "MD-OUTLINED-SELECT" || inputs[i].tagName == "MD-FILLED-SELECT"){
        inputs[i].querySelectorAll(materialT("option")).forEach(element => {
          element.selected = false;
        });
      }else{
        if(inputs[i].tagName == "MD-SLIDER"){
          inputs[i].value = 50;
        }else{
          inputs[i].value = "";
        }
      }
      
    inputs[i].removeAttribute('error');
    try{inputs[i].reportValidity()} catch(e){}
    inputs[i].style.background = "";
    inputs[i].classList.remove('error');
  }
}

function checkEmpty(parentId, elementToCheck){
  const parentElement = document.querySelector(parentId);
  if(!parentElement){return;}
  const allInputs = parentElement.querySelectorAll(`${materialT(elementToCheck)}, ${elementToCheck}`);
  // console.log(allInputs);

  const inputs = Array.from(allInputs).filter(input => !input.hasAttribute('data-allow-empty'));
  // console.log(inputs)

  validation = 0;
  for (let i=0; i<inputs.length; i++){
    inputs[i].addEventListener("focus", function() {inputs[i].removeAttribute('error')}, {once: true});
    if(inputs[i].value === "" || inputs[i].value === "0"){ 
      validation = 1; 
      inputs[i].setAttribute('error', '');;
    }
  }
  if(validation != 0){
    // if(type==="dialog"){toggleWindow("#empty_spaces")} 
    return false;
  }else{
    return true
  }
}

function toggleButton(parentId, state, type){
  const parentElement = document.querySelector(parentId);
  if(!parentElement){return;}
  lastButton = parentElement.querySelector(materialT("button"));
  if(type === "submit"){lastButton = parentElement.querySelector('[type="submit"]')}
  if(state){
    lastButton.disabled = true;
  } else {
    lastButton.disabled = false;
  }
}

let currentTimeoutId = null;

function message(message, action){
  const messageElement = document.querySelector("MESSAGE");
  if (action === "error") {messageElement.classList.add('error');}
  if (action === "success") {messageElement.classList.add('success'); }
  
  messageElement.innerHTML = message;
  messageElement.style.display = "flex";
  messageElement.style.animation = "messageIn 0.7s cubic-bezier(0.6, -0.14, 0.02, 1.29)";
  if (currentTimeoutId) {clearTimeout(currentTimeoutId);}
  currentTimeoutId = setTimeout(() => {
      messageElement.style.animation = "messageOut 0.8s";
      setTimeout(() => {
        messageElement.style.display = "none"; 
        currentTimeoutId = null;
        messageElement.className="";
      }, 700);
  }, 4000);
}
function toggleWindowFullSize(){
  if(!document.querySelector('transparent window.active')){return;}

  state = Flip.getState("transparent window.active");
  windowId = document.querySelector('transparent window.active').id;
  document.getElementById(windowId).classList.toggle('full-size');

  timeline = Flip.from(state, {
    // ease: CustomEase.create("custom", "M0,0 C0.308,0.19 0.107,0.633 0.288,0.866 0.382,0.987 0.656,1 1,1 "),
    ease: CustomEase.create("easeName", "0.38,0.49,0,1"),
    targets: "window.active",
    duration: 0.7,
    scale:true,
    simple:true,
  })
  timeline.play();
}
function toggleWindow(windowId, position, scale, appearStyle = false, customOrigin = false){
  const caller = new Error().stack.split('\n')[2];
  console.log("ToggleWindow called by:", caller.trim());
  if (windowId == ''){windowId = null}

  const windowNew = document.querySelector(windowId);
  if(windowNew){
    transparent = windowNew.closest('transparent');
    setTimeout(() => {windowNew.querySelector("HOLDER").scrollTo(0,0)}, 1)
  }else{
    windowActive = document.querySelector("window.active");
    if(!windowActive){return;}
    transparent = windowActive.closest('transparent');
  }


  if (transparent.hasAttribute('data-beautiful_transparent')) {
    transparent.removeAttribute('data-beautiful_transparent');
  }

  // Close any other open window
  
  const activeWindow = transparent.querySelector('window.active');

  function closingAnimation() {
    if (transparent.hasAttribute("closing")) {
      transparent.classList.remove('active');
      transparent.removeAttribute("closing");
      
      activeWindow.classList.remove('active');
    }
  }

  if (activeWindow) {
    if (transparent.hasAttribute("closing")) { return; }
    toggleOvermessage();

    // const activeWindowState = Flip.getState(activeWindow);
    const windowAnimationId = activeWindow.getAttribute("data-window-toggler-id");
    const originButton = document.querySelector(`[data-button-toggler-id="${windowAnimationId}"]`);

    // console.log(windowAnimationId, originButton)
    
    
    
    // This attribute added and all makes the close animation smooth
    
    transparent.setAttribute("closing", "");
    // const windowHolderWidth = activeWindow.querySelector("holder").offsetWidth;
    // activeWindow.querySelector("holder").style.minWidth = `${windowHolderWidth}px`;
    if(originButton) applyAnimationReverse(Flip.getState(originButton), activeWindow, true, true, false, false)
    
    setTimeout(() => {
      closingAnimation();
      // activeWindow.querySelector("holder").style.minWidth = "initial";
    }, 480);

    
    resetFormNextGen(activeWindow.id)
    // resetForm();
    return;
  }
  if (transparent.hasAttribute("closing") && transparent.classList.contains("active")) {
    transparent.removeAttribute("closing");
  }

  // remove useless classes
  transparent.classList.remove('dynamic', 'right', 'left', 'top', 'bottom');


  // Window to open
  if (!windowNew) { return; }
  transparent.classList.add('active'); 
  localStorage.setItem("currentWindow", windowId); 

  

  // Set origin element of animation
  if (event && event.currentTarget) {
    element = event.currentTarget;
    if(customOrigin) element = customOrigin;
    windowNew.classList.remove("not-animated");
  }else{
    element = null
    windowNew.classList.add("not-animated");
  }

  const randomNumber = Math.random();
  if(element) {
  
    if (element && element.tagName && element.tagName.toLowerCase() === "md-menu-item") {
      // console.log(element.closest("[data-menu-toggler]"))
      const menuTogglerId = element.closest("md-menu").getAttribute("anchor")
      const menuTogglerButton = document.getElementById(menuTogglerId);
      if(menuTogglerButton) element = menuTogglerButton
      // console.log(element.closest("md-menu"))
    }

    element.setAttribute("data-button-toggler-id", randomNumber);
  };
  windowNew.setAttribute("data-window-toggler-id", randomNumber);
  // if(originElement){
  //   element = document.getElementById(originElement);
  // }

  // specific functions per window
  switch (windowId) {
    case "#window-account": 
      getUserData()
    break;
    default: break;
  }

  // Set element with Dynamic position
  if(position == "absolute"){
    windowNew.classList.add("absolute");
    var rect = element.getBoundingClientRect();
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    // Tests
    
    

    if (rect.left < (screenWidth/2)) {
      windowNew.style.right = "unset";
      windowNew.style.left = Math.round(rect.left)+"px";
      transparent.classList.add("left");
    } else{
      windowNew.style.left = "unset";
      windowNew.style.right = screenWidth-Math.round(rect.right)+"px";
      transparent.classList.add("right");
    }

    if (rect.top < (screenHeight/2)) {
      windowNew.style.bottom = "unset";
      windowNew.style.top = (Math.round(rect.top) + Math.round(rect.height) + 8)+"px";
      if(appearStyle){
        windowNew.style.top = (Math.round(rect.top))+"px";
      }
      transparent.classList.add("top");

    }else{
      windowNew.style.top = "unset";
      windowNew.style.bottom = (screenHeight-Math.round(rect.bottom) + Math.round(rect.height) + 8)+"px";
      if(appearStyle){
        windowNew.style.bottom = (screenHeight-Math.round(rect.bottom))+"px";
      }
      transparent.classList.add("bottom");
    }
    
    
    // requestAnimationFrame(function() {
    //   var windowHeight = windowNew.offsetHeight;
    //   var windowBottom = screenHeight - (windowNew.offsetTop + windowNew.offsetHeight);
      
    //   var windowWidth = windowNew.offsetWidth;

    // });
  }
  if(scale === undefined){scale = 0}else{scale = 1}
  animate(element, windowNew, position, scale);
}
function animate(element, windowNew, position, scale){
  let easeType = CustomEase.create("custom", "M0,0 C0.308,0.19 0.107,0.633 0.288,0.866 0.382,0.987 0.656,1 1,1 ");
  if(position === "absolute" && window.innerWidth >= 681){
    easeType = CustomEase.create("custom", "M0,0 C0.249,-0.124 0.04,0.951 0.335,1 0.684,1.057 0.614,0.964 1,1");
    // easeType = CustomEase.create("custom", "M0,0 C0.311,0 0.118,0.629 0.319,0.872 0.457,1.039 0.818,1.001 1,1 ");
    
    // easeType = CustomEase.create("custom", "M0,0 C0.249,-0.124 -0.003,0.896 0.325,1.044 0.653,1.191 0.585,0.935 1,1 ");
    // easeType = CustomEase.create("custom", "M0,0 C0.249,-0.124 0.026,0.939 0.335,1.013 0.685,1.097 0.585,0.935 1,1 ");
    
    // easeType = CustomEase.create("custom", "M0,0 C0.249,-0.124 0.045,0.925 0.335,1 0.625,1.074 0.532,0.987 1,1");
  }

  if (scale === 0 || window.innerWidth >= 681) {
    var scaleValue = true;
  }else{
    var scaleValue = false;
  }


  
  let state = Flip.getState(element);
  windowNew.classList.toggle('active');
  Flip.from(state, {
    targets: windowNew,
    duration: 0.7,
    scale: scaleValue,
    ease: easeType,
    // ease: CustomEase.create("custom", "M0,0 C0.154,0 0.165,0.541 0.324,0.861 0.532,1.281 0.524,1 1,1 "),
    // ease: CustomEase.create("custom", "M0,0 C0.154,0 0.18,0.666 0.35,0.861 0.562,1.106 0.611,1 1,1 "),
    // ease: CustomEase.create("custom", "M0,0 C0.308,0.19 0.107,0.633 0.288,0.866 0.382,0.987 0.656,1 1,1 "),
    // ease: CustomEase.create("easeName", ".47,.29,0,1"),
    // ease: CustomEase.create("easeName", ".58,.18,0,1"),
    // ease: CustomEase.create("easeName", ".21,.19,0,1"),
    // ease: CustomEase.create("emphasized", "0.2, 0, 0, 1"),
    // ease: CustomEase.create("classic", "0.1, 0.8, 0, 1"),
    // ease: CustomEase.create("classic", "0.4, 0.4, 0, 1.2"),
    // ease: CustomEase.create("custom", "M0,0 C0.099,0 0.133,0.915 0.325,1.044 0.642,1.257 0.64,0.938 1,1 "),
    // ease: CustomEase.create("custom", "M0,0 C0.249,-0.124 -0.003,0.896 0.325,1.044 0.653,1.191 0.585,0.935 1,1 "),
    absolute: true,
  })
    
}


function currencySymbol() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone.includes('America')) {
    return '$';
  }
  return '€';
}

function formatMoney(amount) {
  // Get user timezone to approximately determine region
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Default to EUR
  let currency = 'EUR';
  
  // Check if timezone is in Americas
  if (timezone.includes('America')) {
    currency = 'USD';
  }

  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: currency 
  }).format(amount);
}
function dateToText(date, showYear) {
  if(showYear === undefined){showYear = false}
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const [year, month, day] = date.split("-");
  if(showYear){
    return `${parseInt(day)} de ${months[month - 1]} de ${year}`;
  }
  return `${parseInt(day)} de ${months[month - 1]}`;
}
function dateToPrettyDate(date, showYear) {
  if(date === "0000-00-00"){return "-";}
  if(showYear === undefined){showYear = false}
  const [year, month, day] = date.split("-");
  if(showYear){
    return `${parseInt(day)}/${month}/${year}`;
  }
  return `${parseInt(day)}/${month}`;
}

function dateToShort(date, showYear = false) {
  if (!date) return '';
  const shortMonths = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const [year, month, day] = date.split("-");
  if(showYear){
    return `${parseInt(day)} ${shortMonths[parseInt(month) - 1]} ${year}`;
  }
  return `${parseInt(day)} ${shortMonths[parseInt(month) - 1]}`;
}

function dateToFullText(dateString, showYear = false) {
  // --- 1. Validación de Entrada ---
  if (!dateString || typeof dateString !== "string") {
    // Retorna un mensaje claro si la entrada no es válida.
    return "Por favor, selecciona una fecha válida.";
  }

  // --- 2. Preparación de la Fecha ---
  // Se aísla solo la parte de la fecha si el formato es datetime (ej: "2025-07-21 10:00:00").
  const datePart = dateString.split(" ")[0];
  const parts = datePart.split("-");

  if (parts.length !== 3) {
    return "Formato de fecha inválido. Utiliza YYYY-MM-DD.";
  }

  // --- 3. Creación del Objeto Date de Forma Segura ---
  // Se convierte cada parte a número para crear el objeto Date.
  const [year, month, day] = parts.map(Number);

  // Se verifica que los componentes de la fecha sean números válidos.
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return "Componentes de fecha inválidos. Utiliza YYYY-MM-DD.";
  }

  // Se crea el objeto Date usando los componentes numéricos.
  // Este método (new Date(y, m-1, d)) crea la fecha en la zona horaria local del usuario,
  // evitando problemas comunes de conversión a UTC que ocurren con new Date('YYYY-MM-DD').
  const dateObj = new Date(year, month - 1, day);

  // Se comprueba que la fecha creada sea válida (ej. previene "2025-02-30").
  // El constructor de Date "corrige" fechas inválidas (ej. 30 de feb lo pasa a marzo),
  // por lo que comparamos si la fecha resultante coincide con la entrada.
  if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) {
    return "La fecha proporcionada no es válida (ej. el día no existe en el mes).";
  }

  // --- 4. Formateo con la API de Internacionalización (Intl) ---
  // Se definen las opciones de formato. Es más declarativo y mantenible.
  const options = {
    weekday: 'long', // ej: "lunes"
    month: 'long',   // ej: "julio"
    day: 'numeric',  // ej: "21"
  };

  if (showYear) {
    options.year = 'numeric'; // ej: "2025"
  }

  // Se utiliza 'es-MX' como localizador para español de México.
  // Intl se encarga de formatear la fecha correctamente según las reglas del idioma.
  const formatter = new Intl.DateTimeFormat('es-MX', options);
  let formattedDate = formatter.format(dateObj);

  // --- 5. Ajuste Final de Formato ---
  // Se capitaliza la primera letra para un resultado más pulcro (ej: "Lunes" en vez de "lunes").
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

function timeToAmPm(timeString) {
  if (!timeString) return '';
  
  // Extraer solo la parte de la hora si es una fecha completa
  let time = timeString;
  if (timeString.includes(' ')) {
    time = timeString.split(' ')[1];  // Toma solo la parte de la hora HH:MM:SS
  }
  
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // convert 0 to 12
  return `${hour}:${minutes} ${ampm}`;
}

function formatTime(time){
  if(time === undefined){return;}
  if(time === "00:00:00"){return "-";}
  const [hours, minutes, seconds] = time.split(":");
  return `${hours}:${minutes}`;
}

// function toggleTab(windowId, tabId, workHidden){
//   const windowElement = document.getElementById(windowId);
//   const currentActiveTab = windowElement.querySelector('.md-tab[active]');
//   if (currentActiveTab) {currentActiveTab.removeAttribute('active');}


//   if(workHidden){
//     const currentActiveTabSelector = windowElement.querySelector('md-tabs [active]');
//     if (currentActiveTabSelector) {currentActiveTabSelector.removeAttribute('active');}
//     const objetiveTabSelector = windowElement.querySelector('[data-tab-id="'+tabId+'"]');
//     objetiveTabSelector.setAttribute('active', '');
//   }

  

//   const objetiveTab = windowElement.querySelector('.md-tab[id="'+tabId+'"]');
//   objetiveTab.setAttribute('active', '');
  
// }
function toggleMdTab(origin = false, tabId){
  var desiredPanel = false;
  if(origin){
    const desiredPanelId = origin.getAttribute("aria-controls");
    desiredPanel = document.getElementById(desiredPanelId);
  }
  if(!origin && tabId != undefined){
    desiredPanel = document.getElementById(tabId);
  }
  // if(!origin){
  //   const currentActiveTab = document.querySelector("md-tab[active]");
  // }
  // falta por trabajar
  
  if(!desiredPanel) return;
  
  const currentPanel = desiredPanel.parentElement.querySelector("[data-md-panel][active]");
  if(currentPanel) {
    currentPanel.removeAttribute("active");
  }
  desiredPanel.setAttribute("active", "");
}

// function addTableRow(tableId, templateId){
//   const table = document.getElementById(tableId);
//   const template = document.getElementById(templateId);

// }
function applyAnimation(state, target, scale = true, absolute = false, customEase = false, zIndex = false){
  easeToUse = CustomEase.create("custom", "M0,0 C0.308,0.19 0.107,0.633 0.288,0.866 0.382,0.987 0.656,1 1,1 ")
  if(!zIndex){zIndex = 0}else{zIndex = 100}
  if(customEase){easeToUse = CustomEase.create("easeName", "0.38,0.49,0,1")}
  let timeline = Flip.from(state, {
    ease: easeToUse,
    // ease: CustomEase.create("custom", "M0,0 C0.154,0 0.165,0.541 0.324,0.861 0.532,1.281 0.524,1 1,1 "),
    targets: target,
    duration: 0.7,
    absolute:absolute,
    scale:scale,
    zIndex:zIndex,
    simple:true,
  })
  timeline.play();
}

async function applyAnimationReverse(state, target, scale = true, absolute = false, customEase = false, zIndex = false) {
  return new Promise(resolve => {
    let easeToUse = CustomEase.create("custom300", "M0,0 C0.28,0.08 0.10,0.55 0.28,0.78 0.38,0.95 0.64,1 1,1");
    if (!zIndex) { zIndex = 0 } else { zIndex = 100 }
    if (customEase) { easeToUse = CustomEase.create("easeName", "0.38,0.49,0,1") }

    let timeline = Flip.to(state, {
      ease: easeToUse,
      targets: target,
      duration: 0.5,
      absolute: absolute,
      scale: scale,
      zIndex: zIndex,
      simple: true,
      onComplete: () => {
        target.setAttribute("style", "")
        resolve();
      }
    });

    timeline.play();
  });
}

function removeTableRow(row = false){
  if(!row){return;}
  const parentTable = row.closest("table");
  rowsState = Flip.getState(`#${parentTable.id} tr`);
  row.remove();
  let timeline = Flip.from(rowsState, {
      ease: CustomEase.create("custom", "M0,0 C0.308,0.19 0.107,0.633 0.288,0.866 0.382,0.987 0.656,1 1,1 "),
      targets: `#${parentTable.id} tr`,
      absolute:false,
      scale:true,
      simple:true,
  })
  timeline.play();
  countTableRows(parentTable.id);
}

function countTableRows(tableId){
  const table = document.getElementById(tableId);
  const rowsCount = table.querySelectorAll('tr').length;
  
  if(rowsCount <= 1){
    table.querySelector("tr").remove();
    table.parentElement.querySelector(".container-info-empty-table").innerHTML = `
      <div class="content-box on-background-text align-center info-table-empty">
        <md-icon class="pretty medium">sentiment_content</md-icon>
        <span class="headline-small">No hay registros</span>
      </div>
    `;
  }
}

function setDateTime(dateParent, timeParent){
  const date = getDate();
  const time = getTime();

  const dateParentElement = document.getElementById(dateParent);
  const timeParentElement = document.getElementById(timeParent);

  if(dateParentElement){
    dateParentElement.value = `${date.year}-${date.month}-${date.day}`;
  }
  if(timeParentElement){
    timeParentElement.value = `${time.hours}:${time.minutes}`;
  }
}

function getDate(){
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
  const day = String(date.getDate()).padStart(2, '0');

  const response = {
    "year": year,
    "month": month,
    "day": day,
  }
  return response;
}
function getTime(){
  const date = new Date();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const response = {
    "hours": hours,
    "minutes": minutes,
  }
  return response;
}

function toggleWSection(wSectionId, originButton){
  if (wSectionId.charAt(0) === '#') {
    wSectionId = wSectionId.substring(1);
  }
  if(originButton === undefined){
    holder = document.getElementById(wSectionId).closest("HOLDER");
  }else{
    holder = originButton.closest("HOLDER");
  }
  if(!holder){
    holder = document.querySelector("window.active")
  }
  const activeWSection = holder.querySelector('.w-section[active]');
  const activeWSectionButton = holder.querySelector('button[active]');
  if(wSectionId === activeWSection.id){return false;}

  const objetiveWSection = holder.querySelector(`#${wSectionId}`);
  const objetiveWSectionButton = holder.querySelector(`button[data-w-section="${wSectionId}"]`);

  const activeWSectionParent = activeWSection.parentElement;
  const objetiveWSectionParent = objetiveWSection.parentElement;
  // objetiveWSectionParent.style.background = "blue";

  // objetiveWSection.style.background = "red";


  // activeWSectionParent.style.background = "red";
  // objetiveWSectionParent.style.background = "blue";


  if(activeWSectionParent !== objetiveWSectionParent){

    var innerActiveWSectionButton = objetiveWSectionParent.querySelector('button[active]');
    var innerActiveWSection = objetiveWSectionParent.querySelector('.w-section[active]');

    if(innerActiveWSectionButton){ innerActiveWSectionButton.removeAttribute('active');}
    if(innerActiveWSection){ innerActiveWSection.removeAttribute('active');}

    objetiveWSection.setAttribute('active', '');
    objetiveWSectionButton.setAttribute('active', '');
    return true;
  }


  if(objetiveWSection){
    if(activeWSection){activeWSection.removeAttribute('active');}
    if(activeWSectionButton){activeWSectionButton.removeAttribute('active');}
    objetiveWSection.setAttribute('active', '');
    if(objetiveWSectionButton){objetiveWSectionButton.setAttribute('active', '');}
  }
  return true;
}

function changeWindow(windowId){
  toggleWindow();
  setTimeout(function() {
    toggleWindow(windowId);
  },520);
}


function toggleOvermessage(overId){
  if (overId == ''){overId = null}

  // const currentWindow = document.querySelector(getStorage("currentWindow")); 
  const currentWindow = document.querySelector('transparent window.active');

  // Close
  const activeOvermessage = currentWindow.querySelector(".overmessage.active");
  function closingAnimation() {
    if (activeOvermessage.hasAttribute("closing")) {
      activeOvermessage.classList.remove('active');
      activeOvermessage.removeAttribute("closing");
    }
  }
  if (activeOvermessage) {
    activeOvermessage.setAttribute("closing", "");
    activeOvermessage.addEventListener("animationend", () =>{closingAnimation()}, {once: true})
    return;
  }
  if (activeOvermessage) {
    if (activeOvermessage.hasAttribute("closing") && activeOvermessage.classList.contains("active")) {
      activeOvermessage.removeAttribute("closing");
    }
  }
  

  // Open
  const overmessage = currentWindow.querySelector(overId);
  if(!overmessage){ return; }
  overmessage.classList.add("active");

}

function toggleSubSection(subSectionId, options = { exclusive: false, hardExclusive: false, action: null }) {
    const currentMainSection = document.querySelector('section[active]');
    const subSection = document.querySelector(subSectionId);

    const mainParent = subSection.parentElement;
    var activeContent = mainParent.querySelectorAll(':scope > *:not([data-sub-section]:not([active]))');
    activeContent = Array.from(activeContent).filter(element => element !== subSection);

    if (options.exclusive) {
        // Close any other active subsections
        let activeSubSections = currentMainSection.querySelectorAll(`[data-sub-section][active]`);
        if (options.hardExclusive) activeSubSections = [...document.querySelectorAll(`[data-sub-section][active][data-allow-hard-exclusive]`)];
        activeSubSections.forEach(section => {
            if (section.id != subSection.id) {
                section.toggleAttribute('sub-section-in-animation-out');
                section.addEventListener("animationend", () => {
                    section.removeAttribute('sub-section-in-animation-out');
                    section.removeAttribute('active');
                }, { once: true });
            }
        });
    }

    // If we try to open the already active subsection, dont do anything
    if (subSection.hasAttribute("active") && options.action === "open") return false;
    
    // --- FIX STARTS HERE ---
    // If we try to close an already closed subsection, dont do anything
    if (!subSection.hasAttribute("active") && options.action === "close") return false;
    // --- FIX ENDS HERE ---


    if (options.animationType) {
        if (options.animationType === "from-origin") {
            let eventOriginState;
            if (options.customOrigin) {
                eventOriginState = Flip.getState(options.customOrigin);
            } else if (event && event.currentTarget) {
                eventOriginState = Flip.getState(event.currentTarget);
            }

            subSection.toggleAttribute("active");
            subSection.setAttribute("sub-section-simple-in-animation", "");

            Flip.from(eventOriginState, {
                ease: CustomEase.create("custom", "M0,0 C0.308,0.19 0.107,0.633 0.288,0.866 0.382,0.987 0.656,1 1,1 "),
                targets: subSection,
                duration: 0.7,
                toggleClass: "apply-blur-animation-2",
                scale: true,
                onComplete: () => { subSection.removeAttribute("sub-section-simple-in-animation") }
            }).play();
        }
        return;
    }

    if (subSection.hasAttribute('active')) {
        // Close the subsection
        subSection.toggleAttribute('sub-section-in-animation-out');
        subSection.addEventListener("animationend", () => {
            subSection.removeAttribute('sub-section-in-animation-out');

            const activeContentState = Flip.getState(activeContent);
            subSection.removeAttribute('active');

            Flip.from(activeContentState, {
                ease: CustomEase.create("easeName", "0.38,0.49,0,1"),
                duration: .3,
                simple: true,
                absolute: false,
            }).play();

        }, { once: true });
    } else {
        // Open the subsection
        subSection.toggleAttribute('active');
        subSection.toggleAttribute('sub-section-in-animation');
        subSection.addEventListener("animationend", () => {
            subSection.removeAttribute('sub-section-in-animation');
        }, { once: true });
    }
}


// function toggleSubSection(subSectionId, options = {exclusive: false, hardExclusive: false}){
//   const currentMainSection = document.querySelector('section[active]');
//   const subSection = document.querySelector(subSectionId);
  
//   const mainParent = subSection.parentElement;
//   var activeContent = mainParent.querySelectorAll(':scope > *:not([data-sub-section]:not([active]))');
//   activeContent = Array.from(activeContent).filter(element => element !== subSection);
//   // console.log(activeContent);
  
  
//   if(options.exclusive) {
//     // Close any other active subsections
//     let activeSubSections = currentMainSection.querySelectorAll(`[data-sub-section][active]`);
//     if(options.hardExclusive) activeSubSections = [...document.querySelectorAll(`[data-sub-section][active][data-allow-hard-exclusive]`)];
//     activeSubSections.forEach(section => {
//       if(section.id != subSection.id) {
        
//         section.toggleAttribute('sub-section-in-animation-out');
//         section.addEventListener("animationend", () => { 
//           section.removeAttribute('sub-section-in-animation-out');
//           section.removeAttribute('active');
//         }, {once: true});
//       }
//     });
//   }
//   // const desireSubSectionState = Flip.getState(subSection); close
//   // const eventOriginState = Flip.getState(event.currentTarget);

//   // If we try to open the already active subsection, dont do anything
//   if(subSection.hasAttribute("active") && options.action === "open") return false;

//   if(options.animationType) {
//     if(options.animationType === "from-origin" && event.currentTarget){
//       if(options.customOrigin){
//         var eventOriginState = Flip.getState(options.customOrigin);
//       }else{
//         var eventOriginState = Flip.getState(event.currentTarget);
//       }
      

//       subSection.toggleAttribute("active");
//       subSection.setAttribute("sub-section-simple-in-animation", "");
      
//       Flip.from(eventOriginState, {
//         ease: CustomEase.create("custom", "M0,0 C0.308,0.19 0.107,0.633 0.288,0.866 0.382,0.987 0.656,1 1,1 "),
//         // ease: CustomEase.create("easeName", "0.38,0.49,0,1"),
//         targets: subSection,
//         duration: 0.7,
//         toggleClass: "apply-blur-animation-2",
//         scale:true,
//         onComplete: () => {subSection.removeAttribute("sub-section-simple-in-animation")}
//       }).play();

      
      
//     }
//     // console.log("hello")
//     return;
//   }
  

//   if(subSection.hasAttribute('active')){
    
//     subSection.toggleAttribute('sub-section-in-animation-out');
//     subSection.addEventListener("animationend", () => { 
//       subSection.removeAttribute('sub-section-in-animation-out');

//       const activeContentState = Flip.getState(activeContent);
//       subSection.removeAttribute('active');

//        Flip.from(activeContentState, {
//           // ease: CustomEase.create("custom", "M0,0 C0.308,0.19 0.107,0.633 0.288,0.866 0.382,0.987 0.656,1 1,1 "),
//           ease: CustomEase.create("easeName", "0.38,0.49,0,1"),
//           // ease: CustomEase.create("custom", "M0,0 C0.249,-0.124 0.04,0.951 0.335,1 0.684,1.057 0.614,0.964 1,1"),
//           // ease: CustomEase.create("custom", "M0,0 C0.298,0 0.261,0.696 0.419,0.91 0.575,1.121 0.736,0.972 1,1 "),
//           // targets: subSections,
//           duration: .3,
//           // scale:true,
//           // toggleClass: "apply-blur-animation-2",
//           simple:true,
//           absolute:false,
//         }).play();

//     }, {once: true});
//   }else{
//     // Open the subsection
//     subSection.toggleAttribute('active');
//     subSection.toggleAttribute('sub-section-in-animation');
//     subSection.addEventListener("animationend", () => { 
//       subSection.removeAttribute('sub-section-in-animation');
//     }, {once: true});
//   }

  

  


  



//   // Flip.from(activeContentState, {
//   //   // ease: CustomEase.create("custom", "M0,0 C0.308,0.19 0.107,0.633 0.288,0.866 0.382,0.987 0.656,1 1,1 "),
//   //   // ease: CustomEase.create("easeName", "0.38,0.49,0,1"),
//   //   ease: CustomEase.create("custom", "M0,0 C0.249,-0.124 0.04,0.951 0.335,1 0.684,1.057 0.614,0.964 1,1"),
//   //   // ease: CustomEase.create("custom", "M0,0 C0.298,0 0.261,0.696 0.419,0.91 0.575,1.121 0.736,0.972 1,1 "),
//   //   // targets: subSections,
//   //   duration: 1,
//   //   scale:true,
//   //   // toggleClass: "apply-blur-animation-2",
//   //   simple:true,
//   //   // absolute:true,
//   // }).play();

//   // Flip.from(eventOriginState, {
//   //   ease: CustomEase.create("custom", "M0,0 C0.308,0.19 0.107,0.633 0.288,0.866 0.382,0.987 0.656,1 1,1 "),
//   //   // ease: CustomEase.create("easeName", "0.38,0.49,0,1"),
//   //   targets: subSection,
//   //   duration: 0.7,
//   //   toggleClass: "apply-blur-animation-2",
//   //   scale:true,
//   //   // simple:true,
//   // }).play();

  


// }

function flowStep(step, parent = document, animations = true){
  const currentOpenStep = parent.querySelector("[data-step][active]");
  if(currentOpenStep){
    if(animations) {
      const lastItem = currentOpenStep.children[currentOpenStep.children.length - 1];
      flowChildsOut(currentOpenStep, {animationVariant: "-bottom"});
      lastItem.addEventListener("animationend", () => {
        currentOpenStep.removeAttribute("active");
        const newStep = parent.querySelector(`[data-step='${step}']`);
        newStep.setAttribute("active", "");
        flowChilds(newStep);
      }, {once: true});
    } else {
      // Skip animations and update directly
      currentOpenStep.removeAttribute("active");
      const newStep = parent.querySelector(`[data-step='${step}']`);
      newStep.setAttribute("active", "");
      // Make all children visible immediately
      Array.from(newStep.children).forEach(el => {
        el.style.opacity = 1;
      });
    }
  } else {
    // No current step, just open the new one
    const newStep = parent.querySelector(`[data-step='${step}']`);
    if(newStep) {
      newStep.setAttribute("active", "");
      if(animations) {
        flowChilds(newStep);
      } else {
        Array.from(newStep.children).forEach(el => {
          el.style.opacity = 1;
        });
      }
    }
  }
}

function flowChilds(parent, options = {startOpacity: 0, animationVariant: "", betweenDelay: 0.05, keepAnimation: false, target: false}){
  options.startOpacity = options.startOpacity || 0;
  options.animationVariant = options.animationVariant || "";
  options.betweenDelay = options.betweenDelay || 0.05;
  options.keepAnimation = options.keepAnimation || false;
  options.target = options.target || false;

  // Select elements based on options.target if provided, otherwise use direct children
  const elements = options.target 
    ? Array.from(parent.querySelectorAll(options.target)) 
    : Array.from(parent.children);

  elements.forEach((el, index) => {
      // check if the element has any other animation on him, here we would need to specify the animation variants
      el.classList.remove("animation-item-out-bottom");

      el.style.opacity = options.startOpacity;
      el.style.animationDelay = `${index * options.betweenDelay}s`; // Retraso de 0.2s por elemento
      el.classList.add(`search-result-item-in${options.animationVariant}`); // Agrega la clase que activa la animación
      el.addEventListener("animationend", () => {
          if(!options.keepAnimation){
            el.classList.remove(`search-result-item-in${options.animationVariant}`)
            el.style.opacity = 1;
          }
          // el.classList.remove(`search-result-item-in${options.animationVariant}`)
      }, {once: true})
  });
}

function flowChildsOut(parent, options = {startOpacity: 0, animationVariant: "", betweenDelay: 0.05}){
  options.startOpacity = options.startOpacity || 1;
  options.animationVariant = options.animationVariant || "";
  options.betweenDelay = options.betweenDelay || 0.05;

  const parentLastChild = parent.querySelector(":last-child");

  Array.from(parent.children).forEach((el, index) => {
      
    el.style.opacity = options.startOpacity;
    el.style.animationDelay = `${index * options.betweenDelay}s`; // Retraso de 0.2s por elemento
    el.classList.add(`animation-item-out${options.animationVariant}`); // Agrega la clase que activa la animación
    el.addEventListener("animationend", () => {
        el.classList.remove(`animation-item-out${options.animationVariant}`)
        el.style.opacity = "0"
    }, {once: true})

  });

  parentLastChild.addEventListener("animationend", () => {
    Array.from(parent.children).forEach((el, index) => {
      el.style.opacity = options.startOpacity;
    });
  }, {once: true})


}

function htmlspecialchars(value){
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}


// function lazyLoad(){

// }

function convertUTCToLocal(utcDateString) {
  // Create a Date object from the UTC string
  const utcDate = new Date(utcDateString.replace(' ', 'T') + 'Z');

  // Use Intl.DateTimeFormat to format the date in the user's local timezone
  // This automatically handles DST and other timezone rules.
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Use 24-hour format
  };

  // The 'undefined' locale will use the browser's default locale
  const formattedDate = new Intl.DateTimeFormat(undefined, options).format(utcDate);

  // The result from format() may have parts in a different order, so we re-format it
  const parts = new Intl.DateTimeFormat(undefined, options).formatToParts(utcDate);
  const year = parts.find(part => part.type === 'year').value;
  const month = parts.find(part => part.type === 'month').value;
  const day = parts.find(part => part.type === 'day').value;
  const hour = parts.find(part => part.type === 'hour').value;
  const minute = parts.find(part => part.type === 'minute').value;
  const second = parts.find(part => part.type === 'second').value;

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function getNaturalDate(date, onlyNatural = false) {
  const now = new Date();
  const dateObj = new Date(date);
  
  // Reset hours to compare only dates
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const compareDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  
  // Calculate difference in days
  const timeDiff = compareDate - today;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  // Weekday names in Spanish
  const weekdays = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const weekdayName = weekdays[dateObj.getDay()];
  
  // Special cases
  if (daysDiff === 0) {
    return 'Hoy';
  } else if (daysDiff === 1) {
    return 'Mañana';
  } else if (daysDiff === -1) {
    return 'Ayer';
  } else if (daysDiff === 2) {
    return 'Pasado mañana';
  } else if (daysDiff === -2) {
    return 'Anteayer';
  }
  
  // For dates in the same week
  if (daysDiff > 0 && daysDiff <= 6) {
    return `Este ${weekdayName}`;
  } else if (daysDiff < 0 && daysDiff >= -6) {
    return `El ${weekdayName} pasado`;
  }
  
  // For next week
  if (daysDiff > 6 && daysDiff <= 13) {
    return `El próximo ${weekdayName}`;
  } else if (daysDiff < -6 && daysDiff >= -13) {
    return `El ${weekdayName} de la semana pasada`;
  }
  
  // For distant dates - only return if not onlyNatural mode
  if (onlyNatural) {
    return null; // Don't return typical dates when onlyNatural is true
  }
  
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  const currentYear = now.getFullYear();
  
  if (year === currentYear) {
    return `${day} de ${month}`;
  } else {
    return `${day} de ${month} de ${year}`;
  }
}

function buildPagination(paginationData, page, container, actionFunction, additionalParams = {}){
  const totalRows = paginationData.total_rows;
  const limit = paginationData.limit;

  const pageCount = Math.ceil(totalRows / limit);
  if(pageCount <= 1){container.innerHTML = ""; return;}

  const currentPage = page;

  // Determine pages to display
  const pagesToShow = new Set();
  pagesToShow.add(0); // First page
  const rangeStart = Math.max(0, currentPage - 2);
  const rangeEnd = Math.min(pageCount - 1, currentPage + 2);
  for (let i = rangeStart; i <= rangeEnd; i++) pagesToShow.add(i);
  pagesToShow.add(pageCount - 1); // Last page
  // Generate sorted array of pages
  const pagesArray = Array.from(pagesToShow).sort((a, b) => a - b);
  // Build HTML with ellipsis where needed
  let paginationHTML = `<span class='user-select-none simple-container width-100 flex-wrap gap-4' style='overflow:auto;content-visibility: auto;'>`;
  let previousPage = null;
  for (const pageNumber of pagesArray) {
      if (previousPage !== null && pageNumber - previousPage > 1) {
          paginationHTML += `<span class="pagination-ellipsis" style="display: inline-flex;align-items: center;padding: 0 8px;color: #666;">...</span>`;
      }
      if (pageNumber === currentPage) {
          paginationHTML += `<button class="style-2" active data-page='${pageNumber}'>${pageNumber + 1}</button>`;
      } else {
          paginationHTML += `<button class="style-2" style="content-visibility: auto;" data-page='${pageNumber}'>${pageNumber + 1}</button>`;
      }
      previousPage = pageNumber;
  }
  paginationHTML += `</span>`;

  // Set in DOM
  container.innerHTML = paginationHTML;

  const buttons = container.querySelectorAll("[data-page]");
  buttons.forEach(button => {
      button.addEventListener("click", async () => {
          const newPage = parseInt(button.getAttribute("data-page"));
          
          button.disabled = true;
          
          await actionFunction(newPage, ...Object.values(additionalParams));

          button.disabled = false;

          // document.querySelector("section[active]").scrollTo({top:0,behavior:'smooth'})
      })
  })
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Optional: Show feedback that the link was copied
        message("Copiado al portapapeles", "success");
    }).catch(err => {
        console.error('Error al copiar el enlace: ', err);
    });
}

function fillForm(form, data, skipFields = []){
  if(!form || !data) return;

  // Fill inputs and standard form elements
  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach(input => {
    const name = input.name || input.id;
    if(name && data[name] !== undefined && !skipFields.includes(name)){
      if(input.type === "checkbox" || input.type === "radio"){
        input.checked = data[name];
      }else{
        input.value = data[name];
      }
    }
  });

  // Fill other elements like md-select
  const selects = form.querySelectorAll("md-select");
  selects.forEach(select => {
    const name = select.getAttribute("name") || select.id;
    if(name && data[name] !== undefined && !skipFields.includes(name)){
      select.value = data[name];
    }
  });

  // Fill any element with a name attribute (like spans, divs, etc.)
  const namedElements = form.querySelectorAll("[name]");
  namedElements.forEach(element => {
    // Skip inputs, selects and textareas which were already handled
    if(element.tagName === "INPUT" || element.tagName === "SELECT" || element.tagName === "TEXTAREA" || 
       element.tagName === "MD-SELECT") return;
    
    const name = element.getAttribute("name");
    if(name && data[name] !== undefined && !skipFields.includes(name)){
      element.textContent = data[name];
    }
  });
}

function mdSelect(element, value) {
  // Handle if element is a string selector
  const selectElement = typeof element === 'string' ? document.querySelector(element) : element;
  
  // Ensure we have a valid element
  if (!selectElement) return;
  
  // For standard select elements
  if (selectElement.tagName.toLowerCase() === 'select') {
    const optionIndex = Array.from(selectElement.options).findIndex(option => option.value == value);
    selectElement.selectedIndex = optionIndex >= 0 ? optionIndex : 0;
  } 
  // For Material Design select elements
  else if (selectElement.tagName.toLowerCase().startsWith('md-')) {
    // Material components might store options differently
    const options = Array.from(selectElement.querySelectorAll('md-select-option, option'));
    const optionIndex = options.findIndex(option => option.value == value);
    selectElement.selectedIndex = optionIndex >= 0 ? optionIndex : 0;
  }
  
  // Trigger a change event to ensure the UI updates
  selectElement.dispatchEvent(new Event('change', { bubbles: true }));
}