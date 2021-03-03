function animationVert(leftSide, topSide, elem) {
	var $ = {
		radius: 10,  
		speed: 20 
	}
	var f = 0;
	var s = 2 * Math.PI / 180; 
	setInterval(function() { 
		f += s; 
		  elem.style.left = leftSide + $.radius * Math.sin(f)  + 'px'; 
		  elem.style.top = topSide + $.radius * Math.sin(f) + 'px';
	}, $.speed)
}


function animationRound(leftSide, topSide, rad, sp, elem) {
	var $ = {
		radius: rad,  
		speed: sp  
	}
	var f = 0;
	var s = 2 * Math.PI / 180; 
	setInterval(function() { 
		f += s; 
		  elem.style.left = leftSide + $.radius * Math.sin(f)  + 'px'; 
		  elem.style.top = topSide + $.radius * Math.cos(f) + 'px';
	}, $.speed)
}

let opac = document.getElementById("decoration-op")
let yell = document.getElementById("decoration-yel")
let ell = document.getElementById("promo__ellipse")
let ring = document.getElementById("decoration-ring-md")
let leftEl = window.getComputedStyle(ring)
let leftStyleValue = leftEl.getPropertyValue('width')
let leftValue = (parseInt(leftStyleValue) / 2) - 7
let radCenter = parseInt(leftStyleValue) / 2

animationVert(-50, 220, opac)
animationRound(200, 70, 10, 15, yell)
animationRound(leftValue, leftValue, radCenter, 30, ell)


