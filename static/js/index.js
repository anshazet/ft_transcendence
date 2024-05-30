import { MyGameInstance } from "./pong.js";

let currentSection = null;

function showSection(sectionId) {
	console.log('targetId: ' + sectionId);
	if (sectionId == 'pong')
	{
		MyGameInstance.SendMessage('ball', 'ResumeGame');
		MyGameInstance.SendMessage('Button', 'SetActive', 0);
	} else
	{
		MyGameInstance.SendMessage('ball', 'PauseGame');
	}
    const current = document.querySelector('.current-section');
    if (current) {
        current.classList.remove('current-section');
        current.style.display = 'none';
    }
    const target = document.getElementById('section-' + sectionId);
    if (target) {
        target.classList.add('current-section');
        target.style.display = 'block';
    } else {
        console.error('No section found for:', sectionId);
    }
}

document.querySelectorAll('.nav-link').forEach(function(anchor) {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
        const href = this.getAttribute('href');
        if (href) {
            const targetId = href.substring(1);
            showSection(targetId);
            window.history.pushState({ sectionId: targetId }, "", "#" + targetId);
        }
    });
});

window.addEventListener('popstate', function(event) {
    const sectionId = event.state && event.state.sectionId ? event.state.sectionId : 'home';
    showSection(sectionId);
});

showSection('home');

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-link').forEach(function(anchor) {
        anchor.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    const btnOpenInscription = document.getElementById('btn-open-inscription');
    const sectionLogin = document.getElementById('ModalForm');
    const modalFormRegister = new bootstrap.Modal(document.getElementById('ModalFormRegister'));

    if (btnOpenInscription) {
        btnOpenInscription.addEventListener('click', function() {
            if (sectionLogin) {
                sectionLogin.style.display = 'none';
            }
            modalFormRegister.show();
        });
    }

    showSection('home');
});


async function refreshToken() {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) {
        console.error('No refresh token found');
        return null;
    }

    const response = await fetch('/api/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('access', data.access);
        console.debug('Token refreshed successfully');
        return data.access;
    } else {
        console.error('Failed to refresh token:', data);
        return null;
    }
}


async function setup2FA() {
    console.debug('Starting 2FA setup process');
    
    let accessToken = localStorage.getItem('access');
    if (!accessToken) {
        console.error('No access token found');
        return;
    }

    console.debug('Using access token:', accessToken);

    let response = await fetch('/api/2fa/setup/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (response.status === 401) {
        console.warn('Access token might be expired. Attempting to refresh token.');
        accessToken = await refreshToken();
        if (accessToken) {
            response = await fetch('/api/2fa/setup/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
        }
    }

    const data = await response.json();
    console.debug('Response from /api/2fa/setup:', data);

    if (response.ok) {
        const otpSetupUrl = data.otp_setup_url;
        console.debug('OTP setup URL:', otpSetupUrl);
        // Display QR code or link to the user for scanning with an authenticator app
    } else {
        console.error('Failed to setup 2FA:', data);
    }
}

async function verify2FA(token) {
    console.debug('Starting 2FA verification with token:', token);

    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
        console.error('No access token found');
        return;
    }

    console.debug('Using access token:', accessToken);

    const response = await fetch('/api/2fa/verify/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });

    const data = await response.json();
    console.debug('Response from /api/2fa/verify:', data);

    if (response.ok) {
        console.debug('2FA verified successfully');
    } else {
        console.error('2FA verification failed:', data);
    }
}

// old version with problem 2fa
// async function setup2FA() {
//     console.debug('Starting 2FA setup process');

//     const response = await fetch('/api/2fa/setup/', {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${localStorage.getItem('access')}`,
//         },
//     });

//     const data = await response.json();
//     console.debug('Response from /api/2fa/setup:', data);

//     if (response.ok) {
//         const otpSetupUrl = data.otp_setup_url;
//         console.debug('OTP setup URL:', otpSetupUrl);
//         // Display QR code or link to the user for scanning with an authenticator app
//         alert(`Scan this QR code URL with your authenticator app: ${otpSetupUrl}`);
//     } else {
//         console.error('Failed to setup 2FA:', data);
//     }
// }

// async function verify2FA(token) {
//     console.debug('Starting 2FA verification with token:', token);

//     const response = await fetch('/api/2fa/verify/', {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${localStorage.getItem('access')}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ token }),
//     });

//     const data = await response.json();
//     console.debug('Response from /api/2fa/verify:', data);

//     if (response.ok) {
//         console.debug('2FA verified successfully');
//         alert('2FA verified successfully!');
//     } else {
//         console.error('2FA verification failed:', data);
//         alert(`2FA verification failed: ${data.error}`);
//     }
// }

// // Example of how you might trigger the 2FA setup process
// document.getElementById('verify-email-button').addEventListener('click', function(event) {
//     setup2FA();
// });
