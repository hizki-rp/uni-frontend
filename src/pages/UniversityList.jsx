import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/context";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "../apiConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";

import LoadingSpinner from "../components/LoadingSpinner";

// --- Error Display Component ---
const ErrorMessage = ({ message }) => (
  <Card className="mt-10 w-full max-w-md mx-auto bg-red-50 border-red-200">
    <CardHeader>
      <CardTitle className="text-red-700 text-center">Access Denied</CardTitle>
    </CardHeader>
    <CardContent className="text-center">
      <p className="text-red-600 mb-4">{message}</p>
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
);

const UniversityList = () => {
  const [universities, setUniversities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [error, setError] = React.useState(null);
  const { authTokens, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [nextPageUrl, setNextPageUrl] = React.useState(null);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);

  const initialFilters = {
    country: "",
    city: "",
    course: "",
    degree: "",
    maxAppFee: "",
    maxTuition: "",
  };

  const [filters, setFilters] = React.useState(initialFilters);
  const [tempFilters, setTempFilters] = React.useState(initialFilters);
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);

  const handleLoadMore = React.useCallback(async () => {
    if (!nextPageUrl || loadingMore) return;

    setLoadingMore(true);
    try {
      const response = await fetch(nextPageUrl, {
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
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      setUniversities((prev) => [...prev, ...(data.results || [])]);
      setNextPageUrl(data.next);
    } catch (err) {
      console.error("Fetch error:", err.message);
      setError(err.message); // Or a more specific error for loading more
    } finally {
      setLoadingMore(false);
    }
  }, [nextPageUrl, loadingMore, authTokens, logoutUser]);

  // Fetch universities on initial load and when filters/query change
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.append("search", query);
    if (filters.country) params.append("country__icontains", filters.country);
    if (filters.city) params.append("city__icontains", filters.city);
    if (filters.course)
      params.append("course_offered__icontains", filters.course);
    if (filters.degree) params.append("degree_level", filters.degree);
    if (filters.maxAppFee)
      params.append("application_fee__lte", filters.maxAppFee);
    if (filters.maxTuition)
      params.append("tuition_fee__lte", filters.maxTuition);

    const url = `${API_BASE_URL}/api/universities/?${params.toString()}`;

    const doFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, {
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
          const errorData = await response.json();
          throw new Error(
            errorData.detail || `Request failed with status ${response.status}`
          );
        }

        const data = await response.json();
        setUniversities(data.results || []);
        setTotalCount(data.count || 0);
        setNextPageUrl(data.next);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    doFetch();
  }, [query, filters, authTokens, logoutUser]);

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setTempFilters(initialFilters);
    setQuery("");
  };

  const handleFilterModalOpenChange = (open) => {
    if (open) {
      // When the modal is about to open, sync the temp filters with the active ones.
      setTempFilters(filters);
    }
    setIsFilterModalOpen(open);
  };

  const FilterModal = (
    <Sheet open={isFilterModalOpen} onOpenChange={handleFilterModalOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20"
        >
          Filter
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full md:w-[400px] sm:max-w-sm overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Filter Universities</SheetTitle>
          <SheetDescription>
            Apply filters to find the universities that match your criteria.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <Label>Country</Label>
            <Input
              placeholder="e.g. USA"
              value={tempFilters.country}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, country: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              placeholder="e.g. London"
              value={tempFilters.city}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, city: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Course/Program</Label>
            <Input
              placeholder="e.g. Computer Science"
              value={tempFilters.course}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, course: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Max Application Fee ($)</Label>
            <Input
              type="number"
              value={tempFilters.maxAppFee}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, maxAppFee: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Max Tuition Fee ($)</Label>
            <Input
              type="number"
              value={tempFilters.maxTuition}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, maxTuition: e.target.value })
              }
            />
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => setIsFilterModalOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6">
      <main className="container mx-auto p-4 md:p-8 font-sans">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
            Explore Universities {/*  ({totalCount*})  */}  
          </h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Input
              placeholder="Search by name, country, or course..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-w-0 md:min-w-[300px] rounded-md pl-5 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
            {/* Search button can be removed if search is instant */}
            {/* <Button>Search</Button> */}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          {FilterModal}
          <Button variant="ghost" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>

        {/* Using the new LoadingSpinner component */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : universities.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {universities.map((uni) => (
              <Link key={uni.id} to={`/university/${uni.id}`} className="block">
                <Card className="h-full border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-0 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-500">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-50 leading-tight">
                      {uni.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm space-y-2 text-gray-600 dark:text-gray-400">
                    <p className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        <img
                          src="https://img.icons8.com/?size=100&id=34070&format=png&color=000000"
                          width={16}
                          className="dark:invert"
                        />
                      </span>
                      {uni.city}, {uni.country}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        <img
                          src="https://img.icons8.com/?size=100&id=QlB1OMIqTVgl&format=png&color=000000"
                          width={16}
                          className="dark:invert"
                        />
                      </span>
                      {uni.degree_level || "All Levels"}
                    </p>
                    <div className="flex flex-col gap-1 mt-2 border-t pt-2 border-gray-100 dark:border-gray-800">
                      <p className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          <img
                            src="https://img.icons8.com/?size=100&id=cBCf91yx3L2N&format=png&color=000000"
                            width={16}
                            height={16}
                            className="dark:invert"
                          />
                        </span>
                        Tuition:{" "}
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          ${uni.tuition_fee}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          <img
                            src="https://img.icons8.com/?size=100&id=78231&format=png&color=000000 "
                            width={16}
                            className="dark:invert"
                          />
                        </span>
                        App Fee:{" "}
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          ${uni.application_fee}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                  <SheetFooter className="p-4 pt-0">
                    <Button
                      variant="link"
                      className="text-blue-600 hover:text-blue-500 p-0 h-auto justify-start"
                    >
                      View Details →
                    </Button>
                  </SheetFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              No Universities Found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
        {universities.length > 0 &&
          universities.length < totalCount &&
          !loading && (
            <div className="text-center mt-12">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
      </main>
    </div>
  );
};

export default UniversityList;
