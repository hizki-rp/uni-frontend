import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

 const UniversityList = () => {
  const [universities, setUniversities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [showSidebar, setShowSidebar] = React.useState(false);

  const [filters, setFilters] = React.useState({
    country: "",
    city: "",
    course: "",
    degree: "",
    maxAppFee: "",
    maxTuition: "",
  });

  // Fetch universities
  React.useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch(
          "https://uni-api-w0ms.onrender.com/api/universities/"
        );
        const data = await response.json();
        setUniversities(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  // Filter + search
  const filteredUniversities = universities.filter((uni) => {
    const search = query.toLowerCase();
    return (
      (!query ||
        uni.name.toLowerCase().includes(search) ||
        uni.country.toLowerCase().includes(search) ||
        uni.course_offered.toLowerCase().includes(search)) &&
      (!filters.country ||
        uni.country.toLowerCase() === filters.country.toLowerCase()) &&
      (!filters.city ||
        uni.city.toLowerCase() === filters.city.toLowerCase()) &&
      (!filters.course ||
        uni.course_offered.toLowerCase().includes(filters.course.toLowerCase())) &&
      (!filters.degree ||
        uni.degree_level.toLowerCase() === filters.degree.toLowerCase()) &&
      (!filters.maxAppFee ||
        parseFloat(uni.application_fee) <= parseFloat(filters.maxAppFee)) &&
      (!filters.maxTuition ||
        parseFloat(uni.tuition_fee) <= parseFloat(filters.maxTuition))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Toggle (Mobile Only) */}
        <div className="md:hidden flex justify-end px-4 mb-4">
          <Button
            variant="outline"
            onClick={() => setShowSidebar((prev) => !prev)}
          >
            {showSidebar ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Sidebar */}
        <aside
          className={`${
            showSidebar ? "block" : "hidden"
          } md:block w-full md:w-64 bg-white p-6 rounded-2xl shadow-md border border-gray-100 h-fit sticky top-6`}
        >
          <h3 className="text-lg font-semibold mb-4">Filters</h3>

          <div className="mb-4">
            <Label>Country</Label>
            <Input
              placeholder="e.g. USA"
              value={filters.country}
              onChange={(e) =>
                setFilters({ ...filters, country: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <Label>City</Label>
            <Input
              placeholder="e.g. London"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <Label>Course/Program</Label>
            <Input
              placeholder="e.g. Computer Science"
              value={filters.course}
              onChange={(e) =>
                setFilters({ ...filters, course: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <Label>Degree Level</Label>
            <Select
              value={filters.degree || "any"}
              onValueChange={(value) =>
                setFilters({ ...filters, degree: value === "any" ? "" : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="bachelor">Bachelor</SelectItem>
                <SelectItem value="master">Master</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label>Max Application Fee ($)</Label>
            <Input
              type="number"
              value={filters.maxAppFee}
              onChange={(e) =>
                setFilters({ ...filters, maxAppFee: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <Label>Max Tuition Fee ($)</Label>
            <Input
              type="number"
              value={filters.maxTuition}
              onChange={(e) =>
                setFilters({ ...filters, maxTuition: e.target.value })
              }
            />
          </div>

          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() =>
              setFilters({
                country: "",
                city: "",
                course: "",
                degree: "",
                maxAppFee: "",
                maxTuition: "",
              })
            }
          >
            Reset Filters
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-2xl font-semibold">Search Universities</h2>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search by name, country or course..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button>Search</Button>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : filteredUniversities.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUniversities.map((uni) => (
                 <Link
                 key={uni.id}
                 to={`/university/${uni.id}`}
                 className="block relative rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-300 dark:hover:shadow-black/50"
               >
                 <Card className="h-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 flex flex-col justify-between">
                   <CardHeader className="p-0 mb-4">
                     <CardTitle className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50">{uni.name}</CardTitle>
                   </CardHeader>
                   <CardContent className="p-0 text-sm space-y-2 text-gray-600 dark:text-gray-400">
                     <p className="flex items-center gap-2">
                       <span className="text-gray-400 dark:text-gray-600">📍</span>
                       {uni.city}, {uni.country}
                     </p>
                     <p className="flex items-center gap-2">
                       <span className="text-gray-400 dark:text-gray-600">🎓</span>
                       {uni.degree_level}
                     </p>
                     <div className="flex flex-col gap-1 mt-2 border-t pt-2 border-gray-100 dark:border-gray-800">
                       <p className="flex items-center gap-2">
                         <span className="text-gray-400 dark:text-gray-600">💰</span>
                         Tuition: **${uni.tuition_fee}**
                       </p>
                       <p className="flex items-center gap-2">
                         <span className="text-gray-400 dark:text-gray-600">📝</span>
                         App Fee: **${uni.application_fee}**
                       </p>
                     </div>
                     <a
                       href={uni.website}
                       target="_blank"
                       rel="noreferrer"
                       className="text-blue-600 hover:text-blue-500 hover:underline mt-4 inline-flex items-center font-medium"
                       onClick={(e) => e.stopPropagation()}
                     >
                       Visit Website →
                     </a>
                   </CardContent>
                 </Card>
               </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No universities match your search/filter.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default UniversityList