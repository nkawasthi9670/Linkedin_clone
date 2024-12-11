import Notification from "../models/notification.model.js"

export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate("relatedUser", "name username profilePicture")
            .populate("relatedPost", "content image")
            .sort({ createdAt: -1 })

        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getUserNotification controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const markNotificationAsRead = async (req, res) => {
    const notificationId = req.params.id;
    try {
        const notification = await Notification.findByIdAndUpdate(
            { _id: notificationId, recipient: req.user._id },
            { read: true },
            { new: true }
        )

        res.status(200).json(notification);
    } catch (error) {
        console.log("Error in markNotificationAsRead controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteNotification = async (req, res) => {
    const notificationId = req.params.id;
    try {
        await Notification.findByIdAndDelete({
            _id: notificationId,
            recipient: req.user._id
        })

        res.status(200).json({ message: "notification deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotification controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}