// Inventory Page Logic (pagination, filtering, sorting, delete)

document.addEventListener("DOMContentLoaded", () => {
    let db = getDB();
    // State
    let currentFilters = {
        type: "All",
        search: ""
    };
    let sortField = "id";
    let sortOrder = "asc";
    let currentPage = 1;
    let currentView = "equipment";

    const itemsPerPage = 20;

    // DOM Elements
    const TABLE_SCHEMAS = {

        equipment: [
            "Sl No",
            "Component Name",
            "Make",
            "Specification/Version",
            "Total Count",
            "Component Type",
            "Lab",
            "Remarks",
            "Actions"
        ],

        components: [
            "Sl No",
            "Component Name",
            "Make",
            "Specification/Version",
            "Cost",
            "Return Timeline",
            "Total Count",
            "Component Type",
            "Lab",
            "Cupboard Stored in",
            "Shelf1",
            "Count 1",
            "Shelf2",
            "Count 2",
            "Purpose",
            "Comments",
            "Actions"
        ],

        tools: [
            "Sl No",
            "Component Name",
            "Make",
            "Specification/Version",
            "Cost",
            "Return Timeline",
            "Total Count",
            "Component Type",
            "Lab",
            "Cupboard Stored in",
            "Shelf1",
            "Count 1",
            "Shelf2",
            "Count 2",
            "Purpose",
            "Comments",
            "Actions"
        ]

    };
    const tableBody = document.getElementById("inventoryTableBody");
    const tableInfo = document.getElementById("inventoryTableInfo");
    const paginationContainer = document.getElementById("inventoryPagination");
    const searchInput = document.getElementById("searchInventoryInput");

    const excelUpload =
        document.getElementById("inventoryExcelUpload");

    // KPI Elements
    const kpiTotal = document.getElementById("kpiTotalInventory");
    const kpiAvailable = document.getElementById("kpiAvailableInventory");
    const kpiMaintenance = document.getElementById("kpiMaintenanceInventory");

    function updateKPIs() {
        const list = db[currentView] || [];
        kpiTotal.textContent = String(list.length).padStart(2, '0');
        kpiAvailable.textContent = String(list.filter(item => item.status === "Available").length).padStart(2, '0');
        kpiMaintenance.textContent = String(list.filter(item => item.status === "Maintenance" || item.status === "Repairing").length).padStart(2, '0');
    }
    function renderHeader() {

        const head =
            document.getElementById("inventoryTableHead");

        head.innerHTML =
            `<tr>${TABLE_SCHEMAS[currentView]
                .map(col => `<th>${col}</th>`)
                .join("")
            }</tr>`;

    }
    document
        .querySelectorAll(".view-btn")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                currentView =
                    btn.dataset.view;

                renderHeader();
                renderTable();

            });

        });

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
            console.log(currentView);
            console.log(db[currentView]);
            // 1. FILTERING
            let filteredData = (db[currentView] || []).filter(item => {

                const searchText =
                    currentFilters.search.toLowerCase();

                return Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchText);

            });

            // 2. SORTING
            // filteredData.sort((a, b) => {
            //     let valA = String(a[sortField]).toLowerCase();
            //     let valB = String(b[sortField]).toLowerCase();

            //     if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            //     if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            //     return 0;
            // });

            // 3. PAGINATION
            const totalItems = filteredData.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

            if (currentPage > totalPages) currentPage = totalPages;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
            const paginatedData = filteredData.slice(startIndex, endIndex);

            // Render Rows
            console.log("Filtered Data", filteredData);
            console.log("Paginated Data", paginatedData);
            if (paginatedData.length === 0) {
                tableBody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 48px 16px;">
              <div class="empty-state">
                <span class="empty-state-icon">&#10065;</span>
                <span class="empty-state-title">No Inventory Items Found</span>
                <p class="empty-state-desc">Try widening your search query or choosing a different filter tab.</p>
              </div>
            </td>
          </tr>
        `;
                tableInfo.textContent = "Showing 0 to 0 of 0 entries";
                renderPagination(1, 1);
                return;
            }

            if (currentView === "equipment") {
                tableBody.innerHTML = paginatedData.map(item => `
                    <tr>
                        <td>${item.sno}</td>
                        <td>${item.name || item.componentName || ""}</td>
                        <td>${item.make}</td>
                        <td>${item.specification || ""}</td>
                        <td>${item.totalCount || item.avail || ""}</td>
                        <td>${item.componentType || ""}</td>
                        <td>${item.lab}</td>
                        <td>${item.remarks || ""}</td>
                        <td>
                            <a href="inventory-edit.html?action=edit&type=Equipment&id=${item.eqpid}" style="font-size:18px;text-decoration:none;">
                                ✏️
                            </a>
                        </td>
                    </tr>
                `).join("");
            } else if (currentView === "components") {
                tableBody.innerHTML = paginatedData.map(item => `
                    <tr>
                        <td>${item.sno}</td>
                        <td>${item.componentName}</td>
                        <td>${item.make}</td>
                        <td>${item.specification || ""}</td>
                        <td>${item.cost || ""}</td>
                        <td>${item.returnTimeline || ""}</td>
                        <td>${item.totalCount || ""}</td>
                        <td>${item.componentType || ""}</td>
                        <td>${item.lab || ""}</td>
                        <td>${item.cupboard || ""}</td>
                        <td>${item.shelf1 || ""}</td>
                        <td>${item.count1 || ""}</td>
                        <td>${item.shelf2 || ""}</td>
                        <td>${item.count2 || ""}</td>
                        <td>${item.purpose || ""}</td>
                        <td>${item.comments || ""}</td>
                        <td>
                            <a href="inventory-edit.html?action=edit&type=Component&id=${item.cid}" style="font-size:18px;text-decoration:none;">
                                ✏️
                            </a>
                        </td>
                    </tr>
                `).join("");
            } else if (currentView === "tools") {
                tableBody.innerHTML = paginatedData.map(item => `
                    <tr>
                        <td>${item.sno}</td>
                        <td>${item.componentName}</td>
                        <td>${item.make}</td>
                        <td>${item.specification || ""}</td>
                        <td>${item.cost || ""}</td>
                        <td>${item.returnTimeline || ""}</td>
                        <td>${item.totalCount || ""}</td>
                        <td>${item.componentType || ""}</td>
                        <td>${item.lab || ""}</td>
                        <td>${item.cupboard || ""}</td>
                        <td>${item.shelf1 || ""}</td>
                        <td>${item.count1 || ""}</td>
                        <td>${item.shelf2 || ""}</td>
                        <td>${item.count2 || ""}</td>
                        <td>${item.purpose || ""}</td>
                        <td>${item.comments || ""}</td>
                        <td>
                            <a href="inventory-edit.html?action=edit&type=Tool&id=${item.toolid}" style="font-size:18px;text-decoration:none;">
                                ✏️
                            </a>
                        </td>
                    </tr>
                `).join("");
            }

            tableInfo.textContent = `Showing ${totalItems === 0 ? 0 : startIndex + 1} to ${endIndex} of ${totalItems} entries`;
            renderPagination(currentPage, totalPages);
        }, 200);
    }
    document.querySelectorAll(".view-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".view-btn").forEach(b => {
                b.classList.remove("btn-primary");
                b.classList.add("btn-secondary");
            });

            btn.classList.remove("btn-secondary");
            btn.classList.add("btn-primary");

            currentView = btn.dataset.view;
            currentPage = 1;

            // Toggle active action groups
            const actEq = document.getElementById("actionsEquipment");
            const actCp = document.getElementById("actionsComponents");
            const actTl = document.getElementById("actionsTools");
            if (actEq) actEq.style.display = currentView === "equipment" ? "" : "none";
            if (actCp) actCp.style.display = currentView === "components" ? "" : "none";
            if (actTl) actTl.style.display = currentView === "tools" ? "" : "none";

            renderHeader();
            renderTable();
            updateKPIs();
        });
    });

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

    // --- Deletion Dialog ---
    window.deleteEquipment = function (id, name) {
        createConfirmationModal(
            "Confirm Equipment Deletion",
            `Are you sure you want to delete <strong>${name} (${id})</strong> from the inventory system? This action is permanent and cannot be undone.`,
            () => {
                db.inventory = db.inventory.filter(item => item.id !== id);
                setDB(db); // Save to LocalStorage
                showToast(`Item ${id} deleted successfully`, "success");
                updateKPIs();
                renderTable();
            },
            "Delete Item",
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
    // Trigger file uploads on click
    document.querySelectorAll(".btn-upload").forEach(btn => {
        btn.addEventListener("click", () => {
            const input = document.getElementById("bulkUploadFileInput");
            if (input) {
                input.value = ""; // clear previous
                input.dataset.uploadType = btn.dataset.type; // target type (equipment, components, tools)
                input.click();
            }
        });
    });

    // Trigger templates download on click
    document.querySelectorAll(".btn-download").forEach(btn => {
        btn.addEventListener("click", () => {
            downloadTemplate(btn.dataset.type);
        });
    });

    // Hidden file input change listener
    const fileInput = document.getElementById("bulkUploadFileInput");
    if (fileInput) {
        fileInput.addEventListener("change", function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const uploadType = this.dataset.uploadType; // e.g. "equipment", "components", "tools"
            const updateDuplicates = document.getElementById("updateDuplicateCheck")?.checked || false;

            const reader = new FileReader();
            reader.onload = function (evt) {
                try {
                    const data = new Uint8Array(evt.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
                    const firstSheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[firstSheetName];
                    const rows = XLSX.utils.sheet_to_json(sheet);

                    if (!rows || rows.length === 0) {
                        showToast("Excel/CSV file is empty.", "warn");
                        return;
                    }

                    processImport(rows, uploadType, updateDuplicates);
                } catch (err) {
                    console.error(err);
                    showToast("Error parsing file. Ensure it is a valid Excel or CSV file.", "error");
                }
            };
            reader.readAsArrayBuffer(file);
        });
    }

    function processImport(rows, type, updateDuplicates) {
        const freshDb = getDB();
        let successCount = 0;
        let failCount = 0;
        const details = [];

        // Determine list and properties mappings
        let listArr = [];
        let idKey = "";
        let altIdKeys = [];
        let altNameKeys = [];

        if (type === "equipment") {
            listArr = freshDb.equipment || [];
            idKey = "eqpid";
            altIdKeys = ["Equipment ID", "eqpid", "id"];
            altNameKeys = ["Equipment Name", "name", "componentName"];
        } else if (type === "components") {
            listArr = freshDb.components || [];
            idKey = "cid";
            altIdKeys = ["Component ID", "cid", "id"];
            altNameKeys = ["Component Name", "name", "componentName"];
        } else if (type === "tools") {
            listArr = freshDb.tools || [];
            idKey = "toolid";
            altIdKeys = ["Tool ID", "toolid", "id"];
            altNameKeys = ["Tool Name", "name", "componentName"];
        }

        // Helper to extract properties cleanly
        const getProp = (row, alternativeKeys) => {
            for (const k of alternativeKeys) {
                if (row[k] !== undefined) return String(row[k]).trim();
                const foundKey = Object.keys(row).find(rk => rk.toLowerCase().trim() === k.toLowerCase().trim());
                if (foundKey && row[foundKey] !== undefined) return String(row[foundKey]).trim();
            }
            return "";
        };

        rows.forEach((row, idx) => {
            const sheetRowIndex = idx + 2; // Row #1 is headers

            // Extract item ID
            const itemId = getProp(row, altIdKeys);
            const itemName = getProp(row, altNameKeys);
            const make = getProp(row, ["Make", "manufacturer"]);
            const lab = getProp(row, ["Lab", "location"]);

            // Required validations
            if (!itemId) {
                failCount++;
                details.push({ row: sheetRowIndex, id: "N/A", status: "Failed", reason: "Missing unique Item ID column." });
                return;
            }
            if (!itemName) {
                failCount++;
                details.push({ row: sheetRowIndex, id: itemId, status: "Failed", reason: "Missing Item Name." });
                return;
            }
            if (!make) {
                failCount++;
                details.push({ row: sheetRowIndex, id: itemId, status: "Failed", reason: "Missing Make." });
                return;
            }
            if (!lab) {
                failCount++;
                details.push({ row: sheetRowIndex, id: itemId, status: "Failed", reason: "Missing Lab location." });
                return;
            }

            // check duplicate ID
            const existingIdx = listArr.findIndex(item => String(item[idKey]).trim().toLowerCase() === itemId.toLowerCase());

            if (existingIdx > -1) {
                if (updateDuplicates) {
                    // Update existing item
                    if (type === "equipment") {
                        listArr[existingIdx] = {
                            ...listArr[existingIdx],
                            name: itemName,
                            componentName: itemName,
                            make: make,
                            specification: getProp(row, ["Specification", "model"]),
                            totalCount: parseInt(getProp(row, ["Total Count", "qty"])) || listArr[existingIdx].totalCount || 1,
                            componentType: getProp(row, ["Component Type", "type"]) || listArr[existingIdx].componentType || "Equipment",
                            lab: lab,
                            remarks: getProp(row, ["Remarks", "description"]) || listArr[existingIdx].remarks || "Working Fine"
                        };
                    } else {
                        // components or tools
                        listArr[existingIdx] = {
                            ...listArr[existingIdx],
                            componentName: itemName,
                            make: make,
                            specification: getProp(row, ["Specification", "model"]),
                            cost: parseFloat(getProp(row, ["Cost"])) || listArr[existingIdx].cost || 0,
                            returnTimeline: getProp(row, ["Return Timeline"]) || listArr[existingIdx].returnTimeline || "Daily",
                            totalCount: parseInt(getProp(row, ["Total Count", "qty"])) || listArr[existingIdx].totalCount || 1,
                            componentType: getProp(row, ["Component Type", "Tool Type", "type"]) || listArr[existingIdx].componentType || "Electronics",
                            lab: lab,
                            cupboard: getProp(row, ["Cupboard", "cupboard"]) || listArr[existingIdx].cupboard || "",
                            shelf1: getProp(row, ["Shelf 1", "shelf1"]) || listArr[existingIdx].shelf1 || "",
                            count1: parseInt(getProp(row, ["Count 1", "count1"])) || listArr[existingIdx].count1 || 0,
                            shelf2: getProp(row, ["Shelf 2", "shelf2"]) || listArr[existingIdx].shelf2 || "",
                            count2: parseInt(getProp(row, ["Count 2", "count2"])) || listArr[existingIdx].count2 || 0,
                            purpose: getProp(row, ["Purpose"]) || listArr[existingIdx].purpose || "Student Projects",
                            comments: getProp(row, ["Comments"]) || listArr[existingIdx].comments || ""
                        };
                    }
                    successCount++;
                    details.push({ row: sheetRowIndex, id: itemId, status: "Updated", reason: "Existing item updated." });
                } else {
                    // Skip duplicates
                    failCount++;
                    details.push({ row: sheetRowIndex, id: itemId, status: "Skipped", reason: "Unique Item ID already exists, update duplicates disabled." });
                }
            } else {
                // Add new item record
                let newItem = {};
                if (type === "equipment") {
                    newItem = {
                        sno: listArr.length + 1,
                        eqpid: itemId,
                        name: itemName,
                        componentName: itemName,
                        make: make,
                        specification: getProp(row, ["Specification", "model"]),
                        totalCount: parseInt(getProp(row, ["Total Count", "qty"])) || 1,
                        componentType: getProp(row, ["Component Type", "type"]) || "Equipment",
                        lab: lab,
                        remarks: getProp(row, ["Remarks", "description"]) || "Working Fine"
                    };
                } else {
                    newItem = {
                        sno: listArr.length + 1,
                        [idKey]: itemId,
                        componentName: itemName,
                        make: make,
                        specification: getProp(row, ["Specification", "model"]),
                        cost: parseFloat(getProp(row, ["Cost"])) || 0,
                        returnTimeline: getProp(row, ["Return Timeline"]) || "Daily",
                        totalCount: parseInt(getProp(row, ["Total Count", "qty"])) || 1,
                        componentType: getProp(row, ["Component Type", "Tool Type", "type"]) || "Electronics",
                        lab: lab,
                        cupboard: getProp(row, ["Cupboard", "cupboard"]) || "",
                        shelf1: getProp(row, ["Shelf 1", "shelf1"]) || "",
                        count1: parseInt(getProp(row, ["Count 1", "count1"])) || 0,
                        shelf2: getProp(row, ["Shelf 2", "shelf2"]) || "",
                        count2: parseInt(getProp(row, ["Count 2", "count2"])) || 0,
                        purpose: getProp(row, ["Purpose"]) || "Student Projects",
                        comments: getProp(row, ["Comments"]) || ""
                    };
                }
                listArr.push(newItem);
                successCount++;
                details.push({ row: sheetRowIndex, id: itemId, status: "Created", reason: "Successfully imported." });
            }
        });

        // Save DB
        if (type === "equipment") freshDb.equipment = listArr;
        else if (type === "components") freshDb.components = listArr;
        else if (type === "tools") freshDb.tools = listArr;

        setDB(freshDb);
        db = freshDb; // sync local state

        // Re-render
        renderTable();
        updateKPIs();

        // Render Summary Modal details
        document.getElementById("summaryTotalRows").textContent = rows.length;
        document.getElementById("summarySuccessRows").textContent = successCount;
        document.getElementById("summaryFailedRows").textContent = failCount;

        const tbody = document.getElementById("uploadSummaryTableBody");
        tbody.innerHTML = details.map(d => {
            const rowClass = d.status === "Failed" || d.status === "Skipped" ? "style='color: #DC2626; font-weight: 600;'" : "style='color: #16A34A;'";
            return `
                <tr>
                    <td>Row ${d.row}</td>
                    <td><strong>${d.id}</strong></td>
                    <td><span ${rowClass}>${d.status}</span> - ${d.reason}</td>
                </tr>
            `;
        }).join("");

        // Show Modal
        document.getElementById("uploadSummaryModalOverlay").classList.add("show");
        document.getElementById("uploadSummaryModal").classList.add("show");
    }

    window.closeUploadSummaryModal = function () {
        document.getElementById("uploadSummaryModalOverlay").classList.remove("show");
        document.getElementById("uploadSummaryModal").classList.remove("show");
    };

    window.downloadTemplate = function (type) {
        let headers = "";
        let filename = "";
        if (type === "equipment") {
            headers = "Equipment ID,Equipment Name,Make,Specification,Total Count,Component Type,Lab,Remarks\nEQP201,3D Printer Pro,Creality,Ender 5,3,Manufacturing Equipment,Mechanical Lab,Working Fine";
            filename = "equipment_template.csv";
        } else if (type === "components") {
            headers = "Component ID,Component Name,Make,Specification,Cost,Return Timeline,Total Count,Component Type,Lab,Cupboard,Shelf 1,Count 1,Shelf 2,Count 2,Purpose,Comments\nCID201,Arduino Uno R4,Arduino,Uno R4 Minima,1200,Project Completion,20,Electronics,Embedded Lab,CUP-1,A1,10,A2,10,Workshop,New Stock";
            filename = "components_template.csv";
        } else if (type === "tools") {
            headers = "Tool ID,Tool Name,Make,Specification,Cost,Return Timeline,Total Count,Tool Type,Lab,Cupboard,Shelf 1,Count 1,Shelf 2,Count 2,Purpose,Comments\nT201,Digital Multimeter,Fluke,Model 115,4500,Daily,5,Electronics Tool,Embedded Lab,CUP-5,A1,2,A2,3,Lab Testing,Calibrated";
            filename = "tools_template.csv";
        }

        const blob = new Blob([headers], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Initial load
    renderHeader();
    updateKPIs();
    renderTable();
});
