export const authRoles = {
    sa: ['SA', "GarmentShop"], // Only Super Admin has access
    admin: ['SA', 'ADMIN', "GarmentShop"], // Only SA & Admin has access
    editor: ['SA', 'ADMIN', 'EDITOR'], // Only SA & Admin & Editor has access
    guest: ['SA', 'ADMIN', 'EDITOR', 'GUEST'], // Everyone has access
}
