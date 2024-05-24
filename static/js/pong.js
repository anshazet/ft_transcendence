var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var fullscreenButton = document.querySelector("#unity-fullscreen-button");

var buildUrl = "static/Build";
var loaderUrl = buildUrl + "/Build.loader.js";
var config = {
	dataUrl: buildUrl + "/Build.data.unityweb",
	frameworkUrl: buildUrl + "/Build.framework.js.unityweb",
	codeUrl: buildUrl + "/Build.wasm.unityweb",
	streamingAssetsUrl: "StreamingAssets",
	companyName: "DefaultCompany",
	productName: "Pong",
	productVersion: "0.1",
};

canvas.style.width = "960px";
canvas.style.height = "600px";
loadingBar.style.display = "block";

var script = document.createElement("script");
script.src = loaderUrl;
var MyGameInstance = null;
script.onload = () =>
{
	createUnityInstance(canvas, config, (progress) => 
		{
      		progressBarFull.style.width = 100 * progress + "%";
        }).then((unityInstance) => 
		{
			MyGameInstance = unityInstance;
        	loadingBar.style.display = "none";
        	fullscreenButton.onclick = () =>
			{
            	unityInstance.SetFullscreen(1);
            };
        }).catch((message) =>
		{
        	alert(message);
        });
};

document.body.appendChild(script);

export {MyGameInstance};