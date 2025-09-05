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

import i from "../assets/n.svg"

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
  } md:block w-full md:w-64 bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/30 h-fit sticky top-6 transition-all duration-300 ease-in-out font-sans border border-gray-100 dark:border-gray-800`}
>
  <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-50">Filters</h3>

  <div className="mb-6">
    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</Label>
    <Input
      placeholder="e.g. USA"
      value={filters.country}
      onChange={(e) =>
        setFilters({ ...filters, country: e.target.value })
      }
      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
    />
  </div>

  <div className="mb-6">
    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</Label>
    <Input
      placeholder="e.g. London"
      value={filters.city}
      onChange={(e) => setFilters({ ...filters, city: e.target.value })}
      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
    />
  </div>

  <div className="mb-6">
    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course/Program</Label>
    <Input
      placeholder="e.g. Computer Science"
      value={filters.course}
      onChange={(e) =>
        setFilters({ ...filters, course: e.target.value })
      }
      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
    />
  </div>

  <div className="mb-6">
    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Degree Level</Label>
    <Select
      value={filters.degree || "any"}
      onValueChange={(value) =>
        setFilters({ ...filters, degree: value === "any" ? "" : value })
      }
    >
      <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors">
        <SelectValue placeholder="Any" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
        <SelectItem value="any">Any</SelectItem>
        <SelectItem value="bachelor">Bachelor</SelectItem>
        <SelectItem value="master">Master</SelectItem>
        <SelectItem value="both">Both</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <div className="mb-6">
    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Application Fee ($)</Label>
    <Input
      type="number"
      value={filters.maxAppFee}
      onChange={(e) =>
        setFilters({ ...filters, maxAppFee: e.target.value })
      }
      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
    />
  </div>

  <div className="mb-6">
    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Tuition Fee ($)</Label>
    <Input
      type="number"
      value={filters.maxTuition}
      onChange={(e) =>
        setFilters({ ...filters, maxTuition: e.target.value })
      }
      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
    />
  </div>

  <Button
    variant="outline"
    className="w-full mt-4 bg-transparent border-2 border-gray-400 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
        <main className="flex-1 p-6 md:p-8 font-sans bg-gray-50 dark:bg-gray-950">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
      Search Universities
    </h2>
    <div className="flex items-center gap-3 w-full md:w-auto">
      <Input
        placeholder="Search by name, country, or course..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 min-w-0 md:min-w-[300px] rounded-full pl-5 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
      />
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-2 transition-transform transform hover:scale-105 shadow-md"
      >
        Search
      </Button>
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
                       <span className="text-gray-400 dark:text-gray-600"><img src="https://img.icons8.com/?size=100&id=34070&format=png&color=000000" width={20}/></span>
                       {uni.city}, {uni.country}
                     </p>
                     <p className="flex items-center gap-2">
                       <span className="text-gray-400 dark:text-gray-600"><img src="https://img.icons8.com/?size=100&id=QlB1OMIqTVgl&format=png&color=000000" width={20} /></span>
                       {uni.degree_level}
                     </p>
                     <div className="flex flex-col gap-1 mt-2 border-t pt-2 border-gray-100 dark:border-gray-800">
                       <p className="flex items-center gap-2">
                         <span className="text-gray-400 dark:text-gray-600 "><img src="https://img.icons8.com/?size=100&id=cBCf91yx3L2N&format=png&color=000000" width={20} height={20}/></span>
                         Tuition: <span className="font-bold">${uni.tuition_fee}</span>
                       </p>
                       <p className="flex items-center gap-2">
                         <span className="text-gray-400 dark:text-gray-600"><img src="https://img.icons8.com/?size=100&id=78231&format=png&color=000000 " width={20}/></span>
                         App Fee: <span className="font-bold">${uni.application_fee}</span>
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