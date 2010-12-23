function GameObj(name) {
	var c = new Object();
	c.type = 'bullet';
	if(!name) c.name = getRandomName();
        else c.name = name;
	c.x = 0;
	c.y = 0;
	c.w = 10;
	c.h = 10;
	c.getCenterPoint = function() {
		var cx = this.x + (this.w - this.x) / 2;
		var cy = this.y + (this.h - this.y) / 2;
		return {x:cx,y:cy};
	}
	return c;
}

function Bullet(name) {
	var c = new GameObj(name);
	c.type = 'bullet';
	c.direction = 0;
	c.x = 0;
	c.y = 0;
	c.w = 10;
	c.h = 10;
	c.owner = null;
	c.speed = 5;
	c.init = function() {
		d = this.owner.direction;
		this.direction = d;
			if(d == 0) {
				cx = 50;cy = 0;
			} else if(d == 1) {
				cx = 100;cy = 50;
			} else if(d == 2) {
				cx = 50;cy = 100;
			} else if(d == 3) {
				cx = 0;cy = 50;
			}
		this.x = this.owner.x + cx;
		this.y = this.owner.y + cy;
		this.ac = -0.01;
	}
	c.draw = function(ctx) {
		THIS = this;
		this.speed += this.ac;
		speed = this.speed;
		d = this.direction;

		if(d == 0) this.y -= speed;
		else if(d == 1) this.x += speed;
		else if(d == 2) this.y += speed;
		else if(d == 3) this.x -= speed;
		if(this.x > game.world.width || this.x < 0 || this.y > game.world.height || this.y < 0) {
			gameEvent.trigger('die', this);
		}

		helper.draw(ctx, this, function(t) {
			t.__drawOval(0,0,100,100);
			t.__drawOval(10,10,90,90);
			t.__drawOval(30,30,70,70);
		});
		this.checkHit();
	}
	c.checkHit = function() {
		for(var i=0; i<game.world.objs.length; i++) {
			var obj = game.world.objs[i];
			if(obj.name != this.name && obj.type == 'hero' && helper.distance(obj,this) < 20) {
				obj.life -= 1;
				if(obj.life <= 0) gameEvent.trigger('die', obj);
				gameEvent.trigger('die', this);
			}
		}
	}
	return c;
}

function Hero(name) {
	var c = new GameObj(name);
	c.type = 'hero';
	c.direction = 1;
	c.x = 0;
	c.y = 0;
	c.w = 100;
	c.h = 100;
	c.life = 100;
	c.draw = function(ctx) {
		THIS = this;
		helper.draw(ctx, this, function(t) {
			t.__drawRect(20,20,80,80);
			var d = THIS.direction;
			if(d == 0) {
				cx = 50;cy = 0;
			} else if(d == 1) {
				cx = 100;cy = 50;
			} else if(d == 2) {
				cx = 50;cy = 100;
			} else if(d == 3) {
				cx = 0;cy = 50;
			}
			t.__drawLine(50,50,cx,cy);
			t.__drawText(THIS.life, 21,51);
		});
	}
	return c;
}

function World() {
	var c = new Object();
	c.objs = new Array();
	c.width = 500;
	c.height = 500;
	c.canvas = null;
	c.ctx = null;
	c.control = new Control(this);
	c.addObj = function(obj) {
                var target = this.findObj(obj.name);
		if(!target)
			this.objs.push(obj);
                else
                        return target;
                return obj;
	}
	c.findObj = function(name) {
		for(var i=0; i<this.objs.length; i++) {
			var obj = this.objs[i];
			if(obj.name == name) {
				return obj;
			}
		}
		return null;
	}
	c.removeObj = function(name) {
		for(var i=0; i<this.objs.length; i++) {
			var obj = this.objs[i];
			if(obj.name == name) {
				this.objs.splice(i, 1);
			}
		}
	}
	c.draw = function() {
		var canvas = document.getElementById('canvalayer');
		this.width = canvas.offsetWidth;
		this.height = canvas.offsetHeight;
		var ctx = canvas.getContext('2d');

		ctx.clearRect(0,0,this.width,this.height);
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#000';

		for(var i=0; i < this.objs.length; i++) {
			var obj = this.objs[i];
			obj.draw(ctx);
		}

		this.canvas = canvas;
		this.ctx = ctx;
	}

	c.init = function() {

		gameEvent.register('die', function(obj) {
			game.world.die(obj);
		});
	}

	c.die = function(obj) {
		this.removeObj(obj.name);
		if(obj.die) obj.die();
		delete obj;
	}
	return c;
}

