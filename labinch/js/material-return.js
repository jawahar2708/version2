// Material Return Page Logic (cards grid, grouping, live drawer calculations, damage enquiry generation)

document.addEventListener("DOMContentLoaded", () => {
    let db = getDB();

    // State
    let currentFilters = {
        status: "All",
        search: ""
    };
    let sortField = "teamId";
    let sortOrder = "asc";
    let currentPage = 1;
    const itemsPerPage = 20;

    // DOM Elements
    const searchInput = document.getElementById("searchReturnsInput");
    const filterTabs = document.querySelectorAll(".filter-tab");
    const tableInfo = document.getElementById("returnsTableInfo");
    const paginationContainer = document.getElementById("returnsPagination");

    // KPI Elements
    const kpiTotal = document.getElementById("kpiTotalReturns");
    const kpiOverdue = document.getElementById("kpiOverdueReturns");
    const kpiReturned = document.getElementById("kpiReturnedCount");

    function updateKPIs() {
        const list = db.materialReturns;
        kpiTotal.textContent = String(list.filter(r => r.status !== "Returned").length).padStart(2, '0');
        kpiOverdue.textContent = String(list.filter(r => r.status === "Overdue").length).padStart(2, '0');
        kpiReturned.textContent = String(list.filter(r => r.status === "Returned").length).padStart(2, '0');
    }

    function getItemIdByName(name, database) {
        const found = database.inventory.find(i => i.name === name);
        return found ? found.id : "EQ-999";
    }

    function getGroupedReturns() {
        const grouped = {};
        db.materialReturns.forEach(r => {
            const tId = r.teamId;
            if (!grouped[tId]) {
                grouped[tId] = {
                    teamId: tId,
                    teamName: r.teamName,
                    items: []
                };
            }
            grouped[tId].items.push(r);
        });
        return Object.values(grouped);
    }

    function renderTable() {
        const container = document.getElementById("returnsGridContainer");
        if (!container) return;

        // Group returns by team
        let groupedData = getGroupedReturns();

        // 1. FILTERING
        let filteredData = groupedData.filter(team => {
            // Check status condition
            let statusMatch = true;
            const statuses = team.items.map(item => item.status);
            const isAllReturned = statuses.every(s => s === "Returned");
            const hasOverdue = statuses.includes("Overdue");
            const hasOutWithTeam = statuses.includes("Assigned") || statuses.includes("Pending") || statuses.includes("Ticket");

            if (currentFilters.status === "Assigned") {
                statusMatch = hasOutWithTeam;
            } else if (currentFilters.status === "Returned") {
                statusMatch = isAllReturned;
            } else if (currentFilters.status === "Overdue") {
                statusMatch = hasOverdue;
            }

            // Check search condition
            const searchLower = currentFilters.search.toLowerCase();
            const searchMatch = team.teamName.toLowerCase().includes(searchLower) ||
                team.teamId.toLowerCase().includes(searchLower) ||
                team.items.some(item => item.item.toLowerCase().includes(searchLower));

            return statusMatch && searchMatch;
        });

        // 2. SORTING (Sort by teamId or teamName)
        filteredData.sort((a, b) => {
            let valA = String(a.teamId).toLowerCase();
            let valB = String(b.teamId).toLowerCase();
            if (sortField === "teamName") {
                valA = String(a.teamName).toLowerCase();
                valB = String(b.teamName).toLowerCase();
            }
            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        // 3. PAGINATION
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

        if (currentPage > totalPages) currentPage = totalPages;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const paginatedData = filteredData.slice(startIndex, endIndex);

        // Render Cards
        if (paginatedData.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; padding: 48px 16px; text-align: center;">
                  <div class="empty-state">
                    <span class="empty-state-icon">↩</span>
                    <span class="empty-state-title">No Return Items Found</span>
                    <p class="empty-state-desc">All caught up! No active team returns match your filter.</p>
                  </div>
                </div>
            `;
            if (tableInfo) tableInfo.textContent = "Showing 0 to 0 of 0 entries";
            renderPagination(1, 1);
            return;
        }

        container.innerHTML = paginatedData.map(team => {
            const statuses = team.items.map(item => item.status);
            const isAllReturned = statuses.every(s => s === "Returned");
            const cardStatus = isAllReturned ? "Returned" : "Pending";
            const badgeClass = isAllReturned ? "status-resolved" : "status-pending";

            // Return IDs for the individual return items
            const returnIds = team.items.map(it => it.id).join(", ");

            const actionText = isAllReturned ? "View Return Details" : "Process Return";
            return `
                <div class="req-card" onclick="openReturnDrawer('${team.teamId}')" style="cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 180px;">
                    <div>
                        <div class="card-header">
                            <span class="badge ${badgeClass}">${cardStatus}</span>
                            <span style="font-size:12px; color:var(--muted-2); font-weight:700;">${returnIds}</span>
                        </div>
                        <div class="card-body" style="margin-bottom: 0;">
                            <div><strong>Team Name</strong> ${team.teamName}</div>
                            <div><strong>Team ID</strong> ${team.teamId}</div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
                        <button class="btn ${isAllReturned ? 'btn-outline' : 'btn-primary'}" style="width: auto; min-width: 150px; font-size: 12.5px; padding: 8px 16px;" onclick="event.stopPropagation(); openReturnDrawer('${team.teamId}')">${actionText}</button>
                    </div>
                </div>
            `;
        }).join("");

        if (tableInfo) {
            tableInfo.textContent = `Showing ${totalItems === 0 ? 0 : startIndex + 1} to ${endIndex} of ${totalItems} entries`;
        }
        renderPagination(currentPage, totalPages);
    }

    function renderPagination(current, total) {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = "";

        // Prev
        const prevItem = document.createElement("li");
        prevItem.className = `page-item ${current === 1 ? 'disabled' : ''}`;
        prevItem.innerHTML = `<button class="page-link" ${current === 1 ? 'disabled' : ''}>&lt;</button>`;
        if (current > 1) {
            prevItem.querySelector("button").addEventListener("click", () => {
                currentPage--;
                renderTable();
            });
        }
        paginationContainer.appendChild(prevItem);

        // Pages
        for (let i = 1; i <= total; i++) {
            const pageItem = document.createElement("li");
            pageItem.className = `page-item ${current === i ? 'active' : ''}`;
            pageItem.innerHTML = `<button class="page-link">${i}</button>`;
            pageItem.querySelector("button").addEventListener("click", () => {
                currentPage = i;
                renderTable();
            });
            paginationContainer.appendChild(pageItem);
        }

        // Next
        const nextItem = document.createElement("li");
        nextItem.className = `page-item ${current === total ? 'disabled' : ''}`;
        nextItem.innerHTML = `<button class="page-link" ${current === total ? 'disabled' : ''}>&gt;</button>`;
        if (current < total) {
            nextItem.querySelector("button").addEventListener("click", () => {
                currentPage++;
                renderTable();
            });
        }
        paginationContainer.appendChild(nextItem);
    }

    // --- Drawer Handlers ---
    let activeTeamId = null;
    let activeTeamItems = [];

    window.openReturnDrawer = function (teamId) {
        db = getDB(); // Refresh local DB
        const grouped = getGroupedReturns();
        const team = grouped.find(t => t.teamId === teamId);
        if (!team) return;

        activeTeamId = teamId;
        activeTeamItems = team.items;

        document.getElementById('drawerTeamName').textContent = team.teamName;
        document.getElementById('drawerTeamId').textContent = team.teamId;

        // Drawer statistics
        const activeReturnsCount = team.items.filter(item => item.status !== "Returned").length;
        const overdueCount = team.items.filter(item => item.status === "Overdue").length;

        document.getElementById('metaActiveReturns').textContent = activeReturnsCount;
        document.getElementById('metaOverdueCount').textContent = overdueCount;

        // Render Table Body
        const tbody = document.getElementById('bodyReturns');
        tbody.innerHTML = '';

        team.items.forEach(item => {
            const itemId = getItemIdByName(item.item, db);

            // Checkbox and quantity initial values
            const isGoodStr = item.status === "Returned" || item.isGood === undefined ? "checked" : (item.isGood ? "checked" : "");
            const returnedCountVal = item.status === "Returned" ? item.qty : (item.returnedQty !== undefined ? item.returnedQty : item.qty);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${itemId}</strong></td>
                <td style="max-width:140px; overflow:hidden; text-overflow:ellipsis;">${item.item}</td>
                <td>${item.qty}</td>
                <td>
                    <input type="number" class="qty-input" 
                           id="qty-return-${item.id}" 
                           min="0" 
                           max="${item.qty}" 
                           value="${returnedCountVal}" 
                           oninput="validateAndRecalculate('${item.id}', ${item.qty})">
                </td>
                <td style="text-align:center;">
                    <input type="checkbox" 
                           style="width: 16px; height: 16px; transform: scale(1.1); accent-color: var(--primary); cursor:pointer;" 
                           id="chk-return-${item.id}" 
                           ${isGoodStr} 
                           onchange="recalculateReturnSummary()">
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Show Drawer
        document.getElementById('drawerOverlay').classList.add('show');
        document.getElementById('returnReviewDrawer').classList.add('show');

        // Initial summary calculation
        recalculateReturnSummary();
    };

    window.closeDrawer = function () {
        document.getElementById('drawerOverlay').classList.remove('show');
        document.getElementById('returnReviewDrawer').classList.remove('show');
        activeTeamId = null;
        activeTeamItems = [];
    };

    window.validateAndRecalculate = function (id, maxQty) {
        const input = document.getElementById(`qty-return-${id}`);
        if (input) {
            let val = parseInt(input.value);
            if (isNaN(val) || val < 0) {
                input.value = 0;
            } else if (val > maxQty) {
                input.value = maxQty;
            }
        }
        recalculateReturnSummary();
    };

    window.recalculateReturnSummary = function () {
        if (!activeTeamId || !activeTeamItems.length) return;

        let totalIssued = 0;
        let totalReturned = 0;
        let totalDamaged = 0;
        let allItemsReturnedSuccessfully = true;

        activeTeamItems.forEach(item => {
            const qtyInput = document.getElementById(`qty-return-${item.id}`);
            const chkInput = document.getElementById(`chk-return-${item.id}`);

            if (qtyInput && chkInput) {
                const isChecked = chkInput.checked;
                const qtyVal = parseInt(qtyInput.value) || 0;

                totalIssued += item.qty;
                totalReturned += qtyVal;

                if (!isChecked) {
                    totalDamaged += 1;
                }

                // Rule for successfully returned: Returned Count equals Issued Count AND checkbox checked.
                const isSuccess = isChecked && (qtyVal === item.qty);
                if (!isSuccess) {
                    allItemsReturnedSuccessfully = false;
                }
            }
        });

        // Update UI summary fields
        document.getElementById('sumIssued').textContent = totalIssued;
        document.getElementById('sumReturned').textContent = totalReturned;
        document.getElementById('sumDamaged').textContent = totalDamaged;

        const sumStatus = document.getElementById('sumStatus');
        const drawerStatusBadge = document.getElementById('drawerStatusBadge');

        const overallStatus = allItemsReturnedSuccessfully ? "Returned" : "Pending";

        sumStatus.textContent = overallStatus;
        drawerStatusBadge.textContent = overallStatus;

        if (overallStatus === "Returned") {
            drawerStatusBadge.className = "badge status-resolved";
        } else {
            drawerStatusBadge.className = "badge status-pending";
        }
    };

    window.submitReturn = function () {
        if (!activeTeamId || !activeTeamItems.length) return;

        let dbNow = getDB();
        let ticketsAdded = 0;

        activeTeamItems.forEach(item => {
            const qtyInput = document.getElementById(`qty-return-${item.id}`);
            const chkInput = document.getElementById(`chk-return-${item.id}`);

            if (qtyInput && chkInput) {
                const returnedQty = parseInt(qtyInput.value) || 0;
                const isGood = chkInput.checked;

                // Find index in main DB list
                const index = dbNow.materialReturns.findIndex(r => r.id === item.id);
                if (index > -1) {
                    // Update the return item details
                    dbNow.materialReturns[index].returnedQty = returnedQty;
                    dbNow.materialReturns[index].isGood = isGood;

                    // If checked and returned qty matches issued qty, the item is Returned.
                    if (isGood && returnedQty === item.qty) {
                        dbNow.materialReturns[index].status = "Returned";
                    } else {
                        // Else it remains Pending/Assigned
                        dbNow.materialReturns[index].status = "Pending";
                    }

                    // If checkbox is NOT checked, treat as Damaged / Faulty
                    if (!isGood) {
                        dbNow.materialReturns[index].ticketRaised = true;
                        // Raise Enquiry ticket
                        const lastTkt = dbNow.tickets.length > 0 ? dbNow.tickets[dbNow.tickets.length - 1] : { id: "TKT-000" };
                        const lastNum = parseInt(lastTkt.id.split('-')[1]) || 0;
                        const nextTktId = "TKT-" + String(lastNum + 1).padStart(3, '0');

                        // Today's date e.g. "09 Jul 2026"
                        const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                        // Due date in 7 days
                        const dueStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

                        const newTicket = {
                            id: nextTktId,
                            type: "Damage",
                            assignedTo: activeTeamId,
                            subject: `${item.item} Damaged`,
                            priority: "High",
                            date: todayStr,
                            status: "Pending",
                            teamName: item.teamName,
                            equipmentName: item.item,
                            raisedBy: "Lab Incharge",
                            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                            damageDescription: `Item returned by team in damaged/faulty condition. Returned Count: ${returnedQty}/${item.qty} units.`,
                            fineAmount: "500",
                            dueDate: dueStr,
                            remarks: "Auto-generated upon material return check-in - flagged for inspection.",
                            teamResponse: "",
                            lastUpdated: `${todayStr}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                        };
                        dbNow.tickets.push(newTicket);
                        ticketsAdded++;
                    }
                }
            }
        });

        // Save DB
        setDB(dbNow);
        db = dbNow; // Sync local variable

        // Show toast
        if (ticketsAdded > 0) {
            showToast(`Return submitted: ${ticketsAdded} item(s) flagged for Damage Ticket.`, "warn");
        } else {
            showToast("Returns submitted and verified successfully!", "success");
        }

        // Close drawer and refresh
        closeDrawer();
        updateKPIs();
        renderTable();
    };

    // --- Search input listener ---
    if (searchInput) {
        searchInput.addEventListener("input", debounce((e) => {
            currentFilters.search = e.target.value.trim();
            currentPage = 1;
            renderTable();
        }, 250));
    }

    // --- Tabs filters selection ---
    filterTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            filterTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentFilters.status = tab.dataset.status;
            currentPage = 1;
            renderTable();
        });
    });

    // Initial load
    updateKPIs();
    renderTable();
});
