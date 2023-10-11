
Testing /Users/bencetoth/Documents/Development/Projects/jegyrendszer/web-server ...

 ✗ [Medium] Cross-site Scripting (XSS) 
   Path: src/components/monitor/monitor.component.tsx, line 204 
   Info: Unsanitized input from a React useState value flows into a script 'src' attribute, where it is used to dynamically construct the HTML page on client side. This may result in a DOM Based Cross-Site Scripting attack (DOMXSS).

 ✗ [Medium] Cross-site Scripting (XSS) 
   Path: src/components/monitor/monitor.component.tsx, line 205 
   Info: Unsanitized input from a React useState value flows into a script 'src' attribute, where it is used to dynamically construct the HTML page on client side. This may result in a DOM Based Cross-Site Scripting attack (DOMXSS).

 ✗ [Medium] Cross-site Scripting (XSS) 
   Path: src/components/image-upload/imageUpload.component.tsx, line 72 
   Info: Unsanitized input from a React useState value flows into a script 'src' attribute, where it is used to dynamically construct the HTML page on client side. This may result in a DOM Based Cross-Site Scripting attack (DOMXSS).

 ✗ [Medium] Cross-site Scripting (XSS) 
   Path: src/components/aszf/aszf.component.tsx, line 25 
   Info: Unsanitized input from a React useState value flows into __html, where it is used to dynamically construct the HTML page on client side. This may result in a DOM Based Cross-Site Scripting attack (DOMXSS).

 ✗ [Medium] Allocation of Resources Without Limits or Throttling 
   Path: server.js, line 18 
   Info: This endpoint handler performs a file system operation and does not use a rate-limiting mechanism. It may enable the attackers to perform Denial-of-service attacks. Consider using a rate-limiting middleware such as express-limit.

 ✗ [Medium] Information Exposure 
   Path: server.js, line 3 
   Info: Disable X-Powered-By header for your Express app (consider using Helmet middleware), because it exposes information about the used framework to potential attackers.

 ✗ [Medium] Cross-Site Request Forgery (CSRF) 
   Path: server.js, line 3 
   Info: CSRF protection is disabled for your Express app. This allows the attackers to execute requests on a users behalf.

 ✗ [Medium] Open Redirect 
   Path: src/components/admin/operation/seats/main.tsx, line 90 
   Info: Unsanitized input from data from a remote resource flows into window.location, where it is used as an URL to redirect the user. This may result in an Open Redirect vulnerability.

 ✗ [Medium] Open Redirect 
   Path: src/components/buy-ticket/buy-ticket-main-page.component.tsx, line 135 
   Info: Unsanitized input from a React useState value flows into window.location, where it is used as an URL to redirect the user. This may result in an Open Redirect vulnerability.

 ✗ [Medium] Open Redirect 
   Path: src/components/connection/file.tsx, line 18 
   Info: Unsanitized input from data from a remote resource flows into assign, where it is used as an URL to redirect the user. This may result in an Open Redirect vulnerability.


✔ Test completed

Organization:      cbfc22ac-7d6d-4afe-bc37-adee8f3e0fac
Test type:         Static code analysis
Project path:      /Users/bencetoth/Documents/Development/Projects/jegyrendszer/web-server

Summary:

  10 Code issues found
  10 [Medium] 


