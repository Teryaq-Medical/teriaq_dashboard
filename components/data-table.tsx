// components/data-table.tsx
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
      className="text-muted-foreground size-7 hover:bg-transparent cursor-grab active:cursor-grabbing"
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
      className={isDragging ? "opacity-50 bg-muted/50" : ""}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({ data: initialData, entityType, onDelete, onRefresh, isAdmin }: DataTableProps) {
  const safeInitialData = React.useMemo(() => (Array.isArray(initialData) ? initialData : []), [initialData]);
  const [data, setData] = React.useState(safeInitialData);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editingEntity, setEditingEntity] = React.useState<any>(null);
  const [editForm, setEditForm] = React.useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    is_verified: false,
  });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setData(Array.isArray(initialData) ? initialData : []);
  }, [initialData]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const openEditModal = (entity: any) => {
    setEditingEntity(entity);
    const isDoctor = entityType === "doctors";
    setEditForm({
      name: isDoctor ? entity.full_name : entity.name,
      address: entity.address || "",
      phone: isDoctor ? entity.phone_number : entity.phone,
      email: entity.email || "",
      description: entity.description || "",
      is_verified: isDoctor ? entity.is_verified : false,
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingEntity) return;
    setSubmitting(true);
    try {
      const isDoctor = entityType === "doctors";
      const payload: any = {
        name: editForm.name,
        address: editForm.address,
        phone: editForm.phone,
        email: editForm.email,
        description: editForm.description,
      };
      if (isDoctor) {
        payload.is_verified = editForm.is_verified;
      }
      await Entities.updateEntityBasicInfo(entityType, editingEntity.id, payload);
      toast.success("Entity updated successfully.");
      setEditModalOpen(false);
      if (onRefresh) onRefresh();
      else {
        setData((prev) =>
          prev.map((item) =>
            item.id === editingEntity.id
              ? {
                  ...item,
                  ...(isDoctor
                    ? { full_name: editForm.name, phone_number: editForm.phone, is_verified: editForm.is_verified }
                    : { name: editForm.name, phone: editForm.phone }),
                  address: editForm.address,
                  email: editForm.email,
                  description: editForm.description,
                }
              : item
          )
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
    const isDoctor = entityType === "doctors";

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
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
        cell: ({ row }) => <span className="font-mono text-xs text-slate-400">#{row.original.id}</span>,
      },
      {
        accessorKey: isDoctor ? "full_name" : "name",
        header: "Name",
        cell: ({ row }) => {
          const name = isDoctor ? row.original.full_name : row.original.name;
          return (
            <Link
              href={`/entities/${entityType}/${row.original.id}`}
              className="font-bold text-[#00B0D0] hover:text-[#21b3d5] transition-colors"
            >
              {name || "Unnamed Entity"}
            </Link>
          );
        },
      },
      {
        accessorKey: isDoctor ? "phone_number" : "phone",
        header: "Phone",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm font-medium">
            {(isDoctor ? row.original.phone_number : row.original.phone) || "—"}
          </span>
        ),
      },
      {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => (
          <span className="truncate max-w-[180px] block text-slate-500 text-xs">
            {row.original.address || "No address provided"}
          </span>
        ),
      },
      {
        id: "status_rating",
        header: isDoctor ? "Status" : "Rating",
        cell: ({ row }) => {
          if (isDoctor) {
            const isVerified = row.original.is_verified;
            return (
              <Badge
                variant="secondary"
                className={`gap-1.5 py-1 px-3 rounded-full border-none ${
                  isVerified ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                }`}
              >
                {isVerified ? (
                  <IconCircleCheckFilled className="size-3.5" />
                ) : (
                  <IconLoader className="size-3.5 animate-spin" />
                )}
                {isVerified ? "Verified" : "Pending"}
              </Badge>
            );
          }
          // For labs, clinics, hospitals – show rating
          const rating = row.original.rating || "0.0";
          return (
            <div className="flex items-center gap-1.5 bg-slate-50 w-fit px-2 py-1 rounded-lg border border-slate-100">
              <IconStarFilled className="size-3 text-amber-400" />
              <span className="text-xs font-bold text-slate-700">{rating}</span>
            </div>
          );
        },
      },
    ];

    const actionsColumn: ColumnDef<any> = {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 rounded-full">
              <IconDotsVertical className="size-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl p-2 min-w-[160px]">
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
              <Link href={`/entities/${entityType}/${row.original.id}`}>View Profile</Link>
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
  }, [entityType, isAdmin, onDelete]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id.toString(),
  });

  const dataIds = React.useMemo(() => (Array.isArray(data) ? data.map((d) => d.id) : []), [data]);

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

  const isDoctor = entityType === "doctors";

  return (
    <>
      <DndContext collisionDetection={closestCenter} sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="rounded-[1.5rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
          <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
            <Table>
              <TableHeader className="bg-slate-50/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-slate-100">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="h-12 text-[10px] font-bold uppercase tracking-widest text-slate-400"
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => <DraggableRow key={row.id} row={row} />)
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center text-slate-400 italic">
                      No {entityType} entries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </SortableContext>
        </div>
      </DndContext>

      {/* Edit Entity Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit {entityType.slice(0, -1)} Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
                className="rounded-xl"
              />
            </div>
            {isDoctor && (
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="edit-is_verified"
                  checked={editForm.is_verified}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, is_verified: !!checked })}
                />
                <Label htmlFor="edit-is_verified" className="text-slate-700 font-normal cursor-pointer">
                  Verified
                </Label>
                <p className="text-xs text-slate-400 ml-2">(Mark as verified doctor)</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)} className="rounded-full">Cancel</Button>
            <Button onClick={handleEditSubmit} disabled={submitting} className="rounded-full bg-[#00B0D0] hover:bg-[#21b3d5]">
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}