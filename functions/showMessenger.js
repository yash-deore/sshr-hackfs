export function showMessenger(iframeUrl, options) {
	window.XMTPIntegration = {};
	let defaultOptions = {
		iframeUrl: null,
		fullscreen: true,
		hideMenu: true,
		sideBarWidth: "800px",
		floatingActionButtonRightOffset: "15px",
		floatingActionButtonBottomOffset: "15px",
		finish: function () {
			/* (optional) Called when a user closes the popup */
		},
		close: function () {
			/* (optional) Called when a user closes the popup */
		},
		error: function (err) {
			console.error(err);
			/* (optional) Called if an error occurs when loading the popup. */
		},
	};
	window.XMTPIntegration.options = Object.assign(defaultOptions, options || {});
	let xmtpMainContainer;
	let xmtpPageElements = {
		xmtpPopup: {},
		xmtpPopupInner: {},
		singleFloatingActionButton: {},
		xmtpAppSidebar: {},
		IframePopup: {},
		connectorListPopup: {},
		connectorBlock: {},
		tripleFloatingActionButtons: {
			right: 200,
		},
	};
	for (let key in xmtpPageElements) {
		if (xmtpPageElements.hasOwnProperty(key)) {
			xmtpPageElements[key].id = camelCaseToDash(key);
		}
	}
	function getOption(optionName) {
		let optionValue;
		if (window.XMTPIntegration.options[optionName]) {
			optionValue = window.XMTPIntegration.options[optionName];
		}
		optionValue = optionValue || localStorage.getItem(optionName) || defaultOptions[optionName];
		return optionValue;
	}
	function logError(errorMessage) {
		console.error(errorMessage);
		if (window.XMTPIntegration.error) {
			window.XMTPIntegration.error(errorMessage);
		}
		if (defaultOptions.error) {
			defaultOptions.error(errorMessage);
		}
	}
	function camelCaseToDash(myStr) {
		return myStr.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
	}
	function getMessage() {
		let message = getOption("message");
		console.log("message is " + message);
		return message;
	}
	function getRecipientAddress() {
		let message = localStorage.getItem("recipientAddress");
		console.log("recipientAddress is " + message);
		return message;
	}
	// http://ejohn.org/blog/javascript-micro-templating/
	function template(str, data) {
		function timeDiff(date, suffix) {
			function numberEnding(number) {
				return number > 1 ? "s" : "";
			}
			let diff = (new Date().getTime() - date.getTime()) / 1000;
			let years = Math.floor(diff / 31536000);
			if (years) {
				return years + " year" + numberEnding(years) + suffix;
			}
			let days = Math.floor((diff %= 31536000) / 86400);
			if (days) {
				return days + " day" + numberEnding(days) + suffix;
			}
			let hours = Math.floor((diff %= 86400) / 3600);
			if (hours) {
				return hours + " hour" + numberEnding(hours) + suffix;
			}
			let minutes = Math.floor((diff %= 3600) / 60);
			if (minutes) {
				return minutes + " minute" + numberEnding(minutes) + suffix;
			}
			let seconds = Math.floor(diff % 60);
			if (seconds) {
				return seconds + " second" + numberEnding(seconds) + suffix;
			}
			return "just now";
		}
		data.timeDiff = timeDiff;
		let fn = new Function(
			"obj",
			"let p=[],print=function(){p.push.apply(p,arguments);};" +
			"with(obj){p.push('" +
			str
				.replace(/[\r\t\n]/g, " ")
				.split("<%")
				.join("\t")
				.replace(/((^|%>)[^\t]*)'/g, "$1\r")
				.replace(/\t=(.*?)%>/g, "',$1,'")
				.split("\t")
				.join("');")
				.split("%>")
				.join("p.push('")
				.split("\r")
				.join("\\'") +
			"');}return p.join('');"
		);
		return fn(data);
	}
	function createNewDiv(xmtpPageElement) {
		console.log("XMTPIntegration creating: ", xmtpPageElement);
		if (document.getElementById(xmtpPageElement.id)) {
			return;
		}
		let newDiv = document.createElement("div");
		newDiv.innerHTML = xmtpPageElement.template;
		document.body.appendChild(newDiv);
		xmtpPageElement.element = document.getElementById(xmtpPageElement.id);
		if (xmtpPageElement.onClickListener) {
			xmtpPageElement.element.addEventListener(
				"click",
				xmtpPageElement.onClickListener
			);
		}
	}
	function showElement(element, delayInMilliseconds) {
		if (element !== undefined) {
			if (delayInMilliseconds) {
				setTimeout(function () {
					element.style.display = "block";
				}, delayInMilliseconds);
			} else {
				element.style.display = "block";
			}
		}
	}
	function showPopup() {
		if (window.XMTPIntegration.options.fullscreen) {
			xmtpPageElements.xmtpPopup.style.width = "100%";
			xmtpPageElements.xmtpPopup.style.left = "0";
			xmtpPageElements.xmtpPopup.style.top = "0";
			xmtpPageElements.xmtpPopup.style.border = "none";
		} else {
			let width = window.innerWidth * 0.8;
			if (width > 1100) {
				width = 1100;
			}
			let left = (window.innerWidth - width) / 2;
			xmtpPageElements.xmtpPopup.style.width = width + "px";
			xmtpPageElements.xmtpPopup.style.left = left + "px";
		}
		xmtpPageElements.xmtpPopup.style.display = "block";
	}
	window.XMTPIntegration.setupPopupIframe = function () {
		function createQmShowHideButtonBlock() {
			createNewDiv(xmtpPageElements.singleFloatingActionButton);
			showElement(xmtpPageElements.singleFloatingActionButton.element, 5000);
		}
		function createHiddenIframePopupBlock() {
			if (document.getElementById("xmtp-main")) {
				return;
			}
			let IframePopupTemplate =
				'<div id="xmtp-popup">' +
				'    <div id="xmtp-popup-inner">' +
				'        <img id="xmtp-close" alt="x" src="https://app.quantimo.do/xmtp-connect/close.png">' +
				'        <div id="xmtp-main"></div>' +
				"    </div>" +
				"</div>";
			let newDiv = document.createElement("div");
			newDiv.innerHTML = template(IframePopupTemplate, {});
			document.body.appendChild(newDiv.children[0]);
			xmtpPageElements.xmtpPopup = document.getElementById("xmtp-popup");
			xmtpPageElements.xmtpPopupInner =
				document.getElementById("xmtp-popup-inner");
			xmtpPageElements.singleFloatingActionButton =
				document.getElementById("xmtp-close");
			xmtpPageElements.singleFloatingActionButton.addEventListener(
				"click",
				function () {
					xmtpPageElements.xmtpPopup.style.display = "none";
				}
			);
			xmtpMainContainer = document.getElementById("xmtp-main");
		}
		function createIframePopupStyles() {
			let IframeCss =
				"#show-xmtp { display: none; }" +
				"#xmtp-app-show-hide-button { height: 60px; width: 60px; position: fixed; bottom: 15px; right: 80px; cursor: pointer; }" +
				"#xmtp-frame { z-index: 999999; }" +
				";";
			let head = document.head || document.getElementsByTagName("head")[0];
			let style = document.createElement("style");
			style.type = "text/css";
			if (style.styleSheet) {
				style.styleSheet.cssText = IframeCss;
			} else {
				style.appendChild(document.createTextNode(IframeCss));
			}
			head.appendChild(style);
		}
		window.onload = function () {
			createQmShowHideButtonBlock();
			createHiddenIframePopupBlock();
			createIframePopupStyles();
			xmtpMainContainer.innerHTML =
				'<Iframe style="height:100%;width:100%;" id="xmtp-frame" src="' +
				window.XMTPIntegration.getIframeUrl() +
				'" frameborder="0"></Iframe>';
			console.log("XMTPIntegration setupPopupIframe: ", xmtpPageElements);
			showPopup();
		};
	};
	function toggleXmtpSidebar() {
		function openAppSidebar() {
			xmtpPageElements.xmtpAppSidebar.element.style.display = "block";
			xmtpPageElements.singleFloatingActionButton.element.setAttribute(
				"style",
				xmtpPageElements.singleFloatingActionButton.css.open
			);
		}
		function closeAppSidebar() {
			xmtpPageElements.xmtpAppSidebar.element.style.display = "none";
			xmtpPageElements.singleFloatingActionButton.element.setAttribute(
				"style",
				xmtpPageElements.singleFloatingActionButton.css.closed
			);
		}
		console.debug("Clicked button");
		if (xmtpPageElements.xmtpAppSidebar.element.style.display === "none") {
			openAppSidebar();
		} else {
			closeAppSidebar();
		}
	}
	window.XMTPIntegration.getIframeUrl = function () {
		let iframeUrl = getOption("iframeUrl");
		if (!iframeUrl) {
			iframeUrl =
				"https://xmtp.humanfs.io/dm/" +
				getRecipientAddress() +
				"/?message=" +
				getMessage()
		}
		console.log("XMTPIntegration getIframeUrl: ", iframeUrl);
		return iframeUrl;
	};
	window.XMTPIntegration.createSingleFloatingActionButton = function (
		iframeUrl
	) {
		if (iframeUrl) {
			window.XMTPIntegration.options.iframeUrl = iframeUrl;
		}
		let sharedButtonCss =
			"position:fixed; z-index:999998; height:60px; width:60px; cursor:pointer;";
		let rotatedCss =
			"transform: rotate(125deg); -ms-transform: rotate(125deg); -moz-transform: rotate(125deg); -webkit-transform: rotate(125deg); -o-transform: rotate(125deg)";
		let notRotatedCss =
			"transform: rotate(0deg); -ms-transform: rotate(0deg); -moz-transform: rotate(0deg); -webkit-transform: rotate(0deg); -o-transform: rotate(0deg);";
		xmtpPageElements.xmtpAppSidebar.template =
			'<div id="' +
			xmtpPageElements.xmtpAppSidebar.id +
			'" style="display: none; z-index: 999997; height: 100%; position: fixed;right: 0; top: 0; border: 1px solid #eee; background: white; ">' +
			'<Iframe style="height:100%;width:' +
			getOption("sideBarWidth") +
			';" id="xmtp-frame" frameborder="0" ' +
			'src="' +
			window.XMTPIntegration.getIframeUrl() +
			'">' +
			"</Iframe>" +
			"</div>";
		createNewDiv(xmtpPageElements.xmtpAppSidebar);
		xmtpPageElements.singleFloatingActionButton.css = {
			open:
				sharedButtonCss +
				"top:15px; right:" +
				getOption("sideBarWidth") +
				";" +
				rotatedCss,
			closed:
				sharedButtonCss +
				"bottom:" +
				getOption("floatingActionButtonBottomOffset") +
				"; right:" +
				getOption("floatingActionButtonRightOffset") +
				";" +
				notRotatedCss,
		};
		xmtpPageElements.singleFloatingActionButton.template =
			'<img style="' +
			xmtpPageElements.singleFloatingActionButton.css.closed +
			'display:none;" id="' +
			xmtpPageElements.singleFloatingActionButton.id +
			'" src="' +
			"https://static.quantimo.do/img/variable_categories/social-interaction.png" +
			'" alt="open chat"/>';
		xmtpPageElements.singleFloatingActionButton.onClickListener = function () {
			console.debug("Clicked XMTP button");
			toggleXmtpSidebar();
		};
		createNewDiv(xmtpPageElements.singleFloatingActionButton);
		showElement(xmtpPageElements.singleFloatingActionButton.element, 5000);
	};
	function addEventListenerToXmtpIntegrationButton() {
		window.onload = function () {
			let xmtpIntegrationButtonElement = document.getElementById(
				"xmtp-integration-button"
			);
			if (xmtpIntegrationButtonElement) {
				createNewDiv(xmtpPageElements.xmtpAppSidebar);
				xmtpIntegrationButtonElement.addEventListener(
					"click",
					toggleXmtpSidebar
				);
			}
		};
	}
	addEventListenerToXmtpIntegrationButton();
	if(!iframeUrl){
		iframeUrl = `https://xmtp-humanfs-mikepsinn.vercel.app/`;
	}
	window.XMTPIntegration.createSingleFloatingActionButton(iframeUrl);
}
