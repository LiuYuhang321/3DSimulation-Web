const tokenName = 'CF-CIM-TOEKN';
export const getToken = () => {
    return localStorage.getItem(tokenName);
}

export const saveToken = (token:string) => {
    return localStorage.setItem(tokenName, token);
}
