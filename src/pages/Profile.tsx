import React, { useState, useEffect } from 'react';
import { ProfileSkeleton } from '@/components/ui/skeletons/profile-skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Camera, Save, Edit } from 'lucide-react';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  // Move profile state before conditional return to fix hooks order
  const [profile, setProfile] = useState({
    name: userData.name || 'John Doe',
    email: userData.email || 'john.doe@evoka.in',
    phone: '+91 9876543210',
    role: userData.role || 'Admin',
    department: 'Administration',
    address: '123 Education Street, Bangalore, Karnataka',
    dateOfBirth: '1990-05-15',
    bloodGroup: 'O+',
    gender: 'Male',
    qualification: 'Master in Computer Applications',
    experience: '5 years',
    joiningDate: '2020-01-15',
    emergencyContact: '+91 9876543211',
    bio: 'Experienced administrator with a passion for education technology and student development.'
  });

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const handleSave = () => {
    // Save profile data
    setIsEditing(false);
    // You would typically save to backend here
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your personal information and settings</p>
          </div>
          <Button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            size="lg"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Profile Summary Card */}
          <div className="xl:col-span-1">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="relative mx-auto w-32 h-32">
                    <Avatar className="w-32 h-32 shadow-xl border-4 border-background">
                      <AvatarImage src="/placeholder.svg" alt={profile.name} />
                      <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 shadow-lg">
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {profile.role}
                    </Badge>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center space-x-3 text-sm group">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <span className="text-foreground font-medium">{profile.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm group">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Phone className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <span className="text-foreground font-medium">{profile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm group">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <MapPin className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <span className="text-muted-foreground">Bangalore, Karnataka</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm group">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Calendar className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <span className="text-muted-foreground">Joined {profile.joiningDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="xl:col-span-3">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-semibold">Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                    <TabsTrigger value="personal" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Personal Details</TabsTrigger>
                    <TabsTrigger value="professional" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Professional Details</TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Security Settings</TabsTrigger>
                  </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      disabled={!isEditing}
                      className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      disabled={!isEditing}
                      className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      disabled={!isEditing}
                      className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                      disabled={!isEditing}
                      className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                    <Select value={profile.gender} onValueChange={(value) => setProfile({...profile, gender: value})} disabled={!isEditing}>
                      <SelectTrigger className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="bloodGroup" className="text-sm font-medium">Blood Group</Label>
                    <Select value={profile.bloodGroup} onValueChange={(value) => setProfile({...profile, bloodGroup: value})} disabled={!isEditing}>
                      <SelectTrigger className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="emergencyContact" className="text-sm font-medium">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={profile.emergencyContact}
                      onChange={(e) => setProfile({...profile, emergencyContact: e.target.value})}
                      disabled={!isEditing}
                      className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                    className="border-0 bg-muted/50 focus:bg-background transition-colors resize-none"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="border-0 bg-muted/50 focus:bg-background transition-colors resize-none"
                  />
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                    <Input
                      id="role"
                      value={profile.role}
                      disabled={true}
                      className="h-11 border-0 bg-muted/30 text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                    <Input
                      id="department"
                      value={profile.department}
                      onChange={(e) => setProfile({...profile, department: e.target.value})}
                      disabled={!isEditing}
                      className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="qualification" className="text-sm font-medium">Qualification</Label>
                    <Input
                      id="qualification"
                      value={profile.qualification}
                      onChange={(e) => setProfile({...profile, qualification: e.target.value})}
                      disabled={!isEditing}
                      className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="experience" className="text-sm font-medium">Experience</Label>
                    <Input
                      id="experience"
                      value={profile.experience}
                      onChange={(e) => setProfile({...profile, experience: e.target.value})}
                      disabled={!isEditing}
                      className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="joiningDate" className="text-sm font-medium">Joining Date</Label>
                    <Input
                      id="joiningDate"
                      type="date"
                      value={profile.joiningDate}
                      disabled={true}
                      className="h-11 border-0 bg-muted/30 text-muted-foreground"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card className="border-0 shadow-md bg-card/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold">Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="currentPassword" className="text-sm font-medium">Current Password</Label>
                      <Input 
                        id="currentPassword" 
                        type="password" 
                        className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        className="h-11 border-0 bg-muted/50 focus:bg-background transition-colors"
                      />
                    </div>
                    <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                      Update Password
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;