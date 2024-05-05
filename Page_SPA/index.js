document.addEventListener("DOMContentLoaded", function() {
    const mainContent = document.getElementById('main-content');
    const cache = {};

    function loadPageContent(pageId) {
        if (cache[pageId]) {
            mainContent.innerHTML = cache[pageId];
        } else {
            fetch(`/Page/${pageId}.html`)
                .then(response => response.text())
                .then(data => {
                    cache[pageId] = data;
                    mainContent.innerHTML = data;
                })
                .catch(error => console.log(error));
        }
    }

    function handleNavigation() {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const pageId = this.getAttribute('href').substring(1);
                loadPageContent(pageId);
                window.history.pushState({pageId}, '', this.href);
            });
        });

        const letsPongLink = document.querySelector('.navbar-brand');
        letsPongLink.addEventListener('click', function(event) {
            event.preventDefault();
            loadPageContent('main-page');
            window.history.pushState({pageId: 'main-page'}, '', 'index.html');
        });
    }

    handleNavigation();

window.addEventListener('popstate', function(event) {
    const currentUrl = window.location.href;
    const currentPageId = getCurrentPageId(currentUrl);
    loadPageContent(currentPageId);
});

function getCurrentPageId(url) {
    if (url.endsWith('/index.html')) {
        return 'main-page';
    }
    else {
        const hashIndex = url.lastIndexOf('#');
        if (hashIndex !== -1) {
            return url.substring(hashIndex + 1);
        }
        return '';
    }
}
    // Charge la page main-page.html initialement
    loadPageContent('main-page');
});
