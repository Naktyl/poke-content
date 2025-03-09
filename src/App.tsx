import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact, ColDef } from "ag-grid-react";
import { useEffect, useState } from "react";
import BoosterCellRenderer from "./components/BoosterCellRenderer";
import ProductNameRenderer from "./components/ProductNameRenderer";
import { boosters } from "./data/boosters";
import { items } from "./data/items";

ModuleRegistry.registerModules([AllCommunityModule]);

// Dynamically generate allBoosterNames from the boosters object
const allBoosterNames = Object.keys(boosters);

function App() {
  const [gridApi, setGridApi] = useState(null);
  const [selectedBoosters, setSelectedBoosters] = useState<string[]>([]);

  const getFullBoosters = (itemBoosters) =>
    itemBoosters.map(({ id, count }) => ({ ...boosters[id], id, count }));

  const formattedItems = items
    .map((item) => ({
      ...item,
      boosters: getFullBoosters(item.boosters),
      // Round to 2 decimal places but keep as number
      pricePerBooster: Math.round((item.msrp / item.boosterCount) * 100) / 100,
    }))
    .reverse(); // Reverse the order so newest items appear first

  // AG Grid API Reference
  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  // External Filter Functions for AG Grid
  const isExternalFilterPresent = () => selectedBoosters.length > 0;

  const doesExternalFilterPass = (node) => {
    console.log("external filter", node);
    const itemBoosters = node.data.boosters.map((b) => b.id);
    console.log("itemBoosters", itemBoosters);
    return selectedBoosters.every((booster) => itemBoosters.includes(booster)); // AND Filtering
  };

  // Handle checkbox changes
  const handleCheckboxChange = (booster) => {
    setSelectedBoosters(
      (prev) =>
        prev.includes(booster)
          ? prev.filter((b) => b !== booster) // Remove if unchecked
          : [...prev, booster] // Add if checked
    );
  };

  // Apply external filter when checkboxes change
  useEffect(() => {
    if (gridApi) gridApi.onFilterChanged();
  }, [selectedBoosters, gridApi]);

  // Column Definitions: Defines the columns to be displayed.
  const [columns, setColumns] = useState<ColDef[]>([
    {
      headerName: "Produit",
      field: "name",
      cellRenderer: ProductNameRenderer,
      autoHeight: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Prix retail",
      field: "msrp",
      wrapHeaderText: true,
      autoHeaderHeight: true,
      sortable: true, // Enable numeric sorting
      filter: "agNumberColumnFilter", // Numeric filter
    },
    {
      headerName: "Prix par booster",
      field: "pricePerBooster",
      valueFormatter: (params: { value: number }) =>
        params.value.toFixed(2) + "€", // Format for display
      wrapHeaderText: true,
      autoHeaderHeight: true,
      sortable: true, // Enable numeric sorting
      filter: "agNumberColumnFilter", // Numeric filter
    },
    {
      headerName: "Boosters",
      field: "boosters",
      cellRenderer: BoosterCellRenderer,
      autoHeight: true, // Ensure the cell adjusts its height
      sortable: false,
    },
  ]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold">PokePack Finder</h1>

      {/* Custom Booster Checkbox Filters */}
      <div className="mb-4 border p-2 rounded bg-gray-100">
        <p className="font-semibold">Filtrer par booster:</p>
        <div className="flex flex-wrap gap-2">
          {allBoosterNames.map((booster) => (
            <label key={booster} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedBoosters.includes(booster)}
                onChange={() => handleCheckboxChange(booster)}
              />
              {booster}
            </label>
          ))}
        </div>
      </div>

      <div
        className="ag-theme-alpine"
        style={{ height: "100vh", width: "100%" }}
      >
        <AgGridReact
          rowData={formattedItems}
          columnDefs={columns}
          domLayout="autoHeight"
          onGridReady={onGridReady}
          isExternalFilterPresent={isExternalFilterPresent}
          doesExternalFilterPass={doesExternalFilterPass}
          onFirstDataRendered={(params) => params.api.sizeColumnsToFit()}
        />
      </div>
    </div>
  );
}

export default App;
