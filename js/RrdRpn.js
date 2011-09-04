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

 * RRDtool 1.4.5  Copyright by Tobi Oetiker, 1997-2010
 *
 * Convert to javascript: Manuel Sanmartin <manuel.luis at gmail.com>
 **/

"use strict";

/**
 * RrdRpn
 * @constructor
 */
var RrdRpn = function() {
	this.parser.apply(this, arguments);
};

RrdRpn.op = { NUMBER: 0, VARIABLE: 1, INF: 2, PREV: 3, NEGINF: 4,
  	UNKN: 5, NOW: 6, TIME: 7, ADD: 8, MOD: 9, SUB: 10, MUL: 11,
   	DIV: 12, SIN: 13, DUP: 14, EXC: 15, POP: 16,
   	COS: 17, LOG: 18, EXP: 19, LT: 20, LE: 21, GT: 22, GE: 23, EQ: 24, IF: 25,
   	MIN: 26, MAX: 27, LIMIT: 28, FLOOR: 29, CEIL: 30,
   	UN: 31, END: 32, LTIME: 33, NE: 34, ISINF: 35, PREV_OTHER: 36, COUNT: 37,
	ATAN: 38, SQRT: 39, SORT: 40, REV: 41, TREND: 42, TRENDNAN: 43,
	ATAN2: 44, RAD2DEG: 45, DEG2RAD: 46,
	PREDICT: 47, PREDICTSIGMA: 48, AVG: 49, ABS: 50, ADDNAN: 51 };

RrdRpn.STACK_UNDERFLOW = 'RPN stack underflow';

