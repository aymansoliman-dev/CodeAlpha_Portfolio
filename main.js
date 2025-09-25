// --------------------
// Text Scrambling Effect
// --------------------
class TextScramble {
    constructor(el) {
        this.el = el
        this.chars = '!<>-_\\/[]{}—=+*^?@$%&();~#________'
        this.update = this.update.bind(this)
    }
    setText(newText) {
        const oldText = this.el.innerText
        const length = Math.max(oldText.length, newText.length)
        const promise = new Promise((resolve) => this.resolve = resolve)
        this.queue = []
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || ''
            const to = newText[i] || ''
            const start = Math.floor(Math.random() * 40)
            const end = start + Math.floor(Math.random() * 40)
            this.queue.push({ from, to, start, end })
        }
        cancelAnimationFrame(this.frameRequest)
        this.frame = 0
        this.update()
        return promise
    }
    update() {
        let output = ''
        let complete = 0
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i]
            if (this.frame >= end) {
                complete++
                output += to
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.15) {
                    char = this.randomChar()
                    this.queue[i].char = char
                }
                output += `<span class="dud">${char}</span>`
            } else {
                output += from
            }
        }
        this.el.innerHTML = output
        if (complete === this.queue.length) {
            this.resolve()
        } else {
            setTimeout(() => {
                this.frameRequest = requestAnimationFrame(this.update)
            }, 30)
            this.frame++
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)]
    }
}

// --------------------
// Color Theme Handling
// --------------------
if (!window.localStorage.getItem('color')) {
    window.localStorage.setItem('color', 'var(--primary-blue)');
}

document.documentElement.style.setProperty('--primary-color', window.localStorage.getItem('color'));

// Remove old active color safely
const activeColor = document.querySelector('.active.color');
if (activeColor) activeColor.classList.remove('active');

// Mark stored color as active (if exists in swatches)
const storedColorEl = document.querySelector(`[data-color="${window.localStorage.getItem('color')}"]`);
if (storedColorEl) storedColorEl.classList.add('active');

window.addEventListener('click', e => {
    if (e.target.classList.contains('color')) {
        const currentActive = document.querySelector('.active.color');
        if (currentActive) currentActive.classList.remove('active');

        e.target.classList.add('active');
        document.documentElement.style.setProperty('--primary-color', e.target.dataset.color);
        window.localStorage.setItem('color', e.target.dataset.color);
    }
    else if (e.target.closest('#color-swatch')) {
        document.querySelector('.swatches').classList.remove('hidden');
    }
    else {
        document.querySelector('.swatches').classList.add('hidden');
    }
});

// --------------------
// Testimonials Slider
// --------------------
const nextButton = document.querySelector('.next.btn');
const prevButton = document.querySelector('.prev.btn');
const testimonialsSlider = document.getElementById('testimonials-cards');

let cardWidth = getCardWidth();
let gap = getGap();
let currentIndex = 0;

function getCardWidth() {
    return testimonialsSlider.querySelector('.testimonial').offsetWidth;
}

function getGap() {
    return parseFloat(getComputedStyle(testimonialsSlider).columnGap || 0);
}

function updateSliderPosition(behavior = 'smooth') {
    testimonialsSlider.scrollTo({
        left: (cardWidth + gap) * currentIndex,
        behavior: behavior
    });
}

// Next button
nextButton?.addEventListener('click', () => {
    if (currentIndex < testimonialsSlider.children.length - 1) {
        currentIndex++;
        document.documentElement.style.setProperty('--current-testimonial', currentIndex);
        updateSliderPosition('smooth');
    }
});

// Prev button
prevButton?.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex = Math.max(0, currentIndex - 1);
        document.documentElement.style.setProperty('--current-testimonial', currentIndex);
        updateSliderPosition('smooth');
    }
});

// Recalculate on resize
window.addEventListener('resize', () => {
    cardWidth = getCardWidth();
    gap = getGap();
    updateSliderPosition('instant'); // snap instantly on resize
});

