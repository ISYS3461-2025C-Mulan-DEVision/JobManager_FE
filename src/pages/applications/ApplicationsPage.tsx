import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApplicationsView } from "@/components/feature/Applications";
import { Application } from "@/types/application";
import { ROUTES } from "@/utils/constants";
import DashboardLayout from "@/layout/DashboardLayout";
import { Button } from "@/components/ui/Button/Button";
import { ArrowLeft } from "lucide-react";

// TODO: Replace with actual API call
const MOCK_APPLICATIONS: Application[] = [
    {
        id: "app-1",
        applicantId: "applicant-1",
        applicantName: "Alice Johnson",
        applicantEmail: "alice.johnson@email.com",
        applicantPhone: "+1 (555) 123-4567",
        jobPostId: "job-1",
        jobTitle: "Senior Frontend Developer",
        status: "PENDING",
        submittedAt: "2025-12-30T10:30:00Z",
        cvUrl: "https://example.com/cv/alice-johnson.pdf",
        coverLetter: "I am excited to apply for this position...",
        sourceSubsystem: "job-applicant",
        createdAt: "2025-12-30T10:30:00Z",
        updatedAt: "2025-12-30T10:30:00Z",
    },
    {
        id: "app-2",
        applicantId: "applicant-2",
        applicantName: "Bob Smith",
        applicantEmail: "bob.smith@email.com",
        applicantPhone: "+1 (555) 234-5678",
        jobPostId: "job-1",
        jobTitle: "Senior Frontend Developer",
        status: "REVIEWING",
        submittedAt: "2025-12-29T14:20:00Z",
        cvUrl: "https://example.com/cv/bob-smith.pdf",
        coverLetter: "With 8 years of experience in React...",
        sourceSubsystem: "job-applicant",
        createdAt: "2025-12-29T14:20:00Z",
        updatedAt: "2025-12-29T16:00:00Z",
    },
    {
        id: "app-3",
        applicantId: "applicant-3",
        applicantName: "Carol Williams",
        applicantEmail: "carol.williams@email.com",
        jobPostId: "job-1",
        jobTitle: "Senior Frontend Developer",
        status: "INTERVIEWING",
        submittedAt: "2025-12-28T09:15:00Z",
        cvUrl: "https://example.com/cv/carol-williams.pdf",
        sourceSubsystem: "job-applicant",
        createdAt: "2025-12-28T09:15:00Z",
        updatedAt: "2025-12-29T11:30:00Z",
    },
    {
        id: "app-4",
        applicantId: "applicant-4",
        applicantName: "David Kim",
        applicantEmail: "david.kim@email.com",
        applicantPhone: "+1 (555) 456-7890",
        jobPostId: "job-1",
        jobTitle: "Senior Frontend Developer",
        status: "ARCHIVED",
        submittedAt: "2025-12-25T16:45:00Z",
        cvUrl: "https://example.com/cv/david-kim.pdf",
        coverLetter: "I would love to join your team...",
        sourceSubsystem: "job-applicant",
        createdAt: "2025-12-25T16:45:00Z",
        updatedAt: "2025-12-27T10:00:00Z",
    },
    {
        id: "app-5",
        applicantId: "applicant-5",
        applicantName: "Emily Chen",
        applicantEmail: "emily.chen@email.com",
        jobPostId: "job-1",
        jobTitle: "Senior Frontend Developer",
        status: "PENDING",
        submittedAt: "2025-12-30T08:00:00Z",
        cvUrl: "https://example.com/cv/emily-chen.pdf",
        sourceSubsystem: "job-applicant",
        createdAt: "2025-12-30T08:00:00Z",
        updatedAt: "2025-12-30T08:00:00Z",
    },
];

const ApplicationsPage: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { jobPostId } = useParams<{ jobPostId: string }>(); // Will be used for API calls
    const navigate = useNavigate();

    // TODO: Fetch applications from API based on jobPostId
    const applications = MOCK_APPLICATIONS;
    const isLoading = false;
    const error = null;

    const handleViewApplication = (applicationId: string) => {
        navigate(
            ROUTES.APPLICATION_DETAILS.replace(":jobPostId", jobPostId || "").replace(
                ":applicationId",
                applicationId
            )
        );
    };

    const handleArchiveApplication = (applicationId: string) => {
        console.log("Archive application:", applicationId);
        // TODO: Call API to archive application
    };

    const handleRestoreApplication = (applicationId: string) => {
        console.log("Restore application:", applicationId);
        // TODO: Call API to restore application
    };

    const handleDownloadCV = (applicationId: string) => {
        console.log("Download CV for application:", applicationId);
        // TODO: Trigger CV download
        const application = applications.find(
            (app) => app.id === applicationId
        );
        if (application?.cvUrl) {
            window.open(application.cvUrl, "_blank");
        }
    };

    const handleViewCoverLetter = (applicationId: string) => {
        console.log("View cover letter for application:", applicationId);
        // TODO: Open modal with cover letter content
        const application = applications.find(
            (app) => app.id === applicationId
        );
        if (application?.coverLetter) {
            alert(`Cover Letter:\n\n${application.coverLetter}`);
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    onClick={() => navigate(ROUTES.JOB_POSTS)}
                >
                    Back to Job Posts
                </Button>
            </div>

            <ApplicationsView
                applications={applications}
                isLoading={isLoading}
                error={error}
                onViewApplication={handleViewApplication}
                onArchiveApplication={handleArchiveApplication}
                onRestoreApplication={handleRestoreApplication}
                onDownloadCV={handleDownloadCV}
                onViewCoverLetter={handleViewCoverLetter}
            />
        </DashboardLayout>
    );
};

export default ApplicationsPage;
