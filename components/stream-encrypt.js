import { useEffect, useState } from "react";
import { TextInput, Checkbox, Button, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { Integration } from "lit-ceramic-sdk";
import { DIDDataStore } from "@glazed/did-datastore";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { showNotification, updateNotification } from "@mantine/notifications";
import { Check, AlertCircle } from "tabler-icons-react";

import { ceramic, aliases } from "../constants";
import { useGlobalContext } from "../global/store";
import { accessControlArray } from "../functions/accessControl";
import { selectedShareData } from "../functions/selectedShareData";
import { EncryptedAccordion } from "./encrypted-accordion";
import { ethers } from "ethers";

let litCeramicIntegration = new Integration(
  "https://ceramic-clay.3boxlabs.com",
  "ethereum"
);

function initializeChat(form, response) {
  window.XMTPIntegration = { options: {} };
  var defaultOptions = {
    iframeUrl: null,
    publicApiKey: "CLIENT_ID",
    fullscreen: true,
    showButton: false,
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
  if (typeof window.options === "undefined") {
    window.options = defaultOptions;
  }
  var xmtpMainContainer;
  var xmtpPageElements = {
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
  for (var key in xmtpPageElements) {
    if (xmtpPageElements.hasOwnProperty(key)) {
      xmtpPageElements[key].id = camelCaseToDash(key);
    }
  }
  function getOption(optionName) {
    var optionValue;
    if (window.XMTPIntegration.options[optionName]) {
      optionValue = window.XMTPIntegration.options[optionName];
    } else {
      optionValue = defaultOptions[optionName];
    }
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
  function getPublicApiKey() {
    var publicApiKey = getOption("publicApiKey");
    console.log("publicApiKey is " + publicApiKey);
    return publicApiKey;
  }
  function getMessage() {
    var message = getOption("message");
    console.log("message is " + message);
    return message;
  }
  function getRecipientAddress() {
    var message = getOption("recipientAddress");
    console.log("recipientAddress is " + message);
    return message;
  }
  // http://ejohn.org/blog/javascript-micro-templating/
  function template(str, data) {
    function timeDiff(date, suffix) {
      function numberEnding(number) {
        return number > 1 ? "s" : "";
      }
      var diff = (new Date().getTime() - date.getTime()) / 1000;
      var years = Math.floor(diff / 31536000);
      if (years) {
        return years + " year" + numberEnding(years) + suffix;
      }
      var days = Math.floor((diff %= 31536000) / 86400);
      if (days) {
        return days + " day" + numberEnding(days) + suffix;
      }
      var hours = Math.floor((diff %= 86400) / 3600);
      if (hours) {
        return hours + " hour" + numberEnding(hours) + suffix;
      }
      var minutes = Math.floor((diff %= 3600) / 60);
      if (minutes) {
        return minutes + " minute" + numberEnding(minutes) + suffix;
      }
      var seconds = Math.floor(diff % 60);
      if (seconds) {
        return seconds + " second" + numberEnding(seconds) + suffix;
      }
      return "just now";
    }
    data.timeDiff = timeDiff;
    var fn = new Function(
      "obj",
      "var p=[],print=function(){p.push.apply(p,arguments);};" +
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
    var newDiv = document.createElement("div");
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
    if (delayInMilliseconds) {
      setTimeout(function () {
        element.style.display = "block";
      }, delayInMilliseconds);
    } else {
      element.style.display = "block";
    }
  }
  function applyCssStyles(cssStyles) {
    var head = document.head || document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = cssStyles;
    } else {
      style.appendChild(document.createTextNode(cssStyles));
    }
    head.appendChild(style);
  }
  function showPopup() {
    if (window.XMTPIntegration.options.fullscreen) {
      xmtpPageElements.xmtpPopup.style.width = "100%";
      xmtpPageElements.xmtpPopup.style.left = "0";
      xmtpPageElements.xmtpPopup.style.top = "0";
      xmtpPageElements.xmtpPopup.style.border = "none";
    } else {
      var width = window.innerWidth * 0.8;
      if (width > 1100) {
        width = 1100;
      }
      var left = (window.innerWidth - width) / 2;
      xmtpPageElements.xmtpPopup.style.width = width + "px";
      xmtpPageElements.xmtpPopup.style.left = left + "px";
    }
    xmtpPageElements.xmtpPopup.style.display = "block";
  }
  window.XMTPIntegration.setupPopupIframe = function (state) {
    function createQmShowHideButtonBlock() {
      createNewDiv(xmtpPageElements.singleFloatingActionButton);
      showElement(xmtpPageElements.singleFloatingActionButton.element, 5000);
    }
    function createHiddenIframePopupBlock() {
      if (document.getElementById("xmtp-main")) {
        return;
      }
      var IframePopupTemplate =
        '<div id="xmtp-popup">' +
        '    <div id="xmtp-popup-inner">' +
        '        <img id="xmtp-close" alt="x" src="https://app.quantimo.do/xmtp-connect/close.png">' +
        '        <div id="xmtp-main"></div>' +
        "    </div>" +
        "</div>";
      var newDiv = document.createElement("div");
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
      var IframeCss =
        "#show-xmtp { display: none; }" +
        "#xmtp-app-show-hide-button { height: 60px; width: 60px; position: fixed; bottom: 15px; right: 80px; cursor: pointer; }" +
        "#xmtp-frame { z-index: 999999; }" +
        ";";
      var head = document.head || document.getElementsByTagName("head")[0];
      var style = document.createElement("style");
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
    var iframeUrl = getOption("iframeUrl");
    if (!iframeUrl) {
      iframeUrl =
        "https://xmtp.humanfs.io/dm/" +
        getRecipientAddress() +
        "/?message=" +
        getMessage() +
        "&publicApiKey=" +
        getPublicApiKey();
      if (window.XMTPIntegration.options.hideMenu) {
        iframeUrl += "&hideMenu=" + window.XMTPIntegration.options.hideMenu;
      }
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
    var sharedButtonCss =
      "position:fixed; z-index:999998; height:60px; width:60px; cursor:pointer;";
    var rotatedCss =
      "transform: rotate(125deg); -ms-transform: rotate(125deg); -moz-transform: rotate(125deg); -webkit-transform: rotate(125deg); -o-transform: rotate(125deg)";
    var notRotatedCss =
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
      '"/>';
    xmtpPageElements.singleFloatingActionButton.onClickListener = function () {
      console.debug("Clicked XMTP button");
      toggleXmtpSidebar();
    };
    createNewDiv(xmtpPageElements.singleFloatingActionButton);
    showElement(xmtpPageElements.singleFloatingActionButton.element, 5000);
  };
  window.XMTPIntegration.createTripleFloatingActionButton = function () {
    var tripleFloatingActionButtonsCssStyles =
      ".xmtp-fab-container { bottom: 0; position: fixed; margin: 1em; right: " +
      xmtpPageElements.tripleFloatingActionButtons.right +
      "px;}" +
      ".xmtp-fab-buttons { box-shadow: 0px 5px 11px -2px rgba(0, 0, 0, 0.18), 0px 4px 12px -7px rgba(0, 0, 0, 0.15); border-radius: 50%; display: block; width: 56px; height: 56px; margin: 20px auto 0; position: relative; -webkit-transition: all .1s ease-out; transition: all .1s ease-out;}" +
      ".xmtp-fab-buttons:active, .xmtp-fab-buttons:focus, .xmtp-fab-buttons:hover { box-shadow: 0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);}" +
      ".xmtp-fab-buttons:not(:last-child) { width: 40px; height: 40px; margin: 20px auto 0; opacity: 0; -webkit-transform: translateY(50px); -ms-transform: translateY(50px); transform: translateY(50px);}" +
      ".xmtp-fab-container:hover .xmtp-fab-buttons:not(:last-child) { opacity: 1; -webkit-transform: none; -ms-transform: none; transform: none; margin: 15px auto 0;}" +
      ".xmtp-fab-buttons:nth-last-child(1) { -webkit-transition-delay: 25ms; transition-delay: 25ms; background-image: url('https://cbwconline.com/IMG/Share.svg'); background-size: contain;}" +
      ".xmtp-fab-buttons:not(:last-child):nth-last-child(2) { -webkit-transition-delay: 50ms; transition-delay: 20ms; background-image: url('https://cbwconline.com/IMG/Facebook-Flat.png'); background-size: contain;}" +
      ".xmtp-fab-buttons:not(:last-child):nth-last-child(3) { -webkit-transition-delay: 75ms; transition-delay: 40ms; background-image: url('https://cbwconline.com/IMG/Twitter-Flat.png'); background-size: contain;}" +
      ".xmtp-fab-buttons:not(:last-child):nth-last-child(4) { -webkit-transition-delay: 100ms; transition-delay: 60ms; background-image: url('https://cbwconline.com/IMG/Google%20Plus.svg'); background-size: contain;}" +
      "[tooltip]:before { bottom: 25%; font-family: arial; font-weight: 600; border-radius: 2px; background: #585858; color: #fff; content: attr(tooltip); font-size: 12px; visibility: hidden; opacity: 0; padding: 5px 7px; margin-right: 12px; position: absolute; right: 100%; white-space: nowrap;}" +
      "[tooltip]:hover:before,[tooltip]:hover:after { visibility: visible; opacity: 1;}";
    xmtpPageElements.tripleFloatingActionButtons.template =
      '<nav id="' +
      xmtpPageElements.tripleFloatingActionButtons.id +
      '" class="xmtp-fab-container"> ' +
      '<a href="#" class="xmtp-fab-buttons" tooltip="Google+"></a>' +
      '<a href="#" class="xmtp-fab-buttons" tooltip="Twitter"></a>' +
      '<a href="#" class="xmtp-fab-buttons" tooltip="Facebook"></a>' +
      '<a class="xmtp-fab-buttons" tooltip="Share" href="#"></a>' +
      "</nav>";
    window.onload = function () {
      createNewDiv(xmtpPageElements.tripleFloatingActionButtons);
      applyCssStyles(tripleFloatingActionButtonsCssStyles);
    };
  };
  function addEventListenerToXmtpIntegrationButton() {
    window.onload = function () {
      var xmtpIntegrationButtonElement = document.getElementById(
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
  const chatUrl = `https://xmtp-humanfs-mikepsinn.vercel.app/dm/${form.values.address}?message=${response}`;
  window.XMTPIntegration.createSingleFloatingActionButton(chatUrl);
}

export default function StreamEncrypt() {
  const router = useRouter();
  const { data } = useAccount();
  const dataStore = new DIDDataStore({ ceramic, model: aliases });

  const [globalStore, setGlobalStore] = useGlobalContext();
  const [encryptedStreamId, setEncryptedStreamId] = useState("");

  const form = useForm({
    initialValues: {
      address: "",
      message: "",
      basicDetails: false,
      personalDetails: false,
      medicalDetails: true,
    },
  });

  async function handleShare(e) {
    e.preventDefault();

    showNotification({
      id: "load-data-encrypt",
      loading: true,
      title: "Encrypting Patient data",
      message: "Please wait. Do not reload or leave the page.",
      autoClose: false,
      disallowClose: true,
    });

    if (ethers.utils.isAddress(form.values.address)) {
      const accessControlConditions = accessControlArray(
        `${data.address}`,
        form.values.address
      );

      const { patientBasic, patientPersonal, patientMedical, patientShares } =
        globalStore;
      const { message, basicDetails, personalDetails, medicalDetails } =
        form.values;

      const encryptArray = selectedShareData(
        basicDetails,
        patientBasic,
        personalDetails,
        patientPersonal,
        medicalDetails,
        patientMedical
      );
      const encryptObject = {
        message,
        dataArray: encryptArray,
      };
      const encryptString = JSON.stringify(encryptObject);
      console.log(encryptObject);

      const response = await litCeramicIntegration.encryptAndWrite(
        encryptString,
        accessControlConditions
      );
      console.log(response);
      setEncryptedStreamId(response);

      if (response.startsWith("something"))
        updateNotification({
          id: "load-data-encrypt",
          color: "red",
          title: "Data Encryption Unsuccessful",
          message: "Unable to Encrypt your data. Please try again.",
          icon: <AlertCircle />,
          autoClose: 3000,
        });
      else {
        const newShare = {
          streamId: response,
          doctorAddress: form.values.address,
        };

        if (patientShares === null) {
          const firstShare = {
            shares: [newShare],
          };
          await dataStore.set("patientDataShare", firstShare);
        } else {
          const allShares = patientShares.shares;
          allShares.push(newShare);
          const newShares = {
            shares: allShares,
          };
          // set
          await dataStore.set("patientDataShare", newShares);
        }

        console.log("DONE !!!");
        updateNotification({
          id: "load-data-encrypt",
          color: "teal",
          title: "Patient Data encrypted successfully",
          message: "You can share your Stream Id with your doctor now",
          icon: <Check />,
          autoClose: 6000,
        });
        initializeChat(form, response);
      }
    } else {
      updateNotification({
        id: "load-data-encrypt",
        color: "red",
        title: "Enter a Valid Ethereum Address",
        message: "Invalid Doctor's Address. Please try again.",
        icon: <AlertCircle />,
        autoClose: 3000,
      });
    }
  }

  function EncryptedStreamIdDisplay() {
    if (
      encryptedStreamId.length > 0 &&
      !encryptedStreamId.startsWith("something")
    )
      return <EncryptedAccordion encryptedResponse={encryptedStreamId} />;
  }

  useEffect(() => {
    const { authenticated, patientBasic, patientPersonal, patientMedical } =
      globalStore;
    if (
      authenticated === false ||
      data.address === undefined ||
      patientBasic === null ||
      patientPersonal === null ||
      patientMedical === null
    )
      router.push("/profile", null, { shallow: true });

    litCeramicIntegration.startLitClient(window);
  }, []);

  return (
    <div>
      <form onSubmit={handleShare}>
        <Checkbox
          mt="lg"
          label="Patient Basic Details"
          {...form.getInputProps("basicDetails", { type: "checkbox" })}
        />

        <Checkbox
          mt="lg"
          label="Patient Personal Details"
          {...form.getInputProps("personalDetails", { type: "checkbox" })}
        />

        <Checkbox
          mt="lg"
          label="Patient Medical Details"
          {...form.getInputProps("medicalDetails", { type: "checkbox" })}
        />
        <br />

        <TextInput
          radius="xl"
          size="md"
          required
          placeholder="Doctor's address : 0x0000000000000000000000000000000000000000"
          {...form.getInputProps("address")}
        />
        <br />

        <TextInput
          radius="xl"
          size="md"
          required
          placeholder="Message for the doctor"
          {...form.getInputProps("message")}
        />
        <br />

        <Button fullWidth size="md" radius="xl" type="submit">
          Share
        </Button>
      </form>

      {EncryptedStreamIdDisplay()}
    </div>
  );
}
