var COWS = [];

function birth_cows(ctx, a) {
  var total = 23;

  var x0 = WIDTH * .70;
  var y0 = HEIGHT * .55;
  for (var i = 0; i < total; i++) {
    x = x0 + Math.random() * 250;
    y = y0 + Math.random() * 250;
    cow = birth_cow(ctx, a, x, y);
    COWS.push(cow);
  }
}

function place_fence(ctx, a) {
  var leftmost = Math.round(WIDTH * .6);
  var topmost = Math.round(HEIGHT * .5);
  // top line
  for (var i = 0; i < 20; i++) {
    a.push({
      image: function () {
        return IMAGES["fence_north"];
      },
      x: leftmost + 24 * i,
      y: topmost,
      draw: function (ctx) {
        ctx.drawImage(this.image(), this.x, this.y);
      }
    });
  }

  // west side
  for (var i = 0; i < 13; i++) {
    a.push({
      image: function () {
        return IMAGES["fence_west"];
      },
      x: leftmost - 8,
      y: 6 + topmost + 24 * i,
      draw: function (ctx) {
        ctx.drawImage(this.image(), this.x, this.y);
      }
    });
  }

  // west side
  for (var i = 0; i < 13; i++) {
    a.push({
      image: function () {
        return IMAGES["fence_east"];
      },
      x: leftmost + 480,
      y: 6 + topmost + 24 * i,
      draw: function (ctx) {
        ctx.drawImage(this.image(), this.x, this.y);
      }
    });
  }

  // bottom line
  for (var i = 0; i < 20; i++) {
    a.push({
      image: function () {
        return IMAGES["fence_south"];
      },
      x: leftmost + 24 * i,
      y: topmost + 312,
      draw: function (ctx) {
        ctx.drawImage(this.image(), this.x, this.y);
      }
    });
  }

}

function birth_cow(ctx, a, x, y) {
  var cow;
  cow = {
    image: function () {
      if (this.alive) {
        return IMAGES[["cow_north", "cow_east", "cow_south", "cow_west"][this.direction]];
      } else {
        return IMAGES["dead_cow"];
      }
    },
    x: x,
    y: y,
    way_x: undefined,
    way_y: undefined,
    actions: [],
    label: function() { return "cow"; },
    step: function() {
      var step = .6;
      return step;
    },
    stop: function () {
      if (cow.actions) {
        clear_intervals(cow.actions);
      }
      cow.actions = [];
      cow.way_x = undefined;
      cow.way_y = undefined;

      if (!cow.alive) {
        return;
      }

      var delay = Math.random() * 10;
      var move = Math.random() * 10;
      if (move < 6) {
        // don't always pick a destination
        setTimeout(cow.stop, delay * 1000);
      } else {
        var x, y;
        if (Math.random() > .5) {
          x = cow.x + Math.random() * 100;
        } else {
          x = cow.x - Math.random() * 100;
        }

        if (Math.random() > .5) {
          y = cow.y + Math.random() * 100;
        } else {
          y = cow.y - Math.random() * 100;
        }

        set_waypoint(cow, x, y);
      }
    },
    draw: function (ctx) {
      if (this.way_x !== undefined && this.way_y !== undefined) {
          if (Math.abs(COWBOY.x - this.x) < 10 &&
              Math.abs(COWBOY.y - this.y) < 10) {
            this.bridle();
          }
      }

      if (!this.alive) {
        ctx.drawImage(this.image(),
            this.frame_width * this.frame, 0, this.frame_width, this.frame_height,
            this.x - Math.floor(this.frame_width / 2),
            this.y - Math.floor(this.frame_height / 2),
            this.frame_width, this.frame_height);
      } else if (this.unbridled) {
        draw_actor(ctx, this);
      }
    },
    alive: true,
    unbridled: true,
    direction: EAST,
    // death animation
    frame_width: 17,
    frame_height: 12,
    frames: 7,
    frame: 0,
    delay: 2000,
    bridle: function() {
        COWBOY.horse = true;
        this.unbridled = false;
        this.x = COWBOY.x;
        this.y = COWBOY.y;

        this.way_x = undefined;
        this.way_y = undefined;
    },
    unbridle: function() {
        COWBOY.horse = false;
        this.unbridled = true;
        this.x = COWBOY.x;
        this.y = COWBOY.y;
    },
    kill: function() {
      if (this.alive) {
        this.alive = false;
        this.decay(this);
      }
    },
    decay: function (actor) {
      actor.frame++;
      if (actor.frame < actor.frames) {
        setTimeout(function() {
          actor.decay(actor);
        }, actor.delay);
      }
    }
  }
  cow.stop();
  a.push(cow);

  return cow;
}
