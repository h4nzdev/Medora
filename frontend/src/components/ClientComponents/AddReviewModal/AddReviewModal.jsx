import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { Star, X, MessageSquare, Award, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const AddReviewModal = ({ isOpen, onClose, doctorId, onReviewSubmitted }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      setError("Please provide a rating and a comment.");
      return;
    }

    try {
      const reviewData = {
        doctor: doctorId,
        patient: user._id, // Assuming user context holds patient info
        rating,
        comment,
      };
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reviews`,
        reviewData
      );
      onReviewSubmitted(); // Refresh reviews on the profile page
      onClose(); // Close the modal
      setRating(0);
      setComment("");
      toast.success("Review has been added successfully");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while submitting the review."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingText = (stars) => {
    switch (stars) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "Rate your experience";
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 max-h-[95vh] overflow-y-auto">
        {/* Header with gradient accent */}
        <div className="relative bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-500 rounded-t-2xl sm:rounded-t-3xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-between items-start sm:items-center">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 pr-2">
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-full backdrop-blur-sm flex-shrink-0 mt-0.5 sm:mt-0">
                <Award className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
                  Share Your Review
                </h2>
                <p className="text-cyan-100 text-xs sm:text-sm mt-0.5">
                  Help others make informed decisions
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Rating Section */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current flex-shrink-0" />
                <label className="text-slate-800 font-semibold text-base sm:text-lg">
                  Rate Your Experience
                </label>
              </div>

              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  const isActive = starValue <= (hoverRating || rating);
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      className="focus:outline-none transform transition-all duration-200 hover:scale-110 p-1"
                    >
                      <Star
                        className={`w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200 ${
                          isActive
                            ? "text-yellow-400 fill-current drop-shadow-sm"
                            : "text-slate-300 hover:text-slate-400"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-center">
                <span
                  className={`text-base sm:text-lg font-semibold transition-all duration-300 ${
                    (hoverRating || rating) > 0
                      ? "text-slate-800"
                      : "text-slate-500"
                  }`}
                >
                  {getRatingText(hoverRating || rating)}
                </span>
                {(hoverRating || rating) > 0 && (
                  <div className="flex justify-center mt-2">
                    <div className="flex gap-1">
                      {[...Array(hoverRating || rating)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse"
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comment Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 flex-shrink-0" />
                <label
                  htmlFor="comment"
                  className="text-slate-800 font-semibold text-base sm:text-lg"
                >
                  Share Your Thoughts
                </label>
              </div>
              <div className="relative">
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                  className="w-full p-3 sm:p-4 border-2 border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 resize-none bg-gradient-to-br from-white to-slate-50 placeholder-slate-400 text-sm sm:text-base"
                  rows="3"
                  placeholder="Tell us about your experience with this doctor. What made it special?"
                />
                <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs text-slate-400">
                  {comment.length}/500
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <p className="text-red-600 text-sm font-medium flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1"></div>
                  <span className="flex-1">{error}</span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-2 sm:pt-4">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 text-white font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden text-sm sm:text-base w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Submit Review
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Star className="w-4 h-4" />
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;
