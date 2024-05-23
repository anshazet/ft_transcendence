document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('section-classement')) {
        loadClassement();
    }
});

function loadClassement() {
    fetch('/classement/')
        .then(response => response.json())
        .then(data => {
            const classementList = document.getElementById('classement-list');
            classementList.innerHTML = ''; // Clear the list first
            data.forEach(player => {
                const playerItem = document.createElement('p');
                playerItem.classList.add('profile-item');
                playerItem.innerHTML = `<span class="profile-label">${player.username}</span>`;
                classementList.appendChild(playerItem);
            });
        })
        .catch(error => {
            console.error('Error fetching classement:', error);
        });
}

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
        if (sectionId === 'classement') {
            loadClassement();
        }
    } else {
        console.error('No section found for:', sectionId);
    }
}
