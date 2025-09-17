import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/context";
import { API_BASE_URL } from "../apiConfig";

export default function UniversityDetail() {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authTokens, logoutUser } = useAuth();

  useEffect(() => {
    const fetchUniversity = async () => {
      if (!authTokens) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/universities/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
          }
        );
        if (response.status === 401) {
          logoutUser();
          return;
        }
        const data = await response.json();
        setUniversity(data);
      } catch (err) {
        console.error("Error fetching university:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversity();
  }, [id, authTokens, logoutUser]);

  const handleAddToDashboard = async (listName) => {
    if (!authTokens) {
      alert("You must be logged in to add to your dashboard.");
      return;
    }

    // Map frontend list names to backend field names if they differ
    const backendListName =
      listName === "toApply" ? "planning_to_apply" : listName;

    try {
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

      if (response.ok) {
        alert(
          `Added ${university.name} to your "${listName}" list on the dashboard.`
        );
      } else {
        const data = await response.json();
        alert(
          `Failed to add to dashboard: ${
            data.error || "An unknown error occurred."
          }`
        );
      }
    } catch (error) {
      console.error("Dashboard update error:", error);
      alert("An error occurred while updating your dashboard.");
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10">
        Loading university details...
      </p>
    );
  if (!university)
    return (
      <p className="text-center text-red-500 mt-10">University not found.</p>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      {/* Back Button */}
      <Link to="/universities">
        <Button variant="ghost" className="mb-6">
          ← Back to Search
        </Button>
      </Link>

      {/* University Header */}
      <h1 className="text-4xl font-bold text-gray-900">{university.name}</h1>
      <p className="text-gray-600 mt-1">
        {university.city}, {university.country}
      </p>

      {/* Dashboard Actions */}
      <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle>My Dashboard Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleAddToDashboard("favorites")}
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20"
          >
            Add to Favorites
          </Button>
          <Button
            onClick={() => handleAddToDashboard("toApply")}
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20"
          >
            Plan to Apply
          </Button>
          <Button
            onClick={() => handleAddToDashboard("applied")}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Mark as Applied
          </Button>
          <Button
            onClick={() => handleAddToDashboard("accepted")}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Mark as Accepted
          </Button>
          <Button
            onClick={() => handleAddToDashboard("visa_approved")}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Mark as Visa Approved
          </Button>
        </CardContent>
      </Card>

      {/* Info Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Admissions Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Admissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
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
            <p>
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
            <p>
              <Label>Application Fee:</Label> ${university.application_fee}
            </p>
            <p>
              <Label>Undergrad Deadline:</Label>{" "}
              {university.deadline_undergrad || "Not specified"}
            </p>
            <p>
              <Label>Grad Deadline:</Label>{" "}
              {university.deadline_grad || "Not specified"}
            </p>
          </CardContent>
        </Card>

        {/* Academics & Costs Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Academics & Costs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              <Label>Course Offered:</Label> {university.course_offered}
            </p>
            <p>
              <Label>Tuition Fee:</Label> ${university.tuition_fee}/year
            </p>
            <p>
              <Label>Scholarships:</Label>
            </p>
            <div className="pl-4 text-gray-700 whitespace-pre-line">
              {university.scholarships && university.scholarships.length > 0 ? (
                university.scholarships.map((scholar, index) => (
                  <div key={index}>
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
      <Card className="mt-10 shadow-md">
        <CardHeader>
          <CardTitle>About {university.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
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
