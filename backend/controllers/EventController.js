import Event from "../models/EventModel.js";
import { Op } from "sequelize";
import cors from "cors";

// Add CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  credentials: true, // Allow cookies and credentials
};

// GET ALL EVENTS
async function getEvents(req, res) {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
}

// GET EVENT BY ID
async function getEventById(req, res) {
  try {
    const event = await Event.findOne({ where: { id: req.params.id } });
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
}

// GET EVENTS BY DATE
async function getEventsByDate(req, res) {
  try {
    const { date } = req.params;
    const events = await Event.findAll({
      where: {
        start: { [Op.like]: `${date}%` }, // Use Sequelize's Op.like
      },
    });
    res.status(200).json(events);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
}

// CREATE EVENT
async function createEvent(req, res) {
  try {
    const newEvent = req.body;
    await Event.create(newEvent);
    res.status(201).json({ msg: "Event created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
}

// UPDATE EVENT
async function updateEvent(req, res) {
  try {
    const updatedEvent = req.body;
    const result = await Event.update(updatedEvent, { where: { id: req.params.id } });
    if (result[0] === 0) {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.status(200).json({ msg: "Event updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
}

// DELETE EVENT
async function deleteEvent(req, res) {
  try {
    const result = await Event.destroy({ where: { id: req.params.id } });
    if (result === 0) {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.status(200).json({ msg: "Event deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
}

export { getEvents, getEventById, createEvent, updateEvent, deleteEvent, getEventsByDate };