// --------------------
// Prevent Primitive Scrolling
// --------------------
// Prevent *horizontal* touchmove only, allow vertical scroll
testimonialsSlider.addEventListener('touchmove', e => {
    if (Math.abs(e.touches[0].clientX - e.touches[0].screenX) > 10) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent only horizontal wheel scroll (allow vertical)
testimonialsSlider.addEventListener('wheel', e => {
    if (e.deltaX !== 0) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent horizontal arrow keys
window.addEventListener('keydown', e => {
    if (["ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
    }
});

// --------------------
// Dark Theme Toggle
// --------------------
const darkThemeToggle = document.querySelector('[for="dark-theme"] input');
const themeTooltip = document.querySelector('.tooltip#alt-theme');

// Initialize theme from storage
if (!window.localStorage.getItem('theme')) {
    window.localStorage.setItem('theme', 'dark');
}
document.documentElement.dataset.theme = window.localStorage.getItem('theme');
darkThemeToggle.checked = (document.documentElement.dataset.theme === 'dark');

// Theme icon update function
function updateThemeIcon(theme) {
    if (theme === 'dark') {
        document.getElementById('theme-icon').innerHTML = `
            <img src="assets/icons/light.svg" alt="Light Theme" data-type="svg">
        `;
        themeTooltip.innerHTML = 'Light';
    }
    else {
        document.getElementById('theme-icon').innerHTML = `
            <img src="assets/icons/dark.svg" alt="Dark Theme" data-type="svg">
        `;
        themeTooltip.innerHTML = 'Dark';
    }
}

// Apply the correct icon on a load
updateThemeIcon(document.documentElement.dataset.theme);

// Toggle theme
darkThemeToggle.addEventListener('change', () => {
    const newTheme = darkThemeToggle.checked ? 'dark' : 'light';
    document.documentElement.dataset.theme = newTheme;
    window.localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// --------------------
// About Me Text Scrambling on Viewport Entry
// --------------------
function generateAboutMeText() {
    const birthYear = 2004;
    const graduationYear = 2026;  // expected graduation year
    const currentYear = new Date().getFullYear();

    // calculate age
    const age = currentYear - birthYear;

    // graduation status
    let status;
    if (currentYear < graduationYear) {
        status = `a final-year <span class="special">Computer Science</span> student`;
    } else if (currentYear === graduationYear) {
        status = `graduated in 2026 🎓 from the faculty of <span class="special">Computer Science</span>`;
    } else {
        status = `a <span class="special">Computer Science graduate</span> 🎓`;
    }

    // dynamic about me text
    return `
    Hi! <span class="special">I'm Ayman</span>, a ${age}-year-old <span class="special">Front-End Developer</span> and <span class="special">${status}</span>. My passion is crafting <span class="special">pixel-perfect</span> user interfaces that are not only beautiful but also prioritize <span class="special">performance</span> and <span class="special">accessibility</span>.
        Over the past few years, I've honed my skills in <span class="special">HTML</span>, <span class="special">CSS</span>, and
        <span class="special">JavaScript</span>, and I love transforming design concepts into clean, interactive experiences. <br><br>

        Beyond <span class="special">coding</span>, I actively challenge myself through <span class="special">Frontend Mentor</span> projects, <span class="special">CSS Battle</span> puzzles,
        and personal experiments on <span class="special">CodePen</span>. My goal is simple: to create products that not only look beautiful but also feel effortless to use. <br><br>

        I aspire to grow as a developer and to live and die in <span class="special">Edinburgh</span> — a city I feel deeply connected to.
        <br><br>

        Off the screen, I'm a <span class="special">true blue</span> — a proud <span class="special">Chelsea FC</span> supporter 💙.
        When I'm not <span class="special">coding</span>, you'll find me cheering for my team, <span class="special">playing footbal</span>, <span class="special">cooking</span>, reflecting, or enjoying a good coffee while dreaming up my next project.
    `;
}

// Initialize the Intersection Observer for the about-me element
function initAboutMeScramble() {
    const aboutMeElement = document.getElementById('about-me');
    let hasTriggered = false; // Ensure it only runs once

    if (!aboutMeElement) return;

    const fx = new TextScramble(aboutMeElement);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasTriggered) {
                hasTriggered = true;
                aboutMeElement.textContent = '';
                fx.setText(generateAboutMeText()).then(() => {})
                observer.unobserve(aboutMeElement);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(aboutMeElement);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutMeScramble);
} else {
    initAboutMeScramble();
}

// Body

const bodyObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) document.querySelector('body').classList.remove('hidden')
})

bodyObserver.observe(document.querySelector('body'));

// Featured Projects Intersection Observer

const featuredProjectsSectionObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) document.getElementById('featured-projects').classList.remove('hidden');
        else document.getElementById('featured-projects').classList.add('hidden');
}, {
    threshold: 0.3
})

featuredProjectsSectionObserver.observe(document.getElementById('featured-projects'));

// Testimonials Intersection Observer

const testimonialsSectionObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) document.getElementById('testimonials').classList.remove('hidden');
    else document.getElementById('testimonials').classList.add('hidden');
},
    {
        threshold: 0.3
    }
)

testimonialsSectionObserver.observe(document.getElementById('testimonials'));

//

const testimonials = document.querySelectorAll('.testimonial');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.remove('hidden');
        else entry.target.classList.add('hidden');
    });
}, {
    root: document.getElementById('testimonials'),
    threshold: 0.5
});

testimonials.forEach(t => {
    observer.observe(t);
});


// Contact

const contactSectionObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) document.getElementById('contact').classList.remove('hidden');
    else document.getElementById('contact').classList.add('hidden');
}, {
    threshold: 0.3
})

contactSectionObserver.observe(document.getElementById('contact'));

window.addEventListener('pageshow', () => {
    document.querySelector('form').reset();
});