/* eslint-disable camelcase */
export interface UserProfile {
  avatar_hash: string;
  image_72: string;
  first_name: string;
  real_name: string;
  display_name: string;
  team: string;
  name: string;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
}

export interface Element2 {
  type: string;
  text: string;
}

export interface Element {
  type: string;
  elements: Element2[];
}

export interface Block {
  type: string;
  block_id: string;
  elements: Element[];
}

export interface Reply {
  user: string;
  ts: number;
}

export interface Edited {
  user: string;
  ts: string;
}

export interface Message {
  client_msg_id: string;
  type: string;
  text: string;
  user: string;
  ts: number;
  team: string;
  user_team: string;
  source_team: string;
  user_profile: UserProfile;
  blocks: Block[];
  thread_ts?: string;
  reply_count?: number;
  reply_users_count?: number;
  latest_reply: string;
  reply_users: string[];
  replies: Reply[];
  subscribed?: boolean;
  last_read: string;
  edited: Edited;
  parent_user_id: string;
}
