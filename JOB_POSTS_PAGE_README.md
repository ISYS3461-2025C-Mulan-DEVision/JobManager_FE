# Job Posts Listing Page - Implementation Documentation

## Overview

A comprehensive job posts listing page built with modular, headless UI components following best practices for React and TypeScript.

## Features Implemented

### 📋 Core Features

1. **Job Posts Listing**
    - Display all job posts in a clean, scannable table format
    - Show key information: Title, Status, Employment Type, Salary, Applications Count, Expiry Date, Sync Status
    - Actions: View, Edit, Archive

2. **Filtering & Tabs**
    - Tab-based filtering: Published, Draft, Private
    - Employment type filter (multi-select)
    - Real-time search by title, description, or department
    - Filter counts on tabs

3. **Kafka Sync Indicator**
    - Visual indicator for data synchronization status
    - States: Synced ✓, Updating ⟳, Pending ⏱, Failed ⚠

4. **Smart Date Display**
    - Expiry date with urgency awareness
    - Highlights expiring jobs (≤3 days)
    - Human-readable date formatting

## Architecture

### 📁 File Structure

```
src/
├── components/
│   ├── headless/
│   │   └── Tabs/           # Headless tabs component
│   │       ├── HeadlessTabs.tsx
│   │       ├── useTabs.ts
│   │       └── index.ts
│   ├── feature/
│   │   └── JobPosts/       # Job post specific components
│   │       ├── JobStatusBadge.tsx
│   │       ├── EmploymentTypeChip.tsx
│   │       ├── SalaryBadge.tsx
│   │       ├── KafkaSyncIndicator.tsx
│   │       ├── JobPostRow.tsx
│   │       └── index.ts
│   └── ui/
│       └── Badge/          # Base UI components
├── pages/
│   └── jobPosts/
│       ├── JobPostsPage.tsx
│       └── index.ts
├── routes/
│   ├── jobRoutes.tsx       # Separate job routes file
│   └── index.ts
├── services/
│   └── jobPostService.ts   # API service layer
├── types/
│   ├── jobPost.ts          # Job post types
│   └── index.ts
└── utils/
    ├── constants.ts        # Constants (updated)
    └── backendAPIs.ts      # API endpoints
```

### 🎨 Component Modularity

#### Headless Components

- **HeadlessTabs**: Logic-only tab component with render props pattern
- **useTabs**: Reusable hook for tab state management

#### Feature Components

- **JobStatusBadge**: Status visualization (Published, Draft, Private, etc.)
- **EmploymentTypeChip**: Employment type labels
- **SalaryBadge**: Smart salary formatting (Range, Fixed, Hourly, etc.)
- **KafkaSyncIndicator**: Real-time sync status indicator
- **JobPostRow**: Complete job post table row with all fields

#### Page Component

- **JobPostsPage**: Main orchestration component with state management

### 🔌 Backend Integration

#### API Endpoints (`backendAPIs.ts`)

```typescript
JOB_POSTS: {
    LIST: "/job-posts",
    CREATE: "/job-posts",
    GET: (id) => `/job-posts/${id}`,
    UPDATE: (id) => `/job-posts/${id}`,
    DELETE: (id) => `/job-posts/${id}`,
    PUBLISH: (id) => `/job-posts/${id}/publish`,
    ARCHIVE: (id) => `/job-posts/${id}/archive`,
    STATS: (id) => `/job-posts/${id}/stats`,
}
```

#### Service Layer (`jobPostService.ts`)

- `fetchJobPosts(filters)` - Get paginated job posts with filters
- `fetchJobPostById(id)` - Get single job post
- `createJobPost(data)` - Create new job post
- `updateJobPost(id, data)` - Update existing job post
- `deleteJobPost(id)` - Delete job post
- `publishJobPost(id)` - Publish a draft
- `archiveJobPost(id)` - Archive a job post
- `fetchJobPostStats(id)` - Get statistics

### 📊 Type System

#### Job Post Types

```typescript
interface JobPost {
    id: string;
    title: string;
    description: string;
    status: JobStatus;
    employmentType: EmploymentType;
    salaryFormat: SalaryFormat;
    salaryMin?: number;
    salaryMax?: number;
    salaryFixed?: number;
    currency: string;
    applicationsCount: number;
    expiryDate: string;
    syncStatus?: SyncStatus;
    // ... more fields
}
```

#### Constants

