
async function readDataJson() {
    const response = await axios.get('Simon/data.json');
    return response.data;
}


function createHeader(data) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'header';
    headerDiv.innerHTML = `
        <h1>${data.name}</h1>
        <p><strong>${data.title}</strong></p>
        <p>📧 ${data.email} | 📱 ${data.phone}</p>
        <p class="summary">${data.summary}</p>
    `;
    return headerDiv;
}

function createProfileImage() {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'profile-image';
    imageDiv.innerHTML = `<img src="ImagesContacts/ErikH.png" alt="Profile Picture">`;
    return imageDiv;
}


function createSkillsSection(skills, certifications) {
    const skillsDiv = document.createElement('div');
    skillsDiv.className = 'skills';

    const skillsHTML = skills.map((skill, index) => `
        <div style="display: flex; align-items: center; margin: 8px 0;">
            <span style="display: inline-block; background: #006341; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.9em; min-width: 160px;">
                ${skill.name}
            </span>
            <div style="flex: 1; margin-left: 10px; background: #ddd; border-radius: 6px; height: 16px; overflow: hidden;">
                <div class="skill-bar" data-level="${skill.level}" style="background: #006341; width: 0%; height: 100%; border-radius: 6px;"></div>
            </div>
 
        </div>
    `).join('');

    const certificationsHTML = certifications.map(cert => `<p>🏅 ${cert}</p>`).join('');

    skillsDiv.innerHTML = `
        <h2>🛠️ Kompetenser</h2>
        <div style="line-height: 1.8;">${skillsHTML}</div>
        <h2 style="margin-top: 25px;">🎓 Certifieringar</h2>
        ${certificationsHTML}
    `;

    animateSkillBars(skillsDiv);
    return skillsDiv;
}

function animateSkillBars(container) {
    requestAnimationFrame(() => {
        container.querySelectorAll('.skill-bar').forEach(bar => {
            const level = parseInt(bar.dataset.level);
            const targetWidth = (level / 5) * 100;
            let currentWidth = 0;

            function animate() {
                if (currentWidth < targetWidth) {
                    currentWidth += 0.15;
                    bar.style.width = currentWidth + "%";
                    requestAnimationFrame(animate);
                }
            }
            animate();
        });
    });
}


function createSlideshow() {
    const slides = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", "img5.jpg"];
    
    const slideshowDiv = document.createElement('div');
    slideshowDiv.className = 'slideshow';
    slideshowDiv.innerHTML = `
        <button id="prevBtn">Föregående</button>
        <div class="slides">
            ${slides.map(img => `<div class="slide"><img src="imagesSimon/SlideShow/${img}" alt="Slide"></div>`).join('')}
        </div>
        <button id="nextBtn">Nästa</button>
    `;

    let currentIndex = 0;
    const slideElements = slideshowDiv.querySelectorAll('.slide');

    function showSlide(index) {
        slideElements.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
    }

    slideshowDiv.querySelector('#prevBtn').onclick = () => {
        if (currentIndex > 0) {
            currentIndex--;
            showSlide(currentIndex);
        }
    };

    slideshowDiv.querySelector('#nextBtn').onclick = () => {
        if (currentIndex < slideElements.length - 1) {
            currentIndex++;
            showSlide(currentIndex);
        }
    };

    showSlide(currentIndex);
    return slideshowDiv;
}


let allProjects = [];

function createProjectsSection(projects) {
    allProjects = [...projects];
    
    const projectsDiv = document.createElement('div');
    projectsDiv.className = 'projects';
    projectsDiv.innerHTML = '<h2>🚀 Projekt & Erfarenhet</h2>';

    projectsDiv.appendChild(createSlideshow());
    projectsDiv.appendChild(createProjectControls());
    
    const projectsGrid = document.createElement('div');
    projectsGrid.className = 'projects-grid';
    projectsGrid.id = 'projects-grid';
    projectsDiv.appendChild(projectsGrid);
    
    renderProjects(projects, projectsGrid);
    setupProjectEventListeners();
    
    return projectsDiv;
}

function createProjectControls() {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'project-controls';
    controlsDiv.innerHTML = `
        <div class="search-container">
            <input type="text" id="project-search" class="search-input" placeholder="🔍 Sök projekt...">
        </div>
        <div class="sort-container">
            <span class="sort-label">Sortera efter:</span>
            <select id="sort-type" class="sort-select">
                <option value="title-asc">Titel A-Ö</option>
                <option value="title-desc">Titel Ö-A</option>
                <option value="year-asc">År stigande</option>
                <option value="year-desc">År fallande</option>
            </select>
        </div>
    `;
    return controlsDiv;
}

function setupProjectEventListeners() {
    setTimeout(() => {
        const searchInput = document.getElementById('project-search');
        const sortSelect = document.getElementById('sort-type');
        
        if (searchInput) searchInput.oninput = filterAndSortProjects;
        if (sortSelect) sortSelect.onchange = filterAndSortProjects;
    }, 100);
}

