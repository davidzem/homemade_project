export const tokenTypes: { [key: string]: tokenType } = {
    ACCESS: 'access',
    REFRESH: 'refresh',
    RESET_PASSWORD: 'resetPassword',
    VERIFY_EMAIL: 'verifyEmail'
};

export type tokenType = 'access' | 'refresh' | 'resetPassword' | 'verifyEmail'