var Bridge = new function() {
 	this.iFrame = null;
 	
 	this.ngClientSrc = "https://localhost:9443/solutions/Material/index.html"

 	this.init = function(iFrame) {
 		this.iFrame = iFrame;

 		if (window.addEventListener) {
 			window.addEventListener("message", executeMethod, false);
 		} else if (window.attachEvent) {
 			window.attachEvent("onmessage", executeMethod);
 		}

 		function executeMethod(event) {
 			var method = event.data.method;
 			var callbackMethod = event.data.callbackMethod;
 			var params = event.data.params || [];

 			for (var i = 0; i < params.length; i++) {
 				if ((params[i] instanceof Object && params[i].hasOwnProperty("script"))) {
 				//	params[i] = new Function("var message = {method: " + JSON.stringify(params[i]) + ", params: Array.prototype.slice.call(arguments)}; Bridge.sendMessageToClient(message);");
 				}
 			}
 			var functionToCall = eval("(" + method + ")");
 			try {
 				var retVal = functionToCall.apply(null, params);

 				if (callbackMethod) {
 					Bridge.iFrame.contentWindow.postMessage({ method: callbackMethod, params: retVal }, '*');
 				}
 			} catch (e) {
 				console.log('Error calling function ' + method + ': ' + e.message);
 			}

 			function isFunction(stringFunction) {
 				try {
 					return eval("(" + stringFunction + ")") instanceof Function;
 				} catch (error) {
 					return false;
 				}
 			}
 		}
 	}

 	this.sendMessageToClient = function(msg) {
 		try {
 			this.iFrame.contentWindow.postMessage(msg, '*');
 		} catch (e) {
 			console.log(e.message);
 		}
 	}
 	
 	this.helloWorld = function(defaultText) {
 		if (!defaultText) {
 			defaultText = 'Hello World!';
 		}
 		return window.prompt("Prompt", defaultText);
 	}
 }