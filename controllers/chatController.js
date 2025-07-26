const {
  createComplaint,
  getComplaintsByUser,
  getAllComplaints: fetchAllComplaints,
  updateComplaintStatus,
} = require('../models/ChatModel');

const raiseComplaint = async (req, res) => {
  try {
    const { type, description, images } = req.body;
    const userId = req.user.id;
    const complaint = await createComplaint({ userId, type, description, images, status: 'pending' });
    res.status(201).json(complaint);
  } catch (error) {
    console.error('Error raising complaint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserComplaints = async (req, res) => {
  try {
    const userId = req.user.id;
    const complaints = await getComplaintsByUser(userId);
    res.json(complaints);
  } catch (error) {
    console.error('Error getting complaints:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await fetchAllComplaints();
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching all complaints:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const markComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;
    const updated = await updateComplaintStatus(id, status, response);
    res.json(updated);
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { raiseComplaint, getUserComplaints, getAllComplaints, markComplaintStatus };

