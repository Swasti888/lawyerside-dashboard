import { useState } from 'react'
import { Upload, Camera, Save, RotateCcw } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { mockLawyerProfile, dataUtils } from '@/data/mockData'
import { getInitials } from '@/lib/utils'

export default function ProfileCard() {
  const [profile, setProfile] = useState(mockLawyerProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updatedProfile = await dataUtils.updateLawyerProfile(profile)
      setProfile(updatedProfile)
      setIsEditing(false)
      
      toast({
        title: "Profile Updated",
        description: `Profile synced to Founder Dashboard (v${updatedProfile.versionStamp})`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = (type: 'firmLogo' | 'headshot') => {
    // Simulate image upload
    const fileName = `${type}-${Date.now()}.jpg`
    setProfile(prev => ({
      ...prev,
      [type]: `/uploads/${fileName}`
    }))
    
    toast({
      title: "Image Uploaded",
      description: `${type === 'firmLogo' ? 'Firm logo' : 'Headshot'} uploaded successfully`,
    })
  }

  return (
    <Card className="card-hover">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          My Profile
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="focus-ring"
                >
                  <Save className="h-4 w-4 mr-1" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setProfile(mockLawyerProfile)
                  }}
                  className="focus-ring"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="focus-ring"
              >
                Edit
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Firm Logo */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Firm Logo</label>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
              {profile.firmLogo ? (
                <img
                  src={profile.firmLogo}
                  alt="Firm logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Upload className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            {isEditing && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleImageUpload('firmLogo')}
                className="focus-ring"
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>
            )}
          </div>
        </div>

        {/* Lawyer Headshot */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Photo</label>
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={profile.headshot} />
              <AvatarFallback>
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleImageUpload('headshot')}
                className="focus-ring"
              >
                <Camera className="h-4 w-4 mr-1" />
                Upload
              </Button>
            )}
          </div>
        </div>

        {/* Profile Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Name</label>
            {isEditing ? (
              <Input
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 focus-ring"
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Title</label>
            {isEditing ? (
              <Input
                value={profile.title}
                onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 focus-ring"
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">{profile.title}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Firm</label>
            {isEditing ? (
              <Input
                value={profile.firmName}
                onChange={(e) => setProfile(prev => ({ ...prev, firmName: e.target.value }))}
                className="mt-1 focus-ring"
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">{profile.firmName}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            {isEditing ? (
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 focus-ring"
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            {isEditing ? (
              <Input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1 focus-ring"
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-1">{profile.phone}</p>
            )}
          </div>
        </div>

        {/* Version Info */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Last synced: v{profile.versionStamp} • {new Date(profile.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
