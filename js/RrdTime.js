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
 * RrdTime
 * @constructor
 */
var RrdTime = function() {
	this.parser.apply(this, arguments);
};

RrdTime.EOF = -1;
RrdTime.MIDNIGHT = 0;
RrdTime.NOON = 1;
RrdTime.TEATIME = 2;
RrdTime.PM = 3;
RrdTime.AM = 4;
RrdTime.YESTERDAY = 5;
RrdTime.TODAY = 6;
RrdTime.TOMORROW = 7;
RrdTime.NOW = 8;
RrdTime.START = 9;
RrdTime.END = 10;
RrdTime.EPOCH = 11;
RrdTime.SECONDS = 12;
RrdTime.MINUTES = 13;
RrdTime.HOURS = 14;
RrdTime.DAYS = 15;
RrdTime.WEEKS = 16;
RrdTime.MONTHS = 17;
RrdTime.YEARS = 18;
RrdTime.MONTHS_MINUTES = 19;
RrdTime.NUMBER = 20;
RrdTime.PLUS = 21;
RrdTime.MINUS = 22;
RrdTime.DOT = 23;
RrdTime.COLON = 24;
RrdTime.SLASH = 25;
RrdTime.ID = 26;
RrdTime.JUNK = 27;
RrdTime.JAN = 28;
RrdTime.FEB = 29;
RrdTime.MAR = 30;
RrdTime.APR = 31;
RrdTime.MAY = 32;
RrdTime.JUN = 33;
RrdTime.JUL = 34;
RrdTime.AUG = 35;
RrdTime.SEP = 36;
RrdTime.OCT = 37;
RrdTime.NOV = 38;
RrdTime.DEC = 39;
RrdTime.SUN = 40;
RrdTime.MON = 41;
RrdTime.TUE = 42;
RrdTime.WED = 43;
RrdTime.THU = 44;
RrdTime.FRI = 45;
RrdTime.SAT = 46;

RrdTime.variousWords = [
	{name: "midnight", value: RrdTime.MIDNIGHT}, /* 00:00:00 of today or tomorrow */
	{name: "noon", value: RrdTime.NOON},     /* 12:00:00 of today or tomorrow */
	{name: "teatime", value: RrdTime.TEATIME},   /* 16:00:00 of today or tomorrow */
	{name: "am", value: RrdTime.AM},         /* morning times for 0-12 clock */
	{name: "pm", value: RrdTime.PM},         /* evening times for 0-12 clock */
	{name: "tomorrow", value: RrdTime.TOMORROW},
	{name: "yesterday", value: RrdTime.YESTERDAY},
	{name: "today", value: RrdTime.TODAY},
	{name: "now", value: RrdTime.NOW},
	{name: "n", value: RrdTime.NOW},
	{name: "start", value: RrdTime.START},
	{name: "s", value: RrdTime.START},
	{name: "end", value: RrdTime.END},
	{name: "e", value: RrdTime.END},
	{name: "epoch", value: RrdTime.EPOCH},
	{name: "jan", value: RrdTime.JAN},
	{name: "feb", value: RrdTime.FEB},
	{name: "mar", value: RrdTime.MAR},
	{name: "apr", value: RrdTime.APR},
	{name: "may", value: RrdTime.MAY},
	{name: "jun", value: RrdTime.JUN},
	{name: "jul", value: RrdTime.JUL},
	{name: "aug", value: RrdTime.AUG},
	{name: "sep", value: RrdTime.SEP},
	{name: "oct", value: RrdTime.OCT},
	{name: "nov", value: RrdTime.NOV},
	{name: "dec", value: RrdTime.DEC},
	{name: "january", value: RrdTime.JAN},
	{name: "february", value: RrdTime.FEB},
	{name: "march", value: RrdTime.MAR},
	{name: "april", value: RrdTime.APR},
	{name: "may", value: RrdTime.MAY},
	{name: "june", value: RrdTime.JUN},
	{name: "july", value: RrdTime.JUL},
	{name: "august", value: RrdTime.AUG},
	{name: "september", value: RrdTime.SEP},
	{name: "october", value: RrdTime.OCT},
	{name: "november", value: RrdTime.NOV},
	{name: "december", value: RrdTime.DEC},
	{name: "sunday", value: RrdTime.SUN},
	{name: "sun", value: RrdTime.SUN},
	{name: "monday", value: RrdTime.MON},
	{name: "mon", value: RrdTime.MON},
	{name: "tuesday", value: RrdTime.TUE},
	{name: "tue", value: RrdTime.TUE},
	{name: "wednesday", value: RrdTime.WED},
	{name: "wed", value: RrdTime.WED},
	{name: "thursday", value: RrdTime.THU},
	{name: "thu", value: RrdTime.THU},
	{name: "friday", value: RrdTime.FRI},
	{name: "fri", value: RrdTime.FRI},
	{name: "saturday", value: RrdTime.SAT},
	{name: "sat", value: RrdTime.SAT}
];

