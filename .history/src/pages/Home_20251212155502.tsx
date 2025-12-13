import { Link } from "react-router-dom";
import { Button, Card } from "../components/ui";

export default function Home() {
    return (
        <div className="bg-background">
            <section className="relative overflow-hidden px-6 pt-12 pb-14">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-28 right-[-6rem] h-80 w-80 rounded-full bg-filled-button/10 blur-2xl" />
                    <div className="absolute -bottom-40 left-[-8rem] h-96 w-96 rounded-full bg-filled-button/10 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-6xl">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div>
                            <p className="inline-flex items-center rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-sm text-gray-600 backdrop-blur">
                                Built for company hiring teams
                            </p>
                            <h1 className="mt-4 text-4xl font-bold tracking-tight text-heading sm:text-5xl">
                                Post jobs. Manage applicants. Hire with clarity.
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                DEVision gives companies a fast, organized way to publish roles and move candidates through a simple
                                pipeline—without losing track of decisions.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Link to="/register" className="inline-flex">
                                    <Button size="lg">Create company account</Button>
                                </Link>
                                <Link to="/login" className="inline-flex">
                                    <Button variant="secondary" size="lg">
                                        Log in
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                                <span>Post jobs</span>
                                <span className="text-gray-300">•</span>
                                <span>Screen applicants</span>
                                <span className="text-gray-300">•</span>
                                <span>Hire with clarity</span>
                            </div>

                            <div className="mt-8 flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                                    <span>Centralized hiring workspace</span>
                                </div>
                                <div className="hidden h-3 w-px bg-gray-300 sm:block" />
                                <div className="hidden sm:block">Built for professional teams</div>
                            </div>
                        </div>

                        <div className="lg:justify-self-end">
                            <div className="text-xl text-gray-900 font-bold py-4 text-heading">What your hiring workspace looks like</div>
                            <Card className="p-6 sm:p-8">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-filled-button/10 text-heading">
                                        <span className="text-lg font-semibold">D</span>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Your hiring workspace</div>
                                        <div className="text-base font-semibold text-gray-900">Applicant pipeline overview</div>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-3">
                                    {[
                                        { label: "New", value: "24" },
                                        { label: "Screening", value: "9" },
                                        { label: "Interview", value: "4" },
                                        { label: "Offer", value: "1" },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
                                        >
                                            <div className="text-sm font-medium text-gray-700">{item.label}</div>
                                            <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 rounded-lg bg-background px-4 py-3">
                                    <div className="text-sm font-medium text-gray-900">Next action</div>
                                    <div className="mt-1 text-sm text-gray-600">
                                        Review top applicants for “Frontend Intern” and schedule interviews.
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-6 pb-14 py-8">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="p-6">
                            <div className="text-base font-semibold text-gray-900">Post jobs quickly</div>
                            <p className="mt-2 text-sm text-gray-600">
                                Publish roles with clear descriptions and requirements—then start receiving applicants.
                            </p>
                        </Card>
                        <Card className="p-6">
                            <div className="text-base font-semibold text-gray-900">Manage applicants</div>
                            <p className="mt-2 text-sm text-gray-600">
                                Keep candidates organized across stages so nothing slips through the cracks.
                            </p>
                        </Card>
                        <Card className="p-6">
                            <div className="text-base font-semibold text-gray-900">Make decisions together</div>
                            <p className="mt-2 text-sm text-gray-600">
                                Share updates with your team and move faster from screening to offer.
                            </p>
                        </Card>
                    </div>

                    <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="text-xl font-semibold text-gray-900">Ready to hire with DEVision?</div>
                                <div className="mt-1 text-sm text-gray-600">Create an account and post your first job today.</div>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link to="/register" className="inline-flex">
                                    <Button>Create account</Button>
                                </Link>
                                <Link to="/login" className="inline-flex">
                                    <Button variant="ghost">Log in</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
