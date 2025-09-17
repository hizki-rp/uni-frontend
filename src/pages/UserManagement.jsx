import React, { useEffect, useState } from "react";
import { useAuth } from "../context/context";
import { API_BASE_URL } from "../apiConfig";
import { Button } from "@/components/ui/button";
import {
  Users,
  CheckCircle,
  Clock,
  UserX,
  Building,
  BadgeCheck,
  BadgeX,
} from "lucide-react";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    is_active: false,
    groups: [],
    dashboard: {
      subscription_status: "none",
      subscription_end_date: "",
    },
  });
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { authTokens, logoutUser } = useAuth();

  useEffect(() => {
    if (!authTokens) {
      return;
    }

    const fetchAdminData = async () => {
      try {
        const [usersResponse, groupsResponse, statsResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/api/users/`, {
              headers: {
                Authorization: `Bearer ${authTokens.access}`,
              },
            }),
            fetch(`${API_BASE_URL}/api/groups/`, {
              headers: {
                Authorization: `Bearer ${authTokens.access}`,
              },
            }),
            fetch(`${API_BASE_URL}/api/admin/stats/`, {
              headers: {
                Authorization: `Bearer ${authTokens.access}`,
              },
            }),
          ]);

        if (
          usersResponse.status === 401 ||
          groupsResponse.status === 401 ||
          statsResponse.status === 401
        ) {
          logoutUser();
          return;
        }

        if (!usersResponse.ok || !groupsResponse.ok || !statsResponse.ok) {
          throw new Error("Failed to fetch admin data.");
        }

        const usersData = await usersResponse.json();
        const groupsData = await groupsResponse.json();
        const statsData = await statsResponse.json();

        // Safely access the 'results' property from paginated API responses.
        setUsers(usersData.results || usersData || []);
        setGroups(groupsData.results || groupsData || []);
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [authTokens, logoutUser]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditFormData({
      is_active: user.is_active,
      groups: user.groups,
      dashboard: {
        subscription_status: user.dashboard?.subscription_status || "none",
        subscription_end_date: user.dashboard?.subscription_end_date || "",
      },
    });
    setIsSheetOpen(true);
  };

  const handleFormChange = (field, value) => {
    if (field.startsWith("dashboard.")) {
      const subField = field.split(".")[1];
      setEditFormData((prev) => ({
        ...prev,
        dashboard: { ...prev.dashboard, [subField]: value },
      }));
    } else {
      setEditFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleGroupChange = (groupId, checked) => {
    setEditFormData((prev) => {
      const newGroups = checked
        ? [...prev.groups, groupId]
        : prev.groups.filter((id) => id !== groupId);
      return { ...prev, groups: newGroups };
    });
  };

  const handleExtendSubscription = () => {
    const currentEndDateStr = editFormData.dashboard.subscription_end_date;
    let startDate;

    // If there's a valid end date, start from there. Otherwise, start from today.
    if (currentEndDateStr && !isNaN(new Date(currentEndDateStr))) {
      startDate = new Date(currentEndDateStr);
    } else {
      startDate = new Date();
    }

    // Add 30 days
    startDate.setDate(startDate.getDate() + 30);

    // Format to YYYY-MM-DD for the input field
    const newEndDate = startDate.toISOString().split("T")[0];

    handleFormChange("dashboard.subscription_status", "active");
    handleFormChange("dashboard.subscription_end_date", newEndDate);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${selectedUser.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify(editFormData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update user: ${JSON.stringify(errorData)}`);
      }

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      setIsSheetOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(newUserData),
      });

      if (!response.ok) {
        // Attempt to parse JSON error, fallback to status text if not JSON
        const errorData = await response.json().catch(() => ({}));
        // Extract detailed error messages or provide a generic one
        const errorMessage =
          Object.values(errorData).flat().join(" ") || response.statusText;
        throw new Error(`Failed to create user: ${errorMessage}`);
      }

      const createdUser = await response.json();
      setUsers((prevUsers) => [createdUser, ...prevUsers]);
      setIsCreateSheetOpen(false);
      setNewUserData({ username: "", email: "", password: "" }); // Reset form
    } catch (err) {
      console.error("Error creating user:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (response.status === 204) {
        // No Content
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      } else if (response.status >= 400) {
        const errorData = await response.json();
        throw new Error(`Failed to delete user: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 italic mt-10">
        <p>An error occurred: {error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Stats Section */}
      {stats && (
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Users Who Applied
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.applied_users}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Logins (30d)
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recent_logins}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inactive Accounts
              </CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.inactive_accounts}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Universities
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total_universities}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Subscriptions
              </CardTitle>
              <BadgeCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.active_subscriptions}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Expired Subscriptions
              </CardTitle>
              <BadgeX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.expired_subscriptions}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Button onClick={() => setIsCreateSheetOpen(true)}>
            Create User
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Groups</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Sub. End Date</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.is_active ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {/* Add a guard `(user.groups || [])` to prevent crash if groups is missing */}
                    {Array.isArray(user.groups)
                      ? user.groups
                          .map((gId) => groups.find((g) => g.id === gId)?.name)
                          .join(", ")
                      : ""}
                  </TableCell>
                  <TableCell className="capitalize">
                    {user.dashboard?.subscription_status || "N/A"}
                  </TableCell>
                  <TableCell>
                    {user.dashboard?.subscription_end_date || "N/A"}
                  </TableCell>
                  <TableCell>
                    {new Date(user.date_joined).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(user)}
                    >
                      Manage
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleDeleteUser(user.id)}
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

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit User: {selectedUser?.username}</SheetTitle>
            <SheetDescription>
              Modify user details and permissions here.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={editFormData.is_active}
                onCheckedChange={(checked) =>
                  handleFormChange("is_active", checked)
                }
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <div>
              <Label className="mb-2 block">Groups</Label>
              {groups.map((group) => (
                <div key={group.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`group-${group.id}`}
                    checked={editFormData.groups.includes(group.id)}
                    onCheckedChange={(checked) => {
                      handleGroupChange(group.id, checked);
                    }}
                  />
                  <Label htmlFor={`group-${group.id}`}>{group.name}</Label>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Subscription Status</Label>
              <Select
                value={editFormData.dashboard.subscription_status}
                onValueChange={(value) =>
                  handleFormChange("dashboard.subscription_status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub-end-date">Subscription End Date</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="sub-end-date"
                  type="date"
                  value={editFormData.dashboard.subscription_end_date || ""}
                  onChange={(e) =>
                    handleFormChange(
                      "dashboard.subscription_end_date",
                      e.target.value
                    )
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExtendSubscription}
                >
                  +30 days
                </Button>
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={handleUpdateUser}>Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Create User Sheet */}
      <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create New User</SheetTitle>
            <SheetDescription>
              Enter the details for the new user. The user will be added to the
              'user' group by default.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-username">Username</Label>
              <Input
                id="new-username"
                value={newUserData.username}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, username: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                value={newUserData.email}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newUserData.password}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, password: e.target.value })
                }
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={handleCreateUser}>Create User</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UserManagement;