'use strict';
var slideShow = (function () {
  return function (selector, config) {
    var
      _slider = document.querySelector(selector), 
      _sliderContainer = _slider.querySelector('.slider__items'), 
      _sliderItems = _slider.querySelectorAll('.slider__item'), 
      _sliderControls = _slider.querySelectorAll('.slider__control'), 
      _currentPosition = 0, 
      _transformValue = 0, 
      _transformStep = 100, 
      _itemsArray = [], 
      _timerId,
      _indicatorItems,
      _indicatorIndex = 0,
      _indicatorIndexMax = _sliderItems.length - 1,
      _config = {
        isAutoplay: false, 
        directionAutoplay: 'next', 
        delayAutoplay: 5000, 
        isPauseOnHover: true 
      };

    
    for (var key in config) {
      if (key in _config) {
        _config[key] = config[key];
      }
    }

    for (var i = 0; i < _sliderItems.length; i++) {
      _itemsArray.push({ item: _sliderItems[i], position: i, transform: 0 });
    }

    
    var position = {
      getItemIndex: function (mode) {
        var index = 0;
        for (var i = 0; i < _itemsArray.length; i++) {
          if ((_itemsArray[i].position < _itemsArray[index].position && mode === 'min') || (_itemsArray[i].position > _itemsArray[index].position && mode === 'max')) {
            index = i;
          }
        }
        return index;
      },
      getItemPosition: function (mode) {
        return _itemsArray[position.getItemIndex(mode)].position;
      }
    };


    var _move = function (direction) {
      var nextItem, currentIndicator = _indicatorIndex;
      if (direction === 'next') {
        _currentPosition++;
        if (_currentPosition > position.getItemPosition('max')) {
          nextItem = position.getItemIndex('min');
          _itemsArray[nextItem].position = position.getItemPosition('max') + 1;
          _itemsArray[nextItem].transform += _itemsArray.length * 100;
          _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
        }
        _transformValue -= _transformStep;
        _indicatorIndex = _indicatorIndex + 1;
        if (_indicatorIndex > _indicatorIndexMax) {
          _indicatorIndex = 0;
        }
      } else {
        _currentPosition--;
        if (_currentPosition < position.getItemPosition('min')) {
          nextItem = position.getItemIndex('max');
          _itemsArray[nextItem].position = position.getItemPosition('min') - 1;
          _itemsArray[nextItem].transform -= _itemsArray.length * 100;
          _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
        }
        _transformValue += _transformStep;
        _indicatorIndex = _indicatorIndex - 1;
        if (_indicatorIndex < 0) {
          _indicatorIndex = _indicatorIndexMax;
        }
      }
      _sliderContainer.style.transform = 'translateX(' + _transformValue + '%)';
      _indicatorItems[currentIndicator].classList.remove('active');
      _indicatorItems[_indicatorIndex].classList.add('active');
    };

    
    var _moveTo = function (index) {
      var i = 0, direction = (index > _indicatorIndex) ? 'next' : 'prev';
      while (index !== _indicatorIndex && i <= _indicatorIndexMax) {
        _move(direction);
        i++;
      }
    };

   
    var _startAutoplay = function () {
      if (!_config.isAutoplay) {
        return;
      }
      _stopAutoplay();
      _timerId = setInterval(function () {
        _move(_config.directionAutoplay);
      }, _config.delayAutoplay);
    };

    var _stopAutoplay = function () {
      clearInterval(_timerId);
    };

    var _addIndicators = function () {
      var indicatorsContainer = document.createElement('ol')
      indicatorsContainer.classList.add('slider__indicators');
      for (var i = 0; i < _sliderItems.length; i++) {
        var sliderIndicatorsItem = document.createElement('li');
        if (i === 0) {
          sliderIndicatorsItem.classList.add('active');
        }
        sliderIndicatorsItem.setAttribute("data-slide-to", i);
        indicatorsContainer.appendChild(sliderIndicatorsItem);
      }
      _slider.appendChild(indicatorsContainer);
      _indicatorItems = _slider.querySelectorAll('.slider__indicators > li')
    };

    var _setUpListeners = function () {
      _slider.addEventListener('click', function (e) {
        if (e.target.classList.contains('slider__control')) {
          e.preventDefault();
          _move(e.target.classList.contains('slider__control_next') ? 'next' : 'prev');
          _startAutoplay();
        } else if (e.target.getAttribute('data-slide-to')) {
          e.preventDefault();
          _moveTo(parseInt(e.target.getAttribute('data-slide-to')));
          _startAutoplay();
        }
      });
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === "hidden") {
          _stopAutoplay();
        } else {
          _startAutoplay();
        }
      }, false);
      if (_config.isPauseOnHover && _config.isAutoplay) {
        _slider.addEventListener('mouseenter', function () {
          _stopAutoplay();
        });
        _slider.addEventListener('mouseleave', function () {
          _startAutoplay();
        });
      }
    };

    _addIndicators();
    _setUpListeners();
    _startAutoplay();

    return {
      next: function () {
        _move('next');
      },
      
      left: function () {
        _move('prev');
      },

      stop: function () {
        _config.isAutoplay = false;
        _stopAutoplay();
      },

      cycle: function () {
        _config.isAutoplay = true;
        _startAutoplay();
      }
    }
  }
}());

window.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu'),
  menuItem = document.querySelectorAll('.menu__link'),
  hamburger = document.querySelector('.hamburger');

  hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('hamburger_active');
      menu.classList.toggle('menu_active');
  });

  menuItem.forEach(item => {
      item.addEventListener('click', () => {
          hamburger.classList.toggle('hamburger_active');
          menu.classList.toggle('menu_active');
      })
  })
});

$(window).scroll(function(){
  if ($(this).scrollTop() > 1200){
    $('.pageup').fadeIn();
  } else {
    $('.pageup').fadeOut();
  }
});

$(function(){
  $("a[href^='#']").click(function(){
          var _href = $(this).attr("href");
          $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
          return false;
  });
});

$('[data-modal=contact]').on('click', function() {
  $('.overlay, #consultation').fadeIn('slow');
});
$('.modal__close').on('click', function() {
  $('.overlay, #consultation, #thanks').fadeOut('slow');
});


