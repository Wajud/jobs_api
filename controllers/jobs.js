const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const job = await Job.findOne({ createdBy: userId, _id: jobId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json(job);
};

const createJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    req.body.createdBy = userId;
    const { company, position } = req.body;
    if (!company || !position) {
      throw new BadRequestError("Please provide company name and position");
    }
    const job = await Job.create({ ...req.body, user: userId });

    res.status(StatusCodes.OK).json(job);
  } catch (err) {
    console.log(err);
  }
};

const updateJob = async (req, res) => {
  const user = req.user.userId;
  const jobId = req.params.id;
  const { company, position } = req.body;

  if (company === "" || position === "") {
    throw new BadRequestError("COmapny or POsition fields cannot be empty");
  }

  const job = await Job.findOneAndUpdate(
    { createdBy: user, _id: jobId },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(job);
};

const deleteJob = async (req, res) => {
  const user = req.user.userId;
  const jobId = req.params.id;
  const job = await Job.findOneAndDelete({ createdBy: user, _id: jobId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json(`Job with id ${jobId} successfully deleted`);
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
