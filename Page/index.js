const route = (event) => {
    event.preventDefault();
    const targetUrl = event.target.getAttribute('href');
    window.history.pushState({}, "", targetUrl);
    handleLocation();
};

const routes = {
    "/": "index.html",
    "/tournoi": "/tournoi.html",
    "/connexion": "/connexion.html",
    "/classement": "/classement.html",
    "/404": "/404.html",
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const routePath = routes[path] || routes["/404"];
    const html = await fetch(routePath).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();