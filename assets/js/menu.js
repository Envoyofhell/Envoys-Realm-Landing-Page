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

        function toggleMenu() { /* (same as before) */ }
        function closeMenu() { /* (same as before) */ }
        function populateMenuProjectList() { /* (same as before) */ }
        function attachMenuListeners() { /* (same as before) */ }
        function handleMenuClickEvent(event) { /* (same as before) */ }
        function handleMenuSearch(event) { /* (same as before) */ }
        function handleOutsideClick(event) { /* (same as before) */ }


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
                // Fallback: Maybe navigate directly if iframe loading isn't possible
                // window.location.href = project.projectUrl;
                closeMenu();
                return;
            }

            // Directly call the function to load the project into an iframe
            console.log(`Menu: Calling App.loadProjectIframe for ${project.title} (${project.projectUrl})`);
            App.loadProjectIframe(project.projectUrl, project.title, project.id);

            // Close the menu after initiating the load
            closeMenu();
        }


        /**
         * Initializes the menu functionality.
         */
        function init() {
            console.log("Menu: Initializing...");
            if (!getMenuElements()) {
                 console.error("Menu: Initialization failed, essential elements missing.");
                 return;
            }
            populateMenuProjectList(); // Populates and attaches list item listeners
            if (menuToggle) {
                menuToggle.removeEventListener('click', toggleMenu);
                menuToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleMenu();
                });
            }
            document.removeEventListener('click', handleOutsideClick);
            document.addEventListener('click', handleOutsideClick);
             console.log("Menu: Initialization complete.");
        }

        // --- Expose Public Methods via App Namespace ---
        App.Menu = {
            init: init,
            populate: populateMenuProjectList,
            close: closeMenu
        };
        console.log("menu.js: App.Menu module defined.");

    } // End of initializeMenuModule

}(window.App));