String.prototype.startsWith = function (str) { return this.substr(0, str.length) == str; }
String.prototype.endsWith = function (str) { return this.substr(this.length - str.length, str.length) == str; }
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, "");
}
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, "");
}
