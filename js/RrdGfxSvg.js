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
 * RrdGfxSvg
 * @constructor
 */
var RrdGfxSvg = function() {
	this.init.apply(this, arguments);
};

RrdGfxSvg.prototype = {
	svgns: "http://www.w3.org/2000/svg",
	xmlns: "http://www.w3.org/XML/1998/namespace",
	svg: null,
	path: null,
	path_color: null,
	path_width: null,

	init: function (svgId)
	{
		this.svg = document.getElementById(svgId)
	},
	size: function (width, height)
	{
		while(this.svg.lastChild)
			this.svg.removeChild(this.svg.lastChild);

		this.svg.setAttribute("width", width+"px");
		this.svg.setAttribute("height", height+"px");
		this.svg.setAttribute("viewBox", "0 0 "+width+" "+height);
	},
  set_dash: function (dashes, n, offset)
  {
  },
	line: function (X0, Y0, X1, Y1, width, color)
	{
		var shape = document.createElementNS(this.svgns, "line");

    X0 = Math.round(X0)+0.5;
    Y0 = Math.round(Y0)+0.5;
    X1 = Math.round(X1)+0.5;
    Y1 = Math.round(Y1)+0.5;

		shape.setAttributeNS(null, "x1", X0);
		shape.setAttributeNS(null, "y1", Y0);
		shape.setAttributeNS(null, "x2", X1);
		shape.setAttributeNS(null, "y2", Y1);
		shape.setAttributeNS(null, "stroke-width", width);
		shape.setAttributeNS(null, "stroke", color);

		this.svg.appendChild(shape);
	},
	dashed_line: function (X0, Y0, X1, Y1, width, color, dash_on, dash_off)
	{
		var shape = document.createElementNS(this.svgns, "line");

    X0 = Math.round(X0)+0.5;
    Y0 = Math.round(Y0)+0.5;
    X1 = Math.round(X1)+0.5;
    Y1 = Math.round(Y1)+0.5;

		shape.setAttributeNS(null, "x1", X0);
		shape.setAttributeNS(null, "y1", Y0);
		shape.setAttributeNS(null, "x2", X1);
		shape.setAttributeNS(null, "y2", Y1);
		shape.setAttributeNS(null, "stroke-width", width);
		shape.setAttributeNS(null, "stroke", color);
		shape.setAttributeNS(null, "stroke-dasharray", dash_on+','+dash_off);

		this.svg.appendChild(shape);
	},
	rectangle: function (X0, Y0, X1, Y1, width, style)
	{
		var shape = document.createElementNS(this.svgns, "rect");

		var rwidth = Math.abs(X1-X0);
		var rheight = Math.abs(Y1-Y0);

		shape.setAttributeNS(null, "x", Math.round(X0)+0.5);
		shape.setAttributeNS(null, "y", Math.round(Y0-rheight)+0.5);
		shape.setAttributeNS(null, "width",  rwidth);
		shape.setAttributeNS(null, "height", rheight);
		shape.setAttributeNS(null, "stroke-width", width);
		shape.setAttributeNS(null, "stroke", style);
		shape.setAttributeNS(null, "fill", "none");

		this.svg.appendChild(shape);
	},
	new_area: function (X0, Y0, X1, Y1, X2, Y2, color)
	{
    X0 = Math.round(X0)+0.5;
    Y0 = Math.round(Y0)+0.5;
    X1 = Math.round(X1)+0.5;
    Y1 = Math.round(Y1)+0.5;
    X2 = Math.round(X2)+0.5;
    Y2 = Math.round(Y2)+0.5;

		this.path_color = color;
		this.path = 'M'+X0+','+Y0;
		this.path += ' L'+X1+','+Y1;
		this.path += ' L'+X2+','+Y2;
	},
	add_point: function (x, y)
	{
    x = Math.round(x)+0.5;
    y = Math.round(y)+0.5;

		this.path += ' L'+x+','+y;
	},
	close_path: function ()
	{
		var shape = document.createElementNS(this.svgns, "path");

		this.path += ' Z';

		shape.setAttributeNS(null, "d", this.path);
		shape.setAttributeNS(null, "fill", this.path_color);
		shape.setAttributeNS(null, "stroke", 'none');

		this.svg.appendChild(shape);
	},
	stroke_begin: function (width, style)
	{
		this.path_width = width;
		this.path_color = style;
		this.path = '';
	},
	stroke_end: function ()
	{
		var shape = document.createElementNS(this.svgns, "path");

		shape.setAttributeNS(null, "d", this.path);
		shape.setAttributeNS(null, "fill", 'none');
		shape.setAttributeNS(null, "stroke", this.path_color);
		shape.setAttributeNS(null, "stroke-width", this.path_width);
		shape.setAttributeNS(null, "stroke-linecap", 'round');
		shape.setAttributeNS(null, "stroke-linejoin", 'round');

		this.svg.appendChild(shape);
	},
	moveTo: function (x,y)
	{
    x = Math.round(x)+0.5;
    y = Math.round(y)+0.5;

		this.path += ' M'+x+','+y;
	},
	lineTo: function (x,y)
	{
    x = Math.round(x)+0.5;
    y = Math.round(y)+0.5;

		this.path += ' L'+x+','+y;
	},
	text: function (x, y, color, font, tabwidth, angle, h_align, v_align, text)
	{
    x = Math.round(x);
    y = Math.round(y);

		var svgtext = document.createElementNS(this.svgns, "text");

		var data = document.createTextNode(text);

		svgtext.setAttributeNS(null, "x", x);
		svgtext.setAttributeNS(null, "y", y);
		svgtext.setAttributeNS(null, "fill", color);
		svgtext.setAttributeNS(null, "stroke", "none");
		svgtext.setAttributeNS(null, "font-family", font.font);
		svgtext.setAttributeNS(null, "font-size", font.size+"px");
		svgtext.setAttributeNS(this.xmlns, "xml:space", "preserve");

		angle=-angle;
		svgtext.setAttributeNS(null, "transform", 'rotate('+angle+' '+x+','+y+')' );

		switch (h_align) {
			case RrdGraph.GFX_H.LEFT:
				svgtext.setAttributeNS(null, "text-anchor", 'start');
				break;
			case RrdGraph.GFX_H.RIGHT:
				svgtext.setAttributeNS(null, "text-anchor", 'end');
				break;
			case RrdGraph.GFX_H.CENTER:
				svgtext.setAttributeNS(null, "text-anchor", 'middle');
				break;
		}
		svgtext.appendChild(data);
		this.svg.appendChild(svgtext);

		var bbox = svgtext.getBBox();

		switch (v_align) {  // FIXME
			case RrdGraph.GFX_V.TOP:
				svgtext.setAttributeNS(null, "y", y+bbox.height/2);
				break;
			case RrdGraph.GFX_V.BOTTOM:
				svgtext.setAttributeNS(null, "y", y-bbox.height/6);
				break;
			case RrdGraph.GFX_V.CENTER:
				svgtext.setAttributeNS(null, "y", y+bbox.height/4);
				break;
		}
	},
	get_text_width: function(start, font, tabwidth, text)
	{
		var svgtext = document.createElementNS(this.svgns, "text");
		var data = document.createTextNode(text);
		svgtext.setAttributeNS(null, "x", 0);
		svgtext.setAttributeNS(null, "y", 0);
		svgtext.setAttributeNS(null, "fill", 'none');
		svgtext.setAttributeNS(null, "stroke", 'none');
		svgtext.setAttributeNS(null, "font-family", font.font);
		svgtext.setAttributeNS(null, "font-size", font.size+"px");
		svgtext.setAttributeNS(this.xmlns, "xml:space", "preserve");
		svgtext.appendChild(data);
		this.svg.appendChild(svgtext);

		var bbox = svgtext.getBBox();

		svgtext.removeChild(data);
		this.svg.removeChild(svgtext);

		return bbox.width;
	}
};
