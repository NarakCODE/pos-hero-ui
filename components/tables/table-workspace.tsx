"use client";

import { useState } from "react";
import { POSLayout } from "@/components/shared/pos-layout";
import { TableAside } from "./table-aside";
import { TableFloor } from "./table-floor";
import { floorTables, type FloorTable, type TableBooking } from "./table-data";

interface TableWorkspaceProps {
  asideLabel: string;
  headerTitle: string;
}

export function TableWorkspace({
  asideLabel,
  headerTitle,
}: TableWorkspaceProps) {
  const [tables, setTables] = useState<FloorTable[]>(floorTables);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const selectedTable =
    tables.find((table) => table.id === selectedTableId) ?? null;

  const handleTableSelect = (tableId: string) => {
    setSelectedTableId((currentTableId) =>
      currentTableId === tableId ? null : tableId,
    );
  };

  const handleBook = (tableId: string, bookings: TableBooking[]) => {
    setTables((currentTables) =>
      currentTables.map((table) =>
        table.id === tableId ? { ...table, bookings } : table,
      ),
    );
  };

  return (
    <POSLayout
      showSearch={false}
      headerTitle={headerTitle}
      rightPanelLabel={asideLabel}
      rightPanelClassName="overflow-hidden"
      rightPanel={
        <TableAside
          key={selectedTable?.id ?? "empty"}
          table={selectedTable}
          onBook={handleBook}
          onCancel={() => setSelectedTableId(null)}
        />
      }
    >
      <TableFloor
        tables={tables}
        selectedTableId={selectedTableId}
        onTableSelect={handleTableSelect}
      />
    </POSLayout>
  );
}
