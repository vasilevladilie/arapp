import {VideoCapture} from "./videocapture.js"

function playVideoCamera () {
    let viewportElement = document.getElementById("viewport");
    if (viewportElement !== null) {
        let videoCapture = new VideoCapture(viewportElement);
        videoCapture.init();
        videoCapture.render();
    }
};

playVideoCamera();
