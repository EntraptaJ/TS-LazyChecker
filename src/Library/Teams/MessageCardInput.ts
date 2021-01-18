// src/Library/Teams/MessageCardInput.ts
interface MessageCardFact {
  name: string;
  value: string | number;
}

interface MessageCardSection {
  activityTitle: string;
  text: string;

  facts: MessageCardFact[];
}

export interface MessageCard {
  themeColor: string;
  title: string;
  text: string;

  sections?: MessageCardSection[];
}
