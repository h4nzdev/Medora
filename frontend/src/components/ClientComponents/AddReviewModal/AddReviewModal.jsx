
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { Star, X } from 'lucide-react';

const AddReviewModal = ({ isOpen, onClose, doctorId, onReviewSubmitted }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      setError('Please provide a rating and a comment.');
      return;
    }

    try {
      const reviewData = {
        doctor: doctorId,
        patient: user._id, // Assuming user context holds patient info
        rating,
        comment,
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews`, reviewData);
      onReviewSubmitted(); // Refresh reviews on the profile page
      onClose(); // Close the modal
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while submitting the review.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Add Your Review</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-slate-600 mb-2 font-semibold">Your Rating</label>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors duration-200 ${ 
                        starValue <= rating 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="comment" className="block text-slate-600 mb-2 font-semibold">Your Comment</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow"
              rows="4"
              placeholder="Share your experience with the doctor..."
            ></textarea>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;
