// assets/js/menu.js

(function(App) {
    if (!App) {
        console.error("CRITICAL: App namespace not found when menu.js executed. Check script order in HTML.");
        setTimeout(() => {
            if (!window.App) {
                 console.error("CRITICAL: App namespace still not found after delay.");
                 return;
            }
            initializeMenuModule(window.App);
        }, 0);
        return;
    }
    initializeMenuModule(App);

    function initializeMenuModule(App) {
        console.log("menu.js: Defining App.Menu module...");
        let menu, menuToggle, menuProjectList, menuSearchInput;

        function getMenuElements() {
             menu = document.getElementById('menu');
             menuToggle = document.getElementById('menu-toggle');
             menuProjectList = document.getElementById('menu-project-list');
             menuSearchInput = menu ? menu.querySelector('input[type="text"]') : null;
             if (!menu || !menuToggle || !menuProjectList) {
                  console.warn("Menu elements not found. Menu functionality might be limited.");
                  return false;
             }
             return true;
        }

        function toggleMenu() {
            if (!menu || !menuToggle) return;
            menu.classList.toggle('open');
            menuToggle.textContent = menu.classList.contains('open') ? 'Close' : 'Menu';
            if (menu.classList.contains('open') && menuSearchInput) {
               setTimeout(() => menuSearchInput.focus(), 100);
            }
        }

        function closeMenu() {
            if (!menu || !menuToggle) return;
            if (menu.classList.contains('open')) {
                menu.classList.remove('open');
                menuToggle.textContent = 'Menu';
            }
        }

        /**
         * Populates the project list in the menu using App.projects.
         */
        function populateMenuProjectList() {
            console.log("Menu: Attempting to populate project list...");
            // Ensure elements and data are ready
            // **FIX:** Use the result of getMenuElements()
            if (!getMenuElements() || !menuProjectList) {
                 console.error("Menu: Cannot populate list, menuProjectList element not found.");
                 return false; // Indicate failure
            }
             if (!App.projects) {
                 console.warn("Menu: App.projects not available yet. Cannot populate list.");
                 menuProjectList.innerHTML = '<li class="text-gray-500 italic p-2">Waiting for projects...</li>';
                 return false; // Indicate failure
             }

            menuProjectList.innerHTML = ''; // Clear existing items

            if (App.projects.length === 0) {
                menuProjectList.innerHTML = '<li class="text-gray-500 italic p-2">No projects found.</li>';
                return true; // Successfully populated (with empty message)
            }
            console.log(`Menu: Populating with ${App.projects.length} projects.`);

            // Create list items from project data
            App.projects.forEach(project => {
                const li = document.createElement('li');
                li.setAttribute('data-target-card', project.id);
                li.className = 'menu-item'; // Add a class for easier selection

                let iconHtml = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 flex-shrink-0">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5.05 14.06a2.25 2.25 0 0 0 0 3.182l4.95 4.95a2.25 2.25 0 0 0 3.182 0l4.95-4.95a2.25 2.25 0 0 0 0-3.182l-4.4-4.4a2.25 2.25 0 0 1-.659-1.591V3.104m6.364 6.364l-1.06-1.06" />
                    </svg>`; // Default project icon

                if (project.iconUrl) {
                    iconHtml = `<img src="${project.iconUrl}" alt="" class="w-5 h-5 flex-shrink-0 object-contain" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
                                <span style="display:none;">${iconHtml}</span>`; // Fallback SVG
                } else if (project.icon) {
                    iconHtml = project.icon.replace('<svg', '<svg class="w-5 h-5 flex-shrink-0"');
                }

                const titleSpan = document.createElement('span');
                titleSpan.textContent = project.title;

                li.innerHTML = iconHtml;
                li.appendChild(titleSpan);
                menuProjectList.appendChild(li);
            });

            // After populating, re-attach listeners to the new items
            attachMenuListeners();
            console.log("Menu: Project list populated and listeners attached.");
            return true; // Indicate success
        }

        /**
         * Attaches click event listeners to all menu items.
         * Uses event delegation on the parent list for efficiency.
         */
        function attachMenuListeners() {
            if (!menuProjectList) {
                 console.warn("Menu: Cannot attach listeners, menuProjectList not found.");
                 return;
            }
            // console.log("Menu: Attaching listeners..."); // Can be noisy

            // Remove existing listener to prevent duplicates
            menuProjectList.removeEventListener('click', handleMenuClickEvent);
            menuProjectList.addEventListener('click', handleMenuClickEvent);

            if (menuSearchInput) {
                 menuSearchInput.removeEventListener('input', handleMenuSearch);
                 menuSearchInput.addEventListener('input', handleMenuSearch);
            }
        }

        /**
         * Handles click events delegated from the menuProjectList.
         * @param {Event} event - The click event object.
         */
        function handleMenuClickEvent(event) {
            // console.log("Menu: Click detected inside project list.");
            const clickedItem = event.target.closest('li.menu-item, li a');

            if (!clickedItem) {
                 // console.log("Menu: Click was not on a relevant item.");
                 return;
            }

            // Handle clicks on project items
            const targetCardId = clickedItem.closest('li')?.getAttribute('data-target-card');
            if (targetCardId) {
                console.log(`Menu: Project item clicked, target card: ${targetCardId}`);
                handleProjectItemClick(clickedItem.closest('li'), targetCardId);
                return;
            }

            // Handle clicks on navigation links
            const link = clickedItem.closest('a');
            if (link && link.classList.contains('internal-link')) {
                 console.log(`Menu: Internal navigation link clicked: ${link.getAttribute('href')}`);
                 // SPA navigation is handled by the global listener in links_page.js
                 closeMenu(); // Just close the menu
            } else if (link && link.getAttribute('href') && link.getAttribute('href') !== '#') {
                 console.log(`Menu: Regular link clicked: ${link.getAttribute('href')}`);
                 // Allow default browser navigation for external links or non-SPA links
                 closeMenu();
            }
        }


        /**
         * Handles clicks specifically on project items in the menu.
         * @param {HTMLElement} itemElement - The clicked LI element.
         * @param {string} targetCardId - The ID of the project/card to load.
         */
        function handleProjectItemClick(itemElement, targetCardId) {
            console.log(`Menu: Handling project item click for: ${targetCardId}`);
            // Highlight the selected item
            if (menuProjectList) {
                 const allItems = menuProjectList.querySelectorAll('li');
                 allItems.forEach(el => el.classList.remove('selected'));
                 itemElement.classList.add('selected');
            }

            // Find the project data associated with the clicked item ID
            const project = App.projects?.find(p => p.id === targetCardId);

            if (!project) {
                 console.error(`Menu: Could not find project data for ID: ${targetCardId}`);
                 closeMenu();
                 return;
            }

            // Check if the iframe loader function exists
            if (typeof App.loadProjectIframe !== 'function') {
                console.error("Menu Error: App.loadProjectIframe function is not available!");
                closeMenu();
                return;
            }

            // Directly call the function to load the project into an iframe
            console.log(`Menu: Calling App.loadProjectIframe for ${project.title} (${project.projectUrl})`);
            App.loadProjectIframe(project.projectUrl, project.title, project.id);

            // Close the menu after initiating the load
            closeMenu();
        }


        function handleMenuSearch(event) {
             if (!menuProjectList) return; // Check element exists
            const searchTerm = event.target.value.toLowerCase().trim();
            const allItems = menuProjectList.querySelectorAll('li');

            allItems.forEach(item => {
                const itemText = item.textContent.toLowerCase();
                const isProjectItem = item.hasAttribute('data-target-card');
                const isNavLink = item.querySelector('a');
                const isPlaceholder = item.classList.contains('text-gray-500');

                if (isProjectItem || isNavLink) {
                    item.style.display = itemText.includes(searchTerm) ? '' : 'none';
                } else if (isPlaceholder) {
                     item.style.display = searchTerm ? 'none' : ''; // Hide placeholder if searching
                }
            });
        }

        /**
         * Initializes the menu functionality.
         */
        function init() {
            console.log("Menu: Initializing...");
            // **FIX:** Ensure elements are found before proceeding
            if (!getMenuElements()) {
                 console.error("Menu: Initialization failed, essential elements missing.");
                 return;
            }

            // **FIX:** Call populate and check success
            const populated = populateMenuProjectList();
            if (!populated) {
                 console.warn("Menu: Initialization may be incomplete as project list failed to populate.");
                 // Still attach button/outside click listeners
            }

            // Toggle Button Listener
            if (menuToggle) {
                menuToggle.removeEventListener('click', toggleMenu); // Prevent duplicates
                menuToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleMenu();
                });
            }

            // Click outside to close menu listener (attached to document)
            document.removeEventListener('click', handleOutsideClick); // Prevent duplicates
            document.addEventListener('click', handleOutsideClick);
             console.log("Menu: Initialization complete.");
        }

        /**
         * Handles clicks outside the menu to close it.
         */
         function handleOutsideClick(event) {
             // Check elements exist before using them
             if (menu && menuToggle && menu.classList.contains('open') && !menu.contains(event.target) && event.target !== menuToggle) {
                 closeMenu();
             }
         }

        // --- Expose Public Methods via App Namespace ---
        App.Menu = {
            init: init,
            populate: populateMenuProjectList, // Expose if needed externally
            close: closeMenu
        };
        console.log("menu.js: App.Menu module defined.");

    } // End of initializeMenuModule

}(window.App));