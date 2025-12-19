import React, { useState } from "react";
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

const Dashboard: React.FC = () => {
    // Mock Data
    const [premiumStatus] = useState<
        "FREE" | "PREMIUM" | "EXPIRING" | "EXPIRED"
    >("EXPIRING");

    const kpis = {
        activeJobs: 12,
        totalApplications: 145,
        newApplications: 8,
        unreadNotifications: 3,
    };

    const jobPosts: JobPostSummary[] = [
        {
            id: "1",
            title: "Senior Frontend Engineer",
            status: "PUBLISHED",
            employmentType: "Full-time",
            salary: "$120k - $150k",
            applicationsCount: 45,
            expiryDate: "2025-01-15",
            lastUpdated: "2024-12-15",
            propagationStatus: "SYNCED",
        },
        {
            id: "2",
            title: "Backend Developer (Java)",
            status: "PUBLISHED",
            employmentType: "Contract",
            salary: "$80/hr",
            applicationsCount: 12,
            expiryDate: "2025-01-20",
            lastUpdated: "2024-12-16",
            propagationStatus: "SYNCED",
        },
        {
            id: "3",
            title: "Product Designer",
            status: "DRAFT",
            employmentType: "Full-time",
            salary: "Negotiable",
            applicationsCount: 0,
            expiryDate: "2025-02-01",
            lastUpdated: "2024-12-17",
            propagationStatus: "PENDING",
        },
    ];

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
                <Button onClick={() => console.log("Create Job")}>
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
                    trend="up"
                    trendValue="2"
                    onClick={() => console.log("View Jobs")}
                />
                <KPICard
                    title="Total Applications"
                    value={kpis.totalApplications}
                    subValue="candidates"
                    trend="up"
                    trendValue="12%"
                    onClick={() => console.log("View Applications")}
                />
                <KPICard
                    title="New Applications"
                    value={kpis.newApplications}
                    subValue="last 24h"
                    trend="neutral"
                    trendValue="0%"
                    active={true} // Highlight this as it's actionable
                    onClick={() => console.log("View New")}
                />
                <KPICard
                    title="Unread Notifications"
                    value={kpis.unreadNotifications}
                    trend="down" // Good thing if it goes down? Or maybe just neutral.
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
                            <button className="text-sm text-blue-600 hover:text-blue-800">
                                View All Jobs
                            </button>
                        </div>
                        <JobPostsTable
                            data={jobPosts}
                            onView={(id) => console.log("View", id)}
                            onEdit={(id) => console.log("Edit", id)}
                            onArchive={(id) => console.log("Archive", id)}
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
