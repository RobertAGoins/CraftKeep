"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

interface DeleteButtonProps {
  id: string;
  endpoint: string;
  redirectUrl: string;
  itemName?: string;
}

export default function DeleteButton({ id, endpoint, redirectUrl, itemName = "item" }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push(redirectUrl);
        router.refresh();
      } else {
        alert("Failed to delete.");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm transition-colors flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title={`Delete ${itemName}`}
        message={`Are you sure you want to delete this ${itemName}? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
}