RrdTime.timeMultipliers = [
	{name: "second", value: RrdTime.SECONDS},    /* seconds multiplier */
	{name: "seconds", value: RrdTime.SECONDS},   /* (pluralized) */
	{name: "sec", value: RrdTime.SECONDS},   /* (generic) */
	{name: "s", value: RrdTime.SECONDS},     /* (short generic) */
	{name: "minute", value: RrdTime.MINUTES},    /* minutes multiplier */
	{name: "minutes", value: RrdTime.MINUTES},   /* (pluralized) */
	{name: "min", value: RrdTime.MINUTES},   /* (generic) */
	{name: "m", value: RrdTime.MONTHS_MINUTES},  /* (short generic) */
	{name: "hour", value: RrdTime.HOURS},    /* hours ... */
	{name: "hours", value: RrdTime.HOURS},   /* (pluralized) */
	{name: "hr", value: RrdTime.HOURS},      /* (generic) */
	{name: "h", value: RrdTime.HOURS},       /* (short generic) */
	{name: "day", value: RrdTime.DAYS},      /* days ... */
	{name: "days", value: RrdTime.DAYS},     /* (pluralized) */
	{name: "d", value: RrdTime.DAYS},        /* (short generic) */
	{name: "week", value: RrdTime.WEEKS},    /* week ... */
	{name: "weeks", value: RrdTime.WEEKS},   /* (pluralized) */
	{name: "wk", value: RrdTime.WEEKS},      /* (generic) */
	{name: "w", value: RrdTime.WEEKS},       /* (short generic) */
	{name: "month", value: RrdTime.MONTHS},  /* week ... */
	{name: "months", value: RrdTime.MONTHS}, /* (pluralized) */
	{name: "mon", value: RrdTime.MONTHS},    /* (generic) */
	{name: "year", value: RrdTime.YEARS},    /* year ... */
	{name: "years", value: RrdTime.YEARS},   /* (pluralized) */
	{name: "yr", value: RrdTime.YEARS},      /* (generic) */
	{name: "y", value: RrdTime.YEARS}       /* (short generic) */
];

RrdTime.ABSOLUTE_TIME = 0;
RrdTime.RELATIVE_TO_START_TIME = 1;
RrdTime.RELATIVE_TO_END_TIME = 2;
RrdTime.RELATIVE_TO_EPOCH = 3;

