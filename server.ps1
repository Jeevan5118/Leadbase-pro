param(
    [int]$Port = 5540,
    [string]$Root = $PSScriptRoot
)

if (-not $Root) { $Root = (Get-Location).Path }

if (-not ([System.Management.Automation.PSTypeName]'StaticServer').Type) {
    $cs = @'
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using System.Collections.Generic;

public class StaticServer {
    private HttpListener _listener;
    private string _root;
    private int _port;
    private static readonly Dictionary<string, string> MimeTypes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {
        { ".html", "text/html; charset=utf-8" },
        { ".htm", "text/html; charset=utf-8" },
        { ".css", "text/css; charset=utf-8" },
        { ".js", "application/javascript; charset=utf-8" },
        { ".json", "application/json; charset=utf-8" },
        { ".svg", "image/svg+xml" },
        { ".png", "image/png" },
        { ".jpg", "image/jpeg" },
        { ".jpeg", "image/jpeg" },
        { ".webp", "image/webp" },
        { ".mp4", "video/mp4" },
        { ".woff", "font/woff" },
        { ".woff2", "font/woff2" },
        { ".ttf", "font/ttf" },
        { ".ico", "image/x-icon" }
    };

    public StaticServer(string root, int port) {
        _root = Path.GetFullPath(root);
        _port = port;
    }

    public void Start() {
        _listener = new HttpListener();
        _listener.Prefixes.Add("http://localhost:" + _port + "/");
        _listener.Prefixes.Add("http://127.0.0.1:" + _port + "/");
        _listener.Start();
        Console.WriteLine("Server running at http://localhost:" + _port + "/ (Root: " + _root + ")");
        Task.Run((Action)ListenLoop);
    }

    private void ListenLoop() {
        while (_listener != null && _listener.IsListening) {
            try {
                var ctx = _listener.GetContext();
                Task.Run(() => HandleRequest(ctx));
            } catch {
                if (_listener == null || !_listener.IsListening) break;
            }
        }
    }

    private void HandleRequest(HttpListenerContext ctx) {
        var req = ctx.Request;
        var res = ctx.Response;
        try {
            string rawPath = req.Url.LocalPath.TrimStart('/');
            if (string.IsNullOrEmpty(rawPath) || rawPath.EndsWith("/")) {
                rawPath += "index.html";
            }
            string fullPath = Path.GetFullPath(Path.Combine(_root, rawPath.Replace('/', Path.DirectorySeparatorChar)));
            if (!fullPath.StartsWith(_root, StringComparison.OrdinalIgnoreCase) || !File.Exists(fullPath)) {
                res.StatusCode = 404;
                byte[] notFound = System.Text.Encoding.UTF8.GetBytes("404 Not Found");
                res.ContentType = "text/plain";
                res.ContentLength64 = notFound.Length;
                res.OutputStream.Write(notFound, 0, notFound.Length);
                res.Close();
                return;
            }

            string ext = Path.GetExtension(fullPath);
            string contentType;
            if (!MimeTypes.TryGetValue(ext, out contentType)) {
                contentType = "application/octet-stream";
            }
            res.ContentType = contentType;
            res.AddHeader("Accept-Ranges", "bytes");
            res.AddHeader("Access-Control-Allow-Origin", "*");

            var fi = new FileInfo(fullPath);
            long totalLen = fi.Length;

            string range = req.Headers["Range"];
            if (!string.IsNullOrEmpty(range) && range.StartsWith("bytes=")) {
                string rangeSpec = range.Substring(6).Trim();
                string[] parts = rangeSpec.Split('-');
                long start = 0;
                long end = totalLen - 1;
                if (!string.IsNullOrEmpty(parts[0])) {
                    long.TryParse(parts[0], out start);
                }
                if (parts.Length > 1 && !string.IsNullOrEmpty(parts[1])) {
                    long.TryParse(parts[1], out end);
                }
                if (end >= totalLen) end = totalLen - 1;
                long lenToSend = end - start + 1;

                res.StatusCode = 206;
                res.AddHeader("Content-Range", "bytes " + start + "-" + end + "/" + totalLen);
                res.ContentLength64 = lenToSend;

                using (var fs = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read)) {
                    fs.Seek(start, SeekOrigin.Begin);
                    byte[] buffer = new byte[65536];
                    long remaining = lenToSend;
                    while (remaining > 0) {
                        int toRead = (int)Math.Min((long)buffer.Length, remaining);
                        int read = fs.Read(buffer, 0, toRead);
                        if (read <= 0) break;
                        res.OutputStream.Write(buffer, 0, read);
                        remaining -= read;
                    }
                }
            } else {
                res.StatusCode = 200;
                res.ContentLength64 = totalLen;
                using (var fs = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read)) {
                    fs.CopyTo(res.OutputStream);
                }
            }
        } catch {
        } finally {
            try { res.Close(); } catch {}
        }
    }

    public void Stop() {
        if (_listener != null) {
            try { _listener.Stop(); } catch {}
            try { _listener.Close(); } catch {}
            _listener = null;
        }
    }
}
'@
    Add-Type -TypeDefinition $cs
}

$server = New-Object StaticServer($Root, $Port)
$server.Start()

try {
    while ($true) {
        [System.Threading.Thread]::Sleep(1000)
    }
} finally {
    $server.Stop()
}
