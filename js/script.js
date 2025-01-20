// burger-menu
const burgerMenu = document.querySelector('.burger-menu'),
	header = document.querySelector('.header'),
	menu = document.querySelector('.header__menu-wrapper');

burgerMenu.addEventListener('click', (e) => {
	burgerMenu.classList.toggle('_active');
	menu.classList.toggle('_active');
	document.body.classList.toggle('_lock');
	header.classList.toggle('_open-menu');
});

// A function that moves elements to other blocks depending on the size of the screen. (Used when adapting the page to different devices.)
function dynamicAdaptiv() {
	class DynamicAdapt {
		constructor(type) {
			this.type = type
		}

		init() {
			// массив объектов
			this.оbjects = []
			this.daClassname = '_dynamic_adapt_'
			// массив DOM-элементов
			this.nodes = [...document.querySelectorAll('[data-da]')]

			// наполнение оbjects обьектами
			this.nodes.forEach((node) => {
				const data = node.dataset.da.trim()
				const dataArray = data.split(',')
				const оbject = {}
				оbject.element = node
				оbject.parent = node.parentNode
				оbject.destination = document.querySelector(`${dataArray[0].trim()}`)
				оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767'
				оbject.place = dataArray[2] ? dataArray[2].trim() : 'last'
				оbject.index = this.indexInParent(оbject.parent, оbject.element)
				this.оbjects.push(оbject)
			})
			this.arraySort(this.оbjects)

			// массив уникальных медиа-запросов
			this.mediaQueries = this.оbjects
				.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
				.filter((item, index, self) => self.indexOf(item) === index)
			// навешивание слушателя на медиа-запрос
			// и вызов обработчика при первом запуске
			this.mediaQueries.forEach((media) => {
				const mediaSplit = media.split(',')
				const matchMedia = window.matchMedia(mediaSplit[0])
				const mediaBreakpoint = mediaSplit[1]

				// массив объектов с подходящим брейкпоинтом
				const оbjectsFilter = this.оbjects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint)
				matchMedia.addEventListener('change', () => {

					this.mediaHandler(matchMedia, оbjectsFilter)
				})
				this.mediaHandler(matchMedia, оbjectsFilter)
			})
		}

		// Основная функция
		mediaHandler(matchMedia, оbjects) {
			if (matchMedia.matches) {
				оbjects.forEach((оbject) => {
					// оbject.index = this.indexInParent(оbject.parent, оbject.element);
					this.moveTo(оbject.place, оbject.element, оbject.destination)
				})
			} else {
				оbjects.forEach(({ parent, element, index }) => {
					if (element.classList.contains(this.daClassname)) {
						this.moveBack(parent, element, index)
					}
				})
			}
		}

		// Функция перемещения
		moveTo(place, element, destination) {
			element.classList.add(this.daClassname)
			if (place === 'last' || place >= destination.children.length) {
				destination.append(element)
				return
			}
			if (place === 'first') {
				destination.prepend(element)
				return
			}
			destination.children[place].before(element)
		}

		// Функция возврата
		moveBack(parent, element, index) {
			element.classList.remove(this.daClassname)
			if (parent.children[index] !== undefined) {
				parent.children[index].before(element)
			} else {
				parent.append(element)
			}
		}

		// Функция получения индекса внутри родителя
		indexInParent(parent, element) {
			return [...parent.children].indexOf(element)
		}

		// Функция сортировки массива по breakpoint и place
		// по возрастанию для this.type = min
		// по убыванию для this.type = max
		arraySort(arr) {
			if (this.type === 'min') {
				arr.sort((a, b) => {
					if (a.breakpoint === b.breakpoint) {
						if (a.place === b.place) {
							return 0
						}
						if (a.place === 'first' || b.place === 'last') {
							return -1
						}
						if (a.place === 'last' || b.place === 'first') {
							return 1
						}
						return 0
					}
					return a.breakpoint - b.breakpoint
				})
			} else {
				arr.sort((a, b) => {
					if (a.breakpoint === b.breakpoint) {
						if (a.place === b.place) {
							return 0
						}
						if (a.place === 'first' || b.place === 'last') {
							return 1
						}
						if (a.place === 'last' || b.place === 'first') {
							return -1
						}
						return 0
					}
					return b.breakpoint - a.breakpoint
				})
				return
			}
		}
	}

	let da = new DynamicAdapt('max');
	da.init();
}

