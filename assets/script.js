
// NAVBAR ANIMATIONS
function updateNavbarHeight() {
    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar.offsetHeight + 20;
    document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
}

window.addEventListener('load', updateNavbarHeight);
window.addEventListener('resize', updateNavbarHeight);

$(document).ready(function() {
    var activeLink = localStorage.getItem('activeNavLink');
    if (activeLink) {
        $('.nav-link').removeClass('active');
        $(`.nav-link[href='${activeLink}']`).addClass('active');
    }

    $('.nav-link').on('click', function(event) {
        event.preventDefault();
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        
        localStorage.setItem('activeNavLink', $(this).attr('href'));

        window.location.href = $(this).attr('href');
    });
});

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (window.scrollY > 50) {
        navbar.classList.remove('navbar-transparent');
        navbar.classList.add('navbar-solid');
        navLinks.forEach(link => {
            if (!link.classList.contains('active')) {
                link.style.color = 'var(--knight-purple)';
            }
        });
    } else {
        navbar.classList.remove('navbar-solid');
        navbar.classList.add('navbar-transparent');
        navLinks.forEach(link => {
            if (!link.classList.contains('active')) {
                link.style.color = '';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentUrl = window.location.href;

    const workPageUrl = '/work';

    function removeActiveClass() {
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.style.color = '';
        });
    }

    if (currentUrl.includes(workPageUrl) && currentUrl !== window.location.origin + workPageUrl) {
        removeActiveClass();
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            setTimeout(() => {
                window.location.href = this.href;
            }, 100);
        });
    });

    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.remove('navbar-transparent');
            navbar.classList.add('navbar-solid');
            navLinks.forEach(link => {
                if (!link.classList.contains('active')) {
                    link.style.color = 'var(--knight-purple)';
                }
            });
        } else {
            navbar.classList.remove('navbar-solid');
            navbar.classList.add('navbar-transparent');
            navLinks.forEach(link => {
                if (!link.classList.contains('active')) {
                    link.style.color = '';
                }
            });
        }
    });
});


// PROGRESS BAR
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const progressBar = document.getElementById('progress-bar');
    const progressLinks = document.querySelectorAll('.progress-link');
    const mobileSections = document.getElementById('mobile-sections');
    const currentSection = document.getElementById('current-section');
    const offset = 200;

    // Ensure the required elements are present
    if (!currentSection || !mobileSections) {
        console.error('Required elements are not found in the DOM.');
        return;
    }

    // Function to update the progress bar and current section indicator
    function updateProgressBar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollBottom = scrollTop + window.innerHeight;

        let nextIndex = -1;

        // Find the index of the next section that is fully visible
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollBottom >= sectionTop && scrollTop < sectionBottom) {
                nextIndex = i;
                break;
            }
        }

        // Update progress bar and current section indicator
        const totalSections = sections.length;
        const percentage = ((nextIndex + 1) / totalSections) * 100;
        
        // Smooth transition logic
        if (nextIndex === totalSections - 1) {
            // Last section reached
            progressBar.style.width = '100%';
            progressBar.style.transition = 'width 1.5s ease';
        } else {
            // Not the last section
            progressBar.style.width = percentage + '%';
            progressBar.style.transition = 'width 1.5s ease';
        }

        progressLinks.forEach(link => link.classList.remove('active'));
        progressLinks[nextIndex].classList.add('active');
        currentSection.textContent = progressLinks[nextIndex].textContent;
    }

    // Scroll event listener to update progress bar
    window.addEventListener('scroll', () => {
        updateProgressBar();
    });

    // Smooth scroll to section on progress link click
    document.querySelectorAll('.progress-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Toggle function for current section title click (for mobile)
    currentSection.addEventListener('click', () => {
        mobileSections.classList.toggle('expanded');
    });

    // Initial update to set the current section title for mobile
    updateProgressBar();
});






// FILTER BY TAG ON WORK PAGE
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.card');

    const handleFilter = (selectedTag) => {
        projects.forEach(project => {
            const projectTags = project.getAttribute('data-tags').toLowerCase();

            if (selectedTag === 'show-all' || projectTags.includes(selectedTag)) {
                project.style.display = '';
            } else {
                project.style.display = 'none';
            }
        });

        filterButtons.forEach(button => button.classList.remove('active'));

        document.querySelector(`.filter-btn[data-tag="${selectedTag}"]`).classList.add('active');
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedTag = button.getAttribute('data-tag');
            handleFilter(selectedTag);
        });
    });

    const showAllButton = document.getElementById('show-all-btn');
    if (showAllButton) {
        showAllButton.addEventListener('click', () => {
            projects.forEach(project => {
                project.style.display = '';
            });

            filterButtons.forEach(button => button.classList.remove('active'));
            showAllButton.classList.add('active');
        });
    }
});

// FILTER ON PLAY GALLERY
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const gallery = document.querySelector('.gallery');

    if (gallery) {
        // Initialize Masonry
        const masonry = new Masonry(gallery, {
            itemSelector: '.gallery-item',
            columnWidth: '.gallery-item', // Adjust this selector as per your layout
            percentPosition: true
        });

        // Function to handle filtering
        const handleFilter = (selectedTag) => {
            const galleryItems = document.querySelectorAll('.gallery-item');

            galleryItems.forEach(item => {
                const tags = item.getAttribute('data-tags').split(',');
                const isVisible = selectedTag === 'show-all' || tags.includes(selectedTag);

                item.style.display = isVisible ? '' : 'none';
            });

            // Layout Masonry after filtering
            masonry.layout();
        };

        // Add click event listeners to filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedTag = button.getAttribute('data-tag');
                handleFilter(selectedTag);
            });
        });

        // Layout Masonry on initial load
        masonry.layout();
    }
});

// COLLAPSIBLE NAVBAR
document.addEventListener('DOMContentLoaded', () => {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarLinks = document.querySelector('.navbar-links');

    navbarToggle.addEventListener('click', () => {
        navbarToggle.classList.toggle('active');
        navbarLinks.classList.toggle('active');
    });

    // Close the menu when a link is clicked (optional)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarToggle.classList.remove('active');
            navbarLinks.classList.remove('active');
        });
    });
});

// ABOUT PAGE CAROUSEL
document.addEventListener("DOMContentLoaded", function() {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        const prevButton = carousel.querySelector('.prev');
        const nextButton = carousel.querySelector('.next');
        const inner = carousel.querySelector('.carousel-inner');
        const items = carousel.querySelectorAll('.carousel-item');

        let currentIndex = 0;

        function updateCarousel() {
            inner.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
            updateCarousel();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });
    });
});
