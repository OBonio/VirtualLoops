<%@ WebHandler Language="C#" Class="JsHandler" %>

using System;
using System.Web;
using System.IO;

public class JsHandler : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/javascript";
        DirectoryInfo di = new DirectoryInfo(context.Server.MapPath("~/js"));
        FileInfo[] fis = di.GetFiles("*.js");
        System.Text.StringBuilder sb = new System.Text.StringBuilder(1000);
        foreach (FileInfo fi in fis)
        {
            StreamReader sr = new StreamReader(fi.FullName);
            sb.Append(sr.ReadToEnd());
            sr.Close();
            sb.Append(Environment.NewLine);
        }
        context.Response.Write(sb.ToString());
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}