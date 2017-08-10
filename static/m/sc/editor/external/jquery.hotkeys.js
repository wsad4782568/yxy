/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/

(function(jQuery){
	
	jQuery.hotkeys = {
		version: "0.8",

		specialKeys: {
			8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
		},
	
		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
			".": ">",  "/": "?",  "\\": "|"
		}
	};

	function keyHandler( handleObj ) {
		// Only care when a possible input has been specified
		if ( typeof handleObj.data !== "string" ) {
			return;
		}
		
		var origHandler = handleObj.handler,
			keys = handleObj.data.toLowerCase().split(" "),
			textAcceptingInputTypes = ["text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime", "datetime-local", "search", "color"];
	
		handleObj.handler = function( event ) {
			// Don't fire in text-accepting inputs that we didn't directly bind to
			if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				jQuery.inArray(event.target.type, textAcceptingInputTypes) > -1 ) ) {
				return;
			}
			
			// Keypress represents characters, not special keys
			var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
				character = String.fromCharCode( event.which ).toLowerCase(),
				key, modif = "", possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if ( event.altKey && special !== "alt" ) {
				modif += "alt+";
			}

			if ( event.ctrlKey && special !== "ctrl" ) {
				modif += "ctrl+";
			}
			
			// TODO: Need to make sure this works consistently across platforms
			if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
				modif += "meta+";
			}

			if ( event.shiftKey && special !== "shift" ) {
				modif += "shift+";
			}

			if ( special ) {
				possible[ modif + special ] = true;

			} else {
				possible[ modif + character ] = true;
				possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift+" ) {
					possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
				}
			}

			for ( var i = 0, l = keys.length; i < l; i++ ) {
				if ( possible[ keys[i] ] ) {
					return origHandler.apply( this, arguments );
				}
			}
		};
	}

	jQuery.each([ "keydown", "keyup", "keypress" ], function() {
		jQuery.event.special[ this ] = { add: keyHandler };
	});

})( jQuery );

/**
 * Created by sec on 15-12-21.
 */
var qix=(
	function(){
		function getQs(str){
			var result = location.search.match(new RegExp("[\?\&]" + str + "=([^\&]+)", "i"));
			if (result == null || result.length < 1) {
				return ""
			}
			return result[1]
		}
		function uploader(browse_button,progress_bar_percent,progress_bar_width,key_ipt){
			Qiniu.uploader({
				runtimes: 'html5,flash,html4',
				browse_button:browse_button,
				container: 'container',
				drop_element: 'container',
				filters : [
					{title : "音频", extensions : "mp3"}
				],
				max_file_size: '50000mb',
				flash_swf_url: '/include/plupload/Moxie.swf',
				unique_names: true ,
				save_key: false,
				dragdrop: true,
				chunk_size: '4mb',
				uptoken_url: '/app/cloud/qiniu/token/get?place=keny',
				domain: 'http://keny.qiniudn.com/',
				auto_start: true,

				init: {
					'FilesAdded': function(up, files) {

					},
					'BeforeUpload': function(up, file) {

					},
					'UploadProgress': function(up, file) {
						// console.log(file.percent);
						$(progress_bar_percent).html("进度"+file.percent+"%");
						$(progress_bar_width).width(file.percent+"%");
					},
					'UploadComplete': function() {
						setTimeout(function(){
							$(progress_bar_percent).html("");
							$(progress_bar_width).width("0%");
						},200);
					},
					'FileUploaded': function(up, file, info) {
						// 每个文件上传成功后,处理相关的事情
						info = eval("("+info+");");
						var key = info.key;
						//$(key_ipt).val(key);
						$.post("/app/article/upload/mp3",{
							path:key
						},function(data){
							$(key_ipt).val(data.fileData);
							alert("上传完成！");
						},"json");
					},
					'Error': function(up, err, errTip) {

					},
					'Key':function(up,file){
						for(var i in file){
							//alert (i+""+file[i]);
						}
						return Date.now();

					}
				}
			});
		}
		function oralUploader(browse_button,progress_bar_percent,progress_bar_width,key_ipt){
			Qiniu.uploader({
				runtimes: 'html5,flash,html4',
				browse_button:browse_button,
				container: 'container',
				drop_element: 'container',
				filters : [
					{title : "图片", extensions : "png,jpg,jpeg,gif"}
				],
				max_file_size: '50000mb',
				flash_swf_url: '/include/plupload/Moxie.swf',
				unique_names: true ,
				save_key: false,
				dragdrop: true,
				chunk_size: '4mb',
				uptoken_url: '/app/cloud/qiniu/token/get?place=keny-0',
				domain: 'http://images.shopten.cn/',
				auto_start: true,

				init: {
					'FilesAdded': function(up, files) {

					},
					'BeforeUpload': function(up, file) {

					},
					'UploadProgress': function(up, file) {
						//console.log(file.percent);
						$(progress_bar_percent).html("进度"+file.percent+"%");
						$(progress_bar_width).width(file.percent+"%");
					},
					'UploadComplete': function() {
						setTimeout(function(){
							$(progress_bar_percent).html("");
							$(progress_bar_width).width("0%");
						},200);
					},
					'FileUploaded': function(up, file, info) {
						// 每个文件上传成功后,处理相关的事情
						info = eval("("+info+");");
						var key = info.key;
						//$(key_ipt).val(key);
						$.post("/app/article/upload/oral/mp3",{
							path:key
						},function(data){
							$(key_ipt).val(data.fileData);
							alert("上传完成！");
						},"json");
					},
					'Error': function(up, err, errTip) {

					},
					'Key':function(up,file){
						for(var i in file){
							//alert (i+""+file[i]);
						}

						return Date.now();

					}
				}
			});
		}
		function msgBox(option){

			var msg = option.hasOwnProperty("msg")?option.msg:"";
			var timeout = option.hasOwnProperty("timeout")?option.timeout:2000;
			var className=option.hasOwnProperty("className")?option.className:"default";

			var msgElement=document.createElement("div");
			msgElement.className="e-msg-bar animated fadeInDown alert-"+className;
			msgElement.innerHTML=msg;
			document.getElementsByTagName("body")[0].appendChild(msgElement);
			setTimeout((function(){
				return function(){
					msgElement.className="e-msg-bar animated fadeOutUp alert-"+className;
				}
			})(this),timeout);
			setTimeout((function(){
				return function(){
					msgElement.parentNode.removeChild(msgElement);
				}
			})(this),timeout+1000)
		};
		return {
			getQs:getQs,
			uploader:uploader,
			oralUploader:oralUploader,
			msgBox:msgBox
		}
	}
)();