dynamicAdaptiv()



// open/close menu on mobile
const menuLinks = document.querySelectorAll('.header-menu__link');

if (menuLinks) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener('click', onClickToLink)

		function onClickToLink(e) {
			e.preventDefault()
			if (document.documentElement.dataset.mobileMode === 'true') {
				const menuContent = menuLink.nextElementSibling;
				menuLink.classList.toggle('_active')
				_slideToggle(menuContent)
			}


			function _slideUp(target, duration = 500) {
				if (!target.classList.contains('_slide')) {
					target.classList.add('_slide');

					target.style.transitionProperty = 'height, margin, padding';
					target.style.transitionDuration = duration + 'ms';
					target.style.height = target.offsetHeight + 'px';
					target.offsetHeight;
					target.style.overflow = 'hidden';
					target.style.height = 0;
					target.style.paddingTop = 0;
					target.style.paddingBottom = 0;
					target.style.marginTop = 0;
					target.style.marginBottom = 0;
					window.setTimeout(() => {
						target.style.display = 'none';
						target.style.removeProperty('height');
						target.style.removeProperty('padding-top');
						target.style.removeProperty('padding-bottom');
						target.style.removeProperty('margin-top');
						target.style.removeProperty('margin-bottom');
						target.style.removeProperty('overflow');
						target.style.removeProperty('transition-duration');
						target.style.removeProperty('transition-property');
						target.classList.remove('_slide');
					}, duration);
				}
			}

			function _slideDown(target, duration = 500) {
				if (!target.classList.contains('_slide')) {
					target.classList.add('_slide');

					target.style.removeProperty('display');
					let display = window.getComputedStyle(target).display;
					if (display === 'none')
						display = 'block'

					target.style.display = display;
					let height = target.offsetHeight;
					target.style.overflow = 'hidden';
					target.style.height = 0;
					target.style.paddingTop = 0;
					target.style.paddingBottom = 0;
					target.style.marginTop = 0;
					target.style.marginBottom = 0;
					target.offsetHeight;
					target.style.transitionProperty = 'height, margin, padding';
					target.style.transitionDuration = duration + 'ms';
					target.style.height = height + 'px';
					target.style.removeProperty('padding-top');
					target.style.removeProperty('padding-bottom');
					target.style.removeProperty('margin-top');
					target.style.removeProperty('margin-bottom');
					window.setTimeout(() => {
						target.style.removeProperty('height');
						target.style.removeProperty('overflow');
						target.style.removeProperty('transition-duration');
						target.style.removeProperty('transition-property');
						target.classList.remove('_slide');
					}, duration);
				}

			}

			function _slideToggle(target, duration = 500) {
				if (window.getComputedStyle(target).display === 'none') {
					return _slideDown(target, duration);
				} else {
					_slideUp(target, duration);
				}
			}
		}
		
	});


}


//  set html tag atribute "mobile-mode" on screens < 991.98px
let mql = window.matchMedia("(max-width: 991.98px)");
window.addEventListener('resize', mobileModeFunction)

function mobileModeFunction() {
	if (mql.matches) {
		document.documentElement.dataset.mobileMode = true
	} else {
		document.documentElement.dataset.mobileMode = false
	}
}

mobileModeFunction()



// change header on scroll
window.addEventListener('scroll', onScrollFunction)

function onScrollFunction(e) {

	let scrollPosition = document.documentElement.scrollTop || document.body.scrollTop

	if (scrollPosition > 10) {
		header.classList.add('_active')
	} else {
		header.classList.remove('_active')
	}
}