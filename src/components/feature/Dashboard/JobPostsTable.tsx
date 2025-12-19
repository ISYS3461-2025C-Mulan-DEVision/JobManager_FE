import React from "react";
import { HeadlessTable } from "../../headless/Table/Table";
import { TableColumn } from "../../headless/Table/useTable";
import { Badge, BadgeVariant } from "../../ui/Badge/Badge";
import { Card } from "../../ui/Card/Card";
import { Skeleton } from "../../ui/Skeleton/Skeleton";
import { Tooltip } from "../../ui/Tooltip/Tooltip";

// Mock type for now, should be replaced with shared type
export interface JobPostSummary {
    id: string;
    title: string;
    status: "PUBLISHED" | "DRAFT" | "EXPIRED";
    employmentType: string;
    salary: string;
    applicationsCount: number;
    expiryDate: string;
    lastUpdated: string;
    propagationStatus?: "SYNCED" | "PENDING" | "FAILED";
}

interface JobPostsTableProps {
    data: JobPostSummary[];
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onArchive: (id: string) => void;
    isLoading?: boolean;
}

export const JobPostsTable: React.FC<JobPostsTableProps> = ({
    data,
    onView,
    onEdit,
    onArchive,
    isLoading = false,
}) => {
    const columns: TableColumn<JobPostSummary>[] = [
        {
            key: "title",
            header: "Job Title",
            render: (item) => (
                <div>
                    <div className="font-medium text-gray-900">
                        {item.title}
                    </div>
                    <div className="text-xs text-gray-500">
                        Updated{" "}
                        {new Date(item.lastUpdated).toLocaleDateString()}
                    </div>
                </div>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (item) => {
                let variant: BadgeVariant = "neutral";
                if (item.status === "PUBLISHED") variant = "success";
                if (item.status === "EXPIRED") variant = "error";
                if (item.status === "DRAFT") variant = "warning";

                return (
                    <div className="flex flex-col gap-1">
                        <Badge variant={variant}>{item.status}</Badge>
                        {item.propagationStatus &&
                            item.propagationStatus !== "SYNCED" && (
                                <span className="text-[10px] text-gray-400">
                                    {item.propagationStatus === "PENDING"
                                        ? "Syncing..."
                                        : "Sync Failed"}
                                </span>
                            )}
                    </div>
                );
            },
        },
        {
            key: "employmentType",
            header: "Type",
            render: (item) => (
                <Tooltip content="Employment contract type">
                    <span className="cursor-help border-b border-dotted border-gray-400">
                        {item.employmentType}
                    </span>
                </Tooltip>
            ),
        },
        {
            key: "salary",
            header: "Salary",
            render: (item) => (
                <Tooltip content="Estimated annual or hourly range">
                    <span className="cursor-help border-b border-dotted border-gray-400">
                        {item.salary}
                    </span>
                </Tooltip>
            ),
        },
        {
            key: "applicationsCount",
            header: "Applications",
            render: (item) => (
                <div className="text-center font-semibold text-gray-700">
                    {item.applicationsCount}
                </div>
            ),
        },
        {
            key: "expiryDate",
            header: "Expires",
            render: (item) => new Date(item.expiryDate).toLocaleDateString(),
        },
        {
            key: "id", // Using ID for actions column
            header: "Actions",
            render: (item) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => onView(item.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        View
                    </button>
                    <button
                        onClick={() => onEdit(item.id)}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onArchive(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        Archive
                    </button>
                </div>
            ),
        },
    ];

    if (isLoading) {
        return (
            <Card padding="none" className="overflow-hidden">
                <div className="p-6 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex space-x-4">
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card className="text-center py-12">
                <p className="text-gray-500 mb-4">No job posts found.</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Create your first job post
                </button>
            </Card>
        );
    }

    return (
        <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
                <HeadlessTable
                    data={data}
                    columns={columns}
                    className="min-w-full divide-y divide-gray-200"
                    renderHeader={(cols) => (
                        <thead className="bg-gray-50">
                            <tr>
                                {cols.map((col) => (
                                    <th
                                        key={String(col.key)}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    )}
                    renderRow={(item, cols) => (
                        <tr
                            key={item.id}
                            className="bg-white hover:bg-gray-50 transition-colors"
                        >
                            {cols.map((col) => (
                                <td
                                    key={`${item.id}-${String(col.key)}`}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                >
                                    {col.render
                                        ? col.render(item)
                                        : (item as any)[col.key]}
                                </td>
                            ))}
                        </tr>
                    )}
                />
            </div>
        </Card>
    );
};
