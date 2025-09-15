import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function UniversityDetail() {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const response = await fetch(`https://uni-api-w0ms.onrender.com/api/universities/${id}/`);
        const data = await response.json();
        setUniversity(data);
      } catch (err) {
        console.error("Error fetching university:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversity();
  }, [id]);

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading university details...</p>;
  if (!university)
    return <p className="text-center text-red-500 mt-10">University not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      {/* Back Button */}
      <Link to="/">
        <Button variant="ghost" className="mb-6">
          ← Back to Search
        </Button>
      </Link>

      {/* University Header */}
      <h1 className="text-4xl font-bold text-gray-900">{university.name}</h1>
      <p className="text-gray-600 mt-1">{university.city}, {university.country}</p>

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
              <a href={university.university_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                Visit
              </a>
            </p>
            <p>
              <Label>Application Link:</Label>{" "}
              <a href={university.application_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                Apply Now
              </a>
            </p>
            <p><Label>Application Fee:</Label> ${university.application_fee}</p>
            <p><Label>Undergrad Deadline:</Label> {university.deadline_undergrad || "Not specified"}</p>
            <p><Label>Grad Deadline:</Label> {university.deadline_grad || "Not specified"}</p>
          </CardContent>
        </Card>

      {/* Academics & Costs Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Academics & Costs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p><Label>Course Offered:</Label> {university.course_offered}</p>
          <p><Label>Tuition Fee:</Label> ${university.tuition_fee}/year</p>
          <p><Label>Scholarships:</Label></p>
          <div className="pl-4 text-gray-700 whitespace-pre-line">
            {university.scholarships && university.scholarships.length > 0 ? (
              university.scholarships.map((scholar, index) => (
                <div key={index}>
                  <p><Label>Scholarship Name:</Label> {scholar.name}</p>
                  <p><Label>Scholarship Amount:</Label> {scholar.coverage}</p>
                  <p><Label>Eligibility:</Label> {scholar.eligibility}</p>
                  <p><Label>Link:</Label> <a href={scholar.link} target="_blank" rel="noopener noreferrer">
                  <a href= {scholar.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                   scholarship link
                  </a>   
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
            {university.name} is a leading institution offering programs in {university.course_offered}. 
            With a commitment to academic excellence and student success, it attracts students from around the world.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

