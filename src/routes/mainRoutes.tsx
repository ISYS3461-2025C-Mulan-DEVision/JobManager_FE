import { Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import { ProfilePage } from "@/pages/profile";

export const mainRoutes = [
    <Route key="home" path="/" element={<Landing />} />,
    <Route key="profile" path="/profile" element={<ProfilePage />} />,
];
