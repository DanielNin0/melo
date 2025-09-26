import subscriptionService from "./../services/subscriptionService.js";

const SubscriptionManager = (() => {

    async function openSubscriptionSubSection(){
        toggleSubSection("#sub-section-subscription", {animationType: 'from-origin'});
        // toggleSubSection("#sub-section-subscription");
        getSubscriptions();
        getInvoices();
    }
    function closeSubscriptionSubSection(){
        toggleSubSection("#sub-section-subscription");
    }

    async function getSubscriptions(page = 0){
        if(event.target) event.target.disabled = true
        subscriptionsTableContainer.innerHTML = "<md-linear-progress indeterminate></md-linear-progress>";
        const subscriptions = await subscriptionService.getSubscriptions({page});
        subscriptionsTableContainer.innerHTML = "";
        displaySubscriptionsTable(subscriptions, page);
    }

    async function getInvoices(page = 0){
        if(event.target) event.target.disabled = true
        invoicesTableContainer.innerHTML = "<md-linear-progress indeterminate></md-linear-progress>";
        const invoices = await subscriptionService.getInvoices({page});
        invoicesTableContainer.innerHTML = "";
        displayInvoicesTable(invoices, page);
       
       
    }


    const subscriptionSubSection = document.getElementById("sub-section-subscription");
    if(!subscriptionSubSection) return;

    const subscriptionsTableContainer = subscriptionSubSection.querySelector("[name='table-subscriptions']");
    const subscriptionTablePagination = subscriptionsTableContainer.nextElementSibling;


    const invoicesTableContainer = subscriptionSubSection.querySelector("[name='table-invoices']");
    const invoicesTablePagination = invoicesTableContainer.nextElementSibling;

    console.log(subscriptionsTableContainer);
    console.log(invoicesTableContainer);


    function displaySubscriptionsTable(data, page=0){
        if(!subscriptionsTableContainer) return;

        const fragment = document.createDocumentFragment();
        const rows = buildSubscriptionsTable(data.data, page);
        rows.forEach(row => fragment.appendChild(row));
        subscriptionsTableContainer.appendChild(fragment);

        buildPagination(data.pagination, page);
        flowChilds(subscriptionsTableContainer)
    }
    function buildSubscriptionsTable(data){
        const rows = [];
        if(!data || data.length <= 0){
            const row = document.createElement("div");
            row.className = "content-box align-center justify-center user-select-none";
            row.innerHTML = `<span class="body-large outline-text">No tienes ninguna suscripción registrada</span>`;
            rows.push(row);
            return rows;
        };

        data.forEach(subscription => {

            let statusClass, statusText, statusIcon, button, product;
            if(subscription.subscription_status === "active" || subscription.subscription_status === "trialing"){
                statusClass = "primary-container on-primary-container-text";
                statusText = "Activa";
                statusIcon = "check_circle";
                button = `<md-filled-button class="small inter" href="https://billing.stripe.com/p/login/6oE3dAavAg4l6Ag000?prefilled_email=${subscription.customer_email}" target="_blank">Administrar suscripción</md-filled-button>`
            }else if(subscription.subscription_status === "canceled"){
                statusClass = "error-container on-error-container-text";
                statusText = "Cancelada";
                statusIcon = "cancel";
                // button = `<md-filled-button class="small inter" href="./../../paymentcheckout" target="_blank">Renovar suscripción</md-filled-button>`
                button = ``
            }
            if(subscription.amount_total == "0.00"){
                product = "Prueba gratuita de 30 días";
            } else {
                product = "Suscripción de Melon Mind";
            }

            const row = document.createElement("div");
            row.innerHTML = `
                <div class="content-box border-radius-16 gap-0 padding-0 light-color overflow-hidden outline-light-1">
                    <div class="content-box direction-row padding-16 gap-16 border-radius-4 align-center">
                        <div class="simple-container">
                            <div class="simple-container user-select-none body-large align-center gap-4 padding-4 h-padding-8 border-radius-8 ${statusClass}">
                                <md-icon class="filled dynamic">${statusIcon}</md-icon>
                                <span class="weight-500">${statusText}</span>
                            </div>
                        </div>
                        <span class="body-large weight-500">${product}</span>
                    </div>

                    
                    <div class="simple-container padding-16 gap-24 flex-wrap">

                        <div class="simple-container direction-column gap-4">
                            <span class="label-medium outline-text">Periodo</span>
                            <div class="simple-container">
                                <div class="simple-container outline-light-1 body-medium align-center gap-4 padding-4 h-padding-8 border-radius-8 surface">
                                    <span>${dateToPrettyDate(subscription.current_period_start, true)}</span>
                                </div>
                                <md-icon class="dynamic">arrow_right_alt</md-icon>
                                <div class="simple-container outline-light-1 body-medium align-center gap-4 padding-4 h-padding-8 border-radius-8 surface">
                                    <span>${dateToPrettyDate(subscription.current_period_end, true)}</span>
                                </div>
                            </div>
                        </div>

                        <div class="simple-container direction-column gap-4">
                            <span class="label-medium outline-text">Monto</span>
                            <span class="body-large">€${subscription.amount_total} </span>
                        </div>

                        <div class="simple-container direction-column gap-4">
                            <span class="label-medium outline-text">Id de suscripción</span>
                            <span class="body-large">${subscription.stripe_subscription_id}</span>
                        </div>

                        <div class="simple-container direction-column gap-4">
                            <span class="label-medium outline-text">Correo ingresado</span>
                            <span class="body-large">${subscription.customer_email}</span>
                        </div>
                    </div>

                    <div class="simple-container gap-8 flex-wrap padding-16 t-padding-0">
                        ${button}
                    </div>
                </div>
            `;
            rows.push(row);
        });
        return rows;
    }

    function displayInvoicesTable(data, page=0){
        if(!invoicesTableContainer) return;

        const fragment = document.createDocumentFragment();
        const rows = buildInvoicesTable(data.data);
        rows.forEach(row => fragment.appendChild(row));
        invoicesTableContainer.appendChild(fragment);

        buildPagination(data.pagination, page, "invoices");
        flowChilds(invoicesTableContainer)
    }
    function buildInvoicesTable(data){
        const rows = [];
        if(!data || data.length <= 0){
            const row = document.createElement("div");
            row.className = "content-box align-center justify-center user-select-none";
            row.innerHTML = `<span class="body-large outline-text">No tienes ninguna factura registrada</span>`;
            rows.push(row);
            return rows;
        };

        data.forEach(invoice => {

            let billingReason;
            if(invoice.billing_reason === "subscription_create"){
                billingReason = "Suscripción";
            }else if(invoice.billing_reason === "subscription_cycle"){
                billingReason = "Renovación";
            }

            const row = document.createElement("div");
            row.innerHTML = `
            <div class="content-box border-radius-16 gap-0 padding-0 light-color overflow-hidden outline-light-1">
                    <div class="content-box direction-row padding-16 gap-16 border-radius-4 align-center">
                        <div class="simple-container">
                            <div class="simple-container user-select-none body-large align-center gap-4 padding-4 h-padding-8 border-radius-8">
                                <span class="weight-500">€${invoice.amount_paid}</span>
                            </div>
                        </div>
                        <span class="body-large weight-500">
                            <div class="simple-container outline-light-1 body-medium align-center gap-4 padding-4 h-padding-8 border-radius-8 surface">
                                <span>${dateToPrettyDate(invoice.invoice_date, true)}</span>
                            </div>
                        </span>
                        <div class="simple-container">
                            <div class="simple-container user-select-none body-medium outline-text">
                                <span class="weight-500">${billingReason}</span>
                            </div>
                        </div>
                    </div>

                    
                    <div class="simple-container padding-16 gap-24 flex-wrap">
                        <div class="simple-container direction-column gap-4">
                            <span class="label-medium outline-text">Id de suscripción</span>
                            <span class="body-large">${invoice.invoice_stripe_subscription_id}</span>
                        </div>

                        <div class="simple-container direction-column gap-4">
                            <span class="label-medium outline-text">Id de factura</span>
                            <span class="body-large">${invoice.invoice_stripe_invoice_id}</span>
                        </div>

                    </div>

                    <div class="simple-container gap-8 flex-wrap padding-16 t-padding-0">
                        <md-outlined-button class="small inter" href="${invoice.invoice_pdf_url}" target="_blank">Descargar factura</md-outlined-button>
                        <md-filled-tonal-button class="small inter solid" href="${invoice.hosted_invoice_url}" target="_blank">Ver más detalles</md-filled-tonal-button>
                    </div>
                </div>
            `;
            rows.push(row);
        });
        return rows;
    }

    function buildPagination(paginationData, page, dataType = "subscriptions") {
        const totalRows = paginationData.total_rows;
        const limit = paginationData.limit;
    
        const pageCount = Math.ceil(totalRows / limit);
        if (pageCount <= 1) {
            if (dataType === "users") usersTablePagination.innerHTML = "";
            if (dataType === "access") pageAccessTablePagination.innerHTML = "";
            if (dataType === "suggestions") suggestionsTablePagination.innerHTML = "";
            return;
        }
    
        const currentPage = page; // 0-based
    
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
        let paginationHTML = `<span class='user-select-none simple-container width-100 flex-wrap members-table-rows' style='min-height:48px;max-height:80px;overflow:auto;content-visibility: auto;'>`;
        let previousPage = null;
    
        for (const pageNumber of pagesArray) {
            if (previousPage !== null && pageNumber - previousPage > 1) {
                paginationHTML += `<span class="pagination-ellipsis" style="display: inline-flex;align-items: center;padding: 0 8px;color: #666;">...</span>`;
            }
    
            if (pageNumber === currentPage) {
                paginationHTML += `<md-filled-icon-button data-page='${pageNumber}'>${pageNumber + 1}</md-filled-icon-button>`;
            } else {
                paginationHTML += `<md-icon-button style="content-visibility: auto;" data-page='${pageNumber}'>${pageNumber + 1}</md-icon-button>`;
            }
    
            previousPage = pageNumber;
        }
        paginationHTML += `</span>`;
    
        // Update DOM and add event listeners
        let paginationContainer;
        if (dataType === "subscriptions") {
            paginationContainer = subscriptionTablePagination;
        } else if (dataType === "invoices") {
            paginationContainer = invoicesTablePagination;
        }
        paginationContainer.innerHTML = paginationHTML;
    
        const buttons = paginationContainer.querySelectorAll("[data-page]");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const newPage = parseInt(button.getAttribute("data-page"));
                let changePage;
                if (dataType === "subscriptions") {
                    changePage = getSubscriptions;
                } else if (dataType === "invoices") {
                    changePage = getInvoices;
                } 
                changePage(newPage);
            });
        });
    }



    return {
        openSubscriptionSubSection,
        closeSubscriptionSubSection
    }

})();

export default SubscriptionManager;