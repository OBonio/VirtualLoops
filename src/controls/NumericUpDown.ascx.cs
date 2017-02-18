using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class controls_NumericUpDown : System.Web.UI.UserControl
{
    int max = 100;
    int min = 0;
    string onClientChange;
    protected void Page_Load(object sender, EventArgs e)
    {

        if (!Page.IsPostBack)
        {
            btnUp.Attributes.Add("onClick", String.Format("nudUp('{0}', {1}, {2})", uxVal.ClientID, max, onClientChange));
            btnDown.Attributes.Add("onClick", String.Format("nudDown('{0}', {1}, {2})", uxVal.ClientID, min, onClientChange));
        }
    }

    public string Label
    {
        set
        {
            uxLabel.InnerText = value;
        }
    }

    public int Value
    {
        get;
        set;
    }

    public int Max
    {
        get
        {
            return max;
        }
        set
        {                 
            max = value;
        }
    }

    public int Min
    {
        get
        {
            return min;
        }
        set
        {
            min = value;
        }
    }

    public string OnClientChange
    {
        set
        {
            onClientChange = value;
        }
    }

    public string Format
    {
        get;
        set;
    }

    protected override void OnPreRender(EventArgs e)
    {
        uxVal.InnerText = Value.ToString(Format);
    }
}