// next.config.js

// https://nextjs.org/docs/advanced-features/security-headers
// const ContentSecurityPolicy = `
//   default-src 'self';
//   script-src 'self';
//   child-src 'self';
//   style-src 'self';
//   font-src 'self';  
// `

const securityHeaders = [
  // just for perf
  {key: 'X-DNS-Prefetch-Control', value: 'on'},
  // specified by default on next.js, only need to override because we're overriding headers
  {key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload'},
  // csp should make this irrelevant, but just in case
  {key: 'X-XSS-Protection', value: '1; mode=block'},
  // frustrate xss attacks that change content type
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  // strip referrer always
  {key: 'Referrer-Policy', value: 'no-referrer'},
  // the bulk of xss protection is this guy
  // {key: 'Content-Security-Policy', value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()}
]

module.exports = {
  future: {
    webpack5: true, // by default, if you customize webpack config, they switch back to version 4. 
      // Looks like backward compatibility approach.
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
        // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    };

    return config;
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
};
