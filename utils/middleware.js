const errorHandler = (errors, _req, res, next) => {
  if (Array.isArray(errors)) {
    const error = errors.map((err) => err.message);
    res.send(error);
    next(errors);
  }
  if (errors.name === "ValidationError") {
    res.status(404).json({ msg: "Something went wrong with Credentials" });
  } else if (errors.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "invalid token",
    });
  }

  return res.status(400).json({ message: errors.message });
};

module.exports = { errorHandler };
