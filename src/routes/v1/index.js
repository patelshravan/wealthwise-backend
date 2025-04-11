const express = require("express");
const AuthRoute = require("./auth/auth.routes");

const UserRoute = require("./user.routes");
const ReportRoute = require("./report.routes");
const DashboardRoute = require("./dashboard.routes");
const ExpenseRoute = require("./expense.routes");
const SavingsRoute = require("./savings.routes");
const InvestmentRoute = require("./investment.routes");
const LicRoute = require("./lic.routes");

const router = express.Router();

const defaultRoutes = [
  { path: "/auth", route: AuthRoute },
  { path: "/dashboard", route: DashboardRoute },
  { path: "/user", route: UserRoute },
  { path: "/user/report", route: ReportRoute },
  { path: "/expense", route: ExpenseRoute },
  { path: "/savings", route: SavingsRoute },
  { path: "/investment", route: InvestmentRoute },
  { path: "/lic-policy", route: LicRoute },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
