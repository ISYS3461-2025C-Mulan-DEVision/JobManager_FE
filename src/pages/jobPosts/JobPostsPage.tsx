import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { JobPost, JobStatus, EmploymentType } from "@/types";
import { JOB_STATUS, EMPLOYMENT_TYPES, ROUTES } from "@/utils/constants";
import { fetchJobPosts, archiveJobPost } from "@/services/jobPostService";
import { Button, Spinner } from "@/components/ui";
import { HeadlessTabs, TabItem } from "@/components/headless";
import { JobPostRow } from "@/components/feature/JobPosts";
import clsx from "clsx";

const JobPostsPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<JobPost[]>([]);
    const [activeTab, setActiveTab] = useState<JobStatus>(JOB_STATUS.PUBLISHED);
    const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<
        EmploymentType[]
    >([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Tabs configuration
    const tabs: TabItem[] = [
        {
            id: JOB_STATUS.PUBLISHED,
            label: "Published",
            count: jobPosts.filter((jp) => jp.status === JOB_STATUS.PUBLISHED)
                .length,
        },
        {
            id: JOB_STATUS.DRAFT,
            label: "Draft",
            count: jobPosts.filter((jp) => jp.status === JOB_STATUS.DRAFT)
                .length,
        },
        {
            id: JOB_STATUS.PRIVATE,
            label: "🔒 Private",
            count: jobPosts.filter((jp) => jp.status === JOB_STATUS.PRIVATE)
                .length,
        },
    ];

    // Fetch job posts
    useEffect(() => {
        loadJobPosts();
    }, []);

    // Filter posts when filters change
    useEffect(() => {
        filterJobPosts();
    }, [activeTab, selectedEmploymentTypes, searchQuery, jobPosts]);

    const loadJobPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchJobPosts({});
            setJobPosts(response.data);
        } catch (err) {
            setError("Failed to load job posts. Please try again.");
            console.error("Error fetching job posts:", err);
        } finally {
            setLoading(false);
        }
    };

    const filterJobPosts = () => {
        let filtered = jobPosts.filter((post) => post.status === activeTab);

        // Filter by employment type
        if (selectedEmploymentTypes.length > 0) {
            filtered = filtered.filter((post) =>
                post.employmentType
                    ? selectedEmploymentTypes.includes(post.employmentType)
                    : false
            );
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (post) =>
                    post.title.toLowerCase().includes(query) ||
                    post.description.toLowerCase().includes(query) ||
                    post.locationCity?.toLowerCase().includes(query)
            );
        }

        setFilteredPosts(filtered);
    };

    const handleCreateJobPost = () => {
        navigate(ROUTES.JOB_POST_CREATE);
    };

    const handleViewJobPost = (id: string) => {
        navigate(ROUTES.JOB_POST_DETAIL.replace(":id", id));
    };

    const handleEditJobPost = (id: string) => {
        navigate(ROUTES.JOB_POST_EDIT.replace(":id", id));
    };

    const handleArchiveJobPost = async (id: string) => {
        if (
            !window.confirm("Are you sure you want to archive this job post?")
        ) {
            return;
        }

        try {
            await archiveJobPost(id);
            await loadJobPosts();
        } catch (err) {
            alert("Failed to archive job post. Please try again.");
            console.error("Error archiving job post:", err);
        }
    };

    const toggleEmploymentTypeFilter = (type: EmploymentType) => {
        setSelectedEmploymentTypes((prev) =>
            prev.includes(type)
                ? prev.filter((t) => t !== type)
                : [...prev, type]
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Job Posts
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage and track your company's job postings
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleCreateJobPost}
                    >
                        + Create Job Post
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Filters & Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    {/* Search Bar */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by title, description, or department..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Employment Type Filter */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Employment Type
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {(
                                Object.values(
                                    EMPLOYMENT_TYPES
                                ) as EmploymentType[]
                            ).map((type) => (
                                <button
                                    key={type}
                                    onClick={() =>
                                        toggleEmploymentTypeFilter(type)
                                    }
                                    className={clsx(
                                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                        selectedEmploymentTypes.includes(type)
                                            ? "bg-blue-100 text-blue-700 border-2 border-blue-400"
                                            : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                                    )}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tabs */}
                    <HeadlessTabs
                        tabs={tabs}
                        defaultTab={activeTab}
                        onChange={(tabId) => setActiveTab(tabId as JobStatus)}
                    >
                        {(currentTab, setTab, tabItems) => (
                            <div className="border-b border-gray-200">
                                <nav
                                    className="flex space-x-8"
                                    aria-label="Tabs"
                                >
                                    {tabItems.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setTab(tab.id)}
                                            className={clsx(
                                                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                                                currentTab === tab.id
                                                    ? "border-blue-500 text-blue-600"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                            )}
                                        >
                                            {tab.label}
                                            {tab.count !== undefined && (
                                                <span
                                                    className={clsx(
                                                        "ml-2 py-0.5 px-2 rounded-full text-xs",
                                                        currentTab === tab.id
                                                            ? "bg-blue-100 text-blue-600"
                                                            : "bg-gray-100 text-gray-600"
                                                    )}
                                                >
                                                    {tab.count}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        )}
                    </HeadlessTabs>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Job Posts Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {searchQuery ||
                                selectedEmploymentTypes.length > 0
                                    ? "No job posts match your filters"
                                    : "No job posts found"}
                            </p>
                            {activeTab === JOB_STATUS.PUBLISHED && (
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={handleCreateJobPost}
                                    className="mt-4"
                                >
                                    Create Your First Job Post
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Job Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employment Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Salary
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Applications
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Expiry Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sync Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredPosts.map((jobPost) => (
                                        <JobPostRow
                                            key={jobPost.id}
                                            jobPost={jobPost}
                                            onView={handleViewJobPost}
                                            onEdit={handleEditJobPost}
                                            onArchive={handleArchiveJobPost}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Results Summary */}
                {filteredPosts.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredPosts.length} of {jobPosts.length} job
                        posts
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobPostsPage;
