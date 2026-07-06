
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Code, Palette, Shield } from "lucide-react";

export default function SettingsPage() {
    const { toast } = useToast();

    const handleSaveChanges = () => {
        toast({
            title: "Settings Saved",
            description: "Your new settings have been saved successfully.",
        });
    }

    const handleDeleteAccount = () => {
        toast({
            title: "Action Required",
            description: "Account deletion is not yet implemented.",
            variant: "destructive"
        });
    }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1 font-headline">
          Settings
        </h1>
        <p className="text-lg text-muted-foreground">
          Customize your Backend Mentor experience.
        </p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        
        <Card>
            <CardHeader>
                <div className="flex items-center space-x-3">
                    <Shield className="h-6 w-6" />
                    <CardTitle>Security</CardTitle>
                </div>
                <CardDescription>
                Manage your account security settings.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="Enter current password" />
                </div>
                <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="Enter new password" />
                </div>
                 <div className="flex items-center space-x-4">
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <Button variant="outline" size="sm">Enable 2FA</Button>
                </div>
                <Button onClick={handleSaveChanges}>Update Password</Button>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
                <Bell className="h-6 w-6" />
                <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
                Manage how you receive notifications from us.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="email-notifications" className="cursor-pointer font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                        Receive emails about your account, challenges, and updates.
                    </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="push-notifications" className="cursor-pointer font-medium">In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                        Get pop-up notifications inside the app for important events.
                    </p>
                </div>
                <Switch id="push-notifications" defaultChecked/>
            </div>
             <Separator />
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="challenge-suggestions" className="cursor-pointer font-medium">Challenge Suggestions</Label>
                    <p className="text-sm text-muted-foreground">
                        Receive notifications for AI-recommended challenges.
                    </p>
                </div>
                <Switch id="challenge-suggestions" defaultChecked/>
            </div>
             <Separator />
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="community-alerts" className="cursor-pointer font-medium">Community Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                        Get notified about mentions and replies in the community.
                    </p>
                </div>
                <Switch id="community-alerts" />
            </div>
            <Button onClick={handleSaveChanges}>Save Notification Settings</Button>
          </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <div className="flex items-center space-x-3">
                    <Code className="h-6 w-6" />
                    <CardTitle>Editor Preferences</CardTitle>
                </div>
                <CardDescription>
                Customize your live coding environment.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="editor-theme">Theme</Label>
                    <Select defaultValue="dark">
                        <SelectTrigger id="editor-theme">
                            <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dark">Mentor Dark</SelectItem>
                            <SelectItem value="light">Mentor Light</SelectItem>
                            <SelectItem value="solarized">Solarized</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="editor-font-size">Font Size</Label>
                    <Input id="editor-font-size" type="number" defaultValue="14" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="key-bindings">Key Bindings</Label>
                    <Select defaultValue="standard">
                        <SelectTrigger id="key-bindings">
                            <SelectValue placeholder="Select key bindings" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="vim">Vim</SelectItem>
                            <SelectItem value="emacs">Emacs</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="flex items-center space-x-2 pt-6">
                    <Switch id="auto-complete" defaultChecked />
                    <Label htmlFor="auto-complete" className="cursor-pointer">Enable AI Autocomplete</Label>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <Button onClick={handleSaveChanges}>Save Editor Preferences</Button>
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                    These actions are permanent and cannot be undone.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                    <div>
                        <p className="font-medium">Reset Progress</p>
                        <p className="text-sm text-muted-foreground">Reset all your challenge progress and stats.</p>
                    </div>
                     <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={handleDeleteAccount}>Reset Progress</Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                    <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                    </div>
                    <Button variant="destructive" onClick={handleDeleteAccount}>Delete My Account</Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
