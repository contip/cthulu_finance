export const jwtConstants = {
    SECRET: 'secretKey',
    EXPIRY: '12h',
};

export const userNameConstraints = {
    MAX_LENGTH: 20,
    LEGAL_CHARS: /^\w+$/,  // allows aA-zZ, 0-9, and _
}

export const HASH_SALT = 10;