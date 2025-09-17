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

// I've removed the unused import `i`

// --- 1. Loading Animation Component ---
// A simple, reusable spinner component for a better user experience.
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// --- Error Display Component ---
const ErrorMessage = ({ message }) => (
  <Card className="mt-10 w-full max-w-md mx-auto bg-red-50 border-red-200">
    <CardHeader>
      <CardTitle className="text-red-700 text-center">Access Denied</CardTitle>
    </CardHeader>
    <CardContent className="text-center">
      <p className="text-red-600 mb-4">{message}</p>
      {/subscription/i.test(message) && (
        <Button asChild>
          <Link to="/dashboard">Go to Dashboard to Renew</Link>
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

  // Fetch universities
  React.useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/universities/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        });
        if (response.status === 401) {
          // Unauthorized or token expired
          logoutUser();
          return;
        }
        // This is the key change: handle non-200 responses.
        if (!response.ok) {
          const errorData = await response.json();
          // The custom permission message is in `errorData.detail`
          throw new Error(
            errorData.detail || `Request failed with status ${response.status}`
          );
        }
        const data = await response.json();
        // Handle both paginated and non-paginated API responses
        setUniversities(data.results || data || []);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, [authTokens, navigate, logoutUser]);

  // --- 2. Memoized Filtering + Search Logic ---
  const filteredUniversities = React.useMemo(
    () =>
      universities.filter((uni) => {
        const search = query.toLowerCase();

        // The main fix is adding optional chaining (?.) before calling .toLowerCase() or .includes().
        // This was incorrect and would crash. The fix is to use `(uni.field ?? '')` to provide a
        // fallback empty string for nullish values before calling string methods.
        const matchesSearch =
          !query ||
          (uni.name ?? "").toLowerCase().includes(search) ||
          (uni.country ?? "").toLowerCase().includes(search) ||
          (uni.course_offered ?? "").toLowerCase().includes(search);

        const matchesFilters =
          (!filters.country ||
            (uni.country ?? "").toLowerCase() ===
              filters.country.toLowerCase()) &&
          (!filters.city ||
            (uni.city ?? "").toLowerCase() === filters.city.toLowerCase()) &&
          (!filters.course ||
            (uni.course_offered ?? "")
              .toLowerCase()
              .includes(filters.course.toLowerCase())) &&
          (!filters.degree ||
            (uni.degree_level ?? "").toLowerCase() ===
              filters.degree.toLowerCase()) &&
          // --- 3. Fixed Empty Field Filtering ---
          // This logic now correctly ignores the filter if the input is empty by checking for the filter value first.
          (!filters.maxAppFee ||
            parseFloat(uni.application_fee) <= parseFloat(filters.maxAppFee)) &&
          (!filters.maxTuition ||
            parseFloat(uni.tuition_fee) <= parseFloat(filters.maxTuition));

        return matchesSearch && matchesFilters;
      }),
    [universities, query, filters]
  );

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setTempFilters(initialFilters);
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
        <Button variant="outline">Filter</Button>
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
          <Button onClick={handleApplyFilters}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6">
      <main className="container mx-auto p-4 md:p-8 font-sans">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
            Explore Universities ({filteredUniversities.length})
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
        ) : filteredUniversities.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredUniversities.map((uni) => (
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
      </main>
    </div>
  );
};

export default UniversityList;