function Control(world) {
	var c = new Object();
	c.world = world;
	c.controls = new Array();

	c.addControl = function(keycode, func) {
		var cc = new Object();
		cc.keycode = keycode;
		cc.func = func;
		this.controls.push(cc);
	}

	c.controlReady = function() {

		document.body.onkeydown = this.onkeydown;
		if (window.document.addEventListener) {
		   window.document.addEventListener("keydown", this.onkeydown, false);
		} else {
		   window.document.attachEvent("onkeydown", this.onkeydown);
		}
	}

	c.onkeydown = function(e) {
		var evt = e || window.event;
		var keycode = evt.keyCode;
		THIS = game.world.control;
		for(var i=0; i<THIS.controls.length; i++) {
			var cc = THIS.controls[i];
			if(keycode == cc.keycode) {
				cc.func();
			}
		}
	}
	return c;
}

function Game() {
	var c = new Object();
	c.state = 'stop'; // play stop
	c.world = new World();
	c.fps = 20;

	c.start = function() {

		this.init();

		this.state = 'play';
		this.run();
	}
	c.init = function() {
		this.world.init();

		this.initGame();
		this.world.control.controlReady();
	}
	c.initGame = function() {
		var hero = new Hero();
		this.world.addObj(hero);
		var world = this.world;
		// control
		this.world.control.addControl(85, function(){
			hero.y -= 1; send({"action" : "update", "hero" : hero});
		});
		this.world.control.addControl(72, function(){
			hero.x -= 1; send({"action" : "update", "hero" : hero});
		});
		this.world.control.addControl(74, function(){
			hero.y += 1; send({"action" : "update", "hero" : hero});
		});
		this.world.control.addControl(75, function(){
			hero.x += 1; send({"action" : "update", "hero" : hero});
		});
		this.world.control.addControl(65, function(){
			hero.direction = 3; send({"action" : "update", "hero" : hero});
		});
		this.world.control.addControl(68, function(){
			hero.direction = 1; send({"action" : "update", "hero" : hero});
		});
		this.world.control.addControl(87, function(){
			hero.direction = 0; send({"action" : "update", "hero" : hero});
		});
		this.world.control.addControl(83, function(){
			hero.direction = 2; send({"action" : "update", "hero" : hero});
		});
		this.world.control.addControl(70, function(){
			var bullet = new Bullet();
			bullet.owner = hero;
			bullet.init();
			world.addObj(bullet);
		});
	}
	c.run = function() {
		if(this.state == 'play') {
			this.world.draw();
			var ms = 1000/this.fps;

			setTimeout(function(){game.run();}, ms);
		}
	}
	c.stop = function() {
		this.state = 'stop';
	}
	return c;
}


// other function
function getRandomName() {
	var s = 'abcdefghijklmnopqrstuvxyz';
	var len = 9;
	var name = '';
	for(i=0;i<len;i++) {
		name += s[Math.floor(Math.random()*(s.length-1))];
	}
	return name;
}

