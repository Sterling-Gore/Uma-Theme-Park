const pool = require("../database");

const updateNotificationStatus = async (req, res) => {
    try {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk.toString();
        });

        req.on('end', async () => {
            try {
                let requestBody = {};
                try {
                    requestBody = JSON.parse(data);
                } catch (parseError) {
                    return res.status(400).json({ error: "Invalid JSON format" });
                }

                const { notificationId, isCompleted } = requestBody;

                if (!notificationId) {
                    return res.status(400).json({ error: "Notification ID is required" });
                }

                if (isCompleted === undefined || isCompleted === null) {
                    return res.status(400).json({ error: "Completion status is required" });
                }

                const status = isCompleted === true || isCompleted === "true" || isCompleted === 1 ? true : false;

                const [result] = await pool.query(
                    "UPDATE merchandise_notification SET isCompleted = ? WHERE merchandise_notification_id = ?",
                    [status, notificationId]
                );

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "Notification not found" });
                }

                return res.status(200).json({
                    message: "Notification status updated successfully",
                    notificationId,
                    isCompleted: status
                });
            } catch (error) {
                console.error("Error updating notification status:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    } catch (error) {
        console.error("Error handling request:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = updateNotificationStatus;