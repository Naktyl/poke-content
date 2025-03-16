import { AllCommunityModule, ModuleRegistry, ColDef, GridApi, IRowNode } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import BoosterCellRenderer from "./components/BoosterCellRenderer";
import ProductNameRenderer from "./components/ProductNameRenderer";
import { boosters } from "./data/boosters";
import { items } from "./data/items";
import { Booster, ItemBooster, ItemData } from "./types";

ModuleRegistry.registerModules([AllCommunityModule]);

// Dynamically generate allBoosterNames from the boosters object
const allBoosterNames = Object.keys(boosters);

// Group boosters by their series prefix
const svBoosters = allBoosterNames.filter((id) => id.startsWith("sv"));
const swshBoosters = allBoosterNames.filter((id) => id.startsWith("swsh"));
const smBoosters = allBoosterNames.filter((id) => id.startsWith("sm"));

function App() {
  // Define grid API type
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [selectedBoosters, setSelectedBoosters] = useState<string[]>([]);

  const getFullBoosters = (itemBoosters: ItemBooster[]): Booster[] =>
    itemBoosters.map(({ id, count }) => ({ 
      ...boosters[id], 
      id, 
      count 
    }));

  const formattedItems = items
    .map((item) => ({
      ...item,
      boosters: getFullBoosters(item.boosters),
      // Round to 2 decimal places but keep as number
      pricePerBooster: Math.round((item.msrp / item.boosterCount) * 100) / 100,
    }))
    .reverse(); // Reverse the order so newest items appear first

  // AG Grid API Reference
  const onGridReady = (params: {
    api: GridApi;
  }) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  // External Filter Functions for AG Grid
  const isExternalFilterPresent = (): boolean => selectedBoosters.length > 0;
  
  const doesExternalFilterPass = (node: IRowNode<ItemData>): boolean => {
    // Check if data exists before accessing it
    if (!node.data) return false;
    
    const itemBoosters = node.data.boosters.map((b) => b.id);
    return selectedBoosters.every((booster) => itemBoosters.includes(booster)); // AND Filtering
  };

  // Handle checkbox changes
  const handleCheckboxChange = (booster: string): void => {
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
  const [columns] = useState<ColDef[]>([
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
      hide: true, // Hide this column
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
      hide: true, // Hide this column
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
        <h2 className="font-semibold">Filtrer par booster</h2>

        {/* Scarlet & Violet Series Row */}
        <h3 className="text-lg font-semibold mt-2 mb-1">Ecarlate et Violet</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          {svBoosters.map((boosterId) => (
            <label
              key={boosterId}
              className="flex items-center gap-2 p-2 bg-white rounded-md border border-gray-200 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedBoosters.includes(boosterId)}
                onChange={() => handleCheckboxChange(boosterId)}
                className="w-4 h-4"
              />
              <img
                src={boosters[boosterId].icon}
                alt={boosters[boosterId].name}
                height="30"
                className="w-auto mx-1"
              />
              <span>{boosters[boosterId].name}</span>
            </label>
          ))}
        </div>

        {/* Sword & Shield Series Row */}
        <h3 className="text-lg font-semibold mt-2 mb-1">Epée et Bouclier</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          {swshBoosters.map((boosterId) => (
            <label
              key={boosterId}
              className="flex items-center gap-2 p-2 bg-white rounded-md border border-gray-200 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedBoosters.includes(boosterId)}
                onChange={() => handleCheckboxChange(boosterId)}
                className="w-4 h-4"
              />
              <img
                src={boosters[boosterId].icon}
                alt={boosters[boosterId].name}
                height="30"
                className="w-auto mx-1"
              />
              <span>{boosters[boosterId].name}</span>
            </label>
          ))}
        </div>

        {/* Sun & Moon Series Row */}
        <h3 className="text-lg font-semibold mt-2 mb-1">Soleil et Lune</h3>
        <div className="flex flex-wrap gap-3 mb-1">
          {smBoosters.map((boosterId) => (
            <label
              key={boosterId}
              className="flex items-center gap-2 p-2 bg-white rounded-md border border-gray-200 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedBoosters.includes(boosterId)}
                onChange={() => handleCheckboxChange(boosterId)}
                className="w-4 h-4"
              />
              <img
                src={boosters[boosterId].icon}
                alt={boosters[boosterId].name}
                height="30"
                className="w-auto mx-1"
              />
              <span>{boosters[boosterId].name}</span>
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
