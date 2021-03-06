const bcrypt = require("bcrypt");
const User = require("../services/mongoose/user");
const { registerValidator, loginValidator } = require("../validation/auth");
const expressSession = require("../services/expressSession");

module.exports = {
  async register(req, res) {
    await registerValidator(req.body);

    const user = await User.create(req.body);

    expressSession.login(req, user._id);

    res.json({ success: "User created" });
  },

  async getUser(req, res) {
    const user = await User.getById(req.session.userId);
    res.json(user);
  },

  async login(req, res) {
    await loginValidator(req.body);

    const user = await User.getByEmail(req.body.email);

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    expressSession.login(req, user._id);

    return res.json({ success: "You are logged in" });
  },

  async logout(req, res) {
    expressSession.logout(req);
    res.send({ success: "ok" });
  }
};
