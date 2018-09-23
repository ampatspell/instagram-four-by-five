package com.amateurinmotion.fourbyfive;

import android.util.JsonReader;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import org.json.JSONException;
import org.json.JSONObject;

public class WebAppInterface {

    MainActivity context;
    WebView webView;

    WebAppInterface(MainActivity context, WebView webView) {
        this.context = context;
        this.webView = webView;
    }

    @JavascriptInterface
    public void request(String string) throws JSONException {
        JSONObject json = new JSONObject(string);

        String name = json.getString("name");
        String id = json.getString("id");
        JSONObject opts = json.getJSONObject("opts");

        this.respond(id, json);
    }

    public void respond(final String id, JSONObject response) {
        final String string = response.toString();
        webView.post(new Runnable() {
            @Override
            public void run() {
                System.out.println(id + " " + string);
                webView.evaluateJavascript("__handleAndroidResponse(\"" + id + "\", " + string + ");", null);
            }
        });
    }

}
