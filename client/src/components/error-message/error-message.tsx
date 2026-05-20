function ErrorMessage({ error }: { error: string | null }) {
    
    const errors: { [key: string]: string } = {
        USER_CREDS_IS_WRONG: 'Данный пользователь не найден.',
        PASSWORD_IS_WRONG: 'Неверный пароль.',
        CONTENT_TOO_LONG: 'Больше 255 символов не разрешается.',
        ATTACHMENTS_LIMIT: 'За один пост разрешается не более 6 вложений.'
    };

    if (!error || !(error in errors)) {
        return null;
    }

    return (
        <p className="error-message">{errors[error]}</p>
    );
}

export { ErrorMessage };