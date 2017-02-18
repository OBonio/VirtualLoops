function InterpolatingMixer() {
    var v1Index, v2Index, v1, v2, inSizeM1;
    var u;
    var outOffset;
    var inOffset;

    this.mix = function (
		outBuffer,
		outOffsetH,
		outLength,
		inBuffer,
		inOffsetH,
		inLength,
		inSize,
		grad) {

        outOffset = outOffsetH[0];
        inOffset = inOffsetH[0];
        inSizeM1 = inSize - 1;

        while (outOffset < outLength && inLength - inOffset > 16) {
            v1Index = Math.floor(inOffset);
            v2Index = v1Index + 1;
            v1 = inBuffer[v1Index & inSizeM1];
            v2 = inBuffer[v2Index & inSizeM1];
            u = inOffset - Math.floor(inOffset);
            outBuffer[outOffset++] += ((v1 * (1 - u)) + (v2 * u));
            inOffset += grad;
        }

        inOffsetH[0] = inOffset;
        outOffsetH[0] = outOffset;
    }
}
