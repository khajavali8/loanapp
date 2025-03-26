import Issue from '../models/Issue.js';

const issueController = {
  async reportIssue(req, res) {
    try {
      const issue = await Issue.create({ ...req.body, user: req.user.id });
      res.status(201).json(issue);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async getAllIssues(req, res) {
    try {
      const issues = await Issue.find()
        .populate("user", "firstName lastName email"); 

      res.status(200).json(issues);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

export default issueController;