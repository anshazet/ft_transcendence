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
            window.location.reload();
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
            window.location.reload();
            console.log(data.success);
        } else {
            console.error(data.error);
        }
    })
    
    .catch(error => {
        console.error('Erreur lors de la requête:', error);
    });
});



document.getElementById('logout-button').addEventListener('click', function(event) {
    fetch('/logout/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Déconnexion réussie');
            window.location.reload();
        } else {
            console.error('Erreur lors de la déconnexion:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Erreur lors de la requête de déconnexion:', error);
    });
});

document.getElementById('update-user-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    fetch('/update_user_info/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => {
        window.location.reload();
        response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Informations utilisateur mises à jour avec succès.');
        } else {
            console.error('Erreur lors de la mise à jour des informations utilisateur:', data.error);
        }
    })
    .catch(error => {
        console.error('Erreur lors de la requête:', error);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const otpForm = document.getElementById('otpForm');
    
    // Check if the form exists before adding the event listener
    if (!otpForm) {
        console.error("OTP form not found on the page.");
        return;
    }

    // Flag to prevent multiple submissions
    let isSubmitting = false;

    otpForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Prevent form submission if a request is already in progress
        if (isSubmitting) {
            return;
        }

        isSubmitting = true;
        
        const formData = new FormData(otpForm);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', otpForm.action, true);
        xhr.setRequestHeader('X-CSRFToken', formData.get('csrfmiddlewaretoken'));
        
        xhr.onload = function() {
            isSubmitting = false; // Reset the flag on request completion

            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    alert('OTP verified successfully!');
                } else {
                    alert(response.error_message);
                }
            } else {
                alert('An error occurred while verifying the OTP.');
            }
        };

        xhr.onerror = function() {
            isSubmitting = false; // Reset the flag on request error
            alert('An error occurred while making the request.');
        };
        
        xhr.send(formData);
    });
});

// document.addEventListener('DOMContentLoaded', function() {
//     var form = document.getElementById('avatar-upload-form');
//     form.addEventListener('submit', function(event) {
//         event.preventDefault();
        
//         var formData = new FormData(form);
        
//         fetch('/upload_avatar/', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': getCookie('csrftoken')
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Error uploading avatar');
//             }
//             console.log('Avatar uploaded successfully.');
//             window.location.reload();
//         })
//         .catch(error => {
//             console.error('Error uploading avatar:', error.message);
//         });
//     });
// });

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

// document.getElementById('2fa-form').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const otp_token = document.getElementById('otp-token').value;
//     const csrftoken = getCookie('csrftoken');

//     fetch('/verify_otp/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'X-CSRFToken': csrftoken
//         },
//         body: `otp_token=${encodeURIComponent(otp_token)}`
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             localStorage.setItem('access', data.access);
//             localStorage.setItem('refresh', data.refresh);
//             window.location.reload();
//         } else {
//             console.error(data.error_message);
//             alert(data.error_message);  // Add alert for user feedback
//         }
//     })
//     .catch(error => {
//         console.error('Erreur lors de la requête:', error);
//     });
// });


document.getElementById('2fa-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const otp_token = document.getElementById('otp-token').value;
    const csrftoken = getCookie('csrftoken');

    console.debug('Submitting 2FA form with token:', otp_token);
    console.debug('CSRF Token:', csrftoken);

    fetch('/verify_otp/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrftoken
        },
        body: new URLSearchParams({
            'otp_token': otp_token
        })
    })
    .then(response => response.json())
    .then(data => {
        console.debug('Response from /verify_otp:', data);
        if (data.success) {
            localStorage.setItem('access', data.access);
            localStorage.setItem('refresh', data.refresh);
            window.location.reload();
        } else {
            console.error('Error:', data.error_message);
            alert(data.error_message);  // Add alert for user feedback
        }
    })
    .catch(error => {
        console.error('Erreur lors de la requête:', error);
    });
});

// document.getElementById('2fa-modal-form').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const otp_token = document.getElementById('otp-token-modal').value;

//     fetch('/verify_otp/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'X-CSRFToken': getCookie('csrftoken')
//         },
//         body: `otp_token=${encodeURIComponent(otp_token)}`
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             localStorage.setItem('access', data.access);
//             localStorage.setItem('refresh', data.refresh);
//             window.location.reload();
//         } else {
//             console.error(data.error_message);
//         }
//     })
//     .catch(error => {
//         console.error('Erreur lors de la requête:', error);
//     });
// });


document.getElementById('2fa-modal-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const otp_token = document.getElementById('otp-token-modal').value;
    const csrftoken = getCookie('csrftoken');

    console.debug('Submitting 2FA modal form with token:', otp_token);

    fetch('/verify_otp/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrftoken
        },
        body: new URLSearchParams({
            'otp_token': otp_token
        })
    })
    .then(response => {
        console.debug('Response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.debug('Response from /verify_otp (modal):', data);
        if (data.success) {
            localStorage.setItem('access', data.access);
            localStorage.setItem('refresh', data.refresh);
            window.location.reload();
        } else {
            console.error('Error:', data.error_message);
        }
    })
    .catch(error => {
        console.error('Erreur lors de la requête:', error);
    });
});