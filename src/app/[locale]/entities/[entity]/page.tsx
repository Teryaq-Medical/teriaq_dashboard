"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { DataTable } from "@/components/data-table";
import { Entities } from "@/services/api.services";
import { AuthService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import api from "@/services/api";
import { useTranslations } from "next-intl";

export default function EntitiesPage() {
  const params = useParams();
  const entity = params?.entity as string;

  const t = useTranslations("entities");      // for page-level strings
  const tableT = useTranslations("table");    // for table columns & modals

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
    name: "",
    address: "",
    phone: "",
    email_entity: "",
    description: "",
    image: "",
    license_number: "",
    profile_image: "",
    license_document: "",
    specialist_name: "",
    is_verified: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  const fetchEntities = async () => {
    setLoading(true);
    try {
      let result;
      if (entity === "un-doctors") {
        const res = await api.get("/un-doctors/");
        // extract nested data array – adapt to your API structure
        result = res.data?.data || [];
      } else {
        result = await Entities.getEntities(entity);
      }
      setData(result);
    } catch (err) {
      console.error(`Failed to fetch ${entity}:`, err);
      setData([]);
      toast.error(t("failedToLoad", { entity }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entity) fetchEntities();
  }, [entity]);

  const handleFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await handleFileToBase64(file);
      setFormData({ ...formData, [field]: base64 });
    }
  };

  const handleAddEntity = async () => {
    setSubmitting(true);
    try {
      let payload: any = {};
      const isDoctor = entity === "doctors";

      if (isDoctor) {
        payload = {
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          address: formData.address,
          license_number: formData.license_number,
          specialist_name: formData.specialist_name,
          profile_image: formData.profile_image || "",
          license_document: formData.license_document || "",
          is_verified: formData.is_verified,
        };
        if (
          !payload.email ||
          !payload.password ||
          !payload.full_name ||
          !payload.phone_number ||
          !payload.address ||
          !payload.license_number ||
          !payload.specialist_name
        ) {
          toast.error(t("fillAllRequired"));
          return;
        }
      } else {
        payload = {
          user_email: formData.email,
          user_full_name: formData.full_name,
          user_phone: formData.phone_number,
          password: formData.password,
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          email: formData.email_entity,
          description: formData.description,
          image: formData.image || "",
        };
        if (
          !payload.user_email ||
          !payload.password ||
          !payload.user_full_name ||
          !payload.user_phone ||
          !payload.name
        ) {
          toast.error(t("fillAllRequired"));
          return;
        }
      }

      await Entities.createEntity(entity, payload);
      toast.success(
        isDoctor
          ? t("addSuccessDoctor")
          : t("addSuccessOther", { entity: entity.slice(0, -1) }),
      );
      setShowAddModal(false);
      // Reset form
      setFormData({
        email: "",
        password: "",
        full_name: "",
        phone_number: "",
        name: "",
        address: "",
        phone: "",
        email_entity: "",
        description: "",
        image: "",
        license_number: "",
        profile_image: "",
        license_document: "",
        specialist_name: "",
        is_verified: false,
      });
      fetchEntities();
    } catch (error: any) {
      console.error("Creation error:", error);
      toast.error(error.response?.data?.error || t("failedToCreate"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntity = async (id: number) => {
    const entityLabel = entity === "un-doctors" ? "Unregistered Doctor" : entity.slice(0, -1);
    if (!confirm(t("deleteConfirmation", { entity: entityLabel }))) return;
    try {
      if (entity === "un-doctors") {
        await api.delete(`/un-doctors/${id}/`);
      } else {
        await Entities.deleteEntity(entity, id);
      }
      toast.success(t("deleteSuccess"));
      fetchEntities();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || t("failedToDelete"));
    }
  };

  const isAdmin =
    currentUser?.is_superuser || currentUser?.user_type === "admin";
  const isDoctor = entity === "doctors" || entity === "un-doctors";
  const showAddButton = isAdmin && entity !== "un-doctors";

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200"></div>
        <div className="w-12 h-12 rounded-full border-4 border-t-[#00B0D0] border-r-transparent border-b-transparent border-l-transparent absolute top-0 left-0 animate-spin"></div>
      </div>
    </div>
  );

  // Build page title dynamically
  const pageTitle =
    entity === "un-doctors"
      ? `${t("manage")} ${"Unregistered Doctors"}`
      : `${t("manage")} ${entity}`;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold capitalize text-foreground">
                {pageTitle}
              </h1>
              {showAddButton && (
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="gap-1 rounded-full bg-[#00B0D0] hover:bg-[#21b3d5] shadow-md"
                >
                  <PlusIcon className="h-4 w-4" /> {t("addNew")}
                </Button>
              )}
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <DataTable
                data={data}
                entityType={entity}
                onDelete={handleDeleteEntity}
                isAdmin={isAdmin}
              />
            )}
          </div>
        </div>
      </SidebarInset>

      {/* Add Entity Modal */}
      {showAddButton && (
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border-0 shadow-2xl p-0">
            <DialogHeader className="p-6 border-b border-slate-100">
              <DialogTitle className="text-xl font-bold text-slate-800">
                {isDoctor
                  ? `${t("addNew")} ${t("doctorDetails")}`
                  : `${t("addNew")} ${entity.slice(0, -1)}`}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-6">
              {/* User Account Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#00B0D0] rounded-full"></span>
                  {t("userAccount")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-600">
                      {t("email")} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="user@example.com"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-600">
                      {t("password")} *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-slate-600">
                      {t("fullName")} *
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="text-slate-600">
                      {t("phoneNumber")} *
                    </Label>
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone_number: e.target.value,
                        })
                      }
                      placeholder="+1234567890"
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Entity Details Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#00B0D0] rounded-full"></span>
                  {isDoctor
                    ? t("doctorDetails")
                    : t("entityDetails", { entity: entity.slice(0, -1) })}
                </h3>
                {isDoctor ? (
                  <div className="space-y-4">
                    {/* Address */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="text-slate-600">
                        {t("address")} *
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Clinic/Hospital address"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="license_number" className="text-slate-600">
                          {t("licenseNumber")} *
                        </Label>
                        <Input
                          id="license_number"
                          value={formData.license_number}
                          onChange={(e) =>
                            setFormData({ ...formData, license_number: e.target.value })
                          }
                          placeholder="Medical license number"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialist_name" className="text-slate-600">
                          {t("specialization")} *
                        </Label>
                        <Input
                          id="specialist_name"
                          value={formData.specialist_name}
                          onChange={(e) =>
                            setFormData({ ...formData, specialist_name: e.target.value })
                          }
                          placeholder="e.g., Cardiologist"
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="profile_image" className="text-slate-600">
                          {t("profileImage")}
                        </Label>
                        <Input
                          id="profile_image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "profile_image")}
                          className="rounded-xl"
                        />
                        {formData.profile_image && (
                          <img
                            src={formData.profile_image}
                            alt="Preview"
                            className="mt-2 w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license_document" className="text-slate-600">
                          {t("licenseDocument")}
                        </Label>
                        <Input
                          id="license_document"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleImageUpload(e, "license_document")}
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    {/* Verified Checkbox */}
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="is_verified"
                        checked={formData.is_verified}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_verified: !!checked })
                        }
                      />
                      <Label
                        htmlFor="is_verified"
                        className="text-slate-700 font-normal cursor-pointer"
                      >
                        {t("markAsVerified")}
                      </Label>
                      <p className="text-xs text-slate-400 ml-2">
                        {t("verifiedHelp")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="name" className="text-slate-600">
                        {t("entityName")} *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Sunshine Hospital"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address_entity" className="text-slate-600">
                        {t("address")}
                      </Label>
                      <Input
                        id="address_entity"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="123 Main St"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone_entity" className="text-slate-600">
                        {t("phone")}
                      </Label>
                      <Input
                        id="phone_entity"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="(555) 123-4567"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email_entity" className="text-slate-600">
                        {t("email")}
                      </Label>
                      <Input
                        id="email_entity"
                        type="email"
                        value={formData.email_entity}
                        onChange={(e) =>
                          setFormData({ ...formData, email_entity: e.target.value })
                        }
                        placeholder="contact@sunshine.com"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description" className="text-slate-600">
                        {t("description")}
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Brief description..."
                        rows={3}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image" className="text-slate-600">
                        {t("logoImage")}
                      </Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "image")}
                        className="rounded-xl"
                      />
                      {formData.image && (
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="mt-2 w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="p-6 bg-slate-50 rounded-b-2xl">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="rounded-full px-6 border-slate-300 text-slate-600 hover:bg-slate-100"
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={handleAddEntity}
                disabled={submitting}
                className="rounded-full px-6 bg-[#00B0D0] hover:bg-[#21b3d5] shadow-md"
              >
                {submitting ? t("creating") : t("create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </SidebarProvider>
  );
}