/**
 * Enhanced Portfolio JavaScript
 * Author: Hiten Mandhyan
 * Description: Interactive features and animations for developer portfolio
 */

// ========================================
// Global Variables & Configuration
// ========================================

const CONFIG = {
  githubUsername: 'hitenmandhyan',
  resumeURL: 'Hiten_Mandhyan_Resume.pdf',
  emailJSServiceID: '', // Add your EmailJS service ID
  emailJSTemplateID: '', // Add your EmailJS template ID
  emailJSPublicKey: '', // Add your EmailJS public key
  terminalCommands: ['help', 'about', 'projects', 'skills', 'contact', 'clear'],
  typingSpeed: 80,
  deleteSpeed: 50,
};

// ========================================
// Utility Functions
// ========================================

/**
 * Debounce function to limit rate of function calls
 */
function debounce(func, wait = 200) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function execution
 */
function throttle(func, limit = 200) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Smooth scroll to element
 */
function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    const offsetTop = element.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

// ========================================
// Navigation Functionality
// ========================================

class Navigation {
  constructor() {
    this.nav = document.getElementById('nav');
    this.navToggle = document.querySelector('.nav-toggle');
    this.navLinks = document.querySelector('.nav-links');
    this.lastScroll = 0;
    this.init();
  }

  init() {
    this.setupScrollBehavior();
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setupActiveSection();
  }

  setupScrollBehavior() {
    window.addEventListener('scroll', throttle(() => {
      const currentScroll = window.pageYOffset;

      // Add/remove scrolled class
      if (currentScroll > 50) {
        this.nav.classList.add('nav-scrolled');
      } else {
        this.nav.classList.remove('nav-scrolled');
      }

      // Hide/show nav on scroll
      if (currentScroll > this.lastScroll && currentScroll > 500) {
        this.nav.classList.add('nav-hidden');
      } else {
        this.nav.classList.remove('nav-hidden');
      }

      this.lastScroll = currentScroll;
    }, 100));
  }

  setupMobileMenu() {
    if (!this.navToggle) return;

    this.navToggle.addEventListener('click', () => {
      const isExpanded = this.navToggle.getAttribute('aria-expanded') === 'true';
      this.navToggle.setAttribute('aria-expanded', !isExpanded);
      this.navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.navLinks.classList.remove('active');
      });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      if (!this.nav.contains(e.target) && this.navLinks.classList.contains('active')) {
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.navLinks.classList.remove('active');
      }
    });
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        if (target !== '#') {
          smoothScroll(target);
        }
      });
    });
  }

  setupActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', throttle(() => {
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
          });
          const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, 100));
  }
}

// ========================================
// Terminal Command Interface
// ========================================

class Terminal {
  constructor() {
    this.input = document.getElementById('terminal-input');
    this.output = document.getElementById('terminal-output');
    this.commands = CONFIG.terminalCommands;
    this.currentCommandIndex = 0;
    this.init();
  }

  init() {
    if (!this.input || !this.output) return;
    this.cycleCommands();
  }

  async cycleCommands() {
    while (true) {
      const command = this.commands[this.currentCommandIndex];
      await this.typeCommand(command);
      await this.delay(2000);
      await this.executeCommand(command);
      await this.delay(3000);
      await this.deleteCommand();
      await this.delay(1000);
      this.currentCommandIndex = (this.currentCommandIndex + 1) % this.commands.length;
    }
  }

  async typeCommand(text) {
    for (let i = 0; i <= text.length; i++) {
      this.input.textContent = text.substring(0, i);
      await this.delay(CONFIG.typingSpeed);
    }
  }

  async deleteCommand() {
    const text = this.input.textContent;
    for (let i = text.length; i >= 0; i--) {
      this.input.textContent = text.substring(0, i);
      await this.delay(CONFIG.deleteSpeed);
    }
    this.output.innerHTML = '';
  }

