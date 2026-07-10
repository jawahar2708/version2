/* ==========================================================
   SUPPORT CENTER - Page Specific JS
   Tabs, Modal, Jira-style Ticket Details
========================================================== */

// ── MODAL FUNCTIONS ───────────────────────────────────────
window.openRaiseTicketModal = function () {
    var modal = document.getElementById('ticketModal');

    if (!modal) {
        alert("Modal not found");
        return;
    }

    modal.style.display = "flex";
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
};

window.closeRaiseTicketModal = function () {
    var modal = document.getElementById('ticketModal');
    if (!modal) return;

    modal.style.display = 'none';
};

// ── REOPEN MODAL ──────────────────────────────────────────
window.openReopenTicketModal = function () {
    var modal = document.getElementById('reopenTicketModal');
    if (!modal) return;

    var reasonEl = document.getElementById('reopenReason');
    var errorEl = document.getElementById('reopenReasonError');

    if (reasonEl) reasonEl.value = '';
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
    }

    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';

    if (reasonEl) {
        setTimeout(function () {
            reasonEl.focus();
        }, 0);
    }
};

window.closeReopenTicketModal = function () {
    var modal = document.getElementById('reopenTicketModal');
    if (!modal) return;

    modal.style.display = 'none';
};

// ── CURRENT OPEN TICKET CACHE ─────────────────────────────
window.__openTicketCache = window.__openTicketCache || {};

// Stores activity HTML by ticket id so reopened message stays inside same old ticket
window.__ticketActivityStore = window.__ticketActivityStore || {};

// ── SAFE HTML ─────────────────────────────────────────────
function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeJsString(value) {
    return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// ── TICKET DETAIL ─────────────────────────────────────────
window.openTicketDetail = function (id, subject, status, date) {
    var ticketId = String(id);

    // Hide tabs bar
    var tabsBar = document.querySelector('.support-tabs');
    if (tabsBar) tabsBar.style.display = 'none';

    // Hide all panels
    document.querySelectorAll('.support-panel').forEach(function (panel) {
        panel.classList.remove('active');
        panel.style.display = 'none';
    });

    // Fill ticket details
    var jdId = document.getElementById('jd-id');
    var jdSubject = document.getElementById('jd-subject');
    
    var jdCreated = document.getElementById('jd-created');

    if (jdId) jdId.innerText = '#' + ticketId;
    if (jdSubject) jdSubject.innerText = subject;
    
    if (jdCreated) jdCreated.innerText = date;

    var statusEl = document.getElementById('jd-status');
    if (statusEl) {
        statusEl.innerText = status;
        statusEl.className =
    'status-pill ' +
    (status === 'Pending'
        ? 'pending'
        : status === 'Closed'
            ? 'danger'
            : status === 'Answered'
                ? 'success'
                : 'warning');
    }

    // Cache current ticket
    window.__openTicketCache = {
        id: ticketId,
        subject: subject,
        
        status: status,
        date: date,
        description: document.getElementById('jd-desc')
            ? document.getElementById('jd-desc').innerText
            : ''
    };

    // Restore stored activity thread for this same ticket
    var activityThread = document.getElementById('activity-thread');
    if (activityThread) {
        if (!window.__ticketActivityStore[ticketId]) {
            window.__ticketActivityStore[ticketId] = activityThread.innerHTML;
        } else {
            activityThread.innerHTML = window.__ticketActivityStore[ticketId];
        }
    }

    // Show detail view
    var detail = document.getElementById('ticket-detail');
    if (detail) {
        detail.style.display = 'block';
        detail.classList.add('active');
    }

    // Show reopen button only for resolved/closed tickets
    var reopenBtn = document.getElementById('reopenTicketBtn');
    var reopenHint = document.getElementById('reopenTicketHint');

    var showReopen = status === 'Answered' || status === 'Closed';

    if (reopenBtn) reopenBtn.style.display = showReopen ? 'flex' : 'none';

    if (reopenHint) {
        reopenHint.style.display = showReopen ? 'block' : 'none';
        reopenHint.innerText =
            'Reopening this ticket will move the same ticket back to Active Tickets and add your reopen reason to the Activity Thread.';
    }
};

window.closeTicketDetail = function () {
    var detail = document.getElementById('ticket-detail');

    if (detail) {
        detail.style.display = 'none';
        detail.classList.remove('active');
    }

    var tabsBar = document.querySelector('.support-tabs');
    if (tabsBar) tabsBar.style.display = 'flex';

    var activeTab = document.querySelector('.support-tab[data-tab="active-tickets"]');
    if (activeTab) activeTab.click();
};

// ── ADD NORMAL REPLY ──────────────────────────────────────
window.addReply = function () {
    var replyBox = document.getElementById('reply-box');
    if (!replyBox) return;

    var text = replyBox.value.trim();
    if (!text) return;

    var now = new Date();

    var timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    var dateStr = now.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });

    var safeText = escapeHtml(text);

    var html =
        '<div style="display:flex;gap:16px;margin-top:16px;">' +
            '<div style="width:40px;height:40px;border-radius:50%;background:#e0e7ff;color:#4f46e5;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;">TR</div>' +
            '<div style="flex:1;">' +
                '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
                    '<span style="font-weight:600;font-size:14px;color:#0f172a;">Trainee1 (You)</span>' +
                    '<span style="font-size:12px;color:#64748b;">' + dateStr + ' — ' + timeStr + '</span>' +
                '</div>' +
                '<div style="background:#f1f5f9;padding:12px 16px;border-radius:0 8px 8px 8px;border:1px solid #e2e8f0;font-size:14px;color:#334155;white-space:pre-wrap;">' +
                    safeText +
                '</div>' +
            '</div>' +
        '</div>';

    var activityThread = document.getElementById('activity-thread');
    if (activityThread) {
        activityThread.insertAdjacentHTML('beforeend', html);

        var cache = window.__openTicketCache || {};
        if (cache.id) {
            window.__ticketActivityStore[cache.id] = activityThread.innerHTML;
        }
    }

    replyBox.value = '';
};

