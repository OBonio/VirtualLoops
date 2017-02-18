<%@ Control Language="C#" AutoEventWireup="true" CodeFile="NumericUpDown.ascx.cs" Inherits="controls_NumericUpDown" %>
<div>
<span id="uxLabel" runat="server" class="Label"></span>
<span ID="uxVal" runat="server" style="width: 30px; float:left;" class="Label"></span>
<span style="margin-top:3px; margin-left:5px; background-color: LightGrey;">
    <asp:Image ImageUrl="~/controls/images/up.png" style="margin-top:2px;" ID="btnUp" runat="server" />
    <asp:Image ImageUrl="~/controls/images/down.png"  ID="btnDown" runat="server" />
</span>
</div>