  async executeCommand(command) {
    const responses = {
      help: '> Available commands: help, about, projects, skills, contact, clear',
      about: '> Full Stack Developer & AI Engineer | Building innovative solutions',
      projects: '> 5+ projects | Smart Study Mate | HealthVerse | AI Analytics',
      skills: '> Python • JavaScript • Flask • TensorFlow • Node.js • Firebase',
      contact: '> Email: hitenmandhyan124@gmail.com | Status: AVAILABLE',
      clear: ''
    };

    this.output.innerHTML = `<div class="terminal-line">${responses[command] || '> Command not found. Type "help" for available commands.'}</div>`;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ========================================
// GitHub Contribution Graph
// ========================================

class GitHubGraph {
  constructor() {
    this.graph = document.getElementById('contrib-graph');
    this.totalContributions = document.getElementById('total-contributions');
    this.init();
  }

  init() {
    if (!this.graph) return;
    this.generateGraph();
  }

  generateGraph() {
    // Generate realistic contribution pattern
    const levels = [0, 0, 0, 1, 1, 1, 2, 2, 3, 4];
    let total = 0;

    for (let col = 0; col < 52; col++) {
      const colEl = document.createElement('div');
      colEl.className = 'graph-col';
      
      for (let row = 0; row < 7; row++) {
        const cell = document.createElement('div');
        const level = levels[Math.floor(Math.random() * levels.length)];
        cell.className = `graph-cell l${level}`;
        
        // Add tooltip
        const contributions = level === 0 ? 0 : Math.floor(Math.random() * 10) + 1;
        total += contributions;
        cell.title = `${contributions} contributions`;
        
        colEl.appendChild(cell);
      }
      
      this.graph.appendChild(colEl);
    }

    // Update total contributions
    if (this.totalContributions) {
      this.animateCounter(this.totalContributions, total);
    }
  }

  animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }
}

// ========================================
// Project Filtering
// ========================================

class ProjectFilter {
  constructor() {
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.projectCards = document.querySelectorAll('.project-card:not(.project-card-more)');
    this.init();
  }

  init() {
    if (this.filterBtns.length === 0) return;
    this.setupFilters();
  }

  setupFilters() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        // Update active button
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter projects
        this.filterProjects(filter);
      });
    });
  }

  filterProjects(filter) {
    this.projectCards.forEach(card => {
      const categories = card.dataset.category;
      
      if (filter === 'all' || categories.includes(filter)) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn 0.5s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  }
}

// ========================================
// Contact Form Handling
// ========================================

class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.feedback = document.getElementById('form-feedback');
    this.init();
  }

  init() {
    if (!this.form) return;
    this.setupFormSubmission();
  }

  setupFormSubmission() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
      };

      await this.handleSubmit(formData);
    });
  }

  async handleSubmit(data) {
    // Show loading state
    this.showFeedback('> Transmitting message...', 'pending');
    
    // Simulate form submission (replace with actual backend/EmailJS integration)
    await this.delay(1500);
    
    // For demo purposes, always show success
    // In production, replace this with actual EmailJS or backend API call
    try {
      // Example EmailJS integration (uncomment and configure):
      /*
      if (CONFIG.emailJSServiceID && CONFIG.emailJSTemplateID) {
        await emailjs.send(
          CONFIG.emailJSServiceID,
          CONFIG.emailJSTemplateID,
          data,
          CONFIG.emailJSPublicKey
        );
      }
      */
      
      this.showFeedback('> ✓ Message received! I\'ll get back to you within 48h. [exit 0]', 'success');
      this.form.reset();
    } catch (error) {
      this.showFeedback('> ✗ Transmission failed. Please try again or email directly. [exit 1]', 'error');
    }
  }

  showFeedback(message, type) {
    this.feedback.textContent = message;
    this.feedback.className = `form-feedback ${type}`;
    this.feedback.style.display = 'block';
    
    if (type === 'success') {
      setTimeout(() => {
        this.feedback.style.display = 'none';
      }, 5000);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ========================================
// Resume Download Handler
// ========================================

class ResumeDownload {
  constructor() {
    this.downloadBtn = document.getElementById('download-resume');
    this.footerLink = document.getElementById('footer-resume-link');
    this.init();
  }

  init() {
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener('click', () => this.download());
    }
    if (this.footerLink) {
      this.footerLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.download();
      });
    }
  }

  download() {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = CONFIG.resumeURL;
    link.download = CONFIG.resumeURL;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show feedback
    this.showDownloadFeedback();
  }

  showDownloadFeedback() {
    const originalText = this.downloadBtn.innerHTML;
    this.downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
    this.downloadBtn.disabled = true;
    
    setTimeout(() => {
      this.downloadBtn.innerHTML = originalText;
      this.downloadBtn.disabled = false;
    }, 2000);
  }
}

