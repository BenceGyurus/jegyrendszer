Testing /Users/bencetoth/Documents/Development/Projects/jegyrendszer/handle-server ...

 # ✗ [Medium] Allocation of Resources Without Limits or Throttling
 #   Path: index.js, line 1153
 #   Info: This endpoint handler performs a file system operation and does not use a rate-limiting mechanism. It may enable the attackers to perform Denial-of-service attacks. Consider using a rate-limiting middleware such as express-limit.

 # ✗ [Medium] Allocation of Resources Without Limits or Throttling
 #   Path: index.js, line 1627
 #   Info: This endpoint handler performs a file system operation and does not use a rate-limiting mechanism. It may enable the attackers to perform Denial-of-service attacks. Consider using a rate-limiting middleware such as express-limit.

 # ✗ [Medium] Allocation of Resources Without Limits or Throttling
 #   Path: index.js, line 1673
 #   Info: This endpoint handler performs a file system operation and does not use a rate-limiting mechanism. It may enable the attackers to perform Denial-of-service attacks. Consider using a rate-limiting middleware such as express-limit.

 # ✗ [Medium] Allocation of Resources Without Limits or Throttling
 #   Path: index.js, line 1691
 #   Info: This endpoint handler performs a file system operation and does not use a rate-limiting mechanism. It may enable the attackers to perform Denial-of-service attacks. Consider using a rate-limiting middleware such as express-limit.

 # ✗ [Medium] Allocation of Resources Without Limits or Throttling
 #   Path: index.js, line 1713
 #   Info: This endpoint handler performs a file system operation and does not use a rate-limiting mechanism. It may enable the attackers to perform Denial-of-service attacks. Consider using a rate-limiting middleware such as express-limit.

 # ✗ [Medium] Allocation of Resources Without Limits or Throttling
 #   Path: index.js, line 1722
 #   Info: This endpoint handler performs a file system operation and does not use a rate-limiting mechanism. It may enable the attackers to perform Denial-of-service attacks. Consider using a rate-limiting middleware such as express-limit.

 # ✗ [Medium] Allocation of Resources Without Limits or Throttling
 #   Path: index.js, line 1739
 #   Info: This endpoint handler performs a file system operation and does not use a rate-limiting mechanism. It may enable the attackers to perform Denial-of-service attacks. Consider using a rate-limiting middleware such as express-limit.

 # ✗ [Medium] Allocation of Resources Without Limits or Throttling
 #   Path: index.js, line 2005
 #   Info: This endpoint handler performs a file system operation and does not use a rate-limiting mechanism. It may enable the attackers to perform Denial-of-service attacks. Consider using a rate-limiting middleware such as express-limit.

 ✗ [Medium] Information Exposure
   Path: index.js, line 2
   Info: Disable X-Powered-By header for your Express app (consider using Helmet middleware), because it exposes information about the used framework to potential attackers.

 # ✗ [Medium] Prototype Pollution
 #   Path: controlEvent.js, line 27
 #   Info: Unsanitized input from data from a remote resource flows into a member access and is used to access a property of this object by name. This may allow a malicious user to pollute the Object.prototype and cause a crash, remote code execution or logic bypasses.

 # ✗ [Medium] Cleartext Transmission of Sensitive Information
 #   Path: index.js, line 1876
 #   Info: http.createServer uses HTTP which is an insecure protocol and should not be used in code due to cleartext transmission of information. Data in cleartext in a communication channel can be sniffed by unauthorized actors. Consider using the https module instead.

 ✗ [Medium] Cross-Site Request Forgery (CSRF)
   Path: index.js, line 2
   Info: CSRF protection is disabled for your Express app. This allows the attackers to execute requests on a users behalf.

 # ✗ [Medium] Path Traversal
 #   Path: genrate_ticket.js, line 62
 #   Info: Unsanitized input from data from a remote resource flows into fs.writeFileSync, where it is used as a path. This may result in a Path Traversal vulnerability and allow an attacker to write to arbitrary files.

 # ✗ [High] Cross-site Scripting (XSS)
 #   Path: index.js, line 171
 #   Info: Unsanitized input from an HTTP parameter flows into send, where it is used to render an HTML page returned to the user. This may result in a Cross-Site Scripting attack (XSS).

 # ✗ [High] Cross-site Scripting (XSS)
 #   Path: index.js, line 210
 #   Info: Unsanitized input from an HTTP parameter flows into send, where it is used to render an HTML page returned to the user. This may result in a Cross-Site Scripting attack (XSS).

 # ✗ [High] Cross-site Scripting (XSS)
 #   Path: index.js, line 887
 #   Info: Unsanitized input from an HTTP parameter flows into send, where it is used to render an HTML page returned to the user. This may result in a Cross-Site Scripting attack (XSS).

 # ✗ [High] Cross-site Scripting (XSS)
 #   Path: index.js, line 911
 #   Info: Unsanitized input from an HTTP parameter flows into send, where it is used to render an HTML page returned to the user. This may result in a Cross-Site Scripting attack (XSS).

 # ✗ [High] Cross-site Scripting (XSS)
 #   Path: index.js, line 358
 #   Info: Unsanitized input from the HTTP request body flows into send, where it is used to render an HTML page returned to the user. This may result in a Cross-Site Scripting attack (XSS).

 ✗ [High] Path Traversal
   Path: index.js, line 1610
   Info: Unsanitized input from an HTTP parameter flows into fs.writeFileSync, where it is used as a path. This may result in a Path Traversal vulnerability and allow an attacker to write to arbitrary files.

 ✗ [High] Path Traversal
   Path: index.js, line 1645
   Info: Unsanitized input from an uploaded file flows into jimp.read, where it is used as a path. This may result in a Path Traversal vulnerability and allow an attacker to read arbitrary files.

 ✗ [High] Path Traversal 
   Path: index.js, line 2010
   Info: Unsanitized input from the request URL flows into sendFile, where it is used as a path. This may result in a Path Traversal vulnerability and allow an attacker to read arbitrary files.


✔ Test completed

Organization:      
Test type:         Static code analysis
Project path:      /Users/bencetoth/Documents/Development/Projects/jegyrendszer/handle-server

Summary:

  21 Code issues found
  8 [High]   13 [Medium]

