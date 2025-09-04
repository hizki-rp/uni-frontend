import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function UniversityList() {
  const [universities, setUniversities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");

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
        const response = await fetch("https://uni-api-w0ms.onrender.com/api/universities/");
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
      (!filters.country || uni.country.toLowerCase() === filters.country.toLowerCase()) &&
      (!filters.city || uni.city.toLowerCase() === filters.city.toLowerCase()) &&
      (!filters.course || uni.course_offered.toLowerCase().includes(filters.course.toLowerCase())) &&
      (!filters.degree || uni.degree_level.toLowerCase() === filters.degree.toLowerCase()) &&
      (!filters.maxAppFee || parseFloat(uni.application_fee) <= parseFloat(filters.maxAppFee)) &&
      (!filters.maxTuition || parseFloat(uni.tuition_fee) <= parseFloat(filters.maxTuition))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className="w-48 bg-white p-6 rounded-2xl shadow-md border border-gray-100 h-fit sticky top-6">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>

          <div className="mb-4">
            <Label>Country</Label>
            <Input
              placeholder="e.g. USA"
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
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
              onChange={(e) => setFilters({ ...filters, course: e.target.value })}
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
              onChange={(e) => setFilters({ ...filters, maxAppFee: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <Label>Max Tuition Fee ($)</Label>
            <Input
              type="number"
              value={filters.maxTuition}
              onChange={(e) => setFilters({ ...filters, maxTuition: e.target.value })}
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
        <main className="flex-1">
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
                className="block hover:shadow-lg transition-all duration-300 rounded-2xl"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{uni.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{uni.city}, {uni.country}</p>
                    <p>🎓 {uni.degree_level}</p>
                    <p>💰 Tuition: ${uni.tuition_fee} | 📝 App Fee: ${uni.application_fee}</p>
                    <a
                      href={uni.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline mt-2 inline-block"
                      onClick={(e) => e.stopPropagation()} // prevent Link click when visiting external site
                    >
                      Visit Website →
                    </a>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          ) : (
            <p className="text-gray-500 italic">No universities match your search/filter.</p>
          )}
        </main>
      </div>
    </div>
  );
}
