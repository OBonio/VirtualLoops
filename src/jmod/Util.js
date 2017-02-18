var Util = {};
Util.readZeroPaddedString = function (dis, length) {
    var data = new Uint8Array(length);
    var nLen = dis.readArray(data);
    //alert(nLen.toString() + ' - ' + length);
    if (nLen != length)
        throw "can't read zeropaddedstring";
    var len = 0;
    var retVal = new String();
    while (len < length && data[len] != 0)
        retVal += String.fromCharCode(data[len++]);
    return retVal;
}

Util.nibbleToHex = function (nibble) {
    nibble &= 0x0f;
    return nibble < 10 ?
            nibble.toString() :
            String.fromCharCode(65 + nibble - 10) + "";
}
