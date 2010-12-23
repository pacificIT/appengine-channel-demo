<%-- 
    Document   : index
    Created on : Dec 22, 2010, 1:35:43 AM
    Author     : fyhao
--%>

<%@page contentType="text/html" pageEncoding="UTF-8" import="com.google.appengine.api.channel.*"%>
<%
ChannelService channelService = ChannelServiceFactory.getChannelService();

String token = channelService.createChannel("game");

%>
<!DOCTYPE html>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <script src='/_ah/channel/jsapi?key=dev'></script>
        <script>
            var token = '<%=token %>';
              openChannel = function() {
                
                var channel = new goog.appengine.Channel(token);
                
                var socket = channel.open();
                
                socket.onopen = onOpened;
                socket.onmessage = onMessage;

                
              }

              sendMessage = function(path, opt_param) {
                path += '?';
                
                if (opt_param) {
                  path += '&' + opt_param;
                }
                var xhr = new XMLHttpRequest();
                xhr.open('POST', path, true);
                xhr.send();
              };

              onOpened = function() {
                  show('opened');sendMessage("/game");
              }

              onMessage = function(m) {
                  msg = JSON.parse(m.data);
                  
                  show(m.data);
                 
              }
              show = function(msg) {
                  document.getElementById('result').innerHTML = msg;
              }
              setTimeout(function() {openChannel();},  100);

              send = function() {
                  sendMessage("/game");
              }
        </script>
    </head>
    <body>
        <h1>new application for testing Channel API</hl>
        <a href="javascript:;" onclick="send()">Sending</a>
        <div id="result"></div>
    </body>
</html>
