webpackJsonp([7],{852:function(t,e,o){"use strict";function n(t,e){var o=r(".all-speak-kotlin_img");r("[data-svg-id='"+t+"'] > a").toggleClass("_hover",e),o.find("#"+t+" .hover").toggle(e),o.find("#"+t+" .default").toggle(!e)}function i(t){var e=document.querySelector('[data-svg-id="'+t+'"]'),o=document.getElementById(t);o||console.log(t),e&&(e.setAttribute("data-aos","animation"),e.setAttribute("data-aos-anchor",".all-speak-kotlin"),e.setAttribute("data-aos-anchor-placement","top-center")),o.setAttribute("data-aos","animation"),o.setAttribute("data-aos-anchor",".all-speak-kotlin"),o.setAttribute("data-aos-anchor-placement","top-center")}o(853);var a=o(854),r=o(11);o(855).polyfill(),r(document).ready(function(){r.ajax({url:"/assets/images/all_speak_kotlin.svg",dataType:"xml"}).done(function(t){var e=t.documentElement,o=r(".all-speak-kotlin_img");r(e).find("g").each(function(t,e){var o=e.getAttribute("id");null!=o&&(o.endsWith("_default")?(e.removeAttribute("id"),e.setAttribute("class","svg-link default")):o.endsWith("_hover")&&(e.removeAttribute("id"),e.setAttribute("class","svg-link hover"),e.setAttribute("display","none")))}),o.append(t.documentElement),o.find("g.hover").parent().on("click",function(){var t=r('[data-svg-id="'+this.getAttribute("id")+'"] > a').attr("href");window.open(t)}).on("mouseenter",function(){n(this.getAttribute("id"),!0)}).on("mouseleave",function(){n(this.getAttribute("id"),!1)}),r(".scroll-down-hint").on("click",function(){window.scroll({top:window.document.documentElement.offsetHeight,left:0,behavior:"smooth"})}),r(".all-speak-kotlin_link-button").on("mouseenter",function(){n(this.parentNode.getAttribute("data-svg-id"),!0)}).on("mouseleave",function(){n(this.parentNode.getAttribute("data-svg-id"),!1)}),["talking_kotlin","reddit","slack","linkedin","Layer_3","kotlin_talks","Layer_6","Layer_7","Layer_8","kotlin_forum","stackoverflow","twitter","google","youtrack"].forEach(i),a.init({duration:500})})})},853:function(t,e){},854:function(t,e,o){!function(e,o){t.exports=o()}(0,function(){return function(t){function e(n){if(o[n])return o[n].exports;var i=o[n]={exports:{},id:n,loaded:!1};return t[n].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var o={};return e.m=t,e.c=o,e.p="dist/",e(0)}([function(t,e,o){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}var i=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var o=arguments[e];for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n])}return t},a=o(1),r=(n(a),o(5)),c=n(r),l=o(6),s=n(l),u=o(7),d=n(u),f=o(8),m=n(f),p=o(9),v=n(p),b=o(10),g=n(b),h=o(13),y=n(h),w=[],k=!1,x=document.all&&!window.atob,_={offset:120,delay:0,easing:"ease",duration:400,disable:!1,once:!1,startEvent:"DOMContentLoaded"},A=function(){return!(arguments.length<=0||void 0===arguments[0])&&arguments[0]&&(k=!0),k?(w=(0,g.default)(w,_),(0,v.default)(w,_.once),w):void 0},j=function(){w=(0,y.default)(),A()},E=function(){w.forEach(function(t,e){t.node.removeAttribute("data-aos"),t.node.removeAttribute("data-aos-easing"),t.node.removeAttribute("data-aos-duration"),t.node.removeAttribute("data-aos-delay")})},O=function(t){return!0===t||"mobile"===t&&m.default.mobile()||"phone"===t&&m.default.phone()||"tablet"===t&&m.default.tablet()||"function"==typeof t&&!0===t()},T=function(t){return _=i(_,t),w=(0,y.default)(),O(_.disable)||x?E():(document.querySelector("body").setAttribute("data-aos-easing",_.easing),document.querySelector("body").setAttribute("data-aos-duration",_.duration),document.querySelector("body").setAttribute("data-aos-delay",_.delay),"DOMContentLoaded"===_.startEvent&&["complete","interactive"].indexOf(document.readyState)>-1?A(!0):"load"===_.startEvent?window.addEventListener(_.startEvent,function(){A(!0)}):document.addEventListener(_.startEvent,function(){A(!0)}),window.addEventListener("resize",(0,s.default)(A,50,!0)),window.addEventListener("orientationchange",(0,s.default)(A,50,!0)),window.addEventListener("scroll",(0,c.default)(function(){(0,v.default)(w,_.once)},99)),document.addEventListener("DOMNodeRemoved",function(t){var e=t.target;e&&1===e.nodeType&&e.hasAttribute&&e.hasAttribute("data-aos")&&(0,s.default)(j,50,!0)}),(0,d.default)("[data-aos]",j),w)};t.exports={init:T,refresh:A,refreshHard:j}},function(t,e){},,,,function(t,e,o){"use strict";function n(t,e,o){var n=!0,a=!0;if("function"!=typeof t)throw new TypeError(c);return i(o)&&(n="leading"in o?!!o.leading:n,a="trailing"in o?!!o.trailing:a),r(t,e,{leading:n,maxWait:e,trailing:a})}function i(t){var e=void 0===t?"undefined":a(t);return!!t&&("object"==e||"function"==e)}var a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},r=o(6),c="Expected a function";t.exports=n},function(t,e){"use strict";function o(t,e,o){function n(e){var o=v,n=b;return v=b=void 0,A=e,h=t.apply(n,o)}function a(t){return A=t,y=setTimeout(u,e),j?n(t):h}function r(t){var o=t-w,n=t-A,i=e-o;return E?x(i,g-n):i}function l(t){var o=t-w,n=t-A;return!w||o>=e||0>o||E&&n>=g}function u(){var t=_();return l(t)?d(t):void(y=setTimeout(u,r(t)))}function d(t){return clearTimeout(y),y=void 0,O&&v?n(t):(v=b=void 0,h)}function f(){void 0!==y&&clearTimeout(y),w=A=0,v=b=y=void 0}function m(){return void 0===y?h:d(_())}function p(){var t=_(),o=l(t);if(v=arguments,b=this,w=t,o){if(void 0===y)return a(w);if(E)return clearTimeout(y),y=setTimeout(u,e),n(w)}return void 0===y&&(y=setTimeout(u,e)),h}var v,b,g,h,y,w=0,A=0,j=!1,E=!1,O=!0;if("function"!=typeof t)throw new TypeError(s);return e=c(e)||0,i(o)&&(j=!!o.leading,E="maxWait"in o,g=E?k(c(o.maxWait)||0,e):g,O="trailing"in o?!!o.trailing:O),p.cancel=f,p.flush=m,p}function n(t){var e=i(t)?w.call(t):"";return e==d||e==f}function i(t){var e=void 0===t?"undefined":l(t);return!!t&&("object"==e||"function"==e)}function a(t){return!!t&&"object"==(void 0===t?"undefined":l(t))}function r(t){return"symbol"==(void 0===t?"undefined":l(t))||a(t)&&w.call(t)==m}function c(t){if("number"==typeof t)return t;if(r(t))return u;if(i(t)){var e=n(t.valueOf)?t.valueOf():t;t=i(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(p,"");var o=b.test(t);return o||g.test(t)?h(t.slice(2),o?2:8):v.test(t)?u:+t}var l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},s="Expected a function",u=NaN,d="[object Function]",f="[object GeneratorFunction]",m="[object Symbol]",p=/^\s+|\s+$/g,v=/^[-+]0x[0-9a-f]+$/i,b=/^0b[01]+$/i,g=/^0o[0-7]+$/i,h=parseInt,y=Object.prototype,w=y.toString,k=Math.max,x=Math.min,_=Date.now;t.exports=o},function(t,e){"use strict";function o(t,e){r.push({selector:t,fn:e}),!c&&a&&(c=new a(n),c.observe(i.documentElement,{childList:!0,subtree:!0,removedNodes:!0})),n()}function n(){for(var t,e,o=0,n=r.length;n>o;o++){t=r[o],e=i.querySelectorAll(t.selector);for(var a,c=0,l=e.length;l>c;c++)a=e[c],a.ready||(a.ready=!0,t.fn.call(a,a))}}Object.defineProperty(e,"__esModule",{value:!0});var i=window.document,a=window.MutationObserver||window.WebKitMutationObserver,r=[],c=void 0;e.default=o},function(t,e){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,o,n){return o&&t(e.prototype,o),n&&t(e,n),e}}(),i=function(){function t(){o(this,t)}return n(t,[{key:"phone",value:function(){var t=!1;return function(e){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4)))&&(t=!0)}(navigator.userAgent||navigator.vendor||window.opera),t}},{key:"mobile",value:function(){var t=!1;return function(e){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4)))&&(t=!0)}(navigator.userAgent||navigator.vendor||window.opera),t}},{key:"tablet",value:function(){return this.mobile()&&!this.phone()}}]),t}();e.default=new i},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=function(t,e,o){var n=t.node.getAttribute("data-aos-once");e>t.position?t.node.classList.add("aos-animate"):void 0!==n&&("false"===n||!o&&"true"!==n)&&t.node.classList.remove("aos-animate")},n=function(t,e){var n=window.pageYOffset,i=window.innerHeight;t.forEach(function(t,a){o(t,i+n,e)})};e.default=n},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=o(11),i=function(t){return t&&t.__esModule?t:{default:t}}(n),a=function(t,e){return t.forEach(function(t,o){t.node.classList.add("aos-init"),t.position=(0,i.default)(t.node,e.offset)}),t};e.default=a},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=o(12),i=function(t){return t&&t.__esModule?t:{default:t}}(n),a=function(t,e){var o=0,n=0,a=window.innerHeight,r={offset:t.getAttribute("data-aos-offset"),anchor:t.getAttribute("data-aos-anchor"),anchorPlacement:t.getAttribute("data-aos-anchor-placement")};switch(r.offset&&!isNaN(r.offset)&&(n=parseInt(r.offset)),r.anchor&&document.querySelectorAll(r.anchor)&&(t=document.querySelectorAll(r.anchor)[0]),o=(0,i.default)(t).top,r.anchorPlacement){case"top-bottom":break;case"center-bottom":o+=t.offsetHeight/2;break;case"bottom-bottom":o+=t.offsetHeight;break;case"top-center":o+=a/2;break;case"bottom-center":o+=a/2+t.offsetHeight;break;case"center-center":o+=a/2+t.offsetHeight/2;break;case"top-top":o+=a;break;case"bottom-top":o+=t.offsetHeight+a;break;case"center-top":o+=t.offsetHeight/2+a}return r.anchorPlacement||r.offset||isNaN(e)||(n=e),o+n};e.default=a},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=function(t){for(var e=0,o=0;t&&!isNaN(t.offsetLeft)&&!isNaN(t.offsetTop);)e+=t.offsetLeft-("BODY"!=t.tagName?t.scrollLeft:0),o+=t.offsetTop-("BODY"!=t.tagName?t.scrollTop:0),t=t.offsetParent;return{top:o,left:e}};e.default=o},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=function(t){t=t||document.querySelectorAll("[data-aos]");var e=[];return[].forEach.call(t,function(t,o){e.push({node:t})}),e};e.default=o}])})},855:function(t,e,o){!function(e,o,n){"use strict";function i(){function t(t,e){this.scrollLeft=t,this.scrollTop=e}function i(t){return.5*(1-Math.cos(Math.PI*t))}function a(t){if("object"!=typeof t||null===t||t.behavior===n||"auto"===t.behavior||"instant"===t.behavior)return!0;if("object"==typeof t&&"smooth"===t.behavior)return!1;throw new TypeError("behavior not valid")}function r(t){var n,i,a;do{t=t.parentNode,n=t===o.body,i=t.clientHeight<t.scrollHeight||t.clientWidth<t.scrollWidth,a="visible"===e.getComputedStyle(t,null).overflow}while(!n&&(!i||a));return n=i=a=null,t}function c(t){t.frame=e.requestAnimationFrame(c.bind(e,t));var o,n,a,r=f(),l=(r-t.startTime)/u;if(l=l>1?1:l,o=i(l),n=t.startX+(t.x-t.startX)*o,a=t.startY+(t.y-t.startY)*o,t.method.call(t.scrollable,n,a),n===t.x&&a===t.y)return void e.cancelAnimationFrame(t.frame)}function l(n,i,a){var r,l,s,u,m=f();n===o.body?(r=e,l=e.scrollX||e.pageXOffset,s=e.scrollY||e.pageYOffset,u=d.scroll):(r=n,l=n.scrollLeft,s=n.scrollTop,u=t),c({scrollable:r,method:u,startTime:m,startX:l,startY:s,x:i,y:a,frame:void 0})}if(!("scrollBehavior"in o.documentElement.style)){var s=e.HTMLElement||e.Element,u=468,d={scroll:e.scroll||e.scrollTo,scrollBy:e.scrollBy,scrollIntoView:s.prototype.scrollIntoView},f=e.performance&&e.performance.now?e.performance.now.bind(e.performance):Date.now;e.scroll=e.scrollTo=function(){if(a(arguments[0]))return void d.scroll.call(e,arguments[0].left||arguments[0],arguments[0].top||arguments[1]);l.call(e,o.body,~~arguments[0].left,~~arguments[0].top)},e.scrollBy=function(){if(a(arguments[0]))return void d.scrollBy.call(e,arguments[0].left||arguments[0],arguments[0].top||arguments[1]);l.call(e,o.body,~~arguments[0].left+(e.scrollX||e.pageXOffset),~~arguments[0].top+(e.scrollY||e.pageYOffset))},s.prototype.scrollIntoView=function(){if(a(arguments[0]))return void d.scrollIntoView.call(this,arguments[0]||!0);var t=r(this),n=t.getBoundingClientRect(),i=this.getBoundingClientRect();t!==o.body?(l.call(this,t,t.scrollLeft+i.left-n.left,t.scrollTop+i.top-n.top),e.scrollBy({left:n.left,top:n.top,behavior:"smooth"})):e.scrollBy({left:i.left,top:i.top,behavior:"smooth"})}}}t.exports={polyfill:i}}(window,document)}},[852]);