<%@ Control Language="C#" AutoEventWireup="true" CodeFile="Dashboard.ascx.cs" Inherits="controls_Dashboard" %>
<%@ Register Src="~/controls/NumericUpDown.ascx" TagPrefix="ux" TagName="NumericUpDown" %>
<%@ Register Src="~/controls/uxOscilloscope.ascx" TagPrefix="ux" TagName="Oscilloscope" %>
<%@ Register Src="~/controls/uxSamples.ascx" TagPrefix="ux" TagName="Samples" %>

<div style="text-align:center;">
    <span class="Ribbon">
        <span onmouseover="showNav('#controls');" class="RibbonNav">Controls</span>
        <span onmouseover="showNav('#osci');" class="RibbonNav">Oscilloscope</span>
        <span onmouseover="showNav('#samples');" class="RibbonNav">Samples</span>
    </span><br />
    <div id="controls">
        <a href="javascript:skip(-1);"><img src="images/rew.png" /></a>
        <a href="javascript:play();"><img src="images/play.png" /></a>
        <a href="javascript:stop();"><img src="images/stop.png" /></a>
        <a href="javascript:skip(1);"><img src="images/ff.png" /></a>
        <a href="javascript:next();"><img src="images/next.png" /></a>
        <a href="javascript:showServerFiles();"><img src="images/eject.png" /></a><br />
    </div>
    <div id="osci" style="display:none;">
        <ux:Oscilloscope runat="server" ID="uxOsci" />
    </div>
    <div id="samples" style="display:none;">
        <ux:Samples runat="server" ID="uxSamples" />
    </div>
    <div id="songTitle">&nbsp;</div>
</div>

