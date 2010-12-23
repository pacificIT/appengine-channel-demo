<%-- 
    Document   : index
    Created on : Dec 22, 2010, 1:35:43 AM
    Author     : fyhao
--%>

<%@page contentType="text/html" pageEncoding="UTF-8" import="com.google.appengine.api.channel.*"%>
<%
String channel = "herogame";
ChannelService channelService = ChannelServiceFactory.getChannelService();
String token = channelService.createChannel(channel);
%>
<!DOCTYPE html>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Hero game</title>
        <script src='/_ah/channel/jsapi'></script>
        <script src="js/game.js"></script>
        <script>
            var game = new Game();
            var hero = null;
            var channel = '<%=channel%>';
            var token = '<%=token %>';
              openChannel = function() {
                
                var channel = new goog.appengine.Channel(token);
                
                var socket = channel.open();
                
                socket.onopen = onOpened;
                socket.onmessage = onMessage;

                
              }

              sendMessage = function(channel, message) {
                message = JSON.stringify(message);
                path = "/channelapi?action=push&channel=" + channel + "&message=" + message;
                var xhr = new XMLHttpRequest();
                xhr.open('POST', path, true);
                xhr.send();
              };

              send = function(message) {
                sendMessage(channel, message);
              }

              onOpened = function() {
                  game.start();
                  hero = game.world.objs[0];
                  send({"action" : "update", "hero" : game.world.objs[0]});
              }

              onMessage = function(m) {
                  
                  var res = JSON.parse(m.data);
                 
                  if(res.action == "update") {
                      if(res.hero.name == hero.name) return;
                      var ehero = new Hero(res.hero.name);
                      ehero = game.world.addObj(ehero);
                      ehero.direction = res.hero.direction;
                      ehero.x = res.hero.x;
                      ehero.y = res.hero.y;
                      ehero.w = res.hero.w;
                      ehero.h = res.hero.h;
                      ehero.life = res.hero.life;
                  }
              }
              
              setTimeout(function() {init();},  100);

              init = function() {
                openChannel();

              }
              
              
        </script>
    </head>
    <body>
        <canvas id="canvalayer" width="500" height="500">
Your browser is out of date, you should download latest Google Chrome, Firefox, Safari or Opera to see this wonderful HTML5 Canvas!
</canvas>
    </body>
</html>
