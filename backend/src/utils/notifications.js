export async function createNotificationForAllUsers(db, type, title, message, link = null) {
  try {
    const usersResult = await db.query('SELECT id FROM users WHERE is_active = true');
    const users = usersResult.data || [];
    
    const now = new Date().toISOString();
    for (const user of users) {
      await db.query(`
        INSERT INTO user_notifications (user_id, type, title, message, link, created_at, is_read)
        VALUES ($1, $2, $3, $4, $5, $6, false)
      `, [user.id, type, title, message, link, now]);
    }
    
    console.log(`Created ${type} notification for ${users.length} users`);
  } catch (error) {
    console.error('Error creating notifications:', error);
  }
}

export async function deleteNotificationsByTitle(db, type, title) {
  try {
    await db.query(`
      DELETE FROM user_notifications 
      WHERE type = $1 AND message LIKE $2
    `, [type, `%${title}%`]);
    console.log(`Deleted ${type} notifications containing title: ${title}`);
  } catch (error) {
    console.error('Error deleting notifications:', error);
  }
}
