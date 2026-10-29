//SKROLL FUNKTIONEN
window.addEventListener('scroll', function () {
    const parallax = document.querySelector('.e-background-img');
    let offset = window.scrollY;
    if (parallax) {
        parallax.style.transform = `translateY(${offset * -0.3}px)`;
    }
});

//JONAS PROJEKT

    window.addEventListener('DOMContentLoaded', () => {

    let allaProjekt = [];
    const container = document.getElementById('jonas-projekt-lista');
    const filterInput = document.getElementById('jonas-filter-input');
    const sortSelect = document.getElementById('jonas-sort-select');

    console.log({ container, filterInput, sortSelect });

    function renderProjects(projektLista) {
    container.innerHTML = '';
    
    projektLista.forEach(projekt => {
        const projektDiv = document.createElement('div');
        
        projektDiv.classList.add('projekt');
        projektDiv.innerHTML = `
        <h3>${projekt.titel}</h3>
        <p><strong>Kund:</strong> ${projekt.klient}</p>
        <p>${projekt.beskrivning}</p>
        ${projekt.info ? `<p><em>${projekt.info}</em></p>` : ''}
        `;
        container.appendChild(projektDiv);
    });
    }
    //FILTER PROJEKT & SORTERING
    function uppdateraLista() {
    const filterText = filterInput.value.toLowerCase();
    let filtrerade = allaProjekt.filter(projekt =>
    
        projekt.titel.toLowerCase().includes(filterText)
    );
    const sortValue = sortSelect.value;
    if (sortValue === 'titel-asc') {
        filtrerade.sort((a, b) => a.titel.localeCompare(b.titel));
    } else if (sortValue === 'titel-desc') {
        filtrerade.sort((a, b) => b.titel.localeCompare(a.titel));
    }
    renderProjects(filtrerade);
    }

    //HÄMTA DATA FRÅN JSON
    axios.get('elliot.json')
    .then(response => {
    allaProjekt = response.data;
    renderProjects(allaProjekt);
    })
    .catch(error => {
    console.error('Fel vid inläsning:', error);
    });

    filterInput.addEventListener('input', uppdateraLista);
    sortSelect.addEventListener('change', uppdateraLista);
});

//JONAS SKILLBARS

function jonasSkillbar() {
    const skillFills = document.querySelectorAll('.skillbar-fyll');


    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.getAttribute('data-fill');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5});

    skillFills.forEach(fill => observer.observe(fill));
}

window.addEventListener('DOMContentLoaded', () => {
    jonasSkillbar();
});

// BILDSPEL

const jonasSlides = document.querySelectorAll('.jonas-bildspel');
const forraBtn = document.getElementById('forra');
const nastaBtn = document.getElementById('nasta');

let jonasCurrentIndex = 0;

function visaSlides(index) {

    if (index < 0) {
    jonasCurrentIndex = jonasSlides.length - 1;
    } else if (index >= jonasSlides.length) {
    jonasCurrentIndex = 0;
    } else {
    jonasCurrentIndex = index;
    }

    jonasSlides.forEach(slide => slide.classList.remove('active'));
    jonasSlides[jonasCurrentIndex].classList.add('active');
}

visaSlides(jonasCurrentIndex);

forraBtn.addEventListener('click', () => {
    visaSlides(jonasCurrentIndex - 1);
});

nastaBtn.addEventListener('click', () => {
    visaSlides(jonasCurrentIndex + 1);
});