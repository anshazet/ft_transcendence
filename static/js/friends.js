document.addEventListener('DOMContentLoaded', function () {
    const sendFriendRequestBtn = document.getElementById('send-friend-request');
    const friendUsernameInput = document.getElementById('friend-username');
    const friendRequestsDiv = document.getElementById('friend-requests');
    const pendingFriendRequestsDiv = document.getElementById('pending-friend-requests');

    sendFriendRequestBtn.addEventListener('click', function () {
        const username = friendUsernameInput.value;
        if (username) {
            sendFriendRequest(username);
        } else {
            alert('Veuillez entrer un nom d\'utilisateur.');
        }
    });

    function sendFriendRequest(username) {
        fetch(`/send_friend_request/${username}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Demande d\'ami envoyée avec succès.');
                loadPendingFriendRequests();
            } else {
                alert(data.error || 'Une erreur est survenue.');
            }
        });
    }

    function loadFriendRequests() {
        fetch('/friend_requests/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            friendRequestsDiv.innerHTML = '';
            data.friend_requests.forEach(request => {
                const requestDiv = document.createElement('div');
                requestDiv.className = 'friend-request';
                requestDiv.innerHTML = `
                    <p>${request.from_user__username} vous a envoyé une demande d'ami.</p>
                    <button class="accept-request" data-id="${request.id}">Accepter</button>
                    <button class="decline-request" data-id="${request.id}">Refuser</button>
                `;
                friendRequestsDiv.appendChild(requestDiv);
            });

            document.querySelectorAll('.accept-request').forEach(button => {
                button.addEventListener('click', function () {
                    handleFriendRequest(this.dataset.id, 'accept');
                });
            });

            document.querySelectorAll('.decline-request').forEach(button => {
                button.addEventListener('click', function () {
                    handleFriendRequest(this.dataset.id, 'decline');
                });
            });
        });
    }

    function loadPendingFriendRequests() {
        fetch('/pending_friend_requests/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            pendingFriendRequestsDiv.innerHTML = '';
            data.pending_requests.forEach(request => {
                const requestDiv = document.createElement('div');
                requestDiv.className = 'pending-friend-request';
                requestDiv.innerHTML = `<p>Demande envoyée à ${request.to_user__username}</p>`;
                pendingFriendRequestsDiv.appendChild(requestDiv);
            });
        });
    }

    function handleFriendRequest(requestId, action) {
        fetch(`/${action}_friend_request/${requestId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Demande d\'ami ' + (action === 'accept' ? 'acceptée' : 'refusée') + '.');
                loadFriendRequests();
                loadPendingFriendRequests();
            } else {
                alert(data.error || 'Une erreur est survenue.');
            }
        });
    }

    function updateFriendList() {
        fetch('/list_friends_with_status/')
            .then(response => response.json())
            .then(data => {
                const friendListDiv = document.getElementById('friend-list');
                const friends = data.friends;

                if (friends.length === 0) {
                    friendListDiv.innerHTML = '<p>Aucun ami pour le moment.</p>';
                } else {
                    const ul = document.createElement('ul');
                    friends.forEach(friend => {
                        const li = document.createElement('li');
                        li.textContent = `${friend.username} - ${friend.is_online ? 'En ligne' : 'Hors ligne'}`;
                        ul.appendChild(li);
                    });
                    friendListDiv.innerHTML = '';
                    friendListDiv.appendChild(ul);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de la liste des amis:', error);
            });
    }

    setInterval(updateFriendList, 5000);

    function updateOnlineStatus(isOnline) {
        fetch('/update_online_status/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': '{{ csrf_token }}'  // Assurez-vous d'avoir le jeton CSRF disponible dans votre template Django
            },
            body: 'is_online=' + isOnline
        })
        .then(response => response.json())
        .then(data => {
            // Gérer la réponse du serveur si nécessaire
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour du statut de connexion:', error);
        });
    }

    window.addEventListener('beforeunload', () => {
        fetch('/update_online_status/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: 'is_online=false'
        })
        .then(response => response.json())
        .then(data => {
            // Gérer la réponse du serveur si nécessaire
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour du statut de connexion:', error);
        });
    });

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

    // Charger les demandes d'amis au chargement de la page
    loadFriendRequests();
    loadPendingFriendRequests();
});
