'use strict';

var keys = [];
var mash = ['cmd', 'alt', 'ctrl'];
var monitorMash = ['alt', 'ctrl'];
var margin = 0;
var previousFrame;

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
}

Window.prototype.grid = function (x, y, reverse) {
    var log = {};
    var frame = this.screen().visibleFrameInRectangle();

    var newWindowFrame = _(this.frame()).extend({
        width: (frame.width * x) - (2 * margin),
        height: (frame.height * y) - (2 * margin)
    });

    var position = reverse ? Position.topRight(frame, newWindowFrame, margin) :
                             Position.topLeft(frame, newWindowFrame, margin);

    this.setFrame(_(newWindowFrame).extend(position));
}


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
}

Window.prototype.isFullScreen = function () {
    var frame = this.frame();
    var fullScreenFrame = this.screen().visibleFrameInRectangle();
    var isFullScreen = (frame.x === fullScreenFrame.x &&
        frame.y === fullScreenFrame.y &&
        frame.width === fullScreenFrame.width &&
        frame.height === fullScreenFrame.height);

    Phoenix.log(isFullScreen);
    return isFullScreen;
}

function moveToScreen(window, screen) {
  if (!window) return;
  if (!screen) return;

  var frame = window.frame();
  var oldScreenRect = window.screen().visibleFrameInRectangle();
  var newScreenRect = screen.visibleFrameInRectangle();
  var xRatio = newScreenRect.width / oldScreenRect.width;
  var yRatio = newScreenRect.height / oldScreenRect.height;

  var mid_pos_x = frame.x + Math.round(0.5 * frame.width);
  var mid_pos_y = frame.y + Math.round(0.5 * frame.height);

  window.setFrame({
    x: (mid_pos_x - oldScreenRect.x) * xRatio + newScreenRect.x - 0.5 * frame.width,
    y: (mid_pos_y - oldScreenRect.y) * yRatio + newScreenRect.y - 0.5 * frame.height,
    width: frame.width,
    height: frame.height
  });
};


keys.push(Phoenix.bind('space', mash, function () {
    var window = Window.focusedWindow();

    // toggling (if currently full screen and there's a previous frame captured, use that)
    if (window.isFullScreen() && previousFrame ) {
        window.setFrame(previousFrame);
        previousFrame = null;
        return;
    }

    previousFrame = window.frame();
    window.grid(1, 1);
    window.to(Position.topLeft);
}));

keys.push(Phoenix.bind('left', mash, function () {
    var window = Window.focusedWindow();
    window.grid(0.5, 1);
    window.to(Position.left);
}));

keys.push(Phoenix.bind('right', mash, function () {
    var window = Window.focusedWindow();
    window.grid(0.5, 1);
    window.to(Position.right);
}));

keys.push(Phoenix.bind('up', mash, function () {
    var window = Window.focusedWindow();
    window.grid(1, 0.5);
    window.to(Position.top);
}));

keys.push(Phoenix.bind('down', mash, function () {
    var window = Window.focusedWindow();
    window.grid(1, 0.5);
    window.to(Position.bottom);
}));

keys.push(Phoenix.bind('right', monitorMash, function () {
    var window = Window.focusedWindow();
    moveToScreen(window, window.screen().next());
}));

keys.push(Phoenix.bind('left', monitorMash, function () {
    var window = Window.focusedWindow();
    moveToScreen(window, window.screen().previous());
}));
