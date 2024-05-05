fetch('postgreserver.json')
    .then(response => response.json())
    .then(jsonData => {
        // Récupérer les informations du serveur
        const serverInfo = jsonData.Servers["1"];

        // Afficher les informations sur la page HTML
        document.getElementById("server-name").textContent = serverInfo.Name;
        document.getElementById("server-port").textContent = serverInfo.Port;
        document.getElementById("server-username").textContent = serverInfo.Username;
        document.getElementById("server-host").textContent = serverInfo.Host;
    })
    .catch(error => console.error('Erreur lors de la récupération du JSON :', error));