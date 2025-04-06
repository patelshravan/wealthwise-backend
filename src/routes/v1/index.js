const express = require('express');
const AuthRoute = require('./auth/auth.routes');

const UserRoute = require('./user.routes');
const ExpenseRoute = require('./expense.routes');
const InvestmentRoute = require('./investment.routes');
const LicRoute = require('./lic.routes');

const router = express.Router();

const defaultRoutes = [
    { path: "/auth", route: AuthRoute },
    { path: "/user", route: UserRoute },
    { path: "/expense", route: ExpenseRoute },
    { path: "/investment", route: InvestmentRoute },
    { path: "/lic-policy", route: LicRoute },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;