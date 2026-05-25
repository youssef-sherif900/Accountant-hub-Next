import { Suspense } from "react";
import JobsPageContent from "./JobsPageContent";

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="container">Loading jobs…</div>}>
      <JobsPageContent />
    </Suspense>
  );
}
