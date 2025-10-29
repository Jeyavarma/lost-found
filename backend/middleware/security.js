const rateLimit = require('express-rate-limit');

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for general API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers middleware
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  next();
};

// Simple CSRF-like protection using custom headers
const csrfProtection = (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const origin = req.get('Origin');
    const referer = req.get('Referer');
    const userAgent = req.get('User-Agent');
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3002',
      'https://lost-found-mcc.vercel.app',
      'https://mcc-lost-found.vercel.app',
      'https://lost-found-79xn.onrender.com'
    ];
    
    // Allow requests with valid origin/referer or from browsers
    if (origin || referer || (userAgent && userAgent.includes('Mozilla'))) {
      const requestOrigin = origin || (referer && new URL(referer).origin);
      
      // Also allow any vercel.app subdomain in production
      const isVercelDomain = requestOrigin && requestOrigin.match(/https:\/\/.*\.vercel\.app$/);
      
      if (requestOrigin && !allowedOrigins.includes(requestOrigin) && !isVercelDomain) {
        return res.status(403).json({ error: 'Invalid origin' });
      }
    }
  }
  next();
};

module.exports = { authLimiter, apiLimiter, securityHeaders, csrfProtection };