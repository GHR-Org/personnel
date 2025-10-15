import { MenuItemFormValues } from "@/schemas/MenuItem"

export const mockMenuItems: MenuItemFormValues[] = [
  {
    libelle: "Burger Classique",
    description: "Burger au bœuf avec fromage, laitue et tomate",
    type: "FastFood",
    ingredients: ["pain", "bœuf", "fromage", "laitue", "tomate", "sauce"],
    prix: 7.5,
    disponible: true,
    tags: ["halal", "populaire"],
    calories: 850,
    etablissement_id: 1,
    livrable: false
  },
  {
    libelle: "Salade César",
    description: "Salade fraîche avec poulet grillé, parmesan et croûtons",
    type: "FastFood",
    ingredients: ["laitue", "poulet", "parmesan", "croûtons", "sauce césar"],
    prix: 6.0,
    disponible: true,
    tags: ["léger", "sans gluten"],
    calories: 420,
     etablissement_id: 1,
    livrable: false
  },
  {
    libelle: "Tiramisu",
    description: "Dessert italien au café et mascarpone",
    type: "Dessert",
    ingredients: ["mascarpone", "café", "biscuit", "cacao"],
    prix: 4.5,
    disponible: true,
    tags: ["végétarien"],
    calories: 520,
     etablissement_id: 1,
    livrable: false
  },
  {

    libelle: "Jus d’orange frais",
    description: "Pur jus pressé à froid",

    type: "Boisson",
    ingredients: ["orange"],
    prix: 2.5,
    disponible: true,
    tags: ["bio", "vitaminé"],
    calories: 120,
     etablissement_id: 1,
    livrable: false
  }
]
