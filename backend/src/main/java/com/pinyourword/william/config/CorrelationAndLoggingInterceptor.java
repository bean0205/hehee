package com.pinyourword.william.config;

// CorrelationAndLoggingInterceptor.java

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

public class CorrelationAndLoggingInterceptor implements ClientHttpRequestInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(CorrelationAndLoggingInterceptor.class);
    public static final String CORRELATION_HEADER = "X-Correlation-Id";

    private String maskIfSensitive(String headerName, String value) {
        if (headerName == null || value == null) return value;
        String lower = headerName.toLowerCase();
        if (lower.contains("authorization") || lower.contains("cookie") || lower.contains("set-cookie")) {
            return "****";
        }
        return value;
    }

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
        // Ensure correlation id
        HttpHeaders headers = request.getHeaders();
        if (!headers.containsKey(CORRELATION_HEADER)) {
            String id = UUID.randomUUID().toString();
            headers.add(CORRELATION_HEADER, id);
        }
        String correlationId = headers.getFirst(CORRELATION_HEADER);

        // Log request summary
        logger.info("[{}] -> {} {}", correlationId, request.getMethod(), request.getURI());
        // Log headers (mask sensitive)
        headers.forEach((k, vList) -> {
            String value = String.join(",", vList);
            logger.debug("[{}] Request Header: {}: {}", correlationId, k, maskIfSensitive(k, value));
        });

        // Log request body (if any)
        if (body != null && body.length > 0) {
            String bodyStr = new String(body, StandardCharsets.UTF_8);
            logger.debug("[{}] Request Body: {}", correlationId, truncate(bodyStr, 2000));
        }

        long start = System.currentTimeMillis();
        ClientHttpResponse response = execution.execute(request, body);
        long elapsed = System.currentTimeMillis() - start;

        // Read response body (requires buffering factory; otherwise stream can be consumed)
        byte[] responseBody = readAllBytes(response.getBody());
        String responseText = responseBody.length > 0 ? new String(responseBody, StandardCharsets.UTF_8) : "";

        logger.info("[{}] <- {} {} (status={}, {}ms)", correlationId, request.getMethod(), request.getURI(),
                response.getStatusCode(), elapsed);
        logger.debug("[{}] Response Headers: {}", correlationId, response.getHeaders());
        logger.debug("[{}] Response Body: {}", correlationId, truncate(responseText, 2000));

        // Need to return a response with the body we already read. Wrap it:
        return new BufferingClientHttpResponseWrapper(response, responseBody);
    }

    private static String truncate(String s, int max) {
        if (s == null) return null;
        return s.length() <= max ? s : s.substring(0, max) + "...(truncated)";
    }

    private static byte[] readAllBytes(InputStream in) throws IOException {
        if (in == null) return new byte[0];
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buf = new byte[4096];
        int r;
        while ((r = in.read(buf)) != -1) {
            baos.write(buf, 0, r);
        }
        return baos.toByteArray();
    }

    /**
     * Simple wrapper to re-expose the body we already consumed.
     * We must preserve status, headers, etc.
     */
    private static class BufferingClientHttpResponseWrapper implements ClientHttpResponse {
        private final ClientHttpResponse delegate;
        private final byte[] body;

        BufferingClientHttpResponseWrapper(ClientHttpResponse delegate, byte[] body) {
            this.delegate = delegate;
            this.body = body;
        }

        @Override
        public org.springframework.http.HttpStatusCode getStatusCode() throws IOException {
            return delegate.getStatusCode();
        }

        @Override
        public int getRawStatusCode() throws IOException {
            return delegate.getRawStatusCode();
        }

        @Override
        public String getStatusText() throws IOException {
            return delegate.getStatusText();
        }

        @Override
        public void close() {
            delegate.close();
        }

        @Override
        public HttpHeaders getHeaders() {
            return delegate.getHeaders();
        }

        @Override
        public InputStream getBody() {
            return new java.io.ByteArrayInputStream(body);
        }
    }
}
