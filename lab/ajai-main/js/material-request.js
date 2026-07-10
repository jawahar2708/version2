// Material Request Page Logic (pagination, filtering, sorting, approve/reject)

document.addEventListener("DOMContentLoaded", () => {
    let db = getDB();
    db.materialRequests.forEach(req => {
    if (req.status === "Approved") {
        req.status = "Fully Issued";
    }
});

setDB(db);
console.log(db.materialRequests.map(r => r.status));
    // State
    let currentFilters = {
        status: "All",
        search: ""
    };
    let sortField = "id";
    let sortOrder = "asc";
    let currentPage = 1;
    const itemsPerPage = 20;

    // DOM Elements
    const tableBody = document.getElementById("requestsTableBody");
    const tableInfo = document.getElementById("requestsTableInfo");
    const paginationContainer = document.getElementById("requestsPagination");
    const searchInput = document.getElementById("searchRequestsInput");
    const filterTabs = document.querySelectorAll(".filter-tab");

    // KPI Elements
    const kpiTotal = document.getElementById("kpiTotalRequests");
    const kpiPending = document.getElementById("kpiPendingRequests");
    const kpiApproved = document.getElementById("kpiApprovedRequests");
function updateKPIs() {

    const list = db.materialRequests;

    kpiTotal.textContent =
        String(list.length).padStart(2, "0");

    kpiPending.textContent =
        String(
            list.filter(r =>
                r.status === "Partially Issued"
            ).length
        ).padStart(2, "0");

    kpiApproved.textContent =
        String(
            list.filter(r =>
                r.status === "Fully Issued"
            ).length
        ).padStart(2, "0");
}

    function renderTable() {
        tableBody.innerHTML = `
      <tr>
        <td class="skeleton" style="height: 48px; border-bottom: 8px solid white;"></td>
        <td class="skeleton" style="height: 48px; border-bottom: 8px solid white;"></td>
        <td class="skeleton" style="height: 48px; border-bottom: 8px solid white;"></td>
        <td class="skeleton" style="height: 48px; border-bottom: 8px solid white;"></td>
        <td class="skeleton" style="height: 48px; border-bottom: 8px solid white;"></td>
        <td class="skeleton" style="height: 48px; border-bottom: 8px solid white;"></td>
        <td class="skeleton" style="height: 48px; border-bottom: 8px solid white;"></td>
      </tr>
    `;

        setTimeout(() => {
            // 1. FILTERING
            let filteredData = db.materialRequests.filter(item => {
                const matchesStatus = currentFilters.status === "All" || item.status === currentFilters.status;
                const matchesSearch = item.teamName.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                    item.id.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                    item.item.toLowerCase().includes(currentFilters.search.toLowerCase());
                return matchesStatus && matchesSearch;
            });

            // 2. SORTING
            filteredData.sort((a, b) => {
                let valA = String(a[sortField]).toLowerCase();
                let valB = String(b[sortField]).toLowerCase();

                if (sortField === "qty") {
                    valA = Number(a[sortField]);
                    valB = Number(b[sortField]);
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

            // Render Rows
            if (paginatedData.length === 0) {
                tableBody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 48px 16px;">
              <div class="empty-state">
                <span class="empty-state-icon">&#9998;</span>
                <span class="empty-state-title">No Requests Found</span>
                <p class="empty-state-desc">No requests match the current filters.</p>
              </div>
            </td>
          </tr>
        `;
                tableInfo.textContent = "Showing 0 to 0 of 0 entries";
                renderPagination(1, 1);
                return;
            }

            tableBody.innerHTML = paginatedData.map(req => {
               let badgeClass = "status-progress";

if (req.status === "Partially Issued") {
    badgeClass = "status-progress";
}

if (req.status === "Fully Issued") {
    badgeClass = "status-resolved";
}

if (req.status === "Rejected") {
    badgeClass = "priority-high";
}
``
               const isActionable =
    req.status !== "Fully Issued" &&
    req.status !== "Rejected";
                const actionsHtml = isActionable
                    ? `<div style="display: flex; gap: 8px;">
               <button class="btn-view" onclick="approveRequest('${req.id}', '${req.item}')">Approve</button>
               <button class="btn-view" style="color:#EF4444; border-color:var(--border-color);" onclick="rejectRequest('${req.id}', '${req.item}')">Reject</button>
             </div>`
                    : `<span style="color:var(--text-secondary); font-size:11px; font-weight:500;">No action required</span>`;

                return `
          <tr>
            <td style="font-weight: 700;">${req.id}</td>
            <td style="font-weight: 700;">${req.teamId}</td>

            <td><a href="teams.html" class="team-link">${req.teamName}</a></td>
            <td style="font-weight: 600;">${req.item}</td>
           <td>
    <div style="font-weight:600;">
        Requested : ${req.qty}
    </div>

    <div style="font-size:11px;color:#16A34A;margin-top:4px;">
        Issued : ${req.issuedQty || 0}
    </div>

    <div style="font-size:11px;color:#F59E0B;margin-top:4px;">
        Pending : ${req.pendingQty ?? req.qty}
    </div>

    ${(req.pendingQty > 0) ? `
        <span class="badge priority-high"
            style="margin-top:6px;display:inline-block;">
            HIGH PRIORITY
        </span>
    ` : ""}
</td>
            <td>${req.date}</td>
            <td><span class="badge ${badgeClass}">${req.status}</span></td>
            <td>${actionsHtml}</td>
          </tr>
        `;
            }).join("");

            tableInfo.textContent = `Showing ${totalItems === 0 ? 0 : startIndex + 1} to ${endIndex} of ${totalItems} entries`;
            renderPagination(currentPage, totalPages);
        }, 200);
    }

    function renderPagination(current, total) {
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

    // --- Actions handlers ---
    window.approveRequest = function (id, itemName) {

    const req = db.materialRequests.find(r => r.id === id);

    if (!req) return;

    if (!req.issuedQty) req.issuedQty = 0;
    if (req.pendingQty === undefined) req.pendingQty = req.qty;

    const alreadyIssued = req.issuedQty;
    const pendingQty = req.pendingQty;

    const modal = document.getElementById("issueModal");

document.getElementById("issueItem").textContent =
    itemName;

document.getElementById("issueAvailable").textContent =
    req.avail;

document.getElementById("issueRequested").textContent =
    req.qty;

document.getElementById("issueIssued").textContent =
    alreadyIssued;

document.getElementById("issuePending").textContent =
    pendingQty;

document.getElementById("issueQtyInput").value = "";

modal.classList.add("show");

document.getElementById("confirmIssueBtn").onclick =
() => {

    const issueQty = Number(
        document.getElementById("issueQtyInput").value
    );

    if (
        isNaN(issueQty) ||
        issueQty <= 0 ||
        issueQty > pendingQty
    ) {
        showToast(
            `Please enter quantity between 1 and ${pendingQty}`,
            "error"
        );
        return;
    }

    req.issuedQty += issueQty;
    req.pendingQty = req.qty - req.issuedQty;

    if (req.pendingQty > 0) {
        req.status = "Partially Issued";
    } else {
        req.status = "Fully Issued";
    }

    setDB(db);
    updateKPIs();
    renderTable();

    modal.classList.remove("show");

    showToast(
        "Material issued successfully",
        "success"
    );
};
window.closeIssueModal = function () {
    document
        .getElementById("issueModal")
        .classList.remove("show");
};

    if (enteredQty === null) return;

    const issueQty = Number(enteredQty);

    if (
        isNaN(issueQty) ||
        issueQty <= 0 ||
        issueQty > pendingQty
    ) {
        showToast(
            `Please enter quantity between 1 and ${pendingQty}`,
            "error"
        );
        return;
    }

    req.issuedQty += issueQty;
    req.pendingQty = req.qty - req.issuedQty;

    if (req.pendingQty > 0) {
        req.status = "Partially Issued";

        showToast(
            `${issueQty} items issued. ${req.pendingQty} still pending.`,
            "info"
        );
    } else {
        req.status = "Fully Issued";

        showToast(
            `${itemName} fully issued.`,
            "success"
        );
    }

    setDB(db);
    updateKPIs();
    renderTable();
};
    window.rejectRequest = function (id, itemName) {

    createConfirmationModal(
        "Reject Material Request",
        `Are you sure you want to reject <strong>${id}</strong> for <strong>${itemName}</strong>?`,
        () => {

            const req = db.materialRequests.find(
                r => r.id === id
            );

            if (!req) return;

            req.status = "Rejected";

            setDB(db);

            updateKPIs();
            renderTable();

            showToast(
                `Request ${id} rejected.`,
                "info"
            );
        },
        "Reject Request",
        true
    );
};

    // --- Search input listener ---
    searchInput.addEventListener("input", debounce((e) => {
        currentFilters.search = e.target.value.trim();
        currentPage = 1;
        renderTable();
    }, 250));

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

    // --- Sorting headers setup ---
    document.querySelectorAll(".sortable").forEach(header => {
        header.addEventListener("click", () => {
            const field = header.dataset.sort;
            if (sortField === field) {
                sortOrder = (sortOrder === "asc") ? "desc" : "asc";
            } else {
                sortField = field;
                sortOrder = "asc";
            }
            renderTable();
        });
    });

    // Initial load
    updateKPIs();
    renderTable();
});
