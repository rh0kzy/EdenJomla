import { useCallback } from 'react';

export interface TooltipContent {
  dashboard: {
    title: string;
    description: string;
  };
  navigation: {
    dashboard: string;
    parfums: string;
    references: string;
    fournisseurs: string;
    clients: string;
    stock: string;
  };
  actions: {
    create: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
    reload: string;
  };
  form: {
    name: string;
    brand: string;
    description: string;
    price: string;
    quantity: string;
    supplier: string;
    client: string;
  };
  status: {
    loading: string;
    saving: string;
    error: string;
    success: string;
  };
}

const tooltipContent: TooltipContent = {
  dashboard: {
    title: "Tableau de bord principal",
    description: "Vue d'ensemble de votre inventaire et statistiques clés"
  },
  navigation: {
    dashboard: "Accéder au tableau de bord avec les statistiques générales",
    parfums: "Gérer votre catalogue de parfums",
    references: "Consulter et gérer les références produits",
    fournisseurs: "Gérer vos fournisseurs et leurs informations",
    clients: "Consulter et gérer votre base de clients",
    stock: "Voir et ajuster les niveaux de stock"
  },
  actions: {
    create: "Créer un nouvel élément",
    edit: "Modifier cet élément",
    delete: "Supprimer définitivement cet élément",
    save: "Enregistrer les modifications",
    cancel: "Annuler et revenir en arrière",
    reload: "Actualiser les données"
  },
  form: {
    name: "Nom complet du produit",
    brand: "Marque ou fabricant",
    description: "Description détaillée du produit",
    price: "Prix de vente unitaire",
    quantity: "Quantité en stock",
    supplier: "Fournisseur principal",
    client: "Informations client"
  },
  status: {
    loading: "Chargement en cours...",
    saving: "Sauvegarde des données...",
    error: "Une erreur s'est produite",
    success: "Opération réussie"
  }
};

export function useTooltip() {
  const getTooltip = useCallback((key: string, path?: string): string => {
    const keys = key.split('.');
    let value: any = tooltipContent;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return path ? `${path} - ${k}` : `Info: ${k}`;
      }
    }
    
    return typeof value === 'string' ? value : JSON.stringify(value);
  }, []);

  return { getTooltip };
}

export default useTooltip;