```typescript
// Job Status
JOB_STATUS = { DRAFT, PUBLISHED, CLOSED, ARCHIVED, PRIVATE };

// Employment Types
EMPLOYMENT_TYPES = { FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE };

// Salary Types (matching backend SalaryType enum)
SALARY_TYPES = { RANGE, ABOUT, UP_TO, FROM, NEGOTIABLE };

// Sync Status
SYNC_STATUS = { SYNCED, PENDING, UPDATING, FAILED };
```

### 🛣️ Routing

#### Separate Job Routes File

```typescript
// routes/jobRoutes.tsx
export const jobRoutes = [
    <Route path={ROUTES.JOB_POSTS} element={<JobPostsPage />} />,
    // Future routes:
    // - JOB_POST_CREATE
    // - JOB_POST_EDIT
    // - JOB_POST_DETAIL
];
```

Routes are organized separately and imported into `App.tsx` for clean separation of concerns.

## Usage

### Accessing the Page

Navigate to: `/job-posts`

### Key Interactions

1. **View Job Posts**: See all published, draft, or private job posts
2. **Filter**: Use tabs and employment type filters
3. **Search**: Type to search across title, description, department
4. **Actions**:
    - View: See full job post details
    - Edit: Modify job post
    - Archive: Archive job post (with confirmation)

### Page Performance

- **Fast Scan**: All key info visible in under 5 seconds
- **Real-time Filtering**: Instant client-side filtering
- **Status Awareness**: Visual indicators for urgent actions

## Design Decisions

### Why Headless UI?

- **Flexibility**: Completely customizable rendering
- **Reusability**: Logic separated from presentation
- **Type Safety**: Full TypeScript support
- **Testability**: Easy to test business logic

### Why Modular Components?

- **Maintainability**: Each component has single responsibility
- **Reusability**: Components can be used elsewhere
- **Consistency**: Uniform design system
- **Scalability**: Easy to extend

### Why Separate Routes File?

- **Organization**: Job-related routes in one place
- **Scalability**: Easy to add new job routes
- **Clarity**: Clear route structure
- **Maintenance**: Easy to update job routes

## Constants Usage

All constants are defined in designated locations:

- **Status Constants**: `utils/constants.ts`
- **API Endpoints**: `utils/backendAPIs.ts`
- **Routes**: `utils/constants.ts` (ROUTES object)

Constants are imported from `@/utils/constants` and NOT from `@/types`.

## Future Enhancements

### Planned Features

1. **Create Job Post Page** - Form to create new job posts
2. **Edit Job Post Page** - Update existing job posts
3. **Job Post Detail Page** - Full view with applications
4. **Pagination** - Server-side pagination for large datasets
5. **Bulk Actions** - Select multiple posts for bulk operations
6. **Export** - Export job posts to CSV/PDF
7. **Analytics Dashboard** - View job post performance metrics

### Technical Improvements

- Add loading skeletons
- Implement optimistic updates
- Add error boundaries
- Cache job post data
- Add real-time updates via WebSocket

## Backend Requirements

### Expected API Response Format

```typescript
// GET /job-posts
{
    data: JobPost[],
    meta: {
        currentPage: number,
        totalPages: number,
        totalItems: number,
        itemsPerPage: number
    }
}

// GET /job-posts/:id
{
    success: boolean,
    message: string,
    data: JobPost,
    timestamp: string
}
```

### Backend Services Required

1. Job Post Service (port 8081)
2. Discovery Service (Eureka)
3. Gateway Service
4. Kafka for event streaming

## Testing

### Component Testing

```typescript
// Test JobStatusBadge
expect(badge).toHaveTextContent("Published");
expect(badge).toHaveClass("bg-green-100");

// Test filtering
fireEvent.click(draftTab);
expect(filteredPosts).toHaveLength(expectedDraftCount);
```

### Integration Testing

- Test API calls with mock data
- Verify error handling
- Test loading states

## Troubleshooting

### Common Issues

**Import Errors**

- Ensure constants are imported from `@/utils/constants`
- Types should be imported from `@/types`

**Type Errors**

- Use type assertions for Object.values(): `as EmploymentType[]`
- Ensure all types are exported from index files

**Badge Not Showing**

- Verify Badge is exported from `@/components/ui/Badge/index.ts`
- Check that Badge component exists

## Credits

Built with:

- React 19
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios
- Clsx

---

**Note**: This implementation follows the project's existing patterns and utilizes pre-existing constants, types, and UI components where possible.
