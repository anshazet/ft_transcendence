document.addEventListener('DOMContentLoaded', function() {
    let currentRoom = null;
    let currentUsername = null;

    function setRoom(room, username, roomId) {
        currentRoom = room;
        currentUsername = username;
        document.querySelector('#section-chat').setAttribute('data-room-name', room);
        document.querySelector('#username').value = username;
        document.querySelector('#room_id').value = roomId;
        document.querySelector('#chat-room').style.display = 'block';
        document.querySelector('#room-name').innerText = room;
        fetchMessages();
    }

    function fetchMessages() {
        if (!currentRoom) {
            // console.error('Room name is not defined');
            return;
        }
        var display = $("#display");
        var isAtBottom = display.scrollTop() + display.innerHeight() >= display[0].scrollHeight;
        $.ajax({
            type: 'GET',
            url: '/chat/getMessages/' + currentRoom + '/',
            success: function(response) {
                // console.log('Messages fetched successfully:', response);
                $("#display").empty();
                for (var key in response.messages) {
                    var rawDate = new Date(response.messages[key].date);
                    var formattedDate = rawDate.toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                    var temp = "<div class='darker'><b>" + response.messages[key].user + "</b><p>" + response.messages[key].value + "</p><span>" + formattedDate + "</span></div>";
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

    // Set up post form submission handler to show the chat room
    $('#post-form').on('submit', function(e) {
        e.preventDefault();
        const roomName = $('input[name="room_name"]').val();
        const username = $('input[name="username"]').val();
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
                setRoom(response.room, response.username, response.room_details.id);
            },
            error: function(response) {
                console.error('An error occurred while entering the room', response);
                alert('An error occurred');
            }
        });
    });

    $('#leave-form').on('submit', function(e) {
        e.preventDefault();
        currentRoom = null;
        currentUsername = null;
        document.querySelector('#chat-room').style.display = 'none';
        document.querySelector('#post-form').parentElement.style.display = 'block';
        console.log('Room left successfully:', currentRoom);
    });


	// $('#leave-form').on('submit', function(e) {
    //     e.preventDefault();
	// 	console.log('Room left successfully:', currentRoom);
	// 	currentRoom = null;
	// 	currentUsername = null;
    // });
});
