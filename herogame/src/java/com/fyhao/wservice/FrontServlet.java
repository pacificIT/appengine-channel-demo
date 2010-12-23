package com.fyhao.wservice;

import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class FrontServlet extends HttpServlet {

        public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            serve(request, response);
        }

        public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            serve(request, response);
        }

	public void serve(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
                response.setContentType("text/html");
		String path = request.getPathInfo();

		try {
			String[] parts = path.split("/");
			if(parts.length >= 2) {
				try {
					parts[1] = ucfirst(parts[1]);
					Class iClass = Class.forName("com.fyhao.wservice." + parts[1] + "Service");
					Method init;
					Constructor con;
					Object myClass;
					try {
						init = iClass.getMethod("init", new Class[] {HttpServlet.class, HttpServletRequest.class, HttpServletResponse.class, String[].class});
						con = iClass.getConstructor(new Class[] {});
						myClass = con.newInstance(new Object[] {});
						init.invoke(myClass, new Object[]{this, request, response, parts});
					} catch (NoSuchMethodException ex) {
						System.err.println("Please define init method on " + parts[1] + "Service");
						return;
					} catch (Exception ex) {
						System.err.println("init exception");
						return;
					}

					Method m;
                                                try {
							m = iClass.getMethod("before", null);
							m.invoke(myClass);
						} catch (Exception exc) {
							
						}
					if(parts.length >= 3) {
						parts[2] = parts[2].toLowerCase();
						try {
							m = iClass.getMethod(parts[2], null);
							m.invoke(myClass);
						} catch (NoSuchMethodException ex) {
							try {
								m = iClass.getMethod("main", null);
								m.invoke(myClass);
							} catch (Exception exc) {
								System.err.println("Please define a main service method on " + parts[1] + "Service");
								return;
							}
						} catch (Exception ex) {
							System.err.println(ex);
							return;
						}
					} else {
						try {
							m = iClass.getMethod("main", null);
							m.invoke(myClass);
						} catch (Exception exc) {
							System.err.println("Please define a main service method on " + parts[1] + "Service");
							return;
						}
					}
				} catch (ClassNotFoundException ex) {
                                    System.out.println("class not found");
					defaultAction(request, response);
				}
			} else {
                                System.out.println("what else");
				defaultAction(request, response);
			}
		} catch (NullPointerException ex) {
                    System.out.println("nullpointer");
			defaultAction(request, response);
			return;
		}


	}

	public void defaultAction(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("default action here: " + request.getPathInfo());
	}

	private String ucfirst(String original) {

		String temp = original.toLowerCase();
		char[] chars = temp.toCharArray();
		chars[0] -= 32; // to upper case
		return new StringBuffer().append(chars).toString();


	}
}
