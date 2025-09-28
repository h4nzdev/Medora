
import Review from '../model/reviewModel.js';
import Doctor from '../model/doctorModel.js';
import Patient from '../model/patientsModel.js';

// @desc    Get all reviews for a specific doctor
// @route   GET /api/reviews/doctor/:doctorId
// @access  Public
export const getReviewsForDoctor = async (req, res) => {
  try {
    const reviews = await Review.find({ doctor: req.params.doctorId }).populate('patient', 'name patientPicture');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews/
// @access  Private (Patient)
export const createReview = async (req, res) => {
  const { doctor, patient, rating, comment } = req.body;

  try {
    // 1. **Find the doctor and patient**
    const doctorExists = await Doctor.findById(doctor);
    const patientExists = await Patient.findById(patient);

    if (!doctorExists || !patientExists) {
      return res.status(404).json({ message: 'Doctor or Patient not found' });
    }

    // 2. **Check for existing review**
    const existingReview = await Review.findOne({ doctor, patient });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this doctor' });
    }

    // 3. **Create and save the new review**
    const review = new Review({
      doctor,
      patient,
      rating,
      comment,
    });

    await review.save();

    // 4. **Update the doctor's average rating (optional but recommended)**
    // This is an advanced feature we can add later.

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error });
  }
};
