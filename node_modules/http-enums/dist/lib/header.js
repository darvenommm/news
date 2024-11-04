"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpRequestHeader;
(function (HttpRequestHeader) {
    /**
     * standard header fields
     */
    HttpRequestHeader["ACCEPT"] = "accept";
    HttpRequestHeader["ACCEPT_CHARSET"] = "accept-charset";
    HttpRequestHeader["ACCEPT_DATETIME"] = "accept-datetime";
    HttpRequestHeader["ACCEPT_ENCODING"] = "accept-encoding";
    HttpRequestHeader["ACCEPT_LANGUAGE"] = "accept-language";
    HttpRequestHeader["ACCESS_CONTROL_REQUEST_METHOD"] = "access-control-request-method";
    HttpRequestHeader["ACCESS_CONTROL_REQUEST_HEADERS"] = "access-control-request-headers";
    HttpRequestHeader["AUTHORIZATION"] = "authorization";
    HttpRequestHeader["A_IM"] = "a-im";
    HttpRequestHeader["CACHE_CONTROL"] = "cache-control";
    HttpRequestHeader["CONNECTION"] = "connection";
    HttpRequestHeader["CONTENT_LENGTH"] = "content-length";
    HttpRequestHeader["CONTENT_MD5"] = "content-md5";
    HttpRequestHeader["CONTENT_TYPE"] = "content-type";
    HttpRequestHeader["COOKIE"] = "cookie";
    HttpRequestHeader["DATE"] = "date";
    HttpRequestHeader["EXPECT"] = "expect";
    HttpRequestHeader["FORWARDED"] = "forwarded";
    HttpRequestHeader["FROM"] = "from";
    HttpRequestHeader["HOST"] = "host";
    HttpRequestHeader["HTTP2_SETTINGS"] = "http2-settings";
    HttpRequestHeader["IF_MATCH"] = "if-match";
    HttpRequestHeader["IF_MODIFIED_SINCE"] = "if-modified-since";
    HttpRequestHeader["IF_NONE_MATCH"] = "if-none-match";
    HttpRequestHeader["IF_RANGE"] = "if-range";
    HttpRequestHeader["IF_UNMODIFIED_SINCE"] = "if-unmodified-since";
    HttpRequestHeader["MAX_FORWARDS"] = "max-forwards";
    HttpRequestHeader["ORIGIN"] = "origin";
    HttpRequestHeader["PRAGMA"] = "pragma";
    HttpRequestHeader["PROXY_AUTHORIZATION"] = "proxy-authorization";
    HttpRequestHeader["RANGE"] = "range";
    HttpRequestHeader["REFERER"] = "referer";
    HttpRequestHeader["TE"] = "te";
    HttpRequestHeader["TRAILER"] = "trailer";
    HttpRequestHeader["TRANSFER_ENCODING"] = "transfer-encoding";
    HttpRequestHeader["UPGRADE"] = "upgrade";
    HttpRequestHeader["USER_AGENT"] = "user-agent";
    HttpRequestHeader["VIA"] = "via";
    HttpRequestHeader["WARNING"] = "warning";
    /**
     * non standard common header fields
     */
    HttpRequestHeader["DNT"] = "dnt";
    HttpRequestHeader["FRONT_END_HTTPS"] = "front-end-https";
    HttpRequestHeader["PROXY_CONNECTION"] = "proxy-connection";
    HttpRequestHeader["SAVE_DATA"] = "save-data";
    HttpRequestHeader["UPGRADE_INSECURE_REQUESTS"] = "upgrade-insecure-requests";
    HttpRequestHeader["X_ATT_DEVICEID"] = "x-att-deviceid";
    HttpRequestHeader["X_CORRELATION_ID"] = "x-correlation-id";
    HttpRequestHeader["X_CSRF_TOKEN"] = "x-csrf-token";
    HttpRequestHeader["X_FORWARDED_FOR"] = "x-forwarded-for";
    HttpRequestHeader["X_FORWARDED_HOST"] = "x-forwarded-host";
    HttpRequestHeader["X_FORWARDED_PROTO"] = "x-forwarded-proto";
    HttpRequestHeader["X_HTTP_METHOD_OVERRIDE"] = "x-http-method-override";
    HttpRequestHeader["X_REQUEST_ID"] = "x-request-id";
    HttpRequestHeader["X_REQUESTED_WITH"] = "x-requested-with";
    HttpRequestHeader["X_UIDH"] = "x-uidh";
    HttpRequestHeader["X_WAP_PROFILE"] = "x-wap-profile";
})(HttpRequestHeader = exports.HttpRequestHeader || (exports.HttpRequestHeader = {}));
var HttpResponseHeader;
(function (HttpResponseHeader) {
    /**
     * standard header fields
     */
    HttpResponseHeader["ACCEPT_PATCH"] = "accept-patch";
    HttpResponseHeader["ACCEPT_RANGES"] = "accept-ranges";
    HttpResponseHeader["ACCESS_CONTROL_ALLOW_CREDENTIALS"] = "access-control-allow-credentials";
    HttpResponseHeader["ACCESS_CONTROL_ALLOW_HEADERS"] = "access-control-allow-headers";
    HttpResponseHeader["ACCESS_CONTROL_ALLOW_METHODS"] = "access-control-allow-methods";
    HttpResponseHeader["ACCESS_CONTROL_ALLOW_ORIGIN"] = "access-control-allow-origin";
    HttpResponseHeader["ACCESS_CONTROL_EXPOSE_HEADERS"] = "access-control-expose-headers";
    HttpResponseHeader["ACCESS_CONTROL_MAX_AGE"] = "access-control-max-age";
    HttpResponseHeader["AGE"] = "age";
    HttpResponseHeader["ALLOW"] = "allow";
    HttpResponseHeader["ALT_SVC"] = "alt-svc";
    HttpResponseHeader["CACHE_CONTROL"] = "cache-control";
    HttpResponseHeader["CONNECTION"] = "connection";
    HttpResponseHeader["CONTENT_DISPOSITION"] = "content-disposition";
    HttpResponseHeader["CONTENT_ENCODING"] = "content-encoding";
    HttpResponseHeader["CONTENT_LANGUAGE"] = "content-language";
    HttpResponseHeader["CONTENT_LENGTH"] = "content-length";
    HttpResponseHeader["CONTENT_LOCATION"] = "content-location";
    HttpResponseHeader["CONTENT_MD5"] = "content-md5";
    HttpResponseHeader["CONTENT_RANGE"] = "content-range";
    HttpResponseHeader["CONTENT_TYPE"] = "content-type";
    HttpResponseHeader["DATE"] = "date";
    HttpResponseHeader["DELTA_BASE"] = "delta-base";
    HttpResponseHeader["ETAG"] = "etag";
    HttpResponseHeader["EXPIRES"] = "expires";
    HttpResponseHeader["IM"] = "im";
    HttpResponseHeader["LAST_MODIFIED"] = "last-modified";
    HttpResponseHeader["LINK"] = "link";
    HttpResponseHeader["LOCATION"] = "location";
    HttpResponseHeader["P3P"] = "p3p";
    HttpResponseHeader["PRAGMA"] = "pragma";
    HttpResponseHeader["PROXY_AUTHENTICATE"] = "proxy-authenticate";
    HttpResponseHeader["PUBLIC_KEY_PINS"] = "public-key-pins";
    HttpResponseHeader["RETRY_AFTER"] = "retry-after";
    HttpResponseHeader["SERVER"] = "server";
    HttpResponseHeader["SET_COOKIE"] = "set-cookie";
    HttpResponseHeader["STRICT_TRANSPORT_SECURITY"] = "strict-transport-security";
    HttpResponseHeader["TK"] = "tk";
    HttpResponseHeader["TRAILER"] = "trailer";
    HttpResponseHeader["TRANSFER_ENCODING"] = "transfer-encoding";
    HttpResponseHeader["UPGRADE"] = "upgrade";
    HttpResponseHeader["VARY"] = "vary";
    HttpResponseHeader["VIA"] = "via";
    HttpResponseHeader["WARNING"] = "warning";
    HttpResponseHeader["WWW_AUTHENTICATE"] = "www-authenticate";
    HttpResponseHeader["X_FRAME_OPTIONS"] = "x-frame-options";
    /**
     * non standard common header fields
     */
    HttpResponseHeader["CONTENT_SECURITY_POLICY"] = "content-security-policy";
    HttpResponseHeader["X_CONTENT_SECURITY_POLICY"] = "x-content-security-policy";
    HttpResponseHeader["X_WEBKIT_CSP"] = "x-webkit-csp";
    HttpResponseHeader["REFRESH"] = "refresh";
    HttpResponseHeader["STATUS"] = "status";
    HttpResponseHeader["TIMING_ALLOW_ORIGIN"] = "timing-allow-origin";
    HttpResponseHeader["X_CONTENT_DURATION"] = "x-content-duration";
    HttpResponseHeader["X_CONTENT_TYPE_OPTIONS"] = "x-content-type-options";
    HttpResponseHeader["X_POWERED_BY"] = "x-powered-by";
    HttpResponseHeader["X_REQUEST_ID"] = "x-request-id";
    HttpResponseHeader["X_CORRELATION_ID"] = "x-correlation-id";
    HttpResponseHeader["X_UA_COMPATIBLE"] = "x-ua-compatible";
    HttpResponseHeader["X_XSS_PROTECTION"] = "x-xss-protection";
})(HttpResponseHeader = exports.HttpResponseHeader || (exports.HttpResponseHeader = {}));
