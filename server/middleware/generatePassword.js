import bcrypt from 'bcrypt';

const saltRounds = 12;

function generateSimplePassword(length = 8) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
}

export async function generateAndHashPassword() {
    const plainPassword = generateSimplePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    return { plainPassword, hashedPassword };
}