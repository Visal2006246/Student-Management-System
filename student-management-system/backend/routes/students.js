const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Course = require("../models/course");

router.get("/", async (req, res) => {
  try {
    const students = await Student.find().populate("enrolledCourses");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("enrolledCourses");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { name, email, age, enrolledCourses } = req.body;

  const student = new Student({
    name,
    email,
    age,
    enrolledCourses: enrolledCourses.map(course => course.trim())
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { name, email, age, enrolledCourses } = req.body;

  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        age,
        enrolledCourses: enrolledCourses.map(course => course.trim())
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
