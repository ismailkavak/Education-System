const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course")
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect('/login');
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).send("There is no user!");
    }
    const same = await bcrypt.compare(password, user.password);
    if (same) {
      req.session.userID = user._id;
      res.status(200).redirect("/users/dashboard");
    }else {
      res.status(401).redirect("/login")
    }
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error,
    });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({_id: req.session.userID}).populate('courses')
  const categories = await Category.find({})
  const courses = await Course.find({user : req.session.userID})
  res.status(200).render('dashboard', {
    page_name : 'dashboard',
    user,
    categories,
    courses
  })
}