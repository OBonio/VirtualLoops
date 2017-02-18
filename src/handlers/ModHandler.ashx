<%@ WebHandler Language="C#" Class="ModHandler" %>

using System;
using System.Web;

public class ModHandler : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "application/octet";
        context.Response.WriteFile("c:\\temp\\cream_of_the_earth.mod");
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}