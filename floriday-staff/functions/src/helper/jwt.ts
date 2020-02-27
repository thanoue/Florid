const expressJwt = require('express-jwt');

export function jwt() {
    const { secret } = {
        "secret": "KHOIDEPTRAIAHIIH"
    };
    return expressJwt({ secret }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate'
        ]
    });
}
