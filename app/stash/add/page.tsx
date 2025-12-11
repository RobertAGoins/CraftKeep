"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AddStashItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/stash", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/stash");
        router.refresh();
      } else {
        console.error("Failed to create item");
        alert("Failed to create item. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  }

  return (
    <div className="min-h-screen bg-purple-50 p-8 dark:bg-black font-sans flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 dark:bg-purple-900">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-purple-950 dark:text-purple-50">Add to Stash</h1>
             <Link
                href="/stash"
                className="text-sm text-purple-500 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-200"
            >
                Cancel
            </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
              Item Image (Optional)
            </label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 dark:hover:bg-purple-800 dark:bg-purple-800 hover:bg-purple-100 dark:border-purple-600 dark:hover:border-purple-500">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <Image 
                      src={imagePreview} 
                      alt="Preview" 
                      fill 
                      className="object-contain p-2" 
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-purple-500 dark:text-purple-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-purple-500 dark:text-purple-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-purple-500 dark:text-purple-400">SVG, PNG, JPG or GIF</p>
                  </div>
                )}
                <input 
                    id="image-upload" 
                    name="image" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-purple-800 dark:text-purple-300">
              Item Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full rounded-md border border-purple-300 px-3 py-2 shadow-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 dark:border-purple-700 dark:bg-purple-800 dark:text-white"
              placeholder="e.g., Red Heart Yarn"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-purple-800 dark:text-purple-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="mt-1 block w-full rounded-md border border-purple-300 px-3 py-2 shadow-sm focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 dark:border-purple-700 dark:bg-purple-800 dark:text-white"
              placeholder="Quantity, color, weight, etc."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-purple-500 px-4 py-2 text-white font-medium hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
