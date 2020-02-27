const jwt = require('jsonwebtoken');

// users hardcoded for simplicity, store in a db for production applications
const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

export async function authenticate(body: any): Promise<any> {

    const user = users.find(u => u.username === body.username && u.password === body.password);

    if (user) {
        const token = jwt.sign({ sub: user.id }, "KHOIDEPTRAIAHIIH");
        const { password, ...userWithoutPassword } = user;

        return {
            ...userWithoutPassword,
            token
        };
    }

    return '';
}

export async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}
