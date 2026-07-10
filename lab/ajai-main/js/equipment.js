// Equipment Approvals Redesigned Controller

document.addEventListener("DOMContentLoaded", () => {
    let db = getDB();

    const cardsGrid = document.getElementById("trackingCardsGrid");
    const searchInput = document.getElementById("teamSearchInput");
    const statusFilter = document.getElementById("teamStatusFilter");
    const labFilter = document.getElementById("teamLabFilter");
    const clearFiltersBtn = document.getElementById("clearTeamFilters");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");
    const paginationInfo = document.getElementById("paginationInfo");

    const ITEMS_PER_PAGE = 3;
    let currentPage = 1;

    function getTeamOverallStatus(requests) {
        if (requests.some(r => r.status === "Pending")) {
            return "pending";
        }
        if (requests.every(r => r.status === "Rejected")) {
            return "rejected";
        }
        return "approved";
    }

    function updateKPIs(requests) {
        let total = 0;
        let pending = 0;
        let approved = 0;
        let rejected = 0;

        requests.forEach(team => {
            (team.requests || []).forEach(req => {
                total++;
                if (req.status === "Pending") pending++;
                else if (req.status === "Approved" || req.status === "Handovered") approved++;
                else if (req.status === "Rejected") rejected++;
            });
        });

        const totalEl = document.getElementById("kpiTotalTeams");
        const pendingEl = document.getElementById("kpiPendingTeams");
        const approvedEl = document.getElementById("kpiApprovedTeams");
        const rejectedEl = document.getElementById("kpiRejectedTeams");

        if (totalEl) totalEl.textContent = total;
        if (pendingEl) pendingEl.textContent = pending;
        if (approvedEl) approvedEl.textContent = approved;
        if (rejectedEl) rejectedEl.textContent = rejected;
    }

    function renderCards() {
        db = getDB();
        const requests = db.equipmentRequests || [];

        // Update KPIs based on the full unfiltered requests database
        updateKPIs(requests);

        // Apply filters
        const query = (searchInput.value || "").trim().toLowerCase();
        const statusVal = statusFilter.value;
        const labVal = labFilter.value;

        const filtered = requests.filter(team => {
            // 1. Search filter: Match teamId, teamName, or individual request equipmentName
            const matchesSearch = !query ||
                (team.teamId || "").toLowerCase().includes(query) ||
                (team.teamName || "").toLowerCase().includes(query) ||
                (team.requests || []).some(r =>
                    (r.equipmentName || "").toLowerCase().includes(query) ||
                    (r.equipmentId || "").toLowerCase().includes(query)
                );

            // 2. Status filter
            const overallStatus = getTeamOverallStatus(team.requests);
            const matchesStatus = statusVal === "all" || overallStatus === statusVal;

            // 3. Lab filter (check if any request equipment is located in the selected lab)
            let matchesLab = true;
            if (labVal !== "all") {
                matchesLab = (team.requests || []).some(req => {
                    const invItem = (db.inventory || []).find(item => item.id === req.equipmentId);
                    return invItem && invItem.location === labVal;
                });
            }

            return matchesSearch && matchesStatus && matchesLab;
        });

        // Pagination
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
        if (currentPage > totalPages) currentPage = totalPages;

        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, totalItems);
        const paginatedData = filtered.slice(startIdx, endIdx);

        // Update pagination info
        if (paginationInfo) {
            paginationInfo.textContent = `Showing ${totalItems ? startIdx + 1 : 0}-${endIdx} of ${totalItems} teams`;
        }

        // Enable / Disable Pagination Buttons
        if (prevPageBtn) {
            prevPageBtn.disabled = currentPage === 1;
            prevPageBtn.style.opacity = currentPage === 1 ? "0.5" : "1";
            prevPageBtn.style.cursor = currentPage === 1 ? "not-allowed" : "pointer";
        }
        if (nextPageBtn) {
            nextPageBtn.disabled = currentPage === totalPages;
            nextPageBtn.style.opacity = currentPage === totalPages ? "0.5" : "1";
            nextPageBtn.style.cursor = currentPage === totalPages ? "not-allowed" : "pointer";
        }

        if (totalItems === 0) {
            cardsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #fff; border-radius: 12px; box-shadow: var(--shadow);">
                    <div style="font-size: 48px; margin-bottom: 16px;">📋</div>
                    <h3 style="margin: 0; font-size: 18px; color: #1F2937;">No Equipment Requests Found</h3>
                    <p style="color: #6B7280; margin: 8px 0 0 0;">There are no team requests matching your filter criteria.</p>
                </div>
            `;
            return;
        }

        cardsGrid.innerHTML = paginatedData.map(team => {
            const overallStatus = getTeamOverallStatus(team.requests);
            let badgeClass = "pending";
            if (overallStatus === "approved") badgeClass = "approved";
            if (overallStatus === "rejected") badgeClass = "rejected";

            return `
                <div class="req-card">
                    <div class="card-header">
                        <span class="team-id-badge">${team.teamId}</span>
                        <span class="badge ${badgeClass}">${overallStatus}</span>
                    </div>
                    <div class="card-body">
                        <h3 class="team-name">${team.teamName}</h3>
                        <div style="font-size: 12px; color: #6B7280; margin-top: 8px;">
                            ${team.requests.length} request(s) total
                        </div>
                    </div>
                    <div class="card-actions">
                        <a href="equipment-details.html?teamId=${team.teamId}" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            `;
        }).join("");
    }

    // Set up search and filter event listeners
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            currentPage = 1;
            renderCards();
        });
    }
    if (statusFilter) {
        statusFilter.addEventListener("change", () => {
            currentPage = 1;
            renderCards();
        });
    }
    if (labFilter) {
        labFilter.addEventListener("change", () => {
            currentPage = 1;
            renderCards();
        });
    }
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (statusFilter) statusFilter.value = "all";
            if (labFilter) labFilter.value = "all";
            currentPage = 1;
            renderCards();
        });
    }

    // Set up pagination button click handlers
    if (prevPageBtn) {
        prevPageBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderCards();
            }
        });
    }
    if (nextPageBtn) {
        nextPageBtn.addEventListener("click", () => {
            const totalItems = getFilteredTeamsLength();
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
            if (currentPage < totalPages) {
                currentPage++;
                renderCards();
            }
        });
    }

    function getFilteredTeamsLength() {
        const requests = db.equipmentRequests || [];
        const query = (searchInput.value || "").trim().toLowerCase();
        const statusVal = statusFilter.value;
        const labVal = labFilter.value;

        return requests.filter(team => {
            const matchesSearch = !query ||
                (team.teamId || "").toLowerCase().includes(query) ||
                (team.teamName || "").toLowerCase().includes(query) ||
                (team.requests || []).some(r =>
                    (r.equipmentName || "").toLowerCase().includes(query) ||
                    (r.equipmentId || "").toLowerCase().includes(query)
                );

            const overallStatus = getTeamOverallStatus(team.requests);
            const matchesStatus = statusVal === "all" || overallStatus === statusVal;

            let matchesLab = true;
            if (labVal !== "all") {
                matchesLab = (team.requests || []).some(req => {
                    const invItem = (db.inventory || []).find(item => item.id === req.equipmentId);
                    return invItem && invItem.location === labVal;
                });
            }

            return matchesSearch && matchesStatus && matchesLab;
        }).length;
    }

    renderCards();

    // ─── Equipment Status Management Panel ────────────────────────────────
    const eqStatusList = document.getElementById("eqStatusList");
    const eqStatusEmpty = document.getElementById("eqStatusEmpty");
    const statusSearch = document.getElementById("statusSearchPanel");
    const statusFilterPn = document.getElementById("statusFilterPanel");

    const STATUS_BADGES = {
        "Available": "eq-badge-available",
        "Maintenance": "eq-badge-maintenance",
        "Repairing": "eq-badge-repairing",
        "In Use": "eq-badge-inuse",
        "Retired": "eq-badge-retired"
    };

    function getStatusBadgeClass(status) {
        return STATUS_BADGES[status] || "eq-badge-retired";
    }

    function renderStatusPanel() {
        const freshDb = getDB();
        const items = freshDb.inventory || [];
        const query = (statusSearch ? statusSearch.value : "").trim().toLowerCase();
        const filter = statusFilterPn ? statusFilterPn.value : "all";

        const filtered = items.filter(item => {
            const name = (item.name || item.componentName || "").toLowerCase();
            const id = (item.id || "").toLowerCase();
            const matchesSearch = !query || name.includes(query) || id.includes(query);
            const matchesFilter = filter === "all" || item.status === filter;
            return matchesSearch && matchesFilter;
        });

        if (!eqStatusList) return;

        if (filtered.length === 0) {
            eqStatusList.innerHTML = "";
            if (eqStatusEmpty) eqStatusEmpty.style.display = "";
        } else {
            if (eqStatusEmpty) eqStatusEmpty.style.display = "none";
            eqStatusList.innerHTML = filtered.map(item => {
                const name = item.name || item.componentName || "Unknown";
                const badgeCls = getStatusBadgeClass(item.status || "Available");
                const statusOptions = ["Available", "Maintenance", "Repairing", "In Use", "Retired"]
                    .map(s => `<option value="${s}" ${item.status === s ? "selected" : ""}>${s}</option>`)
                    .join("");
                return `
                  <div class="eq-status-row" data-id="${item.id}">
                    <div class="eq-status-info">
                      <div class="eq-status-name">${name}</div>
                      <div class="eq-status-meta">${item.id || ""} &bull; ${item.location || item.lab || "Lab"} &bull; ${item.type || "Equipment"}</div>
                    </div>
                    <span class="eq-status-badge ${badgeCls}" id="badge-${item.id}">${item.status || "Available"}</span>
                    <select class="eq-status-select" id="sel-${item.id}" onchange="onEqStatusChange('${item.id}', this.value)">
                      ${statusOptions}
                    </select>
                    <button class="eq-save-btn" onclick="saveEqStatus('${item.id}')">Save</button>
                  </div>
                `;
            }).join("");
        }
    }

    window.onEqStatusChange = function (itemId, newStatus) {
        // Live-preview badge colour as user picks a new status
        const badge = document.getElementById("badge-" + itemId);
        if (badge) {
            // Remove all badge classes
            Object.values(STATUS_BADGES).forEach(c => badge.classList.remove(c));
            badge.classList.add(getStatusBadgeClass(newStatus));
            badge.textContent = newStatus;
        }
    };

    window.saveEqStatus = function (itemId) {
        const sel = document.getElementById("sel-" + itemId);
        if (!sel) return;
        const newStatus = sel.value;
        const freshDb = getDB();
        const item = freshDb.inventory.find(i => i.id === itemId);
        if (!item) return;

        const oldStatus = item.status;
        item.status = newStatus;

        // Log notification
        freshDb.notifications = freshDb.notifications || [];
        freshDb.notifications.unshift({
            id: `NTF-${String(freshDb.notifications.length + 1).padStart(3, "0")}`,
            icon: "🔧",
            iconClass: "notif-icon-info",
            body: `Equipment "${item.name || item.componentName}" status changed from ${oldStatus} → ${newStatus} by Lab In-Charge.`,
            time: "Just now",
            unread: true
        });

        setDB(freshDb);
        if (typeof showToast === "function") {
            showToast(`${item.name || item.componentName}: Status updated to "${newStatus}".`, "success");
        }
        renderStatusPanel();
    };

    if (statusSearch) statusSearch.addEventListener("input", renderStatusPanel);
    if (statusFilterPn) statusFilterPn.addEventListener("change", renderStatusPanel);

    renderStatusPanel();
});