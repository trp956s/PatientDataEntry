webshim.polyfill('es5 mediaelement forms');
webshim.setOptions("forms", {
    lazyCustomMessages: true,
    replaceValidationUI: true,
    customDatalist: "auto",
    list: {
        "filter": "^"
    }
});