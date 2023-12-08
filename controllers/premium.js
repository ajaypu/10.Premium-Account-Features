const Expense = require("../models/expense");
const User = require("../models/user");

const Sequelize = require("sequelize");

exports.getPremium = async (req, res, next) => {
  const results = await User.findAll({
    attributes: [
      "id",
      "name",
      [Sequelize.fn("SUM", Sequelize.col("Expenses.amount")), "totalExpense"],
    ],
    include: [
      {
        model: Expense,
        attributes: [],
      },
    ],
    group: ["User.id"],
    order: [[Sequelize.literal("totalExpense"), "DESC"]],
  });

  // const expenses = await Expense.findAll({
  //   include: [
  //     {
  //       model: User,
  //       attributes: ["name"], // Specify the columns you want to retrieve from the joined table
  //     },
  //   ],
  // });
  // const user = await User.findAll();
  return res.status(200).json({ success: true, results });
};
