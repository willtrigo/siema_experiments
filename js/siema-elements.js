// Var
const siemaelements = document.querySelectorAll('.siemaelements');

// Add a function that arrows pagination to prototype
Siema.prototype.addArrows = function() {

  const prevArrow = document.createElement('div');
  prevArrow.className = 'fas fa-chevron-left fa-3x siema-arrows d-flex align-items-center col-1 order-0 justify-content-end';
  prevArrow.addEventListener('click', () => this.prev());
  this.selector.parentElement.parentElement.appendChild(prevArrow);

  const nextArrow = document.createElement('div');
  nextArrow.className = 'fas fa-chevron-right fa-3x siema-arrows d-flex align-items-center col-1 order-2 justify-content-start';
  nextArrow.addEventListener('click', () => this.next());
  this.selector.parentElement.parentElement.appendChild(nextArrow);
}

Siema.prototype.visibleArrows = function(visiblestate) {
  const btns = document.querySelectorAll('.siema-arrows');
  for (const btn of btns) btn.style.visibility = visiblestate;
}

// Add a function that generates pagination to prototype
Siema.prototype.addPagination = function() {
  // div
  const addpagination = document.createElement('div');
  addpagination.className = 'siema-pagination d-flex flex-row justify-content-center align-items-end order-3';
  this.selector.parentElement.parentElement.appendChild(addpagination);
  const total = this.innerElements.length - (this.perPage-1);

  for (let i = 0; i < total; i++) {
    const btn = document.createElement('div');
    btn.className = 'btn-lg fas fa-square fa-2x';
    btn.addEventListener('click', () => this.goTo(i));
    addpagination.appendChild(btn);
  }
}

Siema.prototype.buttonPaginationSettings = function(btn_ableded) {
  const btns = this.selector.parentElement.parentElement.querySelectorAll('.fa-square');
  for (const btn of btns) btn.style.opacity = 1;
  btns[btn_ableded].style.opacity = 0.3;
}

Siema.prototype.visiblePagination = function(visiblestate) {
  const btns = document.querySelectorAll('.fa-square');
  for (const btn of btns) btn.style.visibility = visiblestate;
  if (visiblestate == 'hidden') btns[0].parentElement.remove(); // remove div com as paginações do html
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

// Update pagination
Siema.prototype.updatePagination = function() {
  const pagination = this.selector.parentElement.parentElement.getElementsByClassName('siema-pagination')
  while(pagination.length > 0) {
    pagination[0].remove();
  }
  this.addPagination();
}

for(const siemaelement of siemaelements) {
  var index = (siemaelement.hasAttribute('timer')) ? (JSON.parse(siemaelement.attributes['timer'].value) ? (siemaelement.children.length - 1) : 0) : 0;

  const resolution = (siemaelement.hasAttribute('resolution')) ? siemaelement.attributes['resolution'].value.split('-') : [1,1,1];
  const resolution1024 = (resolution[0] != 'undefined') ? parseInt(resolution[0]) : 1;
  const resolution768 = (resolution[1] != 'undefined') ? parseInt(resolution[1]) : 1;
  const resolution576 = (resolution[2] != 'undefined') ? parseInt(resolution[2]) : 1;

  const siemainstance = new Siema({
    selector: siemaelement,
    easing: 'ease-out',
    perPage: {
      1024: resolution1024,
      768: resolution768,
      576: resolution576,
    },
    startIndex: index,
    draggable: true,
    multipleDrag: true,
    loop: true,
    duration: 250,
    onChange: () => {
      if (siemaelement.hasAttribute('timer')) siemainstance.timereset();
      if (siemainstance.pagination_boo) {
        siemainstance.updatePagination();
        if (window.innerWidth > 578){
          siemainstance.buttonPaginationSettings(siemainstance.currentSlide);
          siemainstance.visiblePagination('visible');
        } else {
          siemainstance.visiblePagination('hidden');
        }
      }
      (window.innerWidth < 578) ? siemainstance.visibleArrows('hidden') : siemainstance.visibleArrows('visible');
    },
  });
  siemainstance.arrow_boo = (siemaelement.hasAttribute('arrow')) ? JSON.parse(siemaelement.attributes['arrow'].value) : false;
  siemainstance.pagination_boo = (siemaelement.hasAttribute('pagination')) ? JSON.parse(siemaelement.attributes['pagination'].value) : false;
  siemainstance.settimer_value = (siemaelement.hasAttribute('settimer')) ? JSON.parse(siemaelement.attributes['settimer'].value) : false;

  if (siemainstance.pagination_boo) {
    siemainstance.addPagination();
    siemainstance.buttonPaginationSettings(0);
  }
  if (siemainstance.arrow_boo) siemainstance.addArrows();
  if (siemaelement.hasAttribute('timer')) {
    siemainstance.timer_loop_active = JSON.parse(siemaelement.attributes['timer'].value);
    siemainstance.timerloop();
    siemainstance.settimer = parseInt(siemainstance.settimer_value);
  }
  siemainstance.resizeHandler();
}
