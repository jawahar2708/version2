/* ========================================
   STUDENT PORTAL – GLOBAL JS
   Shared interactive behavior for all pages
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    const prefs = window.PortalPreferences;
    const sidebar = document.querySelector('.sidebar');

    function isSidebarCollapsibleViewport() {
        return window.innerWidth > 768;
    }

    function isResponsiveIconOnly() {
        return isSidebarCollapsibleViewport() && window.innerWidth <= 992;
    }

    function isSidebarCollapsed() {
        return sidebar && sidebar.classList.contains('collapsed');
    }

    function isSidebarIconOnly() {
        if (!sidebar || !isSidebarCollapsibleViewport()) return false;
        if (isSidebarCollapsed()) return true;
        if (isResponsiveIconOnly()) return true;
        return false;
    }

    function setSidebarCollapsed(collapsed) {
        if (!sidebar || !isSidebarCollapsibleViewport()) return;
        sidebar.classList.toggle('collapsed', collapsed);
        if (prefs) prefs.setSidebarCollapsed(collapsed);
        if (collapsed) {
            closeAllSubmenuFlyouts();
        }
        syncSidebarShrinkToggle();
    }

    function restoreSidebarCollapsed() {
        if (!sidebar || !isSidebarCollapsibleViewport()) return;
        if (prefs && prefs.getSidebarCollapsed()) {
            sidebar.classList.add('collapsed');
        }
        if (prefs) prefs.clearSidebarCollapsedPref();
    }

    function persistThemeForNavigation(link) {
        if (!prefs) return;
        var theme = prefs.getActiveTheme();
        prefs.setTheme(theme);
        if (link && prefs.withThemeInHref) {
            var href = link.getAttribute('href');
            if (href) {
                link.setAttribute('href', prefs.withThemeInHref(href, theme));
            }
        }
    }

    function closeAllSubmenuFlyouts() {
        document.querySelectorAll('.has-submenu.flyout-open, .has-submenu.open').forEach(function(item) {
            item.classList.remove('flyout-open');
            item.classList.remove('open');
        });
    }

    function syncSidebarShrinkToggle() {
        const sidebarShrinkToggle = document.getElementById('sidebarShrinkToggle');
        if (!sidebarShrinkToggle) return;
        const iconOnly = isSidebarIconOnly();
        sidebarShrinkToggle.classList.toggle('active', iconOnly);
        sidebarShrinkToggle.innerHTML = iconOnly
            ? '<i class="fa-solid fa-angles-right"></i>'
            : '<i class="fa-solid fa-bars"></i>';
        sidebarShrinkToggle.title = iconOnly ? 'Expand sidebar' : 'Collapse sidebar';
        sidebarShrinkToggle.setAttribute('aria-label', iconOnly ? 'Expand sidebar' : 'Collapse sidebar');
    }

    function positionSubmenuFlyout(parent) {
        const submenu = parent.querySelector('.submenu');
        const trigger = parent.querySelector('.submenu-toggle');
        if (!submenu || !trigger) return;

        submenu.style.top = '';
        submenu.style.left = '';
        const rect = trigger.getBoundingClientRect();
        const submenuHeight = submenu.offsetHeight || 120;
        const top = Math.min(rect.top, window.innerHeight - submenuHeight - 12);
        submenu.style.top = Math.max(12, top) + 'px';
        submenu.style.left = (rect.right + 8) + 'px';
    }

    restoreSidebarCollapsed();

    if (prefs && prefs.decoratePortalLinks) {
        prefs.decoratePortalLinks(prefs.getActiveTheme());
    }

    window.addEventListener('portal-sidebar-changed', function() {
        if (!sidebar || !isSidebarCollapsibleViewport()) return;
        if (prefs && prefs.getSidebarCollapsed()) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
        closeAllSubmenuFlyouts();
        syncSidebarShrinkToggle();
    });

    window.addEventListener('resize', function() {
        if (!isSidebarCollapsibleViewport() && sidebar) {
            sidebar.classList.remove('collapsed');
            closeAllSubmenuFlyouts();
            if (prefs) prefs.clearSidebarCollapsedPref();
        } else {
            restoreSidebarCollapsed();
            if (prefs) prefs.applySidebarCollapsedPref();
            document.querySelectorAll('.has-submenu.flyout-open').forEach(positionSubmenuFlyout);
        }
        syncSidebarShrinkToggle();
    });

    if (sidebar && !document.getElementById('sidebarShrinkToggle')) {
        const collapseWrap = document.createElement('div');
        collapseWrap.className = 'sidebar-collapse-wrap';
        collapseWrap.innerHTML =
            '<button type="button" class="sidebar-collapse-btn" id="sidebarShrinkToggle" title="Collapse sidebar" aria-label="Collapse sidebar">' +
            '<i class="fa-solid fa-bars"></i>' +
            '</button>';

        const sidebarLogo = sidebar.querySelector('.sidebar-logo');
        if (sidebarLogo) {
            sidebarLogo.insertBefore(collapseWrap, sidebarLogo.firstChild);
        } else {
            sidebar.appendChild(collapseWrap);
        }

        document.getElementById('sidebarShrinkToggle').addEventListener('click', function() {
            setSidebarCollapsed(!isSidebarIconOnly());
        });

        syncSidebarShrinkToggle();
    }

    // Persist theme before navigating to another page
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href]');
        if (!link || !prefs) return;
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.charAt(0) === '#') return;
        if (/^javascript:/i.test(href)) return;
        if (/^https?:\/\//i.test(href)) {
            try {
                const target = new URL(href, window.location.href);
                if (target.origin !== window.location.origin) return;
            } catch (err) {
                return;
            }
        }
        persistThemeForNavigation(link);
        if (prefs.getSidebarCollapsed()) {
            prefs.applySidebarCollapsedPref();
        }
    }, true);

    document.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        const link = e.target.closest('a[href]');
        if (!link || !prefs) return;
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.charAt(0) === '#') return;
        if (/^javascript:/i.test(href)) return;
        persistThemeForNavigation(link);
        if (prefs.getSidebarCollapsed()) {
            prefs.applySidebarCollapsedPref();
        }
    }, true);

    window.addEventListener('beforeunload', function() {
        persistThemeForNavigation();
        if (prefs && prefs.getSidebarCollapsed()) {
            prefs.applySidebarCollapsedPref();
        }
    });

   document.querySelectorAll('.sidebar-footer a, .sidebar a[href="#"]').forEach(function(link) {
    const label = (link.textContent || '').trim().toLowerCase();

    if (label.includes('logout') || label.includes('sign out')) {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Clear session data
            localStorage.removeItem('studentPortalSession');
            sessionStorage.removeItem('studentPortalSession');

            // Redirect to login page
            window.location.href = 'file:///C:/Users/3235115/Downloads/New%20folder/faculty-main%20final%20version/login1.html';
        });
    }
});

    // Mobile drawer / desktop collapse via menu button
    const menuButton = document.querySelector('.menu-btn');
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    if (menuButton && sidebar) {
        menuButton.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
            }
        });
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            closeAllSubmenuFlyouts();
        });
    }

    // Submenu toggle (expanded sidebar + collapsed flyout)
    document.querySelectorAll('.submenu-toggle').forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const parent = this.closest('.has-submenu');
            if (!parent) return;

            if (isSidebarIconOnly()) {
                const willOpen = !parent.classList.contains('flyout-open');
                closeAllSubmenuFlyouts();
                if (willOpen) {
                    parent.classList.add('flyout-open');
                    parent.classList.add('open');
                    requestAnimationFrame(function() {
                        positionSubmenuFlyout(parent);
                    });
                }
            } else {
                parent.classList.toggle('open');
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (!isSidebarIconOnly()) return;
        if (!e.target.closest('.has-submenu')) {
            closeAllSubmenuFlyouts();
        }
    });

    // Dynamic navbar highlighting
    let pageName = window.location.pathname.split('/').pop() || 'dashboard.html';
    if (!pageName || pageName === '') pageName = 'dashboard.html';

    document.querySelectorAll('.sidebar-menu .menu-item').forEach(function(item) {
        item.classList.remove('active');
    });
    document.querySelectorAll('.submenu li').forEach(function(item) {
        item.classList.remove('active');
    });

    document.querySelectorAll('.sidebar-menu a').forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === pageName) {
            const submenuLi = link.closest('.submenu li');
            if (submenuLi) {
                submenuLi.classList.add('active');
                const parentSubmenu = link.closest('.has-submenu');
                if (parentSubmenu && !isSidebarIconOnly()) {
                    parentSubmenu.classList.add('open');
                }
            } else {
                const menuItem = link.closest('.menu-item');
                if (menuItem) menuItem.classList.add('active');
            }
        }
    });

    // Notification panel
    const notifContainer = document.querySelector('.notification-container');
    if (notifContainer) {
        const notifTrigger = notifContainer.querySelector('.notification-trigger') || notifContainer;
        const badge = notifContainer.querySelector('.badge');
        const storageKey = 'studentPortalNotifications';
        const seedNotifications = [
            {
                id: 'notif-stage-1',
                title: 'Stage 1 approved by mentor',
                message: 'Your mentor has reviewed and approved the Stage 1 submission.',
                time: '2 hours ago',
                icon: 'fa-circle-check',
                iconColor: 'var(--success)',
                iconBg: '#dcfce7',
                unread: true
            },
            {
                id: 'notif-feedback',
                title: 'New feedback on your abstract',
                message: 'Please review the comments shared by your faculty mentor.',
                time: '5 hours ago',
                icon: 'fa-comment-dots',
                iconColor: 'var(--primary)',
                iconBg: '#eef2ff',
                unread: true
            },
            {
                id: 'notif-deadline',
                title: 'Stage 3 deadline in 2 days',
                message: 'Plan ahead so the next submission reaches your mentor on time.',
                time: '1 day ago',
                icon: 'fa-clock',
                iconColor: 'var(--warning)',
                iconBg: '#fef3c7',
                unread: false
            }, {
                id: 'notif-feedback',
                title: 'New Damage Report has been recorded by the Lab Incharge',
                message: 'Please visit the Lab Incharge for further Concerns.',
                time: '5 hours ago',
                icon: 'fa-comment-dots',
                iconColor: 'var(--primary)',
                iconBg: '#eef2ff',
                unread: true
            }
        ];
        let notifications = loadNotifications();
        let notifOpen = false;
        let notifPanel = document.querySelector('.notification-panel');
        let notifBackdrop = document.querySelector('.notification-backdrop');

        if (notifications === null) {
            notifications = seedNotifications.slice();
            saveNotifications();
        }

        if (!notifBackdrop) {
            notifBackdrop = document.createElement('div');
            notifBackdrop.className = 'notification-backdrop';
            document.body.appendChild(notifBackdrop);
        }

        if (!notifPanel) {
            notifPanel = document.createElement('div');
            notifPanel.className = 'notification-panel';
            notifPanel.setAttribute('role', 'dialog');
            notifPanel.setAttribute('aria-label', 'Notifications');
            notifPanel.innerHTML = '';
            document.body.appendChild(notifPanel);
        }

        function loadNotifications() {
            try {
                const stored = localStorage.getItem(storageKey);
                if (!stored) return null;
                const parsed = JSON.parse(stored);
                return Array.isArray(parsed) ? parsed : [];
            } catch (err) {
                return null;
            }
        }

        function saveNotifications() {
            localStorage.setItem(storageKey, JSON.stringify(notifications));
        }

        function unreadCount() {
            return notifications.filter(function(item) {
                return item.unread;
            }).length;
        }

        function syncBadge() {
            if (!badge) return;
            const count = unreadCount();
            badge.textContent = count > 99 ? '99+' : String(count);
            badge.style.display = count > 0 ? 'flex' : 'none';
        }

        function renderNotifications() {
            const count = unreadCount();
            const total = notifications.length;
            const listMarkup = notifications.length ? notifications.map(function(item) {
                return '' +
                    '<article class="notification-item ' + (item.unread ? 'unread' : '') + '" data-notification-id="' + item.id + '">' +
                        '<div class="notification-dot" style="opacity:' + (item.unread ? '1' : '0') + '"></div>' +
                        '<div class="notification-icon" style="background:' + item.iconBg + ';color:' + item.iconColor + ';">' +
                            '<i class="fa-solid ' + item.icon + '"></i>' +
                        '</div>' +
                        '<div class="notification-content">' +
                            '<h5>' + item.title + '</h5>' +
                            '<p>' + item.message + '</p>' +
                            '<div class="notification-meta">' +
                                '<span>' + item.time + '</span>' +
                                '<span style="font-weight:700;color:' + (item.unread ? 'var(--primary)' : 'var(--text-muted)') + ';">' + (item.unread ? 'Unread' : 'Read') + '</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="notification-actions">' +
                            '<button type="button" class="notification-action-btn" data-notif-action="toggle-read" title="' + (item.unread ? 'Mark as read' : 'Mark as unread') + '">' +
                                '<i class="fa-solid ' + (item.unread ? 'fa-check' : 'fa-envelope-open') + '"></i>' +
                            '</button>' +
                            '<button type="button" class="notification-action-btn" data-notif-action="delete" title="Delete notification">' +
                                '<i class="fa-solid fa-trash"></i>' +
                            '</button>' +
                        '</div>' +
                    '</article>';
            }).join('') : '' +
                '<div class="notification-empty">' +
                    '<i class="fa-regular fa-bell-slash"></i>' +
                    '<h5>No notifications yet</h5>' +
                    '<p>You are all caught up. New updates will show up here.</p>' +
                '</div>';

            notifPanel.innerHTML = '' +
                '<div class="notification-panel-header">' +
                    '<div class="notification-panel-title">' +
                        '<h4>Notifications</h4>' +
                        '<p>' + total + ' total, ' + count + ' unread</p>' +
                    '</div>' +
                    '<div class="notification-panel-actions">' +
                        '<button type="button" class="notification-mark-all" ' + (count ? '' : 'disabled') + '>Mark all as read</button>' +
                        '<button type="button" class="notification-close" aria-label="Close notifications"><i class="fa-solid fa-xmark"></i></button>' +
                    '</div>' +
                '</div>' +
                '<div class="notification-list">' + listMarkup + '</div>';

            notifPanel.querySelectorAll('.notification-item').forEach(function(itemEl) {
                itemEl.addEventListener('click', function(e) {
                    if (e.target.closest('[data-notif-action]')) return;
                    const notificationId = this.getAttribute('data-notification-id');
                    const notification = notifications.find(function(entry) {
                        return entry.id === notificationId;
                    });
                    if (!notification || !notification.unread) return;
                    notification.unread = false;
                    saveNotifications();
                    renderNotifications();
                });
            });

            const markAllButton = notifPanel.querySelector('.notification-mark-all');
            if (markAllButton) {
                markAllButton.addEventListener('click', function() {
                    notifications.forEach(function(item) {
                        item.unread = false;
                    });
                    saveNotifications();
                    renderNotifications();
                    if (window.showToast) {
                        window.showToast('All notifications marked as read.', 'success');
                    }
                });
            }

            notifPanel.querySelectorAll('[data-notif-action]').forEach(function(button) {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const action = this.getAttribute('data-notif-action');
                    const itemEl = this.closest('.notification-item');
                    if (!itemEl) return;
                    const notificationId = itemEl.getAttribute('data-notification-id');
                    const index = notifications.findIndex(function(entry) {
                        return entry.id === notificationId;
                    });
                    if (index === -1) return;

                    if (action === 'delete') {
                        notifications.splice(index, 1);
                        saveNotifications();
                        renderNotifications();
                        if (window.showToast) {
                            window.showToast('Notification deleted.', 'warning');
                        }
                        return;
                    }

                    notifications[index].unread = !notifications[index].unread;
                    saveNotifications();
                    renderNotifications();
                });
            });

            const closeButton = notifPanel.querySelector('.notification-close');
            if (closeButton) {
                closeButton.addEventListener('click', function() {
                    closeNotifications();
                });
            }

            syncBadge();
        }

        function openNotifications() {
            notifOpen = true;
            renderNotifications();
            notifPanel.classList.add('open');
            notifBackdrop.classList.add('open');
            notifTrigger.setAttribute('aria-expanded', 'true');
        }

        function closeNotifications() {
            notifOpen = false;
            notifPanel.classList.remove('open');
            notifBackdrop.classList.remove('open');
            notifTrigger.setAttribute('aria-expanded', 'false');
        }

        function toggleNotifications(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (notifOpen) {
                closeNotifications();
            } else {
                openNotifications();
            }
        }

        notifTrigger.addEventListener('click', toggleNotifications);
        notifBackdrop.addEventListener('click', closeNotifications);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeNotifications();
            }
        });
        document.addEventListener('click', function(e) {
            if (!notifOpen) return;
            if (notifPanel.contains(e.target) || notifContainer.contains(e.target)) return;
            closeNotifications();
        });

        renderNotifications();
        closeNotifications();
    }

    // Toast system
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    window.showToast = function(message, type) {
        type = type || 'success';
        const toast = document.createElement('div');
        toast.className = 'toast ' + type;
        const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation' };
        toast.innerHTML = '<i class="fa-solid ' + (icons[type] || icons.success) + '"></i> ' + message;
        toastContainer.appendChild(toast);
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(function() { toast.remove(); }, 300);
        }, 3000);
    };

    // Simulates an Angular/Backend HTTP Call globally
    window.mockApiCall = function(success = true, data = {}, delay = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(success) resolve({ status: 200, data });
                else reject({ status: 400, message: 'Server Error' });
            }, delay);
        });
    };

    // Form validation
    window.validateForm = function(form) {
        let isValid = true;
        form.querySelectorAll('.field-error').forEach(function(el) { el.remove(); });
        form.querySelectorAll('[required]').forEach(function(field) {
            field.classList.remove('error-input');
            
            if (!field.value.trim()) {
                isValid = false;
                const error = document.createElement('span');
                error.className = 'field-error';
                error.style.cssText = 'color:var(--danger);font-size:12px;margin-top:4px;display:block;';
                error.textContent = 'This field is required';
                field.parentElement.appendChild(error);
                field.classList.add('error-input');
            }
            if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                isValid = false;
                const error = document.createElement('span');
                error.className = 'field-error';
                error.style.cssText = 'color:var(--danger);font-size:12px;margin-top:4px;display:block;';
                error.textContent = 'Please enter a valid email';
                field.parentElement.appendChild(error);
                field.classList.add('error-input');
            }
        });
        return isValid;
    };
});
