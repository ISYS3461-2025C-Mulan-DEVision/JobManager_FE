import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { KPICard } from "../components/feature/Dashboard/KPICard";
import {
    JobPostsTable,
    JobPostSummary,
} from "../components/feature/Dashboard/JobPostsTable";
import {
    RecentApplications,
    ApplicationSummary,
} from "../components/feature/Dashboard/RecentApplications";
import { PremiumBanner } from "../components/feature/Dashboard/PremiumBanner";
import {
    NotificationsCard,
    Notification,
} from "../components/feature/Dashboard/NotificationsCard";
import { Button } from "../components/ui/Button/Button";
import DashboardLayout from "../layout/DashboardLayout";
import { fetchJobPosts } from "@/services/jobPostService";
import { JobPost } from "@/types";
import { formatSalary } from "@/utils/jobPostHelpers";
import { EMPLOYMENT_TYPE_LABELS, ROUTES } from "@/utils/constants";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    // Mock Data
    const [premiumStatus] = useState<
        "FREE" | "PREMIUM" | "EXPIRING" | "EXPIRED"
    >("EXPIRING");

    // State for real job posts
    const [jobPosts, setJobPosts] = useState<JobPostSummary[]>([]);
    const [allJobPosts, setAllJobPosts] = useState<JobPost[]>([]);
    const [isLoadingJobs, setIsLoadingJobs] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load job posts on mount
    useEffect(() => {
        loadJobPosts();
    }, []);

    const loadJobPosts = async () => {
        try {
            setIsLoadingJobs(true);
            setError(null);
            
            // Fetch more data for trend calculation
            const response = await fetchJobPosts({ page: 0, pageSize: 100 });
            setAllJobPosts(response.data);
            
            // Get top 5 for display
            const displayPosts = response.data.slice(0, 5);
            
            // Transform JobPost to JobPostSummary
            const summaries: JobPostSummary[] = displayPosts.map((job: JobPost) => {
                // Map JobStatus to JobPostSummary status
                let status: "PUBLISHED" | "DRAFT" | "EXPIRED" = "DRAFT";
                if (job.status === "PUBLISHED" || job.status === "PRIVATE") {
                    status = "PUBLISHED";
                } else if (job.status === "DRAFT") {
                    status = "DRAFT";
                } else if (job.status === "CLOSED" || job.status === "ARCHIVED") {
                    status = "EXPIRED";
                }
                
                // Map SyncStatus to propagationStatus
                let propagationStatus: "SYNCED" | "PENDING" | "FAILED" | undefined = undefined;
                if (job.syncStatus === "SYNCED") {
                    propagationStatus = "SYNCED";
                } else if (job.syncStatus === "PENDING" || job.syncStatus === "UPDATING") {
                    propagationStatus = "PENDING";
                } else if (job.syncStatus === "FAILED") {
                    propagationStatus = "FAILED";
                }
                
                return {
                    id: job.id,
                    title: job.title,
                    status: status,
                    employmentType: job.employmentType 
                        ? EMPLOYMENT_TYPE_LABELS[job.employmentType] 
                        : "Not specified",
                    salary: formatSalary(
                        job.salaryMin,
                        job.salaryMax,
                        job.salaryType,
                        job.salaryNote
                    ),
                    applicationsCount: job.applicationsCount || 0,
                    expiryDate: job.expiryAt,
                    lastUpdated: job.updatedAt,
                    propagationStatus: propagationStatus,
                };
            });
            
            setJobPosts(summaries);
        } catch (err) {
            console.error("Error fetching job posts:", err);
            setError("Failed to load job posts");
            setJobPosts([]);
        } finally {
            setIsLoadingJobs(false);
        }
    };

    // Calculate trends based on historical data
    const calculateTrends = () => {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // Current period (last 30 days)
        const currentPeriodJobs = allJobPosts.filter(
            (job) => new Date(job.createdAt) >= thirtyDaysAgo
        );
        
        // Previous period (30-60 days ago)
        const previousPeriodJobs = allJobPosts.filter(
            (job) => {
                const createdDate = new Date(job.createdAt);
                return createdDate >= sixtyDaysAgo && createdDate < thirtyDaysAgo;
            }
        );

        // Active jobs trend
        const currentActiveJobs = allJobPosts.filter(
            (job) => job.status === "PUBLISHED"
        ).length;
        const previousActiveJobs = allJobPosts.filter(
            (job) => job.status === "PUBLISHED" && new Date(job.createdAt) < thirtyDaysAgo
        ).length;
        
        const activeJobsDiff = currentActiveJobs - previousActiveJobs;
        const activeJobsTrend = activeJobsDiff > 0 ? "up" : activeJobsDiff < 0 ? "down" : "neutral";

        // Applications trend (sum of all applications)
        const currentApplications = currentPeriodJobs.reduce(
            (sum, job) => sum + (job.applicationsCount || 0),
            0
        );
        const previousApplications = previousPeriodJobs.reduce(
            (sum, job) => sum + (job.applicationsCount || 0),
            0
        );
        
        const applicationsDiff = currentApplications - previousApplications;
        const applicationsPercent = previousApplications > 0 
            ? Math.round((applicationsDiff / previousApplications) * 100)
            : 0;
        const applicationsTrend = applicationsDiff > 0 ? "up" : applicationsDiff < 0 ? "down" : "neutral";

        return {
            activeJobs: {
                trend: activeJobsTrend as "up" | "down" | "neutral",
                value: Math.abs(activeJobsDiff).toString(),
            },
            applications: {
                trend: applicationsTrend as "up" | "down" | "neutral",
                value: `${Math.abs(applicationsPercent)}%`,
            },
        };
    };

    const trends = calculateTrends();

    // Calculate KPIs from real data
    const kpis = {
        activeJobs: allJobPosts.filter(jp => jp.status === "PUBLISHED").length,
        totalApplications: allJobPosts.reduce((sum, jp) => sum + (jp.applicationsCount || 0), 0),
        newApplications: 0, // TODO: Calculate from recent applications
        unreadNotifications: 3, // TODO: Fetch from notifications API
    };

    const applications: ApplicationSummary[] = [
        {
            id: "101",
            applicantName: "Sarah Chen",
            jobTitle: "Senior Frontend Engineer",
            status: "PENDING",
            appliedAt: "2024-12-17T09:00:00Z",
        },
        {
            id: "102",
            applicantName: "Michael Ross",
            jobTitle: "Backend Developer",
            status: "REVIEWING",
            appliedAt: "2024-12-16T14:30:00Z",
        },
        {
            id: "103",
            applicantName: "Jessica Wu",
            jobTitle: "Senior Frontend Engineer",
            status: "PENDING",
            appliedAt: "2024-12-16T11:15:00Z",
        },
        {
            id: "104",
            applicantName: "David Miller",
            jobTitle: "Product Designer",
            status: "ARCHIVED",
            appliedAt: "2024-12-15T16:45:00Z",
        },
    ];

    const notifications: Notification[] = [
        {
            id: "n1",
            title: "New Premium Applicant",
            message:
                "A highly qualified candidate applied for Senior Frontend Engineer.",
            type: "SUCCESS",
            isRead: false,
            createdAt: "2024-12-17T10:00:00Z",
        },
        {
            id: "n2",
            title: "Subscription Expiring",
            message: "Your premium subscription expires in 5 days.",
            type: "WARNING",
            isRead: false,
            createdAt: "2024-12-16T09:00:00Z",
        },
        {
            id: "n3",
            title: "Job Post Expired",
            message: "Your job post 'Marketing Manager' has expired.",
            type: "INFO",
            isRead: true,
            createdAt: "2024-12-15T09:00:00Z",
        },
    ];

    return (
        <DashboardLayout>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Dashboard
                    </h1>
                    <p className="text-gray-500">
                        Overview of your hiring pipeline
                    </p>
                </div>
                <Button onClick={() => navigate(ROUTES.JOB_POST_CREATE)}>
                    + Create Job Post
                </Button>
            </div>

            {/* Premium Banner */}
            <PremiumBanner
                status={premiumStatus}
                daysRemaining={5}
                onUpgrade={() => console.log("Upgrade")}
            />

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Active Jobs"
                    value={kpis.activeJobs}
                    subValue="posts"
                    trend={trends.activeJobs.trend}
                    trendValue={trends.activeJobs.value}
                    onClick={() => navigate(ROUTES.JOB_POSTS)}
                    isLoading={isLoadingJobs}
                />
                <KPICard
                    title="Total Applications"
                    value={kpis.totalApplications}
                    subValue="candidates"
                    trend={trends.applications.trend}
                    trendValue={trends.applications.value}
                    onClick={() => console.log("View Applications")}
                    isLoading={isLoadingJobs}
                />
                <KPICard
                    title="New Applications"
                    value={kpis.newApplications}
                    subValue="last 24h"
                    active={true} // Highlight this as it's actionable
                    onClick={() => console.log("View New")}
                    isLoading={isLoadingJobs}
                />
                <KPICard
                    title="Unread Notifications"
                    value={kpis.unreadNotifications}
                    onClick={() => console.log("View Notifications")}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Job Posts (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Job Posts Overview
                            </h2>
                            <button 
                                onClick={() => navigate(ROUTES.JOB_POSTS)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                View All Jobs
                            </button>
                        </div>
                        {error && (
                            <div className="text-red-600 text-sm mb-4">
                                {error}
                            </div>
                        )}
                        <JobPostsTable
                            data={jobPosts}
                            onView={(id) => navigate(`/job-posts/${id}`)}
                            onEdit={(id) => navigate(`/job-posts/${id}/edit`)}
                            onArchive={(id) => console.log("Archive", id)}
                            isLoading={isLoadingJobs}
                        />
                    </section>
                </div>

                {/* Right Column: Applications & Notifications (1/3 width) */}
                <div className="space-y-6">
                    <RecentApplications
                        applications={applications}
                        onViewCV={(id) => console.log("View CV", id)}
                        onArchive={(id) => console.log("Archive App", id)}
                    />

                    <NotificationsCard
                        notifications={notifications}
                        onMarkAsRead={(id) => console.log("Read", id)}
                        onViewAll={() => console.log("All Notifications")}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
