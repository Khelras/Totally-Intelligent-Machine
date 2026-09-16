export type StreakRow = {
    user_id: string;
    current_streak: number;
    best_streak: number;
    last_submission_date: string | null;
    last_channel_id: string | null;
    last_guild_id: string | null;
};

export type SubmissionRow = {
    id: number;
    user_id: string;
    channel_id: string;
    guild_id: string;
    submission_date: string;
    image_url: string | null;
    created_at: string;
};