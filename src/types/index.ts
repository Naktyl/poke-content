// Shared Types for the application

// Base booster interface from boosters.ts
export interface IBooster {
  icon: string;
  name: string;
}

// Booster with additional properties for rendering/usage
export interface Booster extends IBooster {
  id: string;
  count: number;
}

// Represents a minimal booster reference in an item
export interface ItemBooster {
  id: string;
  count: number;
}

// Product data shared between ProductNameRenderer and other components
export interface ProductData {
  image: string;
  name: string;
}

// Complete item data structure with processed boosters
export interface ItemData {
  id: number;
  name: string;
  image: string;
  msrp: number;
  boosterCount: number;
  pricePerBooster: number;
  boosters: Booster[];
  [key: string]: any; // For other item properties
}

// Raw item data as stored in the data file
export interface RawItemData {
  id: number;
  name: string;
  image: string;
  msrp: number;
  boosterCount: number;
  boosters: ItemBooster[];
}

// Props for the ProductNameRenderer component
export interface ProductNameRendererProps {
  data: ProductData;
}

// Props for the BoosterCellRenderer component
export interface BoosterCellRendererProps {
  data: {
    boosters: Booster[];
  };
}