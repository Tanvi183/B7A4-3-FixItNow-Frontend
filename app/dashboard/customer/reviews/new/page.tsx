"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, Loader2, Info } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating.").max(5),
  comment: z.string().min(10, "Review comment must be at least 10 characters long."),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function NewReviewPage() {
  const router = useRouter();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const selectedRating = watch("rating");

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Review submitted:", data);
      toast.success("Thank you! Your review has been submitted.");
      router.push("/dashboard/customer");
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 font-heading">Rate Your Experience</h1>
        <p className="text-slate-500 mt-2">Your feedback helps us improve our services and helps other customers.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Booking Info Mock */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-4 items-start">
            <Info className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-semibold text-slate-900">AC Repair & Servicing</p>
              <p className="text-sm text-slate-600">Completed by Michael Chen on March 15, 2024</p>
            </div>
          </div>

          {/* Star Rating Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 text-center">Overall Rating</label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue("rating", star, { shouldValidate: true })}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    size={36} 
                    className={`transition-colors duration-200 ${
                      (hoveredRating || selectedRating) >= star 
                        ? "fill-amber-400 text-amber-400" 
                        : "fill-slate-100 text-slate-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && <p className="text-rose-500 text-sm text-center font-medium mt-2">{errors.rating.message}</p>}
          </div>

          {/* Comment Textarea */}
          <div className="space-y-3">
            <label htmlFor="comment" className="block text-sm font-medium text-slate-700">
              Share your thoughts
            </label>
            <textarea
              id="comment"
              {...register("comment")}
              rows={5}
              placeholder="What did you like about the service? How was the technician?"
              className={`w-full p-4 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none ${
                errors.comment ? "border-rose-300 bg-rose-50/30" : "border-slate-200"
              }`}
            />
            {errors.comment && <p className="text-rose-500 text-sm font-medium">{errors.comment.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-blue-700 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
