require("dotenv").config();
const { Sequelize, QueryTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const main = async () => {
  try {
    await sequelize.authenticate();
    const blogs = await sequelize.query("SELECT * FROM blogs", {
      type: QueryTypes.SELECT,
    });
    console.log(
      `${blogs[0].author}: ${blogs[0].title}, ${blogs[0].likes} likes`
    );
    console.log(
      `${blogs[1].author}: ${blogs[1].title}, ${blogs[1].likes} likes`
    );
    sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database", error);
  }
};

main();
