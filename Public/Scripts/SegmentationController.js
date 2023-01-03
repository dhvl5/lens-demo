// -----JS CODE-----
// SegmentationController.js
// Version: 0.0.1
// Event: Initialized
// Description: A controller script that allows you to set a segmented background image
// or color effect masked by a segmentation mask texture

// @input Asset.Texture segmentationTexture

// @input bool useImage = true
// @ui {"widget": "group_start", "label": "Image", "showIf":"useImage"}
// @input Asset.Texture imageTexture
// @input float imageAlpha = 1.0 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}
// @input int imageBlendMode = 0 {"widget":"combobox", "values":[{"label":"Normal", "value":0}, {"label": "Screen", "value": 3}, {"label": "Multiply", "value": 10} ]}

// @input int fillMode = 1 {"widget":"combobox", "values":[{"label":"Fit", "value":0}, {"label":"Fill", "value":1}, {"label":"Stretch", "value":2}]}
// @ui {"widget": "group_end"}

// @input bool advanced = true
// @ui {"widget": "group_start", "label": "Advanced", "showIf":"advanced"}
// @input SceneObject[] enableOnSegmentation
// @input Component.Image imageBillboard
// @input Asset.Texture deviceCameraTexture
// @input Asset.Material fillMat
// @ui {"widget": "group_end"}

var fillModeEnums = [StretchMode.Fit, StretchMode.Fill, StretchMode.Stretch];
var objEnabled = false;

function turnOn(eventData) {
    configureImage();
}
var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(turnOn);

function update(eventData) {
    if (!script.segmentationTexture) {
        print("SegmentationController, ERROR: Make sure to set the segmentation texture");
        return;
    }

    if (script.segmentationTexture.control.getWidth() > 1 && !objEnabled) {
        for (var i = 0; i < script.enableOnSegmentation.length; i++) {
            script.enableOnSegmentation[i].enabled = true;
            objEnabled = true;
        }
    }
}
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(update);

function configureImage() {
    if (script.useImage) {
        if (imageSafetyCheck()) {
            configureFillImage();

            script.imageBillboard.mainPass.blendMode = script.imageBlendMode;
            script.imageBillboard.mainPass.baseColor = new vec4(1.0, 1.0, 1.0, script.imageAlpha);
        }
    } else {
        if (script.imageBillboard) {
            script.imageBillboard.enabled = false;
        }
    }
}

function imageSafetyCheck() {
    if (!script.imageBillboard) {
        print("SegmentationController, ERROR: Make sure the image Billboard is set");
        return false;
    }

    if (!script.imageTexture) {
        print("SegmentationController, ERROR: No image texture set");
        return false;
    }

    return true;
}

function configureFillImage() {
    script.imageBillboard.mainMaterial = script.fillMat;
    script.imageBillboard.mainPass.baseTex = script.imageTexture;
    script.imageBillboard.stretchMode = fillModeEnums[script.fillMode];
}