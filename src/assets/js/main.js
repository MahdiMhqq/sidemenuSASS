// jq no conflict
var jq = $.noConflict();

// ******************** Random Movement of Floating Cricles **********************/
/* Thanks to LEE SHERWOOD for his response on stack overflow
   Thread : https://stackoverflow.com/users/887728/lee
*/

function RandomObjectMover(obj, container, posX, posY) {
  this.$object = obj;
  this.$container = container;
  this.container_is_window = container === window;
  this.pixels_per_second = 150;
  this.current_position = { x: posX, y: posY };
  this.is_running = false;
}

// Set the speed of movement in Pixels per Second.
RandomObjectMover.prototype.setSpeed = function (pxPerSec) {
  this.pixels_per_second = pxPerSec;
};

RandomObjectMover.prototype._getContainerDimensions = function () {
  if (this.$container === window) {
    return {
      height: this.$container.innerHeight,
      width: this.$container.innerWidth,
    };
  } else {
    return {
      height: this.$container.clientHeight,
      width: this.$container.clientWidth,
    };
  }
};

RandomObjectMover.prototype._generateNewPosition = function () {
  // Get container dimensions minus div size
  var containerSize = this._getContainerDimensions();
  var availableHeight = containerSize.height - this.$object.clientHeight;
  var availableWidth = containerSize.width - this.$object.clientHeight;

  // Pick a random place in the space
  var y = Math.floor(Math.random() * availableHeight);
  var x = Math.floor(Math.random() * availableWidth);

  return { x: x, y: y };
};

RandomObjectMover.prototype._calcDelta = function (a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  var dist = Math.sqrt(dx * dx + dy * dy);
  return dist;
};

RandomObjectMover.prototype._moveOnce = function () {
  // Pick a new spot on the page
  var next = this._generateNewPosition();

  // How far do we have to move?
  var delta = this._calcDelta(this.current_position, next);

  // Speed of this transition, rounded to 2DP
  var speed = Math.round((delta / this.pixels_per_second) * 100) / 100;

  //console.log(this.current_position, next, delta, speed);

  this.$object.style.transition = "transform " + speed + "s linear";
  this.$object.style.transform =
    "translate3d(" + next.x + "px, " + next.y + "px, 0)";

  // Save this new position ready for the next call.
  this.current_position = next;
};

RandomObjectMover.prototype.start = function () {
  if (this.is_running) {
    return;
  }

  // Make sure our object has the right css set
  this.$object.style.willChange = "transform";
  this.$object.style.pointerEvents = "auto";

  this.boundEvent = this._moveOnce.bind(this);

  // Bind callback to keep things moving
  this.$object.addEventListener("transitionend", this.boundEvent);

  // Start it moving
  this._moveOnce();

  this.is_running = true;
};

RandomObjectMover.prototype.stop = function () {
  if (!this.is_running) {
    return;
  }

  this.$object.removeEventListener("transitionend", this.boundEvent);

  this.is_running = false;
};

// Init it
var floatingCircle1 = new RandomObjectMover(
  document.querySelector(".floating-circle1"),
  document.querySelector(".hero-header"),
  0,
  0
);
var floatingCircle2 = new RandomObjectMover(
  document.querySelector(".floating-circle2"),
  document.querySelector(".hero-header"),
  1000,
  500
);

floatingCircle1.start();
floatingCircle2.start();

// ******************** END Random Movement of Floating Cricles **********************/
jq(function () {
  // side bar menu
  jq(".menu-btn, .overlay-sidebar")
    .not(".animating")
    .on("click", function () {
      /* i know!! this if else looks so messy and the expressions look the same!
      this happened for two reason :
      1.for some reason, jQuery not selector (":not()") wont work properly with classes!
        ex: $(".foo1:not(.foo2))  
        Shame!
      2.for some other resons, The minifier that i use for minifying .js codes (gulp-uglify),
        that uses uglify-js as a core minifier, has some horrible bugs when it comes to if else
        statements. ( i dunno its like this in pure js files too or this bug shows itself just in jQuery files! )
        So, can i live a happy life without minifying my js code? NO.
        can i manually every time minify my edited js code? NO.
        Are jQuery guys are stupid and just overexaggerating about the library? YES!
        
        anyways. this is what it is and what you see!
    */

      if (
        jq(".menu-btn").hasClass("first") &&
        !jq(".menu-btn").hasClass("animating")
      ) {
        //first time page loads
        jq(".menu-btn")
          .addClass("animating")
          .removeClass("first")
          .toggleClass("checked");
        jq(".menu")
          .addClass("animating")
          .removeClass("first")
          .toggleClass("opened");
        jq(".overlay-sidebar").addClass("animating").toggleClass("open");
      } else if (
        !jq(".menu-btn").hasClass("first") &&
        !jq(".menu-btn").hasClass("animating")
      ) {
        //after first time
        jq(".menu-btn")
          .addClass("animating")
          .toggleClass("unchecked")
          .toggleClass("checked");
        jq(".menu")
          .addClass("animating")
          .toggleClass("closed")
          .toggleClass("opened");
        jq(".overlay-sidebar").addClass("animating").toggleClass("open");
      }
      setTimeout(function () {
        jq(".menu-btn").removeClass("animating");
        jq(".menu").removeClass("animating");
        jq(".overlay-sidebar").removeClass("animating");
      }, 3000);
    });

  // sign in modal box
  jq(".signin-modal-btn,.signin-overlay").on("click", function () {
    jq(".signin-modal").toggleClass("open");
    jq(".signin-overlay").fadeToggle(500);
  });
  // show/hide password in modal box password input
  jq("#show-pass").on("click", function () {
    if (jq(".pass-input").attr("type") === "password") {
      jq(this).removeClass("fa-eye-slash").addClass("fa-eye");
      jq(".pass-input").attr("type", "text");
    } else {
      jq(this).removeClass("fa-eye").addClass("fa-eye-slash");
      jq(".pass-input").attr("type", "password");
    }
  });
  // corner-menu
  jq("#corner-btn").on("click", function (e) {
    e.preventDefault();
    jq(".corner-menu").toggleClass("active");
  });
  // toast
  // toast close button
  jq(".toast-close").on("click", function () {
    jq(this)
      .parent(".toast-item")
      .fadeOut("slow", function () {
        jq(this).remove();
      });
  });
  // toast auto close after n miliseconds
  setTimeout(function () {
    jq(".toast-item.toast-item-info, .toast-item.toast-item-success").fadeOut(
      "slow",
      function () {
        jq(this).remove();
      }
    );
  }, 15000);
});
