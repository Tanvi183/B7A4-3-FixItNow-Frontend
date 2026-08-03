"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiStar, FiCheckCircle, FiInfo } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { getCookie } from "@/stores/useAuthStore";
import Link from "next/link";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating between 1 and 5 stars").max(5),
  comment: z.string().min(10, "Please write a review of at least 10 characters").max(500, "Review is too long"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

function ReviewFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const technicianId = searchParams.get("technicianId");
  const bookingId = searchParams.get("bookingId");
  const technicianName = searchParams.get("technicianName") || "the technician";

  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const currentRating = watch("rating");

  useEffect(() => {
    if (!technicianId) {
      toast.error("Technician ID is missing. Cannot leave a review.");
    }
  }, [technicianId]);

  const onSubmit = async (data: ReviewFormValues) => {
    if (!technicianId) {
      toast.error("Missing technician information.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          technicianId,
          bookingId, // Optional, depending on backend
          rating: data.rating,
          comment: data.comment,
        }),
      });

      const result = await res.json();
      
      if (result.success) {
        toast.success("Review submitted successfully!");
        setIsSuccess(true);
      } else {
        toast.error(result.message || "Failed to submit review");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-stroke bg-white p-8 text-center shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
          <FiCheckCircle className="h-10 w-10" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-black dark:text-white">Thank You for Your Feedback!</h2>
        <p className="mt-2 text-body dark:text-bodydark2 max-w-md">
          Your review for {technicianName} has been published successfully. This helps other customers make informed decisions.
        </p>
        <Link
          href="/dashboard/customer"
          className="mt-8 rounded-xl bg-primary px-8 py-3 font-medium text-white shadow-sm hover:bg-opacity-90 transition-all active:scale-95"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Leave a Review
        </h2>
        <p className="mt-1 text-sm text-body dark:text-bodydark2">
          Share your experience with {technicianName} to help the community.
        </p>
      </div>

      {!technicianId && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
          <FiInfo className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">
            Warning: No technician is selected. You must access this page from a completed booking.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Rating Selection */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Overall Rating <span className="text-meta-1">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= (hoveredStar ?? currentRating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue("rating", star, { shouldValidate: true })}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    className="group relative transition-transform hover:scale-110 focus:outline-none"
                  >
                    <FiStar
                      className={`h-10 w-10 transition-colors duration-200 ${
                        isActive 
                          ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" 
                          : "fill-transparent text-gray-300 dark:text-strokedark"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                {currentRating > 0 ? `${currentRating} out of 5 stars` : "Select a rating"}
              </span>
            </div>
            {errors.rating && (
              <p className="mt-2 text-sm text-meta-1">{errors.rating.message}</p>
            )}
          </div>

          {/* Comment Textarea */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Your Review <span className="text-meta-1">*</span>
            </label>
            <textarea
              {...register("comment")}
              rows={5}
              placeholder={`How was the service provided by ${technicianName}? What went well?`}
              className={`w-full rounded-xl border bg-transparent px-5 py-4 text-sm outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input ${
                errors.comment ? "border-meta-1 focus:border-meta-1" : "border-stroke dark:border-form-strokedark"
              }`}
            ></textarea>
            <div className="mt-2 flex justify-between">
              <p className="text-sm text-meta-1">{errors.comment?.message}</p>
              <p className="text-xs text-body dark:text-bodydark2">
                {watch("comment")?.length || 0}/500
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !technicianId}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary p-4 font-medium text-white shadow-sm transition hover:bg-opacity-90 disabled:opacity-50 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NewReviewPage() {
  return (
    <React.Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    }>
      <ReviewFormContent />
    </React.Suspense>
  );
}
