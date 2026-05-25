"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { AxiosError } from "axios";

interface BidModalProps {
  jobId: number;
  jobTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function BidModal({ jobId, jobTitle, onClose, onSuccess }: BidModalProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    proposed_price: "",
    estimated_delivery_time: "",
    cover_letter: "",
    relevant_experience: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await api.post(`/jobs/${jobId}/bids`, {
        proposed_price: Number(form.proposed_price),
        estimated_delivery_time: form.estimated_delivery_time,
        cover_letter: form.cover_letter,
        relevant_experience: form.relevant_experience,
      });
      toast.success("Your bid has been submitted successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      const axiosErr = err as AxiosError<{
        message?: string;
        errors?: Record<string, string[]>;
      }>;
      const data = axiosErr.response?.data;
      if (data?.errors) {
        const mapped: Record<string, string> = {};
        Object.entries(data.errors).forEach(([k, v]) => {
          mapped[k] = v[0];
        });
        setErrors(mapped);
      } else {
        toast.error(data?.message ?? "Failed to submit bid.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Submit bid</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <p className="subtitle">{jobTitle}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="price">Proposed price ($)</label>
            <input
              id="price"
              type="number"
              min={1}
              max={999999}
              required
              value={form.proposed_price}
              onChange={(e) =>
                setForm((f) => ({ ...f, proposed_price: e.target.value }))
              }
            />
            {errors.proposed_price && (
              <span className="form-error">{errors.proposed_price}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="delivery">Estimated delivery time</label>
            <input
              id="delivery"
              type="text"
              placeholder="e.g. 5 days"
              required
              value={form.estimated_delivery_time}
              onChange={(e) =>
                setForm((f) => ({ ...f, estimated_delivery_time: e.target.value }))
              }
            />
            {errors.estimated_delivery_time && (
              <span className="form-error">{errors.estimated_delivery_time}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="cover">Cover letter (min 50 chars)</label>
            <textarea
              id="cover"
              rows={4}
              required
              minLength={50}
              maxLength={2000}
              value={form.cover_letter}
              onChange={(e) =>
                setForm((f) => ({ ...f, cover_letter: e.target.value }))
              }
            />
            {errors.cover_letter && (
              <span className="form-error">{errors.cover_letter}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="experience">Relevant experience (min 30 chars)</label>
            <textarea
              id="experience"
              rows={3}
              required
              minLength={30}
              maxLength={1500}
              value={form.relevant_experience}
              onChange={(e) =>
                setForm((f) => ({ ...f, relevant_experience: e.target.value }))
              }
            />
            {errors.relevant_experience && (
              <span className="form-error">{errors.relevant_experience}</span>
            )}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting…" : "Submit bid"}
          </button>
        </form>
      </div>
      <style jsx>{`
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-md);
          position: sticky;
          top: 0;
          background: var(--color-white);
          padding-bottom: var(--space-sm);
          margin-bottom: var(--space-sm);
          z-index: 1;
        }
        .modal-header h2 {
          margin: 0;
          font-size: 1.2rem;
        }
        .subtitle {
          color: var(--color-gray-500);
          margin: 0 0 var(--space-md);
          font-size: 0.9rem;
          line-height: 1.4;
        }
        .icon-btn {
          background: var(--color-gray-100);
          border: none;
          cursor: pointer;
          padding: var(--space-sm);
          border-radius: var(--radius-md);
          min-width: var(--touch-min, 44px);
          min-height: var(--touch-min, 44px);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        form :global(.btn-primary) {
          width: 100%;
          margin-top: var(--space-sm);
        }
      `}</style>
    </div>
  );
}