function Helper() {
	var c = new Object();
	c._drawRect = function(ctx, x1, y1, x2, y2) {
		ctx.beginPath();
        ctx.rect(x1, y1, x2-x1, y2-y1);
        ctx.closePath();
        ctx.stroke();
    }

	c._drawOval = function(ctx, x1, y1, x2, y2) {
		ctx.beginPath();
        x = x1;
        y = y1;
        w = x2-x1;
        h = y2-y1;

        var kappa = .5522848;
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle


        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

        ctx.closePath();
        ctx.stroke();
    }

	c._drawCircle = function(ctx, x1, y1, x2, y2) {
		ctx.beginPath();
        x = x1;
        y = y1;
		// find minlength = min(w, h), minlength be the width and height (find smallest length)
        w = x2-x1;
        h = y2-y1;
		minlength = Math.min(w, h);
		w = minlength;
		h = minlength;

        var kappa = .5522848;
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle


        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        ctx.closePath();
        ctx.stroke();

    }

	c._drawLine = function(ctx, x1, y1, x2, y2) {
		ctx.beginPath();

        ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
       	ctx.closePath();
        ctx.stroke();

    }
	c._drawText = function(ctx, text, x, y) {
		//ctx.strokeText(text, x, y);
		// http://diveintohtml5.org/canvas.html#divingin

		if(text instanceof Object) {
			value = text.value;
			style = text.style;
			size = text.size;
			font = text.font;
			color= text.color;
		} else {
			value = text;
			style = "bold";
			size = "18px";
			font = "sans-serif";
			color = "black";
		}
		ctx.fillStyle = color;
		ctx.font = style+" "+size+" "+font;
		ctx.fillText(value, x, y);
	}
	c.__drawLine = function(x1, y1, x2, y2) {
		this._drawLine(this.ctx, this._x(x1), this._y(y1), this._x(x2), this._y(y2));
	}

	c.__drawRect = function(x1, y1, x2, y2) {
		this._drawRect(this.ctx, this._x(x1), this._y(y1), this._x(x2), this._y(y2));
	}

	c.__drawOval = function(x1, y1, x2, y2) {
		this._drawOval(this.ctx, this._x(x1), this._y(y1), this._x(x2), this._y(y2));
	}

	c.__drawCircle = function(x1, y1, x2, y2) {
		this._drawCircle(this.ctx, this._x(x1), this._y(y1), this._x(x2), this._y(y2));
	}
	c.__drawText = function(text, x, y) {
		this._drawText(this.ctx, text, this._x(x), this._y(y));
	}

	c._x = function(x) {
		// x: 0-100
		return x/100 * (this._x2 - this._x1) + this._x1;
	}

	c._y = function(y) {
		// y: 0-100
		return y/100 * (this._y2 - this._y1) + this._y1;
	}
	c.__moveTo = function(x,y) {
		this.ctx.moveTo(this._x(x), this._y(y));
	}
	c.__lineTo = function(x,y) {
		this.ctx.lineTo(this._x(x), this._y(y));
	}
	c.draw = function(ctx, obj, func) {
		this._x1 = obj.x;
		this._y1 = obj.y;
		this._x2 = obj.x + obj.w;
		this._y2 = obj.y + obj.h;
		this._w = obj.w;
		this._h = obj.h;
		this.ctx = ctx;
		func(this);
	}

	c.distance = function(obj1, obj2) {
		c1 = obj1.getCenterPoint();
		c2 = obj2.getCenterPoint();
		x1 = c1.x;
		x2 = c2.x;
		y1 = c1.y;
		y2 = c2.y;
		var dis = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
		return dis;
	}
	return c;
}
var helper = new Helper();
function Text(value, color, style, size, font) {
	if(!value) value = "";
	if(!color) color = "black";
	if(!style) style = "bold";
	if(!size) size = "18px";
	if(!font) font = "sans-serif";

	var c = new Object();
	c.value = value;
	c.color = color;
	c.style = style; // bold italic ??
	c.size = size;
	c.font = font;

	return c;
}
function GameEvent() {
	var c = new Object();
	c.events = new Array();
	c.register = function(eventname, func) {
		var e = new Object();
		e.eventname = eventname;
		e.func = func;
		this.events.push(e);
	}
	c.trigger = function(eventname, obj) {
		for(var i=0; i<this.events.length; i++) {
			var e = this.events[i];
			if(e.eventname == eventname) {
				e.func(obj);
			}
		}
	}
	return c;
}
var gameEvent = new GameEvent();
