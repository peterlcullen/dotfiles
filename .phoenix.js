// config file for Phoenix window manager https://github.com/jasonm23/phoenix
// To install:
//   install cask, if haven't already
//   $ brew install caskroom/cask/brew-cask
//   
//   install phoenix
//   $ brew cask install phoenix
//   
//   open phoenix app and give permission to "control your computer" (in Preferences/Security)

var mash = [ 'cmd', 'alt', 'ctrl' ],
  monitorMash = ['alt', 'ctrl']
  padding = 0,
  previousSizes = {};

api.bind('left', monitorMash, leftOneMonitor);
api.bind('right', monitorMash, rightOneMonitor);

api.bind( 'space', mash, function() {
  Window.focusedWindow().toggleFullscreen();
});

api.bind( 'up', mash, function() {
  Window.focusedWindow().toN();
});

api.bind( 'right', mash, function() {
  Window.focusedWindow().toE();
});

api.bind( 'down', mash, function() {
  Window.focusedWindow().toS();
});

api.bind( 'left', mash, function() {
  Window.focusedWindow().toW();
});

// This method can be used to push a window to a certain position and size on
// the screen by using four floats instead of pixel sizes.  Examples:
//
//     // Window position: top-left; width: 25%, height: 50%
//     someWindow.toGrid( 0, 0, 0.25, 0.5 );
//
//     // Window position: 30% top, 20% left; width: 50%, height: 35%
//     someWindow.toGrid( 0.3, 0.2, 0.5, 0.35 );
//
// The window will be automatically focused.  Returns the window instance.
Window.prototype.toGrid = function( x, y, width, height ) {
  var screen = this.screen().frameWithoutDockOrMenu(),
    newFrame = {
      x: Math.round( x * screen.width ) + padding + screen.x,
      y: Math.round( y * screen.height ) + padding + screen.y,
      width: Math.round( width * screen.width ) - ( 2 * padding ),
      height: Math.round( height * screen.height ) - ( 2 * padding )
    };

  // When setting the `height` to 1, the padding isn't applied at the bottom
  // end of the frame.  (I guess it's a bug.)  Setting the frame to a height
  // less than `1` first is a workaround to counter that behaviour.
  if ( height === 1 ) {
    this.setFrame(
      _({}).extend( newFrame, { height: screen.height - 50 })
    );
  }

  this.setFrame( newFrame );
  this.focusWindow();

  return this;
};

// Convenience method, doing exactly what it says.  Returns the window
// instance.
Window.prototype.toFullScreen = function() {
  return this.toGrid( 0, 0, 1, 1 );
};

// Convenience method, pushing the window to the top half of the screen.
// Returns the window instance.
Window.prototype.toN = function() {
  return this.toGrid( 0, 0, 1, 0.5 );
};

// Convenience method, pushing the window to the right half of the screen.
// Returns the window instance.
Window.prototype.toE = function() {
  return this.toGrid( 0.5, 0, 0.5, 1 );
};

// Convenience method, pushing the window to the bottom half of the screen.
// Returns the window instance.
Window.prototype.toS = function() {
  return this.toGrid( 0, 0.5, 1, 0.5 );
};

// Convenience method, pushing the window to the left half of the screen.
// Returns the window instance.
Window.prototype.toW = function() {
  return this.toGrid( 0, 0, 0.5, 1 );
};

// Stores the window position and size, then makes the window full screen.
// Should the window be full screen already, its original position and size
// is restored.  Returns the window instance.
Window.prototype.toggleFullscreen = function() {
  if ( previousSizes[ this ] ) {
    this.setFrame( previousSizes[ this ] );
    delete previousSizes[ this ];
  }
  else {
    previousSizes[ this ] = this.frame();
    this.toFullScreen();
  }

  return this;
};

// Move Windows Between Monitors
function moveToScreen(win, screen) {
  if (!screen) { return; }

  var frame = win.frame();
  var oldScreenRect = win.screen().frameWithoutDockOrMenu();
  var newScreenRect = screen.frameWithoutDockOrMenu();

  var xRatio = newScreenRect.width / oldScreenRect.width;
  var yRatio = newScreenRect.height / oldScreenRect.height;

  win.setFrame({
    x: (Math.round(frame.x - oldScreenRect.x) * xRatio) + newScreenRect.x,
    y: (Math.round(frame.x - oldScreenRect.y) * yRatio) + newScreenRect.y,
    width: Math.round(frame.width * xRatio),
    height: Math.round(frame.height * yRatio)
  });
}

function circularLookup(array, index) {
  if (index < 0) { return array[array.length + (index % array.length)]; }
  return array[index % array.length];
}

function rotateMonitors(offset) {
  var win = Window.focusedWindow();
  var currentScreen = win.screen();
  var screens = [currentScreen];

  for (var x = currentScreen.previousScreen(); x != win.screen(); x = x.previousScreen() ) {
    screens.push(x);
  }

  screens = _(screens).sortBy(function(s) { return s.frameWithoutDockOrMenu().x });
  var currentIndex = _(screens).indexOf(currentScreen);
  moveToScreen(win, circularLookup(screens, currentIndex + offset));
}

function leftOneMonitor() {
  rotateMonitors(-1);
}

function rightOneMonitor() {
  rotateMonitors(1);
}
