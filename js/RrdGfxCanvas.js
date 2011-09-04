/**
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; either version 2 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
 * more details.

 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA

 *
 * Manuel Sanmartin <manuel.luis at gmail.com>
 **/

"use strict";

/**
 * RrdGfxCanvas
 * @constructor
 */
var RrdGfxCanvas = function() {
  this.init.apply(this, arguments);
};

RrdGfxCanvas.prototype = {
	canvas: null,
	ctx: null,

	init: function (canvasId)
	{
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext('2d');
	},
	size: function (width, height)
	{
		this.canvas.width = width;
		this.canvas.height = height;
	},
	set_dash: function (dashes, n, offset)
	{
	},
	line: function (X0, Y0, X1, Y1, width, color)
	{
		X0 = Math.round(X0);
		Y0 = Math.round(Y0);
		X1 = Math.round(X1);
		Y1 = Math.round(Y1);

		if (Y0 === Y1) {
			Y0 += 0.5;
			Y1 += 0.5;
		} else if (X0 === X1) {
			X0 += 0.5;
			X1 += 0.5;
		}
		this.ctx.save();
		this.ctx.lineWidth = width;
		this.ctx.strokeStyle = color
		this.ctx.beginPath();
		this.ctx.moveTo(X0, Y0);
		this.ctx.lineTo(X1, Y1);
		this.ctx.stroke();
		this.ctx.restore();
	},
	dashed_line: function (X0, Y0, X1, Y1, width, color, dash_on, dash_off)
	{
		X0 = Math.round(X0);
		Y0 = Math.round(Y0);
		X1 = Math.round(X1);
		Y1 = Math.round(Y1);

		this.ctx.save();
		this.ctx.lineWidth = width;
		this.ctx.strokeStyle = color;

		this.ctx.beginPath();
		if (Y0 === Y1) {
			Y0 += 0.5;
			Y1 += 0.5;
			if (X0 > X1) {
				var swap = X0;
				X0 = X1;
				X1 = swap;
			}
			this.ctx.moveTo(X0, Y0);
			var n=0;
			while(X0<=X1) {
				if (n%2 === 1) {
					X0 += dash_on;
					this.ctx.lineTo(X0, Y0);
				} else {
					X0 += dash_off;
					this.ctx.moveTo(X0, Y0);
				}
				n++;
			}
		} else if (X0 === X1) {
			X0 += 0.5;
			X1 += 0.5;
			if (Y0 > Y1) {
				var swap = Y0;
				Y0 = Y1;
				Y1 = swap;
			}
			this.ctx.moveTo(X0, Y0);
			var n=0;
			while(Y0<=Y1) {
				if (n%2 === 1) {
					Y0 += dash_on;
					this.ctx.lineTo(X0, Y0);
				} else {
					Y0 += dash_off;
					this.ctx.moveTo(X0, Y0);
				}
				n++;
			}

		} else {
			this.ctx.moveTo(X0, Y0);
			this.ctx.lineTo(X1, Y1);
		}
		this.ctx.stroke();
		this.ctx.restore();
	},
	rectangle: function (X0, Y0, X1, Y1, width, style)
	{
		X0 = Math.round(X0)+0.5;
		X1 = Math.round(X1)+0.5;
		Y0 = Math.round(Y0)+0.5;
		Y1 = Math.round(Y1)+0.5;

		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.lineWidth = width;
		this.ctx.moveTo(X0, Y0);
		this.ctx.lineTo(X1, Y0);
		this.ctx.lineTo(X1, Y1);
		this.ctx.lineTo(X0, Y1);
		this.ctx.closePath();
		this.ctx.strokeStyle = style;
		this.ctx.stroke();
		this.ctx.restore();
	},
	new_area: function (X0, Y0, X1, Y1, X2, Y2, color)
	{
		X0 = Math.round(X0)+0.5;
		Y0 = Math.round(Y0)+0.5;
		X1 = Math.round(X1)+0.5;
		Y1 = Math.round(Y1)+0.5;
		X2 = Math.round(X2)+0.5;
		Y2 = Math.round(Y2)+0.5;
		this.ctx.fillStyle = color;
		this.ctx.beginPath();
		this.ctx.moveTo(X0, Y0);
		this.ctx.lineTo(X1, Y1);
		this.ctx.lineTo(X2, Y2);
	},
	add_point: function (x, y)
	{
		x = Math.round(x)+0.5;
		y = Math.round(y)+0.5;
		this.ctx.lineTo(x, y);
	},
	close_path: function ()
	{
		this.ctx.closePath();
		this.ctx.fill();
	},
	stroke_begin: function (width, style)
	{
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.lineWidth = width;
		this.ctx.strokeStyle = style;
		this.ctx.lineCap = 'round';
		this.ctx.round = 'round';
	},
	stroke_end: function ()
	{
		this.ctx.stroke();
		this.ctx.restore();
	},
	moveTo: function (x,y)
	{
		x = Math.round(x)+0.5;
		y = Math.round(y)+0.5;
		this.ctx.moveTo(x, y);
	},
	lineTo: function (x,y)
	{
		x = Math.round(x)+0.5;
		y = Math.round(y)+0.5;
		this.ctx.lineTo(x, y)
	},
	text: function (x, y, color, font, tabwidth, angle, h_align, v_align, text)
	{
		x = Math.round(x);
		y = Math.round(y);

		this.ctx.save();
		this.ctx.font = font.size+'px '+"'"+font.font+"'";

		switch (h_align) {
			case RrdGraph.GFX_H.LEFT:
				this.ctx.textAlign = 'left';
				break;
			case RrdGraph.GFX_H.RIGHT:
				this.ctx.textAlign = 'right';
				break;
			case RrdGraph.GFX_H.CENTER:
				this.ctx.textAlign = 'center';
				break;
		}

		switch (v_align) {
			case RrdGraph.GFX_V.TOP:
				this.ctx.textBaseline = 'top';
				break;
			case RrdGraph.GFX_V.BOTTOM:
				this.ctx.textBaseline = 'bottom';
				break;
			case RrdGraph.GFX_V.CENTER:
				this.ctx.textBaseline = 'middle';
				break;
		}

		this.ctx.fillStyle = color;
		this.ctx.translate(x,y);
		this.ctx.rotate(-angle*Math.PI/180.0);
		this.ctx.fillText(text, 0, 0);
		this.ctx.restore();
	},
	get_text_width: function(start, font, tabwidth, text)
	{
		this.ctx.save();
		this.ctx.font = font.size+"px "+font.font;
		var width = this.ctx.measureText(text);
		this.ctx.restore();
		return width.width;
	}
};