// ========================================
// Scroll to Top Button
// ========================================

class ScrollToTop {
  constructor() {
    this.btn = document.getElementById('scroll-top');
    this.init();
  }

  init() {
    if (!this.btn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(() => {
      if (window.pageYOffset > 500) {
        this.btn.classList.add('visible');
      } else {
        this.btn.classList.remove('visible');
      }
    }, 200));

    // Scroll to top on click
    this.btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// ========================================
// Intersection Observer for Animations
// ========================================

class AnimationObserver {
  constructor() {
    this.init();
  }

  init() {
    // Initialize AOS (Animate On Scroll) library if available
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100,
        delay: 0,
      });
    }

    // Custom intersection observer for additional animations
    this.setupCustomObserver();
  }

  setupCustomObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe elements that should animate on scroll
    document.querySelectorAll('[data-aos]').forEach(el => {
      observer.observe(el);
    });
  }
}

// ========================================
// Project Card Animations
// ========================================

class ProjectAnimations {
  constructor() {
    this.init();
  }

  init() {
    // Add glitch effect to project names on hover
    document.querySelectorAll('.project-name').forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.style.animation = 'glitch-text 0.3s infinite';
      });
      el.addEventListener('mouseleave', () => {
        el.style.animation = '';
      });
    });

    // Add hover sound effects (optional)
    this.setupHoverSounds();
  }

  setupHoverSounds() {
    // Optional: Add subtle sound effects on interactions
    // This would require audio files and can be enabled if desired
    const interactiveElements = document.querySelectorAll('.btn, .project-card, .role-badge');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        // Subtle visual feedback
        el.style.transition = 'all 0.2s ease';
      });
    });
  }
}

// ========================================
// Performance Optimization
// ========================================

class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.optimizeAnimations();
  }

  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  optimizeAnimations() {
    // Reduce animations on low-end devices
    if (this.isLowEndDevice()) {
      document.documentElement.classList.add('reduce-motion');
    }
  }

  isLowEndDevice() {
    // Simple heuristic for low-end device detection
    return navigator.hardwareConcurrency <= 2 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
}

// ========================================
// Keyboard Navigation
// ========================================

class KeyboardNavigation {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('keydown', (e) => {
      // Alt + H: Go to home
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        smoothScroll('#hero');
      }
      
      // Alt + P: Go to projects
      if (e.altKey && e.key === 'p') {
        e.preventDefault();
        smoothScroll('#projects');
      }
      
      // Alt + C: Go to contact
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        smoothScroll('#contact');
      }

      // Escape: Close mobile menu
      if (e.key === 'Escape') {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        if (navLinks.classList.contains('active')) {
          navToggle.setAttribute('aria-expanded', 'false');
          navLinks.classList.remove('active');
        }
      }
    });
  }
}

// ========================================
// Analytics & Tracking (Optional)
// ========================================

class Analytics {
  constructor() {
    this.init();
  }

  init() {
    // Track page views
    this.trackPageView();
    
    // Track interactions
    this.trackInteractions();
  }

