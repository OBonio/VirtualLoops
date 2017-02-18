function Player() {

    var ms;
    var out = new Audio();
    var lowLevelMixerClass = new InterpolatingMixer();

    /**
     * initialize the player
     *
     * @param output
     * @return true if initialization was successful
     */
    this.init = function(output) {
        out = output;
        lowLevelMixerClass = new InterpolatingMixer();
        return true;
    }

    /**
     * Load a module from a file
     *
     * @param fileName the file name of the module
     * @return true if loading was successful, false else
     */
    this.load = function(fileName, data) {
        var ml = new ModLoader();
        var module = ml.load(fileName, data);
        this.loadMod(module);
        return module;
    }

    /**
     * Load a module
     * @param module the module to load
     * @return true if loading was successful, false else
     */
    this.loadMod = function(module) {
        var instr = module.getInstruments();
        var tracks = module.getPatternAtPos(0).getTrackCount();

        var mixer = new DefaultMixer(out, lowLevelMixerClass, tracks);

        ms = new ModuleState(module, mixer);

        // do some mixer initialization...
        mixer.setAmplification(this.getDefaultAmplification());

        return true;
    }

    /**
     * play a tick of the the module
     *
     * @return true if the module is still playing, false if the module is finished.
     */
    this.play = function () {
        ms.play();
    }

    this.close = function() {
        return true;
    }

    /**
     * get the state of the module. The ModuleState can be used for
     * finding information about the playing module and for manipulating how the
     * module should be played
     *
     * @return the state of the playing module
     */
    this.getModuleState = function() {
        return ms;
    }

    /**
     * get the current module;
     * @return
     */
    this.getModule = function() {
        return this.getModuleState().getModule();
    }

    /**
     * get the default amplification. The default amplification is calculated using the following
     * formula: <code>#tracks / 4</code>. This should maintain a reasonable volume when playing
     * modules with many channels while avoiding clipping in most cases. Note that for 4channel mods
     * this will result in an amplification of 1.
     * @return
     */
    this.getDefaultAmplification = function() {
        return this.getModuleState().getModule().getPatternAtPos(0).getTrackCount() / 4.0;
    }

    this.setAmplification = function(amp) {
        this.getModuleState().getMixer().setAmplification(amp);
    }

    this.getAmplification = function() {
        return this.getModuleState().getMixer().getAmplification();
    }

    this.mute = function(track, mute) {
        this.getModuleState().getMixer().setMute(track, mute);
    }

    this.mute = function(mute) {
        for (var n = 0; n < mute.length && n < this.getModule().getTrackCount(); n++)
            mute(n,mute[n]);
    }

    this.setVolume = function(volume) {
        this.getModuleState().getMixer().setVolume(volume);
    }

    this.getVolume = function() {
        return this.getModuleState().getMixer().getVolume();
    }

    this.setBalance = function(balance) {
        this.getModuleState().getMixer().setBalance(balance);
    }

    this.getBalance = function() {
        return this.getModuleState().getMixer().getBalance();
    }

    this.setSeparation = function(separation) {
        this.getModuleState().getMixer().setSeparation(separation);
    }

    this.getSeparation = function() {
        return this.getModuleState().getMixer().getSeparation();
    }

    this.setPosition = function(pos) {
        this.getModuleState().setPosition(pos);
    }

    this.getPosition = function() {
        return this.getModuleState().getPosition();
    }

    this.getDivision = function() {
        return this.getModuleState().getDivision();
    }

    this.getTick = function() {
        return this.getModuleState().getTick();
    }

    this.getNote = function(track) {
        return this.getModuleState().
            getModule().getPatternAtPos(getPosition()).getTrack(track).getNote(getDivision());
    }
}
