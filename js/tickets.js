// Ticket Management Controller
document.addEventListener("DOMContentLoaded", () => {
  const activeTableBody = document.getElementById("activeTicketsTableBody");

  // Utilities to convert between ticket dates ("DD Mmm YYYY") and HTML input dates ("YYYY-MM-DD")
  function parseDBDateToInputDate(dbDateStr) {
    if (!dbDateStr) return "";
    const parts = dbDateStr.trim().split(/\s+/);
    if (parts.length < 3) return "";
    const day = parts[0].padStart(2, "0");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIdx = monthNames.indexOf(parts[1]);
    if (monthIdx === -1) return "";
    const month = String(monthIdx + 1).padStart(2, "0");
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }

  function formatInputDateToDBDate(inputDateStr) {
    if (!inputDateStr) return "";
    const parts = inputDateStr.split("-");
    if (parts.length < 3) return "";
    const year = parts[0];
    const monthIdx = parseInt(parts[1]) - 1;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[monthIdx];
    const day = String(parseInt(parts[2])).padStart(2, "0");
    return `${day} ${month} ${year}`;
  }

  function getEnquiryRequiredItems(db) {
    const list = [];
    const costMap = {
      "3d printer": 25000,
      "cnc milling machine": 32000,
      "cnc machine": 32000,
      "laser cutter": 18000,
      "3d scanner": 35000,
      "digital oscilloscope": 15000,
      "bench multimeter": 12000,
      "soldering station": 8500,
      "hot air rework station": 14000,
      "variable dc power supply": 6500,
      "arduino uno": 850,
      "arduino uno r3": 850,
      "raspberry pi 4": 7000,
      "ultrasonic sensor": 250,
      "soil moisture sensor": 150,
      "dc motor 12v": 350,
      "16x2 lcd display": 250,
      "li-ion battery 18650": 300,
      "bipolar nema 17": 1250,
      "lipo battery 11.1v": 2200,
      "pir motion sensor": 180,
      "co2 laser tube": 9500,
      "screw driver set": 2500,
      "soldering iron": 3200
    };

    function getItemCost(name) {
      const cleanName = name.toLowerCase().trim();
      if (costMap[cleanName]) return costMap[cleanName];

      const comp = db.components.find(c => c.componentName.toLowerCase() === cleanName);
      if (comp && comp.cost) return comp.cost;

      const tool = db.tools.find(t => t.componentName.toLowerCase() === cleanName);
      if (tool && tool.cost) return tool.cost;

      return 500;
    }

    function getItemIdAndType(name) {
      const cleanName = name.toLowerCase().trim();
      let inv = db.inventory.find(i => i.name.toLowerCase() === cleanName);
      if (inv) {
        return { id: inv.id, type: inv.type };
      }
      let comp = db.components.find(c => c.componentName.toLowerCase() === cleanName);
      if (comp) {
        return { id: comp.cid, type: "Component" };
      }
      let tool = db.tools.find(t => t.componentName.toLowerCase() === cleanName);
      if (tool) {
        return { id: tool.toolid, type: "Tool" };
      }
      let eqp = db.equipment.find(e => (e.name || e.componentName || "").toLowerCase() === cleanName);
      if (eqp) {
        return { id: eqp.eqpid, type: "Equipment" };
      }
      return { id: "EQ-N/A", type: "Component" };
    }

    // 1. Sourcing from materialReturns (items not returned or damaged)
    (db.materialReturns || []).forEach(r => {
      const isNotReturned = r.status !== "Returned";
      const isDamaged = r.isGood === false;

      if (isNotReturned || isDamaged) {
        const { id: itemId, type: itemType } = getItemIdAndType(r.item);
        const amount = getItemCost(r.item);

        list.push({
          source: "return",
          refId: r.id,
          teamId: r.teamId,
          teamName: r.teamName,
          itemType: itemType,
          itemId: itemId,
          itemName: r.item,
          amount: amount,
          ticketRaised: r.ticketRaised || false,
          timeSlot: "" // returns don't strictly bind slots
        });
      }
    });

    // 2. Sourcing from equipmentRequests (rejected equipment requests)
    (db.equipmentRequests || []).forEach(team => {
      (team.requests || []).forEach(req => {
        if (req.status === "Rejected") {
          const amount = getItemCost(req.equipmentName);

          list.push({
            source: "equipment_request",
            refId: req.id,
            teamId: team.teamId,
            teamName: team.teamName,
            itemType: "Equipment",
            itemId: req.equipmentId,
            itemName: req.equipmentName,
            amount: amount,
            ticketRaised: req.ticketRaised || false,
            timeSlot: req.timeSlot || "" // Retain slot timing
          });
        }
      });
    });

    return list;
  }

  function renderActiveTickets() {
    const db = getDB();
    // Exclude Procurement category tickets (like TKT-001) from matches
    const tickets = (db.tickets || []).filter(t => t.type !== "Procurement");

    if (tickets.length === 0) {
      activeTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 48px 16px; color: var(--text-secondary); font-weight: 500;">
            No active tickets recorded at this time.
          </td>
        </tr>
      `;
      return;
    }

    const sortedTickets = [...tickets].sort((a, b) => b.id.localeCompare(a.id));

    activeTableBody.innerHTML = sortedTickets.map(t => {
      let badgeClass = "status-pending";
      if (t.status === "Resolved") badgeClass = "badge status-resolved";
      else if (t.status === "In Progress") badgeClass = "badge status-in-progress";
      else badgeClass = "badge status-open";

      // Parse details
      const details = t.damageDescription || t.reason || "No details provided.";
      const cleanSubject = t.subject || "Asset Issue";
      const slotHtml = t.timeSlot ? `<br><span style="font-size:11px;color:#6B7280;font-weight:normal;">Slot: ${t.timeSlot}</span>` : "";

      return `
        <tr>
          <td style="font-weight: 700; color: var(--text-secondary);">${t.id}</td>
          <td style="font-weight: 600; color: var(--text-primary);">${t.teamName} (${t.assignedTo})</td>
          <td style="font-weight: 600; color: var(--text-primary);">${t.equipmentName || 'N/A'}${slotHtml}</td>
          <td style="font-weight: 600; color: var(--text-secondary);">${cleanSubject}</td>
          <td style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(details)}">
            ${escapeHtml(details)}
          </td>
          <td><span class="${badgeClass}">${t.status}</span></td>
          <td style="text-align: center;">
            <button class="btn btn-secondary" onclick="viewTicket('${t.id}')" style="padding: 6px 12px; font-size: 12px;">View & Track</button>
          </td>
        </tr>
      `;
    }).join("");
  }

  function renderFlaggedItems() {
    const db = getDB();
    const items = getEnquiryRequiredItems(db);

    if (items.length === 0) {
      flaggedTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 48px 16px; color: var(--text-secondary); font-weight: 500;">
            No items require manual tickets at this time. All caught up!
          </td>
        </tr>
      `;
      return;
    }

    flaggedTableBody.innerHTML = items.map(item => {
      const slotHtml = item.timeSlot ? `<br><span style="font-size:11px;color:#6B7280;font-weight:normal;">Slot: ${item.timeSlot}</span>` : "";
      const actionButton = item.ticketRaised
        ? `<button class="btn btn-disabled" disabled style="padding: 6px 12px; font-size:12px;">Ticket Raised</button>`
        : `<button class="btn btn-primary" onclick="openRaiseModal('${item.source}', '${item.refId}', '${item.teamId}', '${item.itemId}', '${escapeHtml(item.itemName)}', '${item.timeSlot || ''}')" style="padding: 6px 12px; font-size:12px;">Raise Ticket</button>`;

      return `
        <tr>
          <td style="font-weight: 700; color: var(--text-secondary);">${item.teamId}</td>
          <td style="font-weight: 600; color: var(--text-primary);">${item.teamName}</td>
          <td>${item.itemType}</td>
          <td style="font-family: monospace; font-weight: 700; color: var(--text-secondary);">${item.itemId || 'N/A'}</td>
          <td style="font-weight: 600; color: var(--text-primary);">${item.itemName}${slotHtml}</td>
          <td style="font-weight: 700; color: #10B981;">&#8377; ${item.amount.toLocaleString()}</td>
          <td style="text-align: center;">${actionButton}</td>
        </tr>
      `;
    }).join("");
  }

  // --- Raise Ticket System ---
  let activeRaise = null;

  window.openRaiseModal = function (source, refId, teamId, assetId, assetName, timeSlot) {
    activeRaise = { source, refId, teamId, assetId, assetName, timeSlot };
    const db = getDB();
    const teamName = db.teams.find(t => t.id === teamId)?.name || teamId;

    document.getElementById("modalTeamId").textContent = teamId;
    document.getElementById("modalTeamName").textContent = teamName;
    document.getElementById("modalAssetId").textContent = `${assetId || 'N/A'}`;
    document.getElementById("modalAssetName").textContent = assetName;

    const timeSlotCont = document.getElementById("modalTimeSlotContainer");
    const timeSlotVal = document.getElementById("modalTimeSlot");
    if (timeSlot) {
      timeSlotCont.style.display = "block";
      timeSlotVal.textContent = timeSlot;
    } else {
      timeSlotCont.style.display = "none";
    }

    document.getElementById("modalDamageType").value = "Damaged";
    document.getElementById("modalDamageDetails").value = "";

    document.getElementById("raiseTicketModal").style.display = "flex";
  };

  window.closeRaiseModal = function () {
    document.getElementById("raiseTicketModal").style.display = "none";
    activeRaise = null;
  };

  document.getElementById("raiseTicketForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!activeRaise) return;

    const damageType = document.getElementById("modalDamageType").value;
    const details = document.getElementById("modalDamageDetails").value.trim();

    if (!details) {
      showToast("Please enter damage details.", "error");
      return;
    }

    let db = getDB();

    // 1. Set ticket marker on source item
    if (activeRaise.source === "return") {
      const idx = db.materialReturns.findIndex(r => r.id === activeRaise.refId);
      if (idx > -1) db.materialReturns[idx].ticketRaised = true;
    } else if (activeRaise.source === "equipment_request") {
      db.equipmentRequests.forEach(team => {
        const req = team.requests.find(r => r.id === activeRaise.refId);
        if (req) req.ticketRaised = true;
      });
    }

    // 2. Add new ticket records
    const nextNum = db.tickets.length + 1;
    const newId = `TKT-${String(nextNum).padStart(3, "0")}`;
    const today = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dateStr = `${String(today.getDate()).padStart(2, "0")} ${months[today.getMonth()]} ${today.getFullYear()}`;
    const timeStr = today.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const teamName = db.teams.find(t => t.id === activeRaise.teamId)?.name || activeRaise.teamId;

    const newTicket = {
      id: newId,
      type: "Damage",
      assignedTo: activeRaise.teamId,
      subject: `${activeRaise.assetName} ${damageType}`,
      priority: "High",
      date: dateStr,
      status: "Open",
      teamName: teamName,
      equipmentName: activeRaise.assetName,
      raisedBy: "Lab Incharge",
      time: timeStr,
      damageDescription: details,
      fineAmount: "500",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      remarks: `Manual ticket raised: ${damageType}.`,
      teamResponse: "",
      lastUpdated: `${dateStr}, ${timeStr}`,
      timeSlot: activeRaise.timeSlot || ""
    };

    db.tickets.push(newTicket);

    // Write notifications
    const newNotif = {
      id: `NTF-${String(db.notifications.length + 1).padStart(3, "0")}`,
      icon: "🎫",
      iconClass: "notif-icon-ticket",
      body: `New damage ticket ${newId} raised against ${activeRaise.teamId} for ${activeRaise.assetName}.`,
      time: "Just now",
      unread: true
    };
    db.notifications.unshift(newNotif);

    // Mark as Repairing if applicable
    if (activeRaise.assetId) {
      const invItem = db.inventory.find(i => i.id === activeRaise.assetId);
      if (invItem && (damageType === "Damaged" || damageType === "Unusable")) {
        invItem.status = "Repairing";
      }
    }

    setDB(db);
    showToast(`Ticket ${newId} raised against team successfully!`, "success");
    closeRaiseModal();
    renderFlaggedItems();
    renderActiveTickets();
  });

  // --- Manual Create Ticket Modal (From Scratch) ---
  window.openManualCreateModal = function () {
    const db = getDB();
    const teamSelect = document.getElementById("createTicketTeam");
    teamSelect.innerHTML = '<option value="">-- Choose Team --</option>';

    (db.teams || []).forEach(team => {
      const opt = document.createElement("option");
      opt.value = team.id;
      opt.textContent = `${team.id} - ${team.name}`;
      teamSelect.appendChild(opt);
    });

    document.getElementById("createTicketAsset").innerHTML = '<option value="">-- Choose Asset --</option>';
    document.getElementById("createTicketType").value = "Damaged";
    document.getElementById("createTicketFine").value = "500";
    document.getElementById("createTicketDescription").value = "";

    // Default due date to 7 days from now
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const dd = String(nextWeek.getDate()).padStart(2, '0');
    const mm = String(nextWeek.getMonth() + 1).padStart(2, '0');
    const yyyy = nextWeek.getFullYear();
    document.getElementById("createTicketDueDate").value = `${yyyy}-${mm}-${dd}`;

    document.getElementById("createTicketModal").style.display = "flex";
  };

  window.closeManualCreateModal = function () {
    document.getElementById("createTicketModal").style.display = "none";
  };

  window.populateCreateTicketAssets = function (teamId) {
    const assetSelect = document.getElementById("createTicketAsset");
    assetSelect.innerHTML = '<option value="">-- Choose Asset --</option>';
    if (!teamId) return;

    const db = getDB();
    (db.inventory || []).forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.textContent = `${item.id} - ${item.name} (${item.type})`;
      assetSelect.appendChild(opt);
    });
  };

  document.getElementById("createTicketForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const teamId = document.getElementById("createTicketTeam").value;
    const assetId = document.getElementById("createTicketAsset").value;
    const type = document.getElementById("createTicketType").value;
    const fineVal = document.getElementById("createTicketFine").value;
    const dueDate = document.getElementById("createTicketDueDate").value;
    const desc = document.getElementById("createTicketDescription").value.trim();

    if (!teamId || !assetId || !desc) {
      showToast("Please fill in all details.", "error");
      return;
    }

    const db = getDB();
    const teamName = db.teams.find(t => t.id === teamId)?.name || teamId;
    const assetItem = db.inventory.find(i => i.id === assetId);
    const assetName = assetItem ? assetItem.name : assetId;

    const nextNum = db.tickets.length + 1;
    const newId = `TKT-${String(nextNum).padStart(3, "0")}`;
    const today = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dateStr = `${String(today.getDate()).padStart(2, "0")} ${months[today.getMonth()]} ${today.getFullYear()}`;
    const timeStr = today.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const newTicket = {
      id: newId,
      type: "Damage",
      assignedTo: teamId,
      subject: `${assetName} ${type}`,
      priority: "High",
      date: dateStr,
      status: "Open",
      teamName: teamName,
      equipmentName: assetName,
      raisedBy: "Lab Incharge",
      time: timeStr,
      damageDescription: desc,
      fineAmount: String(fineVal),
      dueDate: formatInputDateToDBDate(dueDate),
      remarks: `Manually raised ticket. Type: ${type}.`,
      teamResponse: "",
      lastUpdated: `${dateStr}, ${timeStr}`,
      timeSlot: "" // manual ticket has no booking slot
    };

    db.tickets.push(newTicket);

    const newNotif = {
      id: `NTF-${String(db.notifications.length + 1).padStart(3, "0")}`,
      icon: "🎫",
      iconClass: "notif-icon-ticket",
      body: `New damage ticket ${newId} raised against ${teamId} for ${assetName}.`,
      time: "Just now",
      unread: true
    };
    db.notifications.unshift(newNotif);

    if (assetItem && (type === "Damaged" || type === "Unusable")) {
      assetItem.status = "Repairing";
    }

    setDB(db);
    showToast(`Ticket ${newId} raised successfully!`, "success");
    closeManualCreateModal();
    renderActiveTickets();
  });

  // --- View & Track Ticket System ---
  let activeViewTicketId = null;

  window.viewTicket = function (ticketId) {
    activeViewTicketId = ticketId;
    const db = getDB();
    const t = db.tickets.find(tk => tk.id === ticketId);
    if (!t) return;

    const contentDiv = document.getElementById("viewTicketContent");
    const isDamage = t.type === "Damage";

    let dateVal = "";
    if (t.dueDate) {
      dateVal = parseDBDateToInputDate(t.dueDate);
    }

    let formHtml = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size:13px; color: #4B5563; margin-bottom:12px;">
        <div><strong>Ticket ID:</strong> <span style="font-weight:700;">${t.id}</span></div>
        <div><strong>Type:</strong> <span style="font-weight:600;">${t.type}</span></div>
        <div><strong>Team:</strong> <span>${t.teamName || t.assignedTo} (${t.assignedTo})</span></div>
        <div><strong>Asset:</strong> <span>${t.equipmentName || "N/A"}</span></div>
        ${t.timeSlot ? `<div style="grid-column: span 2;"><strong>Booking Slot:</strong> <span style="font-weight:600; color:#5C59F2;">${t.timeSlot}</span></div>` : ''}
        <div style="grid-column: span 2;"><strong>Subject:</strong> <span>${t.subject}</span></div>
        <div style="grid-column: span 2; background:#F8FAFC; padding:12px; border-radius:8px; border:1px solid var(--border-color);">
          <strong>Issue Details:</strong>
          <p style="margin:4px 0 0 0; color:var(--text-primary); line-height:1.4;">${escapeHtml(t.damageDescription || t.reason || "No details provided.")}</p>
        </div>
      </div>
      
      <div style="margin-top:16px;">
        <label style="font-size:12px; font-weight:700; color:#374151; display:block; margin-bottom:4px;">Ticket Status</label>
        <select id="detailStatus" style="width:100%; padding:10px; border:1.5px solid var(--border-color); border-radius:8px; outline:none; font-family:inherit; font-size:13px; color:var(--text-primary);">
          <option value="Open" ${t.status === 'Open' ? 'selected' : ''}>Open</option>
          <option value="Pending" ${t.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Resolved" ${t.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
        </select>
      </div>
    `;

    if (isDamage) {
      formHtml += `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#374151; display:block; margin-bottom:4px;">Fine Amount (₹)</label>
            <input type="number" id="detailFineAmount" value="${t.fineAmount || 0}" style="width:100%; padding:10px; border:1.5px solid var(--border-color); border-radius:8px; outline:none; font-family:inherit; font-size:13px; color:var(--text-primary);">
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:#374151; display:block; margin-bottom:4px;">Due Date</label>
            <input type="date" id="detailDueDate" value="${dateVal}" style="width:100%; padding:10px; border:1.5px solid var(--border-color); border-radius:8px; outline:none; font-family:inherit; font-size:13px; color:var(--text-primary);">
          </div>
        </div>
      `;
    }

    formHtml += `
      <div style="margin-top:12px;">
        <label style="font-size:12px; font-weight:700; color:#374151; display:block; margin-bottom:4px;">Remarks / Resolution Notes</label>
        <textarea id="detailRemarks" style="width:100%; height:75px; padding:10px; border:1.5px solid var(--border-color); border-radius:8px; outline:none; resize:vertical; font-family:inherit; font-size:13px; color:var(--text-primary);">${t.remarks || ''}</textarea>
      </div>
    `;

    contentDiv.innerHTML = formHtml;
    document.getElementById("viewTicketModal").style.display = "flex";
  };

  window.closeViewModal = function () {
    document.getElementById("viewTicketModal").style.display = "none";
    activeViewTicketId = null;
  };

  document.getElementById("viewTicketForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!activeViewTicketId) return;

    let db = getDB();
    const idx = db.tickets.findIndex(tk => tk.id === activeViewTicketId);
    if (idx === -1) return;

    const status = document.getElementById("detailStatus").value;
    const remarks = document.getElementById("detailRemarks").value.trim();

    const t = db.tickets[idx];
    t.status = status;
    t.remarks = remarks;

    const fineInput = document.getElementById("detailFineAmount");
    if (fineInput) {
      t.fineAmount = fineInput.value;
    }

    const dateInput = document.getElementById("detailDueDate");
    if (dateInput) {
      t.dueDate = formatInputDateToDBDate(dateInput.value);
    }

    const today = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dateStr = `${String(today.getDate()).padStart(2, "0")} ${months[today.getMonth()]} ${today.getFullYear()}`;
    const timeStr = today.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    t.lastUpdated = `${dateStr}, ${timeStr}`;

    setDB(db);
    showToast(`Ticket ${activeViewTicketId} updated successfully.`, "success");
    closeViewModal();
    renderActiveTickets();
  });

  // Initial runs
  renderActiveTickets();
});
