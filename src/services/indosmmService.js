const axios = require('axios');
require('dotenv').config();

const INDOSMM_API_URL = process.env.INDOSMM_API_URL || 'https://indosmm.id/api/v2';

class IndosmmService {
    static async getServices(customApiKey = null) {
        const apiKey = customApiKey || process.env.INDOSMM_API_KEY;
        try {
            const response = await axios.post(INDOSMM_API_URL, new URLSearchParams({
                api_key: apiKey,
                action: 'services'
            }));
            return response.data;
        } catch (error) {
            console.error('[INDOSMM API ERROR]:', error.message);
            // Fallback Data jika API key belum terpasang/terjadi kegagalan
            return [
                { service: 101, name: '[API] Instagram Followers Indonesia Real 30 Hari', category: 'Instagram Followers', rate: '15000', min: '100', max: '10000', status: 'available' },
                { service: 102, name: '[API] TikTok Likes Instant High Quality', category: 'TikTok Likes', rate: '2500', min: '50', max: '50000', status: 'available' },
                { service: 103, name: '[API] YouTube Views Retention 100% Non-Drop', category: 'YouTube Views', rate: '32000', min: '500', max: '100000', status: 'available' },
                { service: 104, name: '[API] Telegram Channel Members Fast Speed', category: 'Telegram', rate: '12000', min: '200', max: '25000', status: 'available' }
            ];
        }
    }

    static async placeOrder(serviceId, target, quantity, customApiKey = null) {
        const apiKey = customApiKey || process.env.INDOSMM_API_KEY;
        try {
            const response = await axios.post(INDOSMM_API_URL, new URLSearchParams({
                api_key: apiKey,
                action: 'add',
                service: serviceId,
                target: target,
                quantity: quantity
            }));
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = IndosmmService;
