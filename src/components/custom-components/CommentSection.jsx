import { useSession } from 'next-auth/react';
import React, { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ThumbsUp, ThumbsDown, MessageCircle, Star, Filter, ChevronDown, Check, Edit2, Trash2, Loader2, CheckCircle2, Calendar, Smile } from 'lucide-react';
import RatingStars from './RatingStars';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, updateComment, deleteComment, likeComment, unlikeComment, setComments, clearComments } from '@/store/features/commentsSlice';
import { toast } from 'sonner';
import Link from 'next/link';
import EmojiPicker from 'emoji-picker-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CommentSection = ({ productId, reviews = [] }) => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { comments = [], addLoading, updateLoading, deleteLoading, likeLoading } = useSelector((state) => state.comments || {});
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [activeLikeId, setActiveLikeId] = useState(null);
  const [activeUnlikeId, setActiveUnlikeId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showEditEmojiPicker, setShowEditEmojiPicker] = useState(false);

  // Initialize comments from props
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      dispatch(setComments(reviews));
    }
    return () => {
      dispatch(clearComments());
    };
  }, [reviews, dispatch, productId]);

  const handleLikeComment = async (commentId) => {
    if (!session?.user?._id) {
      toast.error('Please sign in to like comments');
      return;
    }
    try {
      setActiveLikeId(commentId);
      const result = await dispatch(likeComment({
        commentId,
        userId: session.user._id,
      })).unwrap();

      // Update the local state to reflect the change immediately
      const updatedComments = comments.map(review => {
        if (review._id === commentId) {
          return {
            ...review,
            likes: [...(review.likes || []), session.user._id]
          };
        }
        return review;
      });
      dispatch(setComments(updatedComments));
    } catch (error) {
      // Already controll in slice
    } finally {
      setActiveLikeId(null);
    }
  };

  const handleUnlikeComment = async (commentId) => {
    if (!session?.user?._id) {
      toast.error('Please sign in to unlike comments');
      return;
    }

    try {
      setActiveUnlikeId(commentId);
      const result = await dispatch(unlikeComment({
        commentId,
        userId: session.user._id,
      })).unwrap();

      // Update the local state to reflect the change immediately
      const updatedComments = comments.map(review => {
        if (review._id === commentId) {
          return {
            ...review,
            likes: (review.likes || []).filter(id => id !== session.user._id)
          };
        }
        return review;
      });
      dispatch(setComments(updatedComments));
    } catch (error) {
      // Already controll in slice
    } finally {
      setActiveUnlikeId(null);
    }
  };

  const averageRating = useMemo(() => {
    if (!comments.length) return 0;
    const sum = comments.reduce((acc, review) => acc + (review.rating || 0), 0);
    return (sum / comments.length).toFixed(1);
  }, [comments]);

  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    comments.forEach(review => {
      if (review.rating) distribution[review.rating]++;
    });
    return distribution;
  }, [comments]);

  const filteredComments = useMemo(() => {
    if (!selectedRating) return comments;
    return comments.filter(review => review.rating === selectedRating);
  }, [comments, selectedRating]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await dispatch(addComment({
        productId,
        comment: comment.trim(),
        rating,
      })).unwrap();

      setComment('');
      setRating(0);
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleUpdateComment = async (reviewId) => {
    if (!editComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    if (!editRating) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await dispatch(updateComment({
        reviewId,
        productId,
        reviewComment: editComment.trim(),
        rating: editRating,
      })).unwrap();

      setEditingComment(null);
      setEditComment('');
      setEditRating(0);
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleDeleteComment = async (reviewId) => {
    try {
      await dispatch(deleteComment({ reviewId, productId })).unwrap();
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const getBarWidth = (star) => {
    const widths = {
      5: '100%',
      4: '80%',
      3: '60%',
      2: '40%',
      1: '20%'
    };
    return widths[star];
  };

  const onEmojiClick = (emojiData) => {
    setComment(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const onEditEmojiClick = (emojiData) => {
    setEditComment(prev => prev + emojiData.emoji);
    setShowEditEmojiPicker(false);
  };

  return (
    <div className="mt-16 max-sm:mt-10 max-w-7xl mx-auto px-4 max-md:p-0">
      <div className="mb-10 max-sm:mb-5">
        <h3 className="text-2xl max-sm:text-xl font-semibold text-[var(--textColor)] dark:text-gray-100">
          Ratings & Reviews
        </h3>
        <div className="w-16 h-[2px] bg-[var(--primaryColor)] dark:bg-[#FFB74D] mt-3 max-sm:mt-2"></div>
      </div>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        <div className="lg:col-span-1">
          <div className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-[var(--primaryColor)]/30 dark:border-gray-700 bg-[var(--primaryColor)]/5 dark:bg-gray-800/50">
            <div className="text-5xl font-bold text-[var(--textColor)] dark:text-gray-100 mb-2">
              {averageRating}
            </div>
            <RatingStars rating={parseFloat(averageRating)} readonly size={24} />
            <p className="text-sm text-[var(--textColor)]/60 dark:text-gray-400 mt-2">
              Based on {comments.length} reviews
            </p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedRating(selectedRating === star ? null : star)}
                  className={`flex items-center gap-1 w-24 cursor-pointer ${selectedRating === star
                    ? 'text-[var(--primaryColor)] dark:text-[#FFB74D]'
                    : 'text-[var(--textColor)] dark:text-gray-300'
                    }`}
                >
                  <span className="text-sm font-medium">{star}</span>
                  <Star size={16} className="fill-current" />
                  {selectedRating === star && <Check size={16} />}
                </button>
                <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--primaryColor)] dark:bg-[#FFB74D] transition-all duration-300 ease-in-out"
                    style={{
                      width: getBarWidth(star),
                      opacity: ratingDistribution[star] > 0 ? 1 : 0.3
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 w-24">
                  <span className="text-sm font-medium text-[var(--textColor)] dark:text-gray-300">
                    {ratingDistribution[star]}
                  </span>
                  <span className="text-xs text-[var(--textColor)]/60 dark:text-gray-400">
                    {comments.length > 0
                      ? `${Math.round((ratingDistribution[star] / comments.length) * 100)}%`
                      : '0%'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {session ? (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-lg border-2 border-[var(--primaryColor)]/30 dark:border-gray-700 bg-[var(--primaryColor)]/5 dark:bg-gray-800/50"
          onSubmit={handleSubmitComment}
        >
          <h4 className="text-lg font-semibold text-[var(--textColor)] dark:text-gray-100 mb-4">
            Write a Review
          </h4>
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={session?.user?.avatar?.url || session?.user?.image || '/assets/userDefaultAvatar.png'}
                alt={`${session?.user?.name || 'User'}'s profile picture`}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--textColor)] dark:text-gray-300 mb-2">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  <RatingStars
                    rating={hoveredRating || rating}
                    setRating={setRating}
                    onMouseEnter={setHoveredRating}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                  <span className="text-sm text-[var(--textColor)]/60 dark:text-gray-400">
                    {hoveredRating || rating ? `${hoveredRating || rating} stars` : 'Select rating'}
                  </span>
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full p-3 rounded-lg border-2 border-[var(--primaryColor)]/30 dark:border-gray-700 bg-transparent text-[var(--textColor)] dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[var(--primaryColor)] dark:focus:border-[#FFB74D] resize-none min-h-[100px]"
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-2 bottom-2 p-1 text-[var(--textColor)]/60 dark:text-gray-400 hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] transition-colors cursor-pointer"
                >
                  <Smile size={20} />
                </button>
                {showEmojiPicker && (
                  <div className="absolute right-0 bottom-12 z-10">
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      theme="dark"
                      width={300}
                      height={400}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={addLoading}
                  className="flex items-center cursor-pointer gap-2 px-6 py-2 rounded-md bg-[var(--primaryColor)] dark:bg-[#FFB74D] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Post Review</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.form>
      ) : (
        <div className="mb-8 p-6 rounded-lg border-2 border-[var(--primaryColor)]/30 dark:border-gray-700 bg-[var(--primaryColor)]/5 dark:bg-gray-800/50">
          <p className="text-center text-[var(--textColor)] dark:text-gray-300">
            Please{' '}
            <Link href="/auth" className="text-[var(--primaryColor)] dark:text-[#FFB74D] hover:underline">
              sign in
            </Link>{' '}
            to leave a review
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-[var(--textColor)] dark:text-gray-100">
            All Reviews ({filteredComments.length})
          </h4>
          <div className="relative">
            <div
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-[var(--primaryColor)]/30 dark:border-gray-700 hover:bg-[var(--primaryColor)]/5 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            >
              <Filter size={16} />
              <span>Filter</span>
              <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </div>
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div
                      key={star}
                      onClick={() => {
                        setSelectedRating(selectedRating === star ? null : star);
                        setShowFilters(false);
                      }}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-[var(--textColor)] dark:text-gray-300 hover:bg-[var(--primaryColor)]/5 dark:hover:bg-gray-700/50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <RatingStars rating={star} readonly size={16} />
                        <span>& Up</span>
                      </div>
                      {selectedRating === star && <Check size={16} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {filteredComments.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex gap-4 p-6 rounded-lg border-2 border-[var(--primaryColor)]/30 dark:border-gray-700 bg-[var(--primaryColor)]/5 dark:bg-gray-800/50"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={review?.reviewCustommer?.avatar?.url || review?.user?.image || '/assets/userDefaultAvatar.png'}
                  alt={`${review?.reviewCustommer?.fullName || 'User'}'s profile picture`}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-[var(--textColor)] dark:text-gray-100 flex items-center">
                      {review?.reviewCustommer?.fullName || 'Anonymous User'}
                    </h4>
                    <div className="flex items-center gap-1 text-sm text-[var(--primaryColor)] dark:text-[#FFB74D]">
                      <CheckCircle2 size={16} />
                      <span>Verified</span>
                    </div>
                    <RatingStars rating={review.rating} readonly size={14} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--textColor)]/60 dark:text-gray-400 flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {session?.user?._id === review?.reviewCustommer?._id && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingComment(review._id);
                            setEditComment(review.reviewComment);
                            setEditRating(review.rating);
                          }}
                          className="p-1 text-[var(--textColor)]/60 dark:text-gray-400 hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] transition-colors cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setCommentToDelete(review._id);
                            setDeleteDialogOpen(true);
                          }}
                          className="p-1 text-[var(--textColor)]/60 dark:text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {editingComment === review._id ? (
                  <div className="mt-2">
                    <div className="mb-2">
                      <RatingStars
                        rating={editRating}
                        setRating={setEditRating}
                      />
                    </div>
                    <div className="relative">
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full p-3 rounded-lg border-2 border-[var(--primaryColor)]/30 dark:border-gray-700 bg-transparent text-[var(--textColor)] dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[var(--primaryColor)] dark:focus:border-[#FFB74D] resize-none min-h-[100px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditEmojiPicker(!showEditEmojiPicker)}
                        className="absolute right-2 bottom-2 p-1 text-[var(--textColor)]/60 dark:text-gray-400 hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] transition-colors cursor-pointer"
                      >
                        <Smile size={20} />
                      </button>
                      {showEditEmojiPicker && (
                        <div className="absolute right-0 bottom-12 z-10">
                          <EmojiPicker
                            onEmojiClick={onEditEmojiClick}
                            theme="dark"
                            width={300}
                            height={400}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => {
                          setEditingComment(null);
                          setEditComment('');
                          setEditRating(0);
                        }}
                        className="px-4 py-2 rounded-md border-2 border-[var(--primaryColor)]/30 dark:border-gray-700 text-[var(--textColor)] dark:text-gray-300 hover:bg-[var(--primaryColor)]/5 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateComment(review._id)}
                        disabled={updateLoading}
                        className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-md bg-[var(--primaryColor)] dark:bg-[#FFB74D] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updateLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Check size={16} />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-[var(--textColor)]/90 dark:text-gray-300 mt-2">{review.reviewComment}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => handleLikeComment(review._id)}
                        disabled={activeLikeId === review._id}
                        className={`flex items-center gap-1 text-sm ${review.likes?.includes(session?.user?._id)
                          ? 'text-[var(--primaryColor)] dark:text-[#FFB74D] font-medium'
                          : 'text-[var(--textColor)]/60 dark:text-gray-400'
                          } hover:text-[var(--primaryColor)] dark:hover:text-[#FFB74D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                      >
                        {likeLoading && activeLikeId === review._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <ThumbsUp size={16} className={review.likes?.includes(session?.user?._id) ? 'fill-current' : ''} />
                        )}
                        <span>
                          {review.likes?.length || 0} {review.likes?.length === 1 ? 'Helpful' : 'Helpful'}
                        </span>
                      </button>
                      <button
                        onClick={() => handleUnlikeComment(review._id)}
                        disabled={likeLoading && (activeLikeId === review._id || activeUnlikeId === review._id)}
                        className={`flex items-center gap-1 text-sm ${!review.likes?.includes(session?.user?._id)
                          ? 'text-red-500 dark:text-red-400 font-medium'
                          : 'text-[var(--textColor)]/60 dark:text-gray-400'
                          } hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                      >
                        {likeLoading && activeUnlikeId === review._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <ThumbsDown size={16} />
                        )}
                        <span>Not Useful</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredComments.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 mx-auto text-[var(--textColor)]/40 dark:text-gray-600 mb-4" />
            <p className="text-[var(--textColor)]/60 dark:text-gray-400">
              {selectedRating
                ? `No ${selectedRating}-star reviews yet. Be the first to review this product!`
                : 'No reviews yet. Be the first to review this product!'}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[var(--bgColor)] dark:bg-gray-800 border-2 border-[var(--primaryColor)]/30 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-[var(--textColor)] dark:text-gray-100">Delete Review</DialogTitle>
            <DialogDescription className="text-[var(--textColor)]/60 dark:text-gray-400">
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-4 sm:gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setCommentToDelete(null);
              }}
              className="flex-1 border-2 border-[var(--primaryColor)]/30 dark:border-gray-700 text-[var(--textColor)] dark:text-gray-300 hover:bg-[var(--primaryColor)]/5 dark:hover:bg-gray-800/50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteComment(commentToDelete)}
              disabled={deleteLoading}
              className="flex-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 cursor-pointer"
            >
              {deleteLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CommentSection;