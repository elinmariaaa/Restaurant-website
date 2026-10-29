
//BILDSPEL
const slides = document.querySelectorAll('.slideshow .slides img');
let currentSlide = 0;

function showSlide(index) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

function showNextSlide() {
    showSlide(currentSlide + 1);
}
function showPrevSlide() {
    showSlide(currentSlide - 1);
}

const prevBtn = document.querySelector('.slideshow-wrapper .prev');
const nextBtn = document.querySelector('.slideshow-wrapper .next');

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        showPrevSlide();
    });

    nextBtn.addEventListener('click', () => {
        showNextSlide();
    });
}

//SKILLBARS

document.addEventListener("DOMContentLoaded", () => {
    const progresses = document.querySelectorAll(".progress");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target;

                const targetWidth = progress.getAttribute('data-width') || '90%';


                progress.style.transition = "width 2s ease-in-out";
                progress.style.width = targetWidth;
                observer.unobserve(progress);

            }
        });
    }, { threshold: 0.1 });

    progresses.forEach(progress => {
        observer.observe(progress);

    });
});

//PROJEKTLISTA

const projektsContainer = document.getElementById('projekt-lista');
const sokInput = document.getElementById('projekt-sok');
const sortSelect = document.getElementById('sortera-projekt');

let allProjects = [];

axios.get('Elin/sofia-projects.json')
    .then(response => {
        allProjects = response.data;
        filterAndRender(allProjects);
    })
    .catch(error => console.error('Error loading projects:', error));

function renderProjects(projects) {
    projektsContainer.innerHTML = "";

    if (projects.length === 0) {
        projektsContainer.innerHTML = "<p>Inga projekt hittades</p>";
        return;
    }

    projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('projektLista');

        const title = document.createElement('h3');
        title.textContent = project.title;

        const client = document.createElement('p');
        client.innerHTML = `<strong>Client:</strong> ${project.client}`;

        const description = document.createElement('p');
        description.textContent = project.description;


        projectDiv.appendChild(title);
        projectDiv.appendChild(client);
        projectDiv.appendChild(description);

        projektsContainer.appendChild(projectDiv);
    });
}

function filterAndRender() {
    const query = sokInput.value.toLowerCase();
    let filtered = allProjects.filter(p => p.title.toLowerCase().includes(query));

    if (sortSelect.value === 'az') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortSelect.value === 'za') {
        filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    renderProjects(filtered);
}

sokInput.addEventListener('input', filterAndRender);
sortSelect.addEventListener('change', filterAndRender);