// ── DOM READY ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

    // TAB SWITCHING
    var supportTabs = document.querySelectorAll('.support-tab');

    supportTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var target = this.dataset.tab;

            supportTabs.forEach(function (item) {
                item.classList.remove('active');
            });

            document.querySelectorAll('.support-panel').forEach(function (panel) {
                panel.classList.remove('active');
                panel.style.display = 'none';
            });

            this.classList.add('active');

            var panel = document.getElementById(target);
            if (panel) {
                panel.classList.add('active');
                panel.style.display = 'block';
            }
        });
    });

    // RAISE TICKET BUTTON
    var raiseBtn = document.getElementById('raiseTicketBtn');
    if (raiseBtn) {
        raiseBtn.onclick = function () {
            window.openRaiseTicketModal();
        };
    }

    // CLOSE RAISE MODAL BUTTONS
    var closeBtn = document.getElementById('closeTicketModal');
    if (closeBtn) closeBtn.addEventListener('click', window.closeRaiseTicketModal);

    var cancelBtn = document.getElementById('cancelTicketModal');
    if (cancelBtn) cancelBtn.addEventListener('click', window.closeRaiseTicketModal);

    // CLOSE RAISE MODAL ON BACKDROP CLICK
    var ticketModal = document.getElementById('ticketModal');
    if (ticketModal) {
        ticketModal.addEventListener('click', function (event) {
            if (event.target === ticketModal) {
                window.closeRaiseTicketModal();
            }
        });
    }

    // OPEN REOPEN MODAL
    var reopenBtn = document.getElementById('reopenTicketBtn');
    if (reopenBtn) {
        reopenBtn.addEventListener('click', function () {
            window.openReopenTicketModal();
        });
    }

    // CANCEL REOPEN MODAL
    var cancelReopenBtn = document.getElementById('cancelReopenTicketModal');
    if (cancelReopenBtn) {
        cancelReopenBtn.addEventListener('click', function () {
            window.closeReopenTicketModal();
        });
    }

    // CLOSE REOPEN MODAL ON BACKDROP CLICK
    var reopenModal = document.getElementById('reopenTicketModal');
    if (reopenModal) {
        reopenModal.addEventListener('click', function (event) {
            if (event.target === reopenModal) {
                window.closeReopenTicketModal();
            }
        });
    }

    // CONFIRM REOPEN
    var confirmReopenBtn = document.getElementById('confirmReopenTicket');

    if (confirmReopenBtn) {
        confirmReopenBtn.addEventListener('click', function () {
            var cache = window.__openTicketCache || {};

            var reopenReasonEl = document.getElementById('reopenReason');
            var errorEl = document.getElementById('reopenReasonError');

            var reason = reopenReasonEl && reopenReasonEl.value
                ? reopenReasonEl.value.trim()
                : '';

            if (!reason) {
                if (errorEl) {
                    errorEl.textContent = 'Please enter a reason for reopening this ticket.';
                    errorEl.style.display = 'block';
                }
                return;
            }

            if (errorEl) {
                errorEl.textContent = '';
                errorEl.style.display = 'none';
            }

            var now = new Date();

            var timeStr = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });

            var dateStr = now.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            });

            var safeReason = escapeHtml(reason);

            // 1. Add reopen entry inside same old ticket Activity Thread
            var activityThread = document.getElementById('activity-thread');

            if (activityThread) {
                var reopenHtml =
                    '<div style="display:flex;gap:16px;margin-top:16px;">' +
                        '<div style="width:40px;height:40px;border-radius:50%;background:#e0e7ff;color:#4f46e5;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;">TR</div>' +
                        '<div style="flex:1;">' +
                            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap;">' +
                                '<span style="font-weight:600;font-size:14px;color:#0f172a;">Trainee1 (You)</span>' +
                                '<span style="font-size:12px;color:#64748b;">' + dateStr + ' — ' + timeStr + '</span>' +
                                '<span style="background:#eff6ff;color:#1d4ed8;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;">REOPEN</span>' +
                            '</div>' +
                            '<div style="background:#f1f5f9;padding:12px 16px;border-radius:0 8px 8px 8px;border:1px solid #e2e8f0;font-size:14px;color:#334155;white-space:pre-wrap;">' +
                                '<b style="display:block;margin-bottom:6px;color:#0f172a;">Ticket Reopened</b>' +
                                '<div>' + safeReason + '</div>' +
                                '<div style="margin-top:8px;font-size:12px;color:#64748b;font-weight:600;">Reopened by user</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';

                activityThread.insertAdjacentHTML('beforeend', reopenHtml);

                if (cache.id) {
                    window.__ticketActivityStore[cache.id] = activityThread.innerHTML;
                }
            }

            // 2. Update detail page status
            var jdStatus = document.getElementById('jd-status');
            if (jdStatus) {
                jdStatus.innerText = 'In Progress';
                jdStatus.className = 'status-pill warning';
            }

            // 3. Update updated date if element exists
            var jdUpdated = document.getElementById('jd-updated');
            if (jdUpdated) {
                jdUpdated.innerText = dateStr;
            }

            // 4. Hide reopen action because ticket is active again
            var reopenActionBtn = document.getElementById('reopenTicketBtn');
            var reopenHint = document.getElementById('reopenTicketHint');

            if (reopenActionBtn) reopenActionBtn.style.display = 'none';
            if (reopenHint) reopenHint.style.display = 'none';

            // 5. Move same ticket to Active Tickets table
            var activeTbody = document.getElementById('active-tickets-tbody');

            if (activeTbody && cache.id) {
                var idWithHash = '#' + cache.id;
                var existingActiveRow = null;

                Array.from(activeTbody.querySelectorAll('tr')).forEach(function (row) {
                    var firstTd = row.querySelector('td');
                    if (firstTd && firstTd.textContent.trim() === idWithHash) {
                        existingActiveRow = row;
                    }
                });

                var subject = cache.subject || '';
                

                var actionButton =
                    '<button class="btn btn-sm btn-outline" onclick="openTicketDetail(\'' +
                    escapeJsString(cache.id) + '\',\'' +
                    escapeJsString(subject) + '\',\'' +
                    'In Progress' + '\',\'' +
                    escapeJsString(cache.date || dateStr) +
                    '\')">View Details</button>';

                if (existingActiveRow) {
                    var tds = existingActiveRow.querySelectorAll('td');

                    if (tds.length >= 5) {
                        tds[1].textContent = subject;
                        
                        tds[2].innerHTML = '<span class="status-pill warning">In Progress</span>';
                        tds[4].innerHTML = actionButton;
                    }
                } else {
                    var tr = document.createElement('tr');

                    tr.innerHTML =
                        '<td>' + idWithHash + '</td>' +
                        '<td>' + escapeHtml(subject) + '</td>' +
                        
                        '<td><span class="status-pill warning">In Progress</span></td>' +
                        '<td>' + escapeHtml(cache.date || dateStr) + '</td>' +
                        '<td>' + actionButton + '</td>';

                    activeTbody.prepend(tr);
                }
            }

            // 6. Remove same ticket from Resolved Tickets table
            var resolvedPanel = document.getElementById('answered-queries');

            if (resolvedPanel && cache.id) {
                var resolvedTbody = resolvedPanel.querySelector('tbody');

                if (resolvedTbody) {
                    Array.from(resolvedTbody.querySelectorAll('tr')).forEach(function (row) {
                        var firstTd = row.querySelector('td');

                        if (firstTd && firstTd.textContent.trim() === '#' + cache.id) {
                            row.remove();
                        }
                    });
                }
            }

            // 7. Update cache
            window.__openTicketCache.status = 'In Progress';

            // 8. Close only reopen modal, keep old ticket detail visible
            window.closeReopenTicketModal();
        });
    }

    // RAISE NEW TICKET FORM SUBMIT
    var form = document.getElementById('ticketFormModal');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var subjectEl = document.getElementById('tm-subject');
            

            var subject = subjectEl ? subjectEl.value.trim() : '';
            

            

            var id = 'TKT-' + (Math.floor(Math.random() * 900) + 100);

            var dateStr = new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            });

            var tr = document.createElement('tr');

            tr.innerHTML =
                '<td>#' + id + '</td>' +
                '<td>' + escapeHtml(subject) + '</td>' +
                
                '<td><span class="status-pill warning">In Progress</span></td>' +
                '<td>' + dateStr + '</td>' +
                '<td>' +
                    '<button class="btn btn-sm btn-outline" onclick="openTicketDetail(\'' +
                    escapeJsString(id) + '\',\'' +
                    escapeJsString(subject) + '\',\'' +
                    '\',\'In Progress\',\'' +
                    escapeJsString(dateStr) +
                    '\')">View Details</button>' +
                '</td>';

            var tbody = document.getElementById('active-tickets-tbody');
            if (tbody) tbody.prepend(tr);

            form.reset();
            window.closeRaiseTicketModal();

            var activeTab = document.querySelector('.support-tab[data-tab="active-tickets"]');
            if (activeTab) activeTab.click();
        });
    }
});