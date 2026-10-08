// Auth middleware removed as authentication is not used in this alert escalation system.
export const authenticate = (req, res, next) => next();
export const authorize = () => (req, res, next) => next();