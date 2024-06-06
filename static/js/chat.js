document.addEventListener('DOMContentLoaded', function() {
    let currentRoom = null;
    let currentUsername = currentUserUsername; // Assuming you're using Django templating

    function setRoom(room) {
        currentRoom = room;
        document.querySelector('#section-chat').setAttribute('data-room-name', room);
        document.querySelector('#chat-room').style.display = 'block';
        document.querySelector('#room-name').innerText = room;
        fetchMessages();
    }

    function fetchMessages() {
        if (!currentRoom) {
            return;
        }
        var display = $("#display");
        var isAtBottom = display.scrollTop() + display.innerHeight() >= display[0].scrollHeight;
        $.ajax({
            type: 'GET',
            url: '/chat/getMessages/' + currentRoom + '/',
            success: function(response) {
                $("#display").empty();
                for (var key in response.messages) {
                    var rawDate = new Date(response.messages[key].date);
                    var formattedDate = rawDate.toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                    var temp = "<div class='darker'><b class='chat-user'><a href='#' class='user-link'>" + response.messages[key].user + "</a></b><p>" + response.messages[key].value + "</p><span>" + formattedDate + "</span></div>";
                    $("#display").append(temp);
                }
                if (isAtBottom) {
                    $("#display").scrollTop($("#display")[0].scrollHeight);
                }
            },
            error: function(response) {
                console.error('An error occurred while fetching messages', response);
                alert('An error occurred');
            }
        });
    }

    $(document).on('click', '.user-link', function(e) {
        e.preventDefault();
        // Masquer la section de chat
        $('#section-chat').hide();
        // Afficher la section de profil
        $('#profil-chat-ami').show();
    });

    $(document).on('click', '.user-link', function(e) {
        e.preventDefault();
        var username = $(this).text();
        $.ajax({
            type: 'GET',
            url: '/get_user_info/' + username + '/',
            success: function(response) {
                const chatProfil = document.getElementById('profil-chat-ami');
                
				const containerElement = document.createElement('div');
				containerElement.className = 'container';
				containerElement.display = 'block';
				containerElement.style = 'margin-top: 20px;';

                const usernameElement = document.createElement('p');
                usernameElement.textContent = 'Username: ' + response.username;
            
                const totalGamesPlayedElement = document.createElement('p');
                totalGamesPlayedElement.textContent = 'Total games played: ' + response.total_games_played;
            
                const gamesWonElement = document.createElement('p');
                gamesWonElement.textContent = 'Games won: ' + response.games_won;

                const gameAvatar = document.createElement('img');
				gameAvatar.id = 'avatar-img';
				gameAvatar.src = '/static/avatar/' + response.username + '-avatar.png';
				gameAvatar.className = 'avatar small-avatar';
				gameAvatar.onerror = "this.src='/static/avatar/ponguser.png';";
            
                chatProfil.innerHTML = ''; // Pour effacer les éventuels anciens éléments
				chatProfil.appendChild(containerElement);
                containerElement.appendChild(usernameElement);
                containerElement.appendChild(totalGamesPlayedElement);
                containerElement.appendChild(gamesWonElement);
                containerElement.appendChild(gameAvatar);
                
                $('#section-chat').hide();
                chatProfil.style.display = 'block';
            }

        });
    });

    // Call fetchMessages every 500ms
    setInterval(fetchMessages, 500);

    // Set up send message form submission handler
    $('#send-message-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/chat/send',
            data: {
                username: currentUsername,
                room_id: currentRoom,
                message: $('#message').val(),
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function(data) {
                console.log('Message sent successfully:', data);
                $('#message').val('');
            }
        });
    });

    // Automatically join "room1" on page load
    function autoJoinRoom() {
        const roomName = 'room1';
        const username = currentUsername;
        $.ajax({
            type: 'POST',
            url: '/chat/checkview',
            data: {
                room_name: roomName,
                username: username,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function(response) {
                console.log('Room entered successfully:', response);
                setRoom(response.room);
            },
            error: function(response) {
                console.error('An error occurred while entering the room', response);
                alert('An error occurred');
            }
        });
    }

    // Automatically join the room when the page is loaded
    autoJoinRoom();

    // Set up leave form submission handler
    $('#leave-form').on('submit', function(e) {
        e.preventDefault();
        currentRoom = null;
        currentUsername = null;
        document.querySelector('#chat-room').style.display = 'none';
        document.querySelector('#post-form').parentElement.style.display = 'block';
        console.log('Room left successfully:', currentRoom);
    });

    document.getElementById('block-user-button').addEventListener('click', function() {
        const username = document.getElementById('block-username').value;
        if (username) {
            blockUser(username);
        } else {
            alert('Please enter a username to block.');
        }
    });

    // Block User
    function blockUser(username) {
        $.ajax({
            type: 'POST',
            url: '/api/blocked_users/block_user/',
            data: {
                blocked_user: username,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function(response) {
                console.log('User blocked successfully:', response);
                fetchBlockedUsers();
            },
            error: function(response) {
                console.error('An error occurred while blocking the user', response);
            }
        });
    }

    // Unblock User
    function unblockUser(username) {
        $.ajax({
            type: 'POST',
            url: '/api/blocked_users/unblock_user/',
            data: {
                blocked_user: username,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function(response) {
                console.log('User unblocked successfully:', response);
                fetchBlockedUsers();
            },
            error: function(response) {
                console.error('An error occurred while unblocking the user', response);
            }
        });
    }

    // Fetch Blocked Users
    function fetchBlockedUsers() {
        $.ajax({
            type: 'GET',
            url: '/api/blocked_users/',
            success: function(response) {
                console.log('Blocked users fetched successfully:', response);
                updateBlockedUsersUI(response.blocked_users);
            },
            error: function(response) {
                console.error('An error occurred while fetching blocked users', response);
            }
        });
    }

    // Update Blocked Users UI
    function updateBlockedUsersUI(blockedUsers) {
        const blockedUsersList = $('#blocked-users-list');
        blockedUsersList.empty();
        blockedUsers.forEach(user => {
            blockedUsersList.append(`
                <div class="blocked-user">
                    <span>${user.username}</span>
                    <button onclick="unblockUser('${user.username}')">Unblock</button>
                </div>
            `);
        });
    }

    // Adding Block User UI in Chat Section
    $(document).on('click', '.block-user-button', function() {
        const username = $(this).data('username');
        blockUser(username);
    });

    // Initialize Blocked Users List on Load
    fetchBlockedUsers();
});


$(document).ready(function() {
    fetchBlockedUsers();
});