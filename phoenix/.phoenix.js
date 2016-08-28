'use strict';

var keys = [];
var mash = ['cmd', 'alt', 'ctrl'];
var monitorMash = ['alt', 'ctrl'];
var margin = 0;
var previousFrame;
var increment = 0.05

var Position = {

    central: function (frame, window) {
        return {
            x: frame.x + ((frame.width - window.width) / 2),
            y: frame.y + ((frame.height - window.height) / 2)
        };
    },

    top: function (frame, window) {
        return {
            x: window.x,
            y: frame.y
        };
    },

    bottom: function (frame, window) {
        return {
            x: window.x,
            y: (frame.y + frame.height) - window.height
        };
    },

    left: function (frame, window) {
        return {
            x: frame.x,
            y: window.y
        };
    },

    right: function (frame, window) {
        return {
            x: (frame.x + frame.width) - window.width,
            y: window.y
        };
    },

    topLeft: function (frame, window, margin) {
        return {
            x: Position.left(frame, window).x + margin,
            y: Position.top(frame, window).y + margin
        };
    },

    topRight: function (frame, window, margin) {
        return {
            x: Position.right(frame, window).x - margin,
            y: Position.top(frame, window).y + margin
        };
    },

    bottomLeft: function (frame, window, margin) {
        return {
            x: Position.left(frame, window).x + margin,
            y: Position.bottom(frame, window).y - margin
        };
    },

    bottomRight: function (frame, window, margin) {
        return {
            x: Position.right(frame, window).x - margin,
            y: Position.bottom(frame, window).y - margin

        };
    }
};

Window.prototype.to = function (position) {
    this.setTopLeft(position(this.screen().visibleFrameInRectangle(), this.frame(), margin));

    return this;
};

Window.prototype.grid = function (x, y, reverse) {
    var frame = this.screen().visibleFrameInRectangle();

    var newWindowFrame = _(this.frame()).extend({
        width: (frame.width * x) - (2 * margin),
        height: (frame.height * y) - (2 * margin)
    });

    var position = reverse ? Position.topRight(frame, newWindowFrame, margin) :
                             Position.topLeft(frame, newWindowFrame, margin);

    this.setFrame(_(newWindowFrame).extend(position));

    return this;
};


Window.prototype.resize = function (multiplier) {
    var frame = this.screen().visibleFrameInRectangle();
    var newSize = this.size();

    if (multiplier.x) {
        newSize.width += frame.width * multiplier.x;
    }

    if (multiplier.y) {
        newSize.height += frame.height * multiplier.y;
    }

    this.setSize(newSize);

    return this;
};

Window.prototype.makeRoomForResize = function (attachedEdge, resizeAmount) {
    // this is a hack to move the window before resizing it
    // the framework doesn't allow resizing beyond the limits of the screen

    // no need to do anything if its shrinking
    if (resizeAmount < 0) {
        return this;
    }

    if (attachedEdge === 'right') {
        this.setTopLeft({
            x: this.frame().x - (this.screen().visibleFrameInRectangle().width * increment),
            y: this.frame().y
        });
    }

    if (attachedEdge === 'bottom') {
        this.setTopLeft({
            x: this.frame().x,
            y: this.frame().y - (this.screen().visibleFrameInRectangle().height * increment)
        });
    }

    return this;
};

Window.prototype.resizeAgainstEdge = function (directionTowards, edge) {
    var resizeParams = {};
    var resizeAmount = increment;

    // resizing towards the edge (make it smaller)
    if (directionTowards === edge) {
        resizeAmount = resizeAmount * -1;
    }

    if (edge === 'left' || edge === 'right') {
        resizeParams['x'] = resizeAmount;
    }

    if (edge === 'top' || edge === 'bottom') {
        resizeParams['y'] = resizeAmount;
    }

    this.makeRoomForResize(edge, resizeAmount)
        .resize(resizeParams)
        .to(Position[edge]);
};

Window.prototype.isFullScreen = function () {
    var frame = this.frame();
    var fullScreenFrame = this.screen().visibleFrameInRectangle();

    return (frame.x === fullScreenFrame.x &&
        frame.y === fullScreenFrame.y &&
        frame.width === fullScreenFrame.width &&
        frame.height === fullScreenFrame.height);
};

