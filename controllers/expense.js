const Expense = require("../models/expense");
const User = require("../models/user");

exports.addExpense = (req, res, next) => {
  const { amount, description, category } = req.body;

  if (
    amount === undefined ||
    description === undefined ||
    category === undefined
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Parameters missing" });
  }

  Expense.create({ amount, description, category, userId: req.user.id })
    .then((expense) => {
      return res.status(201).json({ expense, success: true });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
};

exports.getExpenses = async (req, res, next) => {
  // Expense.findAll()
  const expenses = await Expense.findAll({ where: { userId: req.user.id } });
  const userDetails = await User.findByPk(req.user.id);
  // req.user
  //   .getExpenses()
  // ((expenses) => {
  return res.status(200).json({ expenses, success: true, userDetails });
  // })
};

// exports.deleteExpense = (req, res, next) => {
//   const expId = req.params.id;

//   Expense.destroy({ where: { id: expId } })
//     .then((response) => {
//       res.status(203).json({ success: true, message: "Deleted Successfully" });
//     })
//     .catch((err) => {
//       res.status(400).json({ error: err });
//     });
// };

exports.deleteExpense = (req, res, next) => {
  const expId = req.params.id;

  Expense.destroy({ where: { userId: expId } })
    .then((response) => {
      res.status(203).json({ success: true, message: "Deleted Successfully" });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};