RrdTime.prototype = {
	tspec: null,
	tokens: null,
	toklen: 0,
	tokidx: 0,

	token: null,
	tokid: 0,

	type: 0,
	offset: 0,
	tm_sec: 0,
	tm_min: 0,
	tm_hour: 0,
	tm_mday: 0,
	tm_mon: 0,
	tm_year: 0,
	tm_wday: 0,

	specials: null,

	gettok: function ()
	{
		if (this.tokidx >= this.toklen) {
			this.tokid = RrdTime.EOF;
		} else {
			this.token = this.tokens[this.tokidx];
			this.tokidx++;
			if (!isNaN(this.token)) {
				this.tokid = RrdTime.NUMBER;
				this.token = parseInt(this.token,10);
			} else if (this.token === ':') {
				this.tokid = RrdTime.COLON;
			} else if (this.token === '.') {
				this.tokid = RrdTime.DOT;
			} else if (this.token === '+') {
				this.tokid = RrdTime.PLUS;
			} else if (this.token === '/') {
				this.tokid = RrdTime.SLASH;
			} else if (this.token === '-') {
				this.tokid = RrdTime.MINUS;
			} else {
				this.tokid = RrdTime.ID;
				for (var i = 0, len = this.specials.length; i < len; i++) {
					if (this.specials[i].name === this.token) {
						this.tokid = this.specials[i].value;
						break;
					}
				}
			}
		}
		return this.tokid;
	},
	plus_minus: function (doop)
	{
		var op = RrdTime.PLUS;
		var prev_multiplier = -1;
		var delta;

		if (doop >= 0) {
			op = doop;
			if (this.gettok() != RrdTime.NUMBER)
				throw "There should be number after '"+(op == RrdTime.PLUS ? '+' : '-')+"'";
			prev_multiplier = -1;   /* reset months-minutes guessing mechanics */
		}
		/* if doop is < 0 then we repeat the previous op with the prefetched number */
		delta = this.token;
		if (this.gettok() == RrdTime.MONTHS_MINUTES) {
			/* hard job to guess what does that -5m means: -5mon or -5min? */
			switch (prev_multiplier) {
				case RrdTime.DAYS:
				case RrdTime.WEEKS:
				case RrdTime.MONTHS:
				case RrdTime.YEARS:
					this.tokid = RrdTime.MONTHS;
					break;
				case RrdTime.SECONDS:
				case RrdTime.MINUTES:
				case RrdTime.HOURS:
					this.tokid = RrdTime.MINUTES;
					break;
				default:
					if (delta < 6)  /* it may be some other value but in the context of RRD who needs less than 6 min deltas? */
						this.tokid = RrdTime.MONTHS;
					else
						this.tokid = RrdTime.MINUTES;
			}
		}
		prev_multiplier = this.tokid;
		switch (this.tokid) {
			case RrdTime.YEARS:
				this.tm_year += ( op == RrdTime.PLUS) ? delta : -delta;
				return;
			case RrdTime.MONTHS:
				this.tm_mon += ( op == RrdTime.PLUS) ? delta : -delta;
				return;
			case RrdTime.WEEKS:
				delta *= 7;
			case RrdTime.DAYS:
				this.tm_mday += ( op == RrdTime.PLUS) ? delta : -delta;
				return;
			case RrdTime.HOURS:
				this.offset += (op == RrdTime.PLUS) ? delta * 60 * 60 : -delta * 60 * 60;
				return;
			case RrdTime.MINUTES:
				this.offset += (op == RrdTime.PLUS) ? delta * 60 : -delta * 60;
				return;
			case RrdTime.SECONDS:
				this.offset += (op == RrdTime.PLUS) ? delta : -delta;
				return;
			default: /*default unit is seconds */
				this.offset += (op == RrdTime.PLUS) ? delta : -delta;
				return;
		}
		throw "well-known time unit expected after "+delta;
	},
	tod: function() /* tod() computes the time of day (TIME-OF-DAY-SPEC) */
	{
		var hour, minute = 0;
		var tlen;
		/* save token status in  case we must abort */
		var tokid_sv = this.tokid;

		tlen = (this.token+"").length;
		/* first pick out the time of day - we assume a HH (COLON|DOT) MM time */
		if (tlen > 2)
			return;
		hour = this.token;
		this.gettok();
		if (this.tokid == RrdTime.SLASH || this.tokid == RrdTime.DOT) {
			/* guess we are looking at a date */
			this.tokid = tokid_sv;
			this.token = hour;
			return;
		}
		if (this.tokid == RrdTime.COLON) {
			if (this.gettok() != RrdTime.NUMBER)
				throw "Parsing HH:MM syntax, expecting MM as number, got none";
			minute = this.token;
			if (minute > 59)
				throw "parsing HH:MM syntax, got MM = "+minute+" (>59!)";
			this.gettok();
		}
		/* check if an AM or PM specifier was given */
		if (this.tokid == RrdTime.AM || this.tokid == RrdTime.PM) {
			if (hour > 12) {
				throw "there cannot be more than 12 AM or PM hours";
			}
			if (this.tokid == RrdTime.PM) {
				if (hour != 12) /* 12:xx PM is 12:xx, not 24:xx */
					hour += 12;
			} else {
				if (hour == 12) /* 12:xx AM is 00:xx, not 12:xx */
					hour = 0;
			}
			this.gettok();
		} else if (hour > 23) {
			/* guess it was not a time then ... */
			this.tokid = tokid_sv;
			this.token = hour;
			return;
		}
		this.tm_hour = hour;
		this.tm_min = minute;
		this.tm_sec = 0;
		if (this.tm_hour == 24) {
		    this.tm_hour = 0;
		    this.tm_mday++;
		}
	},
	assign_date: function(mday, mon, year)
	{
		if (year > 138) {
			if (year > 1970) {
				year -= 1900;
			} else {
				throw "invalid year "+year+" (should be either 00-99 or >1900)";
			}
		} else if (year >= 0 && year < 38) {
			year += 100;    /* Allow year 2000-2037 to be specified as   */
		}
		/* 00-37 until the problem of 2038 year will */
		/* arise for unices with 32-bit time_t :)    */
		if (year < 70)
			throw "won't handle dates before epoch (01/01/1970), sorry";

		this.tm_mday = mday;
		this.tm_mon = mon;
		this.tm_year = year;
	},
	day: function ()
	{
		var mday = 0, wday, mon, year = this.tm_year;
		var tlen;

		switch (this.tokid) {
			case RrdTime.YESTERDAY:
				this.tm_mday--;
			case RrdTime.TODAY:
				this.gettok();
				break;
			case RrdTime.TOMORROW:
				this.tm_mday++;
				this.gettok();
				break;
			case RrdTime.JAN:
			case RrdTime.FEB:
			case RrdTime.MAR:
			case RrdTime.APR:
			case RrdTime.MAY:
			case RrdTime.JUN:
			case RrdTime.JUL:
			case RrdTime.AUG:
			case RrdTime.SEP:
			case RrdTime.OCT:
			case RrdTime.NOV:
			case RrdTime.DEC:
				mon = (this.tokid - RrdTime.JAN);
				if (this.gettok() != RrdTime.NUMBER)
					throw "the day of the month should follow month name";
				mday = this.token;
				if (this.gettok() == RrdTime.NUMBER) {
					year =	this.token;
					this.gettok();
				} else {
					year = this.tm_year;
				}
				this.assign_date(mday, mon, year);
				break;
			case RrdTime.SUN:
			case RrdTime.MON:
			case RrdTime.TUE:
			case RrdTime.WED:
			case RrdTime.THU:
			case RrdTime.FRI:
			case RrdTime.SAT:
				wday = (this.tokid - RrdTime.SUN);
				this.tm_mday += (wday - this.tm_wday);
				this.gettok();
				break;
			case RrdTime.NUMBER:
				mon = this.token;
				if (mon > 10 * 365 * 24 * 60 * 60) {
					this.localtime(mon);
					this.gettok();
					break;
				}
				if (mon > 19700101 && mon < 24000101) { /*works between 1900 and 2400 */
					var str = this.token + '';
					year = parseInt(str.substr(0,4),10);
					mon = parseInt(str.substr(4,2),10);
					mday = parseInt(str.substr(6,2),10);
					this.gettok();
				} else {
					this.gettok();
					if (mon <= 31 && (this.tokid == RrdTime.SLASH || this.tokid == RrdTime.DOT)) {
						var sep = this.tokid;
						if (this.gettok() != RrdTime.NUMBER)
							throw "there should be "+(RrdTime.DOT ? "month" : "day")+" number after '"+(RrdTime.DOT ? '.' : '/')+"'";
						mday = this.token;
						if (this.gettok() == sep) {
							if (this.gettok() != RrdTime.NUMBER)
								throw "there should be year number after '"+(sep == RrdTime.DOT ? '.' : '/')+"'";
							year = this.token;
							this.gettok();
						}
						if (sep == RrdTime.DOT) {
							var x = mday;
							mday = mon;
							mon = x;
						}
					}
			}
			mon--;
			if (mon < 0 || mon > 11)
				throw "did you really mean month "+(mon+1)+"?";
			if (mday < 1 || mday > 31)
				throw "I'm afraid that "+mday+" is not a valid day of the month";
			this.assign_date(mday, mon, year);
			break;
		}
	},
	parser: function(tspec)
	{
		var date = new Date();
		var hr = 0;
		
		this.tspec = tspec;
	
		this.specials = RrdTime.variousWords;
		this.tokens = (tspec+'').match(/[0-9]+|[A-Za-z]+|[:.+-\/]/g);
		this.toklen = this.tokens.length;

		/* establish the default time reference */
		this.type = RrdTime.ABSOLUTE_TIME;
		this.offset = 0;
		this.tm_sec = date.getSeconds();
		this.tm_min = date.getMinutes();
		this.tm_hour = date.getHours();
		this.tm_mday = date.getDate();
		this.tm_mon = date.getMonth();
		this.tm_year = date.getFullYear()-1900;
		this.tm_wday = date.getDay();
//		thisptv->tm = *localtime(&now);

		this.gettok();
		switch (this.tokid) {
			case RrdTime.PLUS:
			case RrdTime.MINUS:
				break;          /* jump to OFFSET-SPEC part */
			case RrdTime.EPOCH:
				this.type = RrdTime.RELATIVE_TO_EPOCH;
			case RrdTime.START:
			case RrdTime.END:
				if (this.tokid === RrdTime.EPOCH)
					this.type = RrdTime.RELATIVE_TO_START_TIME;
				else
				        this.type = RrdTime.RELATIVE_TO_END_TIME;
				this.tm_sec = 0;
				this.tm_min = 0;
				this.tm_hour = 0;
				this.tm_mday = 0;
				this.tm_mon = 0;
				this.tm_year = 0;
			case RrdTime.NOW:
				var time_reference = this.tokid;
				this.gettok();
				if (this.tokid == RrdTime.PLUS || this.tokid == RrdTime.MINUS)
					break;
				if (time_reference != RrdTime.NOW) {
					throw "'start' or 'end' MUST be followed by +|- offset";
				} else if (this.tokid != RrdTime.EOF) {
					throw "if 'now' is followed by a token it must be +|- offset";
				}
				break;
			case RrdTime.NUMBER: /* Only absolute time specifications below */
				var hour_sv = this.tm_hour;
				var year_sv = this.tm_year;
				this.tm_hour = 30;
				this.tm_year = 30000;
				this.tod();
				this.day();
				if (this.tm_hour == 30 && this.tm_year != 30000)
					this.tod();
				if (this.tm_hour == 30)
					this.tm_hour = hour_sv;
				if (this.tm_year == 30000)
					this.tm_year = year_sv;
				break;
			case RrdTime.JAN:
			case RrdTime.FEB:
			case RrdTime.MAR:
			case RrdTime.APR:
			case RrdTime.MAY:
			case RrdTime.JUN:
			case RrdTime.JUL:
			case RrdTime.AUG:
			case RrdTime.SEP:
			case RrdTime.OCT:
			case RrdTime.NOV:
			case RrdTime.DEC:
				this.day();
				if (this.tokid != RrdTime.NUMBER)
					break;
				this.tod();
				break;
			case RrdTime.TEATIME:
				hr += 4;
			case RrdTime.NOON:
				hr += 12;
			case RrdTime.MIDNIGHT:
				this.tm_hour = hr;
				this.tm_min = 0;
				this.tm_sec = 0;
				this.gettok();
				this.day();
				break;
			default:
				throw "unparsable time: "+this.token+" "+this.sct;
				break;
		} /* ugly case statement */

		/*
		 * the OFFSET-SPEC part
		 *
		 * (NOTE, the sc_tokid was prefetched for us by the previous code)
		 */
 		if (this.tokid == RrdTime.PLUS || this.tokid == RrdTime.MINUS) {
			this.specials = RrdTime.timeMultipliers; /* switch special words context */
			while (this.tokid == RrdTime.PLUS || this.tokid == RrdTime.MINUS || this.tokid == RrdTime.NUMBER) {
				if (this.tokid == RrdTime.NUMBER) {
					this.plus_minus(-1);
				} else {
					this.plus_minus(this.tokid);
				}
				this.gettok();    /* We will get EOF eventually but that's OK, since token() will return us as many EOFs as needed */
			}
		}

		/* now we should be at EOF */
		if (this.tokid != RrdTime.EOF)
			throw "unparsable trailing text: '..."+this.token+"'";
//	if (this.type == RrdTime.ABSOLUTE_TIME)
//		if (mktime(&ptv->tm) == -1)  // FIXME ??
//			panic(e("the specified time is incorrect (out of range?)"));
	},
	localtime: function (tm)
	{
		var date = new Date(tm*1000);
		this.tm_sec = date.getSeconds();
		this.tm_min = date.getMinutes();
		this.tm_hour = date.getHours();
		this.tm_mday = date.getDate();
		this.tm_mon = date.getMonth();
		this.tm_year = date.getFullYear()-1900;
		this.tm_wday = date.getDay();
	},
	mktime: function()
	{
		var date = new Date(this.tm_year+1900, this.tm_mon, this.tm_mday, this.tm_hour, this.tm_min, this.tm_sec);
		return Math.round(date.getTime()/1000.0);
	}
}

