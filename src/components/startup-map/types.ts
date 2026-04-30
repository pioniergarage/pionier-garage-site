export interface StartupMapEntry {
  collectionId: string;
  collectionName: string;
  name: String;
  id: String;
  websiteUrl: String;
  bannerImageUrl: String;
  expand: StartupMapEntry_Translations[];
}

export interface StartupMapEntry_Translations {
    collectionId: string;
  collectionName: string;
  locale: String;
  id: String;
  description: String;
}

export interface StartupMapMilestone {
  collectionId: string;
  collectionName: string;
  name: string;
  id: string;
  order: number;
  expand: StartupMapMilestone_Translations[];
}

export interface StartupMapMilestone_Translations {
  collectionId: string;
  collectionName: string;
  locale: string;
  id: string;
  name: string;
}

export interface StartupMapCategory {
  collectionId: string;
  collectionName: string;
  name: string;
  id: string;
  color: string;
  expand: StartupMapCategory_Translations[];
}

export interface StartupMapCategory_Translations {
  collectionId: string;
  collectionName: string;
  locale: string;
  id: string;
  name: string;
}

export interface StartupMapViewEntry {
  id: string;
  name: string;
  description?: string;
  category: {
    name: string;
    color?: string;
  };
}

export interface StartupMapViewMilestone {
  id: string;
  name: string;
  entries: StartupMapViewEntry[];
}
