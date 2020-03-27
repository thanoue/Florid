import { Role } from "./role";

const expressJwt = require('express-jwt');

export function authorize(roles: Role[] | string = []) {

    let role: string[] = [];

    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])

    if (typeof roles === 'string') {

        role.push(roles);

    } else {

        role = roles;

    }


    return [
        // authenticate JWT token and attach user to request object (req.user)
        expressJwt({
            secret: 'KHOIDEPTRAIAHIIH'
        }),
        // authorize based on user role
        (req: any, res: any, next: any) => {
            if (role.length && !role.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            next();
        }
    ];
}