RrdRpn.prototype = {
	rpnexpr: null,
	rpnstack: null,
	rpnp: null,

	find_var: function(gdes, key)
	{
		for (var ii = 0, gdes_c = gdes.length; ii < gdes_c; ii++) {
			if ((gdes[ii].gf == RrdGraphDesc.GF.DEF ||
				gdes[ii].gf == RrdGraphDesc.GF.VDEF ||
				gdes[ii].gf == RrdGraphDesc.GF.CDEF)
				&& gdes[ii].vname == key) {
				return ii;
			}
		}
		return -1;
	},
	parser: function (str_expr, gdes)
	{
		var steps = -1;
		var expr;
		var exprs = str_expr.split(',');
		
		this.rpnexpr = str_expr;
		this.rpnp = [];

		for(var i=0, len=exprs.length; i < len; i++) {
			expr=exprs[i].toUpperCase();

			steps++;
			this.rpnp[steps] = {};

			if (!isNaN(expr)) {
				this.rpnp[steps].op = RrdRpn.op.NUMBER;
				this.rpnp[steps].val = parseFloat(expr);
			}
			else if (expr === '+') this.rpnp[steps].op = RrdRpn.op.ADD;
			else if (expr === '-') this.rpnp[steps].op = RrdRpn.op.SUB;
			else if (expr === '*') this.rpnp[steps].op = RrdRpn.op.MUL;
			else if (expr === '/') this.rpnp[steps].op = RrdRpn.op.DIV;
			else if (expr === '%') this.rpnp[steps].op = RrdRpn.op.MOD;
			else if (expr === 'SIN') this.rpnp[steps].op = RrdRpn.op.SIN;
			else if (expr === 'COS') this.rpnp[steps].op = RrdRpn.op.COS;
			else if (expr === 'LOG') this.rpnp[steps].op = RrdRpn.op.LOG;
			else if (expr === 'FLOOR') this.rpnp[steps].op = RrdRpn.op.FLOOR;
			else if (expr === 'CEIL') this.rpnp[steps].op = RrdRpn.op.CEIL;
			else if (expr === 'EXP') this.rpnp[steps].op = RrdRpn.op.EXP;
			else if (expr === 'DUP') this.rpnp[steps].op = RrdRpn.op.DUP;
			else if (expr === 'EXC') this.rpnp[steps].op = RrdRpn.op.EXC;
			else if (expr === 'POP') this.rpnp[steps].op = RrdRpn.op.POP;
			else if (expr === 'LTIME') this.rpnp[steps].op = RrdRpn.op.LTIME;
			else if (expr === 'LT') this.rpnp[steps].op = RrdRpn.op.LT;
			else if (expr === 'LE') this.rpnp[steps].op = RrdRpn.op.LE;
			else if (expr === 'GT') this.rpnp[steps].op = RrdRpn.op.GT;
			else if (expr === 'GE') this.rpnp[steps].op = RrdRpn.op.GE;
			else if (expr === 'EQ') this.rpnp[steps].op = RrdRpn.op.EQ;
			else if (expr === 'IF') this.rpnp[steps].op = RrdRpn.op.IF;
			else if (expr === 'MIN') this.rpnp[steps].op = RrdRpn.op.MIN;
			else if (expr === 'MAX') this.rpnp[steps].op = RrdRpn.op.MAX;
			else if (expr === 'LIMIT') this.rpnp[steps].op = RrdRpn.op.LIMIT;
			else if (expr === 'UNKN') this.rpnp[steps].op = RrdRpn.op.UNKN;
			else if (expr === 'UN') this.rpnp[steps].op = RrdRpn.op.UN;
			else if (expr === 'NEGINF') this.rpnp[steps].op = RrdRpn.op.NEGINF;
			else if (expr === 'NE') this.rpnp[steps].op = RrdRpn.op.NE;
			else if (expr === 'COUNT') this.rpnp[steps].op = RrdRpn.op.COUNT;
			else if (/PREV\([-_A-Za-z0-9]+\)/.test(expr)) {
				var match = exprs[i].match(/PREV\(([-_A-Za-z0-9]+)\)/i);
				if (match.length == 2) {
					this.rpnp[steps].op = RrdRpn.op.PREV_OTHER;
					this.rpnp[steps].ptr = this.find_var(gdes, match[1]);  // FIXME if -1
				}
			}
			else if (expr === 'PREV') this.rpnp[steps].op = RrdRpn.op.PREV;
			else if (expr === 'INF') this.rpnp[steps].op = RrdRpn.op.INF;
			else if (expr === 'ISINF') this.rpnp[steps].op = RrdRpn.op.ISINF;
			else if (expr === 'NOW') this.rpnp[steps].op = RrdRpn.op.NOW;
			else if (expr === 'TIME') this.rpnp[steps].op = RrdRpn.op.TIME;
			else if (expr === 'ATAN2') this.rpnp[steps].op = RrdRpn.op.ATAN2;
			else if (expr === 'ATAN') this.rpnp[steps].op = RrdRpn.op.ATAN;
			else if (expr === 'SQRT') this.rpnp[steps].op = RrdRpn.op.SQRT;
			else if (expr === 'SORT') this.rpnp[steps].op = RrdRpn.op.SORT;
			else if (expr === 'REV') this.rpnp[steps].op = RrdRpn.op.REV;
			else if (expr === 'TREND') this.rpnp[steps].op = RrdRpn.op.TREND;
			else if (expr === 'TRENDNAN') this.rpnp[steps].op = RrdRpn.op.TRENDNAN;
			else if (expr === 'PREDICT') this.rpnp[steps].op = RrdRpn.op.PREDICT;
			else if (expr === 'PREDICTSIGMA') this.rpnp[steps].op = RrdRpn.op.PREDICTSIGMA;
			else if (expr === 'RAD2DEG') this.rpnp[steps].op = RrdRpn.op.RAD2DEG;
			else if (expr === 'DEG2RAD') this.rpnp[steps].op = RrdRpn.op.DEG2RAD;
			else if (expr === 'AVG') this.rpnp[steps].op = RrdRpn.op.AVG;
			else if (expr === 'ABS') this.rpnp[steps].op = RrdRpn.op.ABS;
			else if (expr === 'ADDNAN') this.rpnp[steps].op = RrdRpn.op.ADDNAN;
			else if (/[-_A-Za-z0-9]+/.test(expr)) {
				this.rpnp[steps].ptr = this.find_var(gdes, exprs[i]);
				this.rpnp[steps].op = RrdRpn.op.VARIABLE;
			} else {
				return;
			}
		}
		this.rpnp[steps + 1] = {};
		this.rpnp[steps + 1].op = RrdRpn.op.END;
	},
	compare_double: function(x, y)
	{
		var diff = x -  y;
		return (diff < 0) ? -1 : (diff > 0) ? 1 : 0;
	},
	fmod: function (x, y) {
		// http://kevin.vanzonneveld.net
		// +   original by: Onno Marsman
		// +      input by: Brett Zamir (http://brett-zamir.me)
		// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// *     example 1: fmod(5.7, 1.3);
		// *     returns 1: 0.5
		var tmp, tmp2, p = 0,
			pY = 0,
			l = 0.0,
			l2 = 0.0;

		tmp = x.toExponential().match(/^.\.?(.*)e(.+)$/);
		p = parseInt(tmp[2], 10) - (tmp[1] + '').length;
		tmp = y.toExponential().match(/^.\.?(.*)e(.+)$/);
		pY = parseInt(tmp[2], 10) - (tmp[1] + '').length;

		if (pY > p) p = pY;

		tmp2 = (x % y);

		if (p < -100 || p > 20) {
			l = Math.round(Math.log(tmp2) / Math.log(10));
			l2 = Math.pow(10, l);
			return (tmp2 / l2).toFixed(l - p) * l2;
		} else {
			return parseFloat(tmp2.toFixed(-p));
		}
	},
	calc: function (data_idx, output, output_idx)
	{
		var stptr = -1;

		this.rpnstack = [];

		for (var rpi = 0; this.rpnp[rpi].op != RrdRpn.op.END; rpi++) {
			switch (this.rpnp[rpi].op) {
				case RrdRpn.op.NUMBER:
					this.rpnstack[++stptr] = this.rpnp[rpi].val;
					break;
				case RrdRpn.op.VARIABLE:
				case RrdRpn.op.PREV_OTHER:
					if (this.rpnp[rpi].ds_cnt == 0) {
						throw "VDEF made it into rpn_calc... aborting";
					} else {
						if (this.rpnp[rpi].op == RrdRpn.op.VARIABLE) {
							this.rpnstack[++stptr] = this.rpnp[rpi].data[this.rpnp[rpi].pdata];
						} else {
							if ((output_idx) <= 0) this.rpnstack[++stptr] = Number.NaN;
							else this.rpnstack[++stptr] = this.rpnp[rpi].data[this.rpnp[rpi].pdata - this.rpnp[rpi].ds_cnt];
						}
						if (data_idx % this.rpnp[rpi].step == 0) {
							this.rpnp[rpi].pdata +=  this.rpnp[rpi].ds_cnt;
						}
					}
					break;
				case RrdRpn.op.COUNT:
					this.rpnstack[++stptr] = (output_idx + 1);    /* Note: Counter starts at 1 */
					break;
				case RrdRpn.op.PREV:
					if ((output_idx) <= 0) this.rpnstack[++stptr] = Number.NaN;
					else this.rpnstack[++stptr] = output[output_idx - 1];
					break;
				case RrdRpn.op.UNKN:
					this.rpnstack[++stptr] = Number.NaN;
					break;
				case RrdRpn.op.INF:
					this.rpnstack[++stptr] = Infinity;
					break;
				case RrdRpn.op.NEGINF:
					this.rpnstack[++stptr] = -Infinity;
					break;
				case RrdRpn.op.NOW:
					this.rpnstack[++stptr] = Math.round((new Date()).getTime() / 1000);
					break;
				case RrdRpn.op.TIME:
					this.rpnstack[++stptr] = data_idx;
					break;
				case RrdRpn.op.LTIME:
					var date = new Date(data_idx*1000); // FIXME XXX
					this.rpnstack[++stptr] = date.getTimezoneOffset() * 60 + data_idx;
					break;
				case RrdRpn.op.ADD:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] + this.rpnstack[stptr];
					stptr--;
					break;
				case RrdRpn.op.ADDNAN:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1])) {
							this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					} else if (isNaN(this.rpnstack[stptr])) {
							/* NOOP */
							/* this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1]; */
					} else {
							this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] + this.rpnstack[stptr];
					}
					stptr--;
					break;
				case RrdRpn.op.SUB:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] - this.rpnstack[stptr];
					stptr--;
					break;
				case RrdRpn.op.MUL:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr - 1] = (this.rpnstack[stptr - 1]) * (this.rpnstack[stptr]);
					stptr--;
					break;
				case RrdRpn.op.DIV:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] / this.rpnstack[stptr];
					stptr--;
					break;
				case RrdRpn.op.MOD:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr - 1] = this.fmod(this.rpnstack[stptr - 1] , this.rpnstack[stptr]);
					stptr--;
					break;
				case RrdRpn.op.SIN:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.sin(this.rpnstack[stptr]);
					break;
				case RrdRpn.op.ATAN:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.atan(this.rpnstack[stptr]);
					break;
				case RrdRpn.op.RAD2DEG:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = 57.29577951 * this.rpnstack[stptr];
					break;
				case RrdRpn.op.DEG2RAD:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = 0.0174532952 * this.rpnstack[stptr];
					break;
				case RrdRpn.op.ATAN2:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr - 1] = Math.atan2(this.rpnstack[stptr - 1], this.rpnstack[stptr]);
					stptr--;
					break;
				case RrdRpn.op.COS:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.cos(this.rpnstack[stptr]);
					break;
				case RrdRpn.op.CEIL:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.ceil(this.rpnstack[stptr]);
					break;
				case RrdRpn.op.FLOOR:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.floor(this.rpnstack[stptr]);
					break;
				case RrdRpn.op.LOG:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.log(this.rpnstack[stptr]);
					break;
				case RrdRpn.op.DUP:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr + 1] = this.rpnstack[stptr];
					stptr++;
					break;
				case RrdRpn.op.POP:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					stptr--;
					break;
				case RrdRpn.op.EXC:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW; {
						var dummy = this.rpnstack[stptr];
						this.rpnstack[stptr] = this.rpnstack[stptr - 1];
						this.rpnstack[stptr - 1] = dummy;
					}
					break;
				case RrdRpn.op.EXP:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.exp(this.rpnstack[stptr]);
					break;
				case RrdRpn.op.LT:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1])) {
					} else if (isNaN(this.rpnstack[stptr])) {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					} else {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] < this.rpnstack[stptr] ? 1.0 : 0.0;
					}
					stptr--;
					break;
				case RrdRpn.op.LE:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1])) {
					} else if (isNaN(this.rpnstack[stptr])) {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					} else {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] <= this.rpnstack[stptr] ? 1.0 : 0.0;
					}
					stptr--;
					break;
				case RrdRpn.op.GT:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1])) {
					} else if (isNaN(this.rpnstack[stptr])) {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					} else {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] > this.rpnstack[stptr] ? 1.0 : 0.0;
					}
					stptr--;
					break;
				case RrdRpn.op.GE:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1])) {
					} else if (isNaN(this.rpnstack[stptr])) {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					} else {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] >= this.rpnstack[stptr] ? 1.0 : 0.0;
					}
					stptr--;
					break;
				case RrdRpn.op.NE:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1])) {
					} else if (isNaN(this.rpnstack[stptr])) {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					} else {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] == this.rpnstack[stptr] ? 0.0 : 1.0;
					}
					stptr--;
					break;
				case RrdRpn.op.EQ:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1])) {
					} else if (isNaN(this.rpnstack[stptr])) {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					} else {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] == this.rpnstack[stptr] ? 1.0 : 0.0;
					}
					stptr--;
					break;
				case RrdRpn.op.IF:
					if(stptr < 2) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr - 2] = (isNaN(this.rpnstack[stptr - 2]) || this.rpnstack[stptr - 2] == 0.0) ? this.rpnstack[stptr] : this.rpnstack[stptr - 1];
					stptr--;
					stptr--;
					break;
				case RrdRpn.op.MIN:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1])) {
					} else if (isNaN(this.rpnstack[stptr])) {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					} else if (this.rpnstack[stptr - 1] > this.rpnstack[stptr]) {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					}
					stptr--;
					break;
				case RrdRpn.op.MAX:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1])) {
					} else if (isNaN(this.rpnstack[stptr])) {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					} else if (this.rpnstack[stptr - 1] < this.rpnstack[stptr]) {
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					}
					stptr--;
					break;
				case RrdRpn.op.LIMIT:
					if(stptr < 2) throw RrdRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 2])) {
					} else if (isNaN(this.rpnstack[stptr - 1])) {
							this.rpnstack[stptr - 2] = this.rpnstack[stptr - 1];
					} else if (isNaN(this.rpnstack[stptr])) {
							this.rpnstack[stptr - 2] = this.rpnstack[stptr];
					} else if (this.rpnstack[stptr - 2] < this.rpnstack[stptr - 1]) {
							this.rpnstack[stptr - 2] = Number.NaN;
					} else if (this.rpnstack[stptr - 2] > this.rpnstack[stptr]) {
							this.rpnstack[stptr - 2] = Number.NaN;
					}
					stptr -= 2;
					break;
				case RrdRpn.op.UN:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = isNaN(this.rpnstack[stptr]) ? 1.0 : 0.0;
					break;
				case RrdRpn.op.ISINF:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = isInfinite(this.rpnstack[stptr]) ? 1.0 : 0.0;
					break;
				case RrdRpn.op.SQRT:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.sqrt(this.rpnstack[stptr]);
					break;
				case RrdRpn.op.SORT:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					var spn = this.rpnstack[stptr--];
					if(stptr < spn - 1) throw RrdRpn.STACK_UNDERFLOW;
					var array = this.rpnstack.slice(stptr - spn + 1, stptr +1);
					array.sort(this.compare_double);
					for (var i=stptr - spn + 1, ii=0; i < (stptr +1) ; i++, ii++)
						this.rpnstack[i] = array[ii];
					// qsort(this.rpnstack + stptr - spn + 1, spn, sizeof(double), rpn_compare_double);
					break;
				case RrdRpn.op.REV:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					var spn = this.rpnstack[stptr--];
					if(stptr < spn - 1) throw RrdRpn.STACK_UNDERFLOW;
					var array = this.rpnstack.slice(stptr - spn + 1, stptr +1);
					array.reverse();
					for (var i=stptr - spn + 1, ii=0; i < (stptr +1) ; i++, ii++)
						this.rpnstack[i] = array[ii];
					break;
				case RrdRpn.op.PREDICT:
				case RrdRpn.op.PREDICTSIGMA:
					if(stptr < 2) throw RrdRpn.STACK_UNDERFLOW;
					var locstepsize = this.rpnstack[--stptr];
					var shifts = this.rpnstack[--stptr];
					if(stptr < shifts) throw RrdRpn.STACK_UNDERFLOW;
					if (shifts<0) stptr--;
					else stptr-=shifts;
					var val=Number.NaN;
					var dsstep = this.rpnp[rpi - 1].step;
					var dscount = this.rpnp[rpi - 1].ds_cnt;
					var locstep = Math.ceil(locstepsize/dsstep);
					var sum = 0;
					var sum2 = 0;
					var count = 0;
					/* now loop for each position */
					var doshifts=shifts;
					if (shifts<0) doshifts=-shifts;
					for(var loop=0;loop<doshifts;loop++) {
						var shiftstep=1;
						if (shifts<0) shiftstep = loop*this.rpnstack[stptr];
						else shiftstep = this.rpnstack[stptr+loop];
						if(shiftstep <0) {
							throw "negative shift step not allowed: "+shiftstep;
						}
						shiftstep=Math.ceil(shiftstep/dsstep);
						for(var i=0;i<=locstep;i++) {
							var offset=shiftstep+i;
							if ((offset>=0)&&(offset<output_idx)) {
								val = this.rpnp[rpi - 1].data[-dscount * offset];
								if (! isNaN(val)) {
									sum+=val;
									sum2+=val*val;
									count++;
								}
							}
						}
					}
					val=Number.NaN;
					if (this.rpnp[rpi].op == RrdRpn.op.PREDICT) {
						if (count>0) val = sum/count;
					} else {
						if (count>1) {
							val=count*sum2-sum*sum;
							if (val<0) {
								val=Number.NaN;
							} else {
								val=Math.sqrt(val/(count*(count-1.0)));
							}
						}
					}
					this.rpnstack[stptr] = val;
					break;
				case RrdRpn.op.TREND:
				case RrdRpn.op.TRENDNAN:
					if(stptr < 1) throw RrdRpn.STACK_UNDERFLOW;
					if ((rpi < 2) || (this.rpnp[rpi - 2].op != RrdRpn.op.VARIABLE)) {
						throw "malformed trend arguments";
					} else {
						var dur = this.rpnstack[stptr];
						var step = this.rpnp[rpi - 2].step;

						if (output_idx > Math.ceil(dur / step)) {
							var ignorenan = (this.rpnp[rpi].op == RrdRpn.op.TREND);
							var accum = 0.0;
							var i = 0;
							var count = 0;

							do {
								var val = this.rpnp[rpi - 2].data[this.rpnp[rpi - 2].ds_cnt * i--];
								if (ignorenan || !isNaN(val)) {
									accum += val;
									++count;
								}
								dur -= step;
							} while (dur > 0);

							this.rpnstack[--stptr] = (count == 0) ? Number.NaN : (accum / count);
						} else this.rpnstack[--stptr] = Number.NaN;
					}
					break;
				case RrdRpn.op.AVG:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					var i = this.rpnstack[stptr--];
					var sum = 0;
					var count = 0;

					if(stptr < i - 1) throw RrdRpn.STACK_UNDERFLOW;
					while (i > 0) {
						var val = this.rpnstack[stptr--];
						i--;
						if (isNaN(val)) continue;
						count++;
						sum += val;
					}
					if (count > 0) this.rpnstack[++stptr] = sum / count;
					else this.rpnstack[++stptr] = Number.NaN;
					break;
				case RrdRpn.op.ABS:
					if(stptr < 0) throw RrdRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = fabs(this.rpnstack[stptr]);
					break;
				case RrdRpn.op.END:
					break;
			}
		}
		if (stptr != 0) throw "RPN final stack size != 1";
		output[output_idx] = this.rpnstack[0];
		return 0;
	}
};

