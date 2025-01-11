import  { useEffect } from "react";
import { ArrowLeft, Calendar, Share2, BookmarkPlus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { viewPost } from "../../Customhookslogic/Viewpost";

const DetailPage = ({  }) => {
   const { postid } = useParams();
   const navigate = useNavigate()
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
          <img
            src={posts?.image}
            alt={posts?.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {posts?.title}
              </h1>

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
                {/* {new Date(samplePost.createdAt).toLocaleDateString()} */}
              </div>
              <span>•</span>
              <span>•</span>
            </div>
          </div>

          {/* Content */}
          <div className="border-t border-gray-100 pt-6">
            <p className="text-gray-700 leading-relaxed">{posts?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