  trackPageView() {
    // Add Google Analytics or similar tracking here
    console.log('Page view tracked');
  }

  trackInteractions() {
    // Track button clicks
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.textContent.trim();
        console.log('Button clicked:', action);
        // Send to analytics service
      });
    });

    // Track project views
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const projectName = card.querySelector('.project-name').textContent;
        console.log('Project viewed:', projectName);
        // Send to analytics service
      });
    });
  }
}

// ========================================
// Dark Mode Toggle (Optional Enhancement)
// ========================================

class ThemeToggle {
  constructor() {
    this.currentTheme = 'dark';
  }
}

// ========================================
// Cyber Background Animation
// ========================================

class CyberBackground {
  constructor() {
    this.canvas = document.getElementById('cyber-bg');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.animFrame = null;
    this.offset = 0;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.cols = Math.ceil(this.canvas.width / 60) + 1;
    this.rows = Math.ceil(this.canvas.height / 60) + 1;
  }

  drawGrid() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cellSize = 60;
    const off = this.offset % cellSize;

    ctx.clearRect(0, 0, w, h);

    // Draw vertical lines
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.12)';
    ctx.lineWidth = 1;
    for (let x = -off; x <= w + cellSize; x += cellSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    ctx.stroke();

    // Draw horizontal lines (scrolling)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.12)';
    for (let y = off - cellSize; y <= h + cellSize; y += cellSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Draw glowing intersection dots
    for (let x = -off; x <= w + cellSize; x += cellSize) {
      for (let y = off - cellSize; y <= h + cellSize; y += cellSize) {
        const alpha = 0.25 + 0.15 * Math.sin((x + y + this.offset) * 0.03);
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
        ctx.fill();

        // Occasional bright nodes
        if ((Math.floor((x + off) / cellSize) + Math.floor((y - off) / cellSize)) % 7 === 0) {
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 1.8})`;
          ctx.fill();
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(0, 255, 65, 0.6)';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }
  }

  animate() {
    this.offset += 0.4;
    this.drawGrid();
    this.animFrame = requestAnimationFrame(() => this.animate());
  }
}

// ========================================
// Initialize Application
// ========================================

class Portfolio {
  constructor() {
    this.modules = [];
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initModules());
    } else {
      this.initModules();
    }
  }

  initModules() {
    try {
      // Initialize all modules
      this.modules.push(new Navigation());
      this.modules.push(new CyberBackground());
      this.modules.push(new Terminal());
      this.modules.push(new GitHubGraph());
      this.modules.push(new ProjectFilter());
      this.modules.push(new ContactForm());
      this.modules.push(new ResumeDownload());
      this.modules.push(new ScrollToTop());
      this.modules.push(new AnimationObserver());
      this.modules.push(new ProjectAnimations());
      this.modules.push(new PerformanceOptimizer());
      this.modules.push(new KeyboardNavigation());
      // this.modules.push(new Analytics()); // Uncomment if using analytics
      
      // Set current year in footer
      this.setCurrentYear();
      
      // Add page load animation
      this.addPageLoadAnimation();
      
      console.log('🚀 Portfolio initialized successfully');
    } catch (error) {
      console.error('Error initializing portfolio:', error);
    }
  }

  setCurrentYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  addPageLoadAnimation() {
    // Flicker effect on page load (cyber aesthetic)
    document.body.style.opacity = 0;
    let flickers = 0;
    
    const flicker = setInterval(() => {
      document.body.style.opacity = flickers % 2 === 0 ? 1 : 0;
      flickers++;
      
      if (flickers > 4) {
        clearInterval(flicker);
        document.body.style.opacity = 1;
      }
    }, 80);
  }
}

// ========================================
// Start Application
// ========================================

const app = new Portfolio();
app.init();

// ========================================
// Export for module usage (if needed)
// ========================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Portfolio, CONFIG };
}