RrdTime.proc_start_end = function(start_t, end_t) {
	var start, end;

	if (start_t.type == RrdTime.RELATIVE_TO_END_TIME &&  end_t.type == RrdTime.RELATIVE_TO_START_TIME)
		throw "the start and end times cannot be specified relative to each other";
	if (start_t.type == RrdTime.RELATIVE_TO_START_TIME)
		throw "the start time cannot be specified relative to itself";
	if (end_t.type == RrdTime.RELATIVE_TO_END_TIME)
		throw "the end time cannot be specified relative to itself";

	if (start_t.type == RrdTime.RELATIVE_TO_END_TIME) {
		end = end_t.mktime() + end_t.offset;
		var tmtmp = new Date(end*1000);
		tmtmp.setDate(tmtmp.getDate()+start_t.tm_mday);
		tmtmp.setMonth(tmtmp.getMonth()+start_t.tm_mon);
		tmtmp.setFullYear(tmtmp.getFullYear()+start_t.tm_year);
		start = Math.round(tmtmp.getTime()/1000.0) + start_t.offset;
	} else {
		start = start_t.mktime() + start_t.offset;
	}
	if (end_t.type == RrdTime.RELATIVE_TO_START_TIME) {
		start = start_t.mktime() + start_t.offset;
		var tmtmp = new Date(start*1000);
		tmtmp.setDate(tmtmp.getDate()+end_t.tm_mday);
		tmtmp.setMonth(tmtmp.getMonth()+end_t.tm_mon);
		tmtmp.setFullYear(tmtmp.getFullYear()+end_t.tm_year);
		end = Math.round(tmtmp.getTime()/1000.0) + end_t.offset;
	} else {
		end = end_t.mktime() + end_t.offset;
	}
	return [start, end];
}
