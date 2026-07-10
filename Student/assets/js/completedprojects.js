function spaNavigate(viewId) {
    document.querySelectorAll('.spa-view').forEach(view => {
        view.style.display = 'none';
    });
    const targetView = document.getElementById('view-' + viewId);
    if (targetView) {
        targetView.style.display = 'block';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===============================
// COMPLETED PROJECTS
// Search, Filter & Sort
// ===============================

// Get HTML Elements
const searchInput = document.getElementById("searchInput");
const domainFilter = document.getElementById("domainFilter");
const typeFilter = document.getElementById("typeFilter");
const sortFilter = document.getElementById("sortFilter");

// Get Table
const projectTable = document.getElementById("projectsTable");

// Get All Rows
const projectRows = document.querySelectorAll(".project-row");

// Check whether everything is loaded correctly
console.log("Search Input:", searchInput);
console.log("Domain Filter:", domainFilter);
console.log("Type Filter:", typeFilter);
console.log("Sort Filter:", sortFilter);
console.log("Project Rows:", projectRows);

// Sort Projects
sortFilter.addEventListener("change", function () {

    const rows = Array.from(projectTable.querySelectorAll(".project-row"));

    rows.sort(function (a, b) {

        const dateA = new Date(a.querySelector(".completed-date").textContent.trim());
        const dateB = new Date(b.querySelector(".completed-date").textContent.trim());

        if (sortFilter.value === "recent") {
            return dateB.getTime() - dateA.getTime();   // Newest first
        } else {
            return dateA.getTime() - dateB.getTime();   // Oldest first
        }

    });

    rows.forEach(function (row) {
        projectTable.appendChild(row);
    });

});

function filterProjects() {

    const searchValue = searchInput.value.toLowerCase();
    const selectedDomain = domainFilter.value.toLowerCase();
    const selectedType = typeFilter.value.toLowerCase();

    projectRows.forEach(function (row) {

        const projectName = row.querySelector(".project-name").textContent.toLowerCase();
        const domain = row.querySelector(".domain").textContent.toLowerCase();
        const projectType = row.querySelector(".project-type").textContent.toLowerCase();

        const matchesSearch =
            searchValue === "" ||
            projectName.includes(searchValue) ||
            projectType.includes(searchValue);

        const matchesDomain =
            selectedDomain === "all domains" ||
            domain === selectedDomain;

        const matchesType =
            selectedType === "all project types" ||
            projectType === selectedType;

        if (matchesSearch && matchesDomain && matchesType) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

}

// Event Listeners
searchInput.addEventListener("keyup", filterProjects);

domainFilter.addEventListener("change", filterProjects);

typeFilter.addEventListener("change", filterProjects);