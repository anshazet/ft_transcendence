let currentSection = null;

function showSection(sectionId) {
    const current = document.getElementById('section-' + currentSection);
    const target = document.getElementById('section-' + sectionId);
    
    if (current) {
        current.style.display = 'none';
    }
    target.style.display = 'block';
    currentSection = sectionId;
}

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
    const sectionInscription = document.getElementById('ModalFormRegister');

    btnOpenInscription.addEventListener('click', function() {
        sectionLogin.style.display = 'none';
        sectionInscription.style.display = 'block';

    });
});
