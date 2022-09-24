export const notificationListTypes = [
    { type: 'monthly-payslip', channels: ['EmailChannel'] },
    { type: 'leave-balance-reminder', channels: ['UIChannel'] },
    { type: 'happy-birthday', channels: ['EmailChannel', 'UIChannel'] },
    { type: 'emergency-meeting', channels: ['WhatsappChannel'] }
]