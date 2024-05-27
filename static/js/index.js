let currentSection = null;

function showSection(sectionId) {
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
    if (btnOpenInscription) {
        const sectionLogin = document.getElementById('ModalForm');
        const modalFormRegister = new bootstrap.Modal(document.getElementById('ModalFormRegister'));

        btnOpenInscription.addEventListener('click', function() {
            if (sectionLogin) {
                sectionLogin.style.display = 'none';
            }
            modalFormRegister.show();
        });
    }

    showSection('home');
});

window.addEventListener('popstate', function(event) {
    const sectionId = event.state && event.state.sectionId ? event.state.sectionId : 'home';
    showSection(sectionId);
});


document.addEventListener('DOMContentLoaded', function() {
    const btnOpenInscription = document.getElementById('btn-open-inscription');
    const sectionLogin = document.getElementById('ModalForm');
    const modalFormRegister = new bootstrap.Modal(document.getElementById('ModalFormRegister'));

    btnOpenInscription.addEventListener('click', function() {
        sectionLogin.style.display = 'none';
        modalFormRegister.show();
    });
});




async function setup2FA() {
    const response = await fetch('/api/2fa/setup/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
    });
    
    const data = await response.json();
    const otpSetupUrl = data.otp_setup_url;
    
    // Display QR code or link to the user for scanning with an authenticator app
}

async function verify2FA(token) {
    const response = await fetch('/api/2fa/verify/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });

    const data = await response.json();
    if (response.ok) {
        // 2FA verified successfully
    } else {
        // Handle error
    }
}