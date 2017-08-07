webpackJsonp([6],{0:function(e,t,n){"use strict";var r=n(774),o=n(15);o(document).ready(function(){o.getJSON("/data/videos.json",function(e){new r(document.getElementById("video-gallery"),{playerElem:document.getElementById("video-player"),descriptionElem:document.getElementById("video-description"),data:e})})})},365:function(e,t,n){"use strict";function r(e,t){var n,r=this;r.config=t=o.extend(r.defaults,t),r.elem=e,r.id=e.getAttribute("id"),n="data"in t==!1,r.nodes=n?e:r.render(t.data),r._initEvents(),t.saveState&&r.restoreItemsState(),n||(e.appendChild(r.nodes),r.nodes=e)}var o=n(15),i=n(368),a=n(367);r.STORAGE_KEY="nav_items",r.prototype.elem=null,r.prototype.nodes=null,r.prototype.id=null,r.prototype.config={},r.prototype.defaults={saveState:!0},r.prototype._events={},r.prototype.render=function(e){var t=this.templates;return i(t.main(e))},r.prototype.on=function(e,t){this._events[e]=t},r.prototype.fireEvent=function(e){var t;return e in this._events?(t=Array.prototype.slice.call(arguments,1),this._events[e].apply(this,t)):void 0},r.prototype._initEvents=function(){var e=this,t=e.nodes;o(t.querySelectorAll(".js-item-title")).on("click",function(t){var n=o(this),r=this.parentNode,i=o(r),a=i.attr("data-id"),s=n.hasClass("is_active"),u=i.hasClass("js-leaf");if(u)return void e._selectLeaf(this,t);if(s?e._closeBranch(this,t):e._openBranch(this,t),a){var l=e.getItemsStateInfo();l=null===l?{}:l,l[a]=!s,e.setItemsStateInfo(l)}})},r.prototype.getItemsStateInfo=function(){var e=r.STORAGE_KEY+"_"+this.id,t=a.getItem(e);return t},r.prototype.setItemsStateInfo=function(e){var t=r.STORAGE_KEY+"_"+this.id;a.setItem(t,e)},r.prototype.restoreItemsState=function(){var e=this,t=e.getItemsStateInfo();t&&o(e.nodes.querySelectorAll(".js-item-title")).each(function(){var n=o(this),r=n.parent(),i=r.attr("data-id");i in t&&(t[i]===!0?e._openBranch(this):e._closeBranch(this))})},r.prototype._openBranch=function(e,t){var n=this,r=o(e),i=r.parent();r.addClass("is_active"),i.addClass("_opened"),i.removeClass("_closed"),n.fireEvent("openBranch",t,e.parentNode,e)},r.prototype._closeBranch=function(e,t){var n=this,r=o(e),i=r.parent();r.removeClass("is_active"),i.addClass("_closed"),i.removeClass("_opened"),n.fireEvent("closeBranch",t,e.parentNode,e)},r.prototype._selectLeaf=function(e,t,n){var r=this,i=r.nodes;return o(i).find(".js-leaf-title").each(function(i,a){var s=o(a),u=s.hasClass("is_active");a===e?u||(r.fireEvent("selectLeaf",t,n,a),s.addClass("is_active")):s.removeClass("is_active")}),!0},r.prototype.templates={},r.prototype.templates.main=function(e){var t=this;return[[".nav-tree",t.itemsList(e)]]},r.prototype.templates.itemsList=function(e,t){for(var n,r,o,i=[],a=this,t=t||null,s=0,u=e.length;u>s;s++)n=e[s],o="content"in n&&n.content&&n.content.length>0,r=a.item(n,t),o&&r.push(a.itemsList(n.content,null===t?n.title:t)),i.push(r);return i},r.prototype.templates.item=function(e,t){var n,r=this,o="url"in e,i="title"in e,a="content"in e&&null!==e.content&&e.content.length>0,s=a,u=o?e.url:null,l=i?e.title:null;if(!i){for(u in e)l=e[u];o=!!u}n=null!==t?t+"."+l:l,e.id=n,e.title=l,e.url=u;var c=s?r.branchItem(e):r.leafItem(e);return c},r.prototype.templates.branchItem=function(e){var t=[".tree-item.tree-branch.js-item.js-branch._closed",{"data-id":e.id},[".tree-item-title.tree-branch-title.js-item-title.js-branch-title",["span.marker"],["span.text",e.title]]];return t},r.prototype.templates.leafItem=function(e){var t="url"in e,n=[".tree-item.tree-leaf.js-item.js-leaf",[(t?"a":"div")+".tree-item-title.tree-leaf-title.js-item-title.js-leaf-title",t?{href:e.url}:null,["span.marker"],["span.text",e.title]]];return n},e.exports=r},367:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}var o=n(323),i=r(o),a=n(180),s=r(a);e.exports={setItem:function(e,t){var n="undefined"==typeof t?"undefined":s["default"](t);return("string"!==n||"number"!==n||"boolean"!==n||null===n)&&(t=i["default"](t)),localStorage.setItem(e,t),arguments[1]},getItem:function(e){var t,n,r=localStorage.getItem(e);return null!==r&&(t=r.length,n="["===r.substring(0,1)&&"]"===r.substring(t-1,t)||"{"===r.substring(0,1)&&"}"===r.substring(t-1,t),n&&(r=JSON.parse(r))),r},removeItem:function(e){localStorage.removeItem(e)},getAllItems:function(){var e,t={},n=0;for(e in localStorage)t[e]=localStorage[e],n++;return n>0?t:null},clear:function(){localStorage.clear()}}},368:function(e,t){"use strict";function n(e,t){var o,i,a,s,u,l,c=t||document.createDocumentFragment(),f=e.length;for(o=0;f>o;o++)if(i=e[o],l=null===i||void 0===i||i===!1,!l)if("string"!=typeof i&&"number"!=typeof i)if("string"!=typeof i[0])void 0===i.nodeType?n(i,c):c.appendChild(i);else{if(s=r.parseSelector(i[0]),a=document.createElement(s.tag),i.shift(),delete s.tag,r.isObject(i[0]))for(u in i[0])s[u]=i[0][u];for(u in s)a.setAttribute(u,s[u]),delete s[u];c.appendChild(n(i,a))}else c.appendChild(document.createTextNode(i));return c}var r={isObject:function(e){return"[object Object]"===Object.prototype.toString.call(e)},isArray:function(e){return"[object Array]"===Object.prototype.toString.call(e)},selectorPatterns:[{name:"class",regex:new RegExp("\\.([a-zA-Z0-9-_])*")},{name:"id",regex:new RegExp("#([a-zA-Z0-9-_])*")}],parseSelector:function(e){for(var t=r.selectorPatterns,n={},o="",i=0,a=t.length;a>i;i++)for(var s=t[i],u=s.regex;u.test(e);){var l=u.exec(e);e=e.replace(l[0],""),o=l[0].substring(1),s.name in n?n[s.name]+=" "+o:n[s.name]=o}return""!==e?n.tag=e:n.tag="div",n}};e.exports=n},774:function(e,t,n){"use strict";function r(e,t){var n=new i(e,{data:t.data}),r=new a(t.playerElem,{width:"100%",height:480,videoId:"viiDaLpPfN4"});n.on("selectLeaf",function(e,n,i){var s,u=i.href,l=i.getAttribute("data-description")||"";o(i);s=a.getVideoIdFromUrl(u),s&&(r.playVideo(s),t.descriptionElem.innerHTML=l)}),o(e).find("a").on("click",function(e){var t=o(this),n=t.hasClass("is_external");n?t.attr("target","_blank"):e.preventDefault()})}var o=n(15),i=n(365),a=n(775);i.prototype.templates.leafItem=function(e){var t,n,r="url"in e,o="duration"in e,i="description"in e,s=r&&null===a.getVideoIdFromUrl(e.url),u={};t=["tree-item","tree-leaf","js-item","js-leaf","video-item"],n=["tree-item-title","tree-leaf-title","js-item-title","js-leaf-title","video-item-title"],s&&n.push("is_external"),r&&(u.href=e.url),i&&(u["data-description"]=e.description);var l=["."+t.join("."),[(r?"a.":"div.")+n.join("."),u,["span.marker"],["span.text",e.title],o?["span.duration",e.duration]:null]];return l},e.exports=r},775:function(e,t,n){"use strict";function r(e,t){var n,i=this;return n=document.createElement("div"),e="string"==typeof e?document.getElementById(e):e,e.appendChild(n),i._elem=n,i._config=r.getConfig(t),"undefined"==typeof YT||"undefined"==typeof YT.Player?o.getScript("https://www.youtube.com/iframe_api",function(){if("onYouTubeIframeAPIReady"in window){var e=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=function(){e(),i._createPlayer()}}else window.onYouTubeIframeAPIReady=function(){i._createPlayer()}}):i._createPlayer(),i}var o=n(15);r.EVENT={READY:"ready",PLAYING:"play",ENDED:"end",PAUSED:"pause",BUFFERING:"buffering",CUED:"cued"},r.THEME={DARK:"dark",LIGHT:"light"},r.QUALITY={DEFAULT:"default",SMALL:"small",MEDIUM:"medium",LARGE:"large",HD720:"hd720"},r.VIDEO_ID_REGEXP=/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,r.VIDEO_EMBED_URL="//www.youtube.com/embed/{video_id}",r._defaults={width:450,height:390,videoId:null,autoPlay:!1,autoHide:!1,showControls:!0,showInfo:!0,showRelativeVideos:!1,quality:r.QUALITY.DEFAULT,startTime:0,disableBranding:!0,inlinePlayback:!1,theme:r.THEME.DARK},r.getVideoIdFromUrl=function(e){var t=null,n=e.match(r.VIDEO_ID_REGEXP);return null!==n&&"undefined"!=typeof n[7]&&(t=n[7]),t},r.getConfig=function(e){var e=e||{};return o.extend({},r._defaults,e)},r.createConfigForYTPlayer=function(e){var t,e=e||r.getConfig(e);return t={width:e.width,height:e.height,videoId:e.videoId,playerVars:{vq:e.quality,rel:e.showRelativeVideos?1:0,autoplay:e.autoPlay?1:0,controls:e.showControls?1:0,showinfo:e.showInfo?1:0,autohide:e.autoHide?1:0,start:e.startTime,modestbranding:e.disableBranding?1:0,playsinline:e.inlinePlayback?1:0,theme:e.theme}}},r.prototype._elem=null,r.prototype._config=null,r.prototype._player=null,r.prototype._events={},r.prototype.isReady=!1,r.prototype._createPlayer=function(){var e,t=this,n=t._elem;e=new YT.Player(n,r.createConfigForYTPlayer(t._config)),e.addEventListener("onReady",function(){t.isReady=!0,t.fireEvent(r.EVENT.READY)}),e.addEventListener("onStateChange",function(e){var n=(t._events,r.EVENT);switch(e.data){case YT.PlayerState.ENDED:t.fireEvent(n.ENDED);break;case YT.PlayerState.PLAYING:t.fireEvent(n.PLAYING);break;case YT.PlayerState.PAUSED:t.fireEvent(n.PAUSED);break;case YT.PlayerState.BUFFERING:t.fireEvent(n.BUFFERING);break;case YT.PlayerState.CUED:t.fireEvent(n.CUED)}}),t._player=e},r.prototype.fireEvent=function(e){return e in this._events?this._events[e].call(this):void 0},r.prototype.on=function(e,t){this._events[e]=t},r.prototype.play=function(){this._player.playVideo()},r.prototype.pause=function(){this._player.pauseVideo()},r.prototype.stop=function(){this._player.stopVideo()},r.prototype.setQuality=function(e){this._player.setPlaybackQuality(e)},r.prototype.loadVideo=function(e){this._player.cueVideoById(e)},r.prototype.playVideo=function(e){var t=navigator.userAgent.match(/(iPad|iPhone|iPod)/g)?!0:!1;t?this.loadVideo(e):this._player.loadVideoById(e)},e.exports=r}});