document.addEventListener("DOMContentLoaded", () => {

    // Initialize Lucide Icons
    lucide.createIcons();

    // Elements
    const selectAllCheckbox =
        document.getElementById("select-all-critical");

    const rowCheckboxes =
        document.querySelectorAll(".row-checkbox");

    const floatingBar =
        document.getElementById("bottom-action-bar");

    const selectedCount =
        document.getElementById("selected-count");

    const btnCount =
        document.getElementById("btn-count");

    // ==========================
    // Update Floating Bar
    // ==========================
    function updateSelectionUI() {

        const checkedRows =
            document.querySelectorAll(
                ".row-checkbox:checked"
            ).length;

        if (checkedRows > 0) {

            floatingBar.style.display = "flex";

            selectedCount.textContent =
                checkedRows;

            btnCount.textContent =
                checkedRows;

        } else {

            floatingBar.style.display = "none";

            selectedCount.textContent = "0";
            btnCount.textContent = "0";

        }

        // Update Header Select All
        if (selectAllCheckbox) {

            selectAllCheckbox.checked =
                checkedRows === rowCheckboxes.length;

        }
    }

    // ==========================
    // Select All
    // ==========================
    if (selectAllCheckbox) {

        selectAllCheckbox.addEventListener(
            "change",
            function () {

                rowCheckboxes.forEach(row => {
                    row.checked = this.checked;
                });

                updateSelectionUI();
            }
        );

    }

    // ==========================
    // Individual Row Checkbox
    // ==========================
    rowCheckboxes.forEach(row => {

        row.addEventListener("change", () => {
            updateSelectionUI();
        });

    });

    // ==========================
    // Search Functionality
    // ==========================
    const searchInput =
        document.querySelector(".search-input");

    if (searchInput) {

        searchInput.addEventListener(
            "keyup",
            function () {

                const value =
                    this.value.toLowerCase();

                const rows =
                    document.querySelectorAll(
                        ".custom-table tbody tr"
                    );

                rows.forEach(row => {

                    const text =
                        row.innerText.toLowerCase();

                    row.style.display =
                        text.includes(value)
                            ? ""
                            : "none";
                });
            }
        );

    }

    // ==========================
    // View Buttons
    // ==========================
    const viewButtons =
        document.querySelectorAll(".btn-view");

    viewButtons.forEach(btn => {

        btn.addEventListener("click", () => {

            const row =
                btn.closest("tr");

            const assetName =
                row.cells[1].innerText;

            alert(
                `Viewing details for: ${assetName}`
            );

        });

    });

    // ==========================
    // Procurement Request
    // ==========================
    const procurementButtons =
        document.querySelectorAll(
            ".btn-primary"
        );

    procurementButtons.forEach(btn => {

        if (
            btn.innerText.includes(
                "Create Procurement Request"
            )
        ) {

            btn.addEventListener("click", () => {

                const selectedAssets =
                    document.querySelectorAll(
                        ".row-checkbox:checked"
                    ).length;

                if (selectedAssets === 0) {

                    alert(
                        "Please select at least one asset."
                    );

                    return;
                }

                alert(
                    `Procurement Request Created for ${selectedAssets} asset(s).`
                );
            });

        }

    });

    // ==========================
    // Priority Filter
    // ==========================
    const priorityFilter =
        document.querySelectorAll(
            ".form-control"
        )[0];

    if (priorityFilter) {

        priorityFilter.addEventListener(
            "change",
            function () {

                const filterValue =
                    this.value.toLowerCase();

                const rows =
                    document.querySelectorAll(
                        ".custom-table tbody tr"
                    );

                rows.forEach(row => {

                    const priority =
                        row.querySelector(".badge")
                            ?.innerText
                            .toLowerCase();

                    if (
                        filterValue ===
                        "all priorities"
                    ) {

                        row.style.display = "";

                    } else {

                        row.style.display =
                            priority === filterValue
                                ? ""
                                : "none";
                    }
                });
            }
        );

    }

    // ==========================
    // Default State
    // ==========================
    updateSelectionUI();

});