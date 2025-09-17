import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/context";
import { API_BASE_URL } from "../apiConfig";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminUniversityPage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentUniversity, setCurrentUniversity] = useState(null);

  const { authTokens } = useAuth();

  const fetchUniversities = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/universities/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error("Failed to fetch universities.");
      const data = await response.json();
      setUniversities(data.results || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authTokens]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a JSON file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/universities/bulk_create/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Bulk creation failed: ${JSON.stringify(errorData.error)}`
        );
      }

      alert("Universities added successfully!");
      fetchUniversities(); // Refresh the list
    } catch (err) {
      console.error("File upload error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const isUpdate = !!currentUniversity?.id;
    const url = isUpdate
      ? `${API_BASE_URL}/api/universities/${currentUniversity.id}/update/`
      : `${API_BASE_URL}/api/universities/create/`;
    const method = isUpdate ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(currentUniversity),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Operation failed: ${JSON.stringify(errorData)}`);
      }

      setIsDialogOpen(false);
      fetchUniversities();
    } catch (err) {
      console.error("Form submission error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (uniId) => {
    if (!window.confirm("Are you sure you want to delete this university?"))
      return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/universities/${uniId}/delete/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${authTokens.access}` },
        }
      );

      if (response.status !== 204) {
        throw new Error("Failed to delete university.");
      }

      fetchUniversities();
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const openCreateDialog = () => {
    setCurrentUniversity({
      name: "",
      country: "",
      city: "",
      application_fee: "0.00",
      tuition_fee: "0.00",
      university_link: "",
      application_link: "",
      description: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (uni) => {
    setCurrentUniversity(uni);
    setIsDialogOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Universities</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Bulk Add Universities</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Input type="file" accept=".json" onChange={handleFileChange} />
          <Button onClick={handleFileUpload} disabled={!selectedFile}>
            Upload JSON
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>University List</CardTitle>
          <Button onClick={openCreateDialog}>Create University</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {universities.map((uni) => (
                <TableRow key={uni.id}>
                  <TableCell>{uni.name}</TableCell>
                  <TableCell>{uni.country}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(uni)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleDelete(uni.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentUniversity?.id ? "Edit" : "Create"} University
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the university.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
            {Object.keys(currentUniversity || {}).map(
              (key) =>
                key !== "id" &&
                key !== "scholarships" &&
                key !== "bachelor_programs" &&
                key !== "masters_programs" && (
                  <div
                    key={key}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Label htmlFor={key} className="text-right capitalize">
                      {key.replace(/_/g, " ")}
                    </Label>
                    <Input
                      id={key}
                      value={currentUniversity[key]}
                      onChange={(e) =>
                        setCurrentUniversity({
                          ...currentUniversity,
                          [key]: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                )
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUniversityPage;
