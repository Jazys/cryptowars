type Translations = {
  [key: string]: {
    title: string;
    objective: {
      title: string;
      description: string;
    };
    rules: {
      title: string;
      items: string[];
    };
    rewards: {
      title: string;
      description: string;
    };
    buttons: {
      back: string;
      letsGo: string;
    };
    upcomingFeatures: {
      title: string;
      items: string[];
    };
  };
};

export const translations: Translations = {
  fr: {
    title: "Comment jouer à Crypto Battles",
    objective: {
      title: "🎯 Objectif",
      description: "Placez vos drapeaux stratégiquement pour dominer les cryptomonnaies !"
    },
    rules: {
      title: "📜 Règles",
      items: [
        "Chaque crypto a un nombre limité d'emplacements de drapeaux",
        "Placer un drapeau coûte une petite somme de tokens natifs (0.01)",
        "Le joueur avec le plus de drapeaux sur la map gagne le prix !",
        "Dominez le plus de cryptos pour gagner le prix !"
      ]
    },
    rewards: {
      title: "💰 Récompenses",
      description: "Le gagnant peut réclamer le prix accumulé dans le contrat !"
    },
    buttons: {
      back: "Retour",
      letsGo: "C'est parti !"
    },
    upcomingFeatures: {
      title: "Fonctionnalités à venir",
      items: [
        "Création et gestion de guildes",
        "Rejoindre et collaborer avec des guildes",
        "Nouveaux défis et récompenses"
      ]
    }
  },
  en: {
    title: "How to Play Crypto Battles",
    objective: {
      title: "🎯 Objective",
      description: "Place your flags strategically to dominate cryptocurrencies!"
    },
    rules: {
      title: "📜 Rules",
      items: [
        "Each crypto has a limited number of flag slots",
        "Placing a flag costs a small amount of native tokens",
        "The player with the most flags on map wins the prize!",
        "Dominate the most cryptos to win the prize!"
      ]
    },
    rewards: {
      title: "💰 Rewards",
      description: "The winner can claim the accumulated prize in the contract!"
    },
    buttons: {
      back: "Back",
      letsGo: "Let's Go!"
    },
    upcomingFeatures: {
      title: "Upcoming Features",
      items: [
        "Guild creation and management",
        "Join and collaborate with guilds",
        "New challenges and rewards"
      ]
    }
  }
}; 