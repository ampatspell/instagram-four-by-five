package com.amateurinmotion.fourbyfive;

import android.net.Uri;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class WebViewClientImpl extends WebViewClient {

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        if(request.getUrl().getHost().equals("")) {

        }
        return super.shouldOverrideUrlLoading(view, request);
    }

}
