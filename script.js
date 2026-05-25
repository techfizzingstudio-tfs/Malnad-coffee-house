const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navbar = document.querySelector(".navbar");

/* MOBILE MENU */
menuToggle.addEventListener("click", (e) => {
  e.stopPropagation();

  navMenu.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

/* DROPDOWN TOGGLE MOBILE */
document.querySelectorAll(".dropdown-toggle").forEach(toggle => {

  toggle.addEventListener("click", (e) => {

    if (window.innerWidth <= 768) {

      e.preventDefault();
      e.stopPropagation();

      const dropdown = toggle.closest(".dropdown");

      document.querySelectorAll(".dropdown.open").forEach(item => {
        if (item !== dropdown) {
          item.classList.remove("open");
        }
      });

      dropdown.classList.toggle("open");
    }
  });

});

/* PREVENT CLOSE */
navMenu.addEventListener("click", (e) => {
  e.stopPropagation();
});

/* CLOSE OUTSIDE */
document.addEventListener("click", () => {

  navMenu.classList.remove("active");
  menuToggle.classList.remove("active");

  document.querySelectorAll(".dropdown.open").forEach(item => {
    item.classList.remove("open");
  });

});

/* SCROLL EFFECT */
window.addEventListener("scroll", () => {

  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

});


/* HERO SLIDER */
const slides = document.querySelectorAll('.slide');
let index = 0;

setInterval(() => {
  slides[index].classList.remove('active');
  index = (index + 1) % slides.length;
  slides[index].classList.add('active');
}, 4500);


/* =========================
   OUR STORY REVEAL ANIMATION
========================= */

const reveals = document.querySelectorAll('.reveal');

function revealSection(){

  reveals.forEach((el)=>{

    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 120;

    if(elementTop < windowHeight - revealPoint){
      el.classList.add('show');
    }else{
      el.classList.remove('show');
    }

  });

}

/* RUN EVENTS */

window.addEventListener('scroll', revealSection);
window.addEventListener('load', revealSection);


/* =========================
   PREMIUM COUNT ANIMATION
========================= */

const counters = document.querySelectorAll(".counter");

const speed = 200;

const startCounter = () => {

  counters.forEach((counter) => {

    const target = +counter.getAttribute("data-target");

    let count = 0;

    const updateCount = () => {

      const increment = target / speed;

      if(count < target){

        count += increment;

        counter.innerText = Math.floor(count);

        requestAnimationFrame(updateCount);

      }else{

        counter.innerText = target;

      }

    };

    updateCount();

  });

};

/* START WHEN VISIBLE */

const statsSection = document.querySelector(".stats-grid");

const observer = new IntersectionObserver((entries)=>{

  entries.forEach((entry)=>{

    if(entry.isIntersecting){

      startCounter();

      observer.unobserve(statsSection);

    }

  });

},{ threshold:0.4 });

observer.observe(statsSection);

/* =========================
   TESTIMONIAL AUTO SLIDER
========================= */


const track = document.querySelector(".testimonial-track");

track.innerHTML += track.innerHTML;








