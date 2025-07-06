import { json } from '@sveltejs/kit';
import db from '$lib/db/connect/main';

export async function GET() {
    try {
        const updates = await db.collection('updates').getList(1, 50, {
            sort: '-created',
        });

        return json({
            success: true,
            data: updates.items
        });
    } catch (error) {
        console.error('Error fetching updates:', error);
        return json({
            success: false,
            error: 'Failed to fetch updates'
        }, { status: 500 });
    }
}
