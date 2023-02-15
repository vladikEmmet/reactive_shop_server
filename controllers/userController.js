const ApiError = require("../error/ApiError");
const userService = require("../service/userService");
const { validationResult } = require("express-validator");
const cookie = require("cookie");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest("Validation error", errors.array()));
      }

      const { email, password, role } = req.body;
      const userData = await userService.registration(email, password, role);
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("refreshToken", userData.refreshToken, {
          sameSite: "none",
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        })
      );
      // res.cookie("refreshToken", userData.refreshToken, {
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      //   httpOnly: true,
      // });
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      // res.cookie("refreshToken", userData.refreshToken, {
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      //   httpOnly: true,
      // })

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("refreshToken", userData.refreshToken, {
          sameSite: "none",
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        })
      );
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("refreshToken", "", {
          sameSite: "none",
          secure: true,
          maxAge: 1,
          httpOnly: true,
        })
      );
      const token = await userService.logout(refreshToken);
      // res.clearCookie("refreshToken");
      return res.json(token);
    } catch (err) {
      next(err);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      // res.cookie("refreshToken", userData.refreshToken, {
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      //   httpOnly: true,
      // });

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("refreshToken", userData.refreshToken, {
          sameSite: "none",
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        })
      );
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
