document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const csrftoken = getCookie('csrftoken');
    fetch('/register/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(data.success);
        } else {
            console.error(data.error);
        }
    })
    .catch(error => {
        console.error('Erreur lors de la requête:', error);
    });
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            $('#ModalForm').modal('hide');
            console.log(data.success);
        } else {
            console.error(data.error);
        }
    })
    
    .catch(error => {
        console.error('Erreur lors de la requête:', error);
    });
});

function loadUserInfo() {
    fetch('/api/user/info', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken') 
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.username) {
            // Si l'utilisateur est connecté, mettez à jour le contenu de la barre de navigation avec son pseudo
            document.getElementById('user-info').innerText = data.username;
        } else {
            // Si l'utilisateur n'est pas connecté, affichez le bouton de connexion
            document.getElementById('ModalForm').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Erreur lors du chargement des informations utilisateur:', error);
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');