Window.prototype.isTouchingEdge = function (edge) {
    var isTouchingEdge = false;
    var windowFrame = this.frame();
    var screenFrame = this.screen().visibleFrameInRectangle();

    if (edge === 'left') {
        isTouchingEdge = (windowFrame.x === screenFrame.x)
    }

    if (edge === 'right') {
        isTouchingEdge = ((windowFrame.x + windowFrame.width) === (screenFrame.x + screenFrame.width))
    }

    if (edge === 'top') {
        isTouchingEdge = (windowFrame.y === screenFrame.y)
    }

    if (edge === 'bottom') {
        isTouchingEdge = ((windowFrame.y + windowFrame.height) === (screenFrame.y + screenFrame.height))
    }

    return isTouchingEdge;
};

Window.prototype.moveToScreen = function(screen) {
  if (!screen) return;

  var frame = this.frame();
  var oldScreenRect = this.screen().visibleFrameInRectangle();
  var newScreenRect = screen.visibleFrameInRectangle();
  var xRatio = newScreenRect.width / oldScreenRect.width;
  var yRatio = newScreenRect.height / oldScreenRect.height;

  var mid_pos_x = frame.x + Math.round(0.5 * frame.width);
  var mid_pos_y = frame.y + Math.round(0.5 * frame.height);

  this.setFrame({
      x: (mid_pos_x - oldScreenRect.x) * xRatio + newScreenRect.x - 0.5 * frame.width,
      y: (mid_pos_y - oldScreenRect.y) * yRatio + newScreenRect.y - 0.5 * frame.height,
      width: frame.width,
      height: frame.height
  });
};


keys.push(new Key('space', mash, function () {
    var window = Window.focused();

    // toggling (if currently full screen and there's a previous frame captured, use that)
    if (window.isFullScreen() && previousFrame) {
        window.setFrame(previousFrame);
        previousFrame = null;
        return;
    }

    previousFrame = window.frame();

    window.grid(1, 1)
        .to(Position.topLeft);
}));

keys.push(new Key('left', mash, function () {
    var window = Window.focused();
    var isFullScreen = window.isFullScreen();

    if (window.isTouchingEdge('left') && !isFullScreen) {
        window.resizeAgainstEdge('left', 'left');
        return;
    }

    if (window.isTouchingEdge('right') && !isFullScreen) {
        window.resizeAgainstEdge('left', 'right');
        return;
    }

    window.grid(0.5, 1)
        .to(Position.left);
}));

keys.push(new Key('right', mash, function () {
    var window = Window.focused();
    var isFullScreen = window.isFullScreen();

    if (window.isTouchingEdge('right') && !isFullScreen) {
        window.resizeAgainstEdge('right', 'right');
        return;
    }

    if (window.isTouchingEdge('left') && !isFullScreen) {
        window.resizeAgainstEdge('right', 'left');
        return;
    }

    window.grid(0.5, 1)
        .to(Position.right);
}));

keys.push(new Key('up', mash, function () {
    var window = Window.focused();
    var isFullScreen = window.isFullScreen();

    if (window.isTouchingEdge('top') && !isFullScreen) {
        window.resizeAgainstEdge('top', 'top');
        return;
    }

    if (window.isTouchingEdge('bottom') && !isFullScreen) {
        window.resizeAgainstEdge('top', 'bottom');
        return;
    }

    window.grid(1, 0.5)
        .to(Position.top);
}));

keys.push(new Key('down', mash, function () {
    var window = Window.focused();
    var isFullScreen = window.isFullScreen();

    if (window.isTouchingEdge('bottom') && !isFullScreen) {
        window.resizeAgainstEdge('bottom', 'bottom');
        return;
    }

    if (window.isTouchingEdge('top') && !isFullScreen) {
        window.resizeAgainstEdge('bottom', 'top');
        return;
    }

    window.grid(1, 0.5)
        .to(Position.bottom);
}));

keys.push(new Key('right', monitorMash, function () {
    var window = Window.focused();
    window.moveToScreen(window.screen().next());
}));

keys.push(new Key('left', monitorMash, function () {
    var window = Window.focused();
    window.moveToScreen(window.screen().previous());
}));
