function VLAudio(nextRow, displayPatternAtPos, midiCallback) {
    var webkit = typeof AudioContext == 'function';
    var audioContext, audioNode, audioAnalyser;
    var webkitAudioData;
    var modPlayer;

    var currentWritePosition = 0;
    var lastSampleOffset = 0;

    var playing = false;
    var channels = 2; //stereo
    var sampleRate = 44100;
    var bufferSize = 2048 * channels;
    var prebufferSize = 12 * channels * 1024; // defines the latency
    var combinedData = new Array();
    audioContext = new AudioContext();
    audioNode = audioContext.createScriptProcessor(4096);
    audioAnalyser = audioContext.createAnalyser();
    audioAnalyser.fftSize = 256;
    audioNode.connect(audioAnalyser);
    audioAnalyser.connect(audioContext.destination);
    audioNode.onaudioprocess = function (e) {
        if (!playing) return;
        var chanDataLeft = e.outputBuffer.getChannelData(0);
        var chanDataRight = e.outputBuffer.getChannelData(1);
        if (modPlayer) {
            var sampData = modPlayer.getSamples(4096);
            for (var sampLoop = 0; sampLoop < sampData.leftSamples.length; sampLoop++) {
                chanDataLeft[sampLoop] = sampData.leftSamples[sampLoop];
                chanDataRight[sampLoop] = sampData.rightSamples[sampLoop];
                combinedData[sampLoop] = chanDataLeft[sampLoop] + chanDataRight[sampLoop] / 2;
            }
        }
    }

    this.getBuffer = function() {
      return combinedData;
    }

    this.getFftBuffer = function() {
      var fftData = new Uint8Array(audioAnalyser.frequencyBinCount);
      audioAnalyser.getByteFrequencyData(fftData); 
      return fftData;
    }
    
    this.isPlaying = function() {
      return playing;
    }
        
    this.load = function (modFile) {
        modPlayer = new ModPlayer(modFile, webkit ? audioContext.sampleRate / 2: 44100, nextRow, displayPatternAtPos, midiCallback);
    }

    this.play = function() {
        playing = true;
        audioNode.connect(audioAnalyser);
    }

    this.stop = function () {
        playing = false;
        audioNode.disconnect();
    }

}