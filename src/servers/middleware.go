package servers

import (
	"net/http"
	"compress/gzip"
	"strings"

	"github.com/bililive-go/bililive-go/src/instance"
)

func log(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		instance.GetInstance(r.Context()).Logger.WithFields(map[string]interface{}{
			"Method":     r.Method,
			"Path":       r.RequestURI,
			"RemoteAddr": r.RemoteAddr,
		}).Debug("Http Request")
		handler.ServeHTTP(w, r)
	})
}

// addCachingHeaders sets cache headers for static assets and index.html differently
func addCachingHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		if strings.HasPrefix(path, "/static/") || strings.Contains(path, ".") {
			// Long cache for assets (immutable if content-hashed)
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		} else {
			// Short cache for HTML routes
			w.Header().Set("Cache-Control", "no-cache")
		}
		next.ServeHTTP(w, r)
	})
}

type gzipResponseWriter struct {
	http.ResponseWriter
	writer *gzip.Writer
}

func (w *gzipResponseWriter) Write(b []byte) (int, error) {
	return w.writer.Write(b)
}

// addGzipCompression compresses responses when client supports gzip
func addGzipCompression(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
			next.ServeHTTP(w, r)
			return
		}
		w.Header().Set("Content-Encoding", "gzip")
		gz := gzip.NewWriter(w)
		defer gz.Close()
		grw := &gzipResponseWriter{ResponseWriter: w, writer: gz}
		next.ServeHTTP(grw, r)
	})
}