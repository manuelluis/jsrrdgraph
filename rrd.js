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

var RRDTime = function() {
  this.parser.apply(this, arguments);
};

RRDTime.EOF = -1; 
RRDTime.MIDNIGHT = 0; 
RRDTime.NOON = 1; 
RRDTime.TEATIME = 2;
RRDTime.PM = 3; 
RRDTime.AM = 4; 
RRDTime.YESTERDAY = 5; 
RRDTime.TODAY = 6; 
RRDTime.TOMORROW = 7; 
RRDTime.NOW = 8; 
RRDTime.START = 9; 
RRDTime.END = 10; 
RRDTime.EPOCH = 11;
RRDTime.SECONDS = 12; 
RRDTime.MINUTES = 13; 
RRDTime.HOURS = 14; 
RRDTime.DAYS = 15; 
RRDTime.WEEKS = 16; 
RRDTime.MONTHS = 17; 
RRDTime.YEARS = 18;
RRDTime.MONTHS_MINUTES = 19;
RRDTime.NUMBER = 20; 
RRDTime.PLUS = 21; 
RRDTime.MINUS = 22;
RRDTime.DOT = 23; 
RRDTime.COLON = 24; 
RRDTime.SLASH = 25; 
RRDTime.ID = 26; 
RRDTime.JUNK = 27;
RRDTime.JAN = 28; 
RRDTime.FEB = 29; 
RRDTime.MAR = 30; 
RRDTime.APR = 31; 
RRDTime.MAY = 32; 
RRDTime.JUN = 33;
RRDTime.JUL = 34;
RRDTime.AUG = 35;
RRDTime.SEP = 36;
RRDTime.OCT = 37;
RRDTime.NOV = 38;
RRDTime.DEC = 39;
RRDTime.SUN = 40;
RRDTime.MON = 41;
RRDTime.TUE = 42;
RRDTime.WED = 43;
RRDTime.THU = 44;
RRDTime.FRI = 45;
RRDTime.SAT = 46;

RRDTime.variousWords = [
    {name: "midnight", value: RRDTime.MIDNIGHT}, /* 00:00:00 of today or tomorrow */
    {name: "noon", value: RRDTime.NOON},     /* 12:00:00 of today or tomorrow */
    {name: "teatime", value: RRDTime.TEATIME},   /* 16:00:00 of today or tomorrow */
    {name: "am", value: RRDTime.AM},         /* morning times for 0-12 clock */
    {name: "pm", value: RRDTime.PM},         /* evening times for 0-12 clock */
    {name: "tomorrow", value: RRDTime.TOMORROW},
    {name: "yesterday", value: RRDTime.YESTERDAY},
    {name: "today", value: RRDTime.TODAY},
    {name: "now", value: RRDTime.NOW},
    {name: "n", value: RRDTime.NOW},
    {name: "start", value: RRDTime.START},
    {name: "s", value: RRDTime.START},
    {name: "end", value: RRDTime.END},
    {name: "e", value: RRDTime.END},
    {name: "epoch", value: RRDTime.EPOCH},
    {name: "jan", value: RRDTime.JAN},
    {name: "feb", value: RRDTime.FEB},
    {name: "mar", value: RRDTime.MAR},
    {name: "apr", value: RRDTime.APR},
    {name: "may", value: RRDTime.MAY},
    {name: "jun", value: RRDTime.JUN},
    {name: "jul", value: RRDTime.JUL},
    {name: "aug", value: RRDTime.AUG},
    {name: "sep", value: RRDTime.SEP},
    {name: "oct", value: RRDTime.OCT},
    {name: "nov", value: RRDTime.NOV},
    {name: "dec", value: RRDTime.DEC},
    {name: "january", value: RRDTime.JAN},
    {name: "february", value: RRDTime.FEB},
    {name: "march", value: RRDTime.MAR},
    {name: "april", value: RRDTime.APR},
    {name: "may", value: RRDTime.MAY},
    {name: "june", value: RRDTime.JUN},
    {name: "july", value: RRDTime.JUL},
    {name: "august", value: RRDTime.AUG},
    {name: "september", value: RRDTime.SEP},
    {name: "october", value: RRDTime.OCT},
    {name: "november", value: RRDTime.NOV},
    {name: "december", value: RRDTime.DEC},
    {name: "sunday", value: RRDTime.SUN},
    {name: "sun", value: RRDTime.SUN},
    {name: "monday", value: RRDTime.MON},
    {name: "mon", value: RRDTime.MON},
    {name: "tuesday", value: RRDTime.TUE},
    {name: "tue", value: RRDTime.TUE},
    {name: "wednesday", value: RRDTime.WED},
    {name: "wed", value: RRDTime.WED},
    {name: "thursday", value: RRDTime.THU},
    {name: "thu", value: RRDTime.THU},
    {name: "friday", value: RRDTime.FRI},
    {name: "fri", value: RRDTime.FRI},
    {name: "saturday", value: RRDTime.SAT},
    {name: "sat", value: RRDTime.SAT}
];

RRDTime.timeMultipliers = [
    {name: "second", value: RRDTime.SECONDS},    /* seconds multiplier */
    {name: "seconds", value: RRDTime.SECONDS},   /* (pluralized) */
    {name: "sec", value: RRDTime.SECONDS},   /* (generic) */
    {name: "s", value: RRDTime.SECONDS},     /* (short generic) */
    {name: "minute", value: RRDTime.MINUTES},    /* minutes multiplier */
    {name: "minutes", value: RRDTime.MINUTES},   /* (pluralized) */
    {name: "min", value: RRDTime.MINUTES},   /* (generic) */
    {name: "m", value: RRDTime.MONTHS_MINUTES},  /* (short generic) */
    {name: "hour", value: RRDTime.HOURS},    /* hours ... */
    {name: "hours", value: RRDTime.HOURS},   /* (pluralized) */
    {name: "hr", value: RRDTime.HOURS},      /* (generic) */
    {name: "h", value: RRDTime.HOURS},       /* (short generic) */
    {name: "day", value: RRDTime.DAYS},      /* days ... */
    {name: "days", value: RRDTime.DAYS},     /* (pluralized) */
    {name: "d", value: RRDTime.DAYS},        /* (short generic) */
    {name: "week", value: RRDTime.WEEKS},    /* week ... */
    {name: "weeks", value: RRDTime.WEEKS},   /* (pluralized) */
    {name: "wk", value: RRDTime.WEEKS},      /* (generic) */
    {name: "w", value: RRDTime.WEEKS},       /* (short generic) */
    {name: "month", value: RRDTime.MONTHS},  /* week ... */
    {name: "months", value: RRDTime.MONTHS}, /* (pluralized) */
    {name: "mon", value: RRDTime.MONTHS},    /* (generic) */
    {name: "year", value: RRDTime.YEARS},    /* year ... */
    {name: "years", value: RRDTime.YEARS},   /* (pluralized) */
    {name: "yr", value: RRDTime.YEARS},      /* (generic) */
    {name: "y", value: RRDTime.YEARS}       /* (short generic) */
];

RRDTime.ABSOLUTE_TIME = 0;
RRDTime.RELATIVE_TO_START_TIME = 1;
RRDTime.RELATIVE_TO_END_TIME = 2;
RRDTime.RELATIVE_TO_EPOCH = 3;

RRDTime.prototype = {
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
			this.tokid = RRDTime.EOF;
		} else {
			this.token = this.tokens[this.tokidx];
			this.tokidx++;
			if (!isNaN(this.token)) {
				this.tokid = RRDTime.NUMBER;
				this.token = parseInt(this.token);
			} else if (this.token === ':') {
				this.tokid = RRDTime.COLON;
			} else if (this.token === '.') { 
				this.tokid = RRDTime.DOT;
			} else if (this.token === '+') {
				this.tokid = RRDTime.PLUS;
			} else if (this.token === '/') { 
				this.tokid = RRDTime.SLASH;	
			} else if (this.token === '-') {
				this.tokid = RRDTime.MINUS;
			} else {
				this.tokid = RRDTime.ID;
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
    var op = RRDTime.PLUS;
    var prev_multiplier = -1;
    var delta;

    if (doop >= 0) {
			op = doop;
			if (this.gettok() != RRDTime.NUMBER) 
				throw "There should be number after '"+(op == RRDTime.PLUS ? '+' : '-')+"'";
			prev_multiplier = -1;   /* reset months-minutes guessing mechanics */
		}
    /* if doop is < 0 then we repeat the previous op with the prefetched number */
    delta = this.token;
    if (this.gettok() == RRDTime.MONTHS_MINUTES) {
			/* hard job to guess what does that -5m means: -5mon or -5min? */
			switch (prev_multiplier) {
				case RRDTime.DAYS:
				case RRDTime.WEEKS:
				case RRDTime.MONTHS:
				case RRDTime.YEARS:
					this.tokid = RRDTime.MONTHS;
					break;
				case RRDTime.SECONDS:
        case RRDTime.MINUTES:
        case RRDTime.HOURS:
          this.tokid = RRDTime.MINUTES;
          break;
        default:
					if (delta < 6)  /* it may be some other value but in the context of RRD who needs less than 6 min deltas? */
						this.tokid = RRDTime.MONTHS;
					else
						this.tokid = RRDTime.MINUTES;
      }
		}
		prev_multiplier = this.tokid;
    switch (this.tokid) {
	    case RRDTime.YEARS:
  	    this.tm_year += ( op == RRDTime.PLUS) ? delta : -delta;
        return;
	    case RRDTime.MONTHS:
        this.tm_mon += ( op == RRDTime.PLUS) ? delta : -delta;
        return;
  	  case RRDTime.WEEKS:
        delta *= 7;
    	case RRDTime.DAYS:
        this.tm_mday += ( op == RRDTime.PLUS) ? delta : -delta;
        return;
	    case RRDTime.HOURS:
        this.offset += (op == RRDTime.PLUS) ? delta * 60 * 60 : -delta * 60 * 60;
        return;
  	  case RRDTime.MINUTES:
        this.offset += (op == RRDTime.PLUS) ? delta * 60 : -delta * 60;
        return;
   	 	case RRDTime.SECONDS:
        this.offset += (op == RRDTime.PLUS) ? delta : -delta;
        return;
    	default: /*default unit is seconds */
        this.offset += (op == RRDTime.PLUS) ? delta : -delta;
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
    if (this.tokid == RRDTime.SLASH || this.tokid == RRDTime.DOT) {
        /* guess we are looking at a date */
        this.tokid = tokid_sv;
        this.token = hour;
        return;
    }
    if (this.tokid == RRDTime.COLON) {
			if (this.gettok() != RRDTime.NUMBER)
				throw "Parsing HH:MM syntax, expecting MM as number, got none";
			minute = this.token;
			if (minute > 59) 
				throw "parsing HH:MM syntax, got MM = "+minute+" (>59!)";
			this.gettok();
    }
    /* check if an AM or PM specifier was given */
    if (this.tokid == RRDTime.AM || this.tokid == RRDTime.PM) {
        if (hour > 12) {
            throw "there cannot be more than 12 AM or PM hours";
        }
        if (this.tokid == RRDTime.PM) {
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
			case RRDTime.YESTERDAY:
				this.tm_mday--;
			case RRDTime.TODAY:
				this.gettok();
				break;
			case RRDTime.TOMORROW:
				this.tm_mday++;
				this.gettok();
				break;
			case RRDTime.JAN:
			case RRDTime.FEB:
			case RRDTime.MAR:
			case RRDTime.APR:
			case RRDTime.MAY:
			case RRDTime.JUN:
			case RRDTime.JUL:
			case RRDTime.AUG:
			case RRDTime.SEP:
			case RRDTime.OCT:
			case RRDTime.NOV:
			case RRDTime.DEC:
        mon = (this.tokid - RRDTime.JAN);
				if (this.gettok() != RRDTime.NUMBER)
					throw "the day of the month should follow month name";
        mday = this.token;
        if (this.gettok() == RRDTime.NUMBER) {
            year =	this.token;
            this.gettok();
        } else {
            year = this.tm_year;
				}
        this.assign_date(mday, mon, year);
        break;
			case RRDTime.SUN:
			case RRDTime.MON:
			case RRDTime.TUE:
			case RRDTime.WED:
			case RRDTime.THU:
			case RRDTime.FRI:
			case RRDTime.SAT:
				wday = (this.tokid - RRDTime.SUN);
				this.tm_mday += (wday - this.tm_wday);
				this.gettok();
				break;
			case RRDTime.NUMBER:
        mon = this.token;
        if (mon > 10 * 365 * 24 * 60 * 60) {
            this.localtime(mon);
            this.gettok();
            break;
        }
        if (mon > 19700101 && mon < 24000101) { /*works between 1900 and 2400 */
					var str = this.token + '';	
					year = parseInt(str.substr(0,4));
					mon = parseInt(str.substr(4,2));
					mday = parseInt(str.substr(6,2));
					this.gettok();
        } else {
          this.gettok();
					if (mon <= 31 && (this.tokid == RRDTime.SLASH || this.tokid == RRDTime.DOT)) {
						var sep = this.tokid;
						if (this.gettok() != RRDTime.NUMBER)
							throw "there should be "+(RRDTime.DOT ? "month" : "day")+" number after '"+(RRDTime.DOT ? '.' : '/')+"'";
						mday = this.token;
						if (this.gettok() == sep) {
							if (this.gettok() != RRDTime.NUMBER)
								throw "there should be year number after '"+(sep == RRDTime.DOT ? '.' : '/')+"'";
							year = this.token;
							this.gettok();
						}
						if (sep == RRDTime.DOT) {
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
				throw "I'm afraid that "+mday+" is not a valid day of the month",
			this.assign_date(mday, mon, year);
			break;
		}
	}, 
	parser: function(tspec)
	{
		var date = new Date();
    var hr = 0;

		this.specials = RRDTime.variousWords;
		this.tokens = (tspec+'').match(/[0-9]+|[A-Za-z]+|[:.+-\/]/g);
		this.toklen = this.tokens.length;

    /* establish the default time reference */
    this.type = RRDTime.ABSOLUTE_TIME;
    this.offset = 0;
		this.tm_sec = date.getSeconds();
		this.tm_min = date.getMinutes();
		this.tm_hour = date.getHours();
		this.tm_mday = date.getDate();
		this.tm_mon = date.getMonth();
		this.tm_year = date.getFullYear()-1900;
		this.tm_wday = date.getDay();
    //thisptv->tm = *localtime(&now);

    this.gettok();
		switch (this.tokid) {
			case RRDTime.PLUS:
			case RRDTime.MINUS:
				break;          /* jump to OFFSET-SPEC part */
			case RRDTime.EPOCH:
				this.type = RRDTime.RELATIVE_TO_EPOCH;
			case RRDTime.START:
			case RRDTime.END:
				if (this.tokid === RRDTime.EPOCH)
      	  this.type = RRDTime.RELATIVE_TO_START_TIME;
				else
	        this.type = RRDTime.RELATIVE_TO_END_TIME;
        this.tm_sec = 0;
        this.tm_min = 0;
        this.tm_hour = 0;
        this.tm_mday = 0;
        this.tm_mon = 0;
        this.tm_year = 0;
			case RRDTime.NOW:
        var time_reference = this.tokid;
        this.gettok();
        if (this.tokid == RRDTime.PLUS || this.tokid == RRDTime.MINUS)
            break;
        if (time_reference != RRDTime.NOW) {
            throw "'start' or 'end' MUST be followed by +|- offset";
        } else if (this.tokid != RRDTime.EOF) {
            throw "if 'now' is followed by a token it must be +|- offset";
        }
        break;
			case RRDTime.NUMBER: /* Only absolute time specifications below */
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
			case RRDTime.JAN:
			case RRDTime.FEB:
			case RRDTime.MAR:
			case RRDTime.APR:
			case RRDTime.MAY:
			case RRDTime.JUN:
			case RRDTime.JUL:
			case RRDTime.AUG:
			case RRDTime.SEP:
			case RRDTime.OCT:
			case RRDTime.NOV:
			case RRDTime.DEC:
        this.day();
				if (this.tokid != RRDTime.NUMBER)
					break;
				this.tod();
				break;
			case RRDTime.TEATIME:
				hr += 4;
			case RRDTime.NOON:
				hr += 12;
			case RRDTime.MIDNIGHT:
				this.tm_hour = hr;
				this.tm_min = 0;
				this.tm_sec = 0;
        this.gettok();
        this.day();
        break;
			default:
        throw "unparsable time: "+this.token+" "+this.sct;
        break;
    }                   /* ugly case statement */

    /*
     * the OFFSET-SPEC part
     *
     * (NOTE, the sc_tokid was prefetched for us by the previous code)
     */
 		if (this.tokid == RRDTime.PLUS || this.tokid == RRDTime.MINUS) {
			this.specials = RRDTime.timeMultipliers; /* switch special words context */
			while (this.tokid == RRDTime.PLUS || this.tokid == RRDTime.MINUS || this.tokid == RRDTime.NUMBER) {
				if (this.tokid == RRDTime.NUMBER) {
					this.plus_minus(-1);
				} else {
					this.plus_minus(this.tokid);
				}
					this.gettok();    /* We will get EOF eventually but that's OK, since token() will return us as many EOFs as needed */
			}
    }

    /* now we should be at EOF */
    if (this.tokid != RRDTime.EOF) 
        throw "unparsable trailing text: '..."+this.token+"'";
//    if (this.type == RRDTime.ABSOLUTE_TIME)
//			if (mktime(&ptv->tm) == -1)  // FIXME ??
//				panic(e("the specified time is incorrect (out of range?)"));
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

RRDTime.proc_start_end = function(start_t, end_t) {
	var start, end;

  if (start_t.type == RRDTime.RELATIVE_TO_END_TIME &&  end_t.type == RRDTime.RELATIVE_TO_START_TIME) 
		throw "the start and end times cannot be specified relative to each other";
  if (start_t.type == RRDTime.RELATIVE_TO_START_TIME) 
		throw "the start time cannot be specified relative to itself";
  if (end_t.type == RRDTime.RELATIVE_TO_END_TIME) 
		throw "the end time cannot be specified relative to itself";

  if (start_t.type == RRDTime.RELATIVE_TO_END_TIME) {
    end = end_t.mktime() + end_t.offset;
		var tmtmp = new Date(end*1000);
		tmtmp.setDate(tmtmp.getDate()+start_t.tm_mday);
		tmtmp.setMonth(tmtmp.getMonth()+start_t.tm_mon);
		tmtmp.setFullYear(tmtmp.getFullYear()+start_t.tm_year);
    start = Math.round(tmtmp.getTime()/1000.0) + start_t.offset;
  } else {
		start = start_t.mktime() + start_t.offset;
  }
  if (end_t.type == RRDTime.RELATIVE_TO_START_TIME) {
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

var RRDRpn = function() { 
	this.parser.apply(this, arguments);
};

RRDRpn.OP = { NUMBER: 0, VARIABLE: 1, INF: 2, PREV: 3, NEGINF: 4,
  	UNKN: 5, NOW: 6, TIME: 7, ADD: 8, MOD: 9, SUB: 10, MUL: 11,
   	DIV: 12, SIN: 13, DUP: 14, EXC: 15, POP: 16,
   	COS: 17, LOG: 18, EXP: 19, LT: 20, LE: 21, GT: 22, GE: 23, EQ: 24, IF: 25,
   	MIN: 26, MAX: 27, LIMIT: 28, FLOOR: 29, CEIL: 30,
   	UN: 31, END: 32, LTIME: 33, NE: 34, ISINF: 35, PREV_OTHER: 36, COUNT: 37,
    ATAN: 38, SQRT: 39, SORT: 40, REV: 41, TREND: 42, TREDNAN: 43,
    ATAN2: 44, RAD2DEG: 45, DEG2RAD: 46,
    PREDICT: 47, PREDICTSIGMA: 48, AVG: 49, ABS: 50, ADDNAN: 51 };

RRDRpn.STACK_UNDERFLOW = 'RPN stack underflow';

RRDRpn.prototype = {

	rpnstack: null,
	rpnp: null,

  find_var: function(gdes, key)
  {
    for (var ii = 0, gdes_c = gdes.length; ii < gdes_c; ii++) {
        if ((gdes[ii].gf == RRDGraphDesc.GF.DEF ||
              gdes[ii].gf == RRDGraphDesc.GF.VDEF ||
              gdes[ii].gf == RRDGraphDesc.GF.CDEF)
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

		this.rpnp = [];

		for(var i=0, len=exprs.length; i < len; i++) {
			expr=exprs[i].toUpperCase();
			
			steps++;
			this.rpnp[steps] = {};

			if (!isNaN(expr)) {
          this.rpnp[steps].op = RRDRpn.OP.NUMBER;
					this.rpnp[steps].val = parseFloat(expr);
			} 
			else if (expr === '+') this.rpnp[steps].op = RRDRpn.OP.ADD; 
			else if (expr === '-') this.rpnp[steps].op = RRDRpn.OP.SUB; 
			else if (expr === '*') this.rpnp[steps].op = RRDRpn.OP.MUL; 
			else if (expr === '/') this.rpnp[steps].op = RRDRpn.OP.DIV; 
			else if (expr === '%') this.rpnp[steps].op = RRDRpn.OP.MOD; 
			else if (expr === 'SIN') this.rpnp[steps].op = RRDRpn.OP.SIN; 
			else if (expr === 'COS') this.rpnp[steps].op = RRDRpn.OP.COS; 
			else if (expr === 'LOG') this.rpnp[steps].op = RRDRpn.OP.LOG; 
			else if (expr === 'FLOOR') this.rpnp[steps].op = RRDRpn.OP.FLOOR; 
			else if (expr === 'CEIL') this.rpnp[steps].op = RRDRpn.OP.CEIL; 
			else if (expr === 'EXP') this.rpnp[steps].op = RRDRpn.OP.EXP; 
			else if (expr === 'DUP') this.rpnp[steps].op = RRDRpn.OP.DUP; 
			else if (expr === 'EXC') this.rpnp[steps].op = RRDRpn.OP.EXC; 
			else if (expr === 'POP') this.rpnp[steps].op = RRDRpn.OP.POP; 
			else if (expr === 'LTIME') this.rpnp[steps].op = RRDRpn.OP.LTIME; 
			else if (expr === 'LT') this.rpnp[steps].op = RRDRpn.OP.LT; 
			else if (expr === 'LE') this.rpnp[steps].op = RRDRpn.OP.LE; 
			else if (expr === 'GT') this.rpnp[steps].op = RRDRpn.OP.GT; 
			else if (expr === 'GE') this.rpnp[steps].op = RRDRpn.OP.GE; 
			else if (expr === 'EQ') this.rpnp[steps].op = RRDRpn.OP.EQ; 
			else if (expr === 'IF') this.rpnp[steps].op = RRDRpn.OP.IF; 
			else if (expr === 'MIN') this.rpnp[steps].op = RRDRpn.OP.MIN; 
			else if (expr === 'MAX') this.rpnp[steps].op = RRDRpn.OP.MAX; 
			else if (expr === 'LIMIT') this.rpnp[steps].op = RRDRpn.OP.LIMIT; 
			else if (expr === 'UNKN') this.rpnp[steps].op = RRDRpn.OP.UNKN; 
			else if (expr === 'UN') this.rpnp[steps].op = RRDRpn.OP.UN; 
			else if (expr === 'NEGINF') this.rpnp[steps].op = RRDRpn.OP.NEGINF; 
			else if (expr === 'NE') this.rpnp[steps].op = RRDRpn.OP.NE; 
			else if (expr === 'COUNT') this.rpnp[steps].op = RRDRpn.OP.COUNT; 
			else if (/PREV\([-_A-Za-z0-9]+\)/.test(expr)) {
				var match = exprs[i].match(/PREV\(([-_A-Za-z0-9]+)\)/i);
				if (match.length == 2) {
					this.rpnp[steps].op = RRDRpn.OP.PREV_OTHER; 
  	      this.rpnp[steps].ptr = this.find_var(gdes, match[1]);  // FIXME if -1
				}
			} 
			else if (expr === 'PREV') this.rpnp[steps].op = RRDRpn.OP.PREV; 
			else if (expr === 'INF') this.rpnp[steps].op = RRDRpn.OP.INF; 
			else if (expr === 'ISINF') this.rpnp[steps].op = RRDRpn.OP.ISINF; 
			else if (expr === 'NOW') this.rpnp[steps].op = RRDRpn.OP.NOW; 
			else if (expr === 'TIME') this.rpnp[steps].op = RRDRpn.OP.TIME; 
			else if (expr === 'ATAN2') this.rpnp[steps].op = RRDRpn.OP.ATAN2; 
			else if (expr === 'ATAN') this.rpnp[steps].op = RRDRpn.OP.ATAN; 
			else if (expr === 'SQRT') this.rpnp[steps].op = RRDRpn.OP.SQRT; 
			else if (expr === 'SORT') this.rpnp[steps].op = RRDRpn.OP.SORT; 
			else if (expr === 'REV') this.rpnp[steps].op = RRDRpn.OP.REV; 
			else if (expr === 'TREND') this.rpnp[steps].op = RRDRpn.OP.TREND; 
			else if (expr === 'TRENDNAN') this.rpnp[steps].op = RRDRpn.OP.TRENDNAN; 
			else if (expr === 'PREDICT') this.rpnp[steps].op = RRDRpn.OP.PREDICT; 
			else if (expr === 'PREDICTSIGMA') this.rpnp[steps].op = RRDRpn.OP.PREDICTSIGMA; 
			else if (expr === 'RAD2DEG') this.rpnp[steps].op = RRDRpn.OP.RAD2DEG; 
			else if (expr === 'DEG2RAD') this.rpnp[steps].op = RRDRpn.OP.DEG2RAD; 
			else if (expr === 'AVG') this.rpnp[steps].op = RRDRpn.OP.AVG; 
			else if (expr === 'ABS') this.rpnp[steps].op = RRDRpn.OP.ABS; 
			else if (expr === 'ADDNAN') this.rpnp[steps].op = RRDRpn.OP.ADDNAN; 
			else if (/[-_A-Za-z0-9]+/.test(expr)) {
				this.rpnp[steps].ptr = this.find_var(gdes, exprs[i]);
				this.rpnp[steps].op = RRDRpn.OP.VARIABLE;
			} else {
        return;
      }
    }
		this.rpnp[steps + 1] = {};
    this.rpnp[steps + 1].op = RRDRpn.OP.END;
		
	},
	compare_double: function(x, y)
	{
    var diff = x -  y;
    return (diff < 0) ? -1 : (diff > 0) ? 1 : 0;
	},
	fmod: function (x, y) {
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

		for (var rpi = 0; this.rpnp[rpi].op != RRDRpn.OP.END; rpi++) {
			switch (this.rpnp[rpi].op) {
				case RRDRpn.OP.NUMBER:
					this.rpnstack[++stptr] = this.rpnp[rpi].val;
					break;
				case RRDRpn.OP.VARIABLE:
				case RRDRpn.OP.PREV_OTHER:
					if (this.rpnp[rpi].ds_cnt == 0) {
						throw "VDEF made it into rpn_calc... aborting";
					} else {
						if (this.rpnp[rpi].op == RRDRpn.OP.VARIABLE) {
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
				case RRDRpn.OP.COUNT:
					this.rpnstack[++stptr] = (output_idx + 1);    /* Note: Counter starts at 1 */
					break;
				case RRDRpn.OP.PREV:
					if ((output_idx) <= 0) this.rpnstack[++stptr] = Number.NaN;
					else this.rpnstack[++stptr] = output[output_idx - 1];
					break;
				case RRDRpn.OP.UNKN:
					this.rpnstack[++stptr] = Number.NaN;
					break;
				case RRDRpn.OP.INF:
					this.rpnstack[++stptr] = Infinity;
					break;
				case RRDRpn.OP.NEGINF:
					this.rpnstack[++stptr] = -Infinity;
					break;
				case RRDRpn.OP.NOW:
					this.rpnstack[++stptr] = Math.round((new Date()).getTime() / 1000);
					break;
				case RRDRpn.OP.TIME:
					this.rpnstack[++stptr] = data_idx;
					break;
				case RRDRpn.OP.LTIME:
					var date = new Date(data_idx*1000); // FIXME XXX
					this.rpnstack[++stptr] = date.getTimezoneOffset() * 60 + data_idx;
					break;
				case RRDRpn.OP.ADD:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] + this.rpnstack[stptr];
					stptr--;
					break;
				case RRDRpn.OP.ADDNAN:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
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
				case RRDRpn.OP.SUB:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] - this.rpnstack[stptr];
					stptr--;
					break;
				case RRDRpn.OP.MUL:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr - 1] = (this.rpnstack[stptr - 1]) * (this.rpnstack[stptr]);
					stptr--;
					break;
				case RRDRpn.OP.DIV:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] / this.rpnstack[stptr];
					stptr--;
					break;
				case RRDRpn.OP.MOD:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr - 1] = this.fmod(this.rpnstack[stptr - 1] , this.rpnstack[stptr]);
					stptr--;
					break;
				case RRDRpn.OP.SIN:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.sin(this.rpnstack[stptr]);
					break;
				case RRDRpn.OP.ATAN:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.atan(this.rpnstack[stptr]);
					break;
				case RRDRpn.OP.RAD2DEG:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = 57.29577951 * this.rpnstack[stptr];
					break;
				case RRDRpn.OP.DEG2RAD:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = 0.0174532952 * this.rpnstack[stptr];
					break;
				case RRDRpn.OP.ATAN2:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr - 1] = Math.atan2(this.rpnstack[stptr - 1], this.rpnstack[stptr]);
					stptr--;
					break;
				case RRDRpn.OP.COS:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.cos(this.rpnstack[stptr]);
					break;
				case RRDRpn.OP.CEIL:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.ceil(this.rpnstack[stptr]);
					break;
				case RRDRpn.OP.FLOOR:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.floor(this.rpnstack[stptr]);
					break;
				case RRDRpn.OP.LOG:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.log(this.rpnstack[stptr]);
					break;
				case RRDRpn.OP.DUP:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr + 1] = this.rpnstack[stptr];
					stptr++;
					break;
				case RRDRpn.OP.POP:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					stptr--;
					break;
				case RRDRpn.OP.EXC:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW; {
						var dummy = this.rpnstack[stptr];
						this.rpnstack[stptr] = this.rpnstack[stptr - 1];
						this.rpnstack[stptr - 1] = dummy;
					}
					break;
				case RRDRpn.OP.EXP:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.exp(this.rpnstack[stptr]);
					break;
				case RRDRpn.OP.LT:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1]));
					else if (isNaN(this.rpnstack[stptr]))
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					else
						this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] < this.rpnstack[stptr] ? 1.0 : 0.0;
					stptr--;
					break;
				case RRDRpn.OP.LE:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1]));
					else if (isNaN(this.rpnstack[stptr]))
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					else
						this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] <= this.rpnstack[stptr] ? 1.0 : 0.0;
					stptr--;
					break;
				case RRDRpn.OP.GT:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1]));
					else if (isNaN(this.rpnstack[stptr]))
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					else
						this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] > this.rpnstack[stptr] ? 1.0 : 0.0;
					stptr--;
					break;
				case RRDRpn.OP.GE:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1]));
					else if (isNaN(this.rpnstack[stptr]))
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					else
						this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] >= this.rpnstack[stptr] ? 1.0 : 0.0;
					stptr--;
					break;
				case RRDRpn.OP.NE:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1]));
					else if (isNaN(this.rpnstack[stptr]))
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					else
						this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] == this.rpnstack[stptr] ? 0.0 : 1.0;
					stptr--;
					break;
				case RRDRpn.OP.EQ:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1]));
					else if (isNaN(this.rpnstack[stptr]))
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					else
						this.rpnstack[stptr - 1] = this.rpnstack[stptr - 1] == this.rpnstack[stptr] ? 1.0 : 0.0;
					stptr--;
					break;
				case RRDRpn.OP.IF:
					if(stptr < 2) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr - 2] = (isNaN(this.rpnstack[stptr - 2]) || this.rpnstack[stptr - 2] == 0.0) ? this.rpnstack[stptr] : this.rpnstack[stptr - 1];
					stptr--;
					stptr--;
					break;
				case RRDRpn.OP.MIN:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1]));
					else if (isNaN(this.rpnstack[stptr]))
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					else if (this.rpnstack[stptr - 1] > this.rpnstack[stptr])
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					stptr--;
					break;
				case RRDRpn.OP.MAX:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 1]));
					else if (isNaN(this.rpnstack[stptr]))
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					else if (this.rpnstack[stptr - 1] < this.rpnstack[stptr])
						this.rpnstack[stptr - 1] = this.rpnstack[stptr];
					stptr--;
					break;
				case RRDRpn.OP.LIMIT:
					if(stptr < 2) throw RRDRpn.STACK_UNDERFLOW;
					if (isNaN(this.rpnstack[stptr - 2]));
					else if (isNaN(this.rpnstack[stptr - 1]))
							this.rpnstack[stptr - 2] = this.rpnstack[stptr - 1];
					else if (isNaN(this.rpnstack[stptr]))
							this.rpnstack[stptr - 2] = this.rpnstack[stptr];
					else if (this.rpnstack[stptr - 2] < this.rpnstack[stptr - 1])
							this.rpnstack[stptr - 2] = Number.NaN;
					else if (this.rpnstack[stptr - 2] > this.rpnstack[stptr])
							this.rpnstack[stptr - 2] = Number.NaN;
					stptr -= 2;
					break;
				case RRDRpn.OP.UN:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = isNaN(this.rpnstack[stptr]) ? 1.0 : 0.0;
					break;
				case RRDRpn.OP.ISINF:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = isInfinite(this.rpnstack[stptr]) ? 1.0 : 0.0;
					break;
				case RRDRpn.OP.SQRT:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = Math.sqrt(this.rpnstack[stptr]);
					break;
				case RRDRpn.OP.SORT:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					var spn = this.rpnstack[stptr--];
					if(stptr < spn - 1) throw RRDRpn.STACK_UNDERFLOW;	
					var array = this.rpnstack (stptr - spn + 1, stptr +1);
					array.sort(this.rpn_compare_double);
					for (var i=stptr - spn + 1, ii=0; i < (stptr +1) ; i++, ii++) 
						this.rpnstack[i] = array[ii];
					// qsort(this.rpnstack + stptr - spn + 1, spn, sizeof(double), rpn_compare_double);
					break;
				case RRDRpn.OP.REV:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					var spn = this.rpnstack[stptr--];
					if(stptr < spn - 1) throw RRDRpn.STACK_UNDERFLOW;
					var array = this.rpnstack (stptr - spn + 1, stptr +1);
					array.reverse();
					for (var i=stptr - spn + 1, ii=0; i < (stptr +1) ; i++, ii++) 
						this.rpnstack[i] = array[ii];
