const nodemailer = require("nodemailer");
const Course = require("../models/Course");
const User = require("../models/User");


exports.getIndexPage = async (req, res) => {
  const courses = await Course.find().sort('-createdAt').limit(2)
  const totalCourses = await Course.find().countDocuments()
  const totalStudents = await User.countDocuments({role : 'student'}) 
  const totalTeachers = await User.countDocuments({role : 'teacher'}) 

  res.status(200).render("index", {
    page_name: "index",
    courses,
    totalCourses,
    totalStudents,
    totalTeachers
  });
};

exports.getAboutPage = (req, res) => {
  res.status(200).render("about", {
    page_name: "about",
  });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render("register", {
    page_name: "register",
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render("login", {
    page_name: "login",
  });
};

exports.getContactPage = (req, res) => {
  res.status(200).render("contact", {
    page_name: "contact",
  });
};

exports.sendEmail = async (req, res) => {
  try {
    const outputMessage = `
  <h1> Mail Details </h1>
  <ul>
    <li>Name : ${req.body.name}</li>
    <li>Email : ${req.body.email}</li>
  </ul>

  <h1>Message</h1>
  <p> ${req.body.message} </p>
  `;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: "casus589@gmail.com",
        pass: "dffm euhg ckcp zdkb",
      },
    });
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Smart Edu Contact Form" <casus589@gmail.com>', // sender address
        to: "WoTBlitz_01@outlook.com", // list of receivers
        subject: "Smart Edu Contact Form New Message",
        html: outputMessage, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>


    req.flash("success", "We received your message successfully");

    res.status(200).redirect("contact");
  } catch (err) {
    req.flash("error", `Something happened! ${err}`);
    res.status(200).redirect("contact");
  }
};
