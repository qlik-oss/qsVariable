# qsVariable
Variable extension for Qlik Sense

Allows the user to set the value of a variable.
Four different ways to render:
- Buttons: one button for each defined value
- Select: HTML select containing all defined values
- Field: an input field, no validation, anything can be entered
- Slider: a HTML slider, you can define min (default 0), max (default 100) and step (default 1)

You can have an expression to define the available values in a dropdown or buttons. 

# Getting started

## Installation
1. Download the extension zip, `qlik-variable-input.zip`, from the latest release (https://github.com/qlik-oss/qsVariable/releases/latest)
2. Install the extension:
    a. **Qlik Sense Desktop**: unzip to a directory under [My Documents]/Qlik/Sense/Extensions.
    b. **Qlik Sense Server**: import the zip file in the QMC.

## New in version 6.0
Bugfixes and removed styling alternatives.

## News in version 5.2
The property 'Thin Header' will make sure that if you do not have a title or subtitle the header will be very thin,
to avoid buttons getting cut off.

## News in version 5.0
Build process has been modified so that the css style sheet is now included in the packaged js file. No separate loading of css file any more.

The extension yet again uses Capbilities API/qlik.js.

### Qlik Versions
The extension has been tested with the following versions:
November 2018
November 2017 patch 1
September 2017 patch 2
June 2017 patch 3
3.2 SR5 

If you are using version 3.2, there is a bug in the capabilities API in this version which means that the extension might not work in a mashup with more than one app. If you encounter this bug, please upgrade to a leter release.

# Developing the extension

If you want to do code changes to the extension follow these simple steps to get going.

1. Get Qlik Sense Desktop
1. Create a new app and add qsVariable to a sheet.
2. Clone the repository
3. Run `npm install`
4. Run `npm run build:debug` - this command should deploy debuggable version to something like `C:/Users/nerush/Documents/Qlik/Sense/Extensions/qlik-variable-input`

```
// Minified output to /dist folder.
$ npm run build
```

```
// Outputs a .zip file to /dist folder.
$ npm run build:release
```

# Original Author
[erikwett](https://github.com/erikwett)
