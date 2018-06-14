// Var
const siemafullscreens = document.querySelectorAll('.siemafullscreen');

// Add a function that arrows pagination to prototype
Siema.prototype.addArrows = function() {

  const prevArrow = document.createElement('div');
  prevArrow.className = 'fas fa-chevron-left fa-4x siemaf-arrows d-flex align-items-center text-light px-3';
  prevArrow.addEventListener('click', () => this.prev());
  this.selector.appendChild(prevArrow);

  const nextArrow = document.createElement('div');
  nextArrow.className = 'fas fa-chevron-right fa-4x siemaf-arrows d-flex align-items-center text-light px-3';
  nextArrow.style.right = "0";
  nextArrow.addEventListener('click', () => this.next());
  this.selector.appendChild(nextArrow);
}

Siema.prototype.visibleArrows = function(visiblestate) {
  const btns = document.querySelectorAll('.siemaf-arrows');
  for (const btn of btns) btn.style.visibility = visiblestate;
}

// Add a function that generates pagination to prototype
Siema.prototype.addPagination = function() {
  // div
  const addpagination = document.createElement('div');
  addpagination.className = 'siemaf-pagination d-flex flex-row justify-content-center align-items-end py-3';
  this.selector.appendChild(addpagination);

  for (let i = 0; i < this.innerElements.length; i++) {
    const btn = document.createElement('div');
    btn.className = 'btn-lg fas fa-square fa-2x text-light';
    btn.addEventListener('click', () => this.goTo(i));
    addpagination.appendChild(btn);
  }
}

Siema.prototype.buttonPaginationSettings = function(btn_ableded) {
  const btns = document.querySelectorAll('.fa-square');
  for (const btn of btns) btn.style.opacity = 1;
  btns[btn_ableded].style.opacity = 0.3;
}

Siema.prototype.visiblePagination = function(visiblestate) {
  const btns = document.querySelectorAll('.fa-square');
  for (const btn of btns) btn.style.visibility = visiblestate;
}

// Add a function that timer loop of slide
Siema.prototype.timerloop = function() {
  if (this.timer_loop_active){
    this.tl = setInterval(() => {
      this.timereset();
      this.next();
    }, this.settimer);
  }
}

Siema.prototype.timereset = function() {
  if (this.tl != undefined) clearInterval(this.tl);
  if (this.timer_loop_active) this.timerloop();
}

for(const siemafullscreen of siemafullscreens) {
  var index = (siemafullscreen.hasAttribute('timer')) ? (JSON.parse(siemafullscreen.attributes['timer'].value) ? (siemafullscreen.children.length - 1) : 0) : 0;

  const siemainstance = new Siema({
    selector: siemafullscreen,
    easing: 'ease-out',
    perPage: {
      1024: 1,
      768: 1,
      576: 1,
    },
    startIndex: index,
    draggable: true,
    multipleDrag: true,
    loop: true,
    duration: 750,
    onChange: () => {
      if (siemafullscreen.hasAttribute('timer')) siemainstance.timereset();
      if (siemainstance.pagination_boo) siemainstance.buttonPaginationSettings(siemainstance.currentSlide);
      (window.innerWidth < 578) ? siemainstance.visiblePagination('hidden') : siemainstance.visiblePagination('visible');
      (window.innerWidth < 578) ? siemainstance.visibleArrows('hidden') : siemainstance.visibleArrows('visible');
    },
  });
  siemainstance.arrow_boo = (siemafullscreen.hasAttribute('arrow')) ? JSON.parse(siemafullscreen.attributes['arrow'].value) : false;
  siemainstance.pagination_boo = (siemafullscreen.hasAttribute('pagination')) ? JSON.parse(siemafullscreen.attributes['pagination'].value) : false;
  siemainstance.settimer_value = (siemafullscreen.hasAttribute('settimer')) ? JSON.parse(siemafullscreen.attributes['settimer'].value) : false;

  if (siemainstance.pagination_boo) {
    siemainstance.addPagination();
    siemainstance.buttonPaginationSettings(0);
  }
  if (siemainstance.arrow_boo) siemainstance.addArrows();
  if (siemafullscreen.hasAttribute('timer')) {
    siemainstance.timer_loop_active = JSON.parse(siemafullscreen.attributes['timer'].value);
    siemainstance.timerloop();
    siemainstance.settimer = parseInt(siemainstance.settimer_value);
  }
  siemainstance.resizeHandler();
}
