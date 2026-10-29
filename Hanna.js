//FÖRSTA DELEN BERÖR AMIRAS PROJEKT

    window.addEventListener('DOMContentLoaded', () => {

    let allProjects = [];
    const container = document.getElementById('project-list');
    const filterInput = document.getElementById('filter-input');
    const sortSelect = document.getElementById('sort-select');
    function renderProjects(projects) {
    container.innerHTML = '';
    projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');
        projectDiv.innerHTML = `
        <h3>${project.title}</h3>
        <p><strong>Kund:</strong> ${project.client}</p>
        <p>${project.description}</p>
        ${project.moreInfo ? `<p><em>${project.moreInfo}</em></p>` : ''}
        `;
        container.appendChild(projectDiv);
    });
    }

    function updateList() {
    const filterText = filterInput.value.toLowerCase();
    let filtered = allProjects.filter(project =>
        project.title.toLowerCase().includes(filterText)
    );
    const sortValue = sortSelect.value;
    if (sortValue === 'title-asc') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === 'title-desc') {
        filtered.sort((a, b) => b.title.localeCompare(a.title));
    }
    renderProjects(filtered);
    }

    axios.get('Hanna.json')
    .then(response => {
    allProjects = response.data;
    renderProjects(allProjects);
    })
    .catch(error => {
    console.error('Fel vid inläsning:', error);
    });

    filterInput.addEventListener('input', updateList);
    sortSelect.addEventListener('change', updateList);
});


//ANDRA DELEN BERÖR AMIRAS BILDSPEL

const slides = document.querySelectorAll('.amira-slides');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
let currentIndex = 0;

function showSlide(index) {
    if (index < 0) {
    currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
    currentIndex = 0;
    } else {
    currentIndex = index;
    }

    slides.forEach(slide => slide.classList.remove('active'));
    slides[currentIndex].classList.add('active');
}

showSlide(currentIndex);

prevBtn.addEventListener('click', () => {
    showSlide(currentIndex - 1);
});

nextBtn.addEventListener('click', () => {
    showSlide(currentIndex + 1);
});


//TREDJE DELEN BERÖR AMIRAS ANIMERADE SKILLBARS

function animateSkillbars() {
    const skillFills = document.querySelectorAll('.skillbar-fill');

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
    animateSkillbars();
});