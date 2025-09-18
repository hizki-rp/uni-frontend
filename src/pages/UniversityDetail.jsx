import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/context";
import { API_BASE_URL } from "../apiConfig";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <Card className="w-full max-w-md mx-auto bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
      <CardHeader>
        <CardTitle className="text-red-700 dark:text-red-400 text-center">
          Access Denied
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-red-600 dark:text-red-300 mb-4">{message}</p>
        {/subscription/i.test(message) && (
          <Button
            asChild
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Link to="/dashboard">Go to Dashboard to Renew &rarr;</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  </div>
);

export default function UniversityDetail() {
  const { id } = useParams();
  const { authTokens, user, logoutUser } = useAuth();
  const [university, setUniversity] = useState(null);
  const [dashboardData, setDashboardData] = useState(null); // New state for dashboard data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    if (!authTokens) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/`, {
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
      });
      if (response.status === 401) {
        logoutUser();
        return;
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Could not load your dashboard data.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const uniResponse = await fetch(
          `${API_BASE_URL}/api/universities/${id}/`,
          {
            headers: { Authorization: "Bearer " + String(authTokens.access) },
          }
        );
        if (uniResponse.status === 401) {
          logoutUser();
          return;
        }
        if (!uniResponse.ok) {
          const errorData = await uniResponse.json();
          throw new Error(
            errorData.detail || "Failed to fetch university details."
          );
        }
        const uniData = await uniResponse.json();
        setUniversity(uniData);

        // Fetch dashboard data on initial load
        await fetchDashboardData();
      } catch (err) {
        console.error("Error fetching university:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, authTokens, user, logoutUser]);

  // Helper to check if university is in a list
  const isInList = (listName) => {
    const backendListName =
      listName === "toApply" ? "planning_to_apply" : listName;
    return dashboardData?.[backendListName]?.some(
      (uni) => uni.id === parseInt(id)
    );
  };

  const handleAddToDashboard = async (listName) => {
    if (!authTokens) {
      toast.error("You must be logged in to add to your dashboard.");
      return;
    }

    if (isInList(listName)) {
      toast.info(`This university is already in your "${listName}" list.`);
      return;
    }

    try {
      const backendListName =
        listName === "toApply" ? "planning_to_apply" : listName;
      const response = await fetch(`${API_BASE_URL}/api/dashboard/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: JSON.stringify({
          university_id: id,
          list_name: backendListName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          `Failed to add to dashboard: ${
            errorData.error || "An unknown error occurred."
          }`
        );
      } else {
        toast.success(`Added ${university.name} to your "${listName}" list.`);
        await fetchDashboardData();
      }
    } catch (err) {
      console.error("Dashboard update error:", err);
      toast.error("An error occurred while updating your dashboard.");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!university)
    return (
      <p className="text-center text-red-500 mt-10">University not found.</p>
    );

  const dashboardButtons = [
    { label: "Add to Favorites", listName: "favorites" },
    { label: "Plan to Apply", listName: "toApply" },
    { label: "Mark as Applied", listName: "applied" },
    { label: "Mark as Accepted", listName: "accepted" },
    { label: "Mark as Visa Approved", listName: "visa_approved" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 bg-gray-50 dark:bg-gray-950 font-sans min-h-screen">
      <Toaster richColors position="top-right" />
      {/* Back Button */}
      <Link to="/universities">
        <Button variant="ghost" className="mb-6">
          ← Back to Search
        </Button>
      </Link>

      {/* University Header */}
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
        {university.name}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-1">
        {university.city}, {university.country}
      </p>

      {/* Dashboard Actions */}
      <Card className="mt-6 shadow-md bg-white dark:bg-gray-900/50">
        <CardHeader>
          <CardTitle className="dark:text-gray-200">
            My Dashboard Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {dashboardButtons.map(({ label, listName }) => {
            const active = isInList(listName);
            return (
              <Button
                key={listName}
                onClick={() => handleAddToDashboard(listName)}
                variant={active ? "default" : "outline"}
                className={cn("transition-colors duration-200", {
                  "bg-green-600 text-white hover:bg-green-700 border-green-600 dark:bg-green-700 dark:hover:bg-green-800 dark:border-green-700":
                    active,
                  "text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20":
                    !active,
                })}
              >
                {label}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Info Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Admissions Card */}
        <Card className="shadow-md bg-white dark:bg-gray-900/50">
          <CardHeader>
            <CardTitle className="dark:text-gray-200">Admissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="dark:text-gray-300">
              <Label>Website:</Label>{" "}
              <a
                href={university.university_link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                Visit
              </a>
            </p>
            <p className="dark:text-gray-300">
              <Label>Application Link:</Label>{" "}
              <a
                href={university.application_link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                Apply Now
              </a>
            </p>
            <p className="dark:text-gray-300">
              <Label>Application Fee:</Label> ${university.application_fee}
            </p>
            <p className="dark:text-gray-300">
              <Label>Undergrad Deadline:</Label>{" "}
              {university.deadline_undergrad || "Not specified"}
            </p>
            <p className="dark:text-gray-300">
              <Label>Grad Deadline:</Label>{" "}
              {university.deadline_grad || "Not specified"}
            </p>
          </CardContent>
        </Card>

        {/* Academics & Costs Card */}
        <Card className="shadow-md bg-white dark:bg-gray-900/50">
          <CardHeader>
            <CardTitle className="dark:text-gray-200">
              Academics & Costs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="dark:text-gray-300">
              <Label>Course Offered:</Label> {university.course_offered}
            </p>
            <p className="dark:text-gray-300">
              <Label>Tuition Fee:</Label> ${university.tuition_fee}/year
            </p>
            <p className="dark:text-gray-300">
              <Label>Scholarships:</Label>
            </p>
            <div className="pl-4 text-gray-700 dark:text-gray-400 whitespace-pre-line">
              {university.scholarships && university.scholarships.length > 0 ? (
                university.scholarships.map((scholar, index) => (
                  <div key={index} className="mb-4">
                    <p>
                      <Label>Scholarship Name:</Label> {scholar.name}
                    </p>
                    <p>
                      <Label>Scholarship Amount:</Label> {scholar.coverage}
                    </p>
                    <p>
                      <Label>Eligibility:</Label> {scholar.eligibility}
                    </p>
                    <p>
                      <Label>Link:</Label>{" "}
                      <a
                        href={scholar.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        scholarship link
                      </a>
                    </p>
                  </div>
                ))
              ) : (
                <p>No scholarships listed.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About Section */}
      <Card className="mt-10 shadow-md bg-white dark:bg-gray-900/50">
        <CardHeader>
          <CardTitle className="dark:text-gray-200">
            About {university.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {university.name} is a leading institution offering programs in{" "}
            {university.course_offered}. With a commitment to academic
            excellence and student success, it attracts students from around the
            world.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
