async function sendSuggestion(event){
    event.preventDefault();
    const parentId = "#window-send-suggestion";
    if(!checkEmpty(parentId, "input")){return;}
    toggleButton(parentId, true);

    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(part => part.length > 0);
    const penultimateName = pathParts.length >= 2 ? pathParts[pathParts.length - 2] : '';
    
    const data = {
        op: "send_suggestion",
        page_name: penultimateName,
        suggestion: document.getElementById("send-suggestion-suggestion").value,
    }
    const url = `${BASE_URL}back-end/controllers/suggestions.controller.php`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        toggleButton(parentId, false);
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                message("Recibimos tu feedback", "success");
                toggleWindow();
            } else {
                message(`Hubo un error: ${result.message}`, "error");
            }
        } else {
            message("Hubo un error en la solicitud", "error");
        }
    } catch (error) {
        message("Error: " + error.message, "error");
    }
}