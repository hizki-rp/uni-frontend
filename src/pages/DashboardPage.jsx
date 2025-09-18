import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "../apiConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import LoadingSpinner from "../components/LoadingSpinner";

const ErrorMessage = ({ message }) => (
  <div className="text-center text-red-500 italic mt-10">
    <p>An error occurred: {message}</p>
    <p>Please try refreshing the page.</p>
  </div>
);

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewalError, setRenewalError] = useState(null);
  const { authTokens, logoutUser } = useAuth();

  const fetchDashboardData = useCallback(async () => {
    if (!authTokens) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      if (response.status === 401) {
        logoutUser();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authTokens, logoutUser]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // This effect polls for updates, which is useful after a payment redirect
  // in case the webhook from Chapa is slightly delayed.
  useEffect(() => {
    // If data is loaded and subscription is active, or if there's an error, no need to poll.
    if (dashboardData?.subscription_status === "active" || error) {
      return;
    }

    let attempts = 0;
    const poller = setInterval(() => {
      console.log("Polling for subscription update...");
      fetchDashboardData();
      attempts++;
      if (attempts >= 5) clearInterval(poller);
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(poller);
  }, [dashboardData, error, fetchDashboardData]);

  const renderUniversityList = (universities) => {
    if (!universities || universities.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">
          No universities in this list yet.
        </p>
      );
    }
    return (
      <ul className="space-y-2">
        {universities.map((uni) => (
          <li
            key={uni.id}
            className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
          >
            <Link
              to={`/university/${uni.id}`}
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {uni.name}
            </Link>
            {/* Future: Add buttons to move/remove universities */}
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!dashboardData) {
    return <p className="text-center mt-10">No dashboard data found.</p>;
  }

  const handleRenewSubscription = async () => {
    setIsRenewing(true);
    setRenewalError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chapa/initialize/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      const data = await response.json();

      if (response.ok && data.status === "success" && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error(data.message || "Failed to start payment process.");
      }
    } catch (err) {
      setRenewalError(err.message);
    } finally {
      setIsRenewing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Status:{" "}
              <Badge
                variant={
                  dashboardData.subscription_status === "expired"
                    ? "destructive"
                    : "secondary"
                }
                className={`capitalize ${
                  dashboardData.subscription_status === "active"
                    ? "bg-green-600 text-white hover:bg-green-600"
                    : ""
                }`}
              >
                {dashboardData.subscription_status}
              </Badge>
            </p>
            <p>
              Expires on:{" "}
              <span className="font-semibold">
                {dashboardData.subscription_end_date || "N/A"}
              </span>
            </p>
            <Button
              onClick={handleRenewSubscription}
              disabled={isRenewing}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {isRenewing ? "Processing..." : "Renew for 1 Month (100 ETB)"}
            </Button>
            {renewalError && (
              <p className="text-sm text-red-500">{renewalError}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            {renderUniversityList(dashboardData.favorites)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Planning to Apply</CardTitle>
          </CardHeader>
          <CardContent>
            {renderUniversityList(dashboardData.planning_to_apply)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Applied</CardTitle>
          </CardHeader>
          <CardContent>
            {renderUniversityList(dashboardData.applied)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            {renderUniversityList(dashboardData.accepted)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Visa Approved</CardTitle>
          </CardHeader>
          <CardContent>
            {renderUniversityList(dashboardData.visa_approved)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
