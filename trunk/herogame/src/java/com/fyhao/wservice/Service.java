package com.fyhao.wservice;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Service {

	HttpServlet servlet;
	HttpServletRequest request;
	HttpServletResponse response;
	String[] parts;
	public Map<String, Object> varMap = new HashMap<String, Object>();
	public void init(HttpServlet servlet, HttpServletRequest request, HttpServletResponse response, String[] parts) {
		this.servlet = servlet;
		this.request = request;
		this.response = response;
		this.parts = parts;
                this.request.setAttribute("var", varMap);
	}
	
	public void assign(String name, Object value) {
		varMap.put(name, value);
	}
	
	public void forward(String path) throws ServletException, IOException {
		//request.getRequestDispatcher(path).forward(request, response);
		servlet.getServletContext().getRequestDispatcher(path).forward(request, response);
	}

        public void before() throws ServletException, IOException {
            // nothing here
        }
}
