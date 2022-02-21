const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");

const errorHandler = (errors, _req, res, next) => {
  if (Array.isArray(errors)) {
    const error = errors.map((err) => err.message);
    res.send(error);
    next(errors);
  }

  let errMsg = "";
  errors?.errors?.forEach((err) => {
    if (err.validatorKey === "isBefore" || err.validatorKey === "isAfter") {
      errMsg = "Year must be between 1991 and 2022";
    }
  });
  if (errMsg) {
    return res.status(404).json({ msg: errMsg });
  } else if (errors.name === "ValidationError") {
    return res
      .status(404)
      .json({ msg: "Something went wrong with Credentials" });
  } else if (errors.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "invalid token",
    });
  }

  return res.status(400).json({ message: errors.message });
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      res.status(401).json({ error: "token invalid" });
    }
  } else {
    res.status(401).json({ error: "token missing" });
  }
  next();
};

module.exports = { errorHandler, tokenExtractor };
