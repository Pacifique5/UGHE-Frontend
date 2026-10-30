export interface NavNode {
  id: number;
  label: string;
  url: string;
  open_in_new_tab: boolean;
  children: NavNode[];
}

export interface ActionLink {
  id: number;
  label: string;
  url: string;
  open_in_new_tab: boolean;
}

export interface Slide {
  id: number;
  media_type: "image" | "video";
  media_url: string;
  caption: string;
  button_label: string;
  button_url: string;
  button_color: string;
  button_text_color: string;
}

export interface Stat {
  id: number;
  display_value: string;
  description: string;
  count_to: number | null;
  count_suffix: string;
  count_duration_ms: number;
  use_grouping: boolean;
  background_color: string;
  text_color: string;
}

export interface LandingBlock {
  id: number;
  kind: "promo" | "feature" | "news" | "impact";
  title: string;
  body: string;
  button_label: string;
  button_url: string;
  image_url: string;
  background_color: string;
  overlay_color: string;
  text_color: string;
  button_color: string;
  button_text_color: string;
  group_key: string;
}

export interface NewsStory {
  id: number;
  title: string;
  url: string;
  image_url: string;
  category: string;
  category_url: string;
}

export interface FooterOffice {
  id: number;
  body: string;
}

export interface SocialLink {
  id: number;
  label: string;
  url: string;
}

export interface Section {
  id: number;
  title: string;
  stats: Stat[];
}

export interface SiteSettings {
  university_line: string;
  name_line: string;
  equity_line: string;
  logo_alt: string;
  logo_url: string;
  search_placeholder: string;
  show_search: boolean;
  action_background_color: string;
  action_text_color: string;
  footer_heading: string;
  footer_background_color: string;
  footer_text_color: string;
}

export interface Homepage {
  site: SiteSettings;
  action_links: ActionLink[];
  navigation: NavNode[];
  slides: Slide[];
  sections: Section[];
  blocks: LandingBlock[];
  stories: NewsStory[];
  offices: FooterOffice[];
  social_links: SocialLink[];
}

export interface AuthSession {
  token: string;
  username: string;
  is_staff: boolean;
}
