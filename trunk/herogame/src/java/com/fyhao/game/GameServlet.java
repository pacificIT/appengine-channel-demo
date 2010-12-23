/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.fyhao.game;

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
public class GameServlet extends HttpServlet {

    protected void doGet(HttpServletRequest rep, HttpServletResponse resp) throws ServletException, IOException {
        any(rep, resp);
    }

    protected void doPost(HttpServletRequest rep, HttpServletResponse resp) throws ServletException, IOException {
        
        any(rep, resp);
    }

     protected void any(HttpServletRequest rep, HttpServletResponse resp) throws ServletException, IOException {

        ChannelService channelService = ChannelServiceFactory.getChannelService();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("data", "test anything: " + new java.util.Date());
        Gson gson = new Gson();

        channelService.sendMessage(new ChannelMessage("game", gson.toJson(map)));
    }
}
