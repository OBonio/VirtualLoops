function Stream(data) {
    var dataPointer = 0;
    var dataArray = new Uint8Array(data);
    this.getLength = function () { return dataArray.length; }
    this.getPos = function () { return dataPointer; }
    this.peek = function () { return dataArray[dataPointer]; }
    this.read = function () { return dataArray[dataPointer++]; }
    this.readArray = function (data) { var dataLen = data.length; while (dataLen-- > 0) data[dataLen] = dataArray[dataLen + dataPointer]; dataPointer += data.length; return data.length; }
    this.seek = function (pos) { dataPointer = pos; }
    this.skip = function (bytes) { dataPointer += bytes; }
    this.readShort = function () { return (this.read() << 8) | this.read(); }
    this.readInt = function () { return (this.read() << 24) | (this.read() << 16) | (this.read() << 8) | this.read(); }
}
