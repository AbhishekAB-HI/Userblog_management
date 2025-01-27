import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import {
  ArrowLeft,
  Calendar,
  Share2,
  BookmarkPlus,
  Star,
  MessageCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { viewPost } from "../../Customhookslogic/Viewpost";
import axiosInterseptor from "../../Services/Axiosinterceptor";
import { API_ENDPOINTS } from "../../Messages/Apimessages";
import toast from "react-hot-toast";
import {
  IAllReview,
  Review,
  ReviewComponentProps,
} from "../../interfaces/Userinfo";

const ReviewComponent: React.FC<ReviewComponentProps> = () => {
  const { postid } = useParams<{ postid: string }>();
  const [getAllReviews, setgetAllReviews] = useState<IAllReview[] | any>();
  const [visibleReviews, setVisibleReviews] = useState(2);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReviews = () => {
    if (isExpanded) {
      setVisibleReviews(2);
      setIsExpanded(false);
    } else {
      setVisibleReviews(getAllReviews?.length);
      setIsExpanded(true);
    }
  };

  const getReviews = async () => {
    try {
      const { data } = await axiosInterseptor.get(
        `${API_ENDPOINTS.GET_REVIEW}?id=${postid}`
      );

      if (data.message === "get all reviews") {
        setgetAllReviews(data.findtheReviews);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  const [newReview, setNewReview] = useState<Omit<Review, "id" | "date">>({
    name: "",
    rating: 0,
    comment: "",
  });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newReview.name && newReview.comment && newReview.rating > 0) {
      try {
        const { data } = await axiosInterseptor.post(API_ENDPOINTS.ADD_REVIEW, {
          newReview,
          postid: postid,
        });
        if (data.message == "Review added successfully") {
          toast.success("Review Added successfully");
          setNewReview({ name: "", rating: 0, comment: "" });
          getReviews();
        }
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    } else {
      console.error("Please fill out all fields before submitting the review.");
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="text-blue-600" /> Reviews (
        {getAllReviews?.length})
      </h2>

      <div className="space-y-4 mb-8">
        {getAllReviews
          ?.slice(0, visibleReviews)
          .map((review: any, index: number) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{review?.ReviewedBy}</span>
                  <div className="flex text-yellow-500">
                    {[...Array(review.Rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {review?.date && review.date?.split("T")[0]}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}

        {getAllReviews?.length > 3 && (
          <button
            onClick={toggleReviews}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mx-auto mt-4 py-2 px-4 rounded-md hover:bg-blue-50 transition-all duration-200"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp size={20} />
              </>
            ) : (
              <>
                View More ({getAllReviews?.length - 3} more reviews){" "}
                <ChevronDown size={20} />
              </>
            )}
          </button>
        )}
      </div>

      <form
        onSubmit={handleReviewSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-xl font-semibold mb-4">Add a Review</h3>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Your Name"
            value={newReview.name}
            onChange={(e) =>
              setNewReview({ ...newReview, name: e.target.value })
            }
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <div className="flex gap-1 text-yellow-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                fill={star <= newReview.rating ? "currentColor" : "none"}
                stroke="currentColor"
                onClick={() => setNewReview({ ...newReview, rating: star })}
                className="cursor-pointer hover:scale-110 transition-transform"
              />
            ))}
          </div>
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Your Review"
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            className="w-full p-2 border rounded-md min-h-[100px]"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

const DetailPage: React.FC = () => {
  const { postid } = useParams<{ postid: string }>();
  const navigate = useNavigate();
  const { fetchViewPage, posts } = viewPost();

  useEffect(() => {
    fetchViewPage(postid);
  }, []);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleShare = () => {
    console.log("Sharing post");
  };

  const handleBookmark = () => {
    console.log("Bookmarking post");
  };

  // Sanitize title and description
  const sanitizedTitle = posts?.title ? DOMPurify.sanitize(posts.title) : "";
  const sanitizedDescription = posts?.description
    ? DOMPurify.sanitize(posts.description)
    : "";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 group"
      >
        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Posts
      </button>

      {/* Main Content Container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-96 w-full">
          {posts?.image && (
            <img
              src={posts.image}
              alt={sanitizedTitle}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex justify-between items-start gap-4">
              {/* Render sanitized title */}
              <h1
                className="text-3xl font-bold text-gray-900"
                dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
              ></h1>

              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                  title="Share post"
                >
                  <Share2 size={20} />
                </button>
                <button
                  onClick={handleBookmark}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                  title="Bookmark post"
                >
                  <BookmarkPlus size={20} />
                </button>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {posts?.createdAt &&
                  new Date(posts.createdAt).toLocaleDateString()}
              </div>
              <span>•</span>
            </div>
          </div>

          {/* Content */}
          <div className="border-t border-gray-100 pt-6">
            {/* Render sanitized description */}
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            ></div>
          </div>

          {/* Reviews Component */}
          {postid && <ReviewComponent postId={postid} />}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
