export interface Wish {
  // Identity
  id: string;
  slug: string;
  templateId: string;

  // Wish Details
  occasion:
    | "birthday"
    | "anniversary"
    | "wedding"
    | "new-year"
    | "christmas"
    | "eid"
    | "diwali"
    | "holi"
    | "graduation"
    | "promotion"
    | "friendship"
    | "thank-you"
    | "custom"
    | "valentine"; // Added valentine to match requested templates

  title: string;
  subtitle?: string;
  description?: string;

  // People
  recipient: {
    name: string;
    nickname?: string;
    relation?: string;
    avatar?: string;
  };

  sender: {
    name: string;
    avatar?: string;
    anonymous?: boolean;
  };

  // Content
  messages: string[];
  quote?: string;
  poem?: string;

  // Media
  coverImage: string;
  profileImage?: string;
  gallery?: string[];
  video?: string;
  voiceMessage?: string;
  music?: string;

  // Appearance
  theme: string;
  colors?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };

  font?: string;

  animation?: {
    confetti?: boolean;
    balloons?: boolean;
    fireworks?: boolean;
    floatingHearts?: boolean;
    snow?: boolean;
  };

  // Interactive Sections
  memories?: {
    title: string;
    image: string;
    description: string;
    date?: string;
  }[];

  timeline?: {
    title: string;
    date: string;
    description?: string;
  }[];

  // Gifts
  gifts?: {
    title: string;
    image?: string;
    link?: string;
    purchased?: boolean;
  }[];

  // Countdown
  countdown?: {
    enabled: boolean;
    targetDate: string;
  };

  // Visibility
  isPublic: boolean;
  isActive?: boolean;
  creatorEmail?: string;
  allowComments: boolean;
  allowReactions: boolean;

  // Analytics
  views: number;
  reactions: number;
  shares: number;

  // SEO
  tags?: string[];

  // Schedule
  publishAt?: string;

  // Dates
  createdAt: string;
  updatedAt: string;
}
