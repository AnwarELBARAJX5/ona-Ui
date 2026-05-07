# ONA. - Point of Sale (POS) & Kitchen Display System

ONA est une application moderne de point de vente (POS) conçue pour être hybride, rapide et réactive. Elle s'adapte parfaitement à deux environnements distincts : la restauration rapide (Restaurant) et la vente au détail (Market).

## Fonctionnalités Principales

*   **Mode Hybride (Restaurant / Market) :** Un switch permet de basculer la logique métier. Les commandes "Restaurant" partent en préparation, tandis que les achats "Market" sont encaissés directement.
*   **Terminal d'Encaissement Avancé :**
    *   Gestion du panier en temps réel (quantités, suppression, vidage).
    *   Paiement multi-méthodes : Carte Bancaire, Espèces (avec calcul automatique du rendu de monnaie et boutons de billets rapides) et Paiement Divisé (Espèces + Carte).
*   **Système d'Affichage en Cuisine (KDS) :** Un écran dédié aux cuisiniers affiche les bons de commande en temps réel avec un bouton pour les marquer comme "Prêts".
*   **Programme de Fidélité :** Création et recherche de clients, accumulation de points à chaque achat, et utilisation de réductions (ex: 200 pts = -5$).
*   **Historique et Statistiques :** Suivi du chiffre d'affaires journalier, nombre de commandes, et possibilité de ré-afficher les tickets de caisse détaillés des transactions passées.
*   **Sauvegarde Locale (Offline-first) :** L'état de l'application (panier, clients, commandes) est sauvegardé dans le `localStorage` du navigateur pour prévenir toute perte de données en cas d'actualisation.
*   **Expérience Utilisateur (UX) :** Interface soignée avec animations (shadcn/ui), Mode Sombre/Clair, et design responsive.

## Technologies Utilisées

**Front-end :**
*   [React](https://reactjs.org/) (via Vite)
*   [TypeScript](https://www.typescriptlang.org/) pour un typage strict et sécurisé.
*   [Tailwind CSS](https://tailwindcss.com/) pour le style utilitaire.
*   [shadcn/ui](https://ui.shadcn.com/) pour les composants d'interface accessibles.
*   [Lucide React](https://lucide.dev/) pour l'iconographie.

**Back-end prévu (en cours d'intégration) :**
*   FastAPI (Python)
*   PostgreSQL
*   Architecture orientée Plugins (NocoBase)

## Installation et Démarrage (Local)

1.  **Cloner le dépôt :**
    ```bash
    git clone <ton-url-git>
    cd <nom-du-dossier>
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Lancer le serveur de développement :**
    ```bash
    npm run dev
    ```

4.  Ouvrez votre navigateur sur `http://localhost:5173` (ou le port indiqué dans la console).

## 💡 Architecture du Projet

L'application est centralisée autour de `App.tsx` qui gère les états globaux (Panier, Historique, KDS). Les composants sont découpés pour assurer une bonne maintenabilité :
*   `Cart.tsx` : Logique d'encaissement et modales de paiement.
*   `ProductGrid.tsx` : Affichage et filtrage du catalogue.
*   `KitchenDisplay.tsx` : KDS pour la gestion des commandes en cours.
*   `OrderHistory.tsx` : Tableau de bord et statistiques des ventes.