"use client";

import * as React from "react";
import Link from "next/link";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLoader,
  IconStarFilled,
  IconEdit,
  IconMail,
  IconCheck,
  IconX,
  IconUser,
  IconFileText,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Entities } from "@/services/api.services";

interface DataTableProps {
  data: any[];
  entityType: string;
  onDelete?: (id: number) => Promise<void>;
  onRefresh?: () => void;
  isAdmin?: boolean;
}

function DragHandle({ id }: { id: number | string }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-accent cursor-grab active:cursor-grabbing"
    >
      <IconGripVertical className="size-4" />
    </Button>
  );
}

function DraggableRow({ row }: { row: Row<any> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    position: "relative",
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && "selected"}
      className={
        isDragging
          ? "opacity-50 bg-muted/50"
          : "bg-card hover:bg-muted/50 transition-colors"
      }
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className="border-border">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({
  data: initialData,
  entityType,
  onDelete,
  onRefresh,
  isAdmin,
}: DataTableProps) {
  const safeInitialData = React.useMemo(
    () => (Array.isArray(initialData) ? initialData : []),
    [initialData],
  );
  const [data, setData] = React.useState(safeInitialData);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editingEntity, setEditingEntity] = React.useState<any>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [editForm, setEditForm] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    setData(Array.isArray(initialData) ? initialData : []);
  }, [initialData]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  );

  const isDoctorLike = entityType === "doctors" || entityType === "un-doctors";
  const isClinic = entityType === "clincs";
  const isHospital = entityType === "hospitals";
  const isLab = entityType === "labs";

  const openEditModal = (entity: any) => {
    setEditingEntity(entity);

    const baseFields = {
      name: isDoctorLike ? entity.full_name : entity.name,
      address: entity.address || "",
      phone: isDoctorLike ? entity.phone_number : entity.phone || "",
      email: entity.email || "",
      description: entity.description || "",
    };

    if (isDoctorLike) {
      setEditForm({
        ...baseFields,
        is_verified: entity.is_verified || false,
        allow_online_booking: entity.allow_online_booking || false,
        specialist: entity.specialist?.id || "",
      });
    } else {
      setEditForm(baseFields);
    }

    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingEntity) return;
    setSubmitting(true);

    try {
      let payload: any = {};

      if (isDoctorLike) {
        payload = {
          full_name: editForm.name,
          phone_number: editForm.phone,
          address: editForm.address,
          email: editForm.email,
          description: editForm.description,
          is_verified: editForm.is_verified,
        };
        if (entityType === "un-doctors") {
          payload.allow_online_booking = editForm.allow_online_booking;
        }
        if (editForm.specialist) {
          payload.specialist_id = editForm.specialist;
        }
      } else {
        payload = {
          name: editForm.name,
          address: editForm.address,
          phone: editForm.phone,
          email: editForm.email,
          description: editForm.description,
        };
      }

      await Entities.updateEntityBasicInfo(
        entityType,
        editingEntity.id,
        payload,
      );
      toast.success("Entity updated successfully.");
      setEditModalOpen(false);

      if (onRefresh) {
        onRefresh();
      } else {
        setData((prev) =>
          prev.map((item) =>
            item.id === editingEntity.id
              ? {
                  ...item,
                  ...(isDoctorLike
                    ? {
                        full_name: editForm.name,
                        phone_number: editForm.phone,
                        is_verified: editForm.is_verified,
                        allow_online_booking: editForm.allow_online_booking,
                      }
                    : {
                        name: editForm.name,
                        phone: editForm.phone,
                      }),
                  address: editForm.address,
                  email: editForm.email,
                  description: editForm.description,
                }
              : item,
          ),
        );
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update entity.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = React.useMemo<ColumnDef<any>[]>(() => {
    const baseColumns: ColumnDef<any>[] = [
      {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
      },
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
      },
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground/60">
            #{row.original.id}
          </span>
        ),
      },
    ];

    // Image/Avatar column
    baseColumns.push({
      id: "image",
      header: "",
      cell: ({ row }) => {
        let imageUrl: string | null = null;
        const entity = row.original;

        if (isDoctorLike) {
          imageUrl = entity.profile_image || null;
        } else if (isClinic || isHospital || isLab) {
          imageUrl = entity.image_url || entity.image || null;
        }

        return (
          <div className="flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={isDoctorLike ? entity.full_name : entity.name}
                className="h-8 w-8 rounded-full object-cover border border-border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <IconUser className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        );
      },
    });

    // Name column
    baseColumns.push({
      accessorKey: isDoctorLike ? "full_name" : "name",
      header: "Name",
      cell: ({ row }) => {
        const name = isDoctorLike ? row.original.full_name : row.original.name;
        return (
          <Link
            href={`/entities/${entityType}/${row.original.id}`}
            className="font-bold text-primary hover:opacity-80 transition-opacity"
          >
            {name || "Unnamed Entity"}
          </Link>
        );
      },
    });

    // Specialist column (doctors/un-doctors)
    if (isDoctorLike) {
      baseColumns.push({
        accessorKey: "specialist",
        header: "Specialization",
        cell: ({ row }) => {
          const specialist = row.original.specialist;
          return (
            <span className="text-sm text-muted-foreground">
              {specialist?.name || "—"}
            </span>
          );
        },
      });
    }

    // Email column (clinics, hospitals, labs)
    if (isClinic || isHospital || isLab) {
      baseColumns.push({
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <IconMail className="size-3.5" />
            {row.original.email || "—"}
          </div>
        ),
      });
    }

    // Phone column
    baseColumns.push({
      accessorKey: isDoctorLike ? "phone_number" : "phone",
      header: "Phone",
      cell: ({ row }) => {
        const phone = isDoctorLike
          ? row.original.phone_number
          : row.original.phone;
        return (
          <span className="text-foreground text-sm font-medium">
            {phone || "—"}
          </span>
        );
      },
    });

    // Address column
    baseColumns.push({
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <span className="truncate max-w-[180px] block text-muted-foreground text-xs">
          {row.original.address || "No address provided"}
        </span>
      ),
    });

    // License column (doctors/un-doctors) with URL fix
    if (isDoctorLike) {
      baseColumns.push({
        id: "license",
        header: "License",
        cell: ({ row }) => {
          const licenseNumber = row.original.license_number;
          const licenseDoc = row.original.license_document;
          let docUrl: string | null = null;

          if (licenseDoc) {
            if (typeof licenseDoc === "string") {
              const rawStr = licenseDoc.trim();

              // 1. Check if the string CONTAINS a protocol (http:/ or https:/) anywhere
              const protocolMatch = rawStr.match(/https?:\/+/);

              if (protocolMatch) {
                // It's a full URL (possibly mangled). Extract from the start of the protocol.
                const startIndex = rawStr.indexOf(protocolMatch[0]);
                const extractedUrl = rawStr.substring(startIndex);

                // Fix malformed URLs like "http:/res.cloudinary..." -> "http://res.cloudinary..."
                docUrl = extractedUrl.replace(/^(https?):\/(?!\/)/, "$1://");
              } else {
                // 2. It's just a public ID; use the Cloudinary base URL
                // We also strip "image/upload/" if it exists at the start of the ID to prevent double paths
                const cleanId = rawStr.replace(/^image\/upload\//, "");
                docUrl = `https://res.cloudinary.com/drswiflul/image/upload/${cleanId}`;
              }
            } else if (licenseDoc.url) {
              // Cloudinary object with .url
              docUrl = licenseDoc.url;
            }
          }

          return (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">
                {licenseNumber || "—"}
              </span>
              {docUrl && (
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <IconFileText className="size-3" />
                  View Document
                </a>
              )}
            </div>
          );
        },
      });
    }
    // Rating column (non-doctor)
    if (!isDoctorLike) {
      baseColumns.push({
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
          const rating = row.original.rating;
          const numericRating =
            typeof rating === "number" ? rating : Number(rating);
          const displayRating = !isNaN(numericRating)
            ? numericRating.toFixed(1)
            : "0.0";
          return (
            <div className="flex items-center gap-1.5 bg-muted/50 w-fit px-2 py-1 rounded-lg border border-border">
              <IconStarFilled className="size-3 text-amber-400" />
              <span className="text-xs font-bold text-foreground">
                {displayRating}
              </span>
            </div>
          );
        },
      });
    }

    // Status column (doctors/un-doctors)
    if (isDoctorLike) {
      baseColumns.push({
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const isVerified = row.original.is_verified;
          const allowOnline = row.original.allow_online_booking;
          return (
            <div className="flex flex-col gap-1">
              <Badge
                variant="secondary"
                className={`gap-1.5 py-1 px-3 rounded-full border-none ${
                  isVerified
                    ? "bg-green-500/10 text-green-500"
                    : "bg-amber-500/10 text-amber-500"
                }`}
              >
                {isVerified ? (
                  <IconCircleCheckFilled className="size-3.5" />
                ) : (
                  <IconLoader className="size-3.5 animate-spin" />
                )}
                {isVerified ? "Verified" : "Pending"}
              </Badge>
              {entityType === "un-doctors" && (
                <Badge
                  variant="outline"
                  className={`gap-1 text-xs ${
                    allowOnline
                      ? "bg-blue-500/10 text-blue-500 border-blue-200"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {allowOnline ? (
                    <IconCheck className="size-3" />
                  ) : (
                    <IconX className="size-3" />
                  )}
                  Online Booking {allowOnline ? "Allowed" : "Not Allowed"}
                </Badge>
              )}
            </div>
          );
        },
      });
    }

    const actionsColumn: ColumnDef<any> = {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 rounded-full">
              <IconDotsVertical className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl p-2 min-w-[160px]"
          >
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
              <Link href={`/entities/${entityType}/${row.original.id}`}>
                View Profile
              </Link>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuItem
                  className="rounded-lg cursor-pointer"
                  onClick={() => openEditModal(row.original)}
                >
                  <IconEdit size={14} className="mr-2" /> Edit Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive font-semibold rounded-lg cursor-pointer"
                  onClick={() => onDelete?.(row.original.id)}
                >
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    };

    return [...baseColumns, actionsColumn];
  }, [
    entityType,
    isAdmin,
    onDelete,
    isDoctorLike,
    isClinic,
    isHospital,
    isLab,
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id.toString(),
  });

  const dataIds = React.useMemo(
    () => (Array.isArray(data) ? data.map((d) => d.id) : []),
    [data],
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <div className="rounded-[1.5rem] border border-border bg-card shadow-sm overflow-x-auto">
          <SortableContext
            items={dataIds}
            strategy={verticalListSortingStrategy}
          >
            <Table>
              <TableHeader className="bg-muted/30">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent border-b border-border"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="h-12 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table
                    .getRowModel()
                    .rows.map((row) => <DraggableRow key={row.id} row={row} />)
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-32 text-center text-muted-foreground italic"
                    >
                      No {entityType} entries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </SortableContext>
        </div>
      </DndContext>

      {/* Dynamic Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Edit {entityType.slice(0, -1)} Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-foreground">
                {isDoctorLike ? "Full Name" : "Name"}
              </Label>
              <Input
                id="edit-name"
                value={editForm.name || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="rounded-xl bg-background border-border"
              />
            </div>

            {/* Email - for non-doctor entities */}
            {(isClinic || isHospital || isLab) && (
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="rounded-xl bg-background border-border"
                />
              </div>
            )}

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="text-foreground">
                Phone
              </Label>
              <Input
                id="edit-phone"
                value={editForm.phone || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                className="rounded-xl bg-background border-border"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="edit-address" className="text-foreground">
                Address
              </Label>
              <Input
                id="edit-address"
                value={editForm.address || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
                className="rounded-xl bg-background border-border"
              />
            </div>

            {/* Description - for clinics, hospitals, labs */}
            {(isClinic || isHospital || isLab) && (
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                  className="rounded-xl bg-background border-border"
                />
              </div>
            )}

            {/* Doctor-specific fields */}
            {isDoctorLike && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-specialist" className="text-foreground">
                    Specialization
                  </Label>
                  <Input
                    id="edit-specialist"
                    value={editForm.specialist || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, specialist: e.target.value })
                    }
                    placeholder="Specialist ID"
                    className="rounded-xl bg-background border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter specialist ID (future: dropdown)
                  </p>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="edit-is_verified"
                    checked={editForm.is_verified || false}
                    onCheckedChange={(checked) =>
                      setEditForm({ ...editForm, is_verified: !!checked })
                    }
                  />
                  <Label
                    htmlFor="edit-is_verified"
                    className="text-foreground font-normal cursor-pointer"
                  >
                    Verified
                  </Label>
                </div>

                {entityType === "un-doctors" && (
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="edit-allow_online_booking"
                      checked={editForm.allow_online_booking || false}
                      onCheckedChange={(checked) =>
                        setEditForm({
                          ...editForm,
                          allow_online_booking: !!checked,
                        })
                      }
                    />
                    <Label
                      htmlFor="edit-allow_online_booking"
                      className="text-foreground font-normal cursor-pointer"
                    >
                      Allow Online Booking
                    </Label>
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              className="rounded-full border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={submitting}
              className="rounded-full bg-primary text-primary-foreground hover:opacity-90"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
