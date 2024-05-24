import { MyGameInstance } from "./pong.js";

let currentSection = null;

function showSection(sectionId) {
	console.log('targetId: ' + sectionId);
	if (sectionId == 'pong')
	{
		MyGameInstance.SendMessage('ball', 'ResumeGame');
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
        const targetId = this.getAttribute('href').substring(1);
        showSection(targetId);
        window.history.pushState({ sectionId: targetId }, "", "#" + targetId);
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
    showSection('home');
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