//					var p, q;
//					p = this.rpnstack + stptr - spn + 1;
//					q = this.rpnstack + stptr;
//					while (p < q) {
//						var x = q;
//						q-- = p;
//						p++ = x;
//					}
					break;
				case RRDRpn.OP.PREDICT:
				case RRDRpn.OP.PREDICTSIGMA:
					if(stptr < 2) throw RRDRpn.STACK_UNDERFLOW;
					var locstepsize = this.rpnstack[--stptr];
					var shifts = this.rpnstack[--stptr];
					if(stptr < shifts) throw RRDRpn.STACK_UNDERFLOW;
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
								val =this.rpnp[rpi - 1].data[-dscount * offset];
								if (! isNaN(val)) {
									sum+=val;
									sum2+=val*val;
									count++;
								}
							}
						}
					}
					val=Number.NaN;
					if (this.rpnp[rpi].op == RRDRpn.OP.PREDICT) {
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
				case RRDRpn.OP.TREND:
				case RRDRpn.OP.TRENDNAN:
					if(stptr < 1) throw RRDRpn.STACK_UNDERFLOW;
					if ((rpi < 2) || (this.rpnp[rpi - 2].op != RRDRpn.OP.VARIABLE)) {
						throw "malformed trend arguments";
					} else {
						var dur = this.rpnstack[stptr];
						var step = this.rpnp[rpi - 2].step;

						if (output_idx > Math.ceil(dur / step)) {
							var ignorenan = (this.rpnp[rpi].op == RRDRpn.OP.TREND);
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
				case RRDRpn.OP.AVG:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					var i = this.rpnstack[stptr--];
					var sum = 0;
					var count = 0;

					if(stptr < i - 1) throw RRDRpn.STACK_UNDERFLOW;
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
				case RRDRpn.OP.ABS:
					if(stptr < 0) throw RRDRpn.STACK_UNDERFLOW;
					this.rpnstack[stptr] = fabs(this.rpnstack[stptr]);
					break;
				case RRDRpn.OP.END:
					break;
			}
		}
		if (stptr != 0) throw "RPN final stack size != 1";
		output[output_idx] = this.rpnstack[0];
		return 0;
	}
}

var RRDGraphDesc = function() { 
	this.init.apply(this, arguments);
};

RRDGraphDesc.GF = {PRINT: 0, GPRINT: 1, COMMENT: 2, HRULE: 3, VRULE: 4, LINE: 5, AREA:6, STACK:7, TICK:8, TEXTALIGN:9, DEF:10, CDEF:11, VDEF:12, SHIFT: 13, XPORT: 14 };

RRDGraphDesc.VDEF = {MAXIMUM: 0, MINIMUM: 1, AVERAGE: 2, STDEV: 3, PERCENT: 4, TOTAL: 5, FIRST: 6, LAST: 7, LSLSLOPE: 8, LSLINT: 9, LSLCORREL: 10, PERCENTNAN: 11 };

RRDGraphDesc.CF = {AVERAGE: 0, MINIMUM: 1, MAXIMUM: 2, LAST: 3, HWPREDICT: 4, SEASONAL: 5, DEVPREDICT: 6, DEVSEASONAL: 7, FAILURES: 8, MHWPREDICT:9 };
RRDGraphDesc.TXA = {LEFT: 0, RIGHT: 1, CENTER: 2, JUSTIFIED: 3};

RRDGraphDesc.prototype = {

	gf: null,      /* graphing function */
	stack: false,    /* boolean */
	debug: false,    /* boolean */
	vname: null,     /* name of the variable */
 	vidx: Number.NaN,     /* gdes reference */
	rrd: null,    /* name of the rrd_file containing data */
	ds_nam: null,  /* data source name */
	ds: -1,       /* data source number */
	cf: null,      /* consolidation function */
	cf_reduce: null,   /* consolidation function for reduce_data() */
	col: null, /* graph color */
	format: null,  /* format for PRINT AND GPRINT */
	legend: null,  /* legend */
	strftm: false,   /* should the VDEF legend be formated with strftime */
	leg_x: 0, /* location of legend */
	leg_y: 0,
	yrule: Number.NaN,    /* value for y rule line and for VDEF */
	xrule: 0,    /* time for x rule line and for VDEF */
	vf: null,       /* instruction for VDEF function */
	rpnp: null,     /* instructions for CDEF function */

  /* SHIFT implementation */
	shidx: 0,    /* gdes reference for offset (-1 --> constant) */
  shval: 0,    /* offset if shidx is -1 */
  shift: 0,    /* current shift applied */

 	/* description of data fetched for the graph element */
	start: 0,   /* timestaps for first and last data element */
	end: 0,
	start_orig: 0, /* timestaps for first and last data element */
	end_orig: 0,
	step: 0, /* time between samples */
	step_orig: 0,    /* time between samples */
	ds_cnt: 0,   /* how many data sources are there in the fetch */
	data_first: 0,   /* first pointer to this data */
	ds_namv: null,  /* name of datasources  in the fetch. */
	data: null,  /* the raw data drawn from the rrd */
	p_data: null,    /* processed data, xsize elments */
	linewidth: 0,    /* linewideth */

	/* dashed line stuff */
	dash: false,     /* boolean, draw dashed line? */
  p_dashes: null, /* pointer do dash array which keeps the lengths of dashes */
 	ndash: false,    /* number of dash segments */
	offset: 0,   /* dash offset along the line */

	txtalign: 0,   /* change default alignment strategy for text */

	init: function (graph) 
	{
		this.step = graph.step;
		this.step_orig = graph.step;
		this.start = graph.start;
    this.start_orig = graph.start;
		this.end = graph.end;
    this.end_orig = graph.end;
		this.cf = RRDGraphDesc.CF.AVERAGE;     
		this.cf_reduce = RRDGraphDesc.CF.AVERAGE;
		this.data = [];
		this.pdata = [];
		this.ds_namv = [];
	}
}

Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}  


var RRDGraph = function() { 
	this.init.apply(this, arguments);
};

RRDGraph.pad2 = function(number) { return (number < 10 ? '0' : '') + number };
RRDGraph.pad3 = function(number) { return (number < 10 ? '00' : number < 100 ? '0' : '') + number };
RRDGraph.lpad = function(str, padString, length) { while (str.length < length) str = padString + str; return str; };
RRDGraph.days = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
RRDGraph.fdays = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
RRDGraph.months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
RRDGraph.fmonths = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
RRDGraph.TMT = { SECOND: 0, MINUTE: 1, HOUR: 2, DAY: 3, WEEK: 4, MONTH: 5 , YEAR: 6 };

