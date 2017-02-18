using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.IO;
using System.Web.Script.Services;
using System.Text;

/// <summary>
/// Summary description for vlservice
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class vlservice : System.Web.Services.WebService {
    private string modPath = string.Empty;
    public vlservice () {

        this.modPath = Server.MapPath("~/mods");
    }

    [WebMethod]
    [ScriptMethod(ResponseFormat=ResponseFormat.Json)]
    public string[] GetFiles() {
        DirectoryInfo di = new DirectoryInfo(modPath);
        FileInfo[] fis = di.GetFiles();
        string[] retVal = new string[fis.Length];
        for (int fileLoop = 0; fileLoop < fis.Length; fileLoop++)
            retVal[fileLoop] = fis[fileLoop].Name;
        return retVal;
    }

    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string GetFile(string filename)
    {
        StringBuilder retVal = new StringBuilder();
        string modFilePath = Path.Combine(modPath, filename);
        if (File.Exists(modFilePath))
        {
            FileStream fs = File.OpenRead(modFilePath);
            byte[] fileBuffer = new byte[fs.Length];
            fs.Read(fileBuffer, 0, fileBuffer.Length);
            fs.Close();
            for (int dataLoop = 0; dataLoop < fileBuffer.Length; dataLoop++)
                retVal.Append(Convert.ToChar(fileBuffer[dataLoop]));
        }
        return retVal.ToString();
    }

    [WebMethod]
    [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
    public string GetRandomFile()
    {
        string retFile = string.Empty;
        if(Directory.Exists(modPath))
        {
            FileInfo[] fis = new DirectoryInfo(modPath).GetFiles();
            Random rnd = new Random();
            retFile = fis[rnd.Next(fis.Length)].Name;
        }
        return retFile;

    }
}
