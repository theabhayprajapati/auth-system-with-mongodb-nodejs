import { Router } from "express/lib/router";
const router = Router();
/*  /login */
router.get("/login", (req, res) => {
    res.send("Login");
});
/* /register */
router.get("/register", (req, res) => {
    res.send("Register");
});
export default router;