RRDGraph.prototype = {
	
	xlab: [ {minsec: 0, length: 0, gridtm: RRDGraph.TMT.SECOND, gridst: 30, mgridtm: RRDGraph.TMT.MINUTE, mgridst: 5, labtm: RRDGraph.TMT.MINUTE, labst: 5, precis: 0, stst: function (date) { return RRDGraph.pad2(date.getHours())+':'+RRDGraph.pad2(date.getMinutes()); }} ,
		{minsec: 2, length: 0, gridtm: RRDGraph.TMT.MINUTE, gridst: 1, mgridtm: RRDGraph.TMT.MINUTE, mgridst: 5, labtm: RRDGraph.TMT.MINUTE, labst: 5, precis: 0, stst: function (date) { return RRDGraph.pad2(date.getHours())+':'+RRDGraph.pad2(date.getMinutes()); }} ,
		{minsec: 5, length: 0, gridtm: RRDGraph.TMT.MINUTE, gridst: 2, mgridtm: RRDGraph.TMT.MINUTE, mgridst: 10, labtm: RRDGraph.TMT.MINUTE, labst: 10, precis: 0, stst: function (date) { return RRDGraph.pad2(date.getHours())+':'+RRDGraph.pad2(date.getMinutes()); }} ,
		{minsec: 10, length: 0, gridtm: RRDGraph.TMT.MINUTE, gridst: 5,mgridtm: RRDGraph.TMT.MINUTE, mgridst: 20, labtm: RRDGraph.TMT.MINUTE, labst: 20, precis: 0, stst: function (date) { return RRDGraph.pad2(date.getHours())+':'+RRDGraph.pad2(date.getMinutes()); }} ,
		{minsec: 30, length: 0, gridtm: RRDGraph.TMT.MINUTE, gridst: 10, mgridtm: RRDGraph.TMT.HOUR, mgridst: 1, labtm: RRDGraph.TMT.HOUR, labst: 1, precis: 0, stst: function (date) { return RRDGraph.pad2(date.getHours())+':'+RRDGraph.pad2(date.getMinutes()); }} ,
		{minsec: 60, length: 0, gridtm: RRDGraph.TMT.MINUTE, gridst: 30, mgridtm: RRDGraph.TMT.HOUR, mgridst: 2, labtm: RRDGraph.TMT.HOUR, labst: 2, precis: 0, stst: function (date) { return RRDGraph.pad2(date.getHours())+':'+RRDGraph.pad2(date.getMinutes()); }} ,
		{minsec: 60, length: 24 * 3600, gridtm: RRDGraph.TMT.MINUTE, gridst: 30, mgridtm: RRDGraph.TMT.HOUR, mgridst: 2, labtm: RRDGraph.TMT.HOUR, labst: 6, precis: 0, stst: function (date) { return RRDGraph.days[date.getDay()]+' '+RRDGraph.pad2(date.getHours())+':'+RRDGraph.pad2(date.getMinutes()); }},
		{minsec: 180, length: 0, gridtm: RRDGraph.TMT.HOUR, gridst: 1, mgridtm: RRDGraph.TMT.HOUR, mgridst: 6, labtm: RRDGraph.TMT.HOUR, labst: 6, precis: 0, stst: function (date) { return RRDGraph.pad2(date.getHours())+':'+RRDGraph.pad2(date.getMinutes());}} ,
		{minsec: 180, length: 24 * 3600, gridtm: RRDGraph.TMT.HOUR, gridst: 1, mgridtm: RRDGraph.TMT.HOUR, mgridst: 6, labtm: RRDGraph.TMT.HOUR, labst: 12, precis: 0, stst: function (date) { return RRDGraph.days[date.getDay()]+' '+RRDGraph.pad2(date.getHours())+':'+RRDGraph.pad2(date.getMinutes());}} ,
		{minsec: 600, length: 0, gridtm: RRDGraph.TMT.HOUR, gridst: 6, mgridtm: RRDGraph.TMT.DAY, mgridst: 1, labtm: RRDGraph.TMT.DAY, labst: 1, precis: 24 * 3600, stst: function (date) { return RRDGraph.days[date.getDay()];}},
		{minsec: 1200, length: 0, gridtm: RRDGraph.TMT.HOUR, gridst: 6, mgridtm: RRDGraph.TMT.DAY, mgridst: 1, labtm: RRDGraph.TMT.DAY, labst: 1, precis: 24 * 3600, stst: function (date) { return RRDGraph.pad2(date.getDate());}},
		{minsec: 1800, length: 0, gridtm: RRDGraph.TMT.HOUR, gridst: 12, mgridtm: RRDGraph.TMT.DAY, mgridst: 1, labtm: RRDGraph.TMT.DAY, labst: 2, precis: 24 * 3600, stst: function (date) { return RRDGraph.days[date.getDay()]+' '+RRDGraph.pad2(date.getDate());}} ,
		{minsec: 2400, length: 0, gridtm: RRDGraph.TMT.HOUR, gridst: 12, mgridtm: RRDGraph.TMT.DAY, mgridst: 1, labtm: RRDGraph.TMT.DAY, labst: 2, precis: 24 * 3600,stst: function (date) { return RRDGraph.days[date.getDay()];}} ,
		{minsec: 3600, length: 0, gridtm: RRDGraph.TMT.DAY, gridst: 1, mgridtm: RRDGraph.TMT.WEEK, mgridst: 1, labtm: RRDGraph.TMT.WEEK, labst: 1, precis: 7 * 24 * 3600, stst: function (date) { return 'Week '+RRDGraph.pad2(date.getWeek());}} ,
		{minsec: 3 * 3600, length: 0, gridtm: RRDGraph.TMT.WEEK, gridst: 1, mgridtm: RRDGraph.TMT.MONTH, mgridst: 1, labtm: RRDGraph.TMT.WEEK, labst: 2, precis: 7 * 24 * 3600, stst: function (date) { return 'Week '+RRDGraph.pad2(date.getWeek());}} ,
		{minsec: 6 * 3600, length: 0, gridtm: RRDGraph.TMT.MONTH, gridst: 1, mgridtm: RRDGraph.TMT.MONTH, mgridst: 1, labtm: RRDGraph.TMT.MONTH, labst: 1, precis: 30 * 24 * 3600, stst: function (date) { return RRDGraph.months[date.getMonth()];}} ,
		{minsec: 48 * 3600,length:  0, gridtm: RRDGraph.TMT.MONTH, gridst: 1, mgridtm: RRDGraph.TMT.MONTH, mgridst: 3, labtm: RRDGraph.TMT.MONTH, labst: 3, precis: 30 * 24 * 3600, stst: function (date) { return RRDGraph.months[date.getMonth()];}} ,
		{minsec: 315360, length: 0, gridtm: RRDGraph.TMT.MONTH, gridst: 3, mgridtm: RRDGraph.TMT.YEAR, mgridst: 1, labtm: RRDGraph.TMT.YEAR, labst: 1, precis: 365 * 24 * 3600,  stst: function (date) { return ''+date.getFullYear();}} ,
		{minsec: 10 * 24 * 3600 , length: 0, gridtm: RRDGraph.TMT.YEAR, gridst: 1, mgridtm: RRDGraph.TMT.YEAR, mgridst: 1, labtm: RRDGraph.TMT.YEAR, labst: 1, precis: 365 * 24 * 3600,  stst: function (date) { return ('' + date.getFullYear()).substr(2, 4);}} ,
		{minsec: -1, length: 0, gridtm: RRDGraph.TMT.MONTH, gridst: 0, mgridtm: RRDGraph.TMT.MONTH, mgridst: 0, labtm: RRDGraph.TMT.MONTH, labst: 0, precis: 0, stst: null }
	],

	ylab: [ {grid: 0.1, lfac: [1, 2, 5, 10] } ,
		{grid: 0.2, lfac: [1, 5, 10, 20] } ,
		{grid: 0.5, lfac: [1, 2, 4, 10] } ,
		{grid: 1.0, lfac: [1, 2, 5, 10] } ,
		{grid: 2.0, lfac: [1, 5, 10, 20] } ,
		{grid: 5.0, lfac: [1, 2, 4, 10] } ,
		{grid: 10.0, lfac: [1, 2, 5, 10] } ,
		{grid: 20.0, lfac: [1, 5, 10, 20] } ,
		{grid: 50.0, lfac: [1, 2, 4, 10] } ,
		{grid: 100.0, lfac: [1, 2, 5, 10] } ,
		{grid: 200.0, lfac: [1, 5, 10, 20] } ,
		{grid: 500.0, lfac: [1, 2, 4, 10] },
		{grid: 0.0, lfac: [0, 0, 0, 0] } 
	],
	si_symbol: [
		'a',                /* 10e-18 Atto */
		'f',                /* 10e-15 Femto */
		'p',                /* 10e-12 Pico */
		'n',                /* 10e-9  Nano */
		'u',                /* 10e-6  Micro */
		'm',                /* 10e-3  Milli */
		' ',                /* Base */
		'k',                /* 10e3   Kilo */
		'M',                /* 10e6   Mega */
		'G',                /* 10e9   Giga */
		'T',                /* 10e12  Tera */
		'P',                /* 10e15  Peta */
		'E'                /* 10e18  Exa */
	],
	si_symbcenter: 6,

	GRC: null,

	GFX_H: { LEFT: 1, RIGHT: 2, CENTER: 3 },
	GFX_V: { TOP: 1, BOTTOM: 2, CENTER: 3 },

	DEFAULT_FONT: 'DejaVu Sans Mono', //DejaVu Sans Mono ,Bitstream Vera Sans Mono,monospace,Courier',
// DEFAULT_FONT: 'DejaVuSansMono', //DejaVu Sans Mono ,Bitstream Vera Sans Mono,monospace,Courier',
// pt -> pt=px*72/96
	TEXT: null,	
	MGRIDWIDTH: 0.6,
	GRIDWIDTH: 0.4,
	
	YLEGEND_ANGLE: 90.0,
		
	LEGEND_POS: { NORTH: 0, WEST: 1, SOUTH: 2, EAST: 3 },
	LEGEND_DIR: { TOP_DOWN: 0, BOTTOM_UP: 1 },
		
	canvas: null,
	ctx: null,
	xsize: 400, /* graph area size in pixels */
	ysize: 100,
	ylegend: null, /* legend along the yaxis */
	title: '', /* title for graph */
	watermark: null, /* watermark for graph */
	draw_x_grid: true,  /* no x-grid at all */
	draw_y_grid: true,  /* no y-grid at all */
	draw_3d_border: 2, /* size of border in pixels, 0 for off */
	dynamic_labels: false,/* pick the label shape according to the line drawn */
	grid_dash_on: 1,
	grid_dash_off: 1,
	xlab_form: null,   /* format for the label on the xaxis */
	second_axis_scale: 0, /* relative to the first axis (0 to disable) */
	second_axis_shift: 0, /* how much is it shifted vs the first axis */
	second_axis_legend: null, /* label to put on the seond axis */
	second_axis_format: null, /* format for the numbers on the scond axis */
	ygridstep: Number.NaN,    /* user defined step for y grid */
	ylabfact: 0, /* every how many y grid shall a label be written ? */
	tabwidth: 40, /* tabwdith */
	start: 0,   /* what time does the graph cover */
	start_t: null, 
	end: 0,
	end_t: null,
	step: 0, /* any preference for the default step ? */
	setminval: Number.NaN, /* extreme values in the data */
	setmaxval: Number.NaN,
	minval: Number.NaN, /* extreme values in the data */
	maxval: Number.NaN,
	rigid: false,    /* do not expand range even with values outside */
	gridfit: true, /* adjust y-axis range etc so all grindlines falls in integer pixel values */
	lazy: 0,     /* only update the image if there is reasonable probablility that the existing one is out of date */
	slopemode: false,    /* connect the dots of the curve directly, not using a stair */
	legendposition: 0, /* the position of the legend: north, west, south or east */
	legenddirection: 0, /* The direction of the legend topdown or bottomup */
	logarithmic: false,  /* scale the yaxis logarithmic */
	force_scale_min: 0,  /* Force a scale--min */
	force_scale_max: 0,  /* Force a scale--max */
	/* status information */
	//with_markup: 0,
	xorigin: 0, /* where is (0,0) of the graph */
	yorigin: 0,
	xOriginTitle: 0, /* where is the origin of the title */
	yOriginTitle: 0,
	xOriginLegendY: 0, /* where is the origin of the y legend */
	yOriginLegendY: 0,
	xOriginLegendY2: 0, /* where is the origin of the second y legend */
	yOriginLegendY2: 0,
	xOriginLegend: 0, /* where is the origin of the legend */	
	yOriginLegend: 0,
	ximg: 0, /* total size of the image */
	yimg: 0,
	legendwidth: 0, /* the calculated height and width of the legend */
	legendheight: 0,
	zoom: 1,
	magfact: 0,  /* numerical magnitude */
	base: 1000,     /* 1000 or 1024 depending on what we graph */
	symbol: null,   /* magnitude symbol for y-axis */
	viewfactor: 1.0,  /* how should the numbers on the y-axis be scaled for viewing ? */
	unitsexponent: 9999,   /* 10*exponent for units on y-asis */
	unitslength: 6,  /* width of the yaxis labels */
	forceleftspace: false,   /* do not kill the space to the left of the y-axis if there is no grid */

	alt_ygrid: false, /* use alternative y grid algorithm */
	alt_autoscale: false, /* use alternative algorithm to find lower and upper bounds */
	alt_autoscale_min: false, /* use alternative algorithm to find lower bounds */
	alt_autoscale_max: false, /* use alternative algorithm to find upper bounds */
	no_legend: false, /* use no legend */
	no_minor: false, /* Turn off minor gridlines */
	only_graph: false, /* use only graph */
	force_rules_legend: false, /* force printing of HRULE and VRULE legend */
	force_units: false,   /* mask for all FORCE_UNITS_* flags */
	force_unit_si: false, /* force use of SI units in Y axis (no effect in linear graph, SI instead of E in log graph) */
	full_size_mode: false, /* -width and -height indicate the total size of the image */
	no_rrdtool_tag: false, /* disable the rrdtool tag */

	xlab_user: null,
	ygrid_scale:  null,

	gdes: null,

	ytr_pixie: 0,
	xtr_pixie: 0,	

	rrdfiles: null,

	init: function (canvasId) 
	{
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext('2d');

		this.AlmostEqualBuffer = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT*2);
		this.AlmostEqualInt = new Int32Array(this.AlmostEqualBuffer);
		this.AlmostEqualFloat = new Float32Array(this.AlmostEqualBuffer);

		this.legenddirection = this.LEGEND_DIR.TOP_DOWN;		
		this.legendposition = this.LEGEND_POS.SOUTH;
		this.gdes = [];
		this.rrdfiles = {};
		this.TEXT = {	DEFAULT: { size: 11, font: this.DEFAULT_FONT },
									TITLE: { size: 12, font: this.DEFAULT_FONT },
									AXIS: { size: 10, font: this.DEFAULT_FONT },
									UNIT: { size: 11, font: this.DEFAULT_FONT },
									LEGEND: { size: 11, font: this.DEFAULT_FONT },
									WATERMARK: { size: 8, font: this.DEFAULT_FONT } };
		this.GRC = { 	CANVAS: 'rgba(255, 255, 255, 1.0)',
									BACK: 'rgba(242,242, 242, 1.0)',
									SHADEA: 'rgba(207, 207, 207, 1.0)',
									SHADEB: 'rgba(158, 158, 158, 1.0)',
									GRID: 'rgba(143, 143, 143, 0.75)',
									MGRID: 'rgba(222, 79, 79, 0.60)',
									FONT: 'rgba(0, 0, 0, 1.0)',
									ARROW: 'rgba(127, 31, 31, 1.0)',
									AXIS: 'rgba(31, 31, 31, 1.0)',
									FRAME: 'rgba(0, 0, 0, 1.0)' };

		
		this.start_t = new RRDTime("end-24h");
		this.end_t = new RRDTime("now");
	},
	set_default_font: function (name)
	{
		for (var font in this.TEXT) 
			this.TEXT[font].font = name;
	},
	set_option: function(option, value)
	{	
		switch(option) {
			case 'alt-autoscale':
			case 'A':
				this.alt_autoscale = true;
				break;
			case 'base':
			case 'b':
				this.base = parseInt(value);
				if (this.base !== 1000 && this.base !== 1024)
					throw 'the only sensible value for base apart from 1000 is 1024';
				break;
			case 'color':		
			case 'c':	
				var index = value.indexOf('#');
				if (index === -1) 
					throw "invalid color def format";
				var name = value.substr(0,index);
				if (!this.GRC[name])
					throw "invalid color name '"+name+"'"
				this.GRC[name] = value.substr(index); // FIXME check color
				break;
			case 'full-size-mode':
			case 'D':
				this.full_size_mode = true;
				break;
			case 'slope-mode':
			case 'E':
				this.slopemode = true;
				break;
			case 'end':
			case 'e':
				this.end_t = new RRDTime(value);
//				this.end = parseInt(value);
				break;
			case 'force-rules-legend':
			case 'F':
				this.force_rules_legend = true;
				break;
			case 'imginfo':
			case 'f':
				// im->imginfo = optarg;
				break;
			case 'graph-render-mode':
			case 'G':
			 // im->graph_antialias
				break;
			case 'no-legend':	
			case 'g':
				this.no_legend = true;
				break;
			case 'height':
			case 'h':
				this.ysize = parseInt(value);
				break;
			case 'no-minor':
			case 'I':
				this.no_minor = false;
				break;
			case 'interlaced':	
			case 'i':
				break;
			case 'alt-autoscale-min':
			case 'J':
				this.alt_autoscale_min = true;
				break;
			case 'only-graph':	
			case 'j':
				this.only_graph = true;
				break;
			case 'units-length':
			case 'L':
				this.unitslength = parseInt(value);
				this.forceleftspace = true;
				break;
			case 'lower-limit':
			case 'l':
				this.setminval = parseFloat(value)
				break;
			case 'alt-autoscale-max':	
			case 'M':
				this.alt_autoscale_max = true;
				break;
			case 'zoom':		
			case 'm':
				this.zoom = parseFloat(value);
				if (this.zoom <= 0.0) 
					throw "zoom factor must be > 0";
				break;
			case 'no-gridfit':
			case 'N':
				this.gridfit = true;
				break;
			case 'font':
			case 'n':
				var args = value.split(':');
				if (args.length !== 3) 
					throw "invalid text property format";
				if (!this.TEXT[args[0]])
					throw "invalid fonttag '"+args[0]+"'"
				if (args[1] > 0) 
					this.TEXT[args[0]].size = args[1];
				if (args[2])
					this.TEXT[args[0]].font = args[2];
				break;
			case 'logarithmic':	
			case 'o':
				this.logarithmic = true;
				break;
			case 'pango-markup':	
			case 'P':
				// im->with_markup = 1;
				break;
			case 'font-render-mode':
			case 'R':
				// im->font_options: normal light mono
				break;
			case 'rigid':
			case 'r':
				this.rigid = true;
				break;
			case 'step':
				this.step = parseInt(value);
				break;
			case 'start':
			case 's':
				this.start_t = new RRDTime(value);
				//this.start = parseInt(value);
				break;
			case 'tabwidth':
			case 'T':
				this.tabwidth = parseFloat(value);
				break;
			case 'title':	
			case 't':
				this.title = value;
				break;
			case 'upper-limit':
			case 'u':
				this.setmaxval = parseFloat(value);
				break;
			case 'vertical-label':
			case 'v':
				this.ylegend = value;
				break;
			case 'watermark':
			case 'W':
				this.watermark = value;
				break;
			case 'width':	
			case 'w':
				this.xsize = parseInt(value);
				if (this.xsize < 10) 	
					throw "width below 10 pixels";
				break;
			case 'units-exponent':
			case 'X':
				this.unitsexponent = parseInt(value);
				break;
			case 'x-grid':
			case 'x':
				if (value === 'none')  { 
					this.draw_x_grid = false;
				} else {
					var args = value.split(':');
					if (args.length !== 8) 
						throw "invalid x-grid format";
					this.xlab_user.gridtm = this.tmt_conv(args[0]);
					if (this.xlab_user.gridtm < 0)
						throw "unknown keyword "+args[0];
					this.xlab_user.gridst = parseInt(args[1]);
					this.xlab_user.mgridtm = this.tmt_conv(args[2]);
					if (this.xlab_user.mgridtm < 2)
						throw "unknown keyword "+args[2];
					this.xlab_user.mgridst = parseInt(args[3]);
					this.xlab_user.labtm = this.tmt_conv(args[4]);
					if (this.xlab_user.labtm < 0)
						throw "unknown keyword "+args[4];
					this.xlab_user.labst = parseInt(args[5]);
					this.xlab_user.precis = parseInt(args[6]);
					this.xlab_user.minsec = 1;
					this.xlab_form = args[7]; // FIXME : ? join(:)
					this.xlab_user.stst = this.xlab_form;
				}
				break;
			case 'alt-y-grid':
			case 'Y':
				this.alt_y_grid = true;
				break;
			case 'y-grid':	
			case 'y':
				if (value === 'none')  { 
					this.draw_y_grid = false;
				} else {
					var index = value.indexOf(':');
					if (index === -1) 
						throw "invalid y-grid format";
					this.ygridstep = parseFloat(value.substr(0,index));
					if (this.ygridstep <= 0) 
						throw "grid step must be > 0";
					this.ylabfact = parseInt(value.substr(index+1));
					if (this.ylabfact < 1)
						throw "label factor must be > 0";
				}
				break;
			case 'lazy':
			case 'z':
				this.lazy = 1;
				break;
			case 'units':
				if (this.force_units) 
					throw "--units can only be used once!";
				if (value === 'si')
					this.force_units_si = true;
				else
					throw "invalid argument for --units: "+value;
				break;
			case 'alt-y-mrtg':
				break;
			case 'disable-rrdtool-tag':	
				this.no_rrdtool_tag = true;
				break;
			case 'right-axis':
				var index = value.indexOf(':');
				if (index === -1) 
					throw "invalid right-axis format expected scale:shift";
				this.second_axis_scale = parseFloat(value.substr(0,index));
				if(this.second_axis_scale === 0)
					throw "the second_axis_scale  must not be 0";
				this.second_axis_shift = parseFloat(value.substr(index+1));
				break;
			case 'right-axis-label':
				this.second_axis_legend = value;
				break;
			case 'right-axis-format':
				this.second_axis_format = value;
				break;
			case 'legend-position':
				if (value === "north") {
					this.legendposition = this.LEGEND_POS.NORTH;
				} else if (value === "west") {
					this.legendposition = this.LEGEND_POS.WEST;
				} else if (value === "south") {
					this.legendposition = this.LEGEND_POS.SOUTH;
				} else if (value === "east") {
					this.legendposition = this.LEGEND_POS.EAST;
				} else {
					throw "unknown legend-position '"+value+"'";
				}
				break;
			case 'legend-direction':
				if (value === "topdown") {
					this.legenddirection = this.LEGEND_DIR.TOP_DOWN;
				} else if (value === "bottomup") {
					this.legenddirection = this.LEGEND_DIR.BOTTOM_UP;
				} else {
					throw "unknown legend-position '"+value+"'";
				}
				break;
			case 'border':
				this.draw_3d_border = parseInt(value);
				break;
			case 'grid-dash':
				var index = value.indexOf(':');
				if (index === -1) 
					throw "expected grid-dash format float:float";
				this.grid_dash_on = parseFloat(value.substr(0,index));
				this.grid_dash_off = parseFloat(value.substr(index+1));
				break;
			case 'dynamic-labels':
				this.dynamic_labels = true;
				break;
			default:
				throw 'Unknow option "'+option+'"';
		}

	},
	parse_color: function(str) 
	{
		var bits;
		if ((bits = /^#?([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/.exec(str))) {
			return [parseInt(bits[1]+bits[1], 16), parseInt(bits[2]+bits[2], 16), parseInt(bits[3]+bits[3], 16), 1.0];
		} else if ((bits = /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.exec(str))) {
			return [parseInt(bits[1], 16), parseInt(bits[2], 16), parseInt(bits[3], 16), 1.0];
		} else if ((bits = /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.exec(str))) {
			return [parseInt(bits[1], 16), parseInt(bits[2], 16), parseInt(bits[3], 16), parseInt(bits[4], 16)/255];
		} else if ((bits = /^rgb\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\)$/.exec(str))) {
			return [parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3]), 1.0];
		} else if ((bits = /^rgba\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([0-9.]+)\)$/.exec(str))) {
			return [parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3]), parseFloat(bits[4])];
		} else {
			throw "Unknow color format '"+str+"'";
		}
	},
	color2rgba: function (color)
	{
		return 'rgba('+color[0]+','+color[1]+','+color[2]+','+color[3]+')';
	},
	cmdline: function(line) // FIXME
	{
		var i = 0;
		line = line.replace(/\n/g," ");
		var lines = line.match(/[^" ]+|"[^"]+"/g);
		var len = lines.length;

		while (i < len) {
			var arg = lines[i];
			if (arg.charAt(0) === '"' && arg.charAt(arg.length-1) === '"') 
				arg = arg.substr(1,arg.length-2);
			if (/^LINE[0-9.]+:/.test(arg)) {
				this.parse_line(arg);
			} else if (/^AREA:/.test(arg)) {
				this.parse_area(arg);
			} else if (/^DEF:/.test(arg)) {
				this.parse_def(arg);
			} else if (/^CDEF:/.test(arg)) {
				this.parse_cdef(arg);
			} else if (/^VDEF:/.test(arg)) {
				this.parse_vdef(arg);
			} else if (/^GPRINT:/.test(arg)) {
				this.parse_gprint(arg);
			} else if (/^COMMENT:/.test(arg)) {
				this.parse_comment(arg);
			} else if (/^VRULE:/.test(arg)) {
				this.parse_vrule(arg);
			} else if (/^HRULE:/.test(arg)) {
				this.parse_hrule(arg);
			} else if (/^TICK:/.test(arg)) {
				this.parse_tick(arg);
			} else if (/^TEXTALIGN:/.test(arg)) {
				this.parse_textaling(arg);
			} else if (/^SHIFT:/.test(arg)) {
				this.parse_shift(arg);
      } else if (arg.charAt(0) === '-') {
				var strip = 1;
				if (arg.length > 1 && arg.charAt(1) === '-') {
					strip = 2;	
				}
				var option = arg.substr(strip);
				var value = undefined;
				
				if (option.indexOf('=') !== -1) {
					var index = option.indexOf('=');
					value = option.substr(index+1);
					option = option.substr(0,index);
				} else if (i+1 < len) {
					if (lines[i+1].charAt(0) !== '-' &&
							!/^"?LINE[0-9.]+:/.test(lines[i+1]) &&
							!/^"?AREA:/.test(lines[i+1]) &&
							!/^"?DEF:/.test(lines[i+1]) &&
							!/^"?CDEF:/.test(lines[i+1]) &&
							!/^"?VDEF:/.test(lines[i+1]) &&
							!/^"?GPRINT:/.test(lines[i+1]) &&
							!/^"?COMMENT:/.test(lines[i+1]) &&
							!/^"?HRULE:/.test(lines[i+1]) &&
							!/^"?VRULE:/.test(lines[i+1]) &&
							!/^"?TICK:/.test(lines[i+1]) &&
							!/^"?TEXTALING:/.test(lines[i+1]) &&
							!/^"?SHIFT:/.test(lines[i+1]) 
							) {
						i++;
						if (lines[i].charAt(0) === '"' && lines[i].charAt(lines[i].length-1) === '"') 
							value = lines[i].substr(1,lines[i].length-2);	
						else  
							value = lines[i];
					}
				}
				this.set_option(option, value);
			} else {
				throw "Unknow argument: "+arg;
			}
			i++;
		}
		var start_end = RRDTime.proc_start_end(this.start_t, this.end_t); // FIXME here?
		this.start = start_end[0];
		this.end = start_end[1];
	},
	sprintf: function()
	{		
		var argc = 0;
		var args = arguments;
		var fmt = args[argc++];
		
		function format (match, width, dot, precision, length, conversion)
		{
			if (match === '%%') return '%';		
	
			var value = args[argc++];
			var prefix;

			if (width === undefined) 
				width = 0;
			else 
				width = +width;
			
			if (precision === undefined)
				precision = conversion == 'd' ? 0 : 6;
			else 
				precision = +precision;
	
			switch (conversion) {
				case 's':
				case 'c':
					return value;
					break;
				case 'd':
					return parseInt(value, 10);
					break;
				case 'e':
					prefix = value < 0 ? '-' : '';
					return RRDGraph.lpad(prefix+Math.abs(value).toExponential(precision),' ',width);
					break;
				case 'f':
					prefix = value < 0 ? '-' : '';
					return RRDGraph.lpad(prefix+Math.abs(value).toFixed(precision),' ',width);
					break;
				case 'g':
					prefix = value < 0 ? '-' : '';
					return RRDGraph.lpad(prefix+Math.abs(value).toPrecision(precision),' ',width);
					break;
				default:
					return match;
			}

		};
		return fmt.replace(/%(\d+)?(\.(\d+))?(l?)([%scdfeg])/g,format);
	},
	strftime: function (ftm, time)
	{
		var d = new Date(time*1000);
		
		function format(match, opt) 
		{
			if (match === '%%') return '%';		

			switch (opt) {
				case 'a':
					return RRDGraph.days[d.getDay()];
					break;
				case 'A':
					return RRDGraph.fdays[d.getDay()];
					break;
				case 'b':
					return RRDGraph.months[d.getMonth()];
					break;
				case 'B':
					return RRDGraph.fmonths[d.getMonth()];
					break;
				case 'c':
					return d.toLocaleString();
					break;
				case 'd':
					return RRDGraph.pad2(d.getDate());	
					break;
				case 'H':
					return RRDGraph.pad2(d.getHours());	
					break;
				case 'I':	
					var hours = d.getHours()%12;
					return RRDGraph.pad2(hours === 0 ? 12 : hours);
					break;
				case 'j':
					var d01 = new Date (date.getFullYear(), 0, 1);
					return RRDGraph.pad3(Math.ceil((d01.getTime()-d.getTime())/86400000));
					break;
				case 'm':	
					return RRDGraph.pad2(d.getMonth());
					break;
				case 'M':
					return RRDGraph.pad2(d.getMinutes());
					break;
				case 'p':
					return d.getHours() >= 12 ? 'PM' : 'AM';
					break;
				case 's':
					return RRDGraph.pad2(d.getSeconds());
					break;
				case 'S':
					return d.getTime()/1000;
					break;
//%U The week number of the current year as a decimal number, range 00 to 53, starting with the first Sunday as the first day of week 01. See also %V and %W.
				case 'U':
					var d01 = new Date(this.getFullYear(),0,1);
					return RRDGraph.pad2(Math.ceil((((d.getTime() - d01.getTime()) / 86400000) + d01.getDay()+1)/7)); // FIXME weeks
					break;
//%V The ISO 8601:1988 week number of the current year as a decimal number, range 01 to 53, where week 1 is the first week that has at least 4 days in the current year, and with Monday as the first day of the week. See also %U and %W.
				case 'V':
					var d01 = new Date(this.getFullYear(),0,1); // FIXME weeks
					break;
//%W The week number of the current year as a decimal number, range 00 to 53, starting with the first Monday as the first day of week 01.
				case 'w':
					return d.getDay();
					break;
				case 'W': // FIXME weeks
					break;
				case 'x':
					return RRDGraph.pad2(d.getDate())+'/'+RRDGraph.pad2(d.getMonth())+'/'+d.getFullYear()
					break;
				case 'X':
					return RRDGraph.pad2(d.getHours())+':'+RRDGraph.pad2(d.getMinutes())+':'+RRDGraph.pad2(d.getSeconds());
					break;
				case 'y':	
					return RRDGraph.pad2(d.getFullYear()%100);
					break;
				case 'Y':
					return d.getFullYear();
					break;
				case 'Z':
					return d.toString().replace(/^.*\(([^)]+)\)$/, '$1');
					break;
				default:
					return match;
			}
		};
		return fmt.replace(/%([aAbBcdHIjmMpsSUVwWxXyYZ%])/g, format);
	},
	gfx_line: function (X0, Y0, X1, Y1, width, color)
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
	gfx_dashed_line: function (X0, Y0, X1, Y1, width, color, dash_on, dash_off)
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
	gfx_new_area: function (X0, Y0, X1, Y1, X2, Y2, color)
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
	gfx_add_point: function (x, y)
	{
		this.ctx.lineTo(x, y);
	},
	gfx_close_path: function ()
	{
		this.ctx.closePath();
		this.ctx.fill();
	},
	gfx_text: function (x, y, color, font, tabwidth, angle, h_align, v_align, text)
	{
		x = Math.round(x);
		y = Math.round(y);

		this.ctx.save();
		this.ctx.font = font.size+'px '+"'"+font.font+"'";

		switch (h_align) {
			case this.GFX_H.LEFT:
				this.ctx.textAlign = 'left';
				break;
			case this.GFX_H.RIGHT:
				this.ctx.textAlign = 'right';
				break;
			case this.GFX_H.CENTER:
				this.ctx.textAlign = 'center';
				break;
		}

		switch (v_align) {
			case this.GFX_V.TOP:
				this.ctx.textBaseline = 'top';
				break;
			case this.GFX_V.BOTTOM:
				this.ctx.textBaseline = 'bottom';
				break;
			case this.GFX_V.CENTER:
				this.ctx.textBaseline = 'middle';
				break;
		}

		this.ctx.fillStyle = color;
		this.ctx.translate(x,y);
		this.ctx.rotate(-angle*Math.PI/180.0);	
		this.ctx.fillText(text, 0, 0);
		this.ctx.restore();
	},
	gfx_get_text_width: function( start, font, tabwidth, text)
	{
		this.ctx.save();
		this.ctx.font = font.size+"px "+font.font;
		var width = this.ctx.measureText(text);
		this.ctx.restore();
		return width.width;
	},
	xtr: function (mytime) 
	{
		if (mytime === 0) {
			this.xtr_pixie = this.xsize / (this.end - this.start);
			return this.xorigin;
		}
		return this.xorigin + this.xtr_pixie * (mytime - this.start);
	},
	ytr: function (value) 
	{
		var yval;

		if (isNaN(value)) {
			if (!this.logarithmic)
				this.ytr_pixie = this.ysize / (this.maxval - this.minval);
			else
				this.ytr_pixie = this.ysize / ((Math.log(this.maxval)/Math.LN10) - (Math.log(this.minval)/Math.LN10));
			yval = this.yorigin;
		} else if (!this.logarithmic) {
			yval = this.yorigin - this.ytr_pixie * (value - this.minval);
		} else {
			if (value < this.minval) {
				yval = this.yorigin;
			} else {
				yval = this.yorigin - this.ytr_pixie * ((Math.log(value)/Math.LN10) - (Math.log(this.minval)/Math.LN10));
			}
		}
		return yval;
	},
	// http://stackoverflow.com/questions/3077718/converting-a-decimal-value-to-a-32bit-floating-point-hexadecimal
	floatToIntBits: function (f) 
	{
		var NAN_BITS = 0|0x7FC00000;
		var INF_BITS = 0|0x7F800000;
		var ZERO_BITS = 0|0x00000000;
		var SIGN_MASK = 0|0x80000000;
		var EXP_MASK = 0|0x7F800000;
		var MANT_MASK = 0|0x007FFFFF;
		var MANT_MAX = Math.pow(2.0, 23) - 1.0;

		if (f != f)
			return NAN_BITS;
		var hasSign = f < 0.0 || (f == 0.0 && 1.0 / f < 0);
		var signBits = hasSign ? SIGN_MASK : 0;
		var fabs = Math.abs(f);

		if (fabs == Number.POSITIVE_INFINITY)
			return signBits | INF_BITS;

		var exp = 0, x = fabs;
		while (x >= 2.0 && exp <= 127) {
			exp++;
			x /= 2.0;
		}
		while (x < 1.0 && exp >= -126) {
			exp--;
			x *= 2.0;
		}
    if (!(x * Math.pow(2.0, exp) == fabs)) throw "floatToIntBits: error fabs.";
		var biasedExp = exp + 127;
    if (!(0 <= biasedExp && biasedExp <= 254)) throw "floatToIntBits: error biasedExp "+biasedExp;

		if (biasedExp == 255)
			return signBit | INF_BITS;
		if (biasedExp == 0) {
			if (!(0.0 <= x && x < 2.0)) throw "floatToIntBits: x in [0.0, 1.0) "+x;
			var mantissa = x * Math.pow(2.0, 23) / 2.0;
		} else {
			if (!(1.0 <= x && x < 2.0)) throw "floatToIntBits: x in [0.5; 1.0) "+x;
			var mantissa = x * Math.pow(2.0, 23) - Math.pow(2.0, 23);
    }
		var mantissaBits = mantissa & MANT_MASK;
		if (!(0.0 <= mantissaBits && mantissaBits <= MANT_MAX)) throw "floatToIntBits: mantissa in [0.0, 2^23) "+mantissa+" MANT_MAX "+MANT_MAX+" "+(mantissa & MANT_MASK);

		//console.log("number", f, "x", x, "biasedExp", biasedExp, "mantissa", mantissa.toString(16));
		var expBits = (biasedExp << 23) & EXP_MASK;

    //console.log("number", f, "sign", signBits.toString(16), "expBits", expBits.toString(16), "mantissaBits", mantissaBits.toString(16));
		return signBits | expBits | mantissaBits;
	},
/*
	AlmostEqual2sComplement: function(A, B, maxUlps)
	{
		var aInt = this.floatToIntBits(A);
		if (aInt < 0) aInt = 0x80000000 - aInt;
                                                                                    
		var bInt = this.floatToIntBits(B);
		if (bInt < 0) bInt = 0x80000000 - bInt;
                                                                                    
		var intDiff = Math.abs(aInt - bInt);

		if (intDiff <= maxUlps) 
			return true;

		return false; 
	},
*/
	AlmostEqual2sComplement: function(A, B, maxUlps)
	{

		this.AlmostEqualFloat[0] = A;
		this.AlmostEqualFloat[1] = B;

		var aInt = this.AlmostEqualInt[0];
		if (aInt < 0) aInt = 0x80000000 - aInt;
                                                                                    
		var bInt = this.AlmostEqualInt[1];
		if (bInt < 0) bInt = 0x80000000 - bInt;
                                                                                    
		var intDiff = Math.abs(aInt - bInt);

		if (intDiff <= maxUlps) 
			return true;

		return false; 
	},
/*
//AlmostEqualRelative
//AlmostEqualRelativeOrAbsolute
	AlmostEqual2sComplement: function(A, B, error) // FIXME may not work, maxUpls???
	{
		error = 0.00001

		if (A == B)
			return true;

		var relerror;
  	if (Math.abs(B) > Math.abs(A)) 
			relerror = Math.abs((A - B) / B);
		else 
			relerror = Math.abs((A - B) / A);

		if (relerror <= error)
			return true;
//console.log("AlmostEqual2sComplement("+A+","+B+"): Math.abs(A - B):"+(Math.abs(A - B))+" < "+maxUlps+" relativeError: "+error);
		return false;
	},
*/
	tmt2str: function (val)
	{
		switch (val) {
			case RRDGraph.TMT.SECOND: return 'sec';
			case RRDGraph.TMT.MINUTE: return 'min';
			case RRDGraph.TMT.HOUR: return 'hour';
			case RRDGraph.TMT.DAY: return 'day';
			case RRDGraph.TMT.WEEK: return 'week';
			case RRDGraph.TMT.MONTH: return 'mon';
			case RRDGraph.TMT.YEAR: return 'year';
		}
		return val;
	},
	find_first_time: function(start, baseint, basestep) 
	{
		var date = new Date(start*1000);
		
		switch (baseint) {
			case RRDGraph.TMT.SECOND:
				var sec = date.getSeconds();
				sec -= sec % basestep;
				date.setSeconds(sec);
				break;
			case RRDGraph.TMT.MINUTE:
				date.setSeconds(0);
				var min = date.getMinutes();
				min -= min % basestep;
				date.setMinutes(min);
				break;
			case RRDGraph.TMT.HOUR:
				date.setSeconds(0);
				date.setMinutes(0);
				var hour = date.getHours();
				hour -= hour % basestep;
				date.setHours(hour);
				break;
			case RRDGraph.TMT.DAY:
				date.setSeconds(0);
				date.setMinutes(0);
				date.setHours(0);
				break;
			case RRDGraph.TMT.WEEK:
				date.setSeconds(0);
				date.setMinutes(0);
				date.setHours(0);
				var mday = date.getDate();
				var wday = date.getDay();
				mday -= wday - 1; // FIXME find_first_weekday
				if (wday === 0) mday -= 7;// FIXME find_first_weekday
				date.setDate(mday);
				break;
			case RRDGraph.TMT.MONTH:
				date.setSeconds(0);
				date.setMinutes(0);
				date.setHours(0);
				date.setDate(1);
				var mon = date.getMonth();
				mon -= mon % basestep;	
				date.setMonth(mon);
				break;
			case RRDGraph.TMT.YEAR:
				date.setSeconds(0);
				date.setMinutes(0);
				date.setHours(0);
				date.setDate(1);
				date.setMonth(0);
				var year = date.getFullYear()-1900;
				year -= (year + 1900) %basestep;
				date.setFullYear(year+1900);
    	}
		return Math.round(date.getTime()/1000.0);
	},
	find_next_time: function(current, baseint, basestep) 
	{
		var date = new Date(current*1000);
		var limit = 2;
		var madetime;

		switch (baseint) {
			case RRDGraph.TMT.SECOND: limit = 7200; break;
			case RRDGraph.TMT.MINUTE: limit = 120; break;
			case RRDGraph.TMT.HOUR: limit = 2; break;
			default: limit = 2; break;
		}

		do {
			switch (baseint) {
				case RRDGraph.TMT.SECOND:
					date.setSeconds(date.getSeconds()+basestep);
					break;
				case RRDGraph.TMT.MINUTE:
					date.setMinutes(date.getMinutes()+basestep);
					break;
				case RRDGraph.TMT.HOUR:
					date.setHours(date.getHours()+basestep);
					break;
				case RRDGraph.TMT.DAY:
					date.setDate(date.getDate()+basestep);
					break;
				case RRDGraph.TMT.WEEK:
					date.setDate(date.getDate()+7*basestep);
					break;
				case RRDGraph.TMT.MONTH:
					date.setMonth(date.getMonth()+basestep);
					break;
				case RRDGraph.TMT.YEAR:
					date.setFullYear(date.getFullYear()+basestep);
					break;
			}
			madetime = Math.round(date.getTime()/1000.0);
		} while (madetime === -1 && limit-- >= 0);   /* this is necessary to skip impossible times like the daylight saving time skips */ // FIXME ??
		return madetime;
	},
	print_calc: function()
	{
		var validsteps;
		var printval;
		var tmvdef;
		var graphelement = 0;
		var max_ii;
		var magfact = -1;
		var si_symb = "";
		var percent_s;
		var prline_cnt = 0;

		var now = Math.round((new Date()).getTime() / 1000);

		for (var i = 0, gdes_c = this.gdes.length; i < gdes_c; i++) {
			var vidx = this.gdes[i].vidx;
			switch (this.gdes[i].gf) {
				case RRDGraphDesc.GF.PRINT:
				case RRDGraphDesc.GF.GPRINT:
					if (this.gdes[vidx].gf === RRDGraphDesc.CF.VDEF) { /* simply use vals */
						printval = this.gdes[vidx].vf.val;
						tmvdef = this.gdes[vidx].vf.when;
						// localtime_r(&this.gdes[vidx].vf.when, &tmvdef); // FIXME ?
					} else {    /* need to calculate max,min,avg etcetera */
						max_ii = ((this.gdes[vidx].end - this.gdes[vidx].start) / this.gdes[vidx].step * this.gdes[vidx].ds_cnt);
						printval = Number.NaN;
						validsteps = 0;

						for (var ii = this.gdes[vidx].ds; ii < max_ii; ii += this.gdes[vidx].ds_cnt) {
							if (!isFinite(this.gdes[vidx].data[ii])) continue;
							if (isNaN(printval)) {
								printval = this.gdes[vidx].data[ii];
								validsteps++;
								continue;
							}
							switch (this.gdes[i].cf) {
								case RRDGraphDesc.CF.HWPREDICT:
								case RRDGraphDesc.CF.MHWPREDICT:
								case RRDGraphDesc.CF.DEVPREDICT:
								case RRDGraphDesc.CF.DEVSEASONAL:
								case RRDGraphDesc.CF.SEASONAL:
								case RRDGraphDesc.CF.AVERAGE:
							    validsteps++;
									printval += this.gdes[vidx].data[ii];
									break;
								case RRDGraphDesc.CF.MINIMUM:
									printval = Math.min(printval, this.gdes[vidx].data[ii]);
									break;
								case RRDGraphDesc.CF.FAILURES:
								case RRDGraphDesc.CF.MAXIMUM:
									printval = Math.max(printval, this.gdes[vidx].data[ii]);
									break;
								case RRDGraphDesc.CF.LAST:
									printval = this.gdes[vidx].data[ii];
							}
						}
						if (this.gdes[i].cf === RRDGraphDesc.CF.AVERAGE || this.gdes[i].cf > RRDGraphDesc.CF.LAST) {
							if (validsteps > 1) printval = (printval / validsteps);
						}
					}           /* prepare printval */

          if (!this.gdes[i].strftm && (percent_s = this.gdes[i].format.indexOf('%S')) != -1) {
						if (magfact < 0.0) {
							//[printval, si_symb, magfact] = this.auto_scale(printval, si_symb, magfact);
							var dummy = this.auto_scale(printval, si_symb, magfact); printval = dummy[0]; si_symb = dummy[1]; magfact = dummy[2];
							if (printval === 0.0) magfact = -1.0;
						} else {
							printval /= magfact;
						}
						this.gdes[i].format = this.gdes[i].format.substr(0, percent_s+1)+'s'+this.gdes[i].format.substr(percent_s+2);
					} else if (!this.gdes[i].strftm && this.gdes[i].format.indexOf('%s') != -1) {
						//[printval, si_symb, magfact] = this.auto_scale(printval, si_symb, magfact);
						var dummy = this.auto_scale(printval, si_symb, magfact); printval = dummy[0]; si_symb = dummy[1]; magfact = dummy[2];
		
					}

//          if (this.gdes[i].gf === RRDGraphDesc.GF.PRINT) { 
//            var prline;
//
//            if (this.gdes[i].strftm) {
//							var date = new Date(tmvdef*1000);
//							prline.u_str = date.strftime(this.gdes[i].format);
//            } else {
//              prline.u_str = sprintf(this.gdes[i].format, printval, si_symb);
//            }
//          grinfo_push(im, sprintf_alloc ("print[%ld]", prline_cnt++), RD_I_STR, prline); // FIXME
//          } else {
          if (this.gdes[i].strftm) {
            this.gdes[i].legend = this.strftime(this.gdes[i].format, tmvdef);
          } else {
            this.gdes[i].legend = this.sprintf(this.gdes[i].format, printval, si_symb);
          }
          graphelement = 1;
//          }
          break;
        case RRDGraphDesc.GF.LINE:
        case RRDGraphDesc.GF.AREA:
        case RRDGraphDesc.GF.TICK:
            graphelement = 1;
            break;
        case RRDGraphDesc.GF.HRULE:
            if (isNaN(this.gdes[i].yrule)) { /* we must set this here or the legend printer can not decide to print the legend */
                this.gdes[i].yrule = this.gdes[vidx].vf.val;
            };
            graphelement = 1;
            break;
        case RRDGraphDesc.GF.VRULE:
            if (this.gdes[i].xrule === 0) {   /* again ... the legend printer needs it */
                this.gdes[i].xrule = this.gdes[vidx].vf.when;
            };
            graphelement = 1;
            break;
        case RRDGraphDesc.GF.COMMENT:
        case RRDGraphDesc.GF.TEXTALIGN:
        case RRDGraphDesc.GF.DEF:
        case RRDGraphDesc.GF.CDEF:
        case RRDGraphDesc.GF.VDEF:
        case RRDGraphDesc.GF.SHIFT:
        case RRDGraphDesc.GF.XPORT:
            break;
        case RRDGraphDesc.GF.STACK:
            throw "STACK should already be turned into LINE or AREA here";
            break;
        }
    }
		return graphelement;
	},
	reduce_data: function(gdes, cur_step) 
	{
    var reduce_factor = Math.ceil(gdes.step / cur_step);
    var col, dst_row, row_cnt, start_offset, end_offset, skiprows = 0;
    var srcptr, dstptr;

    gdes.step = cur_step * gdes.reduce_factor; /* set new step size for reduced data */
    dstptr = 0;
    srcptr = 0;
    row_cnt = (gdes.end - gdes.start) / cur_step;

    end_offset = gdes.end % gdes.step;
    start_offset = gdes.start % gdes.step;

    if (start_offset) {
        gdes.start = gdes.start - start_offset;
        skiprows = reduce_factor - start_offset / cur_step;
        srcptr += skiprows * gdes.ds_cnt;
        for (col = 0; col < gdes.ds_cnt; col++)
            gdes.data[dstptr++] = Number.NaN;
        row_cnt -= skiprows;
    }

    if (end_offset) {
        gdes.end = gdes.end - end_offset + gdes.step;
        skiprows = end_offset / cur_step;
        row_cnt -= skiprows;
    }

    if (row_cnt % reduce_factor) {
        throw "BUG in reduce_data(), SANITY CHECK: "+row_cnt+" rows cannot be reduced by "+reduce_factor;
    }

    for (dst_row = 0; row_cnt >= reduce_factor; dst_row++) {
        for (col = 0; col < gdes.ds_cnt; col++) {
            var newval = Number.NaN;
            var validval = 0;

            for (i = 0; i < reduce_factor; i++) {
                if (isNaN(gdes.data[srcptr + i*gdes.ds_cnt + col])) continue;
                validval++;
                if (isNaN(newval))
                    newval = gdes.data[srcptr + i * gdes.ds_cnt + col];
                else {
                  switch (gdes.cf_reduce) {
                    case RRDGraphDesc.CF.HWPREDICT:
                    case RRDGraphDesc.CF.MHWPREDICT:
                    case RRDGraphDesc.CF.DEVSEASONAL:
                    case RRDGraphDesc.CF.DEVPREDICT:
                    case RRDGraphDesc.CF.SEASONAL:
                    case RRDGraphDesc.CF.AVERAGE:
                        newval += gdes.data[srcptr + i*gdes.ds_cnt + col];
                        break;
                    case RRDGraphDesc.CF.MINIMUM:
                        newval = Math.min(newval, gdes.data[srcptr + i*gdes.ds_cnt + col]);
                        break;
                    case RRDGraphDesc.CF.FAILURES:
                        /* an interval contains a failure if any subintervals contained a failure */
                    case RRDGraphDesc.CF.MAXIMUM:
                        newval = Math.max(newval, gdes.data[srcptr + i*gdes.ds_cnt + col]);
                        break;
                    case RRDGraphDesc.CF.LAST:
                        newval = gdes.data[srcptr + i*gdes.ds_cnt + col];
                        break;
                  }
                }
            }
            if (validval === 0) {
              newval = Number.NaN;
            } else {
              switch (gdes.cf_reduce) {
                case RRDGraphDesc.CF.HWPREDICT:
                case RRDGraphDesc.CF.MHWPREDICT:
                case RRDGraphDesc.CF.DEVSEASONAL:
                case RRDGraphDesc.CF.DEVPREDICT:
                case RRDGraphDesc.CF.SEASONAL:
                case RRDGraphDesc.CF.AVERAGE:
                    newval /= validval;
                    break;
                case RRDGraphDesc.CF.MINIMUM:
                case RRDGraphDesc.CF.FAILURES:
                case RRDGraphDesc.CF.MAXIMUM:
                case RRDGraphDesc.CF.LAST:
                    break;
              }
            }
            gdes.data[dstptr++] = newval;
        }
        srcptr += gdes.ds_cnt * reduce_factor;
        row_cnt -= reduce_factor;
    }
    if (end_offset)
        for (col = 0; col < gdes.ds_cnt; col++)
            gdes.data[dstptr++] = Number.NaN;
	},
	data_fetch: function()
	{
		var skip;

		for (var i = 0, gdes_c = this.gdes.length; i < gdes_c; i++) {
			if (this.gdes[i].gf != RRDGraphDesc.GF.DEF) continue;

			skip = false;
			for (var ii = 0; ii < i; ii++) {
				if (this.gdes[ii].gf != RRDGraphDesc.GF.DEF) continue;
				if ((this.gdes[i].rrd === this.gdes[ii].rrd)
					&& (this.gdes[i].cf === this.gdes[ii].cf)
					&& (this.gdes[i].cf_reduce === this.gdes[ii].cf_reduce)
					&& (this.gdes[i].start_orig === this.gdes[ii].start_orig)
					&& (this.gdes[i].end_orig === this.gdes[ii].end_orig)
					&& (this.gdes[i].step_orig === this.gdes[ii].step_orig)) {
						this.gdes[i].start = this.gdes[ii].start;
						this.gdes[i].end = this.gdes[ii].end;
						this.gdes[i].step = this.gdes[ii].step;
						this.gdes[i].ds_cnt = this.gdes[ii].ds_cnt;
						this.gdes[i].ds_namv = this.gdes[ii].ds_namv;
						this.gdes[i].data = this.gdes[ii].data;
						this.gdes[i].data_first = 0;
						skip = true;
				}
				if (skip) break;
			}

			if (!skip) {
				var ft_step = this.gdes[i].step;   /* ft_step will record what we got from fetch */
				ft_step = this.rrd_fetch(this.gdes[i], ft_step);
				if (ft_step < 0) 
					return -1;
				this.gdes[i].data_first = 1;
				if (ft_step < this.gdes[i].step) {
						this.reduce_data(this.gdes[i], ft_step);
				} else {
						this.gdes[i].step = ft_step;
				}
			}
			/* lets see if the required data source is really there */
			for (var ii = 0; ii < this.gdes[i].ds_cnt; ii++) {
					if (this.gdes[i].ds_namv[ii] === this.gdes[i].ds_nam) {
						this.gdes[i].ds = ii;
						break;
					}
			}

			if (this.gdes[i].ds === -1) 
				throw "No DS called '"+this.gdes[i].ds_nam+"' in '"+this.gdes[i].rrd+"'";
    }

    return 0;
	},
	lcd: function (num) 
	{
		var rest;
    for (var i = 0; num[i + 1] != 0; i++) {
			do {
				rest = num[i] % num[i + 1];
				num[i] = num[i + 1];
				num[i + 1] = rest;
			} while (rest != 0); // FIXME infinite loop ?
			num[i + 1] = num[i];
		}
    return num[i];
	},
	data_calc: function()
	{
		var dataidx;
		var now;

		var rpnstack;

    for (var gdi = 0, gdes_c = this.gdes.length; gdi < gdes_c; gdi++) {
			switch (this.gdes[gdi].gf) {
				case RRDGraphDesc.GF.XPORT:
					break;
				case RRDGraphDesc.GF.SHIFT:
					var vdp = this.gdes[this.gdes[gdi].vidx];
					/* remove current shift */
					vdp.start -= vdp.shift;
					vdp.end -= vdp.shift;

					if (this.gdes[gdi].shidx >= 0) vdp.shift = this.gdes[this.gdes[gdi].shidx].vf.val;
					else vdp.shift = this.gdes[gdi].shval;

					vdp.shift = (vdp.shift / vdp.step) * vdp.step;

					vdp.start += vdp.shift;
					vdp.end += vdp.shift;
					break;
        case RRDGraphDesc.GF.VDEF:
					this.gdes[gdi].ds_cnt = 0;
					if (this.vdef_calc(gdi)) 
						throw "Error processing VDEF '"+this.gdes[gdi].vname+"%s'";
					break;
        case RRDGraphDesc.GF.CDEF:
					this.gdes[gdi].ds_cnt = 1;
					this.gdes[gdi].ds = 0;
					this.gdes[gdi].data_first = 1;
					this.gdes[gdi].start = 0;
					this.gdes[gdi].end = 0;
					var steparray = [];
					var stepcnt = 0;
					dataidx = -1;
					
					var rpnp =  this.gdes[gdi].rpnp.rpnp;
					for (var rpi = 0; rpnp[rpi].op != RRDRpn.OP.END; rpi++) {
						if (rpnp[rpi].op === RRDRpn.OP.VARIABLE || rpnp[rpi].op === RRDRpn.OP.PREV_OTHER) {
							var ptr = rpnp[rpi].ptr;
							if (this.gdes[ptr].ds_cnt === 0) {    /* this is a VDEF data source */
								rpnp[rpi].val = this.gdes[ptr].vf.val;
								rpnp[rpi].op = RRDRpn.OP.NUMBER;
							} else {    /* normal variables and PREF(variables) */
								++stepcnt;
								steparray[stepcnt - 1] = this.gdes[ptr].step;

								if (this.gdes[gdi].start < this.gdes[ptr].start) 
									this.gdes[gdi].start = this.gdes[ptr].start;
								if (this.gdes[gdi].end === 0 || this.gdes[gdi].end > this.gdes[ptr].end) 
									this.gdes[gdi].end = this.gdes[ptr].end;

								rpnp[rpi].data = this.gdes[ptr].data;
								rpnp[rpi].pdata = this.gdes[ptr].ds;
								rpnp[rpi].step = this.gdes[ptr].step;
								rpnp[rpi].ds_cnt = this.gdes[ptr].ds_cnt;
							}
						}
					} 
					/* move the data pointers to the correct period */
					for (var rpi = 0; rpnp[rpi].op != RRDRpn.OP.END; rpi++) {
						if (rpnp[rpi].op === RRDRpn.OP.VARIABLE || rpnp[rpi].op === RRDRpn.OP.PREV_OTHER) {
							var ptr = rpnp[rpi].ptr;
							var diff = this.gdes[gdi].start - this.gdes[ptr].start;

							if (diff > 0) rpnp[rpi].pdata += (diff / this.gdes[ptr].step) * this.gdes[ptr].ds_cnt;
						}
					}

          if (steparray === null) {
						throw "rpn expressions without DEF or CDEF variables are not supported";
          }
          steparray[stepcnt] = 0;
          this.gdes[gdi].step = this.lcd(steparray);
					this.gdes[gdi].data = [];

          for (now = this.gdes[gdi].start + this.gdes[gdi].step; now <= this.gdes[gdi].end; now += this.gdes[gdi].step) {
						if (this.gdes[gdi].rpnp.calc(now, this.gdes[gdi].data, ++dataidx) === -1) 
							return -1;
          } 
          break;
        default:
            continue;
        }
    } 
    return 0;
	},
	data_proc: function() 
	{
    var pixstep = (this.end - this.start) / this.xsize; 
    var paintval;
    var minval = Number.NaN, maxval = Number.NaN;
    var gr_time;

    /* memory for the processed data */

    for (var i = 0, gdes_c = this.gdes.length; i < gdes_c; i++) {
        if ((this.gdes[i].gf === RRDGraphDesc.GF.LINE) || (this.gdes[i].gf === RRDGraphDesc.GF.AREA) || (this.gdes[i].gf === RRDGraphDesc.GF.TICK)) {
            this.gdes[i].p_data = [];
        }
		}

    for (var i = 0; i < this.xsize; i++) {   /* for each pixel */
			var vidx;
			gr_time = this.start + pixstep * i;  /* time of the current step */
			paintval = 0.0;

			for (var ii = 0 , gdes_c = this.gdes.length; ii < gdes_c; ii++) { 
				var value;
				switch (this.gdes[ii].gf) {
					case RRDGraphDesc.GF.LINE:
					case RRDGraphDesc.GF.AREA:
					case RRDGraphDesc.GF.TICK:
						if (!this.gdes[ii].stack) paintval = 0.0;
						value = this.gdes[ii].yrule;
						if (isNaN(value) || (this.gdes[ii].gf === RRDGraphDesc.GF.TICK)) {
							vidx = this.gdes[ii].vidx;
							if (this.gdes[vidx].gf === RRDGraphDesc.GF.VDEF) {
								value = this.gdes[vidx].vf.val;
							} else if (gr_time >= this.gdes[vidx].start && gr_time < this.gdes[vidx].end) {
								value = this.gdes[vidx].data[Math.floor((gr_time - this.gdes[vidx].start) / this.gdes[vidx].step) * this.gdes[vidx].ds_cnt + this.gdes[vidx].ds];
							} else {
								value = Number.NaN;
							}
						}
						if (!isNaN(value)) {
							paintval += value;
							this.gdes[ii].p_data[i] = paintval;
							if (isFinite(paintval) && this.gdes[ii].gf != RRDGraphDesc.GF.TICK) {
								if ((isNaN(minval) || paintval < minval) && !(this.logarithmic && paintval <= 0.0))
									minval = paintval;
									if (isNaN(maxval) || paintval > maxval)
										maxval = paintval;
							}
						} else {
							this.gdes[ii].p_data[i] = Number.NaN;
						}
						break;
					case RRDGraphDesc.GF.STACK:
						throw "STACK should already be turned into LINE or AREA here";
						break;
					default:
						break;
				}
			}
		}

    if (this.logarithmic) {
        if (isNaN(minval) || isNaN(maxval) || maxval <= 0) {
            minval = 0.0;  
            maxval = 5.1;
        }
        if (minval <= 0) minval = maxval / 10e8;
    } else {
        if (isNaN(minval) || isNaN(maxval)) {
            minval = 0.0;
            maxval = 1.0;
        }
    }

    if (isNaN(this.minval) || ((!this.rigid) && this.minval > minval)) {
        if (this.logarithmic) this.minval = minval / 2.0;
        else this.minval = minval;
    }
    if (isNaN(this.maxval) || (!this.rigid && this.maxval < maxval)) {
        if (this.logarithmic) this.maxval = maxval * 2.0;
        else this.maxval = maxval;
    }

    if (this.minval > this.maxval) {
        if (this.minval > 0) this.minval = 0.99 * this.maxval;
        else this.minval = 1.01 * this.maxval;
    }

    if (this.AlmostEqual2sComplement(this.minval, this.maxval, 4)) {
        if (this.maxval > 0) this.maxval *= 1.01;
        else this.maxval *= 0.99;

        if (this.AlmostEqual2sComplement(this.maxval, 0, 4)) this.maxval = 1.0;
    }
    return 0;
	},
	leg_place: function (calc_width)
	{
		var interleg = this.TEXT.LEGEND.size * 1.5;
		var border = this.TEXT.LEGEND.size * 1.5;
		var fill = 0, fill_last;
		var legendwidth; // = this.ximg - 2 * border;
		var leg_c = 0;
		var leg_x = border;
		var leg_y = 0; //this.yimg;
		var leg_y_prev = 0; // this.yimg;
		var leg_cc;
		var glue = 0;
		var ii, mark = 0;
		var default_txtalign = RRDGraphDesc.TXA.JUSTIFIED; /*default line orientation */
		var legspace;
		var tab;
		var saved_legend;

		if(calc_width) legendwidth = 0;
		else legendwidth = this.legendwidth - 2 * border;

    if (!this.no_legend && !this.only_graph) {
			legspace = [];
			for (var i = 0 , gdes_c = this.gdes.length; i < gdes_c; i++) { 
        var prt_fctn; /*special printfunctions */
        if(calc_width) saved_legend = this.gdes[i].legend;
        fill_last = fill;
        if (this.gdes[i].gf === RRDGraphDesc.GF.TEXTALIGN) 
					default_txtalign = this.gdes[i].txtalign;

				if (!this.force_rules_legend) {
					if (this.gdes[i].gf === RRDGraphDesc.GF.HRULE && (this.gdes[i].yrule < this.minval || this.gdes[i].yrule > this.maxval))
						this.gdes[i].legend = null;
					if (this.gdes[i].gf === RRDGraphDesc.GF.VRULE && (this.gdes[i].xrule < this.start || this.gdes[i].xrule > this.end))
						this.gdes[i].legend = null;
				}
				this.gdes[i].legend = this.gdes[i].legend.replace(/\\t/gi, "\t") /* turn \\t into tab */

        leg_cc = this.gdes[i].legend.length;
        /* is there a controle code at the end of the legend string ? */
        if (leg_cc >= 2 && this.gdes[i].legend.charAt(leg_cc - 2) === '\\') {
            prt_fctn = this.gdes[i].legend.charAt(leg_cc - 1);
            leg_cc -= 2;
            this.gdes[i].legend = this.gdes[i].legend.substr(0,leg_cc);
        } else {
            prt_fctn = null;
        }
        /* only valid control codes */
        if (prt_fctn != 'l' && prt_fctn != 'n' && prt_fctn != 'r' && prt_fctn != 'j' && prt_fctn != 'c' && 
						prt_fctn != 'u' && prt_fctn != 's' && prt_fctn != null  && prt_fctn != 'g') {
						throw "Unknown control code at the end of "+this.gdes[i].legend+": "+prt_fctn;
        }
        /* \n -> \l */
        if (prt_fctn === 'n') prt_fctn = 'l';

        /* remove exess space from the end of the legend for \g */
        while (prt_fctn === 'g' && leg_cc > 0 && this.gdes[i].legend.charAt(leg_cc - 1) === ' ') {
					leg_cc--;
					this.gdes[i].legend = this.gdes[i].legend.substr(0,leg_cc);
        }

        if (leg_cc != 0) {
          legspace[i] = (prt_fctn === 'g' ? 0 : interleg);
          if (fill > 0) fill += legspace[i];
          fill += this.gfx_get_text_width(fill + border, this.TEXT.LEGEND, this.tabwidth, this.gdes[i].legend);
          leg_c++;
        } else {
          legspace[i] = 0;
        }
        /* who said there was a special tag ... ? */
        if (prt_fctn === 'g') prt_fctn = null;

        if (prt_fctn === null) {
          if(calc_width && (fill > legendwidth)) legendwidth = fill;

          if (i === gdes_c - 1 || fill > legendwidth) {
            switch (default_txtalign) {
              case RRDGraphDesc.TXA.RIGHT:
                prt_fctn = 'r';
                break;
              case RRDGraphDesc.TXA.CENTER:
                prt_fctn = 'c';
                break;
              case RRDGraphDesc.TXA.JUSTIFIED:
                prt_fctn = 'j';
                break;
              default:
                prt_fctn = 'l';
                break;
            }
          }
          /* is it time to place the legends ? */
          if (fill > legendwidth) {
              if (leg_c > 1) {
                  /* go back one */
                  i--;
                  fill = fill_last;
                  leg_c--;
              }
          }
          if (leg_c === 1 && prt_fctn === 'j') {
              prt_fctn = 'l';
          }
        }

        if (prt_fctn != null) {
          leg_x = border;
          if (leg_c >= 2 && prt_fctn === 'j') {
						glue = (legendwidth - fill) / (leg_c - 1);
          } else {
            glue = 0;
          }
          if (prt_fctn === 'c')
              leg_x = (legendwidth - fill) / 2.0;
          if (prt_fctn === 'r')
              leg_x = legendwidth - fill + border;
          for (ii = mark; ii <= i; ii++) {
              if (this.gdes[ii].legend === '') continue; 
              this.gdes[ii].leg_x = leg_x;
              this.gdes[ii].leg_y = leg_y + border;
              leg_x += this.gfx_get_text_width(leg_x, this.TEXT.LEGEND, this.tabwidth, this.gdes[ii].legend) + legspace[ii] + glue;
          }
          leg_y_prev = leg_y;
          if (leg_x > border || prt_fctn === 's') leg_y += this.TEXT.LEGEND.size * 1.4;
          if (prt_fctn === 's') leg_y -= this.TEXT.LEGEND.size;
          if (prt_fctn === 'u') leg_y -= this.TEXT.LEGEND.size * 1.4;

          if(calc_width && (fill > legendwidth)) legendwidth = fill;
          fill = 0;
          leg_c = 0;
          mark = ii;
        }

        if(calc_width) this.gdes[i].legend = saved_legend;
      }
			if(calc_width) this.legendwidth = legendwidth + 2 * border;
			else this.legendheight = leg_y + border * 0.6; // FIXME 0.6 ??
    }
    return 0;
	},
	axis_paint: function() 
	{
		this.gfx_line(this.xorigin - 4, this.yorigin, 
				this.xorigin + this.xsize + 4, this.yorigin, 
				this.MGRIDWIDTH, this.GRC.AXIS);

		this.gfx_line(this.xorigin, this.yorigin + 4, 
				this.xorigin, this.yorigin - this.ysize - 4, 
				this.MGRIDWIDTH, this.GRC.AXIS);

		this.gfx_new_area(this.xorigin + this.xsize + 2, this.yorigin - 3, 
				this.xorigin + this.xsize + 2, 
				this.yorigin + 3, this.xorigin + this.xsize + 7, this.yorigin,  
				this.GRC.ARROW);
		this.gfx_close_path();

		this.gfx_new_area(this.xorigin - 3, this.yorigin - this.ysize - 2, 
				this.xorigin + 3, this.yorigin - this.ysize - 2, 
				this.xorigin, this.yorigin - this.ysize - 7, 
				this.GRC.ARROW);
		this.gfx_close_path();

		if (this.second_axis_scale != 0){
			this.gfx_line (this.xorigin+this.xsize,this.yorigin+4,
         this.xorigin+this.xsize,this.yorigin-this.ysize-4,
         MGRIDWIDTH, this.graph_col[GRC_AXIS]);
			this.gfx_new_area (this.xorigin+this.xsize-2,  this.yorigin-this.ysize-2,
   		   this.xorigin+this.xsize+3,  this.yorigin-this.ysize-2,
         this.xorigin+this.xsize,    this.yorigin-this.ysize-7, /* LINEOFFSET */
         this.GRC.ARROW);
			this.gfx_close_path();
		}
	},
	frexp10: function (x)
	{
    var mnt;
    var iexp;

    iexp = Math.floor(Math.log(Math.abs(x)) / Math.LN10);
    mnt = x / Math.pow(10.0, iexp);
    if (mnt >= 10.0) {
        iexp++;
        mnt = x / Math.pow(10.0, iexp);
    }
    return [mnt, iexp];
	},
	horizontal_log_grid: function ()
	{
    var yloglab = [
			[ 1.0, 10., 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], 
			[ 1.0, 5.0, 10., 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], 
			[ 1.0, 2.0, 5.0, 7.0, 10., 0.0, 0.0, 0.0, 0.0, 0.0 ], 
			[ 1.0, 2.0, 4.0, 6.0, 8.0, 10., 0.0, 0.0, 0.0, 0.0 ], 
			[	1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10. ],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] /* last line */
    ];
    var i, j, val_exp, min_exp;
    var nex;      /* number of decades in data */
    var logscale; /* scale in logarithmic space */
    var exfrac = 1;   /* decade spacing */
    var mid = -1; /* row in yloglab for major grid */
    var mspac;    /* smallest major grid spacing (pixels) */
    var flab;     /* first value in yloglab to use */
    var value, tmp, pre_value;
    var X0, X1, Y0;
    var graph_label;

    nex = Math.log(this.maxval / this.minval)/Math.LN10;
    logscale = this.ysize / nex;
    /* major spacing for data with high dynamic range */
    while (logscale * exfrac < 2.3 * this.TEXT.LEGEND.size) { // FIXME 3 -> 2.34 ??
			if (exfrac === 1) exfrac = 2.3; // ??? 3 -> 2.34
			else exfrac += 2.3 ; // 3-> 2.34
    }
    /* major spacing for less dynamic data */
    do {
			mid++;
			for (i = 0; yloglab[mid][i + 1] < 10.0; i++);
			mspac = logscale * Math.log(10.0 / yloglab[mid][i])/Math.LN10;
    } while (mspac > 1.56 * this.TEXT.LEGEND.size && yloglab[mid][0] > 0); // FIXME 2->1.56 ??
    if (mid) mid--;
    /* find first value in yloglab */
    //for (flab = 0; yloglab[mid][flab] < 10 && this.frexp10(this.minval,tmp) > yloglab[mid][flab]; flab++);
		flab = -1;
		do {
			var ret;
			flab++;
			// [ret, tmp] = this.frexp10(this.minval);
			var dummy = this.frexp10(this.minval); ret = dummy[0]; tmp = dummy[1];
		} while (yloglab[mid][flab] < 10 && ret > yloglab[mid][flab]);

    if (yloglab[mid][flab] === 10.0) {
			tmp += 1.0;
			flab = 0;
    }
    val_exp = tmp;
    if (val_exp % exfrac) val_exp += Math.abs(-val_exp % exfrac);
    X0 = this.xorigin;
    X1 = this.xorigin + this.xsize;
    /* draw grid */
    pre_value = Number.NAN;

    while (1) {
			value = yloglab[mid][flab] * Math.pow(10.0, val_exp);
			if (this.AlmostEqual2sComplement(value, pre_value, 4)) // FIXME
				break;      /* it seems we are not converging */
      pre_value = value;
      Y0 = this.ytr(value);
      if (Math.floor(Y0 + 0.5) <= this.yorigin - this.ysize)
      	break;
      /* major grid line */
      this.gfx_line(X0 - 2, Y0, X0, Y0, this.MGRIDWIDTH, this.GRC.MGRID);
      this.gfx_line(X1, Y0, X1 + 2, Y0, this.MGRIDWIDTH, this.GRC.MGRID);
      this.gfx_dashed_line(X0 - 2, Y0, X1 + 2, Y0, this.MGRIDWIDTH, this.GRC.MGRID, this.grid_dash_on, this.grid_dash_off);
      /* label */
      if (this.force_units_si) {
        var scale;
        var pvalue;
        var symbol;

        scale = Math.floor(val_exp / 3.0);
        if (value >= 1.0) pvalue = Math.pow(10.0, val_exp % 3);
        else pvalue = Math.pow(10.0, ((val_exp + 1) % 3) + 2);
        pvalue *= yloglab[mid][flab];

        if (((scale + this.si_symbcenter) < this.si_symbol.length) && ((scale + this.si_symbcenter) >= 0))
          symbol = this.si_symbol[scale + this.si_symbcenter];
        else
          symbol = '?';
        graph_label = this.sprintf("%3.0f %s", pvalue, symbol);
      } else {
        graph_label = this.sprintf("%3.0e", value);
      }
      if (this.second_axis_scale != 0){
        var graph_label_right;
        var sval = value*this.second_axis_scale+this.second_axis_shift;
        if (!this.second_axis_format[0]){
          if (this.force_units_si) {
            var mfac = 1;
            var symb = '';
            //[sval, symb, mfac ] = this.auto_scale(sval, symb, mfac);
            var dummy = this.auto_scale(sval, symb, mfac); sval = dummy[0]; symb = dummy[1]; mfac = dummy[2];
            graph_label_right = this.sprintf("%4.0f %s", sval,symb);
          } else { 
						graph_label_right = this.sprintf("%3.0e", sval);
          }
        } else {
					graph_label_right = this.sprintf(this.second_axis_format,sval,"");
				}
        this.gfx_text( X1+7, Y0, this.GRC.FONT, this.TEXT.AXIS, this.tabwidth,0.0, this.GFX_H.LEFT, this.GFX_V.CENTER, graph_label_right );
			}

     	this.gfx_text(X0 - this.TEXT.AXIS.size, Y0, this.GRC.FONT, this.TEXT.AXIS, this.tabwidth, 0.0, this.GFX_H.RIGHT, this.GFX_V.CENTER, graph_label);
			if (mid < 4 && exfrac === 1) { /* minor grid */
				if (flab === 0) { /* find first and last minor line behind current major line * i is the first line and j tha last */
					min_exp = val_exp - 1;
					for (i = 1; yloglab[mid][i] < 10.0; i++);
					i = yloglab[mid][i - 1] + 1;
					j = 10;
				} else {
					min_exp = val_exp;
					i = yloglab[mid][flab - 1] + 1;
					j = yloglab[mid][flab];
				}
				for (; i < j; i++) { /* draw minor lines below current major line */
					value = i * Math.pow(10.0, min_exp);
					if (value < this.minval) continue;
					Y0 = this.ytr(value);
					if (Math.floor(Y0 + 0.5) <= this.yorigin - this.ysize) break;
					this.gfx_line(X0 - 2, Y0, X0, Y0, this.GRIDWIDTH, this.GRC.GRID);
					this.gfx_line(X1, Y0, X1 + 2, Y0, this.GRIDWIDTH, this.GRC.GRID);
					this.gfx_dashed_line(X0 - 1, Y0, X1 + 1, Y0, this.GRIDWIDTH, this.GRC.GRID, this.grid_dash_on, this.grid_dash_off);
        }
			} else if (exfrac > 1) {
				for (i = val_exp - exfrac / 3 * 2; i < val_exp; i += exfrac / 3) {
					value = Math.pow(10.0, i);
					if (value < this.minval) continue;
					Y0 = this.ytr(value);
					if (Math.floor(Y0 + 0.5) <= this.yorigin - this.ysize) break;
					this.gfx_line(X0 - 2, Y0, X0, Y0, this.GRIDWIDTH, this.GRC.GRID);
					this.gfx_line(X1, Y0, X1 + 2, Y0, this.GRIDWIDTH, this.GRC.GRID);
					this.gfx_dashed_line(X0 - 1, Y0, X1 + 1, Y0, this.GRIDWIDTH, this.GRC.GRID, this.grid_dash_on, this.grid_dash_off);
				}
			}	
			if (yloglab[mid][++flab] === 10.0) { /* next decade */
				flab = 0;
				val_exp += exfrac;
			}
		}
		if (mid < 4 && exfrac === 1) { /* draw minor lines after highest major line */
			if (flab === 0) { /* find first and last minor line below current major line * i is the first line and j tha last */
				min_exp = val_exp - 1;
				for (i = 1; yloglab[mid][i] < 10.0; i++);
				i = yloglab[mid][i - 1] + 1;
				j = 10;
			} else {
				min_exp = val_exp;
				i = yloglab[mid][flab - 1] + 1;
				j = yloglab[mid][flab];
			}
			for (; i < j; i++) { /* draw minor lines below current major line */
				value = i * Math.pow(10.0, min_exp);
				if (value < this.minval) continue;
				Y0 = this.ytr(value);
				if (Math.floor(Y0 + 0.5) <= this.yorigin - this.ysize) break;
				this.gfx_line(X0 - 2, Y0, X0, Y0, this.GRIDWIDTH, this.GRC.GRID);
				this.gfx_line(X1, Y0, X1 + 2, Y0, this.GRIDWIDTH, this.GRC.GRID);
				this.gfx_dashed_line(X0 - 1, Y0, X1 + 1, Y0, this.GRIDWIDTH, this.GRC.GRID, this.grid_dash_on, this.grid_dash_off);
      }
    } else if (exfrac > 1) { /* fancy minor gridlines */
			for (i = val_exp - exfrac / 3 * 2; i < val_exp; i += exfrac / 3) {
				value = Math.pow(10.0, i);
				if (value < this.minval) continue;
				Y0 = this.ytr(value);
				if (Math.floor(Y0 + 0.5) <= this.yorigin - this.ysize) break;
				this.gfx_line(X0 - 2, Y0, X0, Y0, this.GRIDWIDTH, this.GRC.GRID);
				this.gfx_line(X1, Y0, X1 + 2, Y0, this.GRIDWIDTH, this.GRC.GRID);
				this.gfx_dashed_line(X0 - 1, Y0, X1 + 1, Y0, this.GRIDWIDTH, this.GRC.GRID, this.grid_dash_on, this.grid_dash_off);
        }
    }
    return 1;
	},
	vertical_grid: function()
	{
    var xlab_sel; /* which sort of label and grid ? */
    var ti, tilab, timajor;
    var factor;
    var graph_label;
 		var X0, Y0, Y1;   /* points for filled graph and more */

		/* the type of time grid is determined by finding the number of seconds per pixel in the graph */
		if (this.xlab_user.minsec === -1) {
			factor = (this.end - this.start) / this.xsize;
			xlab_sel = 0;
			
			while (this.xlab[xlab_sel + 1].minsec != -1 && this.xlab[xlab_sel + 1].minsec <= factor) xlab_sel++;
			if (xlab_sel === 0) xlab_sel=1; // FIXME XXX XXX xlab_sel == 0 ??? 
			while (this.xlab[xlab_sel - 1].minsec === this.xlab[xlab_sel].minsec && this.xlab[xlab_sel].length > (this.end - this.start)) xlab_sel--;
			this.xlab_user = this.xlab[xlab_sel];

		}
		Y0 = this.yorigin;
		Y1 = this.yorigin - this.ysize;

		if (!(this.no_minor)) {
			for (	ti = this.find_first_time(this.start, this.xlab_user.gridtm, this.xlab_user.gridst),
						timajor = this.find_first_time(this.start, this.xlab_user.mgridtm, this.xlab_user.mgridst);
			     	ti < this.end && ti != -1;
			     	ti = this.find_next_time(ti, this.xlab_user.gridtm, this.xlab_user.gridst)) {
			    if (ti < this.start || ti > this.end) continue;
			    while (timajor < ti && timajor != -1) timajor = this.find_next_time(timajor, this.xlab_user.mgridtm, this.xlab_user.mgridst);
			    if (timajor === -1) break; 
			    if (ti === timajor) continue;   
			    X0 = this.xtr(ti);
			    this.gfx_line(X0, Y1 - 2, X0, Y1, this.GRIDWIDTH, this.GRC.GRID);
			    this.gfx_line(X0, Y0, X0, Y0 + 2, this.GRIDWIDTH, this.GRC.GRID);
			    this.gfx_dashed_line(X0, Y0 + 1, X0, Y1 - 1, this.GRIDWIDTH, this.GRC.GRID, this.grid_dash_on, this.grid_dash_off);
			}
		}

		for (	ti = this.find_first_time(this.start, this.xlab_user.mgridtm, this.xlab_user.mgridst);
					ti < this.end && ti != -1;
		 			ti = this.find_next_time(ti, this.xlab_user.mgridtm, this.xlab_user.mgridst)
			) {
			if (ti < this.start || ti > this.end) continue;
			X0 = this.xtr(ti);
			this.gfx_line(X0, Y1 - 2, X0, Y1, this.MGRIDWIDTH, this.GRC.MGRID);
			this.gfx_line(X0, Y0, X0, Y0 + 3, this.MGRIDWIDTH, this.GRC.MGRID);
			this.gfx_dashed_line(X0, Y0 + 3, X0, Y1 - 2, this.MGRIDWIDTH,
				this.GRC.MGRID, this.grid_dash_on, this.grid_dash_off);
	  }

		for (	ti = this.find_first_time(this.start - this.xlab_user.precis / 2, this.xlab_user.labtm, this.xlab_user.labst);
					(ti <= this.end - this.xlab_user.precis / 2) && ti != -1;
					ti = this.find_next_time(ti, this.xlab_user.labtm, this.xlab_user.labst)
			) {
			tilab = ti + this.xlab_user.precis / 2;  
			if (tilab < this.start || tilab > this.end)
			    continue;
			//localtime_r(&tilab, &tm); FIXME
			//strftime(graph_label, 99, this.xlab_user.stst, &tm); FIXME
			graph_label = this.xlab_user.stst(new Date(tilab*1000));
			this.gfx_text(this.xtr(tilab), Y0 + 3, this.GRC.FONT,
				 this.TEXT.AXIS, this.tabwidth, 0.0,
				 this.GFX_H.CENTER, this.GFX_V.TOP, graph_label);
		}
	},
	auto_scale: function (value, symb_ptr, magfact)
	{
    var symbol = [ 
				'a', 		/* 10e-18 Atto */
        'f',    /* 10e-15 Femto */
        'p',    /* 10e-12 Pico */
        'n',    /* 10e-9  Nano */
        'u',    /* 10e-6  Micro */
        'm',    /* 10e-3  Milli */
        ' ',    /* Base */
        'k',    /* 10e3   Kilo */
        'M',    /* 10e6   Mega */
        'G',    /* 10e9   Giga */
        'T',    /* 10e12  Tera */
        'P',    /* 10e15  Peta */
        'E'			/* 10e18  Exa */
		];

    var symbcenter = 6;
    var sindex;

    if (value === 0.0 || isNaN(value)) {
        sindex = 0;
        magfact = 1.0;
    } else {
        sindex = Math.floor((Math.log(Math.abs(value))/Math.LN10) / (Math.log(this.base)/Math.LN10));
        magfact = Math.pow(this.base, sindex);
        value /= magfact;
    }
    if (sindex <= symbcenter && sindex >= -symbcenter) {
        symb_ptr = symbol[sindex + symbcenter];
    } else {
        symb_ptr = '?';
    }
		return [value, symb_ptr, magfact];
	},
	si_unit: function() 
	{
		var digits;
		var viewdigits = 0;

		digits = Math.floor(Math.log(Math.max(Math.abs(this.minval), Math.abs(this.maxval))) / Math.log(this.base));

		if (this.unitsexponent != 9999) {
			/* unitsexponent = 9, 6, 3, 0, -3, -6, -9, etc */
			viewdigits = Math.floor(this.unitsexponent / 3);
		} else {
			viewdigits = digits;
		}

		this.magfact = Math.pow(this.base, digits);

		this.viewfactor = this.magfact / Math.pow(this.base, viewdigits);

		if (((viewdigits + this.si_symbcenter) < this.si_symbol.length) && ((viewdigits + this.si_symbcenter) >= 0))
			this.symbol = this.si_symbol[viewdigits + this.si_symbcenter];
		else
			this.symbol = '?';
	},
	expand_range: function ()
	{
		var sensiblevalues = [ 1000.0, 900.0, 800.0, 750.0, 700.0, 600.0, 500.0, 400.0, 300.0, 250.0, 200.0, 125.0, 100.0, 90.0, 80.0, 75.0, 70.0, 60.0, 50.0, 40.0, 30.0, 25.0, 20.0, 10.0, 9.0, 8.0, 7.0, 6.0, 5.0, 4.0, 3.5, 3.0, 2.5, 2.0, 1.8, 1.5, 1.2, 1.0, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0, -1 ];
		var scaled_min, scaled_max;
		var adj;
		var i;

		if (isNaN(this.ygridstep)) {
			if (this.alt_autoscale) {
				var delt, fact;

				delt = this.maxval - this.minval;
				adj = delt * 0.1;
				fact = 2.0 * Math.pow(10.0, Math.floor(Math.log(Math.max(Math.abs(this.minval), Math.abs(this.maxval)) / this.magfact)/Math.LN10) - 2);
				if (delt < fact) adj = (fact - delt) * 0.55;
				this.minval -= adj;
				this.maxval += adj;
			} else if (this.alt_autoscale_min) {
				adj = (this.maxval - this.minval) * 0.1;
				this.minval -= adj;
			} else if (this.alt_autoscale_max) {
				adj = (this.maxval - this.minval) * 0.1;
				this.maxval += adj;
			} else {
				scaled_min = this.minval / this.magfact;
				scaled_max = this.maxval / this.magfact;

				for (i = 1; sensiblevalues[i] > 0; i++) {
					if (sensiblevalues[i - 1] >= scaled_min && sensiblevalues[i] <= scaled_min)
						this.minval = sensiblevalues[i] * this.magfact;
					if (-sensiblevalues[i - 1] <= scaled_min && -sensiblevalues[i] >= scaled_min)
						this.minval = -sensiblevalues[i - 1] * this.magfact;
					if (sensiblevalues[i - 1] >= scaled_max && sensiblevalues[i] <= scaled_max)
						this.maxval = sensiblevalues[i - 1] * this.magfact;
					if (-sensiblevalues[i - 1] <= scaled_max && -sensiblevalues[i] >= scaled_max)
						this.maxval = -sensiblevalues[i] * this.magfact;
				}
			}
		} else {
			this.minval = this.ylabfact * this.ygridstep * Math.floor(this.minval / (this.ylabfact * this.ygridstep));
			this.maxval = this.ylabfact * this.ygridstep * Math.ceil(this.maxval / (this.ylabfact * this.ygridstep));
    }
	},
	calc_horizontal_grid: function() 
	{
		var range;
		var scaledrange;
		var pixel, i;
		var gridind = 0;
		var decimals, fractionals;

		this.ygrid_scale.labfact = 2;
		range = this.maxval - this.minval;
		scaledrange = range / this.magfact;
		if (isNaN(scaledrange) || !isFinite(scaledrange)) {
			return false;
		}

		pixel = 1;
		if (isNaN(this.ygridstep)) {
			if (this.alt_ygrid) {
				decimals = Math.ceil(Math.log(Math.max(Math.abs(this.maxval), Math.abs(this.minval)) * this.viewfactor / this.magfact)/Math.LN10);
				if (decimals <= 0) decimals = 1;
					this.ygrid_scale.gridstep = Math.pow(10, Math.floor(Math.log(range * this.viewfactor / this.magfact)/Math.LN10)) / this.viewfactor * this.magfact;
				if (this.ygrid_scale.gridstep === 0)  this.ygrid_scale.gridstep = 0.1;
				if (range / this.ygrid_scale.gridstep < 5 && this.ygrid_scale.gridstep >= 30)
					this.ygrid_scale.gridstep /= 10;
				if (range / this.ygrid_scale.gridstep > 15)
					this.ygrid_scale.gridstep *= 10;
				if (range / this.ygrid_scale.gridstep > 5) {
					this.ygrid_scale.labfact = 1;
					if (range / this.ygrid_scale.gridstep > 8 || this.ygrid_scale.gridstep < 1.8 * this.TEXT.AXIS.size) // 1.8
						this.ygrid_scale.labfact = 2;
					} else {
						this.ygrid_scale.gridstep /= 5;
						this.ygrid_scale.labfact = 5;
				}

				fractionals = Math.floor(Math.log(this.ygrid_scale.gridstep * this.ygrid_scale.labfact * this.viewfactor / this.magfact)/Math.LN10);
				if (fractionals < 0) {  /* small amplitude. */
					var len = decimals - fractionals + 1;
					if (this.unitslength < len + 2) this.unitslength = len + 2;
					this.ygrid_scale.labfmt = this.sprintf("%%%d.%df%s", len, -fractionals, (this.symbol != ' ' ? " %s" : ""));
				} else {
					var len = decimals + 1;
					if (this.unitslength < len + 2) this.unitslength = len + 2;
					this.ygrid_scale.labfmt = this.sprintf("%%%d.0f%s", len, (this.symbol != ' ' ? " %s" : ""));
				}
			} else {        /* classic rrd grid */
				for (i = 0; this.ylab[i].grid > 0; i++) {
					pixel = this.ysize / (scaledrange / this.ylab[i].grid);
					gridind = i;
					if (pixel >= 5) break;
				}
				for (i = 0; i < 4; i++) {
					if (pixel * this.ylab[gridind].lfac[i] >= 1.8 * this.TEXT.AXIS.size) { // 1.8
						this.ygrid_scale.labfact = this.ylab[gridind].lfac[i];
						break;
					}
				}
				this.ygrid_scale.gridstep = this.ylab[gridind].grid * this.magfact;
			}
		} else {
			this.ygrid_scale.gridstep = this.ygridstep;
			this.ygrid_scale.labfact = this.ylabfact;
		}
    return true;
	},
	draw_horizontal_grid: function() 
	{
		var i;
		var scaledstep;
		var graph_label;
		var nlabels = 0;
		var X0 = this.xorigin;
		var X1 = this.xorigin + this.xsize;
		var sgrid = Math.round(this.minval / this.ygrid_scale.gridstep - 1);
		var egrid = Math.round(this.maxval / this.ygrid_scale.gridstep + 1);
		var MaxY;
		var second_axis_magfact = 0;
		var second_axis_symb = '';
		var Y0, YN;
		var sisym;

		scaledstep = this.ygrid_scale.gridstep / this.magfact * this.viewfactor;
		MaxY = scaledstep * egrid;
		for (i = sgrid; i <= egrid; i++) {
			Y0 = this.ytr(this.ygrid_scale.gridstep * i);
			YN = this.ytr(this.ygrid_scale.gridstep * (i + 1));
			if (Math.floor(Y0 + 0.5) >= this.yorigin - this.ysize && Math.floor(Y0 + 0.5) <= this.yorigin) {
				if (i % this.ygrid_scale.labfact === 0 || (nlabels === 1 && (YN < this.yorigin - this.ysize || YN > this.yorigin))) {
					if (this.symbol === ' ') {
						if (this.alt_ygridf) {
							graph_label = this.sprintf(this.ygrid_scale.labfmt, scaledstep * i); // FIXME
						} else {
							if (MaxY < 10) {
								graph_label = this.sprintf("%4.1f", scaledstep * i);	
								//var dummy = scaledstep * i; // FIXME
								//graph_label = lpad(dummy.toFixed(1),' ',4);
							} else {
								graph_label = this.sprintf("%4.0f", scaledstep * i);
								//var dummy = scaledstep * i; // FIXME
								//graph_label = lpad(dummy.toFixed(),' ',4);
							}
						}
					} else {
						sisym = (i === 0 ? ' ' : this.symbol);
						if (this.alt_ygrid) {
							graph_label = this.sprintf(this.ygrid_scale.labfmt, scaledstep * i, sisym);
						} else {
							if (MaxY < 10) {
								graph_label = this.sprintf("%4.1f %s", scaledstep * i, sisym); 
								//var dummy = scaledstep * i; // FIXME
								//graph_label = lpad(dummy.toFixed(1),' ',4)+' '+sisym;
							} else {
								graph_label = this.sprintf("%4.0f %s", scaledstep * i, sisym); 
								//var dummy = scaledstep * i; // FIXME
								//graph_label = lpad(dummy.toFixed(),' ',4)+' '+sisym;
							}
						}
					}
					nlabels++;
					if (this.second_axis_scale != 0){
						var graph_label_right;
						sval = this.ygrid_scale.gridstep*i*this.second_axis_scale+this.second_axis_shift;
						if (!this.second_axis_format){
							if (!second_axis_magfact){
								var dummy = this.ygrid_scale.gridstep*(sgrid+egrid)/2.0*this.second_axis_scale+this.second_axis_shift;
								[dummy, second_axis_symb, second_axis_magfact ] = this.auto_scale(dummy,second_axis_symb,second_axis_magfact); 
							}
							sval /= second_axis_magfact;
							if(MaxY < 10) {
								graph_label_right = this.sprintf("%5.1f %s", sval, second_axis_symb);
							} else {
								graph_label_right = this.sprintf("%5.0f %s", sval, second_axis_symb);
							}
						} else {
							graph_label_right = this.sprintf(this.second_axis_format, sval);
						}
						this.gfx_text (X1+7, Y0, this.GRC.FONT, this.TEXT.AXIS, this.tabwidth, 0.0, this.GFX_H.LEFT, this.GFX_V.CENTER, graph_label_right );
					}
					this.gfx_text(X0 - this.TEXT.AXIS.size , Y0, this.GRC.FONT, this.TEXT.AXIS , this.tabwidth, 0.0, this.GFX_H.RIGHT, this.GFX_V.CENTER, graph_label);
					this.gfx_line(X0 - 2, Y0, X0, Y0, this.MGRIDWIDTH, this.GRC.MGRID);
					this.gfx_line(X1, Y0, X1 + 2, Y0, this.MGRIDWIDTH, this.GRC.MGRID);
					this.gfx_dashed_line(X0 - 2, Y0, X1 + 2, Y0, this.MGRIDWIDTH, this.GRC.MGRID, this.grid_dash_on, this.grid_dash_off);
				} else if (!this.no_minor) {
					this.gfx_line( X0 - 2, Y0, X0, Y0, this.GRIDWIDTH, this.GRC.GRID);
					this.gfx_line(X1, Y0, X1 + 2, Y0, this.GRIDWIDTH, this.GRC.GRID);
					this.gfx_dashed_line(X0 - 1, Y0, X1 + 1, Y0, this.GRIDWIDTH, this.GRC.GRID, this.grid_dash_on, this.grid_dash_off);
				}
			}
		}
		return 1;
	},
	grid_paint: function() 
	{
		var i;
		var res = 0;
		var X0, Y0;

		if (this.draw_3d_border > 0) {
		        i = this.draw_3d_border;
		        this.gfx_new_area(0, this.yimg, i, this.yimg - i, i, i, this.GRC.SHADEA);
		        this.gfx_add_point(this.ximg - i, i);
		        this.gfx_add_point(this.ximg, 0);
		        this.gfx_add_point(0, 0);
		        this.gfx_close_path();
		        this.gfx_new_area(i, this.yimg - i, this.ximg - i, this.yimg - i, this.ximg - i, i, this.GRC.SHADEB);
		        this.gfx_add_point(this.ximg, 0);
		        this.gfx_add_point(this.ximg, this.yimg);
		        this.gfx_add_point(0, this.yimg);
		        this.gfx_close_path();
		}
		if (this.draw_x_grid) 
			this.vertical_grid();
		if (this.draw_y_grid) {
			if (this.logarithmic)
				res =	this.horizontal_log_grid();
			else 
				res = this.draw_horizontal_grid();
		    /* dont draw horizontal grid if there is no min and max val */
		  if (!res) {
		    this.gfx_text(this.ximg / 2, (2 * this.yorigin - this.ysize) / 2,
		  	  this.GRC.FONT, this.TEXT.AXIS,
		  	  this.tabwidth, 0.0,
		  	  this.GFX_H.CENTER, this.GFX_V.CENTER, 'No Data found');
		  }
		}

		/* yaxis unit description */
		if (this.ylegend){
		    this.gfx_text(this.xOriginLegendY+10, this.yOriginLegendY,
					this.GRC.FONT, this.TEXT.UNIT, this.tabwidth, this.YLEGEND_ANGLE, 
					this.GFX_H.CENTER, this.GFX_V.CENTER, this.ylegend);

		}
		if (this.second_axis_legend){
			this.gfx_text(this.xOriginLegendY2+10, this.yOriginLegendY2,
				this.GRC.FONT, this.TEXT.UNIT, this.tabwidth, this.YLEGEND_ANGLE,
				this.GFX_H.CENTER, this.GFX_V.CENTER, this.second_axis_legend);
		}

		/* graph title */
		this.gfx_text(this.xOriginTitle, this.yOriginTitle+6,
		         this.GRC.FONT, this.TEXT.TITLE, this.tabwidth, 0.0, this.GFX_H.CENTER, this.GFX_V.TOP, this.title);
		/* rrdtool 'logo' */
		if (!this.no_rrdtool_tag){
		    var color = this.parse_color(this.GRC.FONT);
				color[3] = 0.3;
				var water_color = this.color2rgba(color);
		    var xpos = this.legendposition === this.LEGEND_POS.EAST ? this.xOriginLegendY : this.ximg - 4;
		    this.gfx_text(xpos, 5, water_color, this.TEXT.WATERMARK, this.tabwidth,
		    	 -90, this.GFX_H.LEFT, this.GFX_V.TOP, "RRDTOOL / TOBI OETIKER");
		}
		/* graph watermark */
		if (this.watermark) {
		    var color = this.parse_color(this.GRC.FONT)
				color[3] = 0.3;
				var water_color = this.color2rgba(color);
		    this.gfx_text(this.ximg / 2, this.yimg - 6, water_color, this.TEXT.FONT , this.tabwidth, 0, 
		    	 this.GFX_H.CENTER, this.GFX_V.BOTTOM, this.watermark);
		}
		/* graph labels */
		if (!(this.no_legend) && !(this.only_graph)) {
			for (var i = 0 , gdes_c = this.gdes.length; i < gdes_c; i++) { 
				if (!this.gdes[i].legend) continue;
				X0 = this.xOriginLegend + this.gdes[i].leg_x;
				Y0 = this.legenddirection === this.LEGEND_DIR.TOP_DOWN ? this.yOriginLegend + this.gdes[i].leg_y : this.yOriginLegend + this.legendheight - this.gdes[i].leg_y;
				this.gfx_text(X0, Y0, this.GRC.FONT, this.TEXT.LEGEND, this.tabwidth, 0.0, this.GFX_H.LEFT, this.GFX_V.BOTTOM, this.gdes[i].legend); 
				if (this.gdes[i].gf != RRDGraphDesc.GF.PRINT && this.gdes[i].gf != RRDGraphDesc.GF.GPRINT && this.gdes[i].gf != RRDGraphDesc.GF.COMMENT) {
		    	var boxH, boxV;
		    	var X1, Y1;

		    	boxH = this.gfx_get_text_width(0,this.TEXT.LEGEND, this.tabwidth, 'o') * 1.2;
		    	boxV = boxH;

		    	Y0 -= boxV * 0.4;

		    	if (this.dynamic_labels && this.gdes[i].gf === RRDGraphDesc.GF.HRULE) { 
		    		this.gfx_line(X0, Y0 - boxV / 2, X0 + boxH, Y0 - boxV / 2, 1.0, this.gdes[i].col);
		    	} else if (this.dynamic_labels && this.gdes[i].gf === RRDGraphDesc.GF.VRULE) { 
		    		this.gfx_line(X0 + boxH / 2, Y0, X0 + boxH / 2, Y0 - boxV, 1.0, this.gdes[i].col);
		    	} else if (this.dynamic_labels && this.gdes[i].gf === RRDGraphDesc.GF.LINE) { 
		    		this.gfx_line(X0, Y0, X0 + boxH, Y0 - boxV, this.gdes[i].linewidth, this.gdes[i].col);
		    	} else {
		    		this.gfx_new_area(X0, Y0 - boxV, X0, Y0, X0 + boxH, Y0, this.GRC.BACK); 
						this.gfx_add_point(Math.round(X0 + boxH)+0.5, Math.round(Y0 - boxV)+0.5);
		    		this.gfx_close_path();
		    		this.gfx_new_area(X0, Y0 - boxV, X0, Y0, X0 + boxH, Y0, this.gdes[i].col);
		    		this.gfx_add_point(Math.round(X0 + boxH)+0.5, Math.round(Y0 - boxV)+0.5);
		    		this.gfx_close_path();
		    		this.ctx.save();

						this.ctx.beginPath();
						this.ctx.lineWidth = 1.0;
		    		X1 = X0 + boxH;
		    		Y1 = Y0 - boxV;
						X0 = Math.round(X0)+0.5;
						X1 = Math.round(X1)+0.5;
						Y0 = Math.round(Y0)+0.5;
						Y1 = Math.round(Y1)+0.5;
		    		this.ctx.moveTo(X0, Y0);
		    		this.ctx.lineTo(X1, Y0);
		    		this.ctx.lineTo(X1, Y1);
		    		this.ctx.lineTo(X0, Y1);
						this.ctx.closePath();
						this.ctx.strokeStyle = this.GRC.FRAME;
						this.ctx.stroke();
						this.ctx.restore();
					}
//		   	if (this.gdes[i].dash) { FIXME
//		   	    double    dashes[] = { 3.0 };
//		   	    cairo_set_dash(this.cr, dashes, 1, 0.0);
//		   	}
				}
			}
		}
	},
	graph_size_location: function (elements)
	{
		var Xvertical = 0;		
		var Xvertical2 = 0;
		var Ytitle = 0;
		var Xylabel = 0;
		var Xmain = 0;
		var Ymain = 0;
		var Yxlabel = 0; 
		var Xspacing = 15;
		var Yspacing = 15;
		var Ywatermark = 4;

		if (this.only_graph) {
			this.xorigin = 0;
			this.ximg = this.xsize;
			this.yimg = this.ysize;
			this.yorigin = this.ysize;
			this.ytr(Number.NaN);
			return 0;
		}
		
		if(this.watermark) 
			Ywatermark = this.TEXT.WATERMARK.size * 1.5; // 2
		if(this.ylegend) 
			Xvertical = this.TEXT.UNIT.size * 1.5; // 2
		if(this.second_axis_legend) 
			Xvertical2 = this.TEXT.UNIT.size * 1.5; // 2

		if(this.title)
			Ytitle = this.TEXT.TITLE.size * 1.95 + 10; // 2.6
		else
			Ytitle = 1.5 * Yspacing;

		if (elements) {	
			if (this.draw_x_grid) 
				Yxlabel = this.TEXT.AXIS.size * 1.35; // 2.5 1.87
			if (this.draw_y_grid || this.forceleftspace)  // FIXME
				Xylabel = this.gfx_get_text_width(0, this.TEXT.AXIS, this.tabwidth, '0') * this.unitslength;
		}
		Xylabel += Xspacing;
		this.legendheight = 0;
		this.legendwidth = 0;
		if(!this.no_legend) {
			if(this.legendposition === this.LEGEND_POS.WEST || this.legendposition === this.LEGEND_POS.EAST){
				if (this.leg_place(1) === -1) return -1; // FIXME
			}
		}

		if(this.full_size_mode) {
			this.ximg = this.xsize;
			this.yimg = this.ysize;
			Xmain = this.ximg;
			Ymain = this.yimg;

			Xmain -= Xylabel;// + Xspacing;
			if((this.legendposition === this.LEGEND_POS.WEST || this.legendposition === this.LEGEND_POS.EAST) && !(this.no_legend) )
				Xmain -= this.legendwidth;// + Xspacing;
			if (this.second_axis_scale != 0) Xmain -= Xylabel;
			if (!(this.no_rrdtool_tag)) Xmain -= Xspacing;

			Xmain -= Xvertical + Xvertical2;

			if(Xmain < 1) Xmain = 1;
			this.xsize = Xmain;

			if (!(this.no_legend)) {
				if(this.legendposition === this.LEGEND_POS.NORTH || this.legendposition === this.LEGEND_POS.SOUTH){
					this.legendwidth = this.ximg;
					if (this.leg_place(0) === -1) return -1;
				}
			}

			if( (this.legendposition === this.LEGEND_POS.NORTH || this.legendposition === this.LEGEND_POS.SOUTH)  && !(this.no_legend) )
				Ymain -=  Yxlabel + this.legendheight;
			else Ymain -= Yxlabel;

			Ymain -= Ytitle;

			if (this.nolegened) Ymain -= Yspacing;
			if (this.watermark) Ymain -= Ywatermark;
			if(Ymain < 1) Ymain = 1;
			this.ysize = Ymain;
		} else {            
			if (elements) {
//			Xmain = this.xsize; // + Xspacing;
				Xmain = this.xsize + Xspacing; //FIXME ???
				Ymain = this.ysize;
			}
			this.ximg = Xmain + Xylabel;
			if (!this.no_rrdtool_tag) this.ximg += Xspacing;

			if( (this.legendposition === this.LEGEND_POS.WEST || this.legendposition === this.LEGEND_POS.EAST) && !this.no_legend )
				this.ximg += this.legendwidth;// + Xspacing;
			if (this.second_axis_scale != 0) this.ximg += Xylabel;

			this.ximg += Xvertical + Xvertical2;

			if (!(this.no_legend)) {
				if(this.legendposition === this.LEGEND_POS.NORTH || this.legendposition === this.LEGEND_POS.SOUTH){
					this.legendwidth = this.ximg;
					if (this.leg_place(0) === -1) return -1;
				}
			}

			this.yimg = Ymain + Yxlabel;
			if( (this.legendposition === this.LEGEND_POS.NORTH || this.legendposition === this.LEGEND_POS.SOUTH)  && !(this.no_legend) )
			     this.yimg += this.legendheight;

			if (Ytitle) this.yimg += Ytitle;
			else this.yimg += 1.5 * Yspacing;

			if (this.no_legend) this.yimg += Yspacing;
			if (this.watermark) this.yimg += Ywatermark;
		}


		if (!this.no_legend) {
			if(this.legendposition === this.LEGEND_POS.WEST || this.legendposition === this.LEGEND_POS.EAST){
				if (this.leg_place(0) === -1) return -1;
			}
		}

		switch(this.legendposition){
		    case this.LEGEND_POS.NORTH:
		        this.xOriginTitle   = Math.round(Xvertical + Xylabel + (this.xsize / 2));
		        this.yOriginTitle   = 0;
		        this.xOriginLegend  = 0;
		        this.yOriginLegend  = Math.round(Ytitle);
		        this.xOriginLegendY = 0;
		        this.yOriginLegendY = Math.round(Ytitle + this.legendheight + (Ymain / 2) + Yxlabel);
		        this.xorigin        = Math.round(Xvertical + Xylabel);
		        this.yorigin        = Math.round(Ytitle + this.legendheight + Ymain);
		        this.xOriginLegendY2 = Math.round(Xvertical + Xylabel + Xmain);
		        if (this.second_axis_scale != 0) this.xOriginLegendY2 += Xylabel;
		        this.yOriginLegendY2 = Math.round(Ytitle + this.legendheight + (Ymain / 2) + Yxlabel);
		        break;
		    case this.LEGEND_POS.WEST:
		        this.xOriginTitle   = Math.round(this.legendwidth + Xvertical + Xylabel + this.xsize / 2);
		        this.yOriginTitle   = 0;
		        this.xOriginLegend  = 0;
		        this.yOriginLegend  = Math.round(Ytitle);
		        this.xOriginLegendY = Math.round(this.legendwidth);
		        this.yOriginLegendY = Math.round(Ytitle + (Ymain / 2));
		        this.xorigin        = Math.round(this.legendwidth + Xvertical + Xylabel);
		        this.yorigin        = Math.round(Ytitle + Ymain);
		        this.xOriginLegendY2 = Math.round(this.legendwidth + Xvertical + Xylabel + Xmain);
		        if (this.second_axis_scale != 0) this.xOriginLegendY2 += Xylabel;
		        this.yOriginLegendY2 = Math.round(Ytitle + (Ymain / 2));
		        break;
		    case this.LEGEND_POS.SOUTH:
		        this.xOriginTitle   = Math.round(Xvertical + Xylabel + this.xsize / 2);
		        this.yOriginTitle   = 0;
		        this.xOriginLegend  = 0;
		        this.yOriginLegend  = Math.round(Ytitle + Ymain + Yxlabel);
		        this.xOriginLegendY = 0;
		        this.yOriginLegendY = Math.round(Ytitle + (Ymain / 2));
		        this.xorigin        = Math.round(Xvertical + Xylabel);
		        this.yorigin        = Math.round(Ytitle + Ymain);
		        this.xOriginLegendY2 = Math.round(Xvertical + Xylabel + Xmain);
		        if (this.second_axis_scale != 0) this.xOriginLegendY2 += Xylabel;
		        this.yOriginLegendY2 = Math.round(Ytitle + (Ymain / 2));
		        break;
		    case this.LEGEND_POS.EAST:
		        this.xOriginTitle   = Math.round(Xvertical + Xylabel + this.xsize / 2);
		        this.yOriginTitle   = 0;
		        this.xOriginLegend  = Math.round(Xvertical + Xylabel + Xmain + Xvertical2);
		        if (this.second_axis_scale != 0) this.xOriginLegend += Xylabel;
		        this.yOriginLegend  = Math.round(Ytitle);
		        this.xOriginLegendY = 0;
		        this.yOriginLegendY = Math.round(Ytitle + (Ymain / 2));
		        this.xorigin        = Math.round(Xvertical + Xylabel);
		        this.yorigin        = Math.round(Ytitle + Ymain);
		        this.xOriginLegendY2 = Math.round(Xvertical + Xylabel + Xmain);
		        if (this.second_axis_scale != 0) this.xOriginLegendY2 += Xylabel;
		        this.yOriginLegendY2 = Math.round(Ytitle + (Ymain / 2));

		        if (!this.no_rrdtool_tag){
				    	this.xOriginTitle    += Xspacing;
				    	this.xOriginLegend   += Xspacing;
				    	this.xOriginLegendY  += Xspacing;
			    		this.xorigin         += Xspacing;
				    	this.xOriginLegendY2 += Xspacing;
		        }
		        break;
		}
		this.xtr(0);
		this.ytr(Number.NaN);
		return 0;
	},
	graph_paint: function()
	{
		if (this.logarithmic && this.minval <= 0)
			throw "for a logarithmic yaxis you must specify a lower-limit > 0";

//		var start_end = RRDTime.proc_start_end(this.start_t, this.end_t);
//		this.start = start_end[0];
//		this.end = start_end[1];

		if (this.start < 3600 * 24 * 365 * 10) 
			throw "the first entry to fetch should be after 1980 ("+this.start+"%ld)";

		if (this.end < this.start)
			throw "start ("+this.start+") should be less than end ("+this.end+")";

//	this.xlab_form = null
		this.xlab_user = { minsec: -1, length: 0, gridtm: 0, gridst: 0, mgridtm: 0, mgridst: 0, labtm: 0, labst: 0, precis: 0, stst: null };
		this.ygrid_scale = { gridstep: 0.0, labfact:0 , labfmt: null };
		this.minval = this.setminval;
		this.maxval = this.setmaxval;

		this.step = Math.max(this.step, (this.end - this.start) / this.xsize);

		for (var i = 0, gdes_c = this.gdes.length; i < gdes_c; i++) {
			this.gdes[i].step = 0;  // FIXME 0?
			this.gdes[i].step_orig = this.step;
			this.gdes[i].start = this.start; // FIXME SHIFT
//			this.gdes[i].start_orig = this.start;
			this.gdes[i].end = this.end; // FIXME SHIFT
//			this.gdes[i].end_orig = this.end;
		}

		var areazero = 0.0
		var lastgdes = null;

		if (this.data_fetch() === -1)
			return -1;
		if (this.data_calc() === -1)
			return -1;
		var i = this.print_calc();
		if (i < 0) 
			return -1;
		if (this.graph_size_location(i) === -1)
			return -1;
			
		if (this.data_proc() === -1)
			return -1;
		if (!this.logarithmic) 
			this.si_unit();
		if (!this.rigid && !this.logarithmic) 
			this.expand_range();
		
		if (this.magfact === 0) this.magfact =1; // FIXME XXX XXX  logarithmic Â?
	
		if (!this.calc_horizontal_grid()) 
			return -1;
		
		this.ytr(Number.NaN);

		this.canvas.height = this.yimg;
		this.canvas.width = this.ximg;

		this.gfx_new_area(0, 0, 0, this.yimg, this.ximg, this.yimg, this.GRC.BACK);
		this.gfx_add_point(this.ximg, 0);
		this.gfx_close_path();

		this.gfx_new_area(this.xorigin, this.yorigin, this.xorigin + this.xsize,
			this.yorigin, this.xorigin + this.xsize, this.yorigin - this.ysize, this.GRC.CANVAS);
		this.gfx_add_point(this.xorigin, this.yorigin - this.ysize);
		this.gfx_close_path();
	
//	this.ctx.rect(this.xorigin, this.yorigin - this.ysize - 1.0, this.xsize, this.ysize + 2.0);
// 	this.ctx.clip();
	
		if (this.minval > 0.0) areazero = this.minval;
		if (this.maxval < 0.0) areazero = this.maxval;

		for (var i = 0, gdes_c = this.gdes.length; i < gdes_c; i++) {
			switch (this.gdes[i].gf) {
				case RRDGraphDesc.GF.CDEF:
				case RRDGraphDesc.GF.VDEF:
				case RRDGraphDesc.GF.DEF:
				case RRDGraphDesc.GF.PRINT:
				case RRDGraphDesc.GF.GPRINT:
				case RRDGraphDesc.GF.COMMENT:
				case RRDGraphDesc.GF.TEXTALIGN:
				case RRDGraphDesc.GF.HRULE:
				case RRDGraphDesc.GF.VRULE:
				case RRDGraphDesc.GF.XPORT:
				case RRDGraphDesc.GF.SHIFT:
					break;
				case RRDGraphDesc.GF.TICK:
					for (var ii = 0; ii < this.xsize; ii++) {
						if (!isNaN(this.gdes[i].p_data[ii]) && this.gdes[i].p_data[ii] != 0.0) {
							if (this.gdes[i].yrule > 0) {
								this.gfx_line(this.xorigin + ii, this.yorigin + 1.0, this.xorigin + ii, this.yorigin - this.gdes[i].yrule * this.ysize, 1.0, this.gdes[i].col);
							} else if (this.gdes[i].yrule < 0) {
								this.gfx_line(this.xorigin + ii, this.yorigin - this.ysize - 1.0, this.xorigin + ii, this.yorigin - this.ysize - this.gdes[i].yrule * this.ysize, 1.0, this.gdes[i].col);
							}
						}
					}
					break;
				case RRDGraphDesc.GF.LINE:
				case RRDGraphDesc.GF.AREA:
            var diffval = this.maxval - this.minval;
            var maxlimit = this.maxval + 9 * diffval;
            var minlimit = this.minval - 9 * diffval;        
            for (var ii = 0; ii < this.xsize; ii++) {
							if (!isNaN(this.gdes[i].p_data[ii])) { // FIXME NaN < ??? 
								if (!isFinite(this.gdes[i].p_data[ii])) {
									if (this.gdes[i].p_data[ii] > 0) this.gdes[i].p_data[ii] = this.maxval;
									else this.gdes[i].p_data[ii] = this.minval;
								}
								if (this.gdes[i].p_data[ii] > maxlimit) this.gdes[i].p_data[ii] = maxlimit;
								if (this.gdes[i].p_data[ii] < minlimit) this.gdes[i].p_data[ii] = minlimit;
							}
            } 
						var color = this.parse_color(this.gdes[i].col); // if (this.gdes[i].col.alpha != 0.0) {
            if (color[3] != 0.0) {
							if (this.gdes[i].gf === RRDGraphDesc.GF.LINE) {
								var last_y = 0.0;
								var draw_on = false;

								this.ctx.save();
								this.ctx.beginPath();
								this.ctx.lineWidth = this.gdes[i].linewidth;						
								//if (this.gdes[i].dash) cairo_set_dash(this.cr, this.gdes[i].p_dashes, this.gdes[i].ndash, this.gdes[i].offset); FIXME
								for (var ii = 1; ii < this.xsize; ii++) {
									if (isNaN(this.gdes[i].p_data[ii]) || (this.slopemode && isNaN(this.gdes[i].p_data[ii - 1]))) {
										draw_on = false;
										continue;
									}
									if (!draw_on) {
										last_y = this.ytr(this.gdes[i].p_data[ii]);
										if (!this.slopemode) {
											var x = ii - 1 + this.xorigin;
											var y = last_y;
											x = Math.round(x)+0.5;
											y = Math.round(y)+0.5;
											this.ctx.moveTo(x, y);
											x = ii + this.xorigin;
											y = last_y;
											x = Math.round(x)+0.5;
											y = Math.round(y)+0.5;
											this.ctx.lineTo(x, y)
										} else {
											var x = ii - 1 + this.xorigin;
											var y = this.ytr(this.gdes[i].p_data[ii - 1]);
											x = Math.round(x)+0.5;
											y = Math.round(y)+0.5;
											this.ctx.moveTo(x, y);
											x = ii + this.xorigin;
											y = last_y;
											x = Math.round(x)+0.5;
											y = Math.round(y)+0.5;
											this.ctx.lineTo(x, y);
										}
										draw_on = true;
									} else {
										var x1 = ii + this.xorigin;
										var y1 = this.ytr(this.gdes[i].p_data[ii]);

										if (!this.slopemode && !this.AlmostEqual2sComplement(y1, last_y, 4)) {
											var x = ii - 1 + this.xorigin;
											var y = y1;

											x = Math.round(x)+0.5;
											y = Math.round(y)+0.5;
											this.ctx.lineTo(x, y);
										}
										last_y = y1;
										x1 = Math.round(x1)+0.5;
										y1 = Math.round(y1)+0.5;
										this.ctx.lineTo(x1, y1);
									}
								}
								//cairo_set_source_rgba(this.cr, this.gdes[i].  col.red, this.gdes[i].  col.green, this.gdes[i].  col.blue, this.gdes[i].col.alpha);
								this.ctx.strokeStyle = this.gdes[i].col;
								this.ctx.lineCap = 'round'; //cairo_set_line_cap(this.cr, CAIRO_LINE_CAP_ROUND);
								this.ctx.round = 'round'; //cairo_set_line_join(this.cr, CAIRO_LINE_JOIN_ROUND);
								this.ctx.stroke();
								this.ctx.restore();
							} else {
								var idxI = -1;
								var foreY = [];
								var foreX = [];
								var backY = [];
								var backX = [];
								var drawem = false; 

								for (ii = 0; ii <= this.xsize; ii++) {
									var ybase, ytop;

									if (idxI > 0 && (drawem || ii === this.xsize)) {
										var cntI = 1;
										var lastI = 0;

										while (cntI < idxI && this.AlmostEqual2sComplement(foreY [lastI], foreY[cntI], 4) && this.AlmostEqual2sComplement(foreY [lastI], foreY [cntI + 1], 4)) 
											cntI++;
											this.gfx_new_area(backX[0], backY[0], foreX[0], foreY[0], foreX[cntI], foreY[cntI], this.gdes[i].col);
											while (cntI < idxI) {
												lastI = cntI;
												cntI++;
												while (cntI < idxI && this.AlmostEqual2sComplement(foreY [lastI], foreY[cntI], 4) && this.AlmostEqual2sComplement(foreY [lastI], foreY [cntI + 1], 4))
													cntI++;
												this.gfx_add_point(foreX[cntI], foreY[cntI]);
											}
											this.gfx_add_point(backX[idxI], backY[idxI]);
											while (idxI > 1) {
												lastI = idxI;
												idxI--;
												while (idxI > 1 && this.AlmostEqual2sComplement(backY [lastI], backY[idxI], 4) && this.AlmostEqual2sComplement(backY [lastI], backY [idxI - 1], 4))
													idxI--;
												this.gfx_add_point(backX[idxI], backY[idxI]);
											}
											idxI = -1;
											drawem = false;
											this.gfx_close_path();
										}
										if (drawem) {
											drawem = false;
											idxI = -1;
										}
										if (ii === this.xsize)
											break;
										if (!this.slopemode && ii === 0) 
												continue;
                        if (isNaN(this.gdes[i].p_data[ii])) {
                            drawem = true;
                            continue;
                        }
                        ytop = this.ytr(this.gdes[i].p_data[ii]);
                        if (lastgdes && this.gdes[i].stack) ybase = this.ytr(lastgdes.p_data[ii]);
                        else ybase = this.ytr(areazero);
                        if (ybase === ytop) {
                            drawem = true;
                            continue;
                        }

                        if (ybase > ytop) {
                            var extra = ytop;
                            ytop = ybase;
                            ybase = extra;
                        }
                        if (!this.slopemode) {
                            backY[++idxI] = ybase - 0.2;
                            backX[idxI] = ii + this.xorigin - 1;
                            foreY[idxI] = ytop + 0.2;
                            foreX[idxI] = ii + this.xorigin - 1;
                        }
                        backY[++idxI] = ybase - 0.2;
                        backX[idxI] = ii + this.xorigin;
                        foreY[idxI] = ytop + 0.2;
                        foreX[idxI] = ii + this.xorigin;
                    }
                }    
            }
            /* if color != 0x0 */
            /* make sure we do not run into trouble when stacking on NaN */
            for (ii = 0; ii < this.xsize; ii++) {
                if (isNaN(this.gdes[i].p_data[ii])) {
                    if (lastgdes && (this.gdes[i].stack)) this.gdes[i].p_data[ii] = lastgdes.p_data[ii];
                    else this.gdes[i].p_data[ii] = areazero;
                }
            }
            lastgdes = this.gdes[i]; //lastgdes = &(this.gdes[i]);
            break;
        case RRDGraphDesc.GF.STACK:
            throw "STACK should already be turned into LINE or AREA here";
            break;
			}
    }            
// 	cairo_reset_clip(this.cr);
		if (!this.only_graph)
			this.grid_paint();
		if (!this.only_graph)
			this.axis_paint();
		/* the RULES are the last thing to paint ... */
		for (var i = 0, gdes_c = this.gdes.length; i < gdes_c; i++) {
			switch (this.gdes[i].gf) {
				case RRDGraphDesc.GF.HRULE:
					if (this.gdes[i].yrule >= this.minval && this.gdes[i].yrule <= this.maxval) {
						//if (this.gdes[i].dash) cairo_set_dash(this.cr, this.gdes[i].p_dashes, this.gdes[i].ndash, this.gdes[i].offset);
						this.gfx_line(this.xorigin, this.ytr(this.gdes[i].yrule), this.xorigin + this.xsize, this.ytr(this.gdes[i].yrule), 1.0, this.gdes[i].col);
					}
					break;
				case RRDGraphDesc.GF.VRULE:
					if (this.gdes[i].xrule >= this.start && this.gdes[i].xrule <= this.end) {
					//if (this.gdes[i].dash) cairo_set_dash(this.cr, this.gdes[i].p_dashes, this.gdes[i].ndash, this.gdes[i].offset);
           	this.gfx_line(this.xtr(this.gdes[i].xrule), this.yorigin, this.xtr(this.gdes[i].xrule), this.yorigin - this.ysize, 1.0, this.gdes[i].col);
          }
          break;
        default:
          break;
			}
		}
		return 0;
	},
	find_var: function(key)
	{
		for (var ii = 0, gdes_c = this.gdes.length; ii < gdes_c; ii++) {
        if ((this.gdes[ii].gf === RRDGraphDesc.GF.DEF || 
							this.gdes[ii].gf === RRDGraphDesc.GF.VDEF || 
							this.gdes[ii].gf === RRDGraphDesc.GF.CDEF)
            && this.gdes[ii].vname === key) {
            return ii;
        }
    }
    return -1;
	},
	// DEF:<vname>=<rrdfile>:<ds-name>:<CF>[:step=<step>][:start=<time>][:end=<time>][:reduce=<CF>]
	parse_def: function (line)
	{
		var args = line.split(/:/);
		var n=1;
		var vnames = args[n++].split('=');
		var vname = vnames[0];
		var rrdfile = vnames[1];
		if (rrdfile === 'http') rrdfile = rrdfile+':'+args[n++];
		var name = args[n++];
		var cf = args[n++];
		var step = undefined;
		var reduce = undefined;
		var start = undefined;
		var end = undefined;
		if (args.length > n) {
			for (var j = n, xlen = args.length ; j < xlen ; j++) {
				var opts = args[j].split("=");
				if (opts[0] === "step") step = opts[1];
				if (opts[0] === "reduce") reduce = opts[1]
				if (opts[0] === "start") start = opts[1];
				if (opts[0] === "end") end = opts[1];
			}
		}
		this.create_def(vname, rrdfile, name, cf, step, start, end, reduce)
	},
	create_def: function (vname, rrdfile, name, cf, step, start, end, reduce)
	{
		var gdp = new	RRDGraphDesc(this);
		var start_t = new RRDTime(this.start);
		var end_t = new RRDTime(this.end);

		gdp.gf = RRDGraphDesc.GF.DEF;
		gdp.vname = vname
		gdp.vidx = this.find_var(vname);
		gdp.rrd = rrdfile;
		gdp.ds_nam = name;
		gdp.cf = this.cf_conv(cf);
		
		if (step != undefined && step != null) 
			gdp.step = step;
		if (start != undefined && start != null) 
			start_t = new RRDTime(start);
		if (end != undefined && end != null) 
			end_t = new RRDTime(end);
		if (reduce  === undefined || reduce === null) 
			gdp.cf_reduce = gdp.cf; // Â¿?
		else
			gdp.cf_reduce = this.cf_conv(reduce);
		gdp.legend = '';

		var start_end = RRDTime.proc_start_end(start_t, end_t); // FIXME here?
		gdp.start = start_end[0];
		gdp.end = start_end[1];
		gdp.start_orig = start_end[0];
		gdp.end_orig = start_end[1];

		this.gdes.push(gdp);
	},
	// CDEF:vname=RPN expression
	parse_cdef: function (line)
	{
		var args = line.split(/:|=/);
		this.create_cdef(args[1], args[2]);
	},
	create_cdef:function (vname, rpn) 
	{
		var gdp = new	RRDGraphDesc(this);
		gdp.gf = RRDGraphDesc.GF.CDEF;
		gdp.vname = vname
		gdp.vidx = this.find_var(vname);
		
		gdp.rpnp = new RRDRpn(rpn,this.gdes);

		gdp.legend = '';
		this.gdes.push(gdp);
	},
	// VDEF:vname=RPN expression
	parse_vdef: function (line)
	{
		var args = line.split(/:|=/);
		this.create_vdef(args[1], args[2]);
	},
	create_vdef:function (vname, rpn) 
	{
		var gdp = new	RRDGraphDesc(this);
		gdp.gf = RRDGraphDesc.GF.VDEF;
		gdp.vname = vname
	
		var index = rpn.indexOf(',');
		var name = rpn.substring(0,index);
		gdp.vidx = this.find_var(name); // FIXME checks
		if (this.gdes[gdp.vidx].gf != RRDGraphDesc.GF.DEF && this.gdes[gdp.vidx].gf != RRDGraphDesc.GF.CDEF) {
			throw 'variable "'+name+'" not DEF nor CDEF in VDEF.';
    }

		this.vdef_parse(gdp, rpn.substring(index+1));

		gdp.legend = '';
		this.gdes.push(gdp);
	},
	// SHIFT:vname:offset
	parse_shift: function (line)
	{
		var args = line.split(':');
		this.create_shift(args[1], args[2]);
	},
	create_shift: function (vname, offset)
	{
		var gdp = new	RRDGraphDesc(this);
		gdp.gf = RRDGraphDesc.GF.SHIFT;
		gdp.vname = vname // Â?
		gdp.vidx = this.find_var(vname); // FIXME checks

		if (this.gdes[gdp.vidx].gf === RRDGraphDesc.GF.VDEF)
			throw "Cannot shift a VDEF: '%s' in line '"+this.gdes[gdp.vidx].vname+"'";
		if  (this.gdes[gdp.vidx].gf !== RRDGraphDesc.GF.DEF && this.gdes[gdp.vidx].gf !== RRDGraphDesc.GF.CDEF)
			throw "Encountered unknown type variable '"+this.gdes[gdp.vidx].vname+"'";
	
		gdp.shidx = this.find_var(offset);
		if (gdp.shidx >= 0) {
			if  (this.gdes[gdp.shidx].gf === RRDGraphDesc.GF.DEF || this.gdes[gdp.shidx].gf === RRDGraphDesc.GF.CDEF)
				throw "Offset cannot be a (C)DEF: '"+this.gdes[gdp.shidx].gf+"'";
			if  (this.gdes[gdp.shidx].gf !== RRDGraphDesc.GF.VDEF)
				throw "Encountered unknown type variable '"+this.gdes[gdp.shidx].vname+"'";
		} else {
			gdp.shval = parseInt(offset); // FIXME check
			gdp.shidx = -1;
		}
		gdp.legend = '';
		this.gdes.push(gdp);
	},
	// LINE[width]:value[#color][:[legend][:STACK]][:dashes[=on_s[,off_s[,on_s,off_s]...]][:dash-offset=offset]]
	parse_line: function (line)
	{
		var args = line.split(/#|:/);
		var width = parseFloat(args[0].substr(4));	
		var stack = args[4] === 'STACK' ? true : undefined;
		var color = this.parse_color(args[2]);
		this.create_line(width, args[1], this.color2rgba(color), args[3], stack);
	},
	create_line: function (width, value, color, legend, stack)
	{
		var gdp = new	RRDGraphDesc(this);

		gdp.gf = RRDGraphDesc.GF.LINE;
		gdp.vname = value;
		gdp.vidx = this.find_var(value);
		gdp.linewidth = width;
		gdp.col = color;
		if (legend === undefined) gdp.legend = '';
		else gdp.legend = '  '+legend;
		if (stack === undefined) gdp.stack = false;
		else gdp.stack = stack;
		gdp.format = gdp.legend;
		this.gdes.push(gdp);
	},
	// AREA:value[#color][:[legend][:STACK]]
	parse_area: function (line)
	{
		var args = line.split(/#|:/);
		var stack = args[3] === 'STACK' ? true : undefined;
		var color = this.parse_color(args[2]);
		this.create_area(args[1], this.color2rgba(color), stack);
	},
	create_area: function (value, color, legend, stack)
	{
		var gdp = new	RRDGraphDesc(this);

		gdp.gf = RRDGraphDesc.GF.AREA;
		gdp.vname = value;
		gdp.vidx = this.find_var(value);
		gdp.col = color;
		if (legend === undefined) gdp.legend = '';
		else gdp.legend = '  '+legend;
		if (stack === undefined) gdp.stack = false;
		else gdp.stack = stack;
		gdp.format = gdp.legend;
		this.gdes.push(gdp);
	},	
	// TICK:vname#rrggbb[aa][:fraction[:legend]]
	parse_tick: function (line)
	{
		var args = line.split(/:|#/);
		var color = this.parse_color(args[2]);
		this.create_tick(args[1], this.color2rgba(color), args[3], args[4]);
	},
	create_tick: function (vname, color, fraction, legend)
	{
		var gdp = new	RRDGraphDesc(this);
		gdp.gf = RRDGraphDesc.GF.TICK;
		gdp.vname = vname;
		gdp.vidx = this.find_var(vname);
		gdp.col = color;
		if (legend !== undefined) 
			gdp.yrule = fraction;
		if (legend === undefined) gdp.legend = '';
		else gdp.legend = '  '+legend;
		gdp.format = gdp.legend;
		this.gdes.push(gdp);
	},
	// GPRINT:vname:format
	parse_gprint: function(line)
	{
		var args = line.split(':');
		var strftime = false;
		var vname = args[1];
		var cf = args[2];
		var format = "";
		if (args.length > 3) {
			var m=0;
			for (var j = 3, xlen = args.length ; j < xlen ; j++) {
				if (args[j] === 'strftime') {
					strftime = true;
				} else { 
					if (m>0) {
						format = format + ':'+ args[j];
					} else {
						format = args[j];
					}
					m++;
				}
			}
		}
		this.create_gprint(vname, cf, format, strftime);
	},
	create_gprint: function (vname, cf, format, strftime)
	{
		var gdp = new	RRDGraphDesc(this);
		gdp.gf = RRDGraphDesc.GF.GPRINT;
		gdp.vname = vname;
		gdp.vidx = this.find_var(vname);
		gdp.legend = '';
		if (format === undefined) {
			gdp.format = cf;
			switch (this.gdes[gdp.vidx].gf) {
				case RRDGraphDesc.GF.DEF:
				case RRDGraphDesc.GF.CDEF:
					gdp.cf = this.gdes[gdp.vidx].cf;
					break;
  				case RRDGraphDesc.GF.VDEF:
					break;
				default:
					throw "Encountered unknown type variable "+this.gdes[gdp.vidx].vname;
			}
		} else {
			gdp.cf = this.cf_conv(cf);
			gdp.format = format;
		}
	//	if (this.gdes[gdp.vidx].gf === RRDGraphDesc.GF.VDEF && gdp.strftm === true) // FIXME
		if (this.gdes[gdp.vidx].gf === RRDGraphDesc.GF.VDEF && strtime === true) // FIXME
			gdp.strftm = true;
		this.gdes.push(gdp);
	},
	//COMMENT:text
	parse_comment: function (line)
	{
		var index = line.indexOf(':');
		this.create_comment(line.substr(index+1));
	},
	create_comment: function (text)
	{
		var gdp = new	RRDGraphDesc(this);
		gdp.gf = RRDGraphDesc.GF.COMMENT;
		gdp.vidx = -1;
		gdp.legend = text;
		this.gdes.push(gdp);
	},
	// TEXTALIGN:{left|right|justified|center}
	parse_textaling: function (line)
	{
		var index = line.indexOf(':');
		this.create_textaling(line.substr(index+1));
	},
	create_textalign: function (align)
	{
		var gdp = new	RRDGraphDesc(this);
		gdp.gf = RRDGraphDesc.GF.TEXTALIGN;
		gdp.vidx = -1;
		if (align === "left") {
			gdp.txtalign = RRDGraphDesc.TXA.LEFT;
		} else if (align === "right") {
			gdp.txtalign = RRDGraphDesc.TXA.RIGHT;
		} else if (align === "justified") {
			gdp.txtalign = RRDGraphDesc.TXA.JUSTIFIED;
		} else if (align === "center") {
			gdp.txtalign = RRDGraphDesc.TXA.CENTER;
		} else {
			throw "Unknown alignement type '"+align+"'";
    }
		this.gdes.push(gdp);
	},
	// VRULE:time#color[:legend][:dashes[=on_s[,off_s[,on_s,off_s]...]][:dash-offset=offset]]
	parse_vrule: function (line)
	{
		var args = line.split(/:|#/);
		this.create_vrule(args[1], '#'+args[2], args[3]);
	},
	create_vrule: function (time, color, legend)
	{
		var gdp = new	RRDGraphDesc(this);

		gdp.gf = RRDGraphDesc.GF.VRULE;
		gdp.xrule = time;
		gdp.col = color;
		if (legend === undefined) gdp.legend = '';
		else gdp.legend = '  '+legend;
		this.gdes.push(gdp);
	},
	// HRULE:value#color[:legend][:dashes[=on_s[,off_s[,on_s,off_s]...]][:dash-offset=offset]]
	parse_hrule: function (line)
	{
		var args = line.split(/:|#/);
		this.create_hrule(args[1], '#'+args[2], args[3]);
	},
	create_hrule: function (value, color, legend)
	{
		var gdp = new	RRDGraphDesc(this);

		gdp.gf = RRDGraphDesc.GF.HRULE;
		gdp.yrule = value;
		gdp.col = color;
		if (legend === undefined) gdp.legend = '';
		else gdp.legend = '  '+legend;
		
		this.gdes.push(gdp);
	},
	cf_conv: function (str) 
	{
		switch (str){
    	case 'AVERAGE': return RRDGraphDesc.CF.AVERAGE;
			case 'MIN': return RRDGraphDesc.CF.MINIMUM;
			case 'MAX': return RRDGraphDesc.CF.MAXIMUM;
			case 'LAST': return RRDGraphDesc.CF.LAST;
			case 'HWPREDICT': return RRDGraphDesc.CF.HWPREDICT;
			case 'MHWPREDICT': return RRDGraphDesc.CF.MHWPREDICT;
			case 'DEVPREDICT': return RRDGraphDesc.CF.DEVPREDICT;
			case 'SEASONAL': return RRDGraphDesc.CF.SEASONAL;
			case 'DEVSEASONAL': return RRDGraphDesc.CF.DEVSEASONAL;
			case 'FAILURES': return RRDGraphDesc.CF.FAILURES;
		}
		return -1;
	},
	tmt_conv: function (str)
	{
		switch (str) {
			case 'SECOND': return RRDGraph.TMT.SECOND;
			case 'MINUTE': return RRDGraph.TMT.MINUTE;
			case 'HOUR': return RRDGraph.TMT.HOUR;
			case 'DAY': return RRDGraph.TMT.DAY;
			case 'WEEK': return RRDGraph.TMT.WEEK;
			case 'MONTH': return RRDGraph.TMT.MONTH;
			case 'YEAR': return RRDGraph.TMT.YEAR;
		}
		return -1;
	},
  // struct graph_desc_t *gdes, const char *const str)
	vdef_parse: function(gdes, str)
	{ /* A VDEF currently is either "func" or "param,func" so the parsing is rather simple.  Change if needed. */
		var param;
		var func;
		var n;

    n = 0;	
		var index = str.indexOf(',');
		if (index != -1) {
			param = parseFloat(str.substr(0,index));
			func = str.substr(index+1);
    } else {
			param = Number.NAN;
			func = str;
    }

		gdes.vf = { op: null, param: null, val: null, when: null };
		
    if (func === 'PERCENT') gdes.vf.op = RRDGraphDesc.VDEF.PERCENT;
    else if (func === 'PERCENTNAN') gdes.vf.op = RRDGraphDesc.VDEF.PERCENTNAN;
    else if (func === 'MAXIMUM') gdes.vf.op = RRDGraphDesc.VDEF.MAXIMUM;
    else if (func === 'AVERAGE') gdes.vf.op = RRDGraphDesc.VDEF.AVERAGE;
    else if (func === 'STDEV') gdes.vf.op = RRDGraphDesc.VDEF.STDEV;
    else if (func === 'MINIMUM') gdes.vf.op = RRDGraphDesc.VDEF.MINIMUM;
    else if (func === 'TOTAL') gdes.vf.op = RRDGraphDesc.VDEF.TOTAL;
    else if (func === 'FIRST') gdes.vf.op = RRDGraphDesc.VDEF.FIRST;
    else if (func === 'LAST') gdes.vf.op = RRDGraphDesc.VDEF.LAST;
    else if (func === 'LSLSLOPE') gdes.vf.op = RRDGraphDesc.VDEF.LSLSLOPE;
    else if (func === 'LSLINT') gdes.vf.op = RRDGraphDesc.VDEF.LSLINT;
    else if (func === 'LSLCORREL') gdes.vf.op = RRDGraphDesc.VDEF.LSLCORREL;
    else {
        throw 'Unknown function "'+func+'" in VDEF "'+gdes.vame+'"';
    }

    switch (gdes.vf.op) {
			case RRDGraphDesc.VDEF.PERCENT:
    	case RRDGraphDesc.VDEF.PERCENTNAN:
        if (isNaN(param)) { /* no parameter given */
					throw "Function '"+func+"' needs parameter in VDEF '"+gdes.vname+"'";
        }
        if (param >= 0.0 && param <= 100.0) {
					gdes.vf.param = param;
					gdes.vf.val = Number.NAN;    /* undefined */
					gdes.vf.when = 0;  /* undefined */
        } else {
					throw "Parameter '"+param+"' out of range in VDEF '"+gdes.vname+"'";
        }
        break;
			case RRDGraphDesc.VDEF.MAXIMUM:
			case RRDGraphDesc.VDEF.AVERAGE:
			case RRDGraphDesc.VDEF.STDEV:
			case RRDGraphDesc.VDEF.MINIMUM:
			case RRDGraphDesc.VDEF.TOTAL:
			case RRDGraphDesc.VDEF.FIRST:
			case RRDGraphDesc.VDEF.LAST:
			case RRDGraphDesc.VDEF.LSLSLOPE:
			case RRDGraphDesc.VDEF.LSLINT:
			case RRDGraphDesc.VDEF.LSLCORREL:
        if (isNaN(param)) {
					gdes.vf.param = Number.NAN;
					gdes.vf.val = Number.NAN;
					gdes.vf.when = 0;
        } else {
					throw "Function '"+func+"' needs no parameter in VDEF '"+gdes.vname+"'";
        }
        break;
		}
  	return 0;
	},
	vdef_calc: function(gdi)
	{
    var src, dst;
    var data;
    var step, steps;

    dst = this.gdes[gdi];
    src = this.gdes[dst.vidx];
    //data = src.data + src.ds; // FIXME ¿?
		data = src.data;

    steps = (src.end - src.start) / src.step;

		switch (dst.vf.op) {
			case RRDGraphDesc.VDEF.PERCENT:
        var array = [];
        var field;	

        for (step = 0; step < steps; step++) {
            array[step] = data[step * src.ds_cnt];
        }
        array.sort(this.vdef_percent_compar); 
        field = Math.round((dst.vf.param * (steps - 1)) / 100.0);
        dst.vf.val = array[field];
        dst.vf.when = 0;   /* no time component */
        break;
  	  case RRDGraphDesc.VDEF.PERCENTNAN:
				var array = [];
				var field;
			//var nancount=0;

				field=0;
				for (step = 0; step < steps; step++) {
					if (!isNaN(data[step * src.ds_cnt])) {
						array[field] = data[step * src.ds_cnt];
					}
				}
				array.sort(vdef_percent_compar); 
				field = Math.round(dst.vf.param * (field - 1) / 100.0);
				dst.vf.val = array[field];
				dst.vf.when = 0;   /* no time component */
				break;
	    case RRDGraphDesc.VDEF.MAXIMUM:
				step = 0;
				while (step != steps && isNaN(data[step * src.ds_cnt])) step++;
				if (step === steps) {
					dst.vf.val = Number.NAN;
					dst.vf.when = 0;
				} else {
					dst.vf.val = data[step * src.ds_cnt];
					dst.vf.when = src.start + (step + 1) * src.step;
				}
				while (step != steps) {
					if (isFinite(data[step * src.ds_cnt])) {
						if (data[step * src.ds_cnt] > dst.vf.val) {
							dst.vf.val = data[step * src.ds_cnt];
							dst.vf.when = src.start + (step + 1) * src.step;
						}
					}
					step++;
				}
				break;
			case RRDGraphDesc.VDEF.TOTAL:
			case RRDGraphDesc.VDEF.STDEV:
			case RRDGraphDesc.VDEF.AVERAGE:
				var cnt = 0;
				var sum = 0.0;
				var average = 0.0;

				for (step = 0; step < steps; step++) {
					if (isFinite(data[step * src.ds_cnt])) {
						sum += data[step * src.ds_cnt];
						cnt++;
					}
				}

				if (cnt) {
					if (dst.vf.op === RRDGraphDesc.VDEF.TOTAL) {
						dst.vf.val = sum * src.step;
						dst.vf.when = 0;   /* no time component */
					} else if (dst.vf.op === RRDGraphDesc.VDEF.AVERAGE) {
						dst.vf.val = sum / cnt;
						dst.vf.when = 0;   /* no time component */
					} else {
						average = sum / cnt;
						sum = 0.0;
						for (step = 0; step < steps; step++) {
							if (isFinite(data[step * src.ds_cnt])) {
								sum += Math.pow((data[step * src.ds_cnt] - average), 2.0);
							}
						}
						dst.vf.val = Math.pow(sum / cnt, 0.5);
						dst.vf.when = 0;   /* no time component */
					}
				} else {
					dst.vf.val = Number.NAN;
					dst.vf.when = 0;
				}
				break;
			case RRDGraphDesc.VDEF.MINIMUM:
				step = 0;
				while (step != steps && isNaN(data[step * src.ds_cnt])) step++;
				if (step === steps) {
					dst.vf.val = Number.NAN;
					dst.vf.when = 0;
				} else {
					dst.vf.val = data[step * src.ds_cnt];
						dst.vf.when = src.start + (step + 1) * src.step;
				}
				while (step != steps) {
					if (isFinite(data[step * src.ds_cnt])) {
						if (data[step * src.ds_cnt] < dst.vf.val) {
							dst.vf.val = data[step * src.ds_cnt];
							dst.vf.when = src.start + (step + 1) * src.step;
						}
					}
					step++;
				}
				break;
			case RRDGraphDesc.VDEF.FIRST:
				step = 0;
				while (step != steps && isNaN(data[step * src.ds_cnt])) step++;
				if (step === steps) {    /* all entries were NaN */
					dst.vf.val = Number.NAN;
					dst.vf.when = 0;
				} else {
					dst.vf.val = data[step * src.ds_cnt];
					dst.vf.when = src.start + step * src.step;
				}
				break;
			case RRDGraphDesc.VDEF.LAST:
				step = steps - 1;
				while (step >= 0 && isNaN(data[step * src.ds_cnt])) step--;
				if (step < 0) { /* all entries were NaN */
					dst.vf.val = Number.NAN;
					dst.vf.when = 0;
				} else {
					dst.vf.val = data[step * src.ds_cnt];
					dst.vf.when = src.start + (step + 1) * src.step;
				}
				break;
			case RRDGraphDesc.VDEF.LSLSLOPE:
			case RRDGraphDesc.VDEF.LSLINT:
			case RRDGraphDesc.VDEF.LSLCORREL:
				var cnt = 0;
				var SUMx, SUMy, SUMxy, SUMxx, SUMyy, slope, y_intercept, correl;
	
				SUMx = 0;
				SUMy = 0;
				SUMxy = 0;
				SUMxx = 0;
				SUMyy = 0;
		
				for (step = 0; step < steps; step++) {
					if (isFinite(data[step * src.ds_cnt])) {
						cnt++;
						SUMx += step;
						SUMxx += step * step;
						SUMxy += step * data[step * src.ds_cnt];
						SUMy += data[step * src.ds_cnt];
						SUMyy += data[step * src.ds_cnt] * data[step * src.ds_cnt];
					}
				}
	
				slope = (SUMx * SUMy - cnt * SUMxy) / (SUMx * SUMx - cnt * SUMxx);
				y_intercept = (SUMy - slope * SUMx) / cnt;
				correl = (SUMxy - (SUMx * SUMy) / cnt) / Math.sqrt((SUMxx - (SUMx * SUMx) / cnt) * (SUMyy - (SUMy * SUMy) / cnt));
	
				if (cnt) {
					if (dst.vf.op === RRDGraphDesc.VDEF.LSLSLOPE) {
						dst.vf.val = slope;
						dst.vf.when = 0;
					} else if (dst.vf.op === RRDGraphDesc.VDEF.LSLINT) {
						dst.vf.val = y_intercept;
						dst.vf.when = 0;
					} else if (dst.vf.op === RRDGraphDesc.VDEF.LSLCORREL) {
						dst.vf.val = correl;
							dst.vf.when = 0;
					}
				} else {
					dst.vf.val = DNAN;
					dst.vf.when = 0;
				}
				break;
		}
		return 0;
	},
	vdef_percent_compar: function (a, b)
	{ /* Equality is not returned; this doesn't hurt except (maybe) for a little performance.  */
		/* NaN < -INF < finite_values < INF */
    if (isNaN(a)) return -1;
    if (isNaN(b)) return 1;
    /* NaN doesn't reach this part so INF and -INF are extremes.  The sign from isinf() is compatible with the sign we return */
    if (!isFinite(a)) {
				if (a === -Infinity) return -1;
				else return 1;
		}
    if (!isFinite(b)) {
				if (b === -Infinity) return -1;
				else return 1;
		}
    /* If we reach this, both values must be finite */
    if (a < b) return -1;
    else return 1;
	},	
	rrd_fetch: function(gdp, ft_step)
	{
    var cal_start, cal_end;
    var best_full_rra = 0, best_part_rra = 0, chosen_rra = 0;
    var best_full_step_diff = 0, best_part_step_diff = 0, tmp_step_diff = 0, tmp_match = 0, best_match = 0;
    var full_match, rra_base;
    var first_full = 1;
    var first_part = 1;
    var rrd;
    var data_ptr;
    var rows;

		try {
			if (this.rrdfiles[gdp.rrd]) {
				rrd = this.rrdfiles[gdp.rrd];
			} else {
				var bf = FetchBinaryURL(gdp.rrd);
				rrd = new RRDFile(bf);            
				this.rrdfiles[gdp.rrd] = rrd;
			}
		} catch(err) {
			console.log(err.message);
			console.log(err.stack);
			throw "File "+gdp.rrd+" is not a valid RRD archive!";
		}

		var cf_idx = gdp.cf;
		var ds_cnt = rrd.getNrDSs();
		var rra_cnt = rrd.getNrRRAs();

    for (var i = 0; i < ds_cnt; i++)
			gdp.ds_namv[i] = rrd.rrd_header.getDSbyIdx(i).getName();
		
		for (var i = 0; i < rra_cnt; i++) {
			var rra = rrd.getRRAInfo(i);
			if (this.cf_conv(rra.getCFName()) === cf_idx) {
				cal_end = (rrd.getLastUpdate() - (rrd.getLastUpdate() % (rra.getPdpPerRow() * rra.pdp_step))); 
				cal_start = (cal_end - (rra.getPdpPerRow() * rra.row_cnt * rra.pdp_step));
				full_match = gdp.end - gdp.start

				tmp_step_diff = Math.abs(ft_step - (rrd.getMinStep() * rra.pdp_cnt));
				if (cal_start <= gdp.start) {
					if (first_full || (tmp_step_diff < best_full_step_diff)) {
						first_full = 0;
						best_full_step_diff = tmp_step_diff;
						best_full_rra = i;
					}
				} else {
					tmp_match = full_match;
					if (cal_start > gdp.start) tmp_match -= (cal_start - gdp.start);
					if (first_part || (best_match < tmp_match) || (best_match === tmp_match && tmp_step_diff < best_part_step_diff)) {
						first_part = 0;
						best_match = tmp_match;
						best_part_step_diff = tmp_step_diff;
						best_part_rra = i;
					}
				}
			}
		}

		if (first_full === 0) chosen_rra = best_full_rra;
		else if (first_part === 0) chosen_rra = best_part_rra;
		else throw "the RRD does not contain an RRA matching the chosen CF";

		var rra_info = rrd.getRRAInfo(chosen_rra);
		var rra = rrd.getRRA(chosen_rra);

		ft_step = rrd.rrd_header.pdp_step * rra_info.getPdpPerRow();
    gdp.start -= (gdp.start % ft_step);
    gdp.end += (ft_step - gdp.end % ft_step);
    rows = (gdp.end - gdp.start) / ft_step + 1;

		gdp.ds_cnt = ds_cnt;
    data_ptr = 0;

    var rra_end_time = (rrd.getLastUpdate() - (rrd.getLastUpdate() % ft_step));
    var rra_start_time = (rra_end_time - (ft_step * (rra_info.row_cnt - 1)));
    /* here's an error by one if we don't be careful */
    var start_offset = (gdp.start + ft_step - rra_start_time) / ft_step;
    var end_offset = (rra_end_time - gdp.end) / ft_step;

		gdp.data = [];

		for (i = start_offset; i < rra.row_cnt - end_offset; i++) {
			if (i < 0) {
				for (var ii = 0; ii < ds_cnt; ii++) gdp.data[data_ptr++] = Number.NaN;
			} else if (i >= rra.row_cnt) {
	    	for (var ii = 0; ii < ds_cnt; ii++) gdp.data[data_ptr++] = Number.NaN;
			} else {
				for (var ii = 0; ii < ds_cnt; ii++) {
					 gdp.data[data_ptr++] = rra.getEl(i, ii);
				}
			}
		}
		return ft_step;
	}
}
