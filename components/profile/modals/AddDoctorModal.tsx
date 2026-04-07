import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AddDoctorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (doctorData: any) => Promise<void>;
}

export default function AddDoctorModal({
  open,
  onOpenChange,
  onAdd,
}: AddDoctorModalProps) {
  const [doctorType, setDoctorType] = useState<"registered" | "unregistered">("registered");
  const [registeredDoctorId, setRegisteredDoctorId] = useState("");
  
  // Unregistered doctor form state
  const [unregisteredData, setUnregisteredData] = useState({
    full_name: "",
    specialist_name: "",
    phone_number: "",
    address: "",
    license_number: "",
    profile_image: "",
    license_document: "",
  });
  
  const [loading, setLoading] = useState(false);

  const handleFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await handleFileToBase64(file);
      setUnregisteredData({ ...unregisteredData, [field]: base64 });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (doctorType === "registered") {
        if (!registeredDoctorId) {
          alert("Please enter doctor ID");
          return;
        }
        const payload = {
          doctor_type: "registered",
          doctor_id: parseInt(registeredDoctorId), // Ensure it's a number
        };
        console.log("📤 Submitting registered doctor:", payload);
        await onAdd(payload);
      } else {
        // Validate unregistered doctor form
        if (!unregisteredData.full_name || !unregisteredData.specialist_name || 
            !unregisteredData.phone_number || !unregisteredData.address || 
            !unregisteredData.license_number) {
          alert("Please fill all required fields");
          return;
        }
        
        const payload = {
          doctor_type: "unregistered",
          full_name: unregisteredData.full_name,
          specialist_name: unregisteredData.specialist_name,
          phone_number: unregisteredData.phone_number,
          address: unregisteredData.address,
          license_number: unregisteredData.license_number,
          profile_image: unregisteredData.profile_image || "",
          license_document: unregisteredData.license_document || "",
        };
        console.log("📤 Submitting unregistered doctor:", payload);
        await onAdd(payload);
      }
      onOpenChange(false);
      // Reset form
      setRegisteredDoctorId("");
      setUnregisteredData({
        full_name: "",
        specialist_name: "",
        phone_number: "",
        address: "",
        license_number: "",
        profile_image: "",
        license_document: "",
      });
    } catch (error: any) {
      console.error("Error adding doctor:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to add doctor. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Doctor to Team</DialogTitle>
        </DialogHeader>
        
        <Tabs value={doctorType} onValueChange={(v) => setDoctorType(v as any)} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="registered">Registered Doctor</TabsTrigger>
            <TabsTrigger value="unregistered">Add New Doctor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="registered" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="doctor_id">Doctor ID *</Label>
              <Input
                id="doctor_id"
                type="number"
                placeholder="Enter existing doctor ID"
                value={registeredDoctorId}
                onChange={(e) => setRegisteredDoctorId(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">
                Enter the ID of a doctor already registered in the system
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="unregistered" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                placeholder="Doctor's full name"
                value={unregisteredData.full_name}
                onChange={(e) => setUnregisteredData({ ...unregisteredData, full_name: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="specialist_name">Specialization *</Label>
              <Input
                id="specialist_name"
                placeholder="e.g., Cardiologist, Neurologist"
                value={unregisteredData.specialist_name}
                onChange={(e) => setUnregisteredData({ ...unregisteredData, specialist_name: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone_number">Phone Number *</Label>
              <Input
                id="phone_number"
                placeholder="Doctor's phone number"
                value={unregisteredData.phone_number}
                onChange={(e) => setUnregisteredData({ ...unregisteredData, phone_number: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="Clinic/Hospital address"
                value={unregisteredData.address}
                onChange={(e) => setUnregisteredData({ ...unregisteredData, address: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="license_number">License Number *</Label>
              <Input
                id="license_number"
                placeholder="Medical license number"
                value={unregisteredData.license_number}
                onChange={(e) => setUnregisteredData({ ...unregisteredData, license_number: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="profile_image">Profile Image</Label>
              <Input
                id="profile_image"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "profile_image")}
                className="mt-1"
              />
              {unregisteredData.profile_image && (
                <img src={unregisteredData.profile_image} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />
              )}
            </div>
            
            <div>
              <Label htmlFor="license_document">License Document</Label>
              <Input
                id="license_document"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleImageUpload(e, "license_document")}
                className="mt-1"
              />
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700">
                ℹ️ This doctor will be added as unregistered and will require admin approval before they can receive online bookings.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-[#00B0D0]">
            {loading ? "Adding..." : "Add Doctor"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}