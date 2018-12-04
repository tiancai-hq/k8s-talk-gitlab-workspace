const CONFIG = {
  "ML_SERVICE_HOST": process.env.ML_SERVICE_HOST || "localhost:50052",
  "MATH_SERVICE_HOST": process.env.MATH_SERVICE_HOST || "localhost:50051",
  "PORT": process.env.PORT || 3000
};

module.exports = CONFIG;

