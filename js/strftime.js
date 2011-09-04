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

 **/

"use strict";

function strftime (fmt, time)
{
	var d = new Date(time*1000);

	var days = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
	var fdays = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
	var fmonths = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	function pad2 (number) 
	{ 
		return (number < 10 ? '0' : '') + number 
	};

	function pad3(number) 
	{ 
		return (number < 10 ? '00' : number < 100 ? '0' : '') + number 
	};

	function lpad (str, padString, length) 
	{ 
		while (str.length < length) 
			str = padString + str; 
		return str; 
	};
		
	function format(match, opt) 
	{
		if (match === '%%') return '%';		

		switch (opt) {
			case 'a':
				return days[d.getDay()];
				break;
			case 'A':
				return fdays[d.getDay()];
				break;
			case 'b':
				return months[d.getMonth()];
				break;
			case 'B':
				return fmonths[d.getMonth()];
				break;
			case 'c':
				return d.toLocaleString();
				break;
			case 'd':
				return pad2(d.getDate());	
				break;
			case 'H':
				return pad2(d.getHours());	
				break;
			case 'I':	
				var hours = d.getHours()%12;
				return pad2(hours === 0 ? 12 : hours);
				break;
			case 'j':
				var d01 = new Date (date.getFullYear(), 0, 1);
				return pad3(Math.ceil((d01.getTime()-d.getTime())/86400000));
				break;
			case 'm':	
				return pad2(d.getMonth());
				break;
			case 'M':
				return pad2(d.getMinutes());
				break;
			case 'p':
				return d.getHours() >= 12 ? 'PM' : 'AM';
				break;
			case 's':
				return pad2(d.getSeconds());
				break;
			case 'S':
				return d.getTime()/1000;
				break;
//			%U The week number of the current year as a decimal number, range 00 to 53, starting with the first Sunday as the first day of week 01. See also %V and %W.
			case 'U': // FIXME weeks
				var d01 = new Date(d.getFullYear(),0,1);
				return pad2(Math.ceil((((d.getTime() - d01.getTime()) / 86400000) + d01.getDay()+1)/7)); // FIXME weeks
				break;
//			%V The ISO 8601:1988 week number of the current year as a decimal number, range 01 to 53, where week 1 is the first week that has at least 4 days in the current year, and with Monday as the first day of the week. See also %U and %W.
			case 'V': // FIXME weeks
				var d01 = new Date(d.getFullYear(),0,1); 
				return Math.ceil((((d.getTime() - d01.getTime()) / 86400000) + d01.getDay()+1)/7); // FIXME
				break;
			case 'w':
				return d.getDay();
				break;
//			%W The week number of the current year as a decimal number, range 00 to 53, starting with the first Monday as the first day of week 01.
			case 'W': // FIXME weeks
				var d01 = new Date(d.getFullYear(),0,1); 
				return Math.ceil((((d.getTime() - d01.getTime()) / 86400000) + d01.getDay()+1)/7); // FIXME
				break;
			case 'x':
				return pad2(d.getDate())+'/'+pad2(d.getMonth())+'/'+d.getFullYear()
				break;
			case 'X':
				return pad2(d.getHours())+':'+pad2(d.getMinutes())+':'+pad2(d.getSeconds());
				break;
			case 'y':	
				return pad2(d.getFullYear()%100);
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
};