function renderProjects(projects, container) {
    container.innerHTML = '';

    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project';
        card.style.animationDelay = `${index * 0.05}s`;

        const button = document.createElement('button');
        button.className = 'project-title';
        button.innerHTML = `
            <span class="title-text">${project.title}</span>
            <span class="chevron">›</span>
        `;
        button.onclick = () => openDrawer(project, button);

        card.appendChild(button);
        container.appendChild(card);
    });
}

function filterAndSortProjects() {
    const searchTerm = document.getElementById('project-search').value.toLowerCase();
    const sortType = document.getElementById('sort-type').value;
    
    let filtered = allProjects.filter(project => {
        const searchableText = [
            project.title,
            project.company,
            project.description,
            ...project.technologies
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchTerm);
    });

    filtered.sort((a, b) => {
        if (sortType.startsWith('title')) {
            return sortType === 'title-asc' 
                ? a.title.localeCompare(b.title, 'sv')
                : b.title.localeCompare(a.title, 'sv');
        }
        const yearA = extractYear(a.duration);
        const yearB = extractYear(b.duration);
        return sortType === 'year-asc' ? yearA - yearB : yearB - yearA;
    });
    
    renderProjects(filtered, document.getElementById('projects-grid'));
}

function extractYear(duration) {
    const match = duration?.match(/\d{4}/);
    return match ? parseInt(match[0]) : 0;
}




let activeButton = null;

function openDrawer(project, button) {
    const backdrop = getOrCreateBackdrop();
    const drawer = getOrCreateDrawer();
    
    activeButton = button;
    drawer.innerHTML = buildDrawerContent(project);
    drawer.querySelector('.drawer-close').onclick = closeDrawer;
    
    document.body.classList.add('drawer-open');
    requestAnimationFrame(() => {
        backdrop.classList.add('open');
        drawer.classList.add('open');
        drawer.focus();
    });
    
    button.classList.add('active');
}

function closeDrawer() {
    const drawer = document.getElementById('project-drawer');
    const backdrop = document.getElementById('drawer-backdrop');

    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('drawer-open');

    if (activeButton) {
        activeButton.classList.remove('active');
        activeButton.focus();
        activeButton = null;
    }

    setTimeout(() => drawer.innerHTML = '', 350);
}

function getOrCreateBackdrop() {
    let backdrop = document.getElementById('drawer-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'drawer-backdrop';
        backdrop.className = 'drawer-backdrop';
        backdrop.onclick = closeDrawer;
        document.body.appendChild(backdrop);
    }
    return backdrop;
}

function getOrCreateDrawer() {
    let drawer = document.getElementById('project-drawer');
    if (!drawer) {
        drawer = document.createElement('aside');
        drawer.id = 'project-drawer';
        drawer.className = 'project-drawer';
        drawer.onkeydown = (e) => e.key === 'Escape' && closeDrawer();
        document.body.appendChild(drawer);
    }
    return drawer;
}

function buildDrawerContent(project) {
    const achievementsHTML = project.achievements
        ?.map(a => `<p>• ${a}</p>`).join('') || '';
    
    const technologiesHTML = project.technologies?.length
        ? `<p><strong>💻 Teknologier:</strong> ${project.technologies.join(' • ')}</p>`
        : '';

    return `
        <header class="drawer-header">
            <h3>${project.title}</h3>
            <button type="button" class="drawer-close">×</button>
        </header>
        <div class="drawer-content">
            <p><strong>🏢 ${project.company}</strong> ${project.duration ? `| ⏰ ${project.duration}` : ''}</p>
            <p>${project.description}</p>
            ${achievementsHTML ? `<section class="achievements"><h4>🏆 Huvudsakliga Prestationer</h4>${achievementsHTML}</section>` : ''}
            ${technologiesHTML}
        </div>
    `;
}

function createContainer() {
    document.querySelector('.resume-container')?.remove();
    
    const aboutSection = document.getElementById('about-taco');
    const container = document.createElement('div');
    container.className = 'resume-container';
    container.style.cssText = 'opacity: 0; transform: translateY(20px); transition: all 0.5s ease';
    
    if (aboutSection) {
        aboutSection.insertAdjacentElement('afterend', container);
    } else {
        document.body.appendChild(container);
    }
    
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
    
    return container;
}

async function main() {
    try {
        const data = await readDataJson();
        const container = createContainer();
        
        setTimeout(() => container.appendChild(createHeader(data)), 100);
        setTimeout(() => container.appendChild(createProfileImage()), 150);
        setTimeout(() => container.appendChild(createSkillsSection(data.skills, data.certifications)), 200);
        setTimeout(() => container.appendChild(createProjectsSection(data.projects)), 300);
        
    } catch (error) {
        console.error('Failed to load CV:', error);
        document.body.innerHTML += `
            <div style="background: #ffebee; color: #c62828; padding: 20px; margin: 20px; border-radius: 8px; text-align: center;">
                <h3>Kunde inte ladda CV-data</h3>
                <p>Kontrollera att data.json-filen finns tillgänglig.</p>
            </div>
        `;
    }
}

document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', main)
    : main();