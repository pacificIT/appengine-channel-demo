/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.fyhao.api.channel;

import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author fyhao
 */
public class ChannelServlet extends HttpServlet {

    // action (token, push)
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        any(req, resp);
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        any(req, resp);
    }

     protected void any(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
         resp.setContentType("text/plain");
         String action = req.getParameter("action");
         if(action.equals("token"))
             act_token(req, resp);
         else if(action.equals("push"))
             act_push(req, resp);

    }

     protected void act_token(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
         String channel = req.getParameter("channel");
         if(channel != null) {
             ChannelService channelService = ChannelServiceFactory.getChannelService();
             String token = channelService.createChannel(channel);
             resp.getWriter().write(token);
             return;
         }
         resp.getWriter().write("0");
     }

     protected void act_push(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
         String channel = req.getParameter("channel");
         String message = req.getParameter("message");
         if(channel != null) {
             ChannelService channelService = ChannelServiceFactory.getChannelService();
             channelService.sendMessage(new ChannelMessage(channel, message));
             resp.getWriter().write("1");
             return;
         }
         resp.getWriter().write("0");